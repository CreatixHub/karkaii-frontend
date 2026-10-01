import { Fragment } from 'react';
import type { AttendanceRecord } from '../data/attendanceRegister.data';
import { pagerButtons, rowsPerPageOptions } from '../data/attendanceRegister.data';
import AttendanceHeatmap from './AttendanceHeatmap';

export type SortKey = 'name' | 'status' | 'pct';
export type SortDir = 'asc' | 'desc';

export interface AttendanceRegisterTableProps {
  records: AttendanceRecord[];
  gridSearch: string;
  onGridSearch: (value: string) => void;
  dense: boolean;
  onToggleDense: () => void;
  onColumns: () => void;
  onExport: () => void;
  sortKey: SortKey | null;
  sortDir: SortDir | null;
  onSort: (key: SortKey) => void;
  selected: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  onMark: (id: number) => void;
  onMore: (id: number) => void;
  onOpenNotify: (id: number) => void;
  onOpenLeave: (id: number) => void;
  onDrawerAction: (kind: 'mark' | 'export' | 'leave' | 'notify' | 'doc', id: number) => void;
  onPage: (label: string) => void;
  rowsPerPage: string;
  onRowsPerPage: (value: string) => void;
}

const DASH = '—';

const AttendanceRegisterTable = ({
  records,
  gridSearch,
  onGridSearch,
  dense,
  onToggleDense,
  onColumns,
  onExport,
  sortKey,
  sortDir,
  onSort,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  expandedId,
  onToggleExpand,
  onMark,
  onMore,
  onOpenNotify,
  onOpenLeave,
  onDrawerAction,
  onPage,
  rowsPerPage,
  onRowsPerPage,
}: AttendanceRegisterTableProps) => {
  const allChecked = selected.length > 0 && selected.length === records.length;
  const someChecked = selected.length > 0 && selected.length < records.length;

  const sortClass = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? ' is-asc' : ' is-desc') : '');

  return (
    <>
      <div className="section-bar">
        <div>
          <span className="eyebrow-text">
            <i className="ti ti-table" />
            Workspace
          </span>
          <h3 className="section-bar-title">Attendance Register</h3>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <div className="search-field search-field-sm">
            <i className="ti ti-search" aria-hidden="true" />
            <input
              type="search"
              id="attGridSearch"
              placeholder="Filter rows…"
              aria-label="Filter register rows"
              value={gridSearch}
              onChange={(event) => onGridSearch(event.target.value)}
            />
          </div>
          <button type="button" className="toolbar-button toolbar-button-sm" onClick={onToggleDense}>
            <i className="ti ti-baseline-density-medium" />
            Density
          </button>
          <button type="button" className="toolbar-button toolbar-button-sm" onClick={onColumns}>
            <i className="ti ti-columns-3" />
            Columns
          </button>
          <button type="button" className="toolbar-button toolbar-button-sm" onClick={onExport}>
            <i className="ti ti-download" />
            Export
          </button>
        </div>
      </div>

      <section className="record-grid-wrap mb-3">
        <div className="record-grid-scroll">
          <table className={`record-grid${dense ? ' is-dense' : ''}`} id="attGrid">
            <caption className="visually-hidden">
              Student attendance register for 22 July 2025 with status, timings and actions
            </caption>
            <thead>
              <tr>
                <th scope="col" className="is-pin record-col-check">
                  <label className="row-check">
                    <input
                      type="checkbox"
                      id="attAll"
                      aria-label="Select all students"
                      checked={allChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = someChecked;
                      }}
                      onChange={onToggleSelectAll}
                    />
                    <span />
                  </label>
                </th>
                <th scope="col" className="is-pin record-col-student">
                  <button type="button" className={`column-sort${sortClass('name')}`} onClick={() => onSort('name')}>
                    Student
                    <i className="ti ti-arrows-sort" />
                  </button>
                  <span className="column-resize" aria-hidden="true" />
                </th>
                <th scope="col">
                  Admission No
                  <span className="column-resize" aria-hidden="true" />
                </th>
                <th scope="col" className="text-end">
                  Roll No
                </th>
                <th scope="col">Class</th>
                <th scope="col">Section</th>
                <th scope="col">
                  <button type="button" className={`column-sort${sortClass('status')}`} onClick={() => onSort('status')}>
                    Status
                    <i className="ti ti-arrows-sort" />
                  </button>
                </th>
                <th scope="col">Check-in</th>
                <th scope="col">Check-out</th>
                <th scope="col" className="text-end">
                  Late (min)
                </th>
                <th scope="col">Leave</th>
                <th scope="col" className="text-end">
                  <button type="button" className={`column-sort${sortClass('pct')}`} onClick={() => onSort('pct')}>
                    Attendance %
                    <i className="ti ti-arrows-sort" />
                  </button>
                </th>
                <th scope="col">
                  Remarks
                  <span className="column-resize" aria-hidden="true" />
                </th>
                <th scope="col" className="is-pin-end record-col-actions">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody id="attBody">
              {records.map((record) => {
                const expanded = expandedId === record.id;
                return (
                  <Fragment key={record.id}>
                    <tr className="record-row" data-att-status={record.statusAttr}>
                      <td className="is-pin record-col-check">
                        <label className="row-check">
                          <input
                            type="checkbox"
                            className="record-row-check"
                            aria-label={`Select ${record.name}`}
                            checked={selected.includes(record.id)}
                            onChange={() => onToggleSelect(record.id)}
                          />
                          <span />
                        </label>
                      </td>
                      <td className="is-pin record-col-student">
                        <button
                          type="button"
                          className="row-expander"
                          aria-expanded={expanded}
                          aria-controls={`attX${record.id}`}
                          aria-label={`Expand ${record.name}`}
                          onClick={() => onToggleExpand(record.id)}
                        >
                          <i className="ti ti-chevron-right" />
                        </button>
                        <span className="student-cell">
                          <img src={record.img} alt="" />
                          <span>
                            <b>{record.name}</b>
                            <em>{record.houseLine}</em>
                          </span>
                        </span>
                      </td>
                      <td data-lbl="Admission No">{record.admissionNo}</td>
                      <td data-lbl="Roll No" className="text-end">
                        {record.rollNo}
                      </td>
                      <td data-lbl="Class">{record.klass}</td>
                      <td data-lbl="Section">{record.section}</td>
                      <td data-lbl="Status">
                        <span className={`status-chip is-${record.status.variant}`}>
                          <i className={record.status.icon} />
                          {record.status.label}
                        </span>
                      </td>
                      <td data-lbl="Check-in" className={record.checkIn ? undefined : 'muted-text'}>
                        {record.checkIn ? (
                          <span className="time-cell">
                            {record.checkIn.time}
                            <em>{record.checkIn.note}</em>
                          </span>
                        ) : (
                          DASH
                        )}
                      </td>
                      <td data-lbl="Check-out" className={record.checkOut ? undefined : 'muted-text'}>
                        {record.checkOut ? (
                          <span className="time-cell">
                            {record.checkOut.time}
                            <em>{record.checkOut.note}</em>
                          </span>
                        ) : (
                          DASH
                        )}
                      </td>
                      <td data-lbl="Late (min)" className="text-end muted-text">
                        {record.lateMin ? <b className="warning-note">{record.lateMin}</b> : DASH}
                      </td>
                      <td data-lbl="Leave" className={record.leave ? undefined : 'muted-text'}>
                        {record.leave ? (
                          <span className={`status-chip is-${record.leave.variant}`}>{record.leave.label}</span>
                        ) : (
                          DASH
                        )}
                      </td>
                      <td data-lbl="Attendance %" className="text-end">
                        <span className={`attendance-percent is-${record.pct.variant}`}>{record.pct.value}</span>
                      </td>
                      <td data-lbl="Remarks">
                        <span className={`remark-note${record.remark.warning ? ' warning-note' : ''}`}>
                          {record.remark.text}
                        </span>
                      </td>
                      <td className="is-pin-end record-col-actions">
                        <div className="record-row-actions">
                          <button
                            type="button"
                            className="toolbar-icon-button"
                            aria-label="Change status"
                            title="Change status"
                            onClick={() => onMark(record.id)}
                          >
                            <i className="ti ti-checkbox" />
                          </button>
                          {record.status.variant === 'leave' ? (
                            <button
                              type="button"
                              className="toolbar-icon-button"
                              aria-label="Leave details"
                              title="Leave details"
                              onClick={() => onOpenLeave(record.id)}
                            >
                              <i className="ti ti-calendar-off" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="toolbar-icon-button"
                              aria-label="Notify guardian"
                              title="Notify guardian"
                              onClick={() => onOpenNotify(record.id)}
                            >
                              <i className="ti ti-message" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="toolbar-icon-button"
                            aria-label="More actions"
                            title="More"
                            onClick={() => onMore(record.id)}
                          >
                            <i className="ti ti-dots-vertical" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="detail-drawer-row" id={`attX${record.id}`} hidden={!expanded}>
                      <td colSpan={14}>
                        {expanded ? (
                          <div className="row g-4 detail-drawer">
                            <div className="col-lg-3">
                              <div className="detail-drawer-id">
                                <img src={record.img} alt={record.name} />
                                <b>{record.name}</b>
                                <span>
                                  {record.klass}-{record.section} · Roll {record.rollNo}
                                </span>
                                <div className="d-flex flex-wrap gap-1 justify-content-center mt-2">
                                  <span className={`status-chip is-${record.status.variant === 'half' ? 'present' : record.status.variant}`}>
                                    {record.detail.ytdBadge}
                                  </span>
                                  <span className="status-chip is-muted">{record.detail.houseBadge}</span>
                                </div>
                              </div>
                              <h4 className="detail-drawer-heading mt-3 fs-15 fw-medium">
                                <i className="ti ti-user-heart" />
                                Guardian
                              </h4>
                              <div className="detail-drawer-line">
                                <img src={record.detail.guardian.img} alt="" />
                                <span>
                                  <b>{record.detail.guardian.name}</b>
                                  <em>
                                    {record.detail.guardian.relation} · {record.detail.guardian.phone}
                                  </em>
                                </span>
                                <button
                                  type="button"
                                  className="toolbar-icon-button"
                                  aria-label="Message guardian"
                                  onClick={() => onDrawerAction('notify', record.id)}
                                >
                                  <i className="ti ti-message" />
                                </button>
                              </div>
                              <h5 className="detail-drawer-heading mt-3 fs-15">
                                <i className={record.detail.secondaryIcon} />
                                {record.detail.secondaryHeading}
                              </h5>
                              <div className="detail-drawer-line">
                                <span className={`detail-drawer-icon is-${record.detail.secondary.variant}`}>
                                  <i className={record.detail.secondary.icon} />
                                </span>
                                <span>
                                  <b>{record.detail.secondary.title}</b>
                                  <em>{record.detail.secondary.subtitle}</em>
                                </span>
                              </div>
                            </div>

                            <div className="col-lg-5">
                              <h6 className="detail-drawer-heading">
                                <i className="ti ti-calendar-stats" />
                                Monthly Attendance
                              </h6>
                              <AttendanceHeatmap
                                heatKey={record.detail.heatKey}
                                ariaLabel="Attendance heatmap for the last 30 days"
                              />
                              <div className="attendance-heatmap-legend">
                                <span>Less</span>
                                <i className="l1" />
                                <i className="l2" />
                                <i className="l3" />
                                <i className="l4" />
                                <span>More</span>
                                <i className="is-absent ms-2" />
                                <span>Absent</span>
                              </div>
                              <h6 className="detail-drawer-heading mt-3">
                                <i className="ti ti-history" />
                                Attendance History
                              </h6>
                              <div className="row g-2">
                                {record.detail.stats.map((stat) => (
                                  <div className="col-3" key={stat.label}>
                                    <div className={`stat-fact is-${stat.variant}`}>
                                      <b>{stat.count}</b>
                                      <span>{stat.label}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <h6 className="detail-drawer-heading">
                                <i className="ti ti-clock-exclamation" />
                                {record.detail.recordsHeading}
                              </h6>
                              <div className="detail-drawer-list">
                                {record.detail.records.map((line) => (
                                  <div className="detail-drawer-line" key={line.title}>
                                    <span className={`detail-drawer-icon is-${line.variant}`}>
                                      <i className={line.icon} />
                                    </span>
                                    <span>
                                      <b>{line.title}</b>
                                      <em>{line.subtitle}</em>
                                    </span>
                                    {line.hasDoc ? (
                                      <button
                                        type="button"
                                        className="toolbar-icon-button"
                                        aria-label="View document"
                                        onClick={() => onDrawerAction('doc', record.id)}
                                      >
                                        <i className="ti ti-paperclip" />
                                      </button>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                              <h6 className="detail-drawer-heading mt-3">
                                <i className="ti ti-message-star" />
                                Teacher Remarks
                              </h6>
                              <div className="detail-drawer-list">
                                {record.detail.remarks.map((remark) => (
                                  <div className="detail-drawer-line" key={remark.name}>
                                    {remark.img ? (
                                      <img src={remark.img} alt="" />
                                    ) : (
                                      <span className={`detail-drawer-icon is-${remark.variant}`}>
                                        <i className={remark.icon} />
                                      </span>
                                    )}
                                    <span>
                                      <b>{remark.name}</b>
                                      <em>{remark.note}</em>
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="d-flex flex-wrap gap-2 mt-3">
                                {record.detail.actions.map((action) => (
                                  <button
                                    type="button"
                                    className="toolbar-button toolbar-button-xs"
                                    key={action.label}
                                    onClick={() => onDrawerAction(action.kind, record.id)}
                                  >
                                    <i className={action.icon} />
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pager-bar">
          <span className="sub-text">
            Showing <b>1–5</b> of <b>1,329</b> students
          </span>
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className="pager-page"
              aria-label="Previous page"
              disabled
              onClick={() => onPage('prev')}
            >
              <i className="ti ti-chevron-left" />
            </button>
            {pagerButtons.map((page) => (
              <span key={page.label} style={{ display: 'contents' }}>
                {page.gapBefore ? <span className="pager-gap">…</span> : null}
                <button
                  type="button"
                  className={`pager-page${page.active ? ' is-on' : ''}`}
                  aria-current={page.active ? 'page' : undefined}
                  onClick={() => onPage(page.label)}
                >
                  {page.label}
                </button>
              </span>
            ))}
            <button type="button" className="pager-page" aria-label="Next page" onClick={() => onPage('next')}>
              <i className="ti ti-chevron-right" />
            </button>
          </div>
          <label className="select-field select-field-sm">
            <span>Rows</span>
            <select aria-label="Rows per page" value={rowsPerPage} onChange={(event) => onRowsPerPage(event.target.value)}>
              {rowsPerPageOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
    </>
  );
};

export default AttendanceRegisterTable;
