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
import RoomTypeModals from './modals/RoomTypeModals';
import type { RoomTypeDraft, RoomTypeModalId } from './modals/RoomTypeModals';
import type {
  Category, GenderAllocation, RoomTypeRow, RoomTypeStatus,
} from './data/roomTypes.data';
import {
  academicYearOptions, amenitiesFrom, bedLabel, capacityBandOf, capacityOptions, categoryOptions,
  dateKey, depositLabel, descriptionOf, facilityFilterOptions, feeBandOf, feeBandOptions, feeLabel,
  furnitureOf, hostelOptions, meterTint, notesOf, occupancyLineOf, occupancyOf, percentTint,
  roomTypes as initialRows, searchIndexOf, statusIcon, statusOptions, statusPill,
  typeOptions, usageGuidelines, yearlyLabel,
} from './data/roomTypes.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'room-type', label: 'Room Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'capacity', label: 'Capacity', kind: 'select', chipLabel: 'Capacity', options: capacityOptions },
  { id: 'fee-range', label: 'Fee Range', kind: 'select', chipLabel: 'Fee', allLabel: 'Any', options: feeBandOptions },
  { id: 'facilities', label: 'Facilities', kind: 'select', chipLabel: 'Facility', options: facilityFilterOptions },
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Room Type (A–Z)', icon: 'ti ti-abc' },
  { id: 'capacity', label: 'Bed Capacity', icon: 'ti ti-users' },
  { id: 'available', label: 'Available Rooms', icon: 'ti ti-door' },
  { id: 'fee', label: 'Monthly Fee', icon: 'ti ti-cash' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: RoomTypeStatus; label: string; icon: string }[] = [
  { id: 'Available', label: 'Available', icon: 'ti ti-door' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Fully Occupied', label: 'Fully Occupied', icon: 'ti ti-bed' },
  { id: 'Maintenance', label: 'Maintenance', icon: 'ti ti-tool' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-off' },
];

/**
 * The Hostel filter names a hostel, and a type covers its first `hostels` of
 * them — the same slice the availability dialog breaks its rooms across.
 */
const coversHostel = (row: RoomTypeRow, hostel: string): boolean =>
  hostelOptions.slice(0, Math.min(row.hostels, hostelOptions.length)).includes(hostel);

const HostelRoomTypes = () => {
  const [rows, setRows] = useState<RoomTypeRow[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<RoomTypeModalId | null>(null);
  const [modalRow, setModalRow] = useState<RoomTypeRow | null>(null);
  /** Rows a dialog will write to — one row, or a whole bulk selection. */
  const [targetIds, setTargetIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: RoomTypeRow | null, modal: RoomTypeModalId) => {
    setModalRow(row);
    setTargetIds(row ? [row.id] : []);
    setActiveModal(modal);
  }, []);

  /** Bulk dialogs open seeded from the first selected type and write to all. */
  const openBulkModal = useCallback(
    (ids: string[], modal: RoomTypeModalId) => {
      setModalRow(rows.find((row) => ids.includes(row.id)) ?? null);
      setTargetIds(ids);
      setActiveModal(modal);
    },
    [rows],
  );

  /** Applies a change to every row the open dialog targets. */
  const patchRows = useCallback(
    (change: (row: RoomTypeRow) => RoomTypeRow, message: string) => {
      if (targetIds.length === 0) return;
      setRows((current) => current.map((row) => (targetIds.includes(row.id) ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [push, targetIds],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<RoomTypeRow>[]>(
    () => [
      {
        id: 'type',
        label: 'Room Type',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-${row.tint}-transparent text-${row.tint}`}
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-bed fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="dt-category">{row.category}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`badge badge-soft-${row.tint}`}>
                  <i className="ti ti-tag me-1" />{row.category}
                </span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-bed me-1" />{bedLabel(row)}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'config',
        label: 'Configuration',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-users me-1" />Cap <span className="dt-capacity-val">{row.capacity}</span>
              </span>{' '}
              <span className="badge badge-soft-secondary">
                <i className="ti ti-gender-bigender me-1" />{row.gender}
              </span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-success">
                <i className="ti ti-cash me-1" />
                <span className="dt-fee-val">{feeLabel(row)}</span>/mo
              </span>{' '}
              <span className="badge badge-soft-info">
                <i className="ti ti-shield-dollar me-1" />Dep{' '}
                <span className="dt-deposit-val">{depositLabel(row)}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-checklist me-1" />{row.amenities.join(', ')}
            </li>
          </ul>
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
              <li className="d-flex flex-wrap gap-1 py-1">
                <span className="badge badge-soft-primary">
                  <i className="ti ti-building-community me-1" />
                  <span className="dt-hostels-val">{row.hostels}</span> Hostels
                </span>
              </li>
              <li className="py-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-12 text-muted">
                    <span className="dt-occ-val">{row.occupied}</span> occupied ·{' '}
                    <span className="dt-avail-val">{row.available}</span> free
                  </span>
                  <span className={`fs-12 fw-medium text-${percentTint(row)}`}>{percent}%</span>
                </div>
                <div className={`meter meter-${meterTint(row)}`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
              </li>
              <li className="d-flex align-items-center gap-1 py-1">
                <span className="avatar avatar-xs">
                  <ImageWithBasePath
                    src={row.createdByAvatar}
                    className="rounded-circle flex-shrink-0"
                    alt={row.createdBy}
                  />
                </span>
                <span>
                  <span className="text-muted">By</span>{' '}
                  <span className="fw-medium text-dark dt-createdby">{row.createdBy}</span>
                </span>
              </li>
              <li className="py-1 text-muted">
                <i className="ti ti-clock me-1" />Updated{' '}
                <span className="dt-updated fw-medium text-dark">{row.updated}</span>
              </li>
            </ul>
          );
        },
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

  const workspace = useWorkspace<RoomTypeRow>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['room-type'] && row.name !== filters['room-type']) return false;
      if (filters.hostel && !coversHostel(row, filters.hostel)) return false;
      if (filters.capacity && capacityBandOf(row) !== filters.capacity) return false;
      if (filters['fee-range'] && feeBandOf(row) !== filters['fee-range']) return false;
      if (filters.facilities && !row.amenities.some((amenity) => amenity.includes(filters.facilities))) {
        return false;
      }
      if (filters.category && row.category !== filters.category) return false;
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
          return b.available - a.available || a.name.localeCompare(b.name);
        case 'fee':
          return b.fee - a.fee || a.name.localeCompare(b.name);
        // Not in the sort menu, but three of the four `<th>`s are sortable.
        case 'config':
          return b.fee - a.fee || a.name.localeCompare(b.name);
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

  /** Counts follow the roster, so archiving a type moves both rails. */
  const countBy = useCallback(
    (status: RoomTypeStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Room Types', icon: 'ti ti-layout-list', count: rows.length },
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

  const createRoomType = useCallback(
    (draft: RoomTypeDraft) => {
      if (!draft.name.trim()) {
        push('Give the room type a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `RT-${String(rows.length + 1).padStart(2, '0')}`;
      const fee = toNumber(draft.fee, 0);
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          tint: 'primary',
          category: draft.category as Category,
          capacity: Math.max(1, toNumber(draft.capacity, 1)),
          gender: draft.gender as GenderAllocation,
          fee,
          // The template's own rule on nine of ten rows: twice the monthly fee.
          deposit: toNumber(draft.deposit, fee * 2),
          amenities: ['Bathroom', 'WiFi'],
          hostels: toNumber(draft.hostels, 1),
          occupied: toNumber(draft.occupied, 0),
          available: toNumber(draft.available, 0),
          createdBy: 'Kevin Larry',
          createdByAvatar: 'assets/img/profiles/avatar-27.jpg',
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

  const updateRoomType = useCallback(
    (draft: RoomTypeDraft) =>
      patchRows(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          code: draft.code.trim() || row.code,
          category: draft.category as Category,
          capacity: Math.max(1, toNumber(draft.capacity, row.capacity)),
          gender: draft.gender as GenderAllocation,
          fee: toNumber(draft.fee, row.fee),
          deposit: toNumber(draft.deposit, row.deposit),
          hostels: toNumber(draft.hostels, row.hostels),
          occupied: toNumber(draft.occupied, row.occupied),
          available: toNumber(draft.available, row.available),
          academicYear: draft.academicYear,
          status: draft.status,
          updated: '12 May 2024',
        }),
        `${modalRow?.name ?? 'Room type'} updated`,
      ),
    [modalRow, patchRows],
  );

  const assignHostels = useCallback(
    (hostels: string[]) => {
      if (hostels.length === 0) {
        push('Pick at least one hostel', 'warning');
        return;
      }
      patchRows(
        (row) => ({ ...row, hostels: hostels.length, updated: '12 May 2024' }),
        `${hostels.length} ${hostels.length === 1 ? 'hostel' : 'hostels'} assigned to ${modalRow?.name ?? 'the room type'}`,
      );
    },
    [modalRow, patchRows, push],
  );

  const saveFacilities = useCallback(
    (facilities: string[], gender: GenderAllocation) =>
      patchRows(
        (row) => ({
          ...row,
          amenities: facilities.length > 0 ? amenitiesFrom(facilities) : row.amenities,
          gender,
          updated: '12 May 2024',
        }),
        `Facilities saved for ${modalRow?.name ?? 'the room type'}`,
      ),
    [modalRow, patchRows],
  );

  const saveFees = useCallback(
    (fee: string, deposit: string) =>
      patchRows(
        (row) => ({
          ...row,
          fee: toNumber(fee, row.fee),
          deposit: toNumber(deposit, row.deposit),
          updated: '12 May 2024',
        }),
        `Fees updated for ${targetIds.length > 1 ? `${targetIds.length} room types` : modalRow?.name ?? 'the room type'}`,
      ),
    [modalRow, patchRows, targetIds.length],
  );

  const setStatus = useCallback(
    (ids: string[], status: RoomTypeStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'room type' : 'room types'} ${verb}`);
    },
    [push, workspace],
  );

  const duplicate = useCallback(
    (row: RoomTypeRow) => {
      const code = `${row.code}-C`;
      setRows((current) => [
        { ...row, id: code, code, name: `${row.name} (Copy)`, occupied: 0, status: 'Available' },
        ...current,
      ]);
      push(`${row.name} duplicated`);
    },
    [push],
  );

  const removeRoomTypes = useCallback(() => {
    setRows((current) => current.filter((row) => !targetIds.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${targetIds.length} ${targetIds.length === 1 ? 'room type' : 'room types'} deleted`);
  }, [push, targetIds, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} room types exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'hostels', label: 'Assign Hostels', icon: 'ti ti-building-community', onClick: (ids) => openBulkModal(ids, 'assign-hostels') },
      { id: 'fees', label: 'Update Fees', icon: 'ti ti-cash', onClick: (ids) => openBulkModal(ids, 'fees') },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} room types exported`) },
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

  const rowActions = (row: RoomTypeRow) => (
    <div className="dt-actions">
      <ActionLink
        className="dt-ib" title="View Room Type" ariaLabel="View Room Type"
        onClick={() => openModal(row, 'view')}
      >
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Edit Room Type" ariaLabel="Edit Room Type"
        onClick={() => openModal(row, 'edit')}
      >
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Assign Hostels" ariaLabel="Assign Hostels"
        onClick={() => openModal(row, 'assign-hostels')}
      >
        <i className="ti ti-building-community" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Manage Facilities" ariaLabel="Manage Facilities"
        onClick={() => openModal(row, 'facilities')}
      >
        <i className="ti ti-checklist" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Fee Configuration" ariaLabel="Fee Configuration"
        onClick={() => openModal(row, 'fees')}
      >
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Room Availability" ariaLabel="Room Availability"
        onClick={() => openModal(row, 'availability')}
      >
        <i className="ti ti-door" />
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

  const renderDetail = (row: RoomTypeRow) => {
    const percent = occupancyOf(row);
    return (
      <div className="dt-detail-inner">
        <div className="row g-4">
          <div className="col-xl-3 col-md-6">
            <h4 className="details-heading fs-15 fw-medium">
              <i className="ti ti-file-description" />Room Type Description
            </h4>
            <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
            <h5 className="details-heading fs-15"><i className="ti ti-checklist" />Amenities Included</h5>
            <div className="d-flex flex-wrap gap-1">
              {row.amenities.map((amenity) => (
                <span className="badge badge-soft-primary" key={amenity}>{amenity}</span>
              ))}
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-armchair" />Furniture &amp; Fixtures</h6>
            <p className="fs-12 text-muted mb-3">{furnitureOf(row)}</p>
            <h6 className="details-heading"><i className="ti ti-building-community" />Applicable Hostels</h6>
            <p className="fs-12 text-muted mb-0">
              Configured across <span className="fw-semibold text-dark">{row.hostels}</span> hostel(s).
            </p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-cash" />Pricing Details</h6>
            <ul className="list-unstyled fs-12 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Monthly Fee</span>
                <span className="fw-medium">{feeLabel(row)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Security Deposit</span>
                <span className="fw-medium">{depositLabel(row)}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Per Bed / Year</span>
                <span className="fw-medium">{yearlyLabel(row)}</span>
              </li>
            </ul>
            <h6 className="details-heading"><i className="ti ti-bed" />Occupancy Summary</h6>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12 text-muted">{occupancyLineOf(row)}</span>
              <span className="fs-12 fw-medium">{percent}%</span>
            </div>
            <div className={`meter meter-${meterTint(row)}`}>
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-list-check" />Usage Guidelines</h6>
            <ul className="fs-12 text-muted mb-3 ps-3">
              {usageGuidelines.map((line) => <li key={line}>{line}</li>)}
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
                onClick={() => openModal(row, 'fees')}
              >
                <i className="ti ti-cash me-1" />Fees
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
            title="Room Type"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Room Types
                  </ActionLink>
                </div>
                <ExportMenu label="Export Room Types" small onExport={exportAs} />
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
                    <i className="ti ti-square-rounded-plus me-2" />Add Room Type
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
            searchPlaceholder="Search room types, code, category or facilities…"
            searchLabel="Search room types"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="room types"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Room types refreshed'); }}
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
            emptyIcon="ti ti-bed-off"
            emptyTitle="No room types match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Hostel room type list with configuration, occupancy and status"
            selectAllLabel="Select all room types"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <RoomTypeModals
        active={activeModal}
        row={modalRow}
        deleteCount={targetIds.length}
        onClose={() => setActiveModal(null)}
        onCreate={createRoomType}
        onUpdate={updateRoomType}
        onAssignHostels={assignHostels}
        onSaveFacilities={saveFacilities}
        onSaveFees={saveFees}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onDelete={removeRoomTypes}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default HostelRoomTypes;
