import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  CardWorkspaceShell,
  ExportMenu,
  PageHeader,
  useWorkspace,
} from '@components/workspace';
import type {
  BulkAction,
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import RouteModals from './modals/RouteModals';
import type { RouteDraft, RouteModalId } from './modals/RouteModals';
import type { RouteStatus, TransportRoute } from './data/transportRoutes.data';
import {
  DASH, TRANSPORT_DESK_PHONE, academicYearOptions, boardingPointOptions, dateKey,
  destinationOptions, distanceLabel, driverLabel, driverOptions, feeLabel, remarksOf,
  routeInfoOf, routeOptions, searchIndexOf, seatsOf, shiftOptions, statusIcon, statusOptions,
  statusPill, stopsInfoOf, studentsInfoOf, transportRoutes as initialRows, vehicleInfoOf,
  vehicleLabel, vehicleOptions, vehicleTypeLabel,
} from './data/transportRoutes.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'route', label: 'Route', kind: 'select', chipLabel: 'Route', options: routeOptions },
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', options: vehicleOptions },
  { id: 'driver', label: 'Driver', kind: 'select', chipLabel: 'Driver', options: driverOptions },
  { id: 'boarding-point', label: 'Boarding Point', kind: 'select', chipLabel: 'Boarding', options: boardingPointOptions },
  { id: 'destination', label: 'Destination', kind: 'select', chipLabel: 'Destination', options: destinationOptions },
  { id: 'shift', label: 'Shift', kind: 'select', chipLabel: 'Shift', options: shiftOptions },
  { id: 'route-status', label: 'Route Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Route Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'stops', label: 'Total Stops', icon: 'ti ti-map-pins' },
  { id: 'students', label: 'Assigned Students', icon: 'ti ti-users' },
  { id: 'fee', label: 'Monthly Fee', icon: 'ti ti-cash' },
  { id: 'updated', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: RouteStatus; label: string; icon: string }[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'In Service', label: 'In Service', icon: 'ti ti-bus' },
  { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar-event' },
  { id: 'Maintenance', label: 'Maintenance', icon: 'ti ti-tool' },
  { id: 'Suspended', label: 'Suspended', icon: 'ti ti-player-pause' },
];

const TransportRoutes = () => {
  const [rows, setRows] = useState<TransportRoute[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<RouteModalId | null>(null);
  const [modalRow, setModalRow] = useState<TransportRoute | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: TransportRoute | null, modal: RouteModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: TransportRoute) => TransportRoute, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<TransportRoute>[]>(
    () => [
      {
        id: 'route',
        label: 'Route',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-map-2 fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-ruler-2 me-1" />
                  <span className="dt-distance">{distanceLabel(row)}</span>
                </span>
              </div>
              <div className="fs-12 text-muted mt-1">
                <span className="dt-start"><i className="ti ti-map-pin me-1" />{row.boardingPoint}</span>{' '}
                <i className="ti ti-arrow-right mx-1" />{' '}
                <span className="dt-dest">{row.destination}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'transport',
        label: 'Transport Details',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-bus me-1" />
                <span className="dt-vehicle">{vehicleLabel(row)}</span>
              </span>{' '}
              <span className="badge badge-soft-secondary">{vehicleTypeLabel(row)}</span>
            </li>
            <li className="d-flex align-items-center gap-1 py-1">
              {row.driver ? (
                <span className="avatar avatar-xs">
                  <ImageWithBasePath
                    src={row.driverAvatar}
                    className="rounded-circle flex-shrink-0"
                    alt={row.driver}
                  />
                </span>
              ) : null}
              <span>
                <span className="text-muted">Driver</span>{' '}
                <span className="fw-medium text-dark dt-driver">{driverLabel(row)}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-clock-hour-4 me-1" />
              {row.shift} · <span className="fw-medium text-dark">{row.duration}</span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-success">
                <i className="ti ti-arrow-up me-1" />Pickup {row.pickup}
              </span>{' '}
              <span className="badge badge-soft-warning">
                <i className="ti ti-arrow-down me-1" />Drop {row.drop}
              </span>
            </li>
          </ul>
        ),
      },
      {
        id: 'info',
        label: 'Route Information',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-map-pins me-1" />
                <span className="dt-stops-val">{row.stops}</span> Stops
              </span>{' '}
              <span className="badge badge-soft-info">
                <i className="ti ti-users me-1" />
                <span className="dt-students-val">{row.students}</span> Students
              </span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-success">
                <i className="ti ti-cash me-1" />
                <span className="dt-fee-val">{feeLabel(row)}</span>/mo
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar me-1" />Year{' '}
              <span className="fw-medium text-dark">{row.academicYear}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-clock me-1" />Updated{' '}
              <span className="dt-updated fw-medium text-dark">{row.updated}</span>
            </li>
          </ul>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            {statusIcon[row.status]
              ? <i className={statusIcon[row.status] as string} />
              : <span className="dt-pill-dot" />}
            {row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<TransportRoute>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.route && row.name !== filters.route) return false;
      if (filters.vehicle && row.vehicle !== filters.vehicle) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters['boarding-point'] && row.boardingPoint !== filters['boarding-point']) return false;
      if (filters.destination && row.destination !== filters.destination) return false;
      if (filters.shift && row.shift !== filters.shift) return false;
      if (filters['route-status'] && row.status !== filters['route-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'stops':
          return b.stops - a.stops || a.name.localeCompare(b.name);
        case 'students':
          return b.students - a.students || a.name.localeCompare(b.name);
        case 'fee':
          return b.fee - a.fee || a.name.localeCompare(b.name);
        case 'updated':
          return dateKey(b.updated) - dateKey(a.updated);
        // Not in the sort menu, but the Status `<th>` is sortable.
        case 'status':
          return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'updated',
    pageSize: 10,
  });

  /** Counts follow the roster, so suspending a route moves both rails. */
  const countBy = useCallback(
    (status: RouteStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Routes', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const createRoute = useCallback(
    (draft: RouteDraft) => {
      if (!draft.name.trim()) {
        push('Give the route a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `RT-${String(rows.length + 1).padStart(2, '0')}`;
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          distanceKm: toNumber(draft.distanceKm, 0),
          boardingPoint: draft.boardingPoint,
          destination: draft.destination,
          vehicle: '',
          vehicleType: '',
          driver: '',
          driverAvatar: '',
          driverPhone: '',
          shift: draft.shift as TransportRoute['shift'],
          duration: draft.duration.trim() || DASH,
          pickup: draft.pickup.trim() || DASH,
          drop: draft.drop.trim() || DASH,
          stops: toNumber(draft.stops, 0),
          students: toNumber(draft.students, 0),
          fee: toNumber(draft.fee, 0),
          academicYear: draft.academicYear,
          updated: '12 May 2024',
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updateRoute = useCallback(
    (draft: RouteDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          code: draft.code.trim() || row.code,
          distanceKm: toNumber(draft.distanceKm, row.distanceKm),
          boardingPoint: draft.boardingPoint,
          destination: draft.destination,
          shift: draft.shift as TransportRoute['shift'],
          duration: draft.duration.trim() || row.duration,
          pickup: draft.pickup.trim() || row.pickup,
          drop: draft.drop.trim() || row.drop,
          stops: toNumber(draft.stops, row.stops),
          students: toNumber(draft.students, row.students),
          fee: toNumber(draft.fee, row.fee),
          academicYear: draft.academicYear,
          status: draft.status,
          updated: '12 May 2024',
        }),
        `${modalRow?.name ?? 'Route'} updated`,
      ),
    [modalRow, patchRow],
  );

  const assignVehicle = useCallback(
    (plate: string, type: string) => {
      if (!plate) {
        push('Pick a vehicle to assign', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          vehicle: plate,
          vehicleType: type,
          // A route with a vehicle and a driver is back in service.
          status: row.driver ? 'In Service' : row.status,
        }),
        `${plate} assigned to ${modalRow?.name ?? 'the route'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const assignDriver = useCallback(
    (driver: string, shift: string, contact: string) => {
      if (!driver) {
        push('Pick a driver to assign', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          driver,
          driverPhone: contact.trim() || row.driverPhone,
          shift: (shift || row.shift) as TransportRoute['shift'],
          status: row.vehicle ? 'In Service' : row.status,
        }),
        `${driver} assigned to ${modalRow?.name ?? 'the route'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const assignStudents = useCallback(
    (students: string[], _boardingStop: string, fee: string) => {
      if (students.length === 0) {
        push('Pick at least one student', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          students: row.students + students.length,
          fee: toNumber(fee, row.fee),
        }),
        `${students.length} ${students.length === 1 ? 'student' : 'students'} assigned`,
      );
    },
    [patchRow, push],
  );

  const saveSchedule = useCallback(
    (shift: string, duration: string, pickup: string, drop: string) =>
      patchRow(
        (row) => ({
          ...row,
          shift: (shift || row.shift) as TransportRoute['shift'],
          duration: duration.trim() || row.duration,
          pickup: pickup.trim() || row.pickup,
          drop: drop.trim() || row.drop,
        }),
        `Schedule saved for ${modalRow?.name ?? 'the route'}`,
      ),
    [modalRow, patchRow],
  );

  const addStop = useCallback(
    (name: string) => {
      if (!name.trim()) {
        push('Give the stop a name', 'warning');
        return;
      }
      // The generated stop list follows the count, so bumping it adds the stop.
      setRows((current) =>
        current.map((row) => (row.id === modalRow?.id ? { ...row, stops: row.stops + 1 } : row)),
      );
      push(`${name.trim()} added to ${modalRow?.name ?? 'the route'}`);
    },
    [modalRow, push],
  );

  const setStatus = useCallback(
    (ids: string[], status: RouteStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'route' : 'routes'} ${verb}`);
    },
    [push, workspace],
  );

  const removeRoutes = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'route' : 'routes'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} routes exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'vehicle', label: 'Assign Vehicle', icon: 'ti ti-bus', onClick: () => openModal(null, 'assign-vehicle') },
      { id: 'driver', label: 'Assign Driver', icon: 'ti ti-steering-wheel', onClick: () => openModal(null, 'assign-driver') },
      { id: 'sheet', label: 'Print Route Sheet', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} routes exported`) },
      { id: 'suspend', label: 'Suspend', icon: 'ti ti-player-pause', onClick: (ids) => setStatus(ids, 'Suspended', 'suspended') },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: TransportRoute) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Route" ariaLabel="View Route" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Route" ariaLabel="Edit Route" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Manage Stops" ariaLabel="Manage Stops" onClick={() => openModal(row, 'stops')}>
        <i className="ti ti-map-pins" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Students" ariaLabel="Assign Students" onClick={() => openModal(row, 'students')}>
        <i className="ti ti-users" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Vehicle" ariaLabel="Assign Vehicle" onClick={() => openModal(row, 'assign-vehicle')}>
        <i className="ti ti-bus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Driver" ariaLabel="Assign Driver" onClick={() => openModal(row, 'assign-driver')}>
        <i className="ti ti-steering-wheel" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Route Schedule" ariaLabel="Route Schedule" onClick={() => openModal(row, 'schedule')}>
        <i className="ti ti-calendar-time" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Route Sheet" ariaLabel="Print Route Sheet" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Suspend Route" ariaLabel="Suspend Route"
        onClick={() => setStatus([row.id], 'Suspended', 'suspended')}
      >
        <i className="ti ti-player-pause" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete Route" ariaLabel="Delete Route" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: TransportRoute) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium">
            <i className="ti ti-map-2" />Complete Route Information
          </h4>
          <p className="fs-12 text-muted mb-3">{routeInfoOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-map-pins" />Pickup &amp; Drop Stops</h5>
          <p className="fs-12 text-muted mb-0">{stopsInfoOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-users" />Assigned Students</h6>
          <p className="fs-12 text-muted mb-3">{studentsInfoOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-bus" />Vehicle Details</h6>
          <p className="fs-12 text-muted mb-0">
            {vehicleInfoOf(row)}
            {row.vehicleType ? ` Seats ${seatsOf(row.vehicleType)}.` : ''}
          </p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-steering-wheel" />Driver Information</h6>
          {row.driver ? (
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="avatar avatar-sm">
                <ImageWithBasePath src={row.driverAvatar} className="rounded-circle flex-shrink-0" alt={row.driver} />
              </span>
              <div>
                <span className="fw-medium d-block fs-13">{row.driver}</span>
                <span className="fs-12 text-muted">License · Verified</span>
              </div>
            </div>
          ) : (
            <p className="fs-12 text-muted mb-3">No driver assigned.</p>
          )}
          <h6 className="details-heading"><i className="ti ti-calendar-time" />Route Schedule</h6>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Morning Pickup</span>
              <span className="fw-medium">{row.pickup}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Evening Drop</span>
              <span className="fw-medium">{row.drop}</span>
            </li>
          </ul>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-urgent" />Emergency Contacts</h6>
          <ul className="list-unstyled fs-12 text-muted mb-3">
            <li className="py-1">
              <i className="ti ti-phone me-1" />Driver {row.driverPhone || DASH}
            </li>
            <li className="py-1">
              <i className="ti ti-headset me-1" />Transport Desk {TRANSPORT_DESK_PHONE}
            </li>
          </ul>
          <h6 className="details-heading"><i className="ti ti-notes" />Remarks</h6>
          <p className="fs-12 text-muted mb-2">{remarksOf(row)}</p>
          <div className="d-flex gap-2">
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />View
            </button>
            <button
              type="button" className="btn btn-primary btn-sm flex-fill"
              onClick={() => openModal(row, 'stops')}
            >
              <i className="ti ti-map-pins me-1" />Stops
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Routes"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Routes
                  </ActionLink>
                </div>
                <ExportMenu label="Export Routes" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-2" />Print Route Sheet
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Route
                  </ActionLink>
                </div>
              </>
            }
          />

          <CardWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="classWorkspace"
            searchPlaceholder="Search routes, code, vehicle, driver or stop…"
            searchLabel="Search routes"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="routes"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Routes refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Route Sheet"
                aria-label="Print Route Sheet"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer" />
              </button>
            }
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-map-off"
            emptyTitle="No routes match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Transport route list with vehicle, driver, route information and status"
            selectAllLabel="Select all routes"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <RouteModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onCreate={createRoute}
        onUpdate={updateRoute}
        onAssignVehicle={assignVehicle}
        onAssignDriver={assignDriver}
        onAssignStudents={assignStudents}
        onSaveSchedule={saveSchedule}
        onAddStop={addStop}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onDelete={removeRoutes}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default TransportRoutes;
