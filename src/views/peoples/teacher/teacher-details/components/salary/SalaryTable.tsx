import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SalaryRow } from '../../data/teacherSalary.data';

type SortKey = 'payrollId' | 'salaryFor' | 'date';

interface SortState {
  key: SortKey;
  direction: 'asc' | 'desc';
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "Apr - 2024" → a comparable month ordinal. */
const salaryForValue = (value: string) => {
  const [month = '', year = '0'] = value.split(' - ');
  return Number(year) * 12 + MONTHS.indexOf(month);
};

/** "04 May 2024" → a comparable day ordinal. */
const dateValue = (value: string) => {
  const [day = '0', month = '', year = '0'] = value.split(' ');
  return Number(year) * 372 + MONTHS.indexOf(month) * 31 + Number(day);
};

const compare = (key: SortKey, a: SalaryRow, b: SalaryRow) => {
  switch (key) {
    case 'payrollId':
      return Number(a.payrollId) - Number(b.payrollId);
    case 'salaryFor':
      return salaryForValue(a.salaryFor) - salaryForValue(b.salaryFor);
    case 'date':
    default:
      return dateValue(a.date) - dateValue(b.date);
  }
};

export interface SalaryTableProps {
  rows: SalaryRow[];
  onViewPayslip: (row: SalaryRow) => void;
}

const SalaryTable = ({ rows, onViewPayslip }: SalaryTableProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => compare(sort.key, a, b) * factor);
  }, [rows, sort]);

  const allSelected = rows.length > 0 && selected.length === rows.length;

  const toggleSort = (key: SortKey) => {
    setSort((current) =>
      current && current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  };

  const sortClass = (key: SortKey) =>
    sort && sort.key === key
      ? sort.direction === 'asc'
        ? 'sorting_asc'
        : 'sorting_desc'
      : 'sorting';

  const ariaSort = (key: SortKey): 'ascending' | 'descending' | 'none' =>
    sort && sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';

  const headerProps = (key: SortKey) => ({
    className: sortClass(key),
    'aria-sort': ariaSort(key),
    tabIndex: 0,
    onClick: () => toggleSort(key),
    onKeyDown: (event: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSort(key);
      }
    },
  });

  return (
    <div className=" custom-datatable-filter table-responsive">
      <table className="table datatable dataTable">
        <thead className="thead-light">
          <tr>
            <th className="no-sort">
              <label className="checkboxs">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? [] : rows.map((row) => row.id))}
                />
                <span className="checkmarks" />
              </label>
            </th>
            <th {...headerProps('payrollId')}>ID</th>
            <th {...headerProps('salaryFor')}>Salary For</th>
            <th {...headerProps('date')}>Date</th>
            <th className="no-sort">Payment Method</th>
            <th className="no-sort">Net Salary</th>
            <th className="no-sort" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id}>
              <td>
                <label className="checkboxs">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    aria-label={`Select payslip ${row.payrollId}`}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(row.id)
                          ? current.filter((id) => id !== row.id)
                          : [...current, row.id],
                      )
                    }
                  />
                  <span className="checkmarks" />
                </label>
              </td>
              <td>
                <Link
                  to="#"
                  className="link-primary"
                  onClick={(event) => {
                    event.preventDefault();
                    onViewPayslip(row);
                  }}
                >
                  {row.payrollId}
                </Link>
              </td>
              <td>{row.salaryFor}</td>
              <td>{row.date}</td>
              <td>{row.method}</td>
              <td>{row.netSalary}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-light add-fee"
                  onClick={() => onViewPayslip(row)}
                >
                  View Payslip
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;
