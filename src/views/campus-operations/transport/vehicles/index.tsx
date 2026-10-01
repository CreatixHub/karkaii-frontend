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
import VehicleModals from './modals/VehicleModals';
import type {
  DriverAssignment,
  InsurancePlan,
  MaintenancePlan,
  RouteAssignment,
  VehicleDraft,
  VehicleModalId,
} from './modals/VehicleModals';
import type { Vehicle, VehicleStatus } from './data/vehicles.data';
import {
  complianceBadge, complianceStateOf, dateKey, documentsOf, driverLabelOf, driverOptions,
  driverPhotos, fitnessRefOf, fuelOptions, insuranceStatusOf, insuranceStatusOptions,
  maintenanceStatusOf, maintenanceStatusOptions, numberOptions, permitExpiryOf, permitRefOf,
  policyNumberOf, registrationBandOf, registrationExpiryOptions, remarksOf, routeLabelOf,
  routeOptions, routeSummaryOf, searchIndexOf, seatBandOf, seatingOptions, serviceRecordOf,
  statusIcon, statusOptions, statusPill, typeOptions, vehicles as initialRows,
} from './data/vehicles.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'vehicle-type', label: 'Vehicle Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'vehicle-number', label: 'Vehicle Number', kind: 'select', chipLabel: 'Vehicle', options: numberOptions },
  { id: 'route', label: 'Route', kind: 'select', chipLabel: 'Route', options: routeOptions },
  { id: 'driver', label: 'Driver', kind: 'select', chipLabel: 'Driver', options: driverOptions },
  { id: 'fuel-type', label: 'Fuel Type', kind: 'select', chipLabel: 'Fuel', options: fuelOptions },
  {
    id: 'seating-capacity', label: 'Seating Capacity', kind: 'select', chipLabel: 'Seats',
    // The template's blank option here reads "Any", not "All".
    allLabel: 'Any', options: seatingOptions,
  },
  { id: 'insurance-status', label: 'Insurance Status', kind: 'select', chipLabel: 'Insurance', options: insuranceStatusOptions },
  { id: 'maintenance-status', label: 'Maintenance Status', kind: 'select', chipLabel: 'Maintenance', options: maintenanceStatusOptions },
  {
    id: 'registration-expiry', label: 'Registration Expiry', kind: 'select', chipLabel: 'Reg expiry',
    allLabel: 'Any', options: registrationExpiryOptions,
  },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
];

const sortOptions: SortOption[] = [
  { id: 'number', label: 'Vehicle Number (A–Z)', icon: 'ti ti-abc' },
  { id: 'route', label: 'Route', icon: 'ti ti-route' },
  { id: 'seats', label: 'Seating Capacity', icon: 'ti ti-armchair' },
  { id: 'registration', label: 'Registration Expiry', icon: 'ti ti-file-certificate' },
  { id: 'updated', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The two rails share these statuses; the quick rail shortens one label. */
const rails: { id: VehicleStatus; label: string; quickLabel: string; icon: string }[] = [
  { id: 'Active', label: 'Active', quickLabel: 'Active', icon: 'ti ti-circle-check' },
  { id: 'On Route', label: 'On Route', quickLabel: 'On Route', icon: 'ti ti-route' },
  { id: 'Maintenance', label: 'Maintenance', quickLabel: 'Maintenance', icon: 'ti ti-tool' },
  { id: 'Insurance Expiring', label: 'Insurance Expiring', quickLabel: 'Insurance', icon: 'ti ti-alert-triangle' },
  { id: 'Out of Service', label: 'Out of Service', quickLabel: 'Out of Service', icon: 'ti ti-circle-off' },
];

const TransportVehicles = () => {
  const [rows, setRows] = useState<Vehicle[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<VehicleModalId | null>(null);
  const [modalRow, setModalRow] = useState<Vehicle | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Vehicle | null, modal: VehicleModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Vehicle) => Vehicle, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        id: 'vehicle',
        label: 'Vehicle',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar avatar avatar-lg"
              ariaLabel={`View ${row.number}`}
              onClick={() => openModal(row, 'view')}
            >
              <ImageWithBasePath src={row.photo} className="rounded" alt={row.model} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.number}</ActionLink>
              <div className="dt-sub"><span className="fw-medium dt-vname">{row.model}</span></div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`badge badge-soft-${row.typeTint}`}>
                  <i className="ti ti-bus me-1" /><span className="dt-vtype">{row.type}</span>
                </span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-license me-1" /><span className="dt-reg">{row.registration}</span>
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'details',
        label: 'Vehicle Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className={`badge badge-soft-${row.route ? 'info' : 'secondary'}`}>
                <i className="ti ti-route me-1" /><span className="dt-route">{routeLabelOf(row)}</span>
              </span>
            </li>
            <li className="d-flex align-items-center gap-1 py-1">
              {row.driver ? (
                <span className="avatar avatar-xs">
                  <ImageWithBasePath
                    src={row.driverPhoto}
                    className="rounded-circle flex-shrink-0"
                    alt={row.driver}
                  />
                </span>
              ) : null}
              <span>
                <span className="text-muted">Driver</span>{' '}
                <span className="fw-medium text-dark dt-driver">{driverLabelOf(row)}</span>
              </span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-warning">
                <i className="ti ti-gas-station me-1" /><span className="dt-fuel">{row.fuel}</span>
              </span>{' '}
              <span className="badge badge-soft-success">
                <i className="ti ti-armchair me-1" />
                <span className="dt-seats-val">{row.seats}</span> Seats
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar me-1" />Mfg Year{' '}
              <span className="fw-medium text-dark">{row.mfgYear}</span>
            </li>
          </ul>
        ),
      },
      {
        id: 'compliance',
        label: 'Compliance',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              <i className="ti ti-shield-check me-1" />Insurance{' '}
              <span className="fw-medium text-dark dt-insexp">{row.insuranceExpiry}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-file-certificate me-1" />Registration{' '}
              <span className="fw-medium text-dark dt-regexp">{row.registrationExpiry}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-discount me-1" />Fitness{' '}
              <span className="fw-medium text-dark">{row.fitnessExpiry}</span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-secondary">
                <i className="ti ti-tool me-1" />Serviced {row.lastService}
              </span>{' '}
              <span className={complianceBadge[insuranceStatusOf(row)]}>
                <i className="ti ti-shield me-1" />{insuranceStatusOf(row)}
              </span>
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

  const workspace = useWorkspace<Vehicle>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['vehicle-type'] && row.type !== filters['vehicle-type']) return false;
      if (filters['vehicle-number'] && row.number !== filters['vehicle-number']) return false;
      if (filters.route && row.route !== filters.route) return false;
      if (filters.driver && row.driver !== filters.driver) return false;
      if (filters['fuel-type'] && row.fuel !== filters['fuel-type']) return false;
      if (filters['seating-capacity'] && seatBandOf(row) !== filters['seating-capacity']) return false;
      if (filters['insurance-status'] && insuranceStatusOf(row) !== filters['insurance-status']) return false;
      if (filters['maintenance-status'] && maintenanceStatusOf(row) !== filters['maintenance-status']) return false;
      if (filters['registration-expiry'] && registrationBandOf(row) !== filters['registration-expiry']) return false;
      if (filters.status && row.status !== filters.status) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'route':
          return routeLabelOf(a).localeCompare(routeLabelOf(b)) || a.number.localeCompare(b.number);
        case 'seats':
          return b.seats - a.seats || a.number.localeCompare(b.number);
        case 'registration':
          return dateKey(a.registrationExpiry) - dateKey(b.registrationExpiry);
        case 'updated':
          return dateKey(b.lastService) - dateKey(a.lastService);
        // Not in the sort menu, but the Status `<th>` is sortable.
        case 'status':
          return a.status.localeCompare(b.status) || a.number.localeCompare(b.number);
        case 'number':
        default:
          return a.number.localeCompare(b.number);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'updated',
    pageSize: 10,
  });

  const countBy = useCallback(
    (status: VehicleStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Vehicles', icon: 'ti ti-layout-list', count: rows.length },
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
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const createVehicle = useCallback(
    (draft: VehicleDraft) => {
      if (!draft.number.trim()) {
        push('Give the vehicle a number', 'warning');
        return;
      }
      const number = draft.number.trim();
      setRows((current) => [
        {
          id: number,
          number,
          model: draft.model.trim() || '—',
          type: draft.type,
          typeTint: 'primary',
          registration: draft.registration.trim() || '—',
          photo: 'assets/img/coach/coach-01.jpg',
          route: draft.route,
          driver: draft.driver,
          driverPhoto: driverPhotos[draft.driver] ?? '',
          fuel: draft.fuel,
          seats: toNumber(draft.seats, 0),
          mfgYear: toNumber(draft.mfgYear, 2024),
          insuranceExpiry: draft.insuranceExpiry.trim() || '—',
          registrationExpiry: draft.registrationExpiry.trim() || '—',
          fitnessExpiry: draft.fitnessExpiry.trim() || '—',
          lastService: '12 May 2024',
          nextService: '—',
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${number} added to the fleet`);
    },
    [push],
  );

  const updateVehicle = useCallback(
    (draft: VehicleDraft) =>
      patchRow(
        (row) => ({
          ...row,
          number: draft.number.trim() || row.number,
          model: draft.model.trim() || row.model,
          type: draft.type,
          registration: draft.registration.trim() || row.registration,
          route: draft.route,
          driver: draft.driver,
          driverPhoto: draft.driver ? driverPhotos[draft.driver] ?? row.driverPhoto : '',
          fuel: draft.fuel,
          seats: toNumber(draft.seats, row.seats),
          mfgYear: toNumber(draft.mfgYear, row.mfgYear),
          insuranceExpiry: draft.insuranceExpiry.trim() || row.insuranceExpiry,
          registrationExpiry: draft.registrationExpiry.trim() || row.registrationExpiry,
          fitnessExpiry: draft.fitnessExpiry.trim() || row.fitnessExpiry,
          status: draft.status,
        }),
        `${modalRow?.number ?? 'Vehicle'} updated`,
      ),
    [modalRow, patchRow],
  );

  const assignDriver = useCallback(
    (assignment: DriverAssignment) => {
      if (!assignment.driver) {
        push('Pick a driver to assign', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          driver: assignment.driver,
          driverPhoto: driverPhotos[assignment.driver] ?? row.driverPhoto,
          // A vehicle with a driver and a route is out running it.
          status: row.route && row.status === 'Available' ? 'On Route' : row.status,
        }),
        `${assignment.driver} assigned to ${modalRow?.number ?? 'the vehicle'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const assignRoute = useCallback(
    (assignment: RouteAssignment) => {
      if (!assignment.route) {
        push('Pick a route to assign', 'warning');
        return;
      }
      patchRow(
        (row) => {
          const driver = assignment.driver || row.driver;
          return {
            ...row,
            route: assignment.route,
            driver,
            driverPhoto: driver ? driverPhotos[driver] ?? row.driverPhoto : row.driverPhoto,
            status: driver && row.status === 'Available' ? 'On Route' : row.status,
          };
        },
        `${modalRow?.number ?? 'Vehicle'} assigned to ${assignment.route}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const scheduleMaintenance = useCallback(
    (plan: MaintenancePlan) => {
      if (!plan.serviceType) {
        push('Pick a service type', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          // `maintenanceStatusOf` reads this, so booking a service re-badges it.
          nextService: plan.scheduled.trim() || row.nextService,
          status: 'Maintenance',
        }),
        `${plan.serviceType} booked for ${modalRow?.number ?? 'the vehicle'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const saveInsurance = useCallback(
    (plan: InsurancePlan) => {
      if (!plan.policy.trim()) {
        push('Give the policy a number', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          insuranceExpiry: plan.expiry.trim() || row.insuranceExpiry,
          // Renewing clears the expiring flag the grid was showing.
          status: row.status === 'Insurance Expiring' ? (row.route ? 'On Route' : 'Available') : row.status,
        }),
        `Insurance saved for ${modalRow?.number ?? 'the vehicle'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const setStatus = useCallback(
    (ids: string[], status: VehicleStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'vehicle' : 'vehicles'} ${verb}`);
    },
    [push, workspace],
  );

  const removeVehicles = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'vehicle' : 'vehicles'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} vehicles exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'driver', label: 'Assign Driver', icon: 'ti ti-steering-wheel', onClick: () => openModal(null, 'assign-driver') },
      { id: 'route', label: 'Assign Route', icon: 'ti ti-route', onClick: () => openModal(null, 'assign-route') },
      { id: 'service', label: 'Schedule Maintenance', icon: 'ti ti-tool', onClick: () => openModal(null, 'maintenance') },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} vehicles exported`) },
      { id: 'retire', label: 'Out of Service', icon: 'ti ti-circle-off', onClick: (ids) => setStatus(ids, 'Out of Service', 'taken out of service') },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Vehicle) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Vehicle" ariaLabel="View Vehicle" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Vehicle" ariaLabel="Edit Vehicle" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Driver" ariaLabel="Assign Driver" onClick={() => openModal(row, 'assign-driver')}>
        <i className="ti ti-steering-wheel" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Route" ariaLabel="Assign Route" onClick={() => openModal(row, 'assign-route')}>
        <i className="ti ti-route" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Schedule Maintenance" ariaLabel="Schedule Maintenance" onClick={() => openModal(row, 'maintenance')}>
        <i className="ti ti-tool" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Insurance Details" ariaLabel="Insurance Details" onClick={() => openModal(row, 'insurance')}>
        <i className="ti ti-shield-check" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Documents" ariaLabel="Documents" onClick={() => openModal(row, 'documents')}>
        <i className="ti ti-files" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Live Tracking" ariaLabel="Live Tracking" onClick={() => openModal(row, 'track')}>
        <i className="ti ti-map-2" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Details" ariaLabel="Print Details" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete Vehicle" ariaLabel="Delete Vehicle" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Vehicle) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-bus" />Vehicle Specifications</h4>
          <p className="fs-12 text-muted mb-3">
            {row.model} · {row.type} · {row.fuel} · {row.seats} seats · manufactured {row.mfgYear}.
          </p>
          <h5 className="details-heading fs-15"><i className="ti ti-steering-wheel" />Assigned Driver Details</h5>
          {row.driver ? (
            <div className="d-flex align-items-center gap-2 mb-0">
              <span className="avatar avatar-sm">
                <ImageWithBasePath src={row.driverPhoto} className="rounded-circle flex-shrink-0" alt={row.driver} />
              </span>
              <div>
                <span className="fw-medium d-block fs-13">{row.driver}</span>
                <span className="fs-12 text-muted">License · Verified</span>
              </div>
            </div>
          ) : (
            <p className="fs-12 text-muted mb-0">No driver assigned.</p>
          )}
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-route" />Assigned Route Details</h6>
          <p className="fs-12 text-muted mb-3">{routeSummaryOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-tool" />Maintenance History</h6>
          <p className="fs-12 text-muted mb-0">{serviceRecordOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-shield-check" />Insurance &amp; Registration</h6>
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Policy</span><span className="fw-medium">{policyNumberOf(row)}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Insurance Expiry</span>
              <span className="fw-medium">{row.insuranceExpiry}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Registration Expiry</span>
              <span className="fw-medium">{row.registrationExpiry}</span>
            </li>
          </ul>
          <h6 className="details-heading"><i className="ti ti-clipboard-check" />Service Records</h6>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Last Service</span><span className="fw-medium">{row.lastService}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Next Service</span><span className="fw-medium">{row.nextService}</span>
            </li>
          </ul>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-files" />Documents</h6>
          <ul className="list-unstyled fs-12 mb-3">
            {documentsOf(row).map((document) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={document.label}>
                <span className="text-muted">{document.label}</span>
                <span className={complianceBadge[complianceStateOf(document.expiry)]}>
                  {complianceStateOf(document.expiry)}
                </span>
              </li>
            ))}
          </ul>
          <p className="fs-12 text-muted mb-1">
            Fitness {fitnessRefOf(row)} · Permit {permitRefOf(row)} to {permitExpiryOf(row)}.
          </p>
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
              onClick={() => openModal(row, 'documents')}
            >
              <i className="ti ti-files me-1" />Documents
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
            title="Vehicles"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Vehicles
                  </ActionLink>
                </div>
                <ExportMenu label="Export Vehicles" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-2" />Print Vehicle List
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Vehicle
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
            searchPlaceholder="Search vehicles, number, registration, route or driver…"
            searchLabel="Search vehicles"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="vehicles"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Vehicles refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Vehicle List"
                aria-label="Print Vehicle List"
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
            emptyIcon="ti ti-bus-off"
            emptyTitle="No vehicles match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Fleet list with vehicle details, compliance and status"
            selectAllLabel="Select all vehicles"
            rowLabel={(row) => `Select ${row.number}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <VehicleModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onCreate={createVehicle}
        onUpdate={updateVehicle}
        onAssignDriver={assignDriver}
        onAssignRoute={assignRoute}
        onScheduleMaintenance={scheduleMaintenance}
        onSaveInsurance={saveInsurance}
        onDelete={removeVehicles}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default TransportVehicles;
