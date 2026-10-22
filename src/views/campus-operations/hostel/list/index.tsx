import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import HostelModals from './modals/HostelModals';
import type { HostelDraft, HostelModalId } from './modals/HostelModals';
import type { Hostel, HostelStatus, Sharing } from './data/hostels.data';
import {
  MEDICAL_PHONE, SECURITY_PHONE, academicYearOptions, availabilityOptions, availableOf,
  blockOptions, buildingInfoOf, dateKey, descriptionOf, feeLabel, floorOptions, floorsLabel,
  hostelOptions, hostels as initialRows, notesOf, occupancyBandOf, occupancyLineOf,
  occupancyOptions, occupancyOf, occupancyTint, roomTypeLabel, searchIndexOf, statusIcon,
  statusOptions, statusPill, typeOptions, wardenOptions,
} from './data/hostels.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'hostel-type', label: 'Hostel Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'warden', label: 'Warden', kind: 'select', chipLabel: 'Warden', options: wardenOptions },
  { id: 'building', label: 'Building', kind: 'select', chipLabel: 'Building', options: blockOptions },
  { id: 'floor', label: 'Floor', kind: 'select', chipLabel: 'Floor', options: floorOptions },
  { id: 'occupancy-status', label: 'Occupancy Status', kind: 'select', chipLabel: 'Occupancy', options: occupancyOptions },
  { id: 'availability', label: 'Availability', kind: 'select', chipLabel: 'Availability', options: availabilityOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Hostel Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'capacity', label: 'Capacity', icon: 'ti ti-users' },
  { id: 'available', label: 'Available Beds', icon: 'ti ti-bed' },
  { id: 'warden', label: 'Warden', icon: 'ti ti-user-star' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: HostelStatus; label: string; icon: string }[] = [
  { id: 'Available', label: 'Available', icon: 'ti ti-circle-check' },
  { id: 'Nearly Full', label: 'Nearly Full', icon: 'ti ti-alert-circle' },
  { id: 'Full', label: 'Full', icon: 'ti ti-bed' },
  { id: 'Under Maintenance', label: 'Under Maintenance', icon: 'ti ti-tool' },
  { id: 'Closed', label: 'Closed', icon: 'ti ti-circle-off' },
];

const HostelList = () => {
  const [rows, setRows] = useState<Hostel[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<HostelModalId | null>(null);
  const [modalRow, setModalRow] = useState<Hostel | null>(null);
  /** Rows a dialog will write to — one row, or a whole bulk selection. */
  const [targetIds, setTargetIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Hostel | null, modal: HostelModalId) => {
    setModalRow(row);
    setTargetIds(row ? [row.id] : []);
    setActiveModal(modal);
  }, []);

  /** Bulk dialogs open seeded from the first selected hostel and write to all. */
  const openBulkModal = useCallback(
    (ids: string[], modal: HostelModalId) => {
      setModalRow(rows.find((row) => ids.includes(row.id)) ?? null);
      setTargetIds(ids);
      setActiveModal(modal);
    },
    [rows],
  );

  /** Applies a change to every row the open dialog targets. */
  const patchRows = useCallback(
    (change: (row: Hostel) => Hostel, message: string) => {
      if (targetIds.length === 0) return;
      setRows((current) => current.map((row) => (targetIds.includes(row.id) ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [push, targetIds],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Hostel>[]>(
    () => [
      {
        id: 'hostel',
        label: 'Hostel',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-${row.tint}-transparent text-${row.tint}`}
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-building-community fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="dt-type">{row.type}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`badge badge-soft-${row.tint}`}>
                  <i className="ti ti-building me-1" />{row.block}
                </span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-stairs me-1" />{floorsLabel(row)}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'details',
        label: 'Hostel Details',
        sortable: true,
        render: (row) => {
          const percent = occupancyOf(row);
          return (
            <ul className="list-unstyled mb-0 fs-12">
              <li className="d-flex align-items-center gap-1 py-1">
                <span className="avatar avatar-xs">
                  <ImageWithBasePath
                    src={row.wardenAvatar}
                    className="rounded-circle flex-shrink-0"
                    alt={row.warden}
                  />
                </span>
                <span>
                  <span className="text-muted">Warden</span>{' '}
                  <Link to={routes.teacherDetails} className="fw-medium text-dark dt-warden">{row.warden}</Link>
                </span>
              </li>
              <li className="d-flex flex-wrap gap-1 py-1">
                <span className="badge badge-soft-primary">
                  <i className="ti ti-door me-1" />
                  <span className="dt-rooms-val">{row.rooms}</span> Rooms
                </span>{' '}
                <span className="badge badge-soft-info">
                  <i className="ti ti-users me-1" />Cap <span className="dt-capacity-val">{row.capacity}</span>
                </span>
              </li>
              <li className="py-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-12 text-muted">
                    <span className="dt-occupied-val">{row.occupied}</span> occupied
                  </span>
                  <span className={`fs-12 fw-medium text-${occupancyTint(percent)}`}>{percent}%</span>
                </div>
                <div className={`meter meter-${occupancyTint(percent)}`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
              </li>
              <li className="py-1">
                <span className={`badge badge-soft-${availableOf(row) === 0 ? 'danger' : 'warning'}`}>
                  <i className="ti ti-bed me-1" />
                  <span className="dt-available-val">{availableOf(row)}</span> Beds Available
                </span>
              </li>
            </ul>
          );
        },
      },
      {
        id: 'facilities',
        label: 'Facilities',
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-bed me-1" />{row.sharing}
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-checklist me-1" />{row.facilities.join(', ')}
            </li>
            <li className="py-1">
              <span className="badge badge-soft-success">
                <i className="ti ti-cash me-1" />
                <span className="dt-fee-val">{feeLabel(row)}</span>/mo
              </span>{' '}
              <span className="text-muted ms-1">
                <i className="ti ti-phone me-1" />
                <span className="dt-contact">{row.contact}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-clock me-1" />Updated {row.updated}
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

  const workspace = useWorkspace<Hostel>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.hostel && row.name !== filters.hostel) return false;
      if (filters['hostel-type'] && row.type !== filters['hostel-type']) return false;
      if (filters.warden && row.warden !== filters.warden) return false;
      if (filters.building && row.block !== filters.building) return false;
      if (filters.floor && floorsLabel(row) !== filters.floor) return false;
      if (filters['occupancy-status'] && occupancyBandOf(row) !== filters['occupancy-status']) return false;
      if (filters.availability) {
        const vacant = availableOf(row) > 0;
        if (filters.availability === 'Beds Available' && !vacant) return false;
        if (filters.availability === 'No Vacancy' && vacant) return false;
      }
      if (filters.status && row.status !== filters.status) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'capacity':
          return b.capacity - a.capacity || a.name.localeCompare(b.name);
        case 'available':
          return availableOf(b) - availableOf(a) || a.name.localeCompare(b.name);
        case 'warden':
          return a.warden.localeCompare(b.warden) || a.name.localeCompare(b.name);
        // Not in the sort menu, but the Details and Status `<th>`s are sortable.
        case 'details':
          return occupancyOf(b) - occupancyOf(a) || a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        case 'recent':
          return dateKey(b.updated) - dateKey(a.updated);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so closing a hostel moves both rails. */
  const countBy = useCallback(
    (status: HostelStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Hostels', icon: 'ti ti-layout-list', count: rows.length },
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

  /** Occupancy can never exceed the capacity the row reports. */
  const capped = (occupied: number, capacity: number): number =>
    Math.max(0, Math.min(occupied, capacity));

  const createHostel = useCallback(
    (draft: HostelDraft) => {
      if (!draft.name.trim()) {
        push('Give the hostel a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `HST-${String(rows.length + 1).padStart(2, '0')}`;
      const capacity = toNumber(draft.capacity, 0);
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          tint: 'primary',
          type: draft.type as Hostel['type'],
          block: draft.block,
          floors: Math.max(1, toNumber(draft.floors, 1)),
          warden: draft.warden,
          wardenAvatar: 'assets/img/teachers/teacher-01.jpg',
          contact: draft.contact.trim(),
          rooms: toNumber(draft.rooms, 0),
          capacity,
          occupied: capped(toNumber(draft.occupied, 0), capacity),
          sharing: (draft.roomType === 'Single Room' ? 'Single' : draft.roomType) as Sharing,
          facilities: ['WiFi', 'Mess'],
          fee: toNumber(draft.fee, 0),
          updated: '12 May 2024',
          academicYear: draft.academicYear,
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updateHostel = useCallback(
    (draft: HostelDraft) =>
      patchRows(
        (row) => {
          const capacity = toNumber(draft.capacity, row.capacity);
          return {
            ...row,
            name: draft.name.trim() || row.name,
            code: draft.code.trim() || row.code,
            type: draft.type as Hostel['type'],
            block: draft.block,
            floors: Math.max(1, toNumber(draft.floors, row.floors)),
            warden: draft.warden || row.warden,
            contact: draft.contact.trim() || row.contact,
            rooms: toNumber(draft.rooms, row.rooms),
            capacity,
            occupied: capped(toNumber(draft.occupied, row.occupied), capacity),
            sharing: (draft.roomType === 'Single Room' ? 'Single' : draft.roomType) as Sharing,
            fee: toNumber(draft.fee, row.fee),
            academicYear: draft.academicYear,
            status: draft.status,
            updated: '12 May 2024',
          };
        },
        `${modalRow?.name ?? 'Hostel'} updated`,
      ),
    [modalRow, patchRows],
  );

  const assignWarden = useCallback(
    (warden: string, contact: string) => {
      if (!warden) {
        push('Pick a warden to assign', 'warning');
        return;
      }
      patchRows(
        (row) => ({ ...row, warden, contact: contact.trim() || row.contact, updated: '12 May 2024' }),
        `${warden} assigned to ${targetIds.length > 1 ? `${targetIds.length} hostels` : modalRow?.name ?? 'the hostel'}`,
      );
    },
    [modalRow, patchRows, push, targetIds.length],
  );

  const saveFacilities = useCallback(
    (facilities: string[], sharing: Sharing, fee: string) =>
      patchRows(
        (row) => ({
          ...row,
          facilities: facilities.length > 0 ? facilities : row.facilities,
          sharing,
          fee: toNumber(fee, row.fee),
          updated: '12 May 2024',
        }),
        `Facilities & fee updated for ${modalRow?.name ?? 'the hostel'}`,
      ),
    [modalRow, patchRows],
  );

  const setStatus = useCallback(
    (ids: string[], status: HostelStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'hostel' : 'hostels'} ${verb}`);
    },
    [push, workspace],
  );

  const duplicate = useCallback(
    (row: Hostel) => {
      const code = `${row.code}-C`;
      setRows((current) => [
        { ...row, id: code, code, name: `${row.name} (Copy)`, occupied: 0, status: 'Available' },
        ...current,
      ]);
      push(`${row.name} duplicated`);
    },
    [push],
  );

  const removeHostels = useCallback(() => {
    setRows((current) => current.filter((row) => !targetIds.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${targetIds.length} ${targetIds.length === 1 ? 'hostel' : 'hostels'} deleted`);
  }, [push, targetIds, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} hostels exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'warden', label: 'Assign Warden', icon: 'ti ti-user-star', onClick: (ids) => openBulkModal(ids, 'assign-warden') },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} hostels exported`) },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setModalRow(null); setTargetIds(ids); setActiveModal('delete'); },
      },
    ],
    [openBulkModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Hostel) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Hostel" ariaLabel="View Hostel" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Hostel" ariaLabel="Edit Hostel" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Manage Rooms" ariaLabel="Manage Rooms" onClick={() => openModal(row, 'rooms')}>
        <i className="ti ti-door" />
      </ActionLink>
      <Link className="dt-ib" title="Manage Residents" aria-label="Manage Residents" to={routes.studentGrid}>
        <i className="ti ti-users" />
      </Link>
      <ActionLink
        className="dt-ib" title="Assign Warden" ariaLabel="Assign Warden"
        onClick={() => openModal(row, 'assign-warden')}
      >
        <i className="ti ti-user-star" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="View Occupancy" ariaLabel="View Occupancy"
        onClick={() => openModal(row, 'occupancy')}
      >
        <i className="ti ti-bed" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Fee Structure" ariaLabel="Fee Structure"
        onClick={() => openModal(row, 'facilities')}
      >
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Maintenance" ariaLabel="Maintenance"
        onClick={() => setStatus([row.id], 'Under Maintenance', 'sent for maintenance')}
      >
        <i className="ti ti-tool" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Details" ariaLabel="Print Details" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Duplicate" ariaLabel="Duplicate" onClick={() => duplicate(row)}>
        <i className="ti ti-copy" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Export" ariaLabel="Export"
        onClick={() => push(`${row.name} exported`)}
      >
        <i className="ti ti-file-export" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Archive" ariaLabel="Archive"
        onClick={() => setStatus([row.id], 'Archived', 'archived')}
      >
        <i className="ti ti-archive" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Hostel) => {
    const percent = occupancyOf(row);
    return (
      <div className="dt-detail-inner">
        <div className="row g-4">
          <div className="col-xl-3 col-md-6">
            <h4 className="details-heading fs-15 fw-medium">
              <i className="ti ti-file-description" />Hostel Description
            </h4>
            <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
            <h5 className="details-heading fs-15"><i className="ti ti-building" />Building Information</h5>
            <p className="fs-12 text-muted mb-0">{buildingInfoOf(row)}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-door" />Room Summary</h6>
            <ul className="list-unstyled fs-12 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Total Rooms</span>
                <span className="fw-medium">{row.rooms}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Room Type</span>
                <span className="fw-medium">{roomTypeLabel(row.sharing)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Monthly Fee</span>
                <span className="fw-medium">{feeLabel(row)}</span>
              </li>
            </ul>
            <h6 className="details-heading"><i className="ti ti-bed" />Occupancy Details</h6>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12 text-muted">{occupancyLineOf(row)}</span>
              <span className="fs-12 fw-medium">{percent}%</span>
            </div>
            <div className={`meter meter-${occupancyTint(percent)}`}>
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-checklist" />Facilities &amp; Amenities</h6>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {row.facilities.map((facility) => (
                <span className="badge badge-soft-primary" key={facility}>{facility}</span>
              ))}
            </div>
            <h6 className="details-heading"><i className="ti ti-user-star" />Warden Information</h6>
            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-sm">
                <ImageWithBasePath
                  src={row.wardenAvatar}
                  className="rounded-circle flex-shrink-0"
                  alt={row.warden}
                />
              </span>
              <div>
                <span className="fw-medium d-block">{row.warden}</span>
                <span className="fs-12 text-muted">{row.contact}</span>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-urgent" />Emergency Contacts</h6>
            <ul className="list-unstyled fs-12 text-muted mb-3">
              <li className="py-1"><i className="ti ti-phone me-1" />Warden {row.contact}</li>
              <li className="py-1"><i className="ti ti-first-aid-kit me-1" />Medical {MEDICAL_PHONE}</li>
              <li className="py-1"><i className="ti ti-shield me-1" />Security {SECURITY_PHONE}</li>
            </ul>
            <h6 className="details-heading"><i className="ti ti-notes" />Notes</h6>
            <p className="fs-12 text-muted mb-2">{notesOf(row)}</p>
            <div className="d-flex gap-2">
              <button
                type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'view')}
              >
                <i className="ti ti-eye me-1" />View
              </button>
              <button
                type="button" className="btn btn-primary btn-sm flex-fill"
                onClick={() => openModal(row, 'rooms')}
              >
                <i className="ti ti-door me-1" />Rooms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Hostel List"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Hostels
                  </ActionLink>
                </div>
                <ExportMenu label="Export Hostels" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-2" />Print
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Hostel
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
            searchPlaceholder="Search hostels, code, warden or block…"
            searchLabel="Search hostels"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="hostels"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Hostels refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print"
                aria-label="Print"
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
            emptyIcon="ti ti-building-off"
            emptyTitle="No hostels match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Hostel list with warden, occupancy and facility details"
            selectAllLabel="Select all hostels"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <HostelModals
        active={activeModal}
        row={modalRow}
        deleteCount={targetIds.length}
        onClose={() => setActiveModal(null)}
        onCreate={createHostel}
        onUpdate={updateHostel}
        onAssignWarden={assignWarden}
        onSaveFacilities={saveFacilities}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onDelete={removeHostels}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default HostelList;
