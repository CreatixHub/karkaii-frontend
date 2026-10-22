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
import AllocationModals from './modals/AllocationModals';
import type { AllocateDraft, AllocationModalId } from './modals/AllocationModals';
import type { Allocation, AllocationStatus, RoomType } from './data/allocations.data';
import {
  DASH, SUMMARY_TOTALS, academicYearOptions, allocations as initialRows, bedAvailabilityOptions,
  bedBandOf, bedsFreeOf, bedsOf, blockFloorKeyOf, blockFloorOptions, dateKey, feeBandOf,
  guardianPairsOf, hostelFeeOptions, hostelGenderOf, hostelInfoOf, hostelLabelOf, hostelOptions,
  hostelTintOf, money, profilePairsOf, roomOptions, roomTypeOptions, roomTypeTint,
  searchIndexOf, statusBadge, statusOptions, statusPill, wardenContactOf, wardenOf,
} from './data/allocations.data';

const routes = all_routes;

/**
 * Ids match the template's own. Academic Year and Allocation Status open
 * already committed, which is what puts the two chips on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'block-floor', label: 'Block / Floor', kind: 'select', chipLabel: 'Block', options: blockFloorOptions },
  { id: 'room-type', label: 'Room Type', kind: 'select', chipLabel: 'Type', options: roomTypeOptions },
  { id: 'room', label: 'Room', kind: 'select', chipLabel: 'Room', options: roomOptions },
  {
    id: 'allocation-status', label: 'Allocation Status', kind: 'select', chipLabel: 'Status',
    options: statusOptions, initialValue: 'Allocated',
  },
  {
    id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Academic Year',
    options: academicYearOptions, initialValue: '2026 / 2027',
  },
  { id: 'bed-availability', label: 'Bed Availability', kind: 'select', chipLabel: 'Beds', options: bedAvailabilityOptions },
  { id: 'hostel-fee', label: 'Hostel Fee', kind: 'select', chipLabel: 'Fee', options: hostelFeeOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'hostel', label: 'Hostel', icon: 'ti ti-building-fortress' },
  { id: 'room', label: 'Room number', icon: 'ti ti-door' },
  { id: 'checkin', label: 'Check-in date', icon: 'ti ti-calendar-event' },
  { id: 'roomtype', label: 'Room type', icon: 'ti ti-bed' },
];

const savedViewDefs: { id: string; label: string; icon: string; status?: AllocationStatus }[] = [
  { id: 'all', label: 'All Allocations', icon: 'ti ti-layout-list' },
  { id: 'Allocated', label: 'Active Allocations', icon: 'ti ti-circle-check', status: 'Allocated' },
  { id: 'Pending Approval', label: 'Pending Approval', icon: 'ti ti-clock', status: 'Pending Approval' },
  { id: 'Waiting List', label: 'Waiting List', icon: 'ti ti-users', status: 'Waiting List' },
  { id: 'Fee Hold', label: 'Fee Hold', icon: 'ti ti-alert-triangle', status: 'Fee Hold' },
];

const RoomAllocation = () => {
  const [rows, setRows] = useState<Allocation[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AllocationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Allocation | null>(null);
  const [panelRow, setPanelRow] = useState<Allocation | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Allocation | null, modal: AllocationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: Allocation) => Allocation, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Allocation>[]>(
    () => [
      {
        id: 'allocation',
        label: 'Allocation ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.student}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                {row.classSection}<span className="dt-dot">•</span>Roll {row.roll}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'admission',
        label: 'Admission No.',
        cellClassName: 'fs-13',
        render: (row) => row.admission,
      },
      {
        id: 'hostel',
        label: 'Hostel',
        sortable: true,
        render: (row) =>
          row.hostel ? (
            <>
              <span className={`badge badge-soft-${hostelTintOf(row)}`}>{row.hostel}</span>
              <span className="d-block fs-12 text-muted mt-1">{hostelGenderOf(row)}</span>
            </>
          ) : (
            <>
              <span className="d-block fs-13 text-muted">{DASH}</span>
              <span className="fs-12 text-muted">Not assigned</span>
            </>
          ),
      },
      {
        id: 'block',
        label: 'Block / Floor',
        sortable: true,
        render: (row) =>
          row.block ? (
            <>
              <span className="d-block fs-13 fw-medium">{row.block}</span>
              <span className="fs-12 text-muted">{row.floor}</span>
            </>
          ) : (
            <>
              <span className="d-block fs-13 text-muted">{DASH}</span>
              <span className="fs-12 text-muted">Awaiting bed</span>
            </>
          ),
      },
      {
        id: 'room',
        label: 'Room No.',
        sortable: true,
        render: (row) =>
          row.room
            ? <span className="badge badge-soft-secondary">{row.room}</span>
            : <span className="text-muted">{DASH}</span>,
      },
      {
        id: 'bed',
        label: 'Bed No.',
        render: (row) =>
          row.bed
            ? <span className="badge badge-soft-secondary">{row.bed}</span>
            : <span className="text-muted">{DASH}</span>,
      },
      {
        id: 'roomtype',
        label: 'Room Type',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${roomTypeTint[row.roomType]}`}>{row.roomType}</span>
        ),
      },
      {
        id: 'checkin',
        label: 'Check-In Date',
        sortable: true,
        cellClassName: 'fs-13',
        render: (row) => (row.checkIn ? row.checkIn : <span className="text-muted">{DASH}</span>),
      },
      {
        id: 'status',
        label: 'Allocation Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Allocation>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.hostel) {
        const label = row.hostel ? `${hostelLabelOf(row)} · ${hostelInfoOf(row.hostel)?.gender}` : 'Not assigned';
        if (label !== filters.hostel) return false;
      }
      if (filters['block-floor'] && blockFloorKeyOf(row) !== filters['block-floor']) return false;
      if (filters['room-type'] && row.roomType !== filters['room-type']) return false;
      if (filters.room) {
        if (filters.room === 'Rooms with free beds') {
          if (bedsFreeOf(row) === 0) return false;
        } else if (row.room !== filters.room) return false;
      }
      if (filters['allocation-status'] && row.status !== filters['allocation-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['bed-availability'] && bedBandOf(row) !== filters['bed-availability']) return false;
      if (filters['hostel-fee'] && feeBandOf(row) !== filters['hostel-fee']) return false;
      return true;
    },
    /** The rail's last chip is a vacancy filter, not a status one. */
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'Free Beds') return bedsFreeOf(row) > 0;
      if (quick === 'Pending') return row.status === 'Pending Approval';
      return row.status === quick;
    },
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'hostel':
          return hostelLabelOf(a).localeCompare(hostelLabelOf(b)) || a.student.localeCompare(b.student);
        case 'room':
          return (a.room || 'zz').localeCompare(b.room || 'zz') || a.student.localeCompare(b.student);
        case 'checkin':
          return dateKey(a.checkIn) - dateKey(b.checkIn) || a.student.localeCompare(b.student);
        case 'roomtype':
          return a.roomType.localeCompare(b.roomType) || a.student.localeCompare(b.student);
        // Not in the sort menu, but the Allocation ID `<th>` is sortable.
        case 'allocation':
          return a.id.localeCompare(b.id);
        case 'name':
        default:
          return a.student.localeCompare(b.student);
      }
    },
    // The template opens sorted by student name, with the Allocated chip lit.
    defaultSort: 'name',
    defaultQuick: 'Allocated',
    pageSize: 8,
  });

  /** Counts follow the roster, so vacating a bed moves both rails. */
  const countBy = useCallback(
    (status: AllocationStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () =>
      savedViewDefs.map((view) => ({
        id: view.id,
        label: view.label,
        icon: view.icon,
        count: view.status ? countBy(view.status) : rows.length,
      })),
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Allocated', label: 'Allocated', icon: 'ti ti-circle-check', count: countBy('Allocated') },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: countBy('Pending Approval') },
      { id: 'Waiting List', label: 'Waiting List', icon: 'ti ti-users', count: countBy('Waiting List') },
      { id: 'Fee Hold', label: 'Fee Hold', icon: 'ti ti-alert-triangle', count: countBy('Fee Hold') },
      {
        id: 'Free Beds', label: 'Free Beds', icon: 'ti ti-bed-flat',
        count: rows.reduce((total, row) => total + bedsFreeOf(row), 0),
      },
    ],
    [countBy, rows],
  );

  /**
   * The strip counts the whole register — 268 allocations against the eight
   * rows this page holds — so the template's figures stand, except the waiting
   * list, which the roster can actually move.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-bed', label: 'Total Allocations',
        value: String(SUMMARY_TOTALS.allocations), hint: `across ${SUMMARY_TOTALS.hostels} hostels`,
      },
      {
        id: 'rooms', tint: 'success', icon: 'ti ti-door', label: 'Occupied Rooms',
        value: String(SUMMARY_TOTALS.occupiedRooms), hint: `of ${SUMMARY_TOTALS.totalRooms} rooms`,
      },
      {
        id: 'beds', tint: 'info', icon: 'ti ti-bed-flat', label: 'Available Beds',
        value: String(SUMMARY_TOTALS.availableBeds), hint: 'ready to assign',
      },
      {
        id: 'vacant', tint: 'warning', icon: 'ti ti-door-off', label: 'Vacant Rooms',
        value: String(SUMMARY_TOTALS.vacantRooms), hint: `${SUMMARY_TOTALS.underMaintenance} under maintenance`,
      },
      {
        id: 'waiting', tint: 'danger', icon: 'ti ti-clock', label: 'Waiting List',
        value: String(SUMMARY_TOTALS.waiting - 1 + countBy('Waiting List')), hint: 'awaiting a bed',
      },
    ],
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** "A-207 · 1 bed free" → "A-207". */
  const roomFrom = (choice: string): string => choice.split('·')[0].trim();

  /** "B3 · swap with Sophia Miller" → "B3"; "Auto-assign next free bed" → ''. */
  const bedFrom = (choice: string): string => {
    if (!choice || /auto-assign/i.test(choice)) return '';
    return choice.split('·')[0].trim();
  };

  const allocate = useCallback(
    (draft: AllocateDraft) => {
      if (!draft.student || !draft.hostel || !draft.room) {
        push('Student, hostel and room are all required', 'warning');
        return;
      }
      const [name, admission] = draft.student.split('·').map((part) => part.trim());
      const hostel = draft.hostel.split('·')[0].trim().replace(' Hostel', '');
      const room = roomFrom(draft.room);
      const bed = bedFrom(draft.bed) || 'B1';
      const [day, month, year] = draft.checkIn.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const checkIn = months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : draft.checkIn;
      const capacity = draft.roomType === 'Single Room' ? 1
        : draft.roomType === 'Double Sharing' ? 2
          : draft.roomType === 'Triple Sharing' ? 3
            : draft.roomType === 'Four Sharing' ? 4 : 6;
      const info = hostelInfoOf(hostel);
      const id = `ALC-2026-0${140 + rows.length}`;

      setRows((current) => [
        {
          id,
          student: name,
          avatar: 'assets/img/students/student-03.jpg',
          classSection: 'III A',
          roll: '35014',
          admission: admission ?? '',
          hostel,
          block: draft.block,
          floor: draft.floor,
          room,
          bed,
          roomType: draft.roomType as RoomType,
          checkIn,
          academicYear: draft.academicYear,
          status: 'Allocated',
          bloodGroup: DASH,
          homeTown: DASH,
          guardian: DASH, relation: DASH, mobile: DASH, email: DASH, emergency: DASH,
          capacity,
          occupied: 1,
          hostelPairs: [
            { label: 'Hostel', value: info?.full ?? hostel },
            { label: 'Type', value: info?.gender ?? DASH },
            { label: 'Warden', value: info?.warden ?? DASH },
            { label: 'Total Rooms', value: String(info?.rooms ?? 0) },
            { label: 'Mess', value: info?.mess ?? DASH },
          ],
          roomPairs: [
            { label: 'Room No', value: room },
            { label: 'Bed No', value: bed },
            { label: 'Room Type', value: draft.roomType },
            { label: 'Floor', value: `${draft.floor} · ${draft.block}` },
            { label: 'Occupancy', value: `1 of ${capacity}` },
          ],
          feePairs: [
            { label: 'Annual Hostel Fee', value: `$${draft.fee}` },
            { label: 'Term I', value: draft.invoice ? 'Invoiced' : 'Not billed' },
            { label: 'Term II', value: 'Not billed' },
            { label: 'Invoice', value: draft.invoice ? 'Raised on allocation' : 'Not raised' },
          ],
          roommates: [],
          roommatesEmpty: 'No roommates yet — newly allocated.',
          history: [{ title: `Allocated to ${room} · bed ${bed}`, meta: `${checkIn} · Warden` }],
          notes: draft.notes.trim() || 'Newly allocated.',
          annualFee: Number(draft.fee.replace(/[^0-9.]/g, '')) || 0,
          invoice: draft.invoice ? 'Raised on allocation' : 'Not raised',
          invoiceNote: draft.invoice ? 'Invoice raised on allocation' : 'No invoice raised',
          checkOut: 'Not scheduled',
          nights: 0,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${name} allocated to ${room} · bed ${bed}`);
    },
    [push, rows.length],
  );

  const changeRoom = useCallback(
    (block: string, floor: string, roomChoice: string, bedChoice: string, reason: string) => {
      const room = roomFrom(roomChoice);
      const bed = bedFrom(bedChoice) || 'B1';
      patchRow(
        (row) => ({
          ...row,
          block,
          floor,
          room,
          bed,
          // A move into a fresh room leaves the old roommates behind.
          roommates: [],
          roommatesEmpty: 'No roommates yet — newly moved in.',
          occupied: 1,
          status: row.status === 'Transfer Requested' ? 'Allocated' : row.status,
          roomPairs: row.roomPairs.map((pair) => {
            if (pair.label === 'Room No') return { ...pair, value: room };
            if (pair.label === 'Bed No') return { ...pair, value: bed };
            if (pair.label === 'Floor') return { ...pair, value: `${floor} · ${block}` };
            if (pair.label === 'Occupancy') return { ...pair, value: `1 of ${row.capacity}` };
            return pair;
          }),
          history: [...row.history, { title: `Moved to ${room} · bed ${bed}`, meta: `05 Aug 2026 · ${reason}` }],
        }),
        `${modalRow?.student ?? 'Student'} moved to ${room} · bed ${bed}`,
      );
    },
    [modalRow, patchRow],
  );

  const changeBed = useCallback(
    (bedChoice: string, reason: string, swap: boolean) => {
      const bed = bedFrom(bedChoice);
      if (!bed) {
        push('Pick the bed to move into', 'warning');
        return;
      }
      patchRow(
        (row) => {
          const previous = row.bed;
          const occupant = bedsOf(row).find((slot) => slot.label === bed)?.occupant;
          return {
            ...row,
            bed,
            // A swap moves the other student into the bed just vacated.
            roommates: row.roommates.map((mate) =>
              swap && mate.name === occupant
                ? { ...mate, detail: mate.detail.replace(/bed\s+B\d+/i, `bed ${previous}`) }
                : mate,
            ),
            roomPairs: row.roomPairs.map((pair) =>
              pair.label === 'Bed No' ? { ...pair, value: bed } : pair,
            ),
            history: [...row.history, { title: `Bed changed to ${bed}`, meta: `01 Aug 2026 · ${reason}` }],
          };
        },
        `${modalRow?.student ?? 'Student'} moved to bed ${bed}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const transfer = useCallback(
    (target: string, roomChoice: string, bedChoice: string, reason: string) => {
      if (!target) {
        push('Pick the hostel to transfer to', 'warning');
        return;
      }
      const hostel = target.split('·')[0].trim().replace(' Hostel', '').replace(' Annexe', '');
      const info = hostelInfoOf(hostel);
      const room = /auto-assign/i.test(roomChoice) ? '' : roomFrom(roomChoice);
      const bed = room ? bedFrom(bedChoice) || 'B1' : '';
      patchRow(
        (row) => ({
          ...row,
          hostel: info ? info.name : hostel,
          block: room ? row.block : '',
          floor: room ? row.floor : '',
          room,
          bed,
          roommates: [],
          roommatesEmpty: room ? 'No roommates yet — newly transferred.' : 'No roommates yet — awaiting a bed.',
          occupied: room ? 1 : 0,
          status: room ? 'Allocated' : 'Pending Approval',
          hostelPairs: row.hostelPairs.map((pair) => {
            if (pair.label === 'Hostel' || pair.label === 'Preferred Hostel') {
              return { ...pair, value: info?.full ?? target.split('·')[0].trim() };
            }
            if (pair.label === 'Type') return { ...pair, value: info?.gender ?? pair.value };
            if (pair.label === 'Warden') return { ...pair, value: info?.warden ?? pair.value };
            if (pair.label === 'Mess') return { ...pair, value: info?.mess ?? pair.value };
            return pair;
          }),
          roomPairs: row.roomPairs.map((pair) => {
            if (pair.label === 'Room No') return { ...pair, value: room || 'Awaiting assignment' };
            if (pair.label === 'Bed No') return { ...pair, value: bed || 'Awaiting assignment' };
            return pair;
          }),
          history: [
            ...row.history,
            { title: `Transferred to ${info?.full ?? hostel}`, meta: `10 Aug 2026 · ${reason}` },
          ],
        }),
        `${modalRow?.student ?? 'Student'} transferred to ${info?.full ?? hostel}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const vacate = useCallback(
    (reason: string, checkOut: string, release: string) => {
      const [day, month, year] = checkOut.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const printed = months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : checkOut;
      patchRow(
        (row) => ({
          ...row,
          status: 'Checked Out',
          checkOut: printed,
          occupied: Math.max(0, row.occupied - 1),
          roomPairs: row.roomPairs.map((pair) => {
            if (pair.label === 'Room No') return { ...pair, value: `${row.room} · released` };
            if (pair.label === 'Bed No') return { ...pair, value: `${row.bed} · vacant` };
            if (pair.label === 'Occupancy') {
              return { ...pair, value: `${Math.max(0, row.occupied - 1)} of ${row.capacity}` };
            }
            return pair;
          }),
          history: [
            ...row.history,
            { title: `Checked out — ${reason.toLowerCase()}`, meta: `${printed} · ${release}` },
          ],
        }),
        `${modalRow?.student ?? 'Student'} checked out — bed released`,
      );
    },
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} allocations exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Allocation) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View allocation" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change room" onClick={() => openModal(row, 'change-room')}>
        <i className="ti ti-door" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Change bed" onClick={() => openModal(row, 'change-bed')}>
        <i className="ti ti-bed" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Vacate room" onClick={() => openModal(row, 'vacate')}>
        <i className="ti ti-logout" />
      </ActionLink>
    </div>
  );

  /** The panel's label/value rows, which every section but three is built from. */
  const pairList = (pairs: { label: string; value: string }[]) =>
    pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={pair.label}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">{pair.value}</span>
      </div>
    ));

  const renderDetail = (row: Allocation) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Student Profile</h6>
        {pairList(profilePairsOf(row))}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-phone text-success me-1" />Guardian Information</h6>
        {pairList(guardianPairsOf(row))}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-building-fortress text-info me-1" />Hostel Details
        </h6>
        {pairList(row.hostelPairs)}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-bed text-warning me-1" />Room &amp; Bed Information</h6>
        {pairList(row.roomPairs)}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-users text-purple me-1" />Roommates</h6>
        {row.roommates.length === 0 ? (
          <p className="fs-13 text-muted mb-0">{row.roommatesEmpty}</p>
        ) : (
          row.roommates.map((mate) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={mate.name}>
              <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                <i className="ti ti-user" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{mate.name}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{mate.detail}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-report-money text-success me-1" />Hostel Fee Details</h6>
        {pairList(row.feePairs)}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-history text-info me-1" />Allocation History</h6>
        {row.history.map((entry) => (
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
            <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
              <i className="ti ti-history" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
              <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Allocation
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-bed me-1" />Allocation Panel
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
            title="Room Allocation"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Occupancy Sheet" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'allocate')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Allocate Room
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
            workspaceId="raWorkspace"
            searchPlaceholder="Search student, room or bed…"
            searchLabel="Search allocations"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="allocations"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Allocations refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-bed-off"
            emptyTitle="No allocations match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Allocation Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Allocation Details"
            labelledById="ra_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Student Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.student} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.id} · {panelRow.classSection} · {panelRow.admission}
                    </span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Hostel Information</h6>
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Hostel</span>
                    <span className={`badge badge-soft-${hostelTintOf(panelRow)}`}>
                      {panelRow.hostel
                        ? `${panelRow.hostel} · ${hostelInfoOf(panelRow.hostel)?.gender}`
                        : 'Not assigned'}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Block &amp; Floor</span>
                    <span className="fs-13 fw-medium">
                      {panelRow.block ? `${panelRow.block} · ${panelRow.floor}` : DASH}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Room No</span>
                    <span className="badge badge-soft-secondary">{panelRow.room || DASH}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <span className="fs-13 text-muted">Bed No</span>
                    <span className="badge badge-soft-secondary">{panelRow.bed || DASH}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Room Capacity</h6>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Capacity</span>
                      <h5 className="mb-0">{panelRow.capacity}</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Occupied</span>
                      <h5 className="mb-0 text-warning">{panelRow.occupied}</h5>
                    </div>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Bed Availability</h6>
                <div className="row g-2 mb-3">
                  {bedsOf(panelRow).map((slot) => (
                    <div className="col-6" key={slot.label}>
                      <div className="border rounded p-2 d-flex align-items-center gap-2">
                        <span className={`badge badge-soft-${slot.self ? 'primary' : 'secondary'}`}>
                          {slot.label}
                        </span>
                        <span className={`fs-12 text-truncate ${slot.self ? 'fw-medium' : 'text-muted'}`}>
                          {slot.occupant}
                        </span>
                      </div>
                    </div>
                  ))}
                  {panelRow.capacity === 0 ? (
                    <div className="col-12">
                      <span className="fs-12 text-muted">No bed assigned — {panelRow.student} is on the waiting list.</span>
                    </div>
                  ) : null}
                </div>

                <h6 className="fs-14 mb-2">Warden Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-purple-transparent text-purple rounded flex-shrink-0">
                    <i className="ti ti-user-shield" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{wardenOf(panelRow)}</h6>
                    <span className="fs-12 text-muted">Warden · {hostelLabelOf(panelRow)}</span>
                  </div>
                  <ActionLink
                    className="dt-ib" ariaLabel="Call warden"
                    onClick={() => push(`Warden line ${wardenContactOf(panelRow)}`, 'info')}
                  >
                    <i className="ti ti-phone" />
                  </ActionLink>
                </div>

                <h6 className="fs-14 mb-2">Check-in / Check-out Details</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Check-In Date', value: panelRow.checkIn || DASH },
                    { label: 'Check-Out Date', value: panelRow.checkOut },
                    { label: 'Nights Stayed', value: String(panelRow.nights) },
                    { label: 'Academic Year', value: panelRow.academicYear },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                {panelRow.history.map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                    <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                      <i className="ti ti-history" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{entry.title}</h6>
                      <span className="fs-12 text-muted">{entry.meta}</span>
                    </div>
                  </div>
                ))}
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-file-invoice" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">Hostel fee · {money(panelRow.annualFee)}</h6>
                    <span className="fs-12 text-muted">{panelRow.invoice} · {panelRow.invoiceNote}</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'change-room'); }}
                  >
                    <i className="ti ti-door me-1" />Change Room
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'change-bed'); }}
                  >
                    <i className="ti ti-bed me-1" />Change Bed
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AllocationModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onAllocate={allocate}
        onChangeRoom={changeRoom}
        onChangeBed={changeBed}
        onTransfer={transfer}
        onVacate={vacate}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="raToasts" />
    </>
  );
};

export default RoomAllocation;
