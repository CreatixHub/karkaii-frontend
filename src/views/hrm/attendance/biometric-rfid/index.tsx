import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import DeviceMonitor from './components/DeviceMonitor';
import BiometricModals from './modals/BiometricModals';
import type { BiometricModalId } from './modals/BiometricModals';
import type { AttendanceLog, Device, SavedViewId } from './data/biometric.data';
import { ActionLink } from '@components/workspace';
import {
  attendanceLogs,
  DEFAULT_DATE,
  deviceSummary,
  devices as allDevices,
  filterChipLabels,
  filterChipTone,
  filterFields,
  savedViews,
  severityTone,
  statusPill,
  syncPill,
  systemAlerts,
} from './data/biometric.data';

const routes = all_routes;

const EMPTY_FILTERS: Record<string, string> = Object.fromEntries(
  filterFields.map((field) => [field.id, field.id === 'date' ? DEFAULT_DATE : field.id === 'time-range' ? 'All Day' : '']),
);

type ToolbarMenu = 'filter' | 'views' | 'export' | null;

const BiometricRfid = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>(attendanceLogs);
  const [devices] = useState<Device[]>(allDevices);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [view, setView] = useState<SavedViewId>('all');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [devicesOpen, setDevicesOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [rowMenu, setRowMenu] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<BiometricModalId | null>(null);
  const [modalDevice, setModalDevice] = useState<Device | null>(null);
  const [modalLog, setModalLog] = useState<AttendanceLog | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (term) {
        const haystack = [log.person, log.personId, log.card, log.device].join(' ').toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (view === 'failed' && log.entry !== 'Failed') return false;
      if (view === 'pending' && log.sync !== 'Pending') return false;
      if (filters.device && log.device !== filters.device) return false;
      if (filters.campus && log.campus !== filters.campus) return false;
      if (filters['user-type'] && log.userType !== filters['user-type']) return false;
      if (filters['attendance-status'] && log.status !== filters['attendance-status']) return false;
      if (filters['sync-status'] && log.sync !== filters['sync-status']) return false;
      if (filters['device-type']) {
        const device = devices.find((item) => item.name === log.device);
        if (device?.kind !== filters['device-type']) return false;
      }
      return true;
    });
  }, [logs, devices, search, view, filters]);

  const summary = useMemo(() => deviceSummary(devices, logs), [devices, logs]);
  const onlineCount = devices.filter((device) => device.status === 'Online').length;

  const chips = useMemo(
    () =>
      filterFields
        .filter((field) => {
          const value = filters[field.id];
          return value && value !== EMPTY_FILTERS[field.id];
        })
        .map((field) => ({ id: field.id, value: filters[field.id], tone: filterChipTone[field.id] ?? 'primary' })),
    [filters],
  );

  const applyFilters = useCallback(() => {
    setFilters(draft);
    setOpenMenu(null);
    push('Filters applied');
  }, [draft, push]);

  const resetFilters = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setSearch('');
    setView('all');
    push('Filters cleared');
  }, [push]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  /** Manual Sync clears the pending queue, which is what the button claims to do. */
  const manualSync = useCallback(() => {
    setLogs((current) => current.map((log) => (log.sync === 'Pending' ? { ...log, sync: 'Synced' } : log)));
    push('Manual sync complete — pending records flushed');
  }, [push]);

  const openLogModal = (log: AttendanceLog, modal: BiometricModalId) => {
    setModalLog(log);
    setModalDevice(null);
    setActiveModal(modal);
    setRowMenu(null);
  };

  const openDeviceModal = (device: Device, modal: BiometricModalId) => {
    setModalDevice(device);
    setModalLog(null);
    setActiveModal(modal);
  };

  const confirmDelete = useCallback(() => {
    if (modalLog) setLogs((current) => current.filter((log) => log.id !== modalLog.id));
    setActiveModal(null);
    push('Attendance log deleted');
  }, [modalLog, push]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Biometric &amp; RFID Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Biometric / RFID
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className="badge badge-soft-success d-inline-flex align-items-center me-2 mb-2">
                <i className="ti ti-circle-filled fs-6 me-1" />
                {onlineCount} Online
              </span>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => setAlertsOpen(true)}
              >
                <i className="ti ti-bell-ringing me-1" />
                Alerts <span className="badge bg-danger ms-1">{systemAlerts.length}</span>
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={manualSync}
              >
                <i className="ti ti-refresh me-1" />
                Manual Sync
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <div className="card mb-0 data-workspace classes-workspace is-loaded" id="bio_card">
            {/* Sticky Monitoring Toolbar */}
            <div className="card-header border-bottom sticky-top bg-white">
              <div className="page-toolbar">
                <div className="search-toolbar">
                  <i className="ti ti-search search-toolbar-icon" />
                  <input
                    type="text"
                    id="bioSearch"
                    placeholder="Search person, ID, card or device…"
                    aria-label="Search attendance logs"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <span className="search-toolbar-kbd">⌘K</span>
                </div>

                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'filter'}
                    onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
                  >
                    <i className="ti ti-adjustments-horizontal" />
                    Filters
                  </button>
                  <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filter' ? ' show' : ''}`}>
                    <div className="row g-3">
                      {filterFields.map((field) => (
                        <div className="col-6" key={field.id}>
                          <label className="form-label mb-1" htmlFor={field.id}>
                            {field.label}
                          </label>
                          {field.kind === 'date' ? (
                            <input
                              type="text"
                              className="form-control form-control-sm filter-datepicker"
                              placeholder={field.placeholder}
                              id={field.id}
                              value={draft[field.id] ?? ''}
                              onChange={(event) =>
                                setDraft((current) => ({ ...current, [field.id]: event.target.value }))
                              }
                            />
                          ) : (
                            <select
                              className="form-select"
                              id={field.id}
                              value={draft[field.id] ?? ''}
                              onChange={(event) =>
                                setDraft((current) => ({ ...current, [field.id]: event.target.value }))
                              }
                            >
                              {field.noAllOption ? null : <option value="">All</option>}
                              {field.options?.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                      <span className="fs-12 text-muted">
                        <b>{visible.length}</b> of {logs.length} logs match
                      </span>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-light btn-sm" onClick={resetFilters}>
                          Reset
                        </button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={applyFilters}>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'views'}
                    onClick={() => setOpenMenu(openMenu === 'views' ? null : 'views')}
                  >
                    <i className="ti ti-bookmark" />
                    Saved Views
                  </button>
                  <ul className={`dropdown-menu p-2${openMenu === 'views' ? ' show' : ''}`}>
                    <li className="context-menu-head">My Views</li>
                    {savedViews.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${view === item.id ? ' active' : ''}`}
                          onClick={() => {
                            setView(item.id);
                            setOpenMenu(null);
                          }}
                        >
                          <i className={`${item.icon} me-2`} />
                          {item.label}
                        </button>
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1 text-primary"
                        onClick={() => {
                          setOpenMenu(null);
                          push('Current view saved');
                        }}
                      >
                        <i className="ti ti-plus me-2" />
                        Save current view
                      </button>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className="workspace-button"
                  aria-expanded={devicesOpen}
                  aria-controls="bio_devices"
                  onClick={() => setDevicesOpen((value) => !value)}
                >
                  <i className="ti ti-devices" />
                  Devices
                </button>

                <span className="flex-grow-1" />

                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={() => {
                    setLogs(attendanceLogs);
                    push('Attendance logs refreshed');
                  }}
                >
                  <i className="ti ti-refresh" />
                </button>
                <button type="button" className="workspace-button" title="Manual Sync" aria-label="Manual Sync" onClick={manualSync}>
                  <i className="ti ti-cloud-computing" />
                  Sync
                </button>

                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button workspace-button-icon"
                    title="Export Logs"
                    aria-label="Export Logs"
                    aria-expanded={openMenu === 'export'}
                    onClick={() => setOpenMenu(openMenu === 'export' ? null : 'export')}
                  >
                    <i className="ti ti-file-export" />
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end p-2${openMenu === 'export' ? ' show' : ''}`}>
                    {[
                      { id: 'pdf', icon: 'ti ti-file-type-pdf', label: 'Export as PDF' },
                      { id: 'excel', icon: 'ti ti-file-type-xls', label: 'Export as Excel' },
                    ].map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          className="dropdown-item rounded-1"
                          onClick={() => {
                            setOpenMenu(null);
                            push(`${option.label} started`);
                          }}
                        >
                          <i className={`${option.icon} me-2`} />
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Fullscreen"
                  aria-label="Fullscreen"
                  aria-pressed={fullscreen}
                  onClick={toggleFullscreen}
                >
                  <i className="ti ti-arrows-maximize" />
                </button>
              </div>

              <div className="quick-filters">
                <span className="text-muted fs-12 fw-semibold me-1">
                  <i className="ti ti-filter me-1" />
                  Filters:
                </span>
                {chips.map((chip) => (
                  <span className={`badge badge-soft-${chip.tone} d-inline-flex align-items-center`} key={chip.id}>
                    {filterChipLabels[chip.id] ?? chip.id} : {chip.value}{' '}
                    <button
                      type="button"
                      className={`ms-1 btn btn-link p-0 border-0 text-${chip.tone}`}
                      aria-label="Remove filter"
                      onClick={() => {
                        setDraft((current) => ({ ...current, [chip.id]: EMPTY_FILTERS[chip.id] }));
                        setFilters((current) => ({ ...current, [chip.id]: EMPTY_FILTERS[chip.id] }));
                      }}
                    >
                      <i className="ti ti-x" />
                    </button>
                  </span>
                ))}
                {chips.length > 0 ? (
                  <button type="button" className="btn btn-link btn-sm text-primary" onClick={resetFilters}>
                    Clear all
                  </button>
                ) : (
                  <span className="fs-12 text-muted">None applied</span>
                )}
              </div>
            </div>
            {/* /Sticky Monitoring Toolbar */}

            {/* Device Status Panel */}
            <div className="p-3 border-bottom">
              <div className="row g-3 align-items-center">
                {summary.map((tile) => (
                  <div className="col-xl col-md-3 col-6" key={tile.id}>
                    <div className="d-flex align-items-center gap-2 border-end-lg pe-lg-3">
                      <span className={`avatar avatar-md ${tile.tint} rounded flex-shrink-0`}>
                        <i className={`${tile.icon} fs-20`} />
                      </span>
                      <div>
                        <span className="fs-12 text-muted d-block">{tile.label}</span>
                        <span className="fw-semibold">{tile.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* /Device Status Panel */}

            <DeviceMonitor
              devices={devices}
              open={devicesOpen}
              onHide={() => setDevicesOpen(false)}
              onDetails={(device) => openDeviceModal(device, 'device_details')}
              onSync={(device) => openDeviceModal(device, 'sync_history')}
            />

            {/* Attendance Log Grid */}
            <div className="data-table dt-cards">
              <table className="table">
                <thead>
                  <tr>
                    <th className="dt-pin" />
                    <th />
                    <th>Person</th>
                    <th>User Type</th>
                    <th>RFID Card</th>
                    <th>Device</th>
                    <th>Campus</th>
                    <th>Entry Type</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Auth Method</th>
                    <th>Verification</th>
                    <th>Attendance</th>
                    <th>Sync</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((log) => (
                    <tr className="dt-row" key={log.id}>
                      <td className="dt-pin" />
                      <td />
                      <td>
                        <div className="dt-user">
                          <span className="dt-avatar">
                            <ImageWithBasePath src={log.avatar} alt={log.person} />
                          </span>
                          <span>
                            <ActionLink
                              className="dt-name"
                              onClick={() => openLogModal(log, 'user_information')}
                            >
                              {log.person}
                            </ActionLink>
                            <span className="dt-sub">{log.personId}</span>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-soft-${log.userType === 'Staff' ? 'info' : 'primary'}`}>
                          {log.userType}
                        </span>
                      </td>
                      <td>{log.card}</td>
                      <td>{log.device}</td>
                      <td>{log.campus}</td>
                      <td>
                        <span
                          className={`badge badge-soft-${
                            log.entry === 'Success' ? 'success' : 'danger'
                          } d-inline-flex align-items-center`}
                        >
                          <i className={`ti ti-${log.entry === 'Success' ? 'check' : 'x'} me-1`} />
                          {log.entry}
                        </span>
                      </td>
                      <td>{log.date}</td>
                      <td>{log.time}</td>
                      <td>
                        <span className="d-inline-flex align-items-center">
                          <i className={`${log.method.icon} me-1 text-muted`} />
                          {log.method.label}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`d-inline-flex align-items-center text-${
                            log.verification === 'Check-In' ? 'success' : 'primary'
                          }`}
                        >
                          <i
                            className={`ti ti-${log.verification === 'Check-In' ? 'login-2' : 'logout-2'} me-1`}
                          />
                          {log.verification}
                        </span>
                      </td>
                      <td>
                        <span className={`dt-pill ${statusPill[log.status]}`}>
                          <span className="dt-pill-dot" />
                          {log.status}
                        </span>
                      </td>
                      <td>
                        <span className={`dt-pill ${syncPill[log.sync]}`}>
                          <span className="dt-pill-dot" />
                          {log.sync}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="dt-actions">
                          <ActionLink
                            className="dt-ib"
                            title="Attendance Record"
                            ariaLabel="Attendance Record"
                            onClick={() => openLogModal(log, 'attendance_record')}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                          <div className="dropdown">
                            <ActionLink
                              className="dt-ib"
                              title="More"
                              ariaLabel="More actions"
                              ariaExpanded={rowMenu === log.id}
                              onClick={() => setRowMenu(rowMenu === log.id ? null : log.id)}
                            >
                              <i className="ti ti-dots-vertical" />
                            </ActionLink>
                            <ul className={`dropdown-menu dropdown-menu-end p-2${rowMenu === log.id ? ' show' : ''}`}>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => openLogModal(log, 'user_information')}
                                >
                                  <i className="ti ti-user me-2" />
                                  User Information
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => {
                                    const device = devices.find((item) => item.name === log.device) ?? null;
                                    setRowMenu(null);
                                    if (device) openDeviceModal(device, 'device_config');
                                  }}
                                >
                                  <i className="ti ti-settings me-2" />
                                  Device Configuration
                                </button>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1 text-danger"
                                  onClick={() => openLogModal(log, 'delete')}
                                >
                                  <i className="ti ti-trash me-2" />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* /Attendance Log Grid */}

            {/* Empty state */}
            <div className={`text-center py-5${visible.length === 0 ? '' : ' d-none'}`} id="bio_empty">
              <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                <i className="ti ti-fingerprint-off fs-36" />
              </span>
              <h5 className="mb-1">No Attendance Logs Found</h5>
              <p className="text-muted mb-3">
                No scan matches the selected filters. Adjust the filters or run a manual sync.
              </p>
              <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={manualSync}>
                <i className="ti ti-refresh me-1" />
                Manual Sync
              </button>
            </div>
          </div>

          {/* System Alerts Offcanvas */}
          <Offcanvas
            open={alertsOpen}
            onClose={() => setAlertsOpen(false)}
            title="System Alerts"
            labelledById="system_alerts_lbl"
          >
            {systemAlerts.map((alert) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={alert.id}>
                <span className={`avatar avatar-sm bg-${alert.tint}-transparent text-${alert.tint} rounded flex-shrink-0`}>
                  <i className={alert.icon} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{alert.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{alert.detail}</span>
                </div>
                <span className={`badge badge-soft-${severityTone[alert.severity]}`}>{alert.severity}</span>
              </div>
            ))}
          </Offcanvas>
          {/* /System Alerts Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <BiometricModals
        active={activeModal}
        device={modalDevice}
        log={modalLog}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="bioToasts" />
    </>
  );
};

export default BiometricRfid;
