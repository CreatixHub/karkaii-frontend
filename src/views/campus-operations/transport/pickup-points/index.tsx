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
import PickupPointModals from './modals/PickupPointModals';
import type {
  PickupDraft,
  PickupModalId,
  RoutePlan,
  SchedulePlan,
  StudentAssignment,
  VehicleAssignment,
} from './modals/PickupPointModals';
import type { PickupPoint, PickupStatus } from './data/pickupPoints.data';
import {
  academicYearOf, academicYearOptions, areaOptions, assignedStudentsOf, boardingBucket,
  boardingOptions, dateKey, descriptionOf, distanceLabel, driverOptions, feeLabel,
  fullAddressOf, hasDriver, pickupPoints as initialRows, pointOptions, remarksOf,
  routeOptions, searchIndexOf, statusIcon, statusOptions, statusPill, transportDeskPhone,
  vehicleCrew, vehicleInfoOf, vehicleOptions, zoneOptions,
} from './data/pickupPoints.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'route', label: 'Route', kind: 'select', chipLabel: 'Route', options: routeOptions },
  { id: 'pickup-point', label: 'Pickup Point', kind: 'select', chipLabel: 'Point', options: pointOptions },
  { id: 'area', label: 'Area', kind: 'select', chipLabel: 'Area', options: areaOptions },
  { id: 'zone', label: 'Zone', kind: 'select', chipLabel: 'Zone', options: zoneOptions },
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', options: vehicleOptions },
  { id: 'driver', label: 'Driver', kind: 'select', chipLabel: 'Driver', options: driverOptions },
  {
    id: 'boarding-time', label: 'Boarding Time', kind: 'select', chipLabel: 'Boarding',
    // The template's blank option here reads "Any", not "All".
    allLabel: 'Any', options: boardingOptions,
  },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Pickup Point (A–Z)', icon: 'ti ti-abc' },
  { id: 'route', label: 'Route', icon: 'ti ti-map-2' },
  { id: 'students', label: 'Assigned Students', icon: 'ti ti-users' },
  { id: 'fee', label: 'Monthly Fee', icon: 'ti ti-cash' },
  { id: 'updated', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The two rails share these statuses; the quick rail shortens one label. */
const rails: { id: PickupStatus; label: string; quickLabel: string; icon: string }[] = [
  { id: 'Active', label: 'Active', quickLabel: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Available', label: 'Available', quickLabel: 'Available', icon: 'ti ti-map-pin' },
  { id: 'Temporarily Closed', label: 'Temporarily Closed', quickLabel: 'Closed', icon: 'ti ti-ban' },
  { id: 'Maintenance', label: 'Maintenance', quickLabel: 'Maintenance', icon: 'ti ti-tool' },
  { id: 'Inactive', label: 'Inactive', quickLabel: 'Inactive', icon: 'ti ti-circle-off' },
];

const TransportPickupPoints = () => {
  const [rows, setRows] = useState<PickupPoint[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<PickupModalId | null>(null);
  const [modalRow, setModalRow] = useState<PickupPoint | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: PickupPoint | null, modal: PickupModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: PickupPoint) => PickupPoint, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<PickupPoint>[]>(
    () => [
      {
        id: 'point',
        label: 'Pickup Point',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-map-pin fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="dt-route">{row.route}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className="badge badge-soft-primary">
                  <i className="ti ti-map-2 me-1" /><span className="dt-area">{row.area}</span>
                </span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-current-location me-1" />{row.zone}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'location',
        label: 'Location Details',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              <i className="ti ti-map-pin me-1" /><span className="dt-address">{row.address}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-building-arch me-1" />Landmark:{' '}
              <span className="fw-medium text-dark">{row.landmark}</span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-success">
                <i className="ti ti-arrow-up me-1" />Board <span className="dt-boarding">{row.boarding}</span>
              </span>{' '}
              <span className="badge badge-soft-warning">
                <i className="ti ti-arrow-down me-1" />Drop {row.drop}
              </span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-secondary">
                <i className="ti ti-ruler-2 me-1" />
                <span className="dt-distance">{distanceLabel(row)}</span> from school
              </span>
            </li>
          </ul>
        ),
      },
      {
        id: 'assign',
        label: 'Assignment Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-bus me-1" /><span className="dt-vehicle">{row.vehicle}</span>
              </span>
            </li>
            <li className="d-flex align-items-center gap-1 py-1">
              {hasDriver(row) ? (
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
                <span className="fw-medium text-dark dt-driver">
                  {hasDriver(row) ? row.driver : 'No driver'}
                </span>
              </span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-info">
                <i className="ti ti-users me-1" />
                <span className="dt-students-val">{row.students}</span> Students
              </span>{' '}
              <span className="badge badge-soft-success">
                <i className="ti ti-cash me-1" />
                <span className="dt-fee-val">{feeLabel(row)}</span>/mo
              </span>
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

  const workspace = useWorkspace<PickupPoint>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.route && row.route !== filters.route) return false;
      if (filters['pickup-point'] && row.name !== filters['pickup-point']) return false;
      if (filters.area && row.area !== filters.area) return false;
      if (filters.zone && row.zone !== filters.zone) return false;
      if (filters.vehicle && row.vehicle !== filters.vehicle) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters['boarding-time'] && boardingBucket(row) !== filters['boarding-time']) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['academic-year'] && academicYearOf(row) !== filters['academic-year']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'route':
          return a.route.localeCompare(b.route) || a.name.localeCompare(b.name);
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

  const countBy = useCallback(
    (status: PickupStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Pickup Points', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ id: rail.id, label: rail.label, icon: rail.icon, count: countBy(rail.id) })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => rails.map((rail) => ({ id: rail.id, label: rail.quickLabel, icon: rail.icon, count: countBy(rail.id) })),
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  /** A vehicle brings its crew; the template's own vehicle→driver pairing. */
  const crewFor = (plate: string) => vehicleCrew[plate] ?? { driver: '', avatar: '' };

  const createPoint = useCallback(
    (draft: PickupDraft) => {
      if (!draft.name.trim()) {
        push('Give the pickup point a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `PP-${String(rows.length + 1).padStart(3, '0')}`;
      const crew = crewFor(draft.vehicle);
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          route: draft.route,
          area: draft.area,
          zone: draft.zone,
          address: draft.address.trim() || '—',
          landmark: draft.landmark.trim() || '—',
          boarding: draft.boarding.trim() || '—',
          drop: draft.drop.trim() || '—',
          distance: toNumber(draft.distance, 0),
          vehicle: draft.vehicle || '—',
          driver: draft.driver || crew.driver,
          driverPhone: '',
          driverAvatar: crew.avatar,
          students: 0,
          fee: toNumber(draft.fee, 0),
          updated: '12 May 2024',
          status: draft.active ? 'Active' : 'Inactive',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updatePoint = useCallback(
    (draft: PickupDraft) =>
      patchRow(
        (row) => {
          const crew = draft.vehicle && draft.vehicle !== row.vehicle ? crewFor(draft.vehicle) : null;
          return {
            ...row,
            name: draft.name.trim() || row.name,
            code: draft.code.trim() || row.code,
            route: draft.route,
            area: draft.area,
            zone: draft.zone,
            address: draft.address.trim() || row.address,
            landmark: draft.landmark.trim() || row.landmark,
            boarding: draft.boarding.trim() || row.boarding,
            drop: draft.drop.trim() || row.drop,
            distance: toNumber(draft.distance, row.distance),
            vehicle: draft.vehicle || row.vehicle,
            driver: crew ? crew.driver : draft.driver || row.driver,
            driverAvatar: crew ? crew.avatar : row.driverAvatar,
            fee: toNumber(draft.fee, row.fee),
            // The template's Status toggle only switches Active/Inactive.
            status: draft.active
              ? (row.status === 'Inactive' ? 'Active' : row.status)
              : 'Inactive',
            updated: '12 May 2024',
          };
        },
        `${modalRow?.name ?? 'Pickup point'} updated`,
      ),
    [modalRow, patchRow],
  );

  const assignStudents = useCallback(
    (assignment: StudentAssignment) => {
      if (assignment.students.length === 0) {
        push('Pick at least one student', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          students: row.students + assignment.students.length,
          boarding: assignment.boarding.trim() || row.boarding,
          fee: toNumber(assignment.fee, row.fee),
        }),
        `${assignment.students.length} ${assignment.students.length === 1 ? 'student' : 'students'} assigned`,
      );
    },
    [patchRow, push],
  );

  const assignVehicle = useCallback(
    (assignment: VehicleAssignment) => {
      if (!assignment.vehicle) {
        push('Pick a vehicle to assign', 'warning');
        return;
      }
      const crew = crewFor(assignment.vehicle);
      patchRow(
        (row) => ({
          ...row,
          vehicle: assignment.vehicle,
          driver: crew.driver || row.driver,
          driverAvatar: crew.avatar || row.driverAvatar,
          boarding: assignment.boarding.trim() || row.boarding,
          status: row.status === 'Available' ? 'Active' : row.status,
        }),
        `${assignment.vehicle} assigned to ${modalRow?.name ?? 'the stop'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const saveSchedule = useCallback(
    (plan: SchedulePlan) =>
      patchRow(
        (row) => ({
          ...row,
          boarding: plan.boarding.trim() || row.boarding,
          drop: plan.drop.trim() || row.drop,
        }),
        `Schedule saved for ${modalRow?.name ?? 'the stop'}`,
      ),
    [modalRow, patchRow],
  );

  const assignRoute = useCallback(
    (plan: RoutePlan) =>
      patchRow(
        (row) => ({
          ...row,
          route: plan.route || row.route,
          zone: plan.zone || row.zone,
        }),
        `${modalRow?.name ?? 'Pickup point'} moved to ${plan.route}`,
      ),
    [modalRow, patchRow],
  );

  const setStatus = useCallback(
    (ids: string[], status: PickupStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'pickup point' : 'pickup points'} ${verb}`);
    },
    [push, workspace],
  );

  const removePoints = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'pickup point' : 'pickup points'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} pickup points exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'students', label: 'Assign Students', icon: 'ti ti-users', onClick: () => openModal(null, 'assign-students') },
      { id: 'vehicle', label: 'Assign Vehicle', icon: 'ti ti-bus', onClick: () => openModal(null, 'assign-vehicle') },
      { id: 'list', label: 'Print Pickup List', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} pickup points exported`) },
      { id: 'close', label: 'Close Temporarily', icon: 'ti ti-ban', onClick: (ids) => setStatus(ids, 'Temporarily Closed', 'closed') },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: PickupPoint) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Pickup Point" ariaLabel="View Pickup Point" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Pickup Point" ariaLabel="Edit Pickup Point" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Students" ariaLabel="Assign Students" onClick={() => openModal(row, 'assign-students')}>
        <i className="ti ti-users" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Vehicle" ariaLabel="Assign Vehicle" onClick={() => openModal(row, 'assign-vehicle')}>
        <i className="ti ti-bus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Manage Schedule" ariaLabel="Manage Schedule" onClick={() => openModal(row, 'schedule')}>
        <i className="ti ti-calendar-time" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Route Assignment" ariaLabel="Route Assignment" onClick={() => openModal(row, 'route')}>
        <i className="ti ti-map-2" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Pickup List" ariaLabel="Print Pickup List" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Close Temporarily" ariaLabel="Close Temporarily"
        onClick={() => setStatus([row.id], 'Temporarily Closed', 'closed')}
      >
        <i className="ti ti-ban" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete Pickup Point" ariaLabel="Delete Pickup Point" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: PickupPoint) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium">
            <i className="ti ti-map-pin" />Pickup Point Description
          </h4>
          <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-map-2" />Complete Address</h5>
          <p className="fs-12 text-muted mb-0">{fullAddressOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-users" />Assigned Students</h6>
          <p className="fs-12 text-muted mb-3">{assignedStudentsOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-bus" />Vehicle Information</h6>
          <p className="fs-12 text-muted mb-0">{vehicleInfoOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-steering-wheel" />Driver Information</h6>
          {hasDriver(row) ? (
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
          <h6 className="details-heading"><i className="ti ti-calendar-time" />Pickup Schedule</h6>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Morning Boarding</span>
              <span className="fw-medium">{row.boarding}</span>
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
              <i className="ti ti-phone me-1" />Driver {row.driverPhone || '—'}
            </li>
            <li className="py-1">
              <i className="ti ti-headset me-1" />Transport Desk {transportDeskPhone}
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
              onClick={() => openModal(row, 'assign-students')}
            >
              <i className="ti ti-users me-1" />Students
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
            title="Pickup Points"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Pickup Points
                  </ActionLink>
                </div>
                <ExportMenu label="Export Pickup Points" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-2" />Print Pickup List
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Pickup Point
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
            searchPlaceholder="Search pickup points, code, route, area or driver…"
            searchLabel="Search pickup points"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="pickup points"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Pickup points refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Pickup List"
                aria-label="Print Pickup List"
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
            emptyIcon="ti ti-map-pin-off"
            emptyTitle="No pickup points match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Pickup point list with location, assignment details and status"
            selectAllLabel="Select all pickup points"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <PickupPointModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onCreate={createPoint}
        onUpdate={updatePoint}
        onAssignStudents={assignStudents}
        onAssignVehicle={assignVehicle}
        onSaveSchedule={saveSchedule}
        onAssignRoute={assignRoute}
        onDelete={removePoints}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default TransportPickupPoints;
