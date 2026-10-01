import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../../content/shared/ContentPageHeader';
import DeleteModal from '../../content/shared/DeleteModal';
import { SORT_OPTIONS } from '../../content/shared/ListToolbar';
import type { SortId } from '../../content/shared/ListToolbar';
import type { Tally, Ticket, TicketState } from './data/tickets.data';
import {
  AGENTS,
  assigneeOptions,
  CATEGORIES,
  dateOptions,
  priorityOptions,
  priorityTint,
  STATE_FILTERS,
  stateTint,
  STATS,
  TICKETS,
} from './data/tickets.data';

const routes = all_routes;

/** One dropdown, closed by an outside click or Escape the way Bootstrap's is. */
const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return { open, setOpen, ref };
};

/** A sidebar row: a label, an open count and a closed one, zeroes omitted. */
const TallyRow = ({ row, last }: { row: Tally; last: boolean }) => (
  <div
    className={`d-flex align-items-center justify-content-between p-3${last ? '' : ' border-bottom'}`}
  >
    {row.photo ? (
      <span className="d-flex align-items-center">
        <ImageWithBasePath
          src={row.photo}
          className="avatar avatar-xs rounded-circle flex-shrink-0 me-2"
          alt={row.label}
        />
        {row.label}
      </span>
    ) : (
      <ActionLink className="" onClick={() => undefined}>
        {row.label}
      </ActionLink>
    )}
    <div className="d-flex align-items-center">
      {row.open > 0 ? <span className="badge badge-soft-danger me-2">{row.open}</span> : null}
      <span className="badge bg-primary-transparent">{row.closed}</span>
    </div>
  </div>
);

const Tickets = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<Ticket[]>(TICKETS);
  const [state, setState] = useState<TicketState | 'All'>('All');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortId>('asc');
  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const stateMenu = useDropdown();
  const filterMenu = useDropdown();
  const sortMenu = useDropdown();

  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0].label,
    subject: '',
    assignee: assigneeOptions[0],
    description: '',
    priority: priorityOptions[0] as string,
    status: 'Open',
  });

  useEffect(() => {
    if (filterMenu.open) setDraft(filters);
  }, [filterMenu.open, filters]);

  const visible = useMemo(() => {
    const kept = rows.filter((row) => {
      if (state !== 'All' && row.state !== state) return false;
      if (filters.assignee && row.assignee !== filters.assignee) return false;
      if (filters.priority && row.priority !== filters.priority) return false;
      return true;
    });
    if (sort === 'asc') return [...kept].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'desc') return [...kept].sort((a, b) => b.title.localeCompare(a.title));
    return [...kept].reverse();
  }, [rows, state, filters, sort]);

  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? 'Ascending';

  const addTicket = (event: FormEvent) => {
    event.preventDefault();
    push(`${form.title || 'Ticket'} raised with ${form.assignee}`);
    setAddOpen(false);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ContentPageHeader
            title="Tickets"
            section="Support"
            dashboardTo={routes.adminDashboard}
            addLabel="Add New Ticket"
            onAdd={() => setAddOpen(true)}
            onRefresh={() => {
              setRows(TICKETS);
              setFilters({});
              setState('All');
              push('Tickets refreshed');
            }}
            onExport={(format) =>
              push(`Tickets exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
            }
          />

          {/* Stats Cards */}
          <div className="row g-3 mb-3">
            {STATS.map((stat) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={stat.id}>
                <div className={`stats-card stats-card-support stats-${stat.tint}`}>
                  <div className="stats-top">
                    <span className="stats-icon">
                      <i className={stat.icon} />
                    </span>
                    <span className="stats-priority">{stat.priority}</span>
                  </div>
                  <h3 className="stats-value mb-0">{stat.value}</h3>
                  <p className="stats-label">{stat.label}</p>
                  <div className="stats-sla">
                    <span>{stat.sla.label}</span>
                    <span className="bar">
                      <i style={{ width: `${stat.sla.percent}%` }} />
                    </span>
                    <span>{stat.sla.percent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}

          <div className="d-flex align-items-center justify-content-between flex-wrap p-3 bg-white pb-0 mb-4">
            <div className="dropdown me-2 mb-3" ref={stateMenu.ref}>
              <ActionLink
                className="dropdown-toggle text-default fw-medium d-inline-flex align-items-center p-1 border-0 fs-18 fw-semibold"
                ariaExpanded={stateMenu.open}
                onClick={() => stateMenu.setOpen((current) => !current)}
              >
                {state === 'All' ? 'All Tickets' : state}
              </ActionLink>
              <ul className={`dropdown-menu p-3${stateMenu.open ? ' show' : ''}`}>
                {STATE_FILTERS.map((option) => (
                  <li key={option}>
                    <ActionLink
                      className={`dropdown-item rounded-1${state === option ? ' active' : ''}`}
                      onClick={() => {
                        setState(option);
                        stateMenu.setOpen(false);
                      }}
                    >
                      {option === 'All' ? 'All Tickets' : option}
                    </ActionLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <span className="icon-addon">
                  <i className="ti ti-calendar" />
                </span>
                <input
                  type="text"
                  className="form-control date-range bookingrange"
                  placeholder="Select"
                  defaultValue="Academic Year : 2024 / 2025"
                  aria-label="Select a date range"
                />
              </div>

              <div className="dropdown mb-3 me-2" ref={filterMenu.ref}>
                <ActionLink
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  ariaExpanded={filterMenu.open}
                  onClick={() => filterMenu.setOpen((current) => !current)}
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                </ActionLink>
                <div className={`dropdown-menu drop-width${filterMenu.open ? ' show' : ''}`}>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setFilters(draft);
                      filterMenu.setOpen(false);
                    }}
                  >
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom">
                      <div className="row">
                        {[
                          { id: 'assignee', label: 'Assigned to', options: assigneeOptions },
                          { id: 'date', label: 'Select Date', options: dateOptions },
                          { id: 'priority', label: 'Status', options: priorityOptions },
                        ].map((field, index, all) => (
                          <div className="col-md-12" key={field.id}>
                            <div className={index === all.length - 1 ? 'mb-0' : 'mb-3'}>
                              <label className="form-label" htmlFor={`ticket-${field.id}`}>
                                {field.label}
                              </label>
                              <select
                                className="form-select"
                                id={`ticket-${field.id}`}
                                value={draft[field.id] ?? ''}
                                onChange={(event) =>
                                  setDraft((current) => ({
                                    ...current,
                                    [field.id]: event.target.value,
                                  }))
                                }
                              >
                                <option value="">Select</option>
                                {field.options.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <ActionLink
                        className="btn btn-light me-3"
                        onClick={() => {
                          setDraft({});
                          setFilters({});
                          filterMenu.setOpen(false);
                        }}
                      >
                        Reset
                      </ActionLink>
                      <button type="submit" className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="dropdown mb-3" ref={sortMenu.ref}>
                <ActionLink
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  ariaExpanded={sortMenu.open}
                  onClick={() => sortMenu.setOpen((current) => !current)}
                >
                  <i className="ti ti-sort-ascending-2 me-2" />
                  Sort by {sortLabel === 'Ascending' ? 'A-Z' : sortLabel}
                </ActionLink>
                <ul className={`dropdown-menu p-3${sortMenu.open ? ' show' : ''}`}>
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.id}>
                      <ActionLink
                        className={`dropdown-item rounded-1${sort === option.id ? ' active' : ''}`}
                        onClick={() => {
                          setSort(option.id);
                          sortMenu.setOpen(false);
                        }}
                      >
                        {option.label}
                      </ActionLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Tickets */}
            <div className="col-xl-8 col-xxl-9">
              {visible.map((ticket) => (
                <div className="card" key={ticket.id}>
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap p-3 pb-0">
                    <h5 className="text-primary mb-3">{ticket.department}</h5>
                    <div className="d-flex align-items-center mb-1">
                      <span
                        className={`badge badge-${priorityTint(ticket.priority)} d-inline-flex align-items-center mb-2 me-4`}
                      >
                        <i className="ti ti-circle-filled fs-5 me-1" />
                        {ticket.priority}
                      </span>
                      <div className="mb-2">
                        <select
                          className="form-select"
                          aria-label={`Visibility for ${ticket.title}`}
                          value={ticket.private ? 'Mark as Private' : 'Mark as Public'}
                          onChange={(event) => {
                            const isPrivate = event.target.value === 'Mark as Private';
                            setRows((current) =>
                              current.map((row) =>
                                row.id === ticket.id ? { ...row, private: isPrivate } : row,
                              ),
                            );
                            push(`${ticket.title} marked ${isPrivate ? 'private' : 'public'}`);
                          }}
                        >
                          <option>Mark as Public</option>
                          <option>Mark as Private</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3 pb-0">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center flex-wrap">
                        <span className="avatar avatar-xxl me-2 mb-3">
                          <ImageWithBasePath src={ticket.photo} alt={ticket.title} />
                        </span>
                        <div className="mb-3">
                          <span className="badge bg-pending rounded-pill mb-1">{ticket.ref}</span>
                          <div className="d-flex align-items-center mb-2">
                            <h5 className="fw-semibold me-2">
                              <Link to={routes.tickets}>{ticket.title}</Link>
                            </h5>
                            <span
                              className={`badge bg-outline-${stateTint(ticket.state)} d-flex align-items-center ms-1`}
                            >
                              <i className="ti ti-circle-filled fs-5 me-1" />
                              {ticket.state}
                            </span>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <p className="d-flex align-items-center me-2 mb-1">
                              <ImageWithBasePath
                                src={ticket.assigneePhoto}
                                className="avatar avatar-xs rounded-circle flex-shrink-0 me-2"
                                alt={ticket.assignee}
                              />
                              Assigned to <span className="text-dark ms-1">{ticket.assignee}</span>
                            </p>
                            <p className="d-flex align-items-center mb-1 me-2">
                              <i className="ti ti-calendar-bolt me-1" />
                              {ticket.updated}
                            </p>
                            <p className="d-flex align-items-center mb-1">
                              <i className="ti ti-message-share me-1" />
                              {ticket.comments} Comments
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <ActionLink
                          className="btn btn-outline-danger d-flex align-items-center lh-1"
                          onClick={() => setPendingDelete(ticket.id)}
                        >
                          <i className="ti ti-trash-x me-1" />
                          Delete
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {visible.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5 text-muted fs-13">
                    No tickets match this filter.
                  </div>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <ActionLink
                    className="btn btn-outline-light bg-white"
                    onClick={() => push('That is every ticket in the register')}
                  >
                    Load More
                  </ActionLink>
                </div>
              )}
            </div>
            {/* /Tickets */}

            {/* Categories List */}
            <div className="col-xl-4 col-xxl-3 theiaStickySidebar">
              <div className="card">
                <div className="card-header p-3">
                  <h4>Ticket Categories</h4>
                </div>
                <div className="card-body p-0">
                  <div className="d-flex flex-column">
                    {CATEGORIES.map((row, index) => (
                      <TallyRow key={row.id} row={row} last={index === CATEGORIES.length - 1} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="card mb-0">
                <div className="card-header p-3">
                  <h4>Support Agents</h4>
                </div>
                <div className="card-body p-0">
                  <div className="d-flex flex-column">
                    {AGENTS.map((row, index) => (
                      <TallyRow key={row.id} row={row} last={index === AGENTS.length - 1} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* /Categories List */}
          </div>
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Ticket"
        onSubmit={addTicket}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setAddOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Add Ticket
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ticket-title">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="ticket-title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="ticket-category">
                Event Category
              </label>
              <select
                className="form-select"
                id="ticket-category"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
              >
                {CATEGORIES.map((row) => (
                  <option key={row.id}>{row.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="ticket-subject">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="ticket-subject"
                value={form.subject}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subject: event.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="ticket-assign">
                Assign To
              </label>
              <select
                className="form-select"
                id="ticket-assign"
                value={form.assignee}
                onChange={(event) =>
                  setForm((current) => ({ ...current, assignee: event.target.value }))
                }
              >
                {AGENTS.map((agent) => (
                  <option key={agent.id}>{agent.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="ticket-description">
                Ticket Description
              </label>
              <textarea
                className="form-control"
                id="ticket-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="ticket-priority">
                Priority
              </label>
              <select
                className="form-select"
                id="ticket-priority"
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({ ...current, priority: event.target.value }))
                }
              >
                {priorityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="ticket-status">
                Status
              </label>
              <select
                className="form-select"
                id="ticket-status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
              >
                {STATE_FILTERS.filter((option) => option !== 'All').map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <DeleteModal
        open={pendingDelete !== null}
        count={1}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          setRows((current) => current.filter((row) => row.id !== pendingDelete));
          setPendingDelete(null);
          push('Ticket deleted');
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="ticketsToasts" />
    </>
  );
};

export default Tickets;
