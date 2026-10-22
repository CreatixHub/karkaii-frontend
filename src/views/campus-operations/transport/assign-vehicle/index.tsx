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
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AssignVehicleModals from './modals/AssignVehicleModals';
import type { AssignModalId, AssignmentDraft, SwapResult } from './modals/AssignVehicleModals';
import type { AssignmentStatus, RouteType, VehicleAssignment } from './data/vehicleAssignments.data';
import {
  NOT_ASSIGNED, academicYearOptions, assignmentLabel, capacityLabel, codeKey, completeness,
  completenessOptions, driverLabel, driverOptions, hasDriver, hasRoute, hasVehicle, isComplete,
  occupancyBand, occupancyOptions, occupancyPct, routeLabel, routeOptions, routeTypeOptions,
  searchIndexOf, seatsFree, statusBadge, statusIcon, statusOptions, statusPill, studentsLabel,
  vehicleAssignments as initialRows, vehicleLabel, vehicleOptions,
} from './data/vehicleAssignments.data';

const routes = all_routes;

/**
 * Ids are the template's own. Academic Year and Assignment Status open already
 * committed, which is what puts the two chips on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', options: vehicleOptions },
  { id: 'driver', label: 'Driver', kind: 'select', chipLabel: 'Driver', options: driverOptions },
  { id: 'route', label: 'Route', kind: 'select', chipLabel: 'Route', options: routeOptions },
  {
    id: 'assignment-status', label: 'Assignment Status', kind: 'select', chipLabel: 'Status',
    options: statusOptions, initialValue: 'Active',
  },
  {
    id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year',
    options: academicYearOptions, initialValue: '2026 / 2027',
  },
  { id: 'route-type', label: 'Route Type', kind: 'select', chipLabel: 'Route type', options: routeTypeOptions },
  { id: 'occupancy', label: 'Occupancy', kind: 'select', chipLabel: 'Occupancy', options: occupancyOptions },
  { id: 'unit-completeness', label: 'Unit Completeness', kind: 'select', chipLabel: 'Unit', options: completenessOptions },
];

const sortOptions: SortOption[] = [
  { id: 'code', label: 'Assignment ID', icon: 'ti ti-hash' },
  { id: 'vehicle', label: 'Vehicle number', icon: 'ti ti-bus' },
  { id: 'driver', label: 'Driver name', icon: 'ti ti-steering-wheel' },
  { id: 'route', label: 'Route code', icon: 'ti ti-route' },
  { id: 'seats', label: 'Seats free', icon: 'ti ti-armchair' },
];

const AssignVehicle = () => {
  const [rows, setRows] = useState<VehicleAssignment[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AssignModalId | null>(null);
  const [modalRow, setModalRow] = useState<VehicleAssignment | null>(null);
  const [panelRow, setPanelRow] = useState<VehicleAssignment | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: VehicleAssignment | null, modal: AssignModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /**
   * A unit's status follows what it is missing. Only the two statuses the user
   * sets by hand — Suspended and Ending Soon — survive a leg being swapped.
   */
  const statusFor = (row: VehicleAssignment): { status: AssignmentStatus; statusLabel: string } => {
    if (row.status === 'Suspended' || row.status === 'Ending Soon') {
      return { status: row.status, statusLabel: row.statusLabel };
    }
    if (!hasVehicle(row)) return { status: 'Vehicle Pending', statusLabel: 'Vehicle Pending' };
    if (!hasDriver(row)) return { status: 'Driver Pending', statusLabel: 'Driver Pending' };
    return { status: 'Active', statusLabel: 'Active' };
  };

  const patchRow = useCallback(
    (change: (row: VehicleAssignment) => VehicleAssignment, message: string) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const next = change(row);
          return { ...next, ...statusFor(next) };
        }),
      );
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<VehicleAssignment>[]>(
    () => [
      {
        id: 'code',
        label: 'Assignment ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.code}</ActionLink>
        ),
      },
      {
        id: 'vehicle',
        label: 'Vehicle',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-sm bg-info-transparent text-info rounded me-2 flex-shrink-0">
              <i className="ti ti-bus" />
            </span>
            <div>
              <span className="d-block fs-13 fw-medium">{vehicleLabel(row)}</span>
              <span className="fs-12 text-muted">{row.vehicleKind || 'Awaiting a unit'}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'driver',
        label: 'Driver',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-sm bg-purple-transparent text-purple rounded me-2 flex-shrink-0">
              <i className="ti ti-steering-wheel" />
            </span>
            <div>
              <span className="d-block fs-13 fw-medium">{driverLabel(row)}</span>
              <span className="fs-12 text-muted">{row.driverCode || 'Awaiting a driver'}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'route',
        label: 'Route',
        sortable: true,
        render: (row) => (
          <>
            <span className={`badge badge-soft-${row.routeTint}`}>{row.routeCode}</span>
            <span className="d-block fs-12 text-muted mt-1">{row.routeName}</span>
          </>
        ),
      },
      { id: 'routeType', label: 'Route Type', cellClassName: 'fs-13', render: (row) => row.routeType },
      {
        id: 'capacity',
        label: 'Capacity',
        sortable: true,
        align: 'end',
        render: (row) => <span className="badge badge-soft-secondary">{capacityLabel(row)}</span>,
      },
      {
        id: 'students',
        label: 'Assigned Students',
        sortable: true,
        align: 'end',
        render: (row) =>
          row.capacity === 0 ? (
            <span className="fw-medium">{row.students}</span>
          ) : (
            <>
              <span className="fw-medium">{row.students}</span>{' '}
              <span className="fs-12 text-muted">of {row.capacity}</span>
            </>
          ),
      },
      {
        id: 'morning',
        label: 'Morning Shift',
        render: (row) =>
          row.morning ? (
            <span className="fs-13">{row.morning}</span>
          ) : (
            <span className="fs-13 text-muted">— Evening only</span>
          ),
      },
      {
        id: 'evening',
        label: 'Evening Shift',
        render: (row) =>
          row.evening ? (
            <span className="fs-13">{row.evening}</span>
          ) : (
            <span className="fs-13 text-muted">— Morning only</span>
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
            {row.statusLabel}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<VehicleAssignment>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.vehicle) {
        const wanted = filters.vehicle;
        if (wanted === NOT_ASSIGNED ? hasVehicle(row) : row.vehicle !== wanted) return false;
      }
      if (filters.driver) {
        const wanted = filters.driver;
        if (wanted === NOT_ASSIGNED ? hasDriver(row) : row.driver !== wanted) return false;
      }
      if (filters.route && `${row.routeCode} · ${row.routeName}` !== filters.route) return false;
      if (filters['assignment-status'] && row.status !== filters['assignment-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['route-type'] && row.routeType !== filters['route-type']) return false;
      if (filters.occupancy && occupancyBand(row) !== filters.occupancy) return false;
      if (filters['unit-completeness'] && completeness(row) !== filters['unit-completeness']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      switch (quick) {
        case null: return true;
        case 'active': return row.status === 'Active';
        case 'driver': return row.status === 'Driver Pending';
        case 'vehicle': return row.status === 'Vehicle Pending';
        case 'suspended': return row.status === 'Suspended';
        case 'full': return row.capacity > 0 && seatsFree(row) < 5;
        default: return true;
      }
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'active': return row.status === 'Active';
        case 'driver': return row.status === 'Driver Pending';
        case 'vehicle': return row.status === 'Vehicle Pending';
        case 'ending': return row.status === 'Suspended' || row.status === 'Ending Soon';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'vehicle': return vehicleLabel(a).localeCompare(vehicleLabel(b));
        case 'driver': return driverLabel(a).localeCompare(driverLabel(b));
        case 'route': return a.routeCode.localeCompare(b.routeCode);
        case 'seats': return seatsFree(b) - seatsFree(a) || a.code.localeCompare(b.code);
        case 'code':
        default: return codeKey(a.code) - codeKey(b.code);
      }
    },
    defaultSort: 'code',
    // The template renders the Active Units quick filter already lit.
    defaultQuick: 'active',
    pageSize: 8,
  });

  /* --------------------------------- Rails ---------------------------------- */

  const countBy = useCallback(
    (status: AssignmentStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Assignments', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'active', label: 'Active Units', icon: 'ti ti-circle-check', count: countBy('Active') },
      { id: 'driver', label: 'Driver Pending', icon: 'ti ti-user-question', count: countBy('Driver Pending') },
      { id: 'vehicle', label: 'Vehicle Pending', icon: 'ti ti-bus', count: countBy('Vehicle Pending') },
      {
        id: 'ending', label: 'Suspended or Ending', icon: 'ti ti-alert-triangle',
        count: countBy('Suspended') + countBy('Ending Soon'),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'active', label: 'Active Units', icon: 'ti ti-circle-check', count: countBy('Active') },
      { id: 'driver', label: 'Driver Pending', icon: 'ti ti-user-question', count: countBy('Driver Pending') },
      { id: 'vehicle', label: 'Vehicle Pending', icon: 'ti ti-bus', count: countBy('Vehicle Pending') },
      { id: 'suspended', label: 'Suspended', icon: 'ti ti-alert-triangle', count: countBy('Suspended') },
      {
        id: 'full', label: 'Nearly Full', icon: 'ti ti-armchair',
        count: rows.filter((row) => row.capacity > 0 && seatsFree(row) < 5).length,
      },
    ],
    [countBy, rows],
  );

  /** Tiles derive from the roster, so a swap or a removal moves them. */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-link', label: 'Total Assignments',
        value: String(rows.length), hint: 'vehicle + driver + route',
      },
      {
        id: 'active', tint: 'success', icon: 'ti ti-circle-check', label: 'Active Assignments',
        value: String(countBy('Active')), hint: 'running today',
      },
      {
        id: 'unassigned', tint: 'warning', icon: 'ti ti-bus', label: 'Unassigned Vehicles',
        value: String(rows.filter((row) => !hasVehicle(row)).length), hint: 'available to pair',
      },
      {
        id: 'drivers', tint: 'info', icon: 'ti ti-steering-wheel', label: 'Available Drivers',
        value: String(rows.filter((row) => !hasDriver(row)).length), hint: 'awaiting a unit',
      },
      {
        id: 'routes', tint: 'purple', icon: 'ti ti-route', label: 'Scheduled Routes',
        value: String(rows.filter(hasRoute).length),
        hint: `${rows.filter((row) => !isComplete(row)).length} awaiting a unit`,
      },
    ],
    [countBy, rows],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** The route select carries "RT-01 · North Corridor"; the row stores both. */
  const splitRoute = (value: string): { routeCode: string; routeName: string } => {
    const [code, name] = value.split(' · ');
    return { routeCode: code ?? '', routeName: name ?? '' };
  };

  const seatsFromKind = (kind: string): number => Number(kind.replace(/\D/g, '')) || 0;

  /** A vehicle brings its own seat count, taken from an existing unit's kind. */
  const kindFor = useCallback(
    (plate: string) => rows.find((row) => row.vehicle === plate)?.vehicleKind ?? '',
    [rows],
  );

  const createAssignment = useCallback(
    (draft: AssignmentDraft) => {
      if (!draft.route) {
        push('Pick a route for the assignment', 'warning');
        return;
      }
      const code = `ASG-2026-${String(rows.length + 1).padStart(3, '0')}`;
      const kind = draft.vehicle ? kindFor(draft.vehicle) : '';
      const base: VehicleAssignment = {
        id: code,
        code,
        vehicle: draft.vehicle === NOT_ASSIGNED ? '' : draft.vehicle,
        vehicleKind: kind,
        vehicleModel: '',
        fitnessValid: '—',
        gpsDevice: '—',
        driver: draft.driver === NOT_ASSIGNED ? '' : draft.driver,
        driverCode: '',
        ...splitRoute(draft.route),
        routeTint: 'primary',
        routeType: draft.routeType as RouteType,
        capacity: seatsFromKind(kind),
        students: 0,
        morning: draft.morning.trim(),
        evening: draft.evening.trim(),
        academicYear: draft.academicYear,
        statusLabel: 'Active',
        status: 'Active',
        notes: '',
      };
      setRows((current) => [{ ...base, ...statusFor(base) }, ...current]);
      setActiveModal(null);
      push(`${code} created`);
    },
    [kindFor, push, rows.length],
  );

  const updateAssignment = useCallback(
    (draft: AssignmentDraft) =>
      patchRow(
        (row) => {
          const vehicle = draft.vehicle === NOT_ASSIGNED ? '' : draft.vehicle;
          const kind = vehicle ? kindFor(vehicle) || row.vehicleKind : '';
          return {
            ...row,
            vehicle,
            vehicleKind: kind,
            capacity: vehicle ? seatsFromKind(kind) || row.capacity : 0,
            driver: draft.driver === NOT_ASSIGNED ? '' : draft.driver,
            ...(draft.route ? splitRoute(draft.route) : null),
            routeType: draft.routeType as RouteType,
            morning: draft.morning.trim(),
            evening: draft.evening.trim(),
            academicYear: draft.academicYear,
          };
        },
        `${modalRow?.code ?? 'Assignment'} updated`,
      ),
    [kindFor, modalRow, patchRow],
  );

  const changeVehicle = useCallback(
    (result: SwapResult) => {
      const plate = result.value === NOT_ASSIGNED ? '' : result.value;
      patchRow(
        (row) => {
          const kind = plate ? kindFor(plate) || row.vehicleKind : '';
          return {
            ...row,
            vehicle: plate,
            vehicleKind: kind,
            capacity: plate ? seatsFromKind(kind) || row.capacity : 0,
          };
        },
        plate
          ? `${modalRow?.code ?? 'Unit'} moved to ${plate}`
          : `Vehicle released from ${modalRow?.code ?? 'the unit'}`,
      );
    },
    [kindFor, modalRow, patchRow],
  );

  const changeDriver = useCallback(
    (result: SwapResult) => {
      const driver = result.value === NOT_ASSIGNED ? '' : result.value;
      patchRow(
        (row) => ({ ...row, driver, driverCode: driver ? row.driverCode : '' }),
        driver
          ? `${driver} assigned to ${modalRow?.code ?? 'the unit'}`
          : `Driver released from ${modalRow?.code ?? 'the unit'}`,
      );
    },
    [modalRow, patchRow],
  );

  const changeRoute = useCallback(
    (result: SwapResult) => {
      if (!result.value) {
        push('Pick a route', 'warning');
        return;
      }
      patchRow(
        (row) => ({ ...row, ...splitRoute(result.value) }),
        `${modalRow?.code ?? 'Unit'} moved to ${result.value}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const removeAssignment = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.filter((row) => row.id !== modalRow.id));
    setActiveModal(null);
    if (panelRow?.id === modalRow.id) setPanelRow(null);
    push(`${modalRow.code} removed`);
  }, [modalRow, panelRow, push]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} assignments exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: VehicleAssignment) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View assignment" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit assignment" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Change driver" onClick={() => openModal(row, 'change-driver')}>
        <i className="ti ti-steering-wheel" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change vehicle" onClick={() => openModal(row, 'change-vehicle')}>
        <i className="ti ti-bus" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change route" onClick={() => openModal(row, 'change-route')}>
        <i className="ti ti-route" />
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

  const renderDetail = (row: VehicleAssignment) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-bus text-info me-1" />Vehicle Details</h6>
        {pairList([
          { label: 'Vehicle No', value: vehicleLabel(row) },
          { label: 'Type', value: row.vehicleKind || '—' },
          { label: 'Model', value: row.vehicleModel || '—' },
          { label: 'Fitness Valid', value: row.fitnessValid },
          { label: 'GPS Device', value: row.gpsDevice },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-steering-wheel text-purple me-1" />Driver Profile</h6>
        {pairList([
          { label: 'Driver', value: driverLabel(row) },
          { label: 'Employee ID', value: row.driverCode || '—' },
          { label: 'Unit', value: completeness(row) },
        ])}
        <h6 className="fs-14 mb-3 mt-3"><i className="ti ti-route text-primary me-1" />Route Information</h6>
        {pairList([
          { label: 'Route', value: routeLabel(row) },
          { label: 'Route Type', value: row.routeType },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock text-warning me-1" />Pickup &amp; Drop Schedule</h6>
        {pairList([
          { label: 'Morning Shift', value: row.morning || 'Evening only' },
          { label: 'Evening Shift', value: row.evening || 'Morning only' },
          { label: 'Academic Year', value: row.academicYear },
        ])}
        <h6 className="fs-14 mb-3 mt-3"><i className="ti ti-armchair text-success me-1" />Student Capacity</h6>
        {pairList([
          { label: 'Seats', value: capacityLabel(row) },
          { label: 'Assigned', value: studentsLabel(row) },
          { label: 'Seats Free', value: row.capacity === 0 ? '—' : String(seatsFree(row)) },
          { label: 'Occupancy', value: row.capacity === 0 ? '—' : `${occupancyPct(row)}%` },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-map-pin text-info me-1" />Assigned Pickup Points</h6>
        <p className="fs-13 text-muted mb-3">
          {hasRoute(row) ? `Boarding along ${row.routeName}.` : 'No route assigned yet.'}
        </p>
        <h6 className="fs-14 mb-3"><i className="ti ti-history text-secondary me-1" />Assignment History</h6>
        <p className="fs-13 text-muted mb-3">{row.code} · {row.academicYear}.</p>
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-warning me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'view')}>
            <i className="ti ti-eye me-1" />View
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'edit')}>
            <i className="ti ti-edit me-1" />Edit
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
            title="Assign Vehicle"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Assignment Sheet" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Assign Vehicle
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
            workspaceId="avWorkspace"
            searchPlaceholder="Search assignments, vehicle, driver or route…"
            searchLabel="Search assignments"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="assignments"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Assignments refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-link-off"
            emptyTitle="No assignments match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Assignment Panel Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Assignment Details"
            labelledById="av_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-link fs-20" />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.code}</h6>
                    <span className="fs-12 text-muted">{assignmentLabel(panelRow)}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.statusLabel}</span>
                </div>

                <h6 className="fs-14 mb-2">The Unit</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Vehicle', value: vehicleLabel(panelRow) },
                    { label: 'Driver', value: driverLabel(panelRow) },
                    { label: 'Route', value: routeLabel(panelRow) },
                    { label: 'Completeness', value: completeness(panelRow) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Capacity</h6>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Assigned</span>
                      <h5 className="mb-0">{panelRow.students}</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Seats Free</span>
                      <h5 className="mb-0 text-success">
                        {panelRow.capacity === 0 ? '—' : seatsFree(panelRow)}
                      </h5>
                    </div>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Internal Notes</h6>
                <p className="fs-13 text-muted">{panelRow.notes}</p>

                <div className="d-flex gap-2">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'change-driver'); }}
                  >
                    <i className="ti ti-steering-wheel me-1" />Change Driver
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Assignment Panel Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <AssignVehicleModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createAssignment}
        onUpdate={updateAssignment}
        onChangeVehicle={changeVehicle}
        onChangeDriver={changeDriver}
        onChangeRoute={changeRoute}
        onRemove={removeAssignment}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="avToasts" />
    </>
  );
};

export default AssignVehicle;
