import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, ExportMenu } from '@components/workspace';
import type { ExportFormat } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { LogRow } from './data/scaffold.data';
import { LOG_ROWS, LOG_TOTAL, STATS, STATUS_OPTIONS, STATUS_TINT } from './data/scaffold.data';

const routes = all_routes;

const PAGE_SIZES = [8, 25, 50, 100];

export interface LogTablePageProps {
  /** The page title, e.g. "Activity Logs". */
  title: string;
  /** Which footer the template ships. */
  footer?: 'card-foot' | 'card-footer';
  section?: string;
}

const LogTablePage = ({ title, footer = 'card-footer', section = 'Settings' }: LogTablePageProps) => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<LogRow[]>(LOG_ROWS);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [target, setTarget] = useState<LogRow | null>(null);
  const [form, setForm] = useState<{ name: string; status: string; description: string }>({
    name: '',
    status: STATUS_OPTIONS[0],
    description: '',
  });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (term && !row.event.toLowerCase().includes(term) && !row.user.toLowerCase().includes(term)) {
        return false;
      }
      if (status !== 'All Status' && row.status !== status) return false;
      return true;
    });
  }, [rows, search, status]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, pageCount);
  const shown = visible.slice((current - 1) * pageSize, current * pageSize);
  const first = visible.length === 0 ? 0 : (current - 1) * pageSize + 1;
  const last = Math.min(current * pageSize, visible.length);

  const open = (next: 'add' | 'edit' | 'delete', row: LogRow | null) => {
    setTarget(row);
    setForm({
      name: row?.event ?? '',
      status: (row && STATUS_OPTIONS.includes(row.status) ? row.status : STATUS_OPTIONS[0]) as string,
      description: '',
    });
    setDialog(next);
  };

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">{title}</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">{section}</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => {
                  setRows(LOG_ROWS);
                  setSearch('');
                  setStatus('All Status');
                  push(`${title} reloaded`);
                }}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <div className="me-2 mb-2">
                <ExportMenu
                  printLabel={`Print ${title}`}
                  onExport={(format: ExportFormat) => {
                    push(`${title} exported as ${format.toUpperCase()}`);
                  }}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => open('add', null)}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Log
              </button>
            </div>
          </div>

          <div className="row">
            {STATS.map((stat) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={stat.id}>
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">{stat.label}</p>
                      <h4 className="mb-0">{stat.value}</h4>
                    </div>
                    <span
                      className={`avatar avatar-lg bg-${stat.tint}-transparent text-${stat.tint} rounded`}
                    >
                      <i className={`${stat.icon} fs-24`} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h4 className="mb-0">{title} List</h4>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Search ${title}`}
                    aria-label={`Search ${title}`}
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
                  <option>All Status</option>
                  {STATUS_OPTIONS.map((option) => (
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
                      <th>Event</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>IP</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <ActionLink
                              className={`avatar avatar-sm bg-${row.tint}-transparent text-${row.tint} rounded me-2`}
                              ariaLabel={row.event}
                              onClick={() => open('edit', row)}
                            >
                              <i className="ti ti-history" />
                            </ActionLink>
                            <h6 className="fs-14 mb-0">
                              <ActionLink onClick={() => open('edit', row)}>{row.event}</ActionLink>
                            </h6>
                          </div>
                        </td>
                        <td>{row.user}</td>
                        <td>{row.date}</td>
                        <td>{row.ip}</td>
                        <td>
                          <span
                            className={`badge badge-soft-${STATUS_TINT[row.status]} d-inline-flex align-items-center`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {row.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <ActionLink
                              className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                              ariaLabel={`Edit ${row.event}`}
                              onClick={() => open('edit', row)}
                            >
                              <i className="ti ti-edit" />
                            </ActionLink>
                            <ActionLink
                              className="btn btn-icon btn-sm rounded-circle flex-shrink-0 text-danger"
                              ariaLabel={`Delete ${row.event}`}
                              onClick={() => open('delete', row)}
                            >
                              <i className="ti ti-trash" />
                            </ActionLink>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {shown.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted fs-13">
                          No entries match this search.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            {footer === 'card-foot' ? (
              <div className="card-foot">
                <div className="card-foot-info">
                  Showing <span>{first}</span>–<span>{last}</span> of <span>{LOG_TOTAL}</span>{' '}
                  entries
                </div>
                <div className="card-foot-size">
                  <label className="mb-0" htmlFor="log-rows">
                    Rows:
                  </label>
                  <select
                    className="form-select"
                    id="log-rows"
                    aria-label="Rows per page"
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                  >
                    {PAGE_SIZES.map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="card-pagination">
                  <button
                    type="button"
                    className="card-page-btn"
                    disabled={current === 1}
                    aria-label="First page"
                    onClick={() => setPage(1)}
                  >
                    <i className="ti ti-chevrons-left" />
                  </button>
                  <button
                    type="button"
                    className="card-page-btn"
                    disabled={current === 1}
                    aria-label="Previous page"
                    onClick={() => setPage(current - 1)}
                  >
                    <i className="ti ti-chevron-left" />
                  </button>
                  <span className="card-page-numbers">
                    {pages.map((number) => (
                      <button
                        key={number}
                        type="button"
                        className={`card-page-btn${number === current ? ' active' : ''}`}
                        onClick={() => setPage(number)}
                      >
                        {number}
                      </button>
                    ))}
                  </span>
                  <button
                    type="button"
                    className="card-page-btn"
                    disabled={current === pageCount}
                    aria-label="Next page"
                    onClick={() => setPage(current + 1)}
                  >
                    <i className="ti ti-chevron-right" />
                  </button>
                  <button
                    type="button"
                    className="card-page-btn"
                    disabled={current === pageCount}
                    aria-label="Last page"
                    onClick={() => setPage(pageCount)}
                  >
                    <i className="ti ti-chevrons-right" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <p className="mb-0 text-muted">
                  Showing {first} to {last} of {LOG_TOTAL} entries
                </p>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item${current === 1 ? ' disabled' : ''}`}>
                      <ActionLink className="page-link" onClick={() => setPage(current - 1)}>
                        Previous
                      </ActionLink>
                    </li>
                    {pages.map((number) => (
                      <li
                        className={`page-item${number === current ? ' active' : ''}`}
                        key={number}
                      >
                        <ActionLink className="page-link" onClick={() => setPage(number)}>
                          {number}
                        </ActionLink>
                      </li>
                    ))}
                    <li className={`page-item${current === pageCount ? ' disabled' : ''}`}>
                      <ActionLink className="page-link" onClick={() => setPage(current + 1)}>
                        Next
                      </ActionLink>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={dialog === 'add' || dialog === 'edit'}
        onClose={() => setDialog(null)}
        title={`${dialog === 'edit' ? 'Edit' : 'Add'} Log`}
        onSubmit={(event) => {
          event.preventDefault();
          push(dialog === 'edit' ? `${target?.event ?? 'Log'} updated` : 'Log added');
          setDialog(null);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              {dialog === 'edit' ? 'Save Changes' : 'Add Log'}
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="log-name">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="log-name"
              value={form.name}
              onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="log-status">
              Status
            </label>
            <select
              className="form-select"
              id="log-status"
              value={form.status}
              onChange={(event) => setForm((state) => ({ ...state, status: event.target.value }))}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="log-description">
              Description
            </label>
            <textarea
              className="form-control"
              rows={3}
              id="log-description"
              value={form.description}
              onChange={(event) =>
                setForm((state) => ({ ...state, description: event.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'delete'}
        onClose={() => setDialog(null)}
        title="Confirm Deletion"
        bodyClassName="text-center"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                setRows((state) => state.filter((row) => row.id !== target?.id));
                push(`${target?.event ?? 'Log'} deleted`, 'danger');
                setDialog(null);
              }}
            >
              Yes, Delete
            </button>
          </>
        }
      >
        <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3">
          <i className="ti ti-trash fs-24" />
        </span>
        <p className="fs-14 mb-0">
          You want to delete all the marked items, this cant be undone once you delete.
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="logTableToasts" />
    </>
  );
};

export default LogTablePage;
