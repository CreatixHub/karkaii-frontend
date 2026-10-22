import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import NotificationModals from './modals/NotificationModals';
import type { NotificationModalId } from './modals/NotificationModals';
import type { Notification, Priority } from './data/notifications.data';
import {
  ANNOUNCEMENTS,
  CATEGORIES,
  DELIVERY,
  GROUPS,
  groupCountLabel,
  IMPORTANT,
  inGroup,
  INSIGHTS,
  LAST_UPDATED,
  MODULES,
  PEOPLE,
  PREFERENCES,
  PRIORITIES,
  PRIORITY_BANDS,
  PRIORITY_LABEL,
  QUICK_ACTIONS,
  RANGES,
  rowModifiersOf,
  searchIndexOf,
  STATUSES,
  tabsFor,
  TODAY_TOTAL,
  TOTAL_NOTIFICATIONS,
  TYPES,
  unreadIn,
  ACTION_REQUIRED,
  NOTIFICATIONS,
} from './data/notifications.data';

const routes = all_routes;

const Activities = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('Any priority');
  const [module, setModule] = useState('All modules');
  const [tab, setTab] = useState<string | null>(null);
  const [rows, setRows] = useState<Notification[]>(NOTIFICATIONS);
  const [modal, setModal] = useState<NotificationModalId | null>(null);
  const [target, setTarget] = useState<Notification | null>(null);

  const openModal = (id: NotificationModalId, row: Notification | null) => {
    setTarget(row);
    setModal(id);
  };

  const markRead = (row: Notification) => {
    setRows((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, unread: false } : entry)),
    );
    push(`Marked read: ${row.title}`);
  };

  const togglePin = (row: Notification) => {
    setRows((current) =>
      current.map((entry) => (entry.id === row.id ? { ...entry, pinned: !entry.pinned } : entry)),
    );
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (term && !searchIndexOf(row).includes(term)) return false;
      if (priority !== 'Any priority' && PRIORITY_LABEL[row.priority] !== priority) return false;
      if (module !== 'All modules' && row.module !== module) return false;
      if (tab === 'unread' && !row.unread) return false;
      if (tab === 'important' && row.priority !== 'critical') return false;
      if (tab === 'mentioned' && row.badgeIcon !== 'ti ti-at') return false;
      if (tab === 'today' && row.group !== 'Today') return false;
      return true;
    });
  }, [rows, search, priority, module, tab]);

  const tabs = tabsFor(rows);
  const unread = unreadIn(rows);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* ---------------------------- Page header ---------------------- */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-bell text-primary me-2" />
                Notification Center
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Notifications
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <ActionLink
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('settings', null)}
              >
                <i className="ti ti-settings me-1" />
                Settings
              </ActionLink>
            </div>
          </div>

          {/* ------------------------------- Hero -------------------------- */}
          <div className="ntf-hero mb-4">
            <div className="ntf-hero-inner">
              <div className="flex-fill">
                <span className="ntf-chip is-plain">
                  <i className="ti ti-bell me-1" />
                  Notification Center
                </span>
                <h1 className="ntf-hero-title">
                  You have <span className="text-primary">{unread} unread</span>, and{' '}
                  {ACTION_REQUIRED} of them need a decision today.
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  Everything the school system generates arrives here — academics, attendance, fees,
                  exams, transport, medical and system alerts. Filter it, act on it, or clear it.
                </p>

                <div className="ntf-hero-rail">
                  <span className="ntf-stat">
                    <span className="ntf-lbl">Today</span>
                    <b>
                      {TODAY_TOTAL}
                      <small> notifications</small>
                    </b>
                  </span>
                  <span className="ntf-stat">
                    <span className="ntf-lbl">Important alerts</span>
                    <b>
                      {IMPORTANT}
                      <small> flagged</small>
                    </b>
                  </span>
                  <span className="ntf-stat">
                    <span className="ntf-lbl">Action required</span>
                    <b>
                      {ACTION_REQUIRED}
                      <small> waiting</small>
                    </b>
                  </span>
                  <span className="ntf-stat">
                    <span className="ntf-lbl">Unread</span>
                    <b>
                      {unread}
                      <small> of {TOTAL_NOTIFICATIONS}</small>
                    </b>
                  </span>
                  <span className="ntf-stat">
                    <span className="ntf-lbl">Last updated</span>
                    <b>
                      {LAST_UPDATED}
                      <small> ago</small>
                    </b>
                  </span>
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <ActionLink
                  className="btn btn-primary d-inline-flex align-items-center justify-content-center"
                  onClick={() => openModal('markAll', null)}
                >
                  <i className="ti ti-checks me-1" />
                  Mark All Read
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center justify-content-center"
                  onClick={() => openModal('settings', null)}
                >
                  <i className="ti ti-settings me-1" />
                  Notification Settings
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center justify-content-center"
                  onClick={() => openModal('archive', null)}
                >
                  <i className="ti ti-archive me-1" />
                  Archive Read
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center justify-content-center"
                  onClick={() => openModal('export', null)}
                >
                  <i className="ti ti-file-export me-1" />
                  Export Notifications
                </ActionLink>
              </div>
            </div>
          </div>

          {/* --------------------------- Filter toolbar --------------------- */}
          <div className="ntf-bar mb-4">
            <div className="row g-2">
              <div className="col-xl-3 col-md-6">
                <div className="input-icon-start position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search notifications, people or records"
                    aria-label="Search notifications, people or records"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-xl col-md-6">
                <select className="form-select lh-base" aria-label="All types" defaultValue="All types">
                  <option>All types</option>
                  {TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl col-md-6">
                <select
                  className="form-select lh-base"
                  aria-label="Any priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  <option>Any priority</option>
                  {PRIORITIES.map((key: Priority) => (
                    <option key={key}>{PRIORITY_LABEL[key]}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl col-md-6">
                <select
                  className="form-select lh-base"
                  aria-label="All modules"
                  value={module}
                  onChange={(event) => setModule(event.target.value)}
                >
                  <option>All modules</option>
                  {MODULES.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl col-md-6">
                <select className="form-select lh-base" aria-label="Anyone" defaultValue="Anyone">
                  <option>Anyone</option>
                  {PEOPLE.map((person) => (
                    <option key={person}>{person}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl col-md-6">
                <select
                  className="form-select lh-base"
                  aria-label="Last 7 days"
                  defaultValue={RANGES[0]}
                >
                  {RANGES.map((range) => (
                    <option key={range}>{range}</option>
                  ))}
                </select>
              </div>
              <div className="col-xl col-md-6">
                <select
                  className="form-select lh-base"
                  aria-label="All statuses"
                  defaultValue="All statuses"
                >
                  <option>All statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
              {tabs.map((entry) => (
                <ActionLink
                  key={entry.id}
                  className={`ntf-tab${tab === entry.id ? ' active' : ''}`}
                  onClick={() => setTab(tab === entry.id ? null : entry.id)}
                >
                  <i className={entry.icon} />
                  {entry.label}
                  {entry.count === undefined ? null : (
                    <span className={`ntf-count${entry.quiet ? ' is-quiet' : ''}`}>
                      {entry.count}
                    </span>
                  )}
                </ActionLink>
              ))}
            </div>
          </div>

          {/* ------------------------------- Feed --------------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Your Inbox</h2>
              <p className="fs-13 text-muted mb-0">
                Grouped by when it arrived. Unread items carry a rail on the left; pinned items keep
                their marker.
              </p>
            </div>
            <div className="ms-auto d-flex align-items-center gap-2 flex-wrap">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => openModal('markAll', null)}
              >
                <i className="ti ti-checks me-1" />
                Mark all read
              </ActionLink>
            </div>
          </div>

          <div className="ntf-feed mb-5">
            {GROUPS.filter((group) => inGroup(visible, group).length > 0).map((group) => (
              <div key={group}>
                <div className="ntf-group">
                  <span>{group}</span>
                  <span className="ntf-chip is-plain">{groupCountLabel(visible, group)}</span>
                </div>
                {inGroup(visible, group).map((row) => (
                  <div className={`ntf-row ${rowModifiersOf(row)}`.trim()} key={row.id}>
                    <span className="ntf-ava">
                      {row.photo ? (
                        <ImageWithBasePath src={row.photo} alt={row.actor} />
                      ) : (
                        <span className="ntf-ava-sys">
                          <i className={row.systemIcon} />
                        </span>
                      )}
                      <span className="ntf-ava-badge">
                        <i className={row.badgeIcon} />
                      </span>
                    </span>

                    <div className="overflow-hidden">
                      <p className="ntf-row-title">
                        <b>{row.title}</b>
                      </p>
                      <p className="ntf-row-txt">{row.text}</p>
                      {row.preview ? <p className="ntf-preview">{row.preview}</p> : null}

                      {row.attachments?.length ? (
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          {row.attachments.map((file) => (
                            <span className="ntf-file" key={file.name}>
                              <i className="ti ti-paperclip me-1" />
                              {file.name}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="ntf-row-meta">
                        <span className={`ntf-chip is-${row.moduleKey}`}>{row.module}</span>
                        <span className={`ntf-pri is-${row.priority}`}>
                          {PRIORITY_LABEL[row.priority]}
                        </span>
                        <span>
                          <i className="ti ti-user me-1" />
                          {row.actor}
                        </span>
                        <span>
                          <i className="ti ti-box me-1" />
                          {row.source}
                        </span>
                      </div>
                    </div>

                    <div className="ntf-row-side">
                      <span className="fs-12 text-muted">{row.at}</span>
                      <div className="ntf-row-tools">
                        <ActionLink
                          className="ntf-tool"
                          ariaLabel="Mark read"
                          title="Mark read"
                          onClick={() => markRead(row)}
                        >
                          <i className="ti ti-check" />
                        </ActionLink>
                        <ActionLink
                          className="ntf-tool"
                          ariaLabel="Pin"
                          title="Pin"
                          onClick={() => togglePin(row)}
                        >
                          <i className="ti ti-pin" />
                        </ActionLink>
                        <ActionLink
                          className="ntf-tool"
                          ariaLabel="Archive"
                          title="Archive"
                          onClick={() => openModal('archive', row)}
                        >
                          <i className="ti ti-archive" />
                        </ActionLink>
                        <ActionLink
                          className="ntf-tool"
                          ariaLabel="More"
                          title="More"
                          onClick={() => openModal('share', row)}
                        >
                          <i className="ti ti-dots" />
                        </ActionLink>
                        <ActionLink
                          className="ntf-tool"
                          ariaLabel="Open"
                          title="Open"
                          onClick={() => openModal('detail', row)}
                        >
                          <i className="ti ti-arrow-right" />
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {visible.length === 0 ? (
              <div className="ntf-empty">
                <span className="ntf-empty-ic">
                  <i className="ti ti-bell-off" />
                </span>
                <p className="ntf-empty-title">Nothing matches this filter</p>
                <p className="fs-13 text-muted mb-0">
                  Clear the search or widen the priority to see more notifications.
                </p>
              </div>
            ) : null}
          </div>

          {/* ---------------------------- Categories ------------------------ */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Categories</h2>
              <p className="fs-13 text-muted mb-0">
                Every module that can raise a notification, with what is unread and what arrived
                last.
              </p>
            </div>
          </div>
          <div className="row g-3 mb-5">
            {CATEGORIES.map((category) => (
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6" key={category.name}>
                <ActionLink
                  className="ntf-cat"
                  onClick={() => {
                    setModule(MODULES.includes(category.name) ? category.name : 'All modules');
                    push(`Filtered to ${category.name}`);
                  }}
                >
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <span className="ntf-cat-ic">
                      <i className={category.icon} />
                    </span>
                    <span className="ntf-count">{category.unread}</span>
                  </div>
                  <div>
                    <p className="ntf-cat-title">{category.name}</p>
                    <span className={`ntf-pri is-${category.priority}`}>
                      {PRIORITY_LABEL[category.priority]}
                    </span>
                  </div>
                  <p className="fs-12 text-muted mb-0 mt-auto">{category.latest}</p>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* -------------------------- Priority centre --------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Priority Center</h2>
              <p className="fs-13 text-muted mb-0">
                What is waiting, and how quickly each band is expected to be answered.
              </p>
            </div>
          </div>
          <div className="row g-4 mb-5">
            {PRIORITY_BANDS.map((band) => (
              <div className="col-xl-3 col-md-6" key={band.priority}>
                <div className={`ntf-prio is-${band.priority}`}>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className={`ntf-pri is-${band.priority}`}>
                      {PRIORITY_LABEL[band.priority]}
                    </span>
                    <span className="ntf-chip is-plain">
                      <i className="ti ti-clock me-1" />
                      {band.window}
                    </span>
                  </div>
                  <span className="ntf-prio-fig">{band.pending}</span>
                  <span className="ntf-lbl">pending items</span>
                  <div className="ntf-prio-latest">
                    <span className="ntf-lbl mb-1">Latest</span>
                    <p className="fs-13 fw-medium text-dark mb-1">{band.latest}</p>
                    <p className="fs-12 text-muted mb-0">{band.latestAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --------------------------- Quick actions ---------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Quick Actions</h2>
              <p className="fs-13 text-muted mb-0">
                {QUICK_ACTIONS.length} things you can do without leaving this page.
              </p>
            </div>
          </div>
          <div className="row g-3 mb-5">
            {QUICK_ACTIONS.map((action) => (
              <div className="col-xl-4 col-md-6" key={action.label}>
                <ActionLink className="ntf-act" onClick={() => push(action.label)}>
                  <span className="ntf-act-ic">
                    <i className={action.icon} />
                  </span>
                  <div>
                    <p className="fs-14 fw-medium text-dark mb-0">{action.label}</p>
                    <p className="fs-12 text-muted mb-0">{action.note}</p>
                  </div>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* -------------------------- Delivery timeline ------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Delivery Timeline</h2>
              <p className="fs-13 text-muted mb-0">
                The full lifecycle of the attendance alert raised at 08:14 this morning.
              </p>
            </div>
          </div>
          <div className="ntf-box mb-5">
            <div className="ntf-box-body">
              {DELIVERY.map((step) => (
                <div className={`ntf-step${step.done ? ' is-done' : ''}`} key={step.title}>
                  <span className="ntf-step-ic">
                    <i className={step.done ? 'ti ti-check' : 'ti ti-clock'} />
                  </span>
                  <div>
                    <p className="ntf-step-title">
                      {step.title}
                      <span className="fs-12 text-muted ms-2">{step.at}</span>
                    </p>
                    <p className="fs-13 text-muted mb-0">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------------------- Insights -------------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Notification Insights</h2>
              <p className="fs-13 text-muted mb-0">
                What the notification volume itself is telling you.
              </p>
            </div>
          </div>
          <div className="row g-3 mb-5">
            {INSIGHTS.map((insight) => (
              <div className="col-xl-4 col-md-6" key={insight.title}>
                <div className="ntf-note h-100">
                  <span className="ntf-note-ic">
                    <i className={insight.icon} />
                  </span>
                  <div>
                    <p className="ntf-note-title">{insight.title}</p>
                    <p className="fs-13 text-muted mb-0">{insight.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* -------------------------- Preferences ------------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Delivery Preferences</h2>
              <p className="fs-13 text-muted mb-0">
                How each channel behaves for your account. Emergency alerts always bypass quiet
                hours.
              </p>
            </div>
            <ActionLink
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => openModal('settings', null)}
            >
              <i className="ti ti-settings me-1" />
              All settings
            </ActionLink>
          </div>
          <div className="row g-3 mb-5">
            {PREFERENCES.map((preference) => (
              <div className="col-xl-3 col-md-6" key={preference.channel}>
                <div className="ntf-pref h-100">
                  <span className="ntf-pref-ic">
                    <i className={preference.icon} />
                  </span>
                  <div>
                    <p className="ntf-pref-title">{preference.channel}</p>
                    <p className="fs-12 text-muted mb-0">{preference.behaviour}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* -------------------------- Announcements ----------------------- */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="fs-20 fw-semibold text-dark mb-1">Recent Announcements</h2>
              <p className="fs-13 text-muted mb-0">
                Published school-wide notices from the last two weeks.
              </p>
            </div>
          </div>
          <div className="row g-3 mb-4">
            {ANNOUNCEMENTS.map((announcement) => (
              <div className="col-xl-4 col-md-6" key={announcement.kind}>
                <div className="ntf-ann h-100">
                  <div className="ntf-ann-head">
                    <span className="ntf-chip is-plain">{announcement.kind}</span>
                    <span className="fs-12 text-muted">{announcement.audience}</span>
                  </div>
                  <div className="ntf-ann-body">
                    <p className="ntf-ann-title">{announcement.title}</p>
                    <p className="fs-13 text-muted mb-0">{announcement.text}</p>
                  </div>
                  <div className="ntf-ann-foot">
                    <span className="fs-12 text-muted">Published {announcement.publishedOn}</span>
                    <ActionLink
                      className="fs-12 fw-semibold text-primary"
                      onClick={() => push(announcement.title)}
                    >
                      Read
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NotificationModals
        active={modal}
        onClose={() => setModal(null)}
        notification={target}
        unread={unread}
        onMarkAll={() => {
          setRows((current) => current.map((row) => ({ ...row, unread: false })));
          push('All notifications marked read');
        }}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="notificationToasts" />
    </>
  );
};

export default Activities;
