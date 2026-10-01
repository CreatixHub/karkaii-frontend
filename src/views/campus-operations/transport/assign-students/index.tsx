import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  WorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AssignStudentModals from './modals/AssignStudentModals';
import type { StudentAssignDraft, StudentModalId, SwapResult } from './modals/AssignStudentModals';
import type { AssignmentStatus, StudentAssignment } from './data/studentAssignments.data';
import {
  NOT_ASSIGNED, academicYearOptions, classOf, classOptions, driverLabel,
  feeBadge, feeOptions, feeState, isAssigned, pickupPointOptions, routeLabel, routeOptions,
  searchIndexOf, sectionOf, sectionOptions, statusBadge, statusIcon, statusOptions, statusPill,
  studentAssignments as initialRows, vehicleCapacity, vehicleLabel, vehicleOptions,
} from './data/studentAssignments.data';

const routes = all_routes;

/**
 * Ids are the template's own. Academic Year and Assignment Status open already
 * committed, which is what puts the two chips on the rail at load.
 */
const filterFields: FilterField[] = [
  {
    id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year',
    options: academicYearOptions, initialValue: '2026 / 2027',
  },
  {
    id: 'assignment-status', label: 'Assignment Status', kind: 'select', chipLabel: 'Status',
    options: statusOptions, initialValue: 'Assigned',
  },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'route', label: 'Route', kind: 'select', chipLabel: 'Route', options: routeOptions },
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', options: vehicleOptions },
  { id: 'pickup-point', label: 'Pickup Point', kind: 'select', chipLabel: 'Pickup', options: pickupPointOptions },
  { id: 'transport-fee', label: 'Transport Fee', kind: 'select', chipLabel: 'Fee', options: feeOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'route', label: 'Route', icon: 'ti ti-route' },
  { id: 'vehicle', label: 'Vehicle', icon: 'ti ti-bus' },
  { id: 'pickup', label: 'Pickup point', icon: 'ti ti-map-pin' },
  { id: 'class', label: 'Class & section', icon: 'ti ti-school' },
];

const AssignStudents = () => {
  const [rows, setRows] = useState<StudentAssignment[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<StudentModalId | null>(null);
  const [modalRow, setModalRow] = useState<StudentAssignment | null>(null);
  const [panelRow, setPanelRow] = useState<StudentAssignment | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: StudentAssignment | null, modal: StudentModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: StudentAssignment) => StudentAssignment, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<StudentAssignment>[]>(
    () => [
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.photo} alt={row.name} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">{row.roll}</div>
            </div>
          </div>
        ),
      },
      { id: 'admission', label: 'Admission No.', cellClassName: 'fs-13', render: (row) => row.admissionNo },
      { id: 'class', label: 'Class', sortable: true, render: (row) => row.className },
      {
        id: 'route',
        label: 'Route',
        sortable: true,
        render: (row) =>
          isAssigned(row) ? (
            <>
              <span className={`badge badge-soft-${row.routeTint}`}>{row.routeCode}</span>
              <span className="d-block fs-12 text-muted mt-1">{row.routeName}</span>
            </>
          ) : (
            <span className="badge badge-soft-secondary">{NOT_ASSIGNED}</span>
          ),
      },
      {
        id: 'vehicle',
        label: 'Vehicle',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium">{vehicleLabel(row)}</span>
            <span className="fs-12 text-muted">{row.vehicleSeats || 'Awaiting a unit'}</span>
          </>
        ),
      },
      {
        id: 'driver',
        label: 'Driver',
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium">{driverLabel(row)}</span>
            <span className="fs-12 text-muted">{row.driverCode || '—'}</span>
          </>
        ),
      },
      {
        id: 'pickup',
        label: 'Pickup Point',
        cellClassName: 'fs-13',
        render: (row) => (
          <>
            <i className="ti ti-map-pin text-muted me-1" />{row.pickupPoint}
          </>
        ),
      },
      { id: 'drop', label: 'Drop Point', cellClassName: 'fs-13', render: (row) => row.dropPoint },
      {
        id: 'seat',
        label: 'Seat No.',
        render: (row) => <span className="badge badge-soft-secondary">{row.seatNo}</span>,
      },
      {
        id: 'fee',
        label: 'Transport Fee',
        align: 'end',
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium">{row.fee}</span>
            <span className="fs-12 text-muted">{row.feeNote}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
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

  const workspace = useWorkspace<StudentAssignment>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['assignment-status'] && row.status !== filters['assignment-status']) return false;
      if (filters.class && classOf(row) !== filters.class) return false;
      if (filters.section && sectionOf(row) !== filters.section) return false;
      if (filters.route) {
        const wanted = filters.route;
        if (wanted === NOT_ASSIGNED ? isAssigned(row) : routeLabel(row) !== wanted) return false;
      }
      if (filters.vehicle && row.vehicle !== filters.vehicle) return false;
      if (filters['pickup-point'] && row.pickupPoint !== filters['pickup-point']) return false;
      if (filters['transport-fee'] && feeState(row) !== filters['transport-fee']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      switch (quick) {
        case null: return true;
        case 'assigned': return row.status === 'Assigned';
        case 'awaiting': return row.status === 'Awaiting Assignment';
        case 'closing': return row.status === 'Route Closing';
        case 'overdue': return feeState(row) === 'Overdue';
        case 'seats': return !isAssigned(row);
        default: return true;
      }
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'assigned': return row.status === 'Assigned';
        case 'awaiting': return row.status === 'Awaiting Assignment';
        case 'overdue': return feeState(row) === 'Overdue';
        case 'closing': return row.status === 'Route Closing';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'route': return routeLabel(a).localeCompare(routeLabel(b)) || a.name.localeCompare(b.name);
        case 'vehicle': return vehicleLabel(a).localeCompare(vehicleLabel(b)) || a.name.localeCompare(b.name);
        case 'pickup': return a.pickupPoint.localeCompare(b.pickupPoint) || a.name.localeCompare(b.name);
        case 'class': return a.className.localeCompare(b.className) || a.name.localeCompare(b.name);
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
    // The template renders the Assigned quick filter already lit.
    defaultQuick: 'assigned',
    pageSize: 8,
  });

  /* --------------------------------- Rails ---------------------------------- */

  const countBy = useCallback(
    (status: AssignmentStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const overdueCount = useMemo(
    () => rows.filter((row) => feeState(row) === 'Overdue').length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Students', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'assigned', label: 'Assigned', icon: 'ti ti-circle-check', count: countBy('Assigned') },
      { id: 'awaiting', label: 'Awaiting Assignment', icon: 'ti ti-clock', count: countBy('Awaiting Assignment') },
      { id: 'overdue', label: 'Fee Overdue', icon: 'ti ti-alert-triangle', count: overdueCount },
      { id: 'closing', label: 'Route Closing Soon', icon: 'ti ti-route', count: countBy('Route Closing') },
    ],
    [countBy, overdueCount, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'assigned', label: 'Assigned', icon: 'ti ti-circle-check', count: countBy('Assigned') },
      { id: 'awaiting', label: 'Awaiting', icon: 'ti ti-clock', count: countBy('Awaiting Assignment') },
      { id: 'closing', label: 'Route Closing', icon: 'ti ti-route', count: countBy('Route Closing') },
      { id: 'overdue', label: 'Fee Overdue', icon: 'ti ti-alert-triangle', count: overdueCount },
      {
        id: 'seats', label: 'Seats Free', icon: 'ti ti-armchair',
        count: rows.filter((row) => !isAssigned(row)).length,
      },
    ],
    [countBy, overdueCount, rows],
  );

  /** Tiles derive from the roster, so an assignment or removal moves them. */
  const summary = useMemo<SummaryItem[]>(() => {
    const assigned = rows.filter(isAssigned);
    const activeRoutes = new Set(assigned.map((row) => row.routeCode));
    const vehicles = new Set(assigned.map((row) => row.vehicle).filter(Boolean));
    const seats = assigned.reduce((total, row) => total + vehicleCapacity(row), 0);
    return [
      {
        id: 'assigned', tint: 'primary', icon: 'ti ti-users', label: 'Assigned Students',
        value: String(assigned.length), hint: `across ${activeRoutes.size} routes`,
      },
      {
        id: 'routes', tint: 'success', icon: 'ti ti-route', label: 'Active Routes',
        value: String(activeRoutes.size), hint: `${vehicles.size} vehicles running`,
      },
      {
        id: 'vehicles', tint: 'info', icon: 'ti ti-bus', label: 'Assigned Vehicles',
        value: String(vehicles.size), hint: 'in service today',
      },
      {
        id: 'waiting', tint: 'warning', icon: 'ti ti-clock', label: 'Waiting for Assignment',
        value: String(rows.filter((row) => !isAssigned(row)).length), hint: 'pending allocation',
      },
      {
        id: 'seats', tint: 'secondary', icon: 'ti ti-armchair', label: 'Available Seats',
        value: String(Math.max(0, seats - assigned.length)), hint: `of ${seats} total`,
      },
    ];
  }, [rows]);

  /* -------------------------------- Mutations ------------------------------- */

  const splitRoute = (value: string): { routeCode: string; routeName: string } => {
    const [code, name] = value.split(' · ');
    return { routeCode: code ?? '', routeName: name ?? '' };
  };

  /** A route brings the vehicle, driver and seat count already on it. */
  const unitFor = useCallback(
    (routeCode: string) => rows.find((row) => row.routeCode === routeCode && row.vehicle),
    [rows],
  );

  const assignStudent = useCallback(
    (draft: StudentAssignDraft) => {
      if (!draft.student) {
        push('Pick a student to assign', 'warning');
        return;
      }
      if (!draft.route) {
        push('Pick a route', 'warning');
        return;
      }
      const { routeCode, routeName } = splitRoute(draft.route);
      const unit = unitFor(routeCode);
      setRows((current) =>
        current.map((row) =>
          row.id === draft.student
            ? {
                ...row,
                routeCode,
                routeName,
                routeTint: unit?.routeTint ?? 'primary',
                vehicle: draft.vehicle || unit?.vehicle || '',
                vehicleSeats: unit?.vehicleSeats ?? '',
                driver: unit?.driver ?? '',
                driverCode: unit?.driverCode ?? '',
                pickupPoint: draft.pickupPoint || row.pickupPoint,
                dropPoint: draft.dropPoint,
                seatNo: draft.seatNo.trim() || '—',
                status: 'Assigned',
              }
            : row,
        ),
      );
      setActiveModal(null);
      const student = rows.find((row) => row.id === draft.student);
      push(`${student?.name ?? 'Student'} assigned to ${draft.route}`);
    },
    [push, rows, unitFor],
  );

  const changeRoute = useCallback(
    (result: SwapResult) => {
      if (!result.value) {
        push('Pick a route', 'warning');
        return;
      }
      if (result.value === NOT_ASSIGNED) {
        patchRow(
          (row) => ({
            ...row,
            routeCode: '', routeName: '', vehicle: '', vehicleSeats: '',
            driver: '', driverCode: '', dropPoint: '—', seatNo: '—',
            status: 'Awaiting Assignment',
          }),
          `${modalRow?.name ?? 'Student'} returned to the waiting list`,
        );
        return;
      }
      const { routeCode, routeName } = splitRoute(result.value);
      const unit = unitFor(routeCode);
      patchRow(
        (row) => ({
          ...row,
          routeCode,
          routeName,
          routeTint: unit?.routeTint ?? row.routeTint,
          vehicle: unit?.vehicle ?? row.vehicle,
          vehicleSeats: unit?.vehicleSeats ?? row.vehicleSeats,
          driver: unit?.driver ?? row.driver,
          driverCode: unit?.driverCode ?? row.driverCode,
          status: 'Assigned',
        }),
        `${modalRow?.name ?? 'Student'} moved to ${result.value}`,
      );
    },
    [modalRow, patchRow, push, unitFor],
  );

  const changeVehicle = useCallback(
    (result: SwapResult) => {
      if (!result.value) {
        push('Pick a vehicle', 'warning');
        return;
      }
      const unit = rows.find((row) => row.vehicle === result.value);
      patchRow(
        (row) => ({
          ...row,
          vehicle: result.value,
          vehicleSeats: unit?.vehicleSeats ?? row.vehicleSeats,
          driver: unit?.driver ?? row.driver,
          driverCode: unit?.driverCode ?? row.driverCode,
        }),
        `${modalRow?.name ?? 'Student'} moved to ${result.value}`,
      );
    },
    [modalRow, patchRow, push, rows],
  );

  const changePickup = useCallback(
    (result: SwapResult) => {
      if (!result.value) {
        push('Pick a pickup point', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          pickupPoint: result.value,
          // The template's own flow: a granted stop change clears the request.
          status: row.status === 'Stop Change Requested' ? 'Assigned' : row.status,
        }),
        `${modalRow?.name ?? 'Student'} now boards at ${result.value}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const removeAssignment = useCallback(
    () =>
      patchRow(
        (row) => ({
          ...row,
          routeCode: '', routeName: '', vehicle: '', vehicleSeats: '',
          driver: '', driverCode: '', dropPoint: '—', seatNo: '—',
          status: 'Awaiting Assignment',
        }),
        `${modalRow?.name ?? 'Student'} removed from the route`,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} students exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: StudentAssignment) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View assignment" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change route" onClick={() => openModal(row, 'change-route')}>
        <i className="ti ti-route" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change vehicle" onClick={() => openModal(row, 'change-vehicle')}>
        <i className="ti ti-bus" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change pickup point" onClick={() => openModal(row, 'change-pickup')}>
        <i className="ti ti-map-pin" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Assignment panel" onClick={() => setPanelRow(row)}>
        <i className="ti ti-layout-sidebar-right-expand" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Remove assignment" onClick={() => openModal(row, 'remove')}>
        <i className="ti ti-trash" />
      </ActionLink>
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) => (
    <>
      {pairs.map((item, index) => (
        <div
          className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
          key={item.label}
        >
          <span className="fs-13 text-muted">{item.label}</span>
          <span className="fs-13 fw-medium text-end">{item.value}</span>
        </div>
      ))}
    </>
  );

  const renderDetail = (row: StudentAssignment) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Student Details</h6>
        {pairList([
          { label: 'Admission No.', value: row.admissionNo },
          { label: 'Roll', value: row.roll },
          { label: 'Class', value: row.className },
          { label: 'Academic Year', value: row.academicYear },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-route text-info me-1" />Route &amp; Vehicle</h6>
        {pairList([
          { label: 'Route', value: routeLabel(row) },
          { label: 'Vehicle', value: vehicleLabel(row) },
          { label: 'Driver', value: driverLabel(row) },
          { label: 'Seat No.', value: row.seatNo },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-map-pin text-warning me-1" />Stops</h6>
        {pairList([
          { label: 'Pickup Point', value: row.pickupPoint },
          { label: 'Drop Point', value: row.dropPoint },
        ])}
        <h6 className="fs-14 mb-3 mt-3"><i className="ti ti-cash text-success me-1" />Transport Fee</h6>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="fs-13 fw-medium d-block">{row.fee}</span>
            <span className="fs-12 text-muted">{row.feeNote}</span>
          </div>
          <span className={feeBadge[feeState(row)]}>{feeState(row)}</span>
        </div>
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'view')}>
            <i className="ti ti-eye me-1" />View
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'change-route')}>
            <i className="ti ti-route me-1" />Change Route
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-layout-sidebar-right-expand me-1" />Panel
          </button>
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
            title="Assign Students"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Route Manifest" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'assign')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Assign Students
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            workspaceId="taWorkspace"
            searchPlaceholder="Search students, admission no, route or pickup point…"
            searchLabel="Search students"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="students"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Assignments refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-users-off"
            emptyTitle="No students match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Assignment Panel Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Assignment Details"
            labelledById="ta_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg">
                    <ImageWithBasePath src={panelRow.photo} className="rounded" alt={panelRow.name} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.admissionNo} · {panelRow.className}
                    </span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Route &amp; Vehicle</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Route', value: routeLabel(panelRow) },
                    { label: 'Vehicle', value: vehicleLabel(panelRow) },
                    { label: 'Driver', value: driverLabel(panelRow) },
                    { label: 'Seat No.', value: panelRow.seatNo },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Stops</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Pickup Point', value: panelRow.pickupPoint },
                    { label: 'Drop Point', value: panelRow.dropPoint },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Transport Fee</h6>
                <div className="border rounded p-3 mb-3 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fs-13 fw-medium d-block">{panelRow.fee}</span>
                    <span className="fs-12 text-muted">{panelRow.feeNote}</span>
                  </div>
                  <span className={feeBadge[feeState(panelRow)]}>{feeState(panelRow)}</span>
                </div>

                <h6 className="fs-14 mb-2">Internal Notes</h6>
                <p className="fs-13 text-muted">{panelRow.notes}</p>

                <div className="d-flex gap-2">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'change-route'); }}
                  >
                    <i className="ti ti-route me-1" />Change Route
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'change-pickup'); }}
                  >
                    <i className="ti ti-map-pin me-1" />Change Stop
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Assignment Panel Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <AssignStudentModals
        active={activeModal}
        row={modalRow}
        waiting={rows.filter((row) => !isAssigned(row))}
        onClose={() => setActiveModal(null)}
        onAssign={assignStudent}
        onChangeRoute={changeRoute}
        onChangeVehicle={changeVehicle}
        onChangePickup={changePickup}
        onRemove={removeAssignment}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="taToasts" />
    </>
  );
};

export default AssignStudents;
