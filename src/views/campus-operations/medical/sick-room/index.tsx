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
import SickRoomModals from './modals/SickRoomModals';
import type {
  DischargePayload, MedicationPayload, NotifyPayload, SickRoomModalId, VisitDraft,
} from './modals/SickRoomModals';
import type {
  Condition, PersonType, Severity, SickRoomVisit,
} from './data/visits.data';
import {
  QUICK_TOTALS, REGISTER_DATE, REGISTER_FROM, REGISTER_TIME, REGISTER_TO, SUMMARY_TOTALS,
  VIEW_TOTALS, auditOf, conditionOptions, dateKey, dischargeBadge, dischargeOf,
  dischargeOptions, dischargePairsOf, dischargeSubLabelOf, durationText, guardianPairsOf,
  isAdmitted, minutesOf, notificationBadge, notificationChipOf, notificationStateOf,
  nurseOptions, patientPairsOf, personBadge, personTypeOptions, referralPairsOf,
  searchIndexOf, severityBadge, severityOptions, severityRank, sickRoomVisits as initialRows,
  stayLabelOf, stayOf, stayTintOf, timelineOf, treatmentBadge, treatmentOf, treatmentOptions,
  treatmentPill, treatmentSubLabelOf, vitalsPairsOf,
} from './data/visits.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'person-type', label: 'Person Type', kind: 'select', chipLabel: 'Person', options: personTypeOptions },
  { id: 'medical-condition', label: 'Medical Condition', kind: 'select', chipLabel: 'Condition', options: conditionOptions },
  { id: 'treatment-status', label: 'Treatment Status', kind: 'select', chipLabel: 'Treatment', options: treatmentOptions },
  { id: 'discharge-status', label: 'Discharge Status', kind: 'select', chipLabel: 'Discharge', options: dischargeOptions },
  { id: 'severity', label: 'Severity', kind: 'select', chipLabel: 'Severity', allLabel: 'Any', options: severityOptions },
  { id: 'attending-nurse', label: 'Attending Nurse', kind: 'select', chipLabel: 'Nurse', options: nurseOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Date',
    dateFormat: 'd-m-Y', initialValue: REGISTER_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REGISTER_TO,
  },
];

const sortOptions: SortOption[] = [
  { id: 'visit', label: 'Visit ID', icon: 'ti ti-hash' },
  { id: 'patient', label: 'Patient name (A–Z)', icon: 'ti ti-abc' },
  { id: 'checkin', label: 'Check-in time', icon: 'ti ti-clock' },
  { id: 'severity', label: 'Severity', icon: 'ti ti-alert-triangle' },
  { id: 'treatment', label: 'Treatment status', icon: 'ti ti-stethoscope' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

const SickRoomLogPage = () => {
  const [rows, setRows] = useState<SickRoomVisit[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<SickRoomModalId | null>(null);
  const [modalRow, setModalRow] = useState<SickRoomVisit | null>(null);
  const [panelRow, setPanelRow] = useState<SickRoomVisit | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: SickRoomVisit | null, modal: SickRoomModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: SickRoomVisit) => SickRoomVisit, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<SickRoomVisit>[]>(
    () => [
      {
        id: 'visit',
        label: 'Visit ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'patient',
        label: 'Patient Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${row.personType === 'Staff' ? 'success' : 'info'}-transparent text-${row.personType === 'Staff' ? 'success' : 'info'} rounded flex-shrink-0 me-2`}
            >
              <i className={row.personType === 'Staff' ? 'ti ti-id-badge-2' : 'ti ti-school'} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.patient}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.reference}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'person',
        label: 'Person Type',
        sortable: true,
        render: (row) => <span className={personBadge[row.personType]}>{row.personType}</span>,
      },
      {
        id: 'group',
        label: 'Class / Department',
        sortable: true,
        render: (row) => <span className="badge badge-soft-secondary">{row.group}</span>,
      },
      {
        id: 'checkin',
        label: 'Check-In Time',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.checkIn}</span>
            <span className="fs-12 text-muted text-nowrap">{row.date}</span>
            {/* Still in the sick room, or how long the visit ran. */}
            <span className={`d-block fs-12 text-nowrap ${stayTintOf(row)}`}>{stayLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'complaint',
        label: 'Complaint',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.complaint}</span>
            <span className="fs-12 text-muted d-block">{row.complaintDetail}</span>
            <span className={`${severityBadge[row.severity]} mt-1`}>{row.severity}</span>
          </>
        ),
      },
      {
        id: 'nurse',
        label: 'Attending Nurse',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.nurse}</span>
            <span className="fs-12 text-muted text-nowrap">{row.nurseRole}</span>
          </>
        ),
      },
      {
        id: 'treatment',
        label: 'Treatment Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${treatmentPill[treatmentOf(row)]}`}>
              <span className="dt-pill-dot" />{treatmentOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{treatmentSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'discharge',
        label: 'Discharge Status',
        render: (row) => (
          <>
            <span className={dischargeBadge[dischargeOf(row)]}>{dischargeOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{dischargeSubLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<SickRoomVisit>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['person-type'] && row.personType !== filters['person-type']) return false;
      if (filters['medical-condition'] && row.condition !== filters['medical-condition']) return false;
      if (filters['treatment-status'] && treatmentOf(row) !== filters['treatment-status']) return false;
      if (filters['discharge-status'] && dischargeOf(row) !== filters['discharge-status']) return false;
      if (filters.severity && row.severity !== filters.severity) return false;
      if (filters['attending-nurse'] && row.nurse !== filters['attending-nurse']) return false;
      if (filters['from-date'] && dateKey(row.date) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(row.date) > inputDateKey(filters['to-date'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Admitted') return isAdmitted(row);
      if (quick === 'Discharged') return !isAdmitted(row);
      if (quick === 'Emergency') return row.severity === 'Emergency';
      if (quick === 'Students') return row.personType === 'Student';
      return row.personType === 'Staff';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'admitted': return isAdmitted(row);
        case 'emergency': return row.severity === 'Emergency';
        case 'contact': return notificationStateOf(row) === 'Pending';
        case 'referrals': return row.referral !== null;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'patient':
          return a.patient.localeCompare(b.patient);
        case 'checkin':
          return minutesOf(a.checkIn) - minutesOf(b.checkIn) || a.id.localeCompare(b.id);
        case 'severity':
          return severityRank[a.severity] - severityRank[b.severity] || a.id.localeCompare(b.id);
        case 'treatment':
          return treatmentOf(a).localeCompare(treatmentOf(b)) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'person':
          return a.personType.localeCompare(b.personType);
        case 'group':
          return a.group.localeCompare(b.group);
        case 'complaint':
          return a.complaint.localeCompare(b.complaint);
        case 'visit':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'visit',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: SickRoomVisit) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: SickRoomVisit) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Visits Today', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'admitted', label: 'Currently Admitted', icon: 'ti ti-bed', count: shift(VIEW_TOTALS.admitted, isAdmitted) },
      {
        id: 'emergency', label: 'Emergency Cases', icon: 'ti ti-ambulance',
        count: shift(VIEW_TOTALS.emergency, (row) => row.severity === 'Emergency'),
      },
      {
        id: 'contact', label: 'Guardian Contact Pending', icon: 'ti ti-bell',
        count: shift(VIEW_TOTALS.contactPending, (row) => notificationStateOf(row) === 'Pending'),
      },
      {
        id: 'referrals', label: 'Doctor Referrals', icon: 'ti ti-medical-cross',
        count: shift(VIEW_TOTALS.referrals, (row) => row.referral !== null),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'Admitted', label: 'Admitted', icon: 'ti ti-bed', count: shift(QUICK_TOTALS.admitted, isAdmitted) },
      {
        id: 'Discharged', label: 'Discharged', icon: 'ti ti-door-exit',
        count: shift(QUICK_TOTALS.discharged, (row) => !isAdmitted(row)),
      },
      {
        id: 'Emergency', label: 'Emergency', icon: 'ti ti-ambulance',
        count: shift(QUICK_TOTALS.emergency, (row) => row.severity === 'Emergency'),
      },
      {
        id: 'Students', label: 'Students', icon: 'ti ti-school',
        count: shift(QUICK_TOTALS.students, (row) => row.personType === 'Student'),
      },
      {
        id: 'Staff', label: 'Staff', icon: 'ti ti-id-badge-2',
        count: shift(QUICK_TOTALS.staff, (row) => row.personType === 'Staff'),
      },
    ],
    [shift],
  );

  /**
   * The strip counts the whole day — 34 visits against the eight this page lists
   * — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const today = shift(SUMMARY_TOTALS.today, () => true);
    return [
      {
        id: 'today', tint: 'primary', icon: 'ti ti-stethoscope', label: 'Today’s Visits',
        value: String(today), hint: `${REGISTER_DATE} · sick room`,
      },
      {
        id: 'admitted', tint: 'warning', icon: 'ti ti-bed', label: 'Currently Admitted',
        value: String(shift(SUMMARY_TOTALS.admitted, isAdmitted)), hint: 'resting or under treatment',
      },
      {
        id: 'discharged', tint: 'success', icon: 'ti ti-door-exit', label: 'Discharged Today',
        value: String(shift(SUMMARY_TOTALS.discharged, (row) => !isAdmitted(row))),
        hint: `of ${today} visits logged`,
      },
      {
        id: 'emergency', tint: 'danger', icon: 'ti ti-ambulance', label: 'Emergency Cases',
        value: String(shift(SUMMARY_TOTALS.emergency, (row) => row.severity === 'Emergency')),
        hint: 'referred or escalated',
      },
      {
        id: 'notifications', tint: 'info', icon: 'ti ti-bell', label: 'Parent Notifications',
        value: String(shift(
          SUMMARY_TOTALS.notifications,
          (row) => notificationStateOf(row) === 'Acknowledged',
        )),
        hint: 'guardians informed today',
      },
    ];
  }, [shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const admitPatient = useCallback(
    (draft: VisitDraft) => {
      if (!draft.patient.trim()) {
        push('Give the visit a patient', 'warning');
        return;
      }
      const id = draft.visitId.trim() || `VIS-2026-04${33 + rows.length}`;
      const nurse = draft.nurse.split('·')[0].trim();
      const isStaff = draft.personType === 'Staff';
      setRows((current) => [
        {
          id, patient: draft.patient.trim(),
          reference: `${draft.group} · sick room`,
          personType: draft.personType as PersonType,
          group: draft.group.replace('Class ', ''),
          checkIn: draft.checkIn, date: REGISTER_DATE,
          complaint: draft.complaint.trim() || 'Not stated',
          complaintDetail: 'Recorded at admission',
          condition: (draft.condition === 'Other' ? 'Fever' : draft.condition) as Condition,
          severity: draft.severity as Severity,
          nurse, nurseRole: draft.nurse.split('·')[1]?.trim() ?? 'Sick room',
          observations: draft.observation.trim()
            ? [{ note: draft.observation.trim(), at: draft.checkIn, by: nurse }] : [],
          vitals: {
            temperature: draft.temperature.trim() ? `${draft.temperature.trim()} °C` : 'Not recorded',
            pulse: draft.pulse.trim() ? `${draft.pulse.trim()} bpm` : 'Not recorded',
            bloodPressure: draft.bloodPressure.trim() ? `${draft.bloodPressure.trim()} mmHg` : 'Not recorded',
            oxygen: draft.oxygen.trim() ? `${draft.oxygen.trim()}%` : 'Not recorded',
            respiration: draft.respiration.trim() ? `${draft.respiration.trim()} per minute` : 'Not recorded',
            // The template flags a temperature at or above 38 as a fever.
            flag: Number(draft.temperature) >= 38 ? 'Fever' : '',
          },
          medications: [],
          guardian: isStaff || !draft.guardian.trim() ? null : {
            name: draft.guardian.trim(), relationship: 'Guardian',
            contact: draft.contact.trim() || 'Not recorded',
            informedAt: draft.notifyGuardian ? draft.checkIn : '',
            method: 'Phone call',
          },
          referral: null,
          dischargedAt: '', dischargedBy: '', outcome: '', dischargeNotes: '', ambulanceAt: '',
          notes: draft.notes.trim() || 'Admitted from the sick room register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} admitted at ${draft.checkIn}`);
    },
    [push, rows.length],
  );

  const updateVisit = useCallback(
    (draft: VisitDraft) => {
      const nurse = draft.nurse.split('·')[0].trim();
      patchRow(
        (row) => ({
          ...row,
          patient: draft.patient.trim() || row.patient,
          personType: draft.personType as PersonType,
          group: draft.group.replace('Class ', ''),
          checkIn: draft.checkIn,
          complaint: draft.complaint.trim() || row.complaint,
          condition: (draft.condition === 'Other' ? row.condition : draft.condition) as Condition,
          severity: draft.severity as Severity,
          nurse, nurseRole: draft.nurse.split('·')[1]?.trim() ?? row.nurseRole,
          // A new observation joins the timeline rather than replacing it.
          observations: draft.notifyGuardian && draft.observation.trim()
            ? [...row.observations, { note: draft.observation.trim(), at: REGISTER_TIME, by: nurse }]
            : row.observations,
          vitals: {
            ...row.vitals,
            temperature: draft.temperature.trim() ? `${draft.temperature.trim()} °C` : row.vitals.temperature,
            pulse: draft.pulse.trim() ? `${draft.pulse.trim()} bpm` : row.vitals.pulse,
            bloodPressure: draft.bloodPressure.trim() ? `${draft.bloodPressure.trim()} mmHg` : row.vitals.bloodPressure,
            oxygen: draft.oxygen.trim() ? `${draft.oxygen.trim()}%` : row.vitals.oxygen,
            respiration: draft.respiration.trim() ? `${draft.respiration.trim()} per minute` : row.vitals.respiration,
            flag: Number(draft.temperature) >= 38 ? 'Fever' : row.vitals.flag,
          },
          guardian: row.guardian
            ? {
              ...row.guardian,
              name: draft.guardian.trim() || row.guardian.name,
              contact: draft.contact.trim() || row.guardian.contact,
            }
            : null,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Visit'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** Recording a dose is what takes a visit from observation to treatment. */
  const recordMedication = useCallback(
    (payload: MedicationPayload) =>
      patchRow(
        (row) => ({
          ...row,
          medications: [
            ...row.medications,
            {
              name: payload.kind === 'Rest Only' ? 'Rest and observation' : payload.medication,
              dose: payload.kind === 'Rest Only' ? 'No medication given' : payload.dose.trim() || 'As directed',
              at: payload.givenAt,
              by: payload.by.split('·')[0].trim(),
            },
          ],
          observations: payload.notes.trim()
            ? [...row.observations, { note: payload.notes.trim(), at: payload.givenAt, by: payload.by.split('·')[0].trim() }]
            : row.observations,
        }),
        `${payload.kind === 'Rest Only' ? 'Rest' : payload.medication} recorded at ${payload.givenAt}`,
      ),
    [patchRow],
  );

  /** Reaching the guardian is what moves the row to Awaiting Guardian. */
  const notifyGuardian = useCallback(
    (payload: NotifyPayload) => {
      if (!modalRow?.guardian) {
        push('No guardian on this record — it is a staff visit', 'warning');
        return;
      }
      const acknowledged = payload.outcome.startsWith('Acknowledged');
      patchRow(
        (row) => ({
          ...row,
          guardian: row.guardian
            ? {
              ...row.guardian,
              informedAt: acknowledged ? payload.contactedAt : '',
              method: payload.method,
            }
            : null,
          notes: payload.message.trim() || row.notes,
        }),
        acknowledged
          ? `${modalRow.guardian.name} informed at ${payload.contactedAt} by ${payload.method.toLowerCase()}`
          : `${modalRow.guardian.name} not reached — ${payload.outcome.toLowerCase()}`,
      );
    },
    [modalRow, patchRow, push],
  );

  /** Discharging closes the visit, which settles the stay and the treatment. */
  const dischargePatient = useCallback(
    (payload: DischargePayload) => {
      if (!modalRow) return;
      const stay = Math.max(0, minutesOf(payload.time) - minutesOf(modalRow.checkIn));
      const outcome: SickRoomVisit['outcome'] = payload.kind === 'Sent Home' ? 'Sent Home'
        : payload.kind === 'Referred Out' ? 'Referred Out'
          : modalRow.personType === 'Staff' ? 'Returned to Duty' : 'Returned to Class';
      patchRow(
        (row) => ({
          ...row,
          dischargedAt: payload.time,
          dischargedBy: payload.by.split('·')[0].trim(),
          outcome,
          dischargeNotes: payload.notes.trim() || row.dischargeNotes,
          vitals: payload.finalTemperature.trim()
            ? { ...row.vitals, temperature: `${payload.finalTemperature.trim()} °C` }
            : row.vitals,
        }),
        `${modalRow.patient} discharged at ${payload.time} — ${outcome.toLowerCase()} after ${durationText(stay)}`,
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
      push(`${workspace.visible.length} sick room visits exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: SickRoomVisit) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="Medical history" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Update record" onClick={() => openModal(row, 'update')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Record medication" onClick={() => openModal(row, 'medication')}>
        <i className="ti ti-pill" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Notify guardian" onClick={() => openModal(row, 'notify')}>
        <i className="ti ti-bell" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Discharge patient" onClick={() => openModal(row, 'discharge')}>
        <i className="ti ti-door-exit" />
      </ActionLink>
    </div>
  );

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

  /** The expander's last card offers whatever this visit's state calls for. */
  const primaryAction = (row: SickRoomVisit) => {
    if (!isAdmitted(row)) return null;
    if (notificationStateOf(row) === 'Pending') {
      return { modal: 'notify' as SickRoomModalId, icon: 'ti ti-bell', label: 'Notify Guardian' };
    }
    if (row.medications.length === 0) {
      return { modal: 'medication' as SickRoomModalId, icon: 'ti ti-pill', label: 'Record Medication' };
    }
    return { modal: 'discharge' as SickRoomModalId, icon: 'ti ti-door-exit', label: 'Discharge Patient' };
  };

  const renderDetail = (row: SickRoomVisit) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Patient Information</h6>
          {pairList(patientPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-notes text-info me-1" />Symptoms &amp; Observations</h6>
          {row.observations.map((observation) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={observation.at}>
              <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                <i className="ti ti-eye" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">{observation.note}</h6>
                <span className="fs-12 text-muted d-block">{observation.at} · {observation.by}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-heartbeat text-danger me-1" />Vital Signs</h6>
          {pairList(vitalsPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-pill text-purple me-1" />Medication &amp; Treatment</h6>
          {row.medications.length === 0 ? (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-pill-off" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">No medication given</h6>
                <span className="fs-12 text-muted text-truncate d-block">Observation only</span>
              </div>
            </div>
          ) : (
            row.medications.map((medication) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${medication.name}-${medication.at}`}>
                <span className="avatar avatar-sm bg-purple-transparent text-purple rounded flex-shrink-0">
                  <i className="ti ti-pill" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{medication.name} · {medication.dose}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {medication.at} · {medication.by}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-bell text-warning me-1" />Guardian Notification</h6>
          {row.guardian ? pairList(guardianPairsOf(row)) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-bell-off" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Not required</h6>
                <span className="fs-12 text-muted text-truncate d-block">Staff visit</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-medical-cross text-success me-1" />Doctor Referral</h6>
          {row.referral ? pairList(referralPairsOf(row)) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-medical-cross" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">No referral raised</h6>
                <span className="fs-12 text-muted text-truncate d-block">Managed in the sick room</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-door-exit text-secondary me-1" />Discharge Notes</h6>
          {row.dischargedAt ? (
            <>
              {pairList(dischargePairsOf(row))}
              <p className="fs-13 text-muted mb-0 mt-2">{row.dischargeNotes}</p>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                <i className="ti ti-bed" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Still in the sick room</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  Admitted {durationText(stayOf(row))} ago
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Medical Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={severityBadge[row.severity]}>{row.severity}</span>
            <span className={notificationBadge[notificationStateOf(row)]}>{notificationChipOf(row)}</span>
          </div>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {primary ? (
              <button
                type="button" className="btn btn-primary btn-sm"
                onClick={() => openModal(row, primary.modal)}
              >
                <i className={`${primary.icon} me-1`} />{primary.label}
              </button>
            ) : null}
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />Medical History
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-stethoscope me-1" />Medical Panel
            </button>
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
            title="Sick Room Log"
            section="Health"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find((row) => isAdmitted(row) && row.guardian) ?? rows[0] ?? null, 'notify',
                    )}
                  >
                    <i className="ti ti-bell me-2" />Notify Guardian
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Sick Room Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'admit')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Admit Patient
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={VIEW_TOTALS.all - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`register as at ${REGISTER_TIME}`}
            workspaceId="srWorkspace"
            searchPlaceholder="Search visit ID, student or staff name…"
            searchLabel="Search sick room visits"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="visits"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Sick room register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-stethoscope-off"
            emptyTitle="No sick room visits match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Medical Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Medical Details"
            labelledById="sr_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Patient Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${panelRow.personType === 'Staff' ? 'success' : 'info'}-transparent text-${panelRow.personType === 'Staff' ? 'success' : 'info'} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.personType === 'Staff' ? 'ti ti-id-badge-2' : 'ti ti-school'} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.patient}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.group}</span>
                  </div>
                  <span className={`${severityBadge[panelRow.severity]} ms-auto`}>{panelRow.severity}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(patientPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Visit Summary</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Complaint', value: panelRow.complaint },
                    { label: 'Detail', value: panelRow.complaintDetail },
                    { label: 'Check-In', value: `${panelRow.checkIn} · ${panelRow.date}` },
                    { label: 'Length of Stay', value: durationText(stayOf(panelRow)) },
                    { label: 'Attending Nurse', value: `${panelRow.nurse} · ${panelRow.nurseRole}` },
                  ])}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">Treatment</span>
                    <span className={treatmentBadge[treatmentOf(panelRow)]}>{treatmentOf(panelRow)}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Vital Signs</h6>
                <div className="border rounded p-3 mb-3">{pairList(vitalsPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Treatment Given</h6>
                {panelRow.medications.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No medication administered on this visit.</p>
                ) : (
                  panelRow.medications.map((medication) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${medication.name}-${medication.at}`}>
                      <span className="avatar avatar-sm bg-purple-transparent text-purple rounded flex-shrink-0">
                        <i className="ti ti-pill" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{medication.name}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">
                          {medication.dose} · {medication.at} · {medication.by}
                        </span>
                      </div>
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Guardian Notification</h6>
                {panelRow.guardian ? (
                  <div className="border rounded p-3 mb-3">{pairList(guardianPairsOf(panelRow))}</div>
                ) : (
                  <p className="fs-13 text-muted mb-3">Not required — this is a staff visit.</p>
                )}

                <h6 className="fs-14 mb-2">Doctor Referral</h6>
                {panelRow.referral ? (
                  <div className="border rounded p-3 mb-3">{pairList(referralPairsOf(panelRow))}</div>
                ) : (
                  <p className="fs-13 text-muted mb-3">No referral raised — managed in the sick room.</p>
                )}

                <h6 className="fs-14 mb-2">Visit Timeline</h6>
                {timelineOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{entry.title}</h6>
                      <span className="fs-12 text-muted d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Audit History</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <p className="fs-12 text-muted mb-0 mt-2">
                  {stayLabelOf(panelRow)} · {dischargeSubLabelOf(panelRow)}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'medication'); }}
                  >
                    <i className="ti ti-pill me-1" />Record Medication
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'update'); }}
                  >
                    <i className="ti ti-edit me-1" />Update
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <SickRoomModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onAdmit={admitPatient}
        onUpdate={updateVisit}
        onRecordMedication={recordMedication}
        onNotify={notifyGuardian}
        onDischarge={dischargePatient}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="srToasts" />
    </>
  );
};

export default SickRoomLogPage;
