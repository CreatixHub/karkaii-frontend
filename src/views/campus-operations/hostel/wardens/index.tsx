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
import WardenModals from './modals/WardenModals';
import type { WardenDraft, WardenModalId } from './modals/WardenModals';
import type { Designation, Shift, Warden } from './data/wardens.data';
import {
  DASH, SUMMARY_TOTALS, auditOf, blockFloorOptions, contactPairsOf, coversBlockFloor,
  designationOptions, employmentPairsOf, experienceBandOf, experienceLabel, experienceOptions,
  genderOptions, hostelGender, hostelKeyOf, hostelOptions, hostelTintOf,
  profilePairsOf, residenceBandOf, residenceOptions, searchIndexOf, shiftKeyOf, shiftOptions,
  shiftTint, statusBadge, statusOptions, statusPill, wardens as initialRows,
} from './data/wardens.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'block-floor', label: 'Block / Floor', kind: 'select', chipLabel: 'Block', options: blockFloorOptions },
  { id: 'gender', label: 'Gender', kind: 'select', chipLabel: 'Gender', options: genderOptions },
  { id: 'shift', label: 'Shift', kind: 'select', chipLabel: 'Shift', options: shiftOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'designation', label: 'Designation', kind: 'select', chipLabel: 'Role', options: designationOptions },
  { id: 'experience', label: 'Experience', kind: 'select', chipLabel: 'Experience', allLabel: 'Any', options: experienceOptions },
  { id: 'residence', label: 'Residence', kind: 'select', chipLabel: 'Residence', options: residenceOptions },
];

const sortOptions: SortOption[] = [
  { id: 'id', label: 'Warden ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Warden name (A–Z)', icon: 'ti ti-abc' },
  { id: 'hostel', label: 'Assigned hostel', icon: 'ti ti-building-fortress' },
  { id: 'shift', label: 'Shift', icon: 'ti ti-clock-hour-4' },
  { id: 'experience', label: 'Experience', icon: 'ti ti-briefcase' },
];

/** How many of the initial eight sit in each summary band. */
const initialActive = initialRows.filter((row) => row.status === 'Active').length;
const initialDay = initialRows.filter((row) => row.shift === 'Day Shift').length;
const initialNight = initialRows.filter((row) => row.shift === 'Night Shift').length;

const HostelWardens = () => {
  const [rows, setRows] = useState<Warden[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<WardenModalId | null>(null);
  const [modalRow, setModalRow] = useState<Warden | null>(null);
  const [panelRow, setPanelRow] = useState<Warden | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Warden | null, modal: WardenModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: Warden) => Warden, message: string, keepOpen = false) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      if (!keepOpen) setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Warden>[]>(
    () => [
      {
        id: 'id',
        label: 'Warden ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'name',
        label: 'Warden Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.name} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.designation}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'employee',
        label: 'Employee ID',
        cellClassName: 'fs-13',
        render: (row) => row.employeeId,
      },
      {
        id: 'hostel',
        label: 'Assigned Hostel',
        sortable: true,
        render: (row) =>
          row.hostel ? (
            <>
              <span className={`badge badge-soft-${hostelTintOf(row)}`}>{row.hostel}</span>
              <span className="d-block fs-12 text-muted mt-1">{hostelGender[row.hostel]}</span>
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
              <span className="fs-12 text-muted">{row.floors}</span>
            </>
          ) : (
            <>
              <span className="d-block fs-13 text-muted">{DASH}</span>
              <span className="fs-12 text-muted">Awaiting assignment</span>
            </>
          ),
      },
      {
        id: 'shift',
        label: 'Shift',
        sortable: true,
        render: (row) => <span className={`badge badge-soft-${shiftTint[row.shift]}`}>{row.shift}</span>,
      },
      {
        id: 'contact',
        label: 'Contact Number',
        cellClassName: 'fs-13',
        render: (row) => row.contact,
      },
      {
        id: 'experience',
        label: 'Experience',
        sortable: true,
        cellClassName: 'fs-13',
        render: (row) => experienceLabel(row),
      },
      {
        id: 'status',
        label: 'Status',
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

  const workspace = useWorkspace<Warden>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.hostel && hostelKeyOf(row) !== filters.hostel) return false;
      if (filters['block-floor'] && !coversBlockFloor(row, filters['block-floor'])) return false;
      if (filters.gender && row.gender !== filters.gender) return false;
      if (filters.shift && shiftKeyOf(row) !== filters.shift) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters.designation && row.designation !== filters.designation) return false;
      if (filters.experience && experienceBandOf(row) !== filters.experience) return false;
      if (filters.residence && residenceBandOf(row) !== filters.residence) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing; the rest are shift or state. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Unassigned') return row.hostel === '';
      if (quick === 'Active') return row.status === 'Active';
      return row.shift === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'Active': return row.status === 'Active';
        case 'Day Shift': return row.shift === 'Day Shift';
        case 'Night Shift': return row.shift === 'Night Shift';
        case 'Unassigned': return row.hostel === '';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'hostel':
          return a.hostel.localeCompare(b.hostel) || a.name.localeCompare(b.name);
        case 'shift':
          return a.shift.localeCompare(b.shift) || a.name.localeCompare(b.name);
        case 'experience':
          return b.experience - a.experience || a.name.localeCompare(b.name);
        // Not in the sort menu, but the Block `<th>` is sortable.
        case 'block':
          return (a.block || 'zz').localeCompare(b.block || 'zz');
        case 'id':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'id',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Warden) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Wardens', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Active', label: 'Active Wardens', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Active') },
      { id: 'Day Shift', label: 'Day Shift', icon: 'ti ti-sun', count: countBy((row) => row.shift === 'Day Shift') },
      { id: 'Night Shift', label: 'Night Shift', icon: 'ti ti-moon', count: countBy((row) => row.shift === 'Night Shift') },
      { id: 'Unassigned', label: 'Unassigned', icon: 'ti ti-user-question', count: countBy((row) => row.hostel === '') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Active', label: 'Active', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Active') },
      { id: 'Day Shift', label: 'Day Shift', icon: 'ti ti-sun', count: countBy((row) => row.shift === 'Day Shift') },
      { id: 'Night Shift', label: 'Night Shift', icon: 'ti ti-moon', count: countBy((row) => row.shift === 'Night Shift') },
      { id: 'Unassigned', label: 'Unassigned', icon: 'ti ti-user-question', count: countBy((row) => row.hostel === '') },
    ],
    [countBy, rows.length],
  );

  /**
   * The strip counts the whole staff of twelve against the eight this page
   * lists — the template says so itself — so its figures stand and the roster
   * moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-user-shield', label: 'Total Wardens',
        value: String(SUMMARY_TOTALS.wardens - SUMMARY_TOTALS.shown + rows.length),
        hint: `${rows.length} shown on this page`,
      },
      {
        id: 'active', tint: 'success', icon: 'ti ti-circle-check', label: 'Active Wardens',
        value: String(SUMMARY_TOTALS.active - initialActive + countBy((row) => row.status === 'Active')),
        hint: `${countBy((row) => row.status === 'On Leave')} on leave · ${countBy((row) => row.status === 'Retired')} retired`,
      },
      {
        id: 'hostels', tint: 'info', icon: 'ti ti-building-fortress', label: 'Assigned Hostels',
        value: String(SUMMARY_TOTALS.hostels), hint: `${SUMMARY_TOTALS.rooms} rooms covered`,
      },
      {
        id: 'day', tint: 'warning', icon: 'ti ti-sun', label: 'Day Shift',
        value: String(SUMMARY_TOTALS.day - initialDay + countBy((row) => row.shift === 'Day Shift')),
        hint: '06:00 – 18:00',
      },
      {
        id: 'night', tint: 'dark', icon: 'ti ti-moon', label: 'Night Shift',
        value: String(SUMMARY_TOTALS.night - initialNight + countBy((row) => row.shift === 'Night Shift')),
        hint: '18:00 – 06:00',
      },
    ],
    [countBy, rows.length],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** "14-03-1984" → "14 Mar 1984", the way the row prints dates. */
  const toRowDate = (value: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, month, year] = value.split('-');
    return months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : value;
  };

  const toYears = (value: string, fallback = 0): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const shiftFrom = (choice: string): Shift => {
    if (choice.startsWith('Night')) return 'Night Shift';
    if (choice.startsWith('Rotational')) return 'Rotational';
    return 'Day Shift';
  };

  const hostelFrom = (choice: string): string => {
    if (!choice || choice === 'Assign later') return '';
    return choice.split('·')[0].trim().replace(' Hostel', '');
  };

  const createWarden = useCallback(
    (draft: WardenDraft) => {
      if (!draft.name.trim()) {
        push('Give the warden a name', 'warning');
        return;
      }
      const id = `WRD-0${String(rows.length + 1).padStart(2, '0')}`;
      const hostel = hostelFrom(draft.hostel);
      setRows((current) => [
        ...current,
        {
          id,
          name: draft.name.trim(),
          avatar: 'assets/img/teachers/teacher-03.jpg',
          designation: draft.designation as Designation,
          employeeId: draft.employeeId.trim() || `EMP-2026-${String(rows.length + 90)}`,
          hostel,
          block: hostel ? draft.block : '',
          floors: hostel ? 'All floors' : '',
          shift: shiftFrom(draft.shift),
          contact: draft.contact.trim(),
          experience: toYears(draft.experience),
          status: hostel ? draft.status : 'Pending Assignment',
          gender: draft.gender as Warden['gender'],
          dob: toRowDate(draft.dob),
          joined: toRowDate(draft.joined),
          email: draft.email.trim(),
          residence: draft.residence,
          hostelPairs: [
            { label: hostel ? 'Hostel' : 'Preferred Hostel', value: hostel ? `${hostel} Hostel` : 'To be decided' },
            { label: 'Type', value: hostel === 'Everest' ? 'Boys' : 'Girls' },
            { label: 'Total Rooms', value: '48' },
            { label: 'Students', value: hostel === 'Everest' ? '128' : '134' },
            { label: 'Mess', value: hostel === 'Everest' ? 'Regular' : 'Vegetarian & regular' },
          ],
          blockPairs: [
            { label: hostel ? draft.block : 'Block', value: hostel ? 'All floors' : 'Not assigned yet' },
            { label: 'Rooms Covered', value: 'To be confirmed' },
            { label: 'Escalation', value: 'Reports to the Hostel Director' },
          ],
          dutyPairs: [
            { label: 'Shift', value: draft.shift },
            { label: 'Weekly Off', value: 'Sunday' },
            { label: 'Roll Call', value: '21:30 nightly' },
            { label: 'Cover', value: 'To be assigned' },
          ],
          emergencyPairs: [
            { label: 'Contact', value: draft.emergencyName.trim() || DASH },
            { label: 'Relation', value: draft.relation },
            { label: 'Mobile', value: draft.emergencyMobile.trim() || DASH },
            { label: 'Alternate', value: DASH },
          ],
          qualification: 'Qualification details pending verification.',
          documents: [],
          notes: 'Newly added warden profile.',
        },
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updateWarden = useCallback(
    (draft: WardenDraft) =>
      patchRow(
        (row) => {
          const hostel = hostelFrom(draft.hostel);
          return {
            ...row,
            name: draft.name.trim() || row.name,
            employeeId: draft.employeeId.trim() || row.employeeId,
            gender: draft.gender as Warden['gender'],
            dob: toRowDate(draft.dob) || row.dob,
            joined: toRowDate(draft.joined) || row.joined,
            email: draft.email.trim() || row.email,
            contact: draft.contact.trim() || row.contact,
            designation: draft.designation as Designation,
            experience: toYears(draft.experience, row.experience),
            residence: draft.residence === 'Off campus' && !row.residence.startsWith('Off campus')
              ? 'Off campus'
              : row.residence,
            hostel,
            block: hostel ? draft.block : '',
            floors: hostel ? row.floors || 'All floors' : '',
            shift: shiftFrom(draft.shift),
            status: draft.status,
            emergencyPairs: [
              { label: 'Contact', value: draft.emergencyName.trim() || row.emergencyPairs[0]?.value || DASH },
              { label: 'Relation', value: draft.relation },
              { label: 'Mobile', value: draft.emergencyMobile.trim() || row.emergencyPairs[2]?.value || DASH },
              row.emergencyPairs[3] ?? { label: 'Alternate', value: DASH },
            ],
          };
        },
        `${modalRow?.name ?? 'Warden'} updated`,
      ),
    [modalRow, patchRow],
  );

  const assignHostel = useCallback(
    (hostelChoice: string, blockChoice: string, floors: string, reportsTo: string) => {
      if (!hostelChoice) {
        push('Pick the hostel to assign', 'warning');
        return;
      }
      const hostel = hostelChoice.split('·')[0].trim().replace(' Hostel', '');
      const block = blockChoice.split('·')[0].trim();
      patchRow(
        (row) => ({
          ...row,
          hostel,
          block,
          floors,
          // A pending appointment becomes active the moment it has a posting.
          status: row.status === 'Pending Assignment' ? 'Active' : row.status,
          hostelPairs: [
            { label: 'Hostel', value: `${hostel} Hostel` },
            { label: 'Type', value: hostel === 'Everest' ? 'Boys' : 'Girls' },
            { label: 'Total Rooms', value: '48' },
            { label: 'Students', value: hostel === 'Everest' ? '128' : '134' },
            { label: 'Mess', value: hostel === 'Everest' ? 'Regular' : 'Vegetarian & regular' },
          ],
          blockPairs: [
            { label: block, value: floors },
            { label: 'Rooms Covered', value: row.blockPairs[1]?.value ?? 'To be confirmed' },
            { label: 'Escalation', value: `Reports to ${reportsTo.split('·')[0].trim()}` },
          ],
        }),
        `${modalRow?.name ?? 'Warden'} assigned to ${hostel} · ${block}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const changeShift = useCallback(
    (start: string, end: string, weeklyOff: string, cover: string) => {
      const night = Number(start.split(':')[0]) >= 12;
      patchRow(
        (row) => ({
          ...row,
          shift: night ? 'Night Shift' : 'Day Shift',
          dutyPairs: [
            { label: night ? 'Mon – Sat' : 'Mon – Fri', value: `${start} – ${end}` },
            { label: 'Weekly Off', value: weeklyOff },
            { label: night ? 'Roll Call' : 'Saturday', value: night ? '21:30 nightly' : `${start} – 14:00` },
            {
              label: night ? 'Day Cover' : 'Night Cover',
              value: cover ? cover.split('·')[0].trim() : row.dutyPairs[3]?.value ?? 'To be assigned',
            },
          ],
        }),
        `${modalRow?.name ?? 'Warden'} moved to the ${night ? 'night' : 'day'} shift`,
      );
    },
    [modalRow, patchRow],
  );

  const uploadDocument = useCallback(
    (type: string, validUntil: string, verified: boolean) =>
      patchRow(
        (row) => ({
          ...row,
          documents: [
            ...row.documents.filter((document) => !document.name.startsWith(type)),
            {
              name: `${type}.pdf`,
              meta: verified
                ? `Verified · valid to ${toRowDate(validUntil)}`
                : `Uploaded · pending verification`,
            },
          ],
        }),
        `${type} uploaded for ${modalRow?.name ?? 'the warden'}`,
        true,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} wardens exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Warden) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View profile" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit warden" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Assign hostel" onClick={() => openModal(row, 'assign')}>
        <i className="ti ti-building-fortress" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Upload documents" onClick={() => openModal(row, 'documents')}>
        <i className="ti ti-file-upload" />
      </ActionLink>
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) =>
    pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={`${pair.label}-${index}`}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">{pair.value}</span>
      </div>
    ));

  const renderDetail = (row: Warden) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Warden Profile</h6>
        {pairList(profilePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-building-fortress text-info me-1" />Assigned Hostel Details
        </h6>
        {pairList(row.hostelPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-stairs text-warning me-1" />Block / Floor Responsibility
        </h6>
        {pairList(row.blockPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock-hour-4 text-success me-1" />Duty Schedule</h6>
        {pairList(row.dutyPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-urgent text-danger me-1" />Emergency Contact</h6>
        {pairList(row.emergencyPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-certificate text-purple me-1" />Qualification</h6>
        <p className="fs-13 text-muted mb-0">{row.qualification}</p>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-files text-secondary me-1" />Documents</h6>
        {row.documents.length === 0 ? (
          <p className="fs-13 text-muted mb-0">No documents on file yet.</p>
        ) : (
          row.documents.map((document) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={document.name}>
              <span className="avatar avatar-sm bg-light text-dark rounded flex-shrink-0">
                <i className="ti ti-file-text" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{document.name}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{document.meta}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Profile
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-user-shield me-1" />Warden Panel
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
            title="Hostel Wardens"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Duty Roster" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Warden
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
            workspaceId="wdWorkspace"
            searchPlaceholder="Search warden, employee ID or hostel…"
            searchLabel="Search wardens"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="wardens"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Wardens refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-user-off"
            emptyTitle="No wardens match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Warden Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Warden Details"
            labelledById="wd_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Personal Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.name} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.id} · {panelRow.gender} · {panelRow.contact}
                    </span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Employment Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(employmentPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Assigned Hostel</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Hostel', value: panelRow.hostel ? `${panelRow.hostel} Hostel` : 'Not assigned' },
                    { label: 'Block', value: panelRow.block || DASH },
                    { label: 'Floors', value: panelRow.floors || DASH },
                    {
                      label: 'Rooms Covered',
                      value: panelRow.blockPairs.find((pair) => pair.label === 'Rooms Covered')?.value ?? DASH,
                    },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Duty Schedule</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                  <span className={`avatar avatar-sm bg-${shiftTint[panelRow.shift]}-transparent text-${shiftTint[panelRow.shift]} rounded flex-shrink-0`}>
                    <i className={`ti ${panelRow.shift === 'Night Shift' ? 'ti-moon' : 'ti-sun'}`} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{panelRow.shift}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.dutyPairs[0]?.label} · {panelRow.dutyPairs[0]?.value}
                    </span>
                  </div>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.dutyPairs.slice(1))}</div>

                <h6 className="fs-14 mb-2">Personal &amp; Contact</h6>
                <div className="border rounded p-3 mb-3">{pairList(contactPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Emergency Contact</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.emergencyPairs)}</div>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                {auditOf(panelRow).map((entry) => (
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

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'shift'); }}
                  >
                    <i className="ti ti-clock-hour-4 me-1" />Change Shift
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'assign'); }}
                  >
                    <i className="ti ti-building-fortress me-1" />Assign
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <WardenModals
        active={activeModal}
        row={modalRow}
        coverChoices={rows
          .filter((row) => row.id !== modalRow?.id && row.status === 'Active')
          .map((row) => `${row.name} · ${row.shift}`)}
        onClose={() => setActiveModal(null)}
        onCreate={createWarden}
        onUpdate={updateWarden}
        onAssign={assignHostel}
        onChangeShift={changeShift}
        onUploadDocument={uploadDocument}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="wdToasts" />
    </>
  );
};

export default HostelWardens;
