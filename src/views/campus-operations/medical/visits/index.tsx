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
import ConsultationModals, { toRowDate } from './modals/ConsultationModals';
import type {
  ConsultationDraft, ConsultationModalId, DiagnosisPayload, FollowUpPayload,
  PrescriptionPayload, ReferralPayload,
} from './modals/ConsultationModals';
import type {
  Consultation, MedicalCondition, PersonType, VisitType,
} from './data/consultations.data';
import {
  PERIOD_FROM, PERIOD_TO, QUICK_TOTALS, REGISTER_DATE, REGISTER_TIME, SUMMARY_TOTALS, VIEW_TOTALS,
  assessmentPairsOf, auditOf, conditionOptions, consultations as initialRows, courseLabelOf,
  dateKey, followUpBadge, followUpChip, followUpLabelOf, followUpOptions, followUpPairsOf,
  followUpStateOf, investigationSummaryOf, minutesOf, patientPairsOf, personBadge,
  personTypeOptions, referralPairsOf, searchIndexOf, staffOptions, statusBadge, statusOf,
  statusOptions, statusPill, statusSubLabelOf, timelineOf, visitAgeLabelOf, visitAgeTintOf,
  visitLabelOf, visitPairsOf, visitTypeBadge, visitTypeIcon, visitTypeOptions, vitalsPairsOf,
} from './data/consultations.data';

const routes = all_routes;

/** Ids and options are the template's own; the visit window opens committed. */
const filterFields: FilterField[] = [
  { id: 'person-type', label: 'Person Type', kind: 'select', chipLabel: 'Person', options: personTypeOptions },
  { id: 'visit-type', label: 'Visit Type', kind: 'select', chipLabel: 'Visit', options: visitTypeOptions },
  { id: 'medical-condition', label: 'Medical Condition', kind: 'select', chipLabel: 'Condition', options: conditionOptions },
  { id: 'visit-status', label: 'Treatment Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'follow-up', label: 'Follow-Up', kind: 'select', chipLabel: 'Follow-up', allLabel: 'Any', options: followUpOptions },
  { id: 'medical-staff', label: 'Medical Staff', kind: 'select', chipLabel: 'Staff', options: staffOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'From',
    dateFormat: 'd-m-Y', initialValue: PERIOD_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: PERIOD_TO,
  },
];

const sortOptions: SortOption[] = [
  { id: 'visit', label: 'Visit ID', icon: 'ti ti-hash' },
  { id: 'patient', label: 'Patient name (A–Z)', icon: 'ti ti-abc' },
  { id: 'date', label: 'Visit date and time', icon: 'ti ti-calendar' },
  { id: 'followup', label: 'Follow-up date', icon: 'ti ti-calendar-time' },
  { id: 'status', label: 'Treatment status', icon: 'ti ti-stethoscope' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A visit is open until its treatment closes; referrals stay open. */
const isOpen = (row: Consultation) => statusOf(row) !== 'Completed';

/** A review that has neither happened nor been ruled out. */
const isFollowUpDue = (row: Consultation) => {
  const state = followUpStateOf(row);
  return state !== 'Completed' && state !== 'Not required';
};

const isReferred = (row: Consultation) => row.referral !== null;

const isAwaitingResults = (row: Consultation) => statusOf(row) === 'Awaiting Results';

const isToday = (row: Consultation) => row.visitDate === REGISTER_DATE;

const isEmergency = (row: Consultation) => row.visitType === 'Emergency';

/** Reviews with no date sort last, whichever way the column runs. */
const followUpKey = (row: Consultation) =>
  row.followUp?.reviewDate ? dateKey(row.followUp.reviewDate) : Number.MAX_SAFE_INTEGER;

const MedicalVisitsPage = () => {
  const [rows, setRows] = useState<Consultation[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ConsultationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Consultation | null>(null);
  const [panelRow, setPanelRow] = useState<Consultation | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Consultation | null, modal: ConsultationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Consultation) => Consultation, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Consultation>[]>(
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
        id: 'date',
        label: 'Visit Date & Time',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.visitDate}</span>
            <span className="fs-12 text-muted text-nowrap">{visitLabelOf(row)}</span>
            {/* How the visit sits against today's register. */}
            <span className={`d-block fs-12 text-nowrap ${visitAgeTintOf(row)}`}>{visitAgeLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'reason',
        label: 'Visit Reason',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.reason}</span>
            <span className="fs-12 text-muted d-block">{row.diagnosis || 'Diagnosis not recorded'}</span>
            <span className={`${visitTypeBadge[row.visitType]} mt-1`}>
              <i className={`${visitTypeIcon[row.visitType]} me-1`} />{row.visitType}
            </span>
          </>
        ),
      },
      {
        id: 'staff',
        label: 'Medical Staff',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.staff}</span>
            <span className="fs-12 text-muted text-nowrap">{row.staffRole}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Treatment Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
              <span className="dt-pill-dot" />{statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{statusSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'followup',
        label: 'Follow-Up',
        render: (row) => (
          <>
            <span className={followUpBadge[followUpStateOf(row)]}>{followUpStateOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{followUpLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Consultation>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['person-type'] && row.personType !== filters['person-type']) return false;
      if (filters['visit-type'] && row.visitType !== filters['visit-type']) return false;
      if (filters['medical-condition'] && row.condition !== filters['medical-condition']) return false;
      if (filters['visit-status'] && statusOf(row) !== filters['visit-status']) return false;
      if (filters['follow-up'] && followUpStateOf(row) !== filters['follow-up']) return false;
      if (filters['medical-staff'] && row.staff !== filters['medical-staff']) return false;
      if (filters['from-date'] && dateKey(row.visitDate) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(row.visitDate) > inputDateKey(filters['to-date'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'today') return isToday(row);
      if (quick === 'followup') return isFollowUpDue(row);
      if (quick === 'emergency') return isEmergency(row);
      if (quick === 'referred') return isReferred(row);
      return statusOf(row) === 'Completed';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'open': return isOpen(row);
        case 'followups': return isFollowUpDue(row);
        case 'referred': return isReferred(row);
        case 'results': return isAwaitingResults(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'patient':
          return a.patient.localeCompare(b.patient);
        case 'date':
          return dateKey(a.visitDate) - dateKey(b.visitDate)
            || minutesOf(a.visitTime) - minutesOf(b.visitTime)
            || a.id.localeCompare(b.id);
        case 'followup':
          return followUpKey(a) - followUpKey(b) || a.id.localeCompare(b.id);
        case 'status':
          return statusOf(a).localeCompare(statusOf(b)) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'person':
          return a.personType.localeCompare(b.personType);
        case 'group':
          return a.group.localeCompare(b.group);
        case 'reason':
          return a.reason.localeCompare(b.reason);
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
    (test: (row: Consultation) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the register holds now. */
  const shift = useCallback(
    (base: number, test: (row: Consultation) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Visits', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'open', label: 'Open Consultations', icon: 'ti ti-stethoscope', count: shift(VIEW_TOTALS.open, isOpen) },
      {
        id: 'followups', label: 'Follow-Ups Due', icon: 'ti ti-calendar-time',
        count: shift(VIEW_TOTALS.followUpsDue, isFollowUpDue),
      },
      {
        id: 'referred', label: 'Referred Cases', icon: 'ti ti-medical-cross',
        count: shift(VIEW_TOTALS.referred, isReferred),
      },
      {
        id: 'results', label: 'Results Awaited', icon: 'ti ti-flask',
        count: shift(VIEW_TOTALS.awaitingResults, isAwaitingResults),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'today', label: 'Today', icon: 'ti ti-calendar', count: shift(QUICK_TOTALS.today, isToday) },
      {
        id: 'followup', label: 'Follow-Up', icon: 'ti ti-calendar-time',
        count: shift(QUICK_TOTALS.followUp, isFollowUpDue),
      },
      {
        id: 'emergency', label: 'Emergency', icon: 'ti ti-ambulance',
        count: shift(QUICK_TOTALS.emergency, isEmergency),
      },
      {
        id: 'referred', label: 'Referred', icon: 'ti ti-medical-cross',
        count: shift(QUICK_TOTALS.referred, isReferred),
      },
      {
        id: 'completed', label: 'Completed', icon: 'ti ti-circle-check',
        count: shift(QUICK_TOTALS.completed, (row) => statusOf(row) === 'Completed'),
      },
    ],
    [shift],
  );

  /**
   * The strip counts the whole term — 143 visits against the eight this page
   * lists — so the template's figures stand and the register moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const total = shift(SUMMARY_TOTALS.total, () => true);
    return [
      {
        id: 'today', tint: 'primary', icon: 'ti ti-stethoscope', label: 'Today’s Visits',
        value: String(shift(SUMMARY_TOTALS.today, isToday)), hint: `${REGISTER_DATE} · health room`,
      },
      {
        id: 'active', tint: 'warning', icon: 'ti ti-clipboard-heart', label: 'Active Cases',
        value: String(shift(SUMMARY_TOTALS.activeVisits, isOpen)), hint: `of ${total} visits this term`,
      },
      {
        id: 'followups', tint: 'info', icon: 'ti ti-calendar-time', label: 'Follow-Ups Due',
        value: String(shift(SUMMARY_TOTALS.followUps, isFollowUpDue)), hint: 'reviews still to happen',
      },
      {
        id: 'emergency', tint: 'danger', icon: 'ti ti-ambulance', label: 'Emergency Visits',
        value: String(shift(SUMMARY_TOTALS.emergency, isEmergency)), hint: 'seen without appointment',
      },
      {
        id: 'referred', tint: 'purple', icon: 'ti ti-medical-cross', label: 'Referred Out',
        value: String(shift(SUMMARY_TOTALS.referred, isReferred)), hint: 'sent to a hospital or clinic',
      },
    ];
  }, [shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const createVisit = useCallback(
    (draft: ConsultationDraft) => {
      if (!draft.patient.trim()) {
        push('Give the visit a patient', 'warning');
        return;
      }
      const id = draft.visitId.trim() || `MV-2026-05${25 + rows.length}`;
      const staff = draft.staff.split('·')[0].trim();
      const investigation = draft.investigation !== 'None'
        ? [{ name: draft.investigation, lab: draft.lab, result: '' }]
        : [];
      setRows((current) => [
        {
          id,
          patient: draft.patient.trim(),
          reference: `${draft.group} · health room`,
          personType: draft.personType as PersonType,
          group: draft.group.replace('Class ', ''),
          guardian: 'Not recorded',
          contact: 'Not recorded',
          visitDate: toRowDate(draft.visitDate),
          visitTime: draft.visitTime,
          consultationMinutes: Number(draft.length.split(' ')[0]) || 20,
          reason: draft.reason.trim() || 'Not stated',
          diagnosis: '',
          // The quick chips carry four of the six visit types.
          visitType: draft.quickType as VisitType,
          condition: draft.condition as MedicalCondition,
          staff,
          staffRole: draft.staff.split('·')[1]?.trim() ?? 'Health room',
          symptoms: draft.symptoms.split('\n').map((line) => line.trim()).filter(Boolean),
          vitals: {
            temperature: draft.temperature.trim() ? `${draft.temperature.trim()} °C` : 'Not recorded',
            pulse: draft.pulse.trim() ? `${draft.pulse.trim()} bpm` : 'Not recorded',
            bloodPressure: draft.bloodPressure.trim() ? `${draft.bloodPressure.trim()} mmHg` : 'Not recorded',
            oxygen: draft.oxygen.trim() ? `${draft.oxygen.trim()}%` : 'Not recorded',
            respiration: draft.respiration.trim() ? `${draft.respiration.trim()} per minute` : 'Not recorded',
            weight: draft.weight.trim() || 'Not recorded',
          },
          investigations: investigation,
          prescriptions: [],
          courseFrom: '',
          referral: null,
          followUp: null,
          notes: draft.notes.trim() || 'Recorded from the consultation register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(
        draft.openPlanner
          ? `${id} recorded — book the review from the row`
          : `${id} recorded at ${draft.visitTime}`,
      );
    },
    [push, rows.length],
  );

  const updateVisit = useCallback(
    (draft: ConsultationDraft) => {
      const staff = draft.staff.split('·')[0].trim();
      patchRow(
        (row) => ({
          ...row,
          patient: draft.patient.trim() || row.patient,
          personType: draft.personType as PersonType,
          group: draft.group.replace('Class ', ''),
          visitDate: toRowDate(draft.visitDate),
          visitTime: draft.visitTime,
          consultationMinutes: Number(draft.length.split(' ')[0]) || row.consultationMinutes,
          reason: draft.reason.trim() || row.reason,
          condition: draft.condition as MedicalCondition,
          staff,
          staffRole: draft.staff.split('·')[1]?.trim() ?? row.staffRole,
          symptoms: draft.symptoms.split('\n').map((line) => line.trim()).filter(Boolean),
          vitals: {
            temperature: draft.temperature.trim() ? `${draft.temperature.trim()} °C` : row.vitals.temperature,
            pulse: draft.pulse.trim() ? `${draft.pulse.trim()} bpm` : row.vitals.pulse,
            bloodPressure: draft.bloodPressure.trim() ? `${draft.bloodPressure.trim()} mmHg` : row.vitals.bloodPressure,
            oxygen: draft.oxygen.trim() ? `${draft.oxygen.trim()}%` : row.vitals.oxygen,
            respiration: draft.respiration.trim() ? `${draft.respiration.trim()} per minute` : row.vitals.respiration,
            weight: draft.weight.trim() || row.vitals.weight,
          },
          // An investigation added on the amendment joins the ones already ordered.
          investigations: draft.investigation !== 'None'
            && !row.investigations.some((entry) => entry.name === draft.investigation)
            ? [...row.investigations, { name: draft.investigation, lab: draft.lab, result: '' }]
            : row.investigations,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Visit'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** A result closes the investigation, which is what clears Awaiting Results. */
  const recordDiagnosis = useCallback(
    (payload: DiagnosisPayload) => {
      let closed = false;
      patchRow(
        (row) => ({
          ...row,
          diagnosis: payload.diagnosis.trim() || row.diagnosis,
          condition: payload.condition as MedicalCondition,
          staff: payload.recordedBy.split('·')[0].trim(),
          staffRole: payload.recordedBy.split('·')[1]?.trim() ?? row.staffRole,
          investigations: row.investigations.map((investigation) => {
            if (investigation.result || !payload.closeInvestigation || closed) return investigation;
            if (!payload.result.trim()) return investigation;
            closed = true;
            return { ...investigation, result: payload.result.trim() };
          }),
          notes: payload.reasoning.trim() || row.notes,
        }),
        `${payload.kind} diagnosis saved for ${modalRow?.patient ?? 'the patient'}`,
      );
    },
    [modalRow, patchRow],
  );

  /** Prescribing opens the course, which is what the treatment card reads. */
  const prescribe = useCallback(
    (payload: PrescriptionPayload) =>
      patchRow(
        (row) => ({
          ...row,
          courseFrom: toRowDate(payload.startDate),
          prescriptions: [
            ...row.prescriptions,
            {
              medication: payload.medication,
              dose: payload.dose.trim() || 'As directed',
              frequency: payload.frequency,
              courseDays: Number(payload.courseLength.split(' ')[0]) || 5,
            },
          ],
          staff: payload.prescribedBy.split('·')[0].trim(),
          notes: payload.notes.trim() || row.notes,
        }),
        `${payload.medication} prescribed for ${payload.courseLength} from ${toRowDate(payload.startDate)}`,
      ),
    [patchRow],
  );

  const scheduleFollowUp = useCallback(
    (payload: FollowUpPayload) =>
      patchRow(
        (row) => ({
          ...row,
          followUp: {
            reviewDate: toRowDate(payload.reviewDate),
            reviewTime: payload.reviewTime,
            reviewer: payload.reviewer.split('·')[0].trim(),
            purpose: payload.purpose.trim() || row.followUp?.purpose || 'Review of the presenting complaint.',
            // Booking a new review reopens one that had been signed off.
            completedOn: '',
          },
        }),
        `Review booked for ${toRowDate(payload.reviewDate)} at ${payload.reviewTime}`,
      ),
    [patchRow],
  );

  /** A referral is what takes the row out of the health room's hands. */
  const refer = useCallback(
    (payload: ReferralPayload) =>
      patchRow(
        (row) => ({
          ...row,
          referral: {
            id: payload.referralId.trim() || `REF-2026-0000`,
            facility: payload.facility,
            doctor: payload.doctor,
            referredAt: payload.referredAt,
            urgency: payload.urgency,
            reason: payload.reason.trim() || row.reason,
            transport: payload.transport,
          },
        }),
        `${modalRow?.patient ?? 'Patient'} referred to ${payload.facility} — ${payload.urgency.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} medical visits exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Consultation) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="Medical history" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit visit record" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Prescribe medication" onClick={() => openModal(row, 'prescribe')}>
        <i className="ti ti-pill" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Schedule follow-up" onClick={() => openModal(row, 'followup')}>
        <i className="ti ti-calendar-time" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Refer to hospital" onClick={() => openModal(row, 'refer')}>
        <i className="ti ti-medical-cross" />
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

  const emptyCard = (icon: string, title: string, sub: string) => (
    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
      <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
        <i className={icon} />
      </span>
      <div className="flex-fill overflow-hidden">
        <h6 className="fs-13 mb-0 text-truncate">{title}</h6>
        <span className="fs-12 text-muted text-truncate d-block">{sub}</span>
      </div>
    </div>
  );

  /** The expander's last card offers whatever this consultation calls for. */
  const primaryAction = (row: Consultation) => {
    const status = statusOf(row);
    if (!row.diagnosis) {
      return { modal: 'diagnosis' as ConsultationModalId, icon: 'ti ti-notes', label: 'Record Diagnosis' };
    }
    if (status === 'Referred') {
      return { modal: 'followup' as ConsultationModalId, icon: 'ti ti-calendar-time', label: 'Schedule Follow-Up' };
    }
    if (row.prescriptions.length === 0) {
      return { modal: 'prescribe' as ConsultationModalId, icon: 'ti ti-pill', label: 'Prescribe Medication' };
    }
    if (isFollowUpDue(row)) {
      return { modal: 'followup' as ConsultationModalId, icon: 'ti ti-calendar-time', label: 'Reschedule Review' };
    }
    return { modal: 'refer' as ConsultationModalId, icon: 'ti ti-medical-cross', label: 'Refer to Hospital' };
  };

  const renderDetail = (row: Consultation) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Patient Information</h6>
          {pairList(patientPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-clipboard-heart text-info me-1" />Medical Assessment</h6>
          {pairList(assessmentPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-notes text-warning me-1" />Symptoms &amp; Diagnosis</h6>
          {row.symptoms.length === 0
            ? emptyCard('ti ti-notes-off', 'No symptoms recorded', 'Seen on presentation only')
            : row.symptoms.map((symptom) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={symptom}>
                <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                  <i className="ti ti-alert-circle" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{symptom}</h6>
                </div>
              </div>
            ))}
          <p className="fs-13 text-muted mb-0 mt-2">
            {row.diagnosis ? `Diagnosis · ${row.diagnosis}` : 'Diagnosis not yet recorded.'}
          </p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-heartbeat text-danger me-1" />Vital Signs</h6>
          {pairList(vitalsPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-pill text-purple me-1" />Medication &amp; Treatment</h6>
          {row.prescriptions.length === 0
            ? emptyCard('ti ti-pill-off', 'No medication prescribed', 'Managed without a course')
            : row.prescriptions.map((prescription) => (
              <div
                className="d-flex align-items-center gap-2 border rounded p-2 mb-2"
                key={`${prescription.medication}-${prescription.dose}`}
              >
                <span className="avatar avatar-sm bg-purple-transparent text-purple rounded flex-shrink-0">
                  <i className="ti ti-pill" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">
                    {prescription.medication} · {prescription.dose}
                  </h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {prescription.frequency} · {prescription.courseDays} day course
                  </span>
                </div>
              </div>
            ))}
          {/* The course the prescription opens, read off the longest one. */}
          <p className="fs-13 text-muted mb-0 mt-2">{courseLabelOf(row)}</p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-medical-cross text-danger me-1" />Referral Details</h6>
          {row.referral ? (
            <>
              {pairList(referralPairsOf(row))}
              <p className="fs-13 text-muted mb-0 mt-2">{row.referral.reason}</p>
            </>
          ) : emptyCard('ti ti-medical-cross', 'No referral raised', 'Managed in the health room')}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-calendar-time text-success me-1" />Follow-Up Plan</h6>
          {row.followUp?.reviewDate ? (
            <>
              {pairList(followUpPairsOf(row))}
              <p className="fs-13 text-muted mb-0 mt-2">{row.followUp.purpose}</p>
            </>
          ) : emptyCard('ti ti-calendar-off', 'No review booked', 'Discharged from the register')}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Clinical Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={visitTypeBadge[row.visitType]}>{row.visitType}</span>
            <span className={followUpBadge[followUpStateOf(row)]}>{followUpChip[followUpStateOf(row)]}</span>
          </div>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, primary.modal)}
            >
              <i className={`${primary.icon} me-1`} />{primary.label}
            </button>
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
              <i className="ti ti-stethoscope me-1" />Visit Panel
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
            title="Medical Visits"
            section="Health"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find(isFollowUpDue) ?? rows[0] ?? null, 'followup',
                    )}
                  >
                    <i className="ti ti-calendar-time me-2" />Schedule Follow-Up
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Consultation Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'new')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Medical Visit
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
            workspaceId="mvWorkspace"
            searchPlaceholder="Search visit ID, patient or diagnosis…"
            searchLabel="Search medical visits"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="visits"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Consultation register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-stethoscope-off"
            emptyTitle="No medical visits match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Visit Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Visit Details"
            labelledById="mv_panel_lbl"
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
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(patientPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Visit Summary</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(visitPairsOf(panelRow))}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">Visit Type</span>
                    <span className={visitTypeBadge[panelRow.visitType]}>
                      <i className={`${visitTypeIcon[panelRow.visitType]} me-1`} />{panelRow.visitType}
                    </span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Medical Assessment</h6>
                <div className="border rounded p-3 mb-3">{pairList(assessmentPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Vital Signs</h6>
                <div className="border rounded p-3 mb-3">{pairList(vitalsPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Investigations</h6>
                {panelRow.investigations.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">None ordered — managed clinically.</p>
                ) : (
                  <>
                    {panelRow.investigations.map((investigation) => (
                      <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={investigation.name}>
                        <span
                          className={`avatar avatar-sm bg-${investigation.result ? 'success' : 'warning'}-transparent text-${investigation.result ? 'success' : 'warning'} rounded flex-shrink-0`}
                        >
                          <i className="ti ti-flask" />
                        </span>
                        <div className="flex-fill overflow-hidden">
                          <h6 className="fs-13 mb-0 text-truncate">{investigation.name}</h6>
                          <span className="fs-12 text-muted text-truncate d-block">
                            {investigation.lab} · {investigation.result || 'result awaited'}
                          </span>
                        </div>
                      </div>
                    ))}
                    <p className="fs-12 text-muted mb-3">{investigationSummaryOf(panelRow)}</p>
                  </>
                )}

                <h6 className="fs-14 mb-2">Treatment</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Course', value: courseLabelOf(panelRow) },
                    { label: 'Prescriptions', value: String(panelRow.prescriptions.length) },
                    { label: 'Status', value: statusSubLabelOf(panelRow) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Referral Details</h6>
                {panelRow.referral ? (
                  <div className="border rounded p-3 mb-3">{pairList(referralPairsOf(panelRow))}</div>
                ) : (
                  <p className="fs-13 text-muted mb-3">No referral raised — managed in the health room.</p>
                )}

                <h6 className="fs-14 mb-2">Follow-Up Plan</h6>
                {panelRow.followUp?.reviewDate ? (
                  <div className="border rounded p-3 mb-3">{pairList(followUpPairsOf(panelRow))}</div>
                ) : (
                  <p className="fs-13 text-muted mb-3">No review booked.</p>
                )}

                <h6 className="fs-14 mb-2">Medical Timeline</h6>
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

                <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'followup'); }}
                  >
                    <i className="ti ti-calendar-time me-1" />Schedule Follow-Up
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit Visit
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ConsultationModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createVisit}
        onUpdate={updateVisit}
        onDiagnose={recordDiagnosis}
        onPrescribe={prescribe}
        onScheduleFollowUp={scheduleFollowUp}
        onRefer={refer}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="mvToasts" />
    </>
  );
};

export default MedicalVisitsPage;
