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
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import RoomModals from './modals/RoomModals';
import type { RoomDraft, RoomModalId } from './modals/RoomModals';
import type { HostelRoom, RoomStatus, RoomType } from './data/hostelRooms.data';
import {
  availabilityOptions, availableOf, bedsOf, bedsPerRoom, blockOptions, dateKey, descriptionOf,
  facilityBadgesOf, feeBandOf, feeBandOptions, feeLabel, fireExitOf, floorLabel, floorOptions,
  hostelOptions, hostelRooms as initialRows, inspectionLineOf, maintenanceLineOf, meterTint,
  notesOf, occupancyBandOf, occupancyOptions, occupancyOf, occupantsLineOf, percentTint,
  roomNameOf, roomTypeOptions, searchIndexOf, statusIcon, statusOptions, statusPill,
} from './data/hostelRooms.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'building', label: 'Building', kind: 'select', chipLabel: 'Building', options: blockOptions },
  { id: 'floor', label: 'Floor', kind: 'select', chipLabel: 'Floor', options: floorOptions },
  { id: 'room-type', label: 'Room Type', kind: 'select', chipLabel: 'Type', options: roomTypeOptions },
  { id: 'room-status', label: 'Room Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'occupancy', label: 'Occupancy', kind: 'select', chipLabel: 'Occupancy', options: occupancyOptions },
  { id: 'availability', label: 'Availability', kind: 'select', chipLabel: 'Availability', options: availabilityOptions },
  { id: 'monthly-fee', label: 'Monthly Fee', kind: 'select', chipLabel: 'Fee', allLabel: 'Any', options: feeBandOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Room Number (A–Z)', icon: 'ti ti-abc' },
  { id: 'capacity', label: 'Bed Capacity', icon: 'ti ti-users' },
  { id: 'available', label: 'Available Beds', icon: 'ti ti-bed' },
  { id: 'fee', label: 'Monthly Fee', icon: 'ti ti-cash' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: RoomStatus; label: string; icon: string }[] = [
  { id: 'Available', label: 'Available', icon: 'ti ti-circle-check' },
  { id: 'Partially Occupied', label: 'Partially Occupied', icon: 'ti ti-user-check' },
  { id: 'Fully Occupied', label: 'Fully Occupied', icon: 'ti ti-bed' },
  { id: 'Reserved', label: 'Reserved', icon: 'ti ti-bookmark' },
  { id: 'Maintenance', label: 'Maintenance', icon: 'ti ti-tool' },
];

const HostelRooms = () => {
  const [rows, setRows] = useState<HostelRoom[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<RoomModalId | null>(null);
  const [modalRow, setModalRow] = useState<HostelRoom | null>(null);
  /** Rows a dialog will write to — one row, or a whole bulk selection. */
  const [targetIds, setTargetIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: HostelRoom | null, modal: RoomModalId) => {
    setModalRow(row);
    setTargetIds(row ? [row.id] : []);
    setActiveModal(modal);
  }, []);

  /** Bulk dialogs open seeded from the first selected room and write to all. */
  const openBulkModal = useCallback(
    (ids: string[], modal: RoomModalId) => {
      setModalRow(rows.find((row) => ids.includes(row.id)) ?? null);
      setTargetIds(ids);
      setActiveModal(modal);
    },
    [rows],
  );

  /** Applies a change to every row the open dialog targets. */
  const patchRows = useCallback(
    (change: (row: HostelRoom) => HostelRoom, message: string, keepOpen = false) => {
      if (targetIds.length === 0) return;
      setRows((current) => current.map((row) => (targetIds.includes(row.id) ? change(row) : row)));
      if (!keepOpen) setActiveModal(null);
      push(message);
    },
    [push, targetIds],
  );

  /**
   * Occupancy decides the status on its own for the three live states; the
   * template's Reserved, Maintenance and Out of Service rooms are set by hand
   * and stay put.
   */
  const statusFor = (row: HostelRoom, occupied: number): RoomStatus => {
    if (row.status === 'Reserved' || row.status === 'Maintenance' || row.status === 'Out of Service') {
      return row.status;
    }
    if (occupied === 0) return 'Available';
    return occupied >= row.capacity ? 'Fully Occupied' : 'Partially Occupied';
  };

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<HostelRoom>[]>(
    () => [
      {
        id: 'room',
        label: 'Room',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-${row.tint}-transparent text-${row.tint}`}
              ariaLabel={`View ${roomNameOf(row)}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-door fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {roomNameOf(row)}
              </ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="dt-hostel">{row.hostel}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`badge badge-soft-${row.tint}`}>
                  <i className="ti ti-building me-1" />{row.block}
                </span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-stairs me-1" />{floorLabel(row)}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'details',
        label: 'Room Details',
        sortable: true,
        render: (row) => {
          const percent = occupancyOf(row);
          const free = availableOf(row);
          return (
            <ul className="list-unstyled mb-0 fs-12">
              <li className="py-1">
                <span className="badge badge-soft-primary dt-roomtype">
                  <i className="ti ti-bed me-1" />{row.roomType}
                </span>
              </li>
              <li className="py-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-12">
                    <span className="dt-occupied-val">{row.occupied}</span> /{' '}
                    <span className="dt-capacity-val">{row.capacity}</span> beds
                  </span>
                  <span className={`fs-12 fw-medium text-${percentTint(row)}`}>{percent}%</span>
                </div>
                <div className={`meter meter-${meterTint(row)}`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
              </li>
              <li className="d-flex flex-wrap gap-1 py-1">
                <span className="badge badge-soft-primary">
                  <i className="ti ti-users me-1" />Occupied {row.occupied}
                </span>{' '}
                <span className={`badge badge-soft-${free === 0 ? 'danger' : 'success'}`}>
                  <i className="ti ti-bed me-1" />
                  <span className="dt-available-val">{free}</span> Free
                </span>
              </li>
              <li className="py-1">
                <span className="badge badge-soft-success">
                  <i className="ti ti-cash me-1" />
                  <span className="dt-fee-val">{feeLabel(row)}</span>/mo
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
          <>
            <div className="d-flex flex-wrap gap-1 mb-1">
              <span className={`badge badge-soft-${row.bathroom ? 'success' : 'secondary'}`}>
                <i className={`ti ${row.bathroom ? 'ti-bath' : 'ti-minus'} me-1`} />
                {row.bathroom ? 'Bathroom' : 'No Bathroom'}
              </span>
              <span className={`badge badge-soft-${row.ac ? 'success' : 'secondary'}`}>
                <i className={`ti ${row.ac ? 'ti-air-conditioning' : 'ti-minus'} me-1`} />
                {row.ac ? 'AC' : 'No AC'}
              </span>
            </div>
            <div className="d-flex flex-wrap gap-1 mb-1">
              <span className={`badge badge-soft-${row.wifi ? 'success' : 'secondary'}`}>
                <i className={`ti ${row.wifi ? 'ti-wifi' : 'ti-minus'} me-1`} />
                {row.wifi ? 'Wi-Fi' : 'No Wi-Fi'}
              </span>
            </div>
            <div className="fs-12 text-muted">
              <i className="ti ti-armchair me-1" />{row.furniture}
            </div>
            <div className="fs-12 text-muted mt-1">
              <i className="ti ti-clipboard-check me-1" />Inspected {row.inspected}
            </div>
          </>
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

  const workspace = useWorkspace<HostelRoom>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.hostel && row.hostel !== filters.hostel) return false;
      if (filters.building && row.block !== filters.building) return false;
      if (filters.floor && floorLabel(row) !== filters.floor) return false;
      if (filters['room-type'] && row.roomType !== filters['room-type']) return false;
      if (filters['room-status'] && row.status !== filters['room-status']) return false;
      if (filters.occupancy && occupancyBandOf(row) !== filters.occupancy) return false;
      if (filters.availability) {
        const vacant = availableOf(row) > 0;
        if (filters.availability === 'Beds Available' && !vacant) return false;
        if (filters.availability === 'No Vacancy' && vacant) return false;
      }
      if (filters['monthly-fee'] && feeBandOf(row) !== filters['monthly-fee']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'capacity':
          return b.capacity - a.capacity || a.room.localeCompare(b.room);
        case 'available':
          return availableOf(b) - availableOf(a) || a.room.localeCompare(b.room);
        case 'fee':
          return b.fee - a.fee || a.room.localeCompare(b.room);
        // Not in the sort menu, but the Details and Status `<th>`s are sortable.
        case 'details':
          return occupancyOf(b) - occupancyOf(a) || a.room.localeCompare(b.room);
        case 'status':
          return a.status.localeCompare(b.status) || a.room.localeCompare(b.room);
        case 'recent':
          return dateKey(b.inspected) - dateKey(a.inspected);
        case 'name':
        default:
          return a.room.localeCompare(b.room);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so filling a bed moves both rails. */
  const countBy = useCallback(
    (status: RoomStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Rooms', icon: 'ti ti-layout-list', count: rows.length },
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

  const createRoom = useCallback(
    (draft: RoomDraft) => {
      if (!draft.room.trim()) {
        push('Give the room a number', 'warning');
        return;
      }
      const code = draft.code.trim() || `RM-${String(9100 + rows.length)}`;
      const roomType = draft.roomType as RoomType;
      const capacity = toNumber(draft.capacity, bedsPerRoom(roomType));
      const occupied = Math.max(0, Math.min(toNumber(draft.occupied, 0), capacity));
      setRows((current) => [
        {
          id: code,
          code,
          room: draft.room.trim(),
          hostel: draft.hostel,
          tint: 'primary',
          block: draft.block,
          floor: Math.max(1, toNumber(draft.floor, 1)),
          roomType,
          capacity,
          occupied,
          fee: toNumber(draft.fee, 0),
          bathroom: draft.bathroom,
          ac: draft.ac,
          wifi: draft.wifi,
          furniture: draft.furniture.trim() || 'Bed, Desk, Wardrobe',
          inspected: '08 May 2024',
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`Room ${draft.room.trim()} added`);
    },
    [push, rows.length],
  );

  const updateRoom = useCallback(
    (draft: RoomDraft) =>
      patchRows(
        (row) => {
          const roomType = draft.roomType as RoomType;
          const capacity = toNumber(draft.capacity, row.capacity);
          const occupied = Math.max(0, Math.min(toNumber(draft.occupied, row.occupied), capacity));
          return {
            ...row,
            room: draft.room.trim() || row.room,
            code: draft.code.trim() || row.code,
            hostel: draft.hostel,
            block: draft.block,
            floor: Math.max(1, toNumber(draft.floor, row.floor)),
            roomType,
            capacity,
            occupied,
            fee: toNumber(draft.fee, row.fee),
            bathroom: draft.bathroom,
            ac: draft.ac,
            wifi: draft.wifi,
            furniture: draft.furniture.trim() || row.furniture,
            status: draft.status,
          };
        },
        `${modalRow ? roomNameOf(modalRow) : 'Room'} updated`,
      ),
    [modalRow, patchRows],
  );

  const assignStudent = useCallback(
    (student: string) => {
      if (!student) {
        push('Pick a student to assign', 'warning');
        return;
      }
      if (modalRow && availableOf(modalRow) === 0) {
        push('That room is full — vacate a bed first', 'warning');
        return;
      }
      patchRows(
        (row) => {
          const occupied = Math.min(row.capacity, row.occupied + 1);
          return { ...row, occupied, status: statusFor(row, occupied) };
        },
        `${student.split('—')[0].trim()} assigned to ${modalRow ? roomNameOf(modalRow) : 'the room'}`,
      );
    },
    [modalRow, patchRows, push],
  );

  /** Vacating from the occupant list frees the bed and keeps the dialog open. */
  const vacateBed = useCallback(
    (bed: string) =>
      patchRows(
        (row) => {
          const occupied = Math.max(0, row.occupied - 1);
          return { ...row, occupied, status: statusFor(row, occupied) };
        },
        `${bed} vacated in ${modalRow ? roomNameOf(modalRow) : 'the room'}`,
        true,
      ),
    [modalRow, patchRows],
  );

  /** "08/05/2024" from the picker, printed the way the row prints dates. */
  const inspectionDateOf = (value: string): string => {
    const [day, month, year] = value.split('/');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const name = months[Number(month) - 1];
    return name ? `${day} ${name} ${year}` : value;
  };

  const saveInspection = useCallback(
    (date: string, condition: string) =>
      patchRows(
        (row) => ({
          ...row,
          inspected: inspectionDateOf(date),
          // A room found in poor condition comes out of service.
          status: condition === 'Poor' ? 'Out of Service' : row.status,
        }),
        `Inspection recorded for ${modalRow ? roomNameOf(modalRow) : 'the room'}`,
      ),
    [modalRow, patchRows],
  );

  const submitMaintenance = useCallback(
    (issue: string, priority: string) => {
      if (!issue) {
        push('Pick an issue type', 'warning');
        return;
      }
      patchRows(
        // An urgent request takes the room out of service; anything else queues it.
        (row) => ({ ...row, status: priority === 'Urgent' ? 'Out of Service' : 'Maintenance' }),
        `${issue} request raised for ${modalRow ? roomNameOf(modalRow) : 'the room'}`,
      );
    },
    [modalRow, patchRows, push],
  );

  const saveFacilities = useCallback(
    (facilities: string[], roomType: RoomType, fee: string) =>
      patchRows(
        (row) => {
          const capacity = bedsPerRoom(roomType);
          const occupied = Math.min(row.occupied, capacity);
          return {
            ...row,
            bathroom: facilities.includes('Attached Bathroom'),
            ac: facilities.includes('Air Conditioning'),
            wifi: facilities.includes('Wi-Fi'),
            roomType,
            capacity,
            occupied,
            status: statusFor(row, occupied),
            fee: toNumber(fee, row.fee),
          };
        },
        `Facilities updated for ${modalRow ? roomNameOf(modalRow) : 'the room'}`,
      ),
    [modalRow, patchRows],
  );

  const setStatus = useCallback(
    (ids: string[], status: RoomStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'room' : 'rooms'} ${verb}`);
    },
    [push, workspace],
  );

  const duplicate = useCallback(
    (row: HostelRoom) => {
      const code = `${row.code}-C`;
      setRows((current) => [
        { ...row, id: code, code, room: `${row.room}A`, occupied: 0, status: 'Available' },
        ...current,
      ]);
      push(`${roomNameOf(row)} duplicated`);
    },
    [push],
  );

  const removeRooms = useCallback(() => {
    setRows((current) => current.filter((row) => !targetIds.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${targetIds.length} ${targetIds.length === 1 ? 'room' : 'rooms'} deleted`);
  }, [push, targetIds, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} rooms exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'assign', label: 'Assign Students', icon: 'ti ti-user-plus', onClick: (ids) => openBulkModal(ids, 'assign') },
      { id: 'maintenance', label: 'Schedule Maintenance', icon: 'ti ti-tool', onClick: (ids) => openBulkModal(ids, 'maintenance') },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} rooms exported`) },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Out of Service', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setModalRow(null); setTargetIds(ids); setActiveModal('delete'); },
      },
    ],
    [openBulkModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: HostelRoom) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Room" ariaLabel="View Room" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Room" ariaLabel="Edit Room" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Assign Student" ariaLabel="Assign Student"
        onClick={() => openModal(row, 'assign')}
      >
        <i className="ti ti-user-plus" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Manage Occupants" ariaLabel="Manage Occupants"
        onClick={() => openModal(row, 'occupants')}
      >
        <i className="ti ti-users" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Room Inspection" ariaLabel="Room Inspection"
        onClick={() => openModal(row, 'inspection')}
      >
        <i className="ti ti-clipboard-check" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Maintenance History" ariaLabel="Maintenance History"
        onClick={() => push(maintenanceLineOf(row), 'info')}
      >
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Maintenance Request" ariaLabel="Maintenance Request"
        onClick={() => openModal(row, 'maintenance')}
      >
        <i className="ti ti-tool" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Facilities" ariaLabel="Facilities"
        onClick={() => openModal(row, 'facilities')}
      >
        <i className="ti ti-checklist" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Details" ariaLabel="Print Details" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Duplicate Room" ariaLabel="Duplicate Room" onClick={() => duplicate(row)}>
        <i className="ti ti-copy" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Export" ariaLabel="Export"
        onClick={() => push(`${roomNameOf(row)} exported`)}
      >
        <i className="ti ti-file-export" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: HostelRoom) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium">
            <i className="ti ti-file-description" />Room Description
          </h4>
          <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-users" />Current Occupants</h5>
          <p className="fs-12 text-muted mb-0">{occupantsLineOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-bed" />Bed Allocation</h6>
          <ul className="list-unstyled fs-12 mb-3">
            {bedsOf(row).map((bed) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={bed.label}>
                <span className="text-muted">{bed.label}</span>
                <span className={`badge badge-soft-${bed.occupied ? 'primary' : 'success'}`}>
                  {bed.occupied ? 'Occupied' : 'Vacant'}
                </span>
              </li>
            ))}
          </ul>
          <h6 className="details-heading"><i className="ti ti-checklist" />Facilities &amp; Amenities</h6>
          <div className="d-flex flex-wrap gap-1">
            {facilityBadgesOf(row).map((badge) => (
              <span className="badge badge-soft-primary" key={badge}>{badge}</span>
            ))}
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-history" />Maintenance History</h6>
          <p className="fs-12 text-muted mb-3">{maintenanceLineOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-clipboard-check" />Inspection Records</h6>
          <p className="fs-12 text-muted mb-0">{inspectionLineOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-urgent" />Emergency Information</h6>
          <ul className="list-unstyled fs-12 text-muted mb-3">
            <li className="py-1"><i className="ti ti-fire-extinguisher me-1" />{fireExitOf(row)}</li>
            <li className="py-1"><i className="ti ti-first-aid-kit me-1" />First aid — warden&apos;s office</li>
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
              onClick={() => openModal(row, 'assign')}
            >
              <i className="ti ti-user-plus me-1" />Assign
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
            title="Hostel Rooms"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Rooms
                  </ActionLink>
                </div>
                <ExportMenu label="Export Rooms" small onExport={exportAs} />
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
                    <i className="ti ti-square-rounded-plus me-2" />Add Room
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
            searchPlaceholder="Search rooms, code, hostel or building…"
            searchLabel="Search rooms"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="rooms"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Rooms refreshed'); }}
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
            emptyIcon="ti ti-door-off"
            emptyTitle="No rooms match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Hostel room list with occupancy, facilities and status"
            selectAllLabel="Select all rooms"
            rowLabel={(row) => `Select ${roomNameOf(row)}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <RoomModals
        active={activeModal}
        row={modalRow}
        deleteCount={targetIds.length}
        onClose={() => setActiveModal(null)}
        onCreate={createRoom}
        onUpdate={updateRoom}
        onAssignStudent={assignStudent}
        onVacate={vacateBed}
        onSaveInspection={saveInspection}
        onSubmitMaintenance={submitMaintenance}
        onSaveFacilities={saveFacilities}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onDelete={removeRooms}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default HostelRooms;
