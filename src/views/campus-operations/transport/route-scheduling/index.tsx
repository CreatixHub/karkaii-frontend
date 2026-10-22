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
import ScheduleModals from './modals/ScheduleModals';
import type { AssignResult, ScheduleDraft, ScheduleModalId } from './modals/ScheduleModals';
import type { RouteType, Schedule, ScheduleStatus } from './data/schedules.data';
import {
  NOT_ASSIGNED, academicYearOptions, capacityLabel, corridorOptions, dateKey, driverLabel,
  driverOptions, hasDriver, hasVehicle, missingDriver, missingVehicle, occupancyBand,
  occupancyOptions, occupancyPct, routeLabel, routeTypeOptions, schedules as initialRows,
  searchIndexOf, seatsFree, statusBadge, statusIcon, statusOptions, statusPill, stopsBand,
  stopsLabel, stopsOptions, studentsLabel, timeKey, vehicleLabel, vehicleOptions,
} from './data/schedules.data';

const routes = all_routes;

/**
 * Ids are the template's own. Academic Year and Schedule Status open already
 * committed, which is what puts the two chips on the rail at load.
 */
const filterFields: FilterField[] = [
  {
    id: 'schedule-status', label: 'Schedule Status', kind: 'select', chipLabel: 'Status',
    options: statusOptions, initialValue: 'Active',
  },
  { id: 'route-type', label: 'Route Type', kind: 'select', chipLabel: 'Route type', options: routeTypeOptions },
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', options: vehicleOptions },
  { id: 'driver', label: 'Driver', kind: 'select', chipLabel: 'Driver', options: driverOptions },
  {
    id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year',
    options: academicYearOptions, initialValue: '2026 / 2027',
  },
  { id: 'occupancy', label: 'Occupancy', kind: 'select', chipLabel: 'Occupancy', options: occupancyOptions },
  { id: 'total-stops', label: 'Total Stops', kind: 'select', chipLabel: 'Stops', options: stopsOptions },
  { id: 'corridor', label: 'Corridor', kind: 'select', chipLabel: 'Corridor', options: corridorOptions },
];

const sortOptions: SortOption[] = [
  { id: 'code', label: 'Route code', icon: 'ti ti-hash' },
  { id: 'morning', label: 'Morning pickup time', icon: 'ti ti-clock' },
  { id: 'students', label: 'Assigned students', icon: 'ti ti-users' },
  { id: 'stops', label: 'Total stops', icon: 'ti ti-map-pin' },
  { id: 'name', label: 'Route name (A–Z)', icon: 'ti ti-abc' },
];

const RouteScheduling = () => {
  const [rows, setRows] = useState<Schedule[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ScheduleModalId | null>(null);
  const [modalRow, setModalRow] = useState<Schedule | null>(null);
  const [panelRow, setPanelRow] = useState<Schedule | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Schedule | null, modal: ScheduleModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /**
   * A schedule's status follows what it is missing. Only the two statuses the
   * user sets by hand — Suspended and Closing — survive an assignment.
   */
  const statusFor = (row: Schedule): { status: ScheduleStatus; statusLabel: string } => {
    if (row.status === 'Suspended' || row.status === 'Closing') {
      return { status: row.status, statusLabel: row.statusLabel };
    }
    if (missingDriver(row)) return { status: 'Draft', statusLabel: 'Draft' };
    if (missingVehicle(row)) return { status: 'Scheduled', statusLabel: 'Scheduled' };
    return { status: 'Active', statusLabel: 'Active' };
  };

  const patchRow = useCallback(
    (change: (row: Schedule) => Schedule, message: string) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const next = change(row);
          return { ...next, ...statusFor(next), updated: '31 Jul 2026' };
        }),
      );
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Schedule>[]>(
    () => [
      {
        id: 'name',
        label: 'Route Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-sm bg-${row.tint}-transparent text-${row.tint} rounded me-2 flex-shrink-0`}>
              <i className="ti ti-route" />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">{row.routeType}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'code',
        label: 'Route Code',
        render: (row) => <span className={`badge badge-soft-${row.tint}`}>{row.code}</span>,
      },
      {
        id: 'vehicle',
        label: 'Vehicle',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium">{vehicleLabel(row)}</span>
            <span className="fs-12 text-muted">{row.vehicleKind || 'Awaiting allocation'}</span>
          </>
        ),
      },
      {
        id: 'driver',
        label: 'Driver',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium">{driverLabel(row)}</span>
            <span className="fs-12 text-muted">{row.driverCode || '—'}</span>
          </>
        ),
      },
      {
        id: 'morning',
        label: 'Morning Pickup',
        sortable: true,
        render: (row) =>
          row.morningTime ? (
            <>
              <span className="d-block fs-13 fw-medium">{row.morningTime}</span>
              <span className="fs-12 text-muted">{row.morningStop}</span>
            </>
          ) : (
            <span className="fs-13 text-muted">— Evening only</span>
          ),
      },
      {
        id: 'evening',
        label: 'Evening Drop',
        render: (row) =>
          row.eveningTime ? (
            <>
              <span className="d-block fs-13 fw-medium">{row.eveningTime}</span>
              <span className="fs-12 text-muted">{row.eveningStop}</span>
            </>
          ) : (
            <span className="fs-13 text-muted">— Morning only</span>
          ),
      },
      {
        id: 'stops',
        label: 'Total Stops',
        sortable: true,
        align: 'end',
        render: (row) => <span className="badge badge-soft-secondary">{stopsLabel(row)}</span>,
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
        id: 'status',
        label: 'Schedule Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            {statusIcon[row.status]
              ? <i className={statusIcon[row.status] as string} />
              : <span className="dt-pill-dot" />}
            {row.statusLabel}
          </span>
        ),
      },
      {
        id: 'updated',
        label: 'Last Updated',
        sortable: true,
        cellClassName: 'fs-13 text-muted',
        render: (row) => row.updated,
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Schedule>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['schedule-status'] && row.status !== filters['schedule-status']) return false;
      if (filters['route-type'] && row.routeType !== filters['route-type']) return false;
      if (filters.vehicle) {
        const wanted = filters.vehicle;
        if (wanted === NOT_ASSIGNED ? hasVehicle(row) : row.vehicle !== wanted) return false;
      }
      if (filters.driver) {
        const wanted = filters.driver;
        if (wanted === NOT_ASSIGNED ? hasDriver(row) : row.driver !== wanted) return false;
      }
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters.occupancy && occupancyBand(row) !== filters.occupancy) return false;
      if (filters['total-stops'] && stopsBand(row) !== filters['total-stops']) return false;
      if (filters.corridor && row.corridor !== filters.corridor) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      switch (quick) {
        case null: return true;
        case 'active': return row.status === 'Active';
        case 'driver': return missingDriver(row);
        case 'vehicle': return missingVehicle(row);
        case 'suspended': return row.status === 'Suspended';
        case 'full': return row.capacity > 0 && seatsFree(row) < 5;
        default: return true;
      }
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'active': return row.status === 'Active';
        case 'driver': return missingDriver(row);
        case 'vehicle': return missingVehicle(row);
        case 'closing': return row.status === 'Suspended' || row.status === 'Closing';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'morning': return timeKey(a.morningTime) - timeKey(b.morningTime);
        case 'students': return b.students - a.students || a.code.localeCompare(b.code);
        case 'stops': return b.stops - a.stops || a.code.localeCompare(b.code);
        case 'name': return a.name.localeCompare(b.name);
        case 'updated': return dateKey(b.updated) - dateKey(a.updated);
        case 'code':
        default: return a.code.localeCompare(b.code);
      }
    },
    defaultSort: 'code',
    // The template renders the Active quick filter already lit.
    defaultQuick: 'active',
    pageSize: 8,
  });

  /* --------------------------------- Rails ---------------------------------- */

  const countBy = useCallback(
    (status: ScheduleStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Routes', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'active', label: 'Active Schedules', icon: 'ti ti-circle-check', count: countBy('Active') },
      { id: 'driver', label: 'Missing Driver', icon: 'ti ti-user-question', count: rows.filter(missingDriver).length },
      { id: 'vehicle', label: 'Missing Vehicle', icon: 'ti ti-bus', count: rows.filter(missingVehicle).length },
      {
        id: 'closing', label: 'Suspended or Closing', icon: 'ti ti-alert-triangle',
        count: countBy('Suspended') + countBy('Closing'),
      },
    ],
    [countBy, rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'active', label: 'Active', icon: 'ti ti-circle-check', count: countBy('Active') },
      { id: 'driver', label: 'Missing Driver', icon: 'ti ti-user-question', count: rows.filter(missingDriver).length },
      { id: 'vehicle', label: 'Missing Vehicle', icon: 'ti ti-bus', count: rows.filter(missingVehicle).length },
      { id: 'suspended', label: 'Suspended', icon: 'ti ti-alert-triangle', count: countBy('Suspended') },
      {
        id: 'full', label: 'Nearly Full', icon: 'ti ti-armchair',
        count: rows.filter((row) => row.capacity > 0 && seatsFree(row) < 5).length,
      },
    ],
    [countBy, rows],
  );

  /** Tiles derive from the roster, so an assignment or a suspension moves them. */
  const summary = useMemo<SummaryItem[]>(() => {
    const vehicles = new Set(rows.filter(hasVehicle).map((row) => row.vehicle));
    const drivers = new Set(rows.filter(hasDriver).map((row) => row.driver));
    const trips = rows.reduce(
      (total, row) => total + (row.morningTime ? 1 : 0) + (row.eveningTime ? 1 : 0),
      0,
    );
    const running = rows.filter((row) => row.status === 'Active');
    const runningTrips = running.reduce(
      (total, row) => total + (row.morningTime ? 1 : 0) + (row.eveningTime ? 1 : 0),
      0,
    );
    return [
      {
        id: 'routes', tint: 'primary', icon: 'ti ti-route', label: 'Total Routes',
        value: String(rows.length),
        hint: `${new Set(rows.map((row) => row.corridor)).size} corridors covered`,
      },
      {
        id: 'trips', tint: 'success', icon: 'ti ti-calendar-repeat', label: 'Scheduled Trips',
        value: String(trips), hint: 'morning & evening',
      },
      {
        id: 'vehicles', tint: 'info', icon: 'ti ti-bus', label: 'Active Vehicles',
        value: String(vehicles.size),
        hint: `${rows.filter(missingVehicle).length} awaiting allocation`,
      },
      {
        id: 'drivers', tint: 'purple', icon: 'ti ti-steering-wheel', label: 'Assigned Drivers',
        value: String(drivers.size),
        hint: `${rows.filter(missingDriver).length} unassigned`,
      },
      {
        id: 'today', tint: 'warning', icon: 'ti ti-clock', label: "Today's Trips",
        value: String(runningTrips),
        hint: `${countBy('Suspended')} suspended`,
      },
    ];
  }, [countBy, rows]);

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const seatsFromKind = (kind: string): number => Number(kind.replace(/\D/g, '')) || 0;

  /** A vehicle brings its own seat count, taken from an existing schedule. */
  const kindFor = useCallback(
    (plate: string) => rows.find((row) => row.vehicle === plate)?.vehicleKind ?? '',
    [rows],
  );

  const codeFor = useCallback(
    (driver: string) => rows.find((row) => row.driver === driver)?.driverCode ?? '',
    [rows],
  );

  const createSchedule = useCallback(
    (draft: ScheduleDraft) => {
      if (!draft.name.trim()) {
        push('Give the route a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `RT-${String(rows.length + 1).padStart(2, '0')}`;
      const vehicle = draft.vehicle === NOT_ASSIGNED ? '' : draft.vehicle;
      const driver = draft.driver === NOT_ASSIGNED ? '' : draft.driver;
      const kind = vehicle ? kindFor(vehicle) : '';
      const base: Schedule = {
        id: code,
        code,
        name: draft.name.trim(),
        tint: 'primary',
        routeType: draft.routeType as RouteType,
        vehicle,
        vehicleKind: kind,
        driver,
        driverCode: driver ? codeFor(driver) : '',
        morningTime: draft.morningTime,
        morningStop: draft.morningStop.trim(),
        eveningTime: draft.eveningTime,
        eveningStop: draft.eveningStop.trim(),
        stops: toNumber(draft.stops, 0),
        capacity: seatsFromKind(kind),
        students: 0,
        corridor: draft.corridor,
        academicYear: draft.academicYear,
        updated: '31 Jul 2026',
        statusLabel: 'Active',
        status: 'Active',
        notes: '',
      };
      setRows((current) => [{ ...base, ...statusFor(base) }, ...current]);
      setActiveModal(null);
      push(`${draft.name.trim()} scheduled`);
    },
    [codeFor, kindFor, push, rows.length],
  );

  const updateSchedule = useCallback(
    (draft: ScheduleDraft) =>
      patchRow(
        (row) => {
          const vehicle = draft.vehicle === NOT_ASSIGNED ? '' : draft.vehicle;
          const driver = draft.driver === NOT_ASSIGNED ? '' : draft.driver;
          const kind = vehicle ? kindFor(vehicle) || row.vehicleKind : '';
          return {
            ...row,
            name: draft.name.trim() || row.name,
            code: draft.code.trim() || row.code,
            routeType: draft.routeType as RouteType,
            corridor: draft.corridor,
            vehicle,
            vehicleKind: kind,
            capacity: vehicle ? seatsFromKind(kind) || row.capacity : 0,
            driver,
            driverCode: driver ? codeFor(driver) || row.driverCode : '',
            morningTime: draft.morningTime,
            morningStop: draft.morningStop.trim(),
            eveningTime: draft.eveningTime,
            eveningStop: draft.eveningStop.trim(),
            stops: toNumber(draft.stops, row.stops),
            academicYear: draft.academicYear,
          };
        },
        `${modalRow?.name ?? 'Schedule'} updated`,
      ),
    [codeFor, kindFor, modalRow, patchRow],
  );

  const assignVehicle = useCallback(
    (result: AssignResult) => {
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
          ? `${plate} assigned to ${modalRow?.name ?? 'the route'}`
          : `Vehicle released from ${modalRow?.name ?? 'the route'}`,
      );
    },
    [kindFor, modalRow, patchRow],
  );

  const assignDriver = useCallback(
    (result: AssignResult) => {
      const driver = result.value === NOT_ASSIGNED ? '' : result.value;
      patchRow(
        (row) => ({
          ...row,
          driver,
          driverCode: driver ? codeFor(driver) || row.driverCode : '',
        }),
        driver
          ? `${driver} assigned to ${modalRow?.name ?? 'the route'}`
          : `Driver released from ${modalRow?.name ?? 'the route'}`,
      );
    },
    [codeFor, modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} schedules exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Schedule) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View route" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit schedule" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Assign vehicle" onClick={() => openModal(row, 'assign-vehicle')}>
        <i className="ti ti-bus" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Assign driver" onClick={() => openModal(row, 'assign-driver')}>
        <i className="ti ti-steering-wheel" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Print schedule" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Schedule panel" onClick={() => setPanelRow(row)}>
        <i className="ti ti-layout-sidebar-right-expand" />
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

  const renderDetail = (row: Schedule) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-route text-primary me-1" />Route Information</h6>
        {pairList([
          { label: 'Route Code', value: row.code },
          { label: 'Route Type', value: row.routeType },
          { label: 'Corridor', value: row.corridor },
          { label: 'Total Stops', value: stopsLabel(row) },
          { label: 'Academic Year', value: row.academicYear },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-bus text-info me-1" />Assigned Unit</h6>
        {pairList([
          { label: 'Vehicle', value: vehicleLabel(row) },
          { label: 'Type', value: row.vehicleKind || '—' },
          { label: 'Driver', value: driverLabel(row) },
          { label: 'Employee ID', value: row.driverCode || '—' },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock text-warning me-1" />Trip Timings</h6>
        {pairList([
          { label: 'Morning Pickup', value: row.morningTime || 'Evening only' },
          { label: 'First Stop', value: row.morningStop || '—' },
          { label: 'Evening Drop', value: row.eveningTime || 'Morning only' },
          { label: 'Last Stop', value: row.eveningStop || '—' },
        ])}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-armchair text-success me-1" />Load</h6>
        {pairList([
          { label: 'Capacity', value: capacityLabel(row) },
          { label: 'Assigned', value: studentsLabel(row) },
          { label: 'Seats Free', value: row.capacity === 0 ? '—' : String(seatsFree(row)) },
          { label: 'Occupancy', value: row.capacity === 0 ? '—' : `${occupancyPct(row)}%` },
        ])}
        <h6 className="fs-14 mb-3 mt-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
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
            title="Route Scheduling"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'print')}
                  >
                    <i className="ti ti-printer me-2" />Print Schedule
                  </ActionLink>
                </div>
                <ExportMenu onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Schedule
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
            workspaceId="rsWorkspace"
            searchPlaceholder="Search routes, code, vehicle or driver…"
            searchLabel="Search schedules"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="routes"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Schedules refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-calendar-off"
            emptyTitle="No routes match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Schedule Panel Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Schedule Details"
            labelledById="rs_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center mb-3">
                  <span className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}>
                    <i className="ti ti-route fs-20" />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{routeLabel(panelRow)} · {panelRow.routeType}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.statusLabel}</span>
                </div>

                <h6 className="fs-14 mb-2">Assigned Unit</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Vehicle', value: vehicleLabel(panelRow) },
                    { label: 'Driver', value: driverLabel(panelRow) },
                    { label: 'Capacity', value: capacityLabel(panelRow) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Trip Timings</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Morning Pickup', value: panelRow.morningTime || 'Evening only' },
                    { label: 'Evening Drop', value: panelRow.eveningTime || 'Morning only' },
                    { label: 'Total Stops', value: stopsLabel(panelRow) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Load</h6>
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
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'assign-driver'); }}
                  >
                    <i className="ti ti-steering-wheel me-1" />Assign Driver
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Schedule Panel Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ScheduleModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createSchedule}
        onUpdate={updateSchedule}
        onAssignVehicle={assignVehicle}
        onAssignDriver={assignDriver}
        onPrint={(scope) => { setActiveModal(null); push(`Printing — ${scope.toLowerCase()}`); }}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="rsToasts" />
    </>
  );
};

export default RouteScheduling;
