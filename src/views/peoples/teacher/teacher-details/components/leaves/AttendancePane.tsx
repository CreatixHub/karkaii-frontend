import { useEffect, useMemo, useState } from 'react';
import type { AttendanceRow } from '../../data/teacherLeaves.data';
import {
  attendanceLegend,
  attendanceMonths,
  attendanceRanges,
  attendanceRows,
  attendanceTiles,
  attendanceUpdatedOn,
  attendanceYears,
  markLabel,
} from '../../data/teacherLeaves.data';

type Menu = 'year' | 'range' | 'export' | null;

interface SortState {
  /** 0 is the "Date | Month" column; 1..n index into the shown months. */
  column: number;
  direction: 'asc' | 'desc';
}

/** The last month that carries at least one recorded mark — Feb in the template. */
const lastRecordedMonth = attendanceMonths.reduce(
  (last, _month, index) =>
    attendanceRows.some((row) => row.marks[index] !== null) ? index : last,
  0,
);

const sortValue = (row: AttendanceRow, monthIndex: number) => {
  const mark = row.marks[monthIndex];
  return mark ? markLabel[mark] : '';
};

export interface AttendancePaneProps {
  onToast: (message: string) => void;
}

const AttendancePane = ({ onToast }: AttendancePaneProps) => {
  const [year, setYear] = useState(attendanceYears[0]);
  const [range, setRange] = useState(attendanceRanges[0]);
  const [menu, setMenu] = useState<Menu>(null);
  const [updatedOn, setUpdatedOn] = useState(attendanceUpdatedOn);
  const [sort, setSort] = useState<SortState>({ column: 0, direction: 'asc' });

  // Only the academic year the template ships figures for has records.
  const hasRecords = year === attendanceYears[0];

  // Close an open dropdown on an outside click, as Bootstrap's own does.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menu]);

  const months = useMemo(
    () =>
      range === 'This Year'
        ? attendanceMonths.map((month, index) => ({ month, index }))
        : [{ month: attendanceMonths[lastRecordedMonth], index: lastRecordedMonth }],
    [range],
  );

  const rows = useMemo(() => {
    if (!hasRecords) return [];

    // "This Week" keeps the first seven days of the month it narrowed to.
    const scoped = range === 'This Week' ? attendanceRows.slice(0, 7) : attendanceRows;
    const factor = sort.direction === 'asc' ? 1 : -1;

    return [...scoped].sort((a, b) => {
      if (sort.column === 0) return (Number(a.day) - Number(b.day)) * factor;

      const monthIndex = months[sort.column - 1]?.index ?? 0;
      const compared = sortValue(a, monthIndex).localeCompare(sortValue(b, monthIndex));
      return (compared || Number(a.day) - Number(b.day)) * factor;
    });
  }, [hasRecords, range, sort, months]);

  const toggleSort = (column: number) => {
    setSort((current) =>
      current.column === column
        ? { column, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' },
    );
  };

  const sortClass = (column: number) =>
    sort.column === column ? (sort.direction === 'asc' ? 'sorting_asc' : 'sorting_desc') : 'sorting';

  const ariaSort = (column: number): 'ascending' | 'descending' | 'none' =>
    sort.column === column ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';

  const refresh = () => {
    setUpdatedOn(
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    );
    onToast('Attendance refreshed');
  };

  return (
    <>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
          <h4 className="mb-3">Attendance</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div className="d-flex align-items-center flex-wrap me-3">
              <p className="text-dark mb-3 me-2">Last Updated on : {updatedOn} </p>
              <button
                type="button"
                className="btn btn-primary btn-icon btn-sm rounded-circle flex-shrink-0 d-inline-flex align-items-center justify-content-center p-0 mb-3"
                title="Refresh attendance"
                aria-label="Refresh attendance"
                onClick={refresh}
              >
                <i className="ti ti-refresh-dot" />
              </button>
            </div>
            <div className="dropdown mb-3">
              <button
                type="button"
                className="btn btn-outline-light bg-white dropdown-toggle"
                aria-expanded={menu === 'year'}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setMenu(menu === 'year' ? null : 'year')}
              >
                <i className="ti ti-calendar-due me-2" />
                Year : {year}
              </button>
              <ul className={`dropdown-menu p-3${menu === 'year' ? ' show' : ''}`}>
                {attendanceYears.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      className={`dropdown-item rounded-1${year === option ? ' active' : ''}`}
                      onClick={() => {
                        setYear(option);
                        setMenu(null);
                      }}
                    >
                      Year : {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="card-body pb-1">
          <div className="row">
            {attendanceTiles.map((tile) => (
              <div className="col-md-6 col-xxl-3 d-flex" key={tile.id}>
                <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                  <span
                    className={`avatar avatar-lg ${tile.tint} rounded me-2 flex-shrink-0 ${tile.text}`}
                  >
                    <i className={`${tile.icon} fs-24`} />
                  </span>
                  <div className="ms-2">
                    <p className="mb-1">{tile.label}</p>
                    <h5>{hasRecords ? tile.value : '0'}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
          <h4 className="mb-3">Leave &amp; Attendance</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div className="dropdown mb-3 me-3">
              <button
                type="button"
                className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                aria-expanded={menu === 'range'}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setMenu(menu === 'range' ? null : 'range')}
              >
                <i className="ti ti-calendar-due me-2" />
                {range}
              </button>
              <ul className={`dropdown-menu p-3${menu === 'range' ? ' show' : ''}`}>
                {attendanceRanges.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      className={`dropdown-item rounded-1${range === option ? ' active' : ''}`}
                      onClick={() => {
                        setRange(option);
                        setSort({ column: 0, direction: 'asc' });
                        setMenu(null);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dropdown mb-3">
              <button
                type="button"
                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                aria-expanded={menu === 'export'}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setMenu(menu === 'export' ? null : 'export')}
              >
                <i className="ti ti-file-export me-2" />
                Export
              </button>
              <ul className={`dropdown-menu  dropdown-menu-end p-3${menu === 'export' ? ' show' : ''}`}>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      setMenu(null);
                      onToast('Export as PDF started');
                    }}
                  >
                    <i className="ti ti-file-type-pdf me-2" />
                    Export as PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      setMenu(null);
                      onToast('Export as Excel started');
                    }}
                  >
                    <i className="ti ti-file-type-xls me-2" />
                    Export as Excel{' '}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-body p-0 py-3">
          <div className="px-3">
            <div className="d-flex align-items-center flex-wrap">
              {attendanceLegend.map((item) => (
                <div
                  className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3"
                  key={item.id}
                >
                  <span className={`avatar avatar-sm ${item.tint} rounded me-2 flex-shrink-0 `}>
                    <i className={item.icon} />
                  </span>
                  <p className="text-dark">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance List */}
          <div className="custom-datatable-filter table-responsive">
            <table className="table datatable dataTable">
              <thead className="thead-light">
                <tr>
                  <th
                    className={sortClass(0)}
                    aria-sort={ariaSort(0)}
                    tabIndex={0}
                    onClick={() => toggleSort(0)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleSort(0);
                      }
                    }}
                  >
                    Date <span className="divide-bar"> | </span> Month
                  </th>
                  {months.map((month, index) => (
                    <th
                      key={month.month}
                      className={sortClass(index + 1)}
                      aria-sort={ariaSort(index + 1)}
                      tabIndex={0}
                      onClick={() => toggleSort(index + 1)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          toggleSort(index + 1);
                        }
                      }}
                    >
                      {month.month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    {months.map((month) =>
                      row.blank ? (
                        <td key={month.month} />
                      ) : (
                        <td key={month.month}>
                          {row.marks[month.index] ? (
                            <span
                              className={`attendance-range bg-${row.marks[month.index]}`}
                              title={markLabel[row.marks[month.index]!]}
                            />
                          ) : (
                            <span />
                          )}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="text-center py-4" colSpan={months.length + 1}>
                      No attendance recorded for {year}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          {/* /Attendance List */}
        </div>
      </div>
    </>
  );
};

export default AttendancePane;
