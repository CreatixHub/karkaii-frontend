import { useEffect, useMemo, useState } from 'react';
import type { Branch } from '../data/centralDashboard.data';
import {
  ROWS_PER_PAGE_OPTIONS,
  STATUS_BADGE,
  STATUS_FILTER_OPTIONS,
} from '../data/centralDashboard.data';

export interface BranchTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

const BranchTable = ({ branches, onEdit, onDelete }: BranchTableProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(STATUS_FILTER_OPTIONS[0]);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesSearch =
        !needle ||
        branch.name.toLowerCase().includes(needle) ||
        branch.revenue.toLowerCase().includes(needle) ||
        branch.status.toLowerCase().includes(needle);

      const matchesStatus = status === 'All Status' || branch.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [branches, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  // A narrower filter can leave the current page out of range.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);

  // Close the row menu on any outside click, as Bootstrap's dropdown would.
  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openMenu]);

  const firstShown = filtered.length === 0 ? 0 : start + 1;
  const lastShown = Math.min(start + rowsPerPage, filtered.length);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h4 className="mb-0">Central Dashboard List</h4>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Search Central Dashboard"
              aria-label="Search Central Dashboard"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="form-select w-auto"
            aria-label="All Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Branch</th>
                <th>Students</th>
                <th>Staff</th>
                <th>Revenue</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((branch) => (
                <tr key={branch.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className={`avatar avatar-sm ${branch.avatarClass} rounded me-2`}>
                        <i className="ti ti-building" />
                      </span>
                      <h6 className="fs-14 mb-0">{branch.name}</h6>
                    </div>
                  </td>
                  <td>{branch.students}</td>
                  <td>{branch.staff}</td>
                  <td>{branch.revenue}</td>
                  <td>
                    <span
                      className={`badge ${STATUS_BADGE[branch.status]} d-inline-flex align-items-center`}
                    >
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      {branch.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                        aria-expanded={openMenu === branch.id}
                        aria-label={`Actions for ${branch.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenu((current) =>
                            current === branch.id ? null : branch.id,
                          );
                        }}
                      >
                        <i className="ti ti-dots-vertical" />
                      </button>
                      <ul
                        className={`dropdown-menu dropdown-menu-end p-2${
                          openMenu === branch.id ? ' show' : ''
                        }`}
                      >
                        <li>
                          <button
                            type="button"
                            className="dropdown-item rounded-1"
                            onClick={() => {
                              setOpenMenu(null);
                              onEdit(branch);
                            }}
                          >
                            <i className="ti ti-edit me-2" />
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="dropdown-item rounded-1 text-danger"
                            onClick={() => {
                              setOpenMenu(null);
                              onDelete(branch);
                            }}
                          >
                            <i className="ti ti-trash me-2" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No branches match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-foot">
        <div className="card-foot-info">
          Showing <span>{firstShown}</span>–<span>{lastShown}</span> of{' '}
          <span>{filtered.length}</span> entries
        </div>

        <div className="card-foot-size">
          <label className="mb-0" htmlFor="rows-per-page">
            Rows:
          </label>
          <select
            className="form-select"
            id="rows-per-page"
            aria-label="Rows per page"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="card-pagination">
          <button
            type="button"
            className="card-page-btn"
            disabled={page === 1}
            aria-label="First page"
            onClick={() => setPage(1)}
          >
            <i className="ti ti-chevrons-left" />
          </button>
          <button
            type="button"
            className="card-page-btn"
            disabled={page === 1}
            aria-label="Previous page"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <i className="ti ti-chevron-left" />
          </button>

          <span className="card-page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                type="button"
                key={number}
                className={`card-page-btn${page === number ? ' active' : ''}`}
                aria-current={page === number ? 'page' : undefined}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
          </span>

          <button
            type="button"
            className="card-page-btn"
            disabled={page === totalPages}
            aria-label="Next page"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            <i className="ti ti-chevron-right" />
          </button>
          <button
            type="button"
            className="card-page-btn"
            disabled={page === totalPages}
            aria-label="Last page"
            onClick={() => setPage(totalPages)}
          >
            <i className="ti ti-chevrons-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchTable;
