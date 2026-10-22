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
import DriverModals from './modals/DriverModals';
import type {
  AssignRouteDraft,
  AssignVehicleDraft,
  DriverDraft,
  DriverModalId,
  LicenseDraft,
} from './modals/DriverModals';
import type { Driver, DriverStatus } from './data/drivers.data';
import {
  academicYearOf, academicYearOptions, assignmentLineOf, availabilityOptions, captionOf,
  certifications, contactLineOf, dateKey, driverOptions, drivers as initialRows,
  employmentOptions, expiryBand, expiryOptions, hasRoute, hasVehicle, licenseLineOf,
  licenseTypeOptions, remarksOf, routeOptions, routeSentenceOf, searchIndexOf, statusIcon,
  statusOptions, statusPill, subtitleOf, transportDesk, vehicleOptions, vehicleSentenceOf,
  verificationBadge,
} from './data/drivers.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'driver', label: 'Driver', kind: 'select', chipLabel: 'Driver', options: driverOptions },
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', options: vehicleOptions },
  { id: 'route', label: 'Route', kind: 'select', chipLabel: 'Route', options: routeOptions },
  { id: 'license-type', label: 'License Type', kind: 'select', chipLabel: 'Licence', options: licenseTypeOptions },
  {
    id: 'license-expiry', label: 'License Expiry', kind: 'select', chipLabel: 'Expiry',
    // The template's blank option here reads "Any", not "All".
    allLabel: 'Any', options: expiryOptions,
  },
  { id: 'employment', label: 'Employment', kind: 'select', chipLabel: 'Employment', options: employmentOptions },
  {
    id: 'availability', label: 'Availability', kind: 'select', chipLabel: 'Availability',
    allLabel: 'Any', options: availabilityOptions,
  },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Driver (A–Z)', icon: 'ti ti-abc' },
  { id: 'vehicle', label: 'Vehicle', icon: 'ti ti-bus' },
  { id: 'experience', label: 'Experience', icon: 'ti ti-briefcase' },
  { id: 'expiry', label: 'License Expiry', icon: 'ti ti-calendar-x' },
  { id: 'updated', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The two rails share these statuses; the quick rail shortens one label. */
const rails: { id: DriverStatus; label: string; quickLabel: string; icon: string }[] = [
  { id: 'Active', label: 'Active', quickLabel: 'Active', icon: 'ti ti-circle-check' },
  { id: 'On Duty', label: 'On Duty', quickLabel: 'On Duty', icon: 'ti ti-steering-wheel' },
  { id: 'On Leave', label: 'On Leave', quickLabel: 'On Leave', icon: 'ti ti-plane-departure' },
  { id: 'License Expiring', label: 'License Expiring', quickLabel: 'Expiring', icon: 'ti ti-alert-triangle' },
  { id: 'Suspended', label: 'Suspended', quickLabel: 'Suspended', icon: 'ti ti-ban' },
];

const TransportDrivers = () => {
  const [rows, setRows] = useState<Driver[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<DriverModalId | null>(null);
  const [modalRow, setModalRow] = useState<Driver | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Driver | null, modal: DriverModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Driver) => Driver, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Driver>[]>(
    () => [
      {
        id: 'driver',
        label: 'Driver',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar avatar"
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub"><span className="link-primary dt-code">{row.code}</span></div>
              <div className="d-flex flex-column fs-12 mt-1">
                <span className="text-muted">
                  <i className="ti ti-phone me-1" /><span className="dt-phone">{row.phone}</span>
                </span>
                <span className="text-muted">
                  <i className="ti ti-mail me-1" /><span className="dt-email">{row.email}</span>
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'license',
        label: 'License Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className={`badge badge-soft-${row.licTone}`}>
                <i className="ti ti-id me-1" /><span className="dt-licno">{row.licenseNo}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-license me-1" />Type:{' '}
              <span className="fw-medium text-dark dt-lictype">{row.licenseType}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-plus me-1" />Issued{' '}
              <span className="fw-medium text-dark">{row.issued}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-x me-1" />Expires{' '}
              <span className="fw-medium text-dark dt-expiry">{row.expires}</span>
            </li>
            <li className="py-1">
              <span className={verificationBadge[row.verification]}>
                <i className="ti ti-discount me-1" />{row.verification}
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
              <span className={`badge badge-soft-${hasVehicle(row) ? 'primary' : 'secondary'}`}>
                <i className="ti ti-bus me-1" />
                <span className="dt-vehicle">{hasVehicle(row) ? row.vehicle : 'No vehicle'}</span>
              </span>
            </li>
            <li className="py-1">
              <span className={`badge badge-soft-${hasRoute(row) ? 'info' : 'secondary'}`}>
                <i className="ti ti-route me-1" />
                <span className="dt-route">{hasRoute(row) ? row.route : 'No route'}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-briefcase me-1" />
              <span className="dt-exp-val">{row.experience}</span> yrs experience
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-event me-1" />Joined{' '}
              <span className="fw-medium text-dark">{row.joined}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-urgent me-1" />Emergency{' '}
              <span className="fw-medium text-dark">{row.emergency}</span>
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

  const workspace = useWorkspace<Driver>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.driver && row.name !== filters.driver) return false;
      if (filters.vehicle && row.vehicle !== filters.vehicle) return false;
      if (filters.route && row.route !== filters.route) return false;
      if (filters['license-type'] && row.licenseType !== filters['license-type']) return false;
      if (filters['license-expiry'] && expiryBand(row) !== filters['license-expiry']) return false;
      if (filters.employment && row.verification !== filters.employment) return false;
      if (filters.availability && row.status !== filters.availability) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['academic-year'] && academicYearOf(row) !== filters['academic-year']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'vehicle':
          return a.vehicle.localeCompare(b.vehicle) || a.name.localeCompare(b.name);
        case 'experience':
          return b.experience - a.experience || a.name.localeCompare(b.name);
        case 'expiry':
          return dateKey(a.expires) - dateKey(b.expires);
        case 'updated':
          return dateKey(b.joined) - dateKey(a.joined);
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
    (status: DriverStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Drivers', icon: 'ti ti-layout-list', count: rows.length },
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

  const createDriver = useCallback(
    (draft: DriverDraft) => {
      if (!draft.name.trim()) {
        push('Give the driver a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `DRV-${1000 + rows.length + 1}`;
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          avatar: 'assets/img/teachers/teacher-01.jpg',
          phone: draft.phone.trim() || '—',
          email: draft.email.trim() || '—',
          licenseNo: draft.licenseNo.trim() || '—',
          licenseType: draft.licenseType,
          issued: draft.issued.trim() || '—',
          expires: draft.expires.trim() || '—',
          verification: draft.verification,
          licTone: 'primary',
          vehicle: draft.vehicle,
          route: draft.route,
          experience: toNumber(draft.experience, 0),
          joined: '12 May 2024',
          emergency: transportDesk,
          status: draft.vehicle && draft.route ? 'On Duty' : 'Available',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updateDriver = useCallback(
    (draft: DriverDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          code: draft.code.trim() || row.code,
          phone: draft.phone.trim() || row.phone,
          email: draft.email.trim() || row.email,
          licenseNo: draft.licenseNo.trim() || row.licenseNo,
          licenseType: draft.licenseType,
          issued: draft.issued.trim() || row.issued,
          expires: draft.expires.trim() || row.expires,
          verification: draft.verification,
          vehicle: draft.vehicle,
          route: draft.route,
          experience: toNumber(draft.experience, row.experience),
        }),
        `${modalRow?.name ?? 'Driver'} updated`,
      ),
    [modalRow, patchRow],
  );

  const assignVehicle = useCallback(
    (draft: AssignVehicleDraft) => {
      if (!draft.vehicle) {
        push('Pick a vehicle to assign', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          vehicle: draft.vehicle,
          // A driver with both a vehicle and a route is on duty.
          status: row.route ? 'On Duty' : 'Active',
        }),
        `${draft.vehicle} assigned to ${modalRow?.name ?? 'the driver'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const assignRoute = useCallback(
    (draft: AssignRouteDraft) => {
      if (!draft.route) {
        push('Pick a route to assign', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          route: draft.route,
          vehicle: draft.vehicle || row.vehicle,
          status: draft.vehicle || row.vehicle ? 'On Duty' : 'Active',
        }),
        `${modalRow?.name ?? 'Driver'} assigned to ${draft.route}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const verifyLicense = useCallback(
    (draft: LicenseDraft) =>
      patchRow(
        (row) => ({
          ...row,
          licenseNo: draft.licenseNo.trim() || row.licenseNo,
          licenseType: draft.licenseType,
          issued: draft.issued.trim() || row.issued,
          expires: draft.expires.trim() || row.expires,
          verification: draft.verification,
          // Re-verifying clears the expiring flag the grid was showing.
          status:
            row.status === 'License Expiring' && draft.verification === 'Verified'
              ? (row.vehicle ? 'On Duty' : 'Active')
              : row.status,
        }),
        `Licence updated for ${modalRow?.name ?? 'the driver'}`,
      ),
    [modalRow, patchRow],
  );

  const setStatus = useCallback(
    (ids: string[], status: DriverStatus, verb: string) => {
      setRows((current) =>
        current.map((row) =>
          ids.includes(row.id)
            // Suspending takes the driver off their vehicle and route.
            ? { ...row, status, ...(status === 'Suspended' ? { vehicle: '', route: '' } : null) }
            : row,
        ),
      );
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'driver' : 'drivers'} ${verb}`);
    },
    [push, workspace],
  );

  const removeDrivers = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'driver' : 'drivers'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} drivers exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'vehicle', label: 'Assign Vehicle', icon: 'ti ti-bus', onClick: () => openModal(null, 'assign-vehicle') },
      { id: 'route', label: 'Assign Route', icon: 'ti ti-route', onClick: () => openModal(null, 'assign-route') },
      { id: 'print', label: 'Print Driver List', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} drivers exported`) },
      { id: 'suspend', label: 'Suspend', icon: 'ti ti-ban', onClick: (ids) => setStatus(ids, 'Suspended', 'suspended') },
      { id: 'deactivate', label: 'Deactivate', icon: 'ti ti-circle-off', onClick: (ids) => setStatus(ids, 'Inactive', 'deactivated') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Driver) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Driver" ariaLabel="View Driver" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Profile" ariaLabel="Edit Profile" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Vehicle" ariaLabel="Assign Vehicle" onClick={() => openModal(row, 'assign-vehicle')}>
        <i className="ti ti-bus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Route" ariaLabel="Assign Route" onClick={() => openModal(row, 'assign-route')}>
        <i className="ti ti-route" />
      </ActionLink>
      <ActionLink className="dt-ib" title="License Details" ariaLabel="License Details" onClick={() => openModal(row, 'license')}>
        <i className="ti ti-id" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Documents" ariaLabel="Documents" onClick={() => openModal(row, 'documents')}>
        <i className="ti ti-files" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Profile" ariaLabel="Print Profile" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Suspend Driver" ariaLabel="Suspend Driver"
        onClick={() => setStatus([row.id], 'Suspended', 'suspended')}
      >
        <i className="ti ti-ban" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete Driver" ariaLabel="Delete Driver" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Driver) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-user" />Driver Profile</h4>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="avatar avatar-sm">
              <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
            </span>
            <div>
              <span className="fw-medium d-block fs-13">{row.name}</span>
              <span className="fs-12 text-muted">{captionOf(row)}</span>
            </div>
          </div>
          <p className="fs-12 text-muted mb-0">{subtitleOf(row)}</p>
          <p className="fs-12 text-muted mb-0">{contactLineOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-bus" />Assigned Vehicle Details</h6>
          <p className="fs-12 text-muted mb-3">{vehicleSentenceOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-route" />Assigned Route Details</h6>
          <p className="fs-12 text-muted mb-0">{routeSentenceOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-id" />License Information</h6>
          <p className="fs-12 text-muted mb-3">{licenseLineOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-briefcase" />Employment History</h6>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Joined</span><span className="fw-medium">{row.joined}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Experience</span>
              <span className="fw-medium">{row.experience} yrs</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Assignment</span>
              <span className="fw-medium">{assignmentLineOf(row)}</span>
            </li>
          </ul>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-certificate" />Training &amp; Certifications</h6>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {certifications.map((item) => (
              <span className={item.badge} key={item.label}>{item.label}</span>
            ))}
          </div>
          <h6 className="details-heading"><i className="ti ti-urgent" />Emergency Contacts</h6>
          <ul className="list-unstyled fs-12 text-muted mb-3">
            <li className="py-1"><i className="ti ti-phone me-1" />Driver {row.phone}</li>
            <li className="py-1"><i className="ti ti-headset me-1" />Transport Desk {row.emergency}</li>
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
            title="Drivers"
            section="Transport"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Drivers
                  </ActionLink>
                </div>
                <ExportMenu label="Export Drivers" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-2" />Print Driver List
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Driver
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
            searchPlaceholder="Search drivers, employee ID, license, vehicle or route…"
            searchLabel="Search drivers"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="drivers"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Drivers refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Driver List"
                aria-label="Print Driver List"
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
            emptyIcon="ti ti-user-off"
            emptyTitle="No drivers match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Driver list with license details, assignment details and status"
            selectAllLabel="Select all drivers"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <DriverModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onCreate={createDriver}
        onUpdate={updateDriver}
        onAssignVehicle={assignVehicle}
        onAssignRoute={assignRoute}
        onVerify={verifyLicense}
        onDelete={removeDrivers}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default TransportDrivers;
