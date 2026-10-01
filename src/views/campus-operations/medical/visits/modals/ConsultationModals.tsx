import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { Consultation } from '../data/consultations.data';
import {
  REGISTER_DATE,
  REGISTER_TIME,
  assessmentPairsOf,
  conditionOptions,
  courseLabelOf,
  courseLengthOptions,
  dayText,
  daysBetween,
  diagnosisKindOptions,
  facilityOptions,
  followUpBadge,
  followUpLabelOf,
  followUpPairsOf,
  followUpPresets,
  followUpStateOf,
  frequencyOptions,
  groupOptions,
  investigationOptions,
  investigationSummaryOf,
  labOptions,
  lengthOptions,
  medicationOptions,
  patientPairsOf,
  pendingInvestigationsOf,
  personTypeOptions,
  quickTypeOptions,
  receivingDoctorOptions,
  routeOptions,
  shiftDate,
  staffChoices,
  statusBadge,
  statusOf,
  timelineOf,
  transportOptions,
  urgencyOptions,
  visitPairsOf,
  visitTypeBadge,
  visitTypeIcon,
  vitalsPairsOf,
} from '../data/consultations.data';

export type ConsultationModalId =
  | 'new' | 'edit' | 'diagnosis' | 'prescribe' | 'followup' | 'refer' | 'view';

export interface ConsultationDraft {
  quickType: string;
  personType: string;
  visitId: string;
  patient: string;
  group: string;
  visitDate: string;
  visitTime: string;
  reason: string;
  condition: string;
  staff: string;
  length: string;
  symptoms: string;
  temperature: string;
  pulse: string;
  bloodPressure: string;
  oxygen: string;
  respiration: string;
  weight: string;
  investigation: string;
  lab: string;
  notes: string;
  notifyGuardian: boolean;
  openPlanner: boolean;
}

export const emptyDraft: ConsultationDraft = {
  quickType: quickTypeOptions[0], personType: personTypeOptions[0], visitId: '', patient: '',
  group: groupOptions[0], visitDate: '31-07-2026', visitTime: REGISTER_TIME, reason: '',
  condition: conditionOptions[0], staff: staffChoices[0], length: lengthOptions[1],
  symptoms: '', temperature: '', pulse: '', bloodPressure: '', oxygen: '', respiration: '',
  weight: '', investigation: investigationOptions[0], lab: labOptions[0], notes: '',
  notifyGuardian: true, openPlanner: true,
};

/** "28 Jul 2026" → "28-07-2026", which is what the date inputs take. */
const toInputDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? '' : `${day.padStart(2, '0')}-${String(index + 1).padStart(2, '0')}-${year}`;
};

/** "28-07-2026" → "28 Jul 2026", the way a row prints a date. */
export const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

export const draftOf = (row: Consultation): ConsultationDraft => ({
  quickType: quickTypeOptions.find((option) => option === row.visitType) ?? quickTypeOptions[0],
  personType: row.personType,
  visitId: row.id,
  patient: row.patient,
  group: groupOptions.find((option) => option.endsWith(row.group)) ?? groupOptions[0],
  visitDate: toInputDate(row.visitDate),
  visitTime: row.visitTime,
  reason: row.reason,
  condition: row.condition,
  staff: staffChoices.find((choice) => choice.startsWith(row.staff)) ?? staffChoices[0],
  length: `${row.consultationMinutes} minutes`,
  symptoms: row.symptoms.join('\n'),
  temperature: row.vitals.temperature.replace(' °C', ''),
  pulse: row.vitals.pulse.replace(' bpm', ''),
  bloodPressure: row.vitals.bloodPressure.replace(' mmHg', ''),
  oxygen: row.vitals.oxygen.replace('%', ''),
  respiration: row.vitals.respiration.replace(' per minute', ''),
  weight: row.vitals.weight,
  investigation: row.investigations[0]?.name ?? investigationOptions[0],
  lab: row.investigations[0]?.lab ?? labOptions[0],
  notes: row.notes,
  notifyGuardian: true,
  openPlanner: Boolean(row.followUp?.reviewDate),
});

export interface DiagnosisPayload {
  kind: string;
  recordedBy: string;
  diagnosis: string;
  condition: string;
  result: string;
  reasoning: string;
  closeInvestigation: boolean;
}

export interface PrescriptionPayload {
  route: string;
  medication: string;
  dose: string;
  frequency: string;
  courseLength: string;
  startDate: string;
  prescribedBy: string;
  notes: string;
}

export interface FollowUpPayload {
  preset: string;
  reviewer: string;
  reviewDate: string;
  reviewTime: string;
  purpose: string;
  preparation: string;
}

export interface ReferralPayload {
  transport: string;
  referralId: string;
  facility: string;
  doctor: string;
  referredAt: string;
  urgency: string;
  reason: string;
}

export interface ConsultationModalsProps {
  active: ConsultationModalId | null;
  row: Consultation | null;
  onClose: () => void;
  onCreate: (draft: ConsultationDraft) => void;
  onUpdate: (draft: ConsultationDraft) => void;
  onDiagnose: (payload: DiagnosisPayload) => void;
  onPrescribe: (payload: PrescriptionPayload) => void;
  onScheduleFollowUp: (payload: FollowUpPayload) => void;
  onRefer: (payload: ReferralPayload) => void;
  onOpen: (modal: ConsultationModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const PatientStrip = ({ row, children }: { row: Consultation; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span
      className={`avatar avatar-md bg-${row.personType === 'Staff' ? 'success' : 'info'}-transparent text-${row.personType === 'Staff' ? 'success' : 'info'} rounded flex-shrink-0`}
    >
      <i className={row.personType === 'Staff' ? 'ti ti-id-badge-2' : 'ti ti-school'} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.patient}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.reference}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: ConsultationDraft;
  onField: (field: keyof ConsultationDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'new' | 'edit';
}

const ConsultationForm = ({ draft, onField, suffix, mode }: FormProps) => (
  <>
    {mode === 'new' ? (
      <>
        <div className="mb-3">
          <span className="form-label d-block">Visit type</span>
          <div className="d-flex flex-wrap gap-3">
            {quickTypeOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="visit-quick-type"
                  id={`nmv-${option}${suffix}`} checked={draft.quickType === option}
                  onChange={() => onField('quickType', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`nmv-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Emergency' ? 'ti-ambulance' : option === 'Follow-Up' ? 'ti-calendar-time' : option === 'Screening' ? 'ti-test-pipe' : 'ti-stethoscope'} me-1`}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <span className="form-label d-block">Patient</span>
          <div className="d-flex flex-wrap gap-3">
            {personTypeOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="visit-person-type"
                  id={`nmvp-${option}${suffix}`} checked={draft.personType === option}
                  onChange={() => onField('personType', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`nmvp-${option}${suffix}`}>
                  <i className={`ti ${option === 'Staff' ? 'ti-id-badge-2' : 'ti-school'} me-1`} />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </>
    ) : null}

    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-id${suffix}`}>Visit ID</label>
        <input
          type="text" className="form-control" id={`mv-id${suffix}`} placeholder="Generated on save"
          value={draft.visitId} onChange={(event) => onField('visitId', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-patient${suffix}`}>Patient Name</label>
        <input
          type="text" className="form-control" id={`mv-patient${suffix}`} placeholder="e.g. Kabir Shah"
          value={draft.patient} onChange={(event) => onField('patient', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-group${suffix}`}>Class / Department</label>
        <select
          className="form-select" id={`mv-group${suffix}`}
          value={draft.group} onChange={(event) => onField('group', event.target.value)}
        >
          {groupOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-date${suffix}`}>Visit Date</label>
        <DateField
          id={`mv-date${suffix}`} value={draft.visitDate}
          onChange={(next) => onField('visitDate', next)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-time${suffix}`}>Visit Time</label>
        <input
          type="time" className="form-control" id={`mv-time${suffix}`}
          value={draft.visitTime} onChange={(event) => onField('visitTime', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-length${suffix}`}>Consultation Length</label>
        <select
          className="form-select" id={`mv-length${suffix}`}
          value={draft.length} onChange={(event) => onField('length', event.target.value)}
        >
          {lengthOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-reason${suffix}`}>Visit Reason</label>
        <input
          type="text" className="form-control" id={`mv-reason${suffix}`}
          placeholder="e.g. Recurrent abdominal pain"
          value={draft.reason} onChange={(event) => onField('reason', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-condition${suffix}`}>Medical Condition</label>
        <select
          className="form-select" id={`mv-condition${suffix}`}
          value={draft.condition} onChange={(event) => onField('condition', event.target.value)}
        >
          {conditionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-staff${suffix}`}>Attending Staff</label>
        <select
          className="form-select" id={`mv-staff${suffix}`}
          value={draft.staff} onChange={(event) => onField('staff', event.target.value)}
        >
          {staffChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-symptoms${suffix}`}>Presenting Symptoms</label>
        <textarea
          className="form-control" rows={2} id={`mv-symptoms${suffix}`}
          placeholder="One symptom per line"
          value={draft.symptoms} onChange={(event) => onField('symptoms', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Vital Signs</h6>
    <div className="row">
      {([
        ['temperature', 'Temperature (°C)', 'e.g. 37.1'],
        ['pulse', 'Pulse (bpm)', 'e.g. 94'],
        ['bloodPressure', 'Blood Pressure', 'e.g. 102/66'],
        ['oxygen', 'Oxygen Saturation (%)', 'e.g. 99'],
        ['respiration', 'Respiration', 'Breaths per minute'],
        ['weight', 'Weight', 'e.g. 22.4 kg'],
      ] as [keyof ConsultationDraft, string, string][]).map(([key, label, placeholder]) => (
        <div className="col-md-4" key={key}><div className="mb-3">
          <label className="form-label" htmlFor={`mv-${key}${suffix}`}>{label}</label>
          <input
            type="text" className="form-control" id={`mv-${key}${suffix}`} placeholder={placeholder}
            value={String(draft[key])} onChange={(event) => onField(key, event.target.value)}
          />
        </div></div>
      ))}
    </div>

    <h6 className="fs-13 mb-2">Investigation</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-investigation${suffix}`}>Investigation Ordered</label>
        <select
          className="form-select" id={`mv-investigation${suffix}`}
          value={draft.investigation} onChange={(event) => onField('investigation', event.target.value)}
        >
          {investigationOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-lab${suffix}`}>Laboratory</label>
        <select
          className="form-select" id={`mv-lab${suffix}`}
          /* Nowhere to send a sample when nothing was ordered. */
          disabled={draft.investigation === 'None'}
          value={draft.lab} onChange={(event) => onField('lab', event.target.value)}
        >
          {labOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`mv-notes${suffix}`}>Clinical Notes</label>
        <textarea
          className="form-control" rows={2} id={`mv-notes${suffix}`}
          placeholder="Visible to the health room team only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`mvNotify${suffix}`}
            checked={draft.notifyGuardian}
            onChange={(event) => onField('notifyGuardian', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`mvNotify${suffix}`}>
            {mode === 'new'
              ? 'Notify the guardian that a consultation has been recorded'
              : 'Add this amendment to the medical timeline'}
          </label>
        </div>
        {mode === 'new' ? (
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`mvPlanner${suffix}`}
              checked={draft.openPlanner}
              onChange={(event) => onField('openPlanner', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`mvPlanner${suffix}`}>
              Open the follow-up planner after saving
            </label>
          </div>
        ) : null}
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const ConsultationModals = ({
  active, row, onClose, onCreate, onUpdate, onDiagnose, onPrescribe, onScheduleFollowUp,
  onRefer, onOpen, onOpenPanel,
}: ConsultationModalsProps) => {
  const [draft, setDraft] = useState<ConsultationDraft>(emptyDraft);

  const [diagnosisKind, setDiagnosisKind] = useState(diagnosisKindOptions[0]);
  const [recordedBy, setRecordedBy] = useState(staffChoices[0]);
  const [diagnosis, setDiagnosis] = useState('');
  const [diagnosisCondition, setDiagnosisCondition] = useState(conditionOptions[0]);
  const [investigationResult, setInvestigationResult] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [closeInvestigation, setCloseInvestigation] = useState(true);
  const [addToHistory, setAddToHistory] = useState(true);

  const [route, setRoute] = useState(routeOptions[0]);
  const [medication, setMedication] = useState(medicationOptions[0]);
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState(frequencyOptions[0]);
  const [courseLength, setCourseLength] = useState(courseLengthOptions[1]);
  const [startDate, setStartDate] = useState('31-07-2026');
  const [prescribedBy, setPrescribedBy] = useState(staffChoices[0]);
  const [administrationNotes, setAdministrationNotes] = useState('');
  const [checkAllergies, setCheckAllergies] = useState(true);
  const [printSlip, setPrintSlip] = useState(true);

  const [preset, setPreset] = useState(followUpPresets[1]);
  const [reviewer, setReviewer] = useState(staffChoices[0]);
  const [reviewDate, setReviewDate] = useState('03-08-2026');
  const [reviewTime, setReviewTime] = useState('10:30');
  const [purpose, setPurpose] = useState('');
  const [preparation, setPreparation] = useState('');
  const [remindGuardian, setRemindGuardian] = useState(true);
  const [informTeacher, setInformTeacher] = useState(true);

  const [transport, setTransport] = useState(transportOptions[0]);
  const [referralId, setReferralId] = useState('');
  const [facility, setFacility] = useState(facilityOptions[0]);
  const [receivingDoctor, setReceivingDoctor] = useState(receivingDoctorOptions[2]);
  const [referredAt, setReferredAt] = useState(REGISTER_TIME);
  const [urgency, setUrgency] = useState(urgencyOptions[0]);
  const [referralReason, setReferralReason] = useState('');
  const [sendSummary, setSendSummary] = useState(true);
  const [askGuardian, setAskGuardian] = useState(true);

  useEffect(() => {
    if (active === 'new') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    const staff = staffChoices.find((choice) => choice.startsWith(row.staff)) ?? staffChoices[0];
    if (active === 'diagnosis') {
      setDiagnosisKind(diagnosisKindOptions[0]);
      setRecordedBy(staff);
      setDiagnosis(row.diagnosis);
      setDiagnosisCondition(row.condition);
      setInvestigationResult('');
      setReasoning('');
    }
    if (active === 'prescribe') {
      setRoute(routeOptions[0]);
      setMedication(medicationOptions[0]);
      setDose('');
      setFrequency(frequencyOptions[0]);
      setCourseLength(courseLengthOptions[1]);
      setStartDate('31-07-2026');
      setPrescribedBy(staff);
      setAdministrationNotes('');
    }
    if (active === 'followup') {
      setPreset(followUpPresets[1]);
      setReviewer(staff);
      setReviewDate(toInputDate(shiftDate(REGISTER_DATE, 7)));
      setReviewTime(row.visitTime);
      setPurpose(row.followUp?.purpose ?? '');
      setPreparation('');
    }
    if (active === 'refer') {
      setTransport(transportOptions[0]);
      setReferralId(row.referral?.id ?? `REF-2026-00${92 + Number(row.id.slice(-2)) % 10}`);
      setFacility(facilityOptions[0]);
      setReferredAt(REGISTER_TIME);
      setUrgency(urgencyOptions[0]);
      setReferralReason(row.referral?.reason ?? '');
    }
  }, [active, row]);

  const field = (key: keyof ConsultationDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The end date the start and the course length produce. */
  const courseDays = Number(courseLength.split(' ')[0]) || 5;
  const courseEnd = toRowDate(startDate) ? shiftDate(toRowDate(startDate), courseDays - 1) : '';

  /** How far ahead the review date sits from today. */
  const reviewInDays = daysBetween(REGISTER_DATE, toRowDate(reviewDate));

  return (
    <>
      {/* New Medical Visit */}
      <Modal
        open={active === 'new'}
        onClose={onClose}
        title="New Medical Visit"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Visit</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Record a consultation in the health room register</p>
        <ConsultationForm draft={draft} onField={field} suffix="" mode="new" />
      </Modal>

      {/* Edit Visit Record */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Visit Record"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id}  •  {row.patient}  •  {statusOf(row).toLowerCase()}
            </p>
            <ConsultationForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Record Diagnosis */}
      <Modal
        open={active === 'diagnosis' && row !== null}
        onClose={onClose}
        title="Record Diagnosis"
        onSubmit={(event) => {
          event.preventDefault();
          onDiagnose({
            kind: diagnosisKind, recordedBy, diagnosis, condition: diagnosisCondition,
            result: investigationResult, reasoning, closeInvestigation,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-notes me-1" />Save Diagnosis
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Visit Reason" value={row.reason} />
              <Row label="Current Diagnosis" value={row.diagnosis || 'Not recorded'} />
              <Row label="Investigations" value={investigationSummaryOf(row)} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Diagnosis kind</span>
              <div className="d-flex flex-wrap gap-3">
                {diagnosisKindOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="diagnosis-kind"
                      id={`rdx-${option}`} checked={diagnosisKind === option}
                      onChange={() => setDiagnosisKind(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`rdx-${option}`}>
                      <i
                        className={`ti ${option === 'Confirmed' ? 'ti-circle-check' : option === 'Ruled Out' ? 'ti-circle-x' : 'ti-help'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="mv-recorded-by">Recorded By</label>
                <select
                  className="form-select" id="mv-recorded-by"
                  value={recordedBy} onChange={(event) => setRecordedBy(event.target.value)}
                >
                  {staffChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="mv-condition-category">Condition Category</label>
                <select
                  className="form-select" id="mv-condition-category"
                  value={diagnosisCondition}
                  onChange={(event) => setDiagnosisCondition(event.target.value as typeof diagnosisCondition)}
                >
                  {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-diagnosis">Diagnosis</label>
                <input
                  type="text" className="form-control" id="mv-diagnosis"
                  value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)}
                />
              </div></div>
              {pendingInvestigationsOf(row) > 0 ? (
                <div className="col-md-12"><div className="mb-3">
                  <label className="form-label" htmlFor="mv-result">Investigation Result</label>
                  <input
                    type="text" className="form-control" id="mv-result"
                    placeholder="e.g. No fracture seen"
                    value={investigationResult}
                    onChange={(event) => setInvestigationResult(event.target.value)}
                  />
                  <span className="fs-12 text-muted">
                    {pendingInvestigationsOf(row)} still awaited on this visit
                  </span>
                </div></div>
              ) : null}
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-reasoning">Clinical Reasoning</label>
                <textarea
                  className="form-control" rows={2} id="mv-reasoning"
                  placeholder="Written to the medical timeline"
                  value={reasoning} onChange={(event) => setReasoning(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rdxClose"
                    disabled={pendingInvestigationsOf(row) === 0}
                    checked={closeInvestigation && pendingInvestigationsOf(row) > 0}
                    onChange={(event) => setCloseInvestigation(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rdxClose">
                    Close the outstanding investigation on this visit
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rdxHistory"
                    checked={addToHistory} onChange={(event) => setAddToHistory(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rdxHistory">
                    Add the diagnosis to the patient medical history
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Prescribe Medication */}
      <Modal
        open={active === 'prescribe' && row !== null}
        onClose={onClose}
        title="Prescribe Medication"
        onSubmit={(event) => {
          event.preventDefault();
          onPrescribe({
            route, medication, dose, frequency, courseLength,
            startDate, prescribedBy, notes: administrationNotes,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-pill me-1" />Save Prescription
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Diagnosis" value={row.diagnosis || 'Not recorded'} />
              <Row label="Current Course" value={courseLabelOf(row)} />
              <Row label="Weight" value={row.vitals.weight} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Route</span>
              <div className="d-flex flex-wrap gap-3">
                {routeOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="prescription-route"
                      id={`rx-${option}`} checked={route === option}
                      onChange={() => setRoute(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`rx-${option}`}>
                      <i
                        className={`ti ${option === 'Topical' ? 'ti-first-aid-kit' : option === 'Inhaled' ? 'ti-lungs' : 'ti-pill'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="mv-medication">Medication</label>
                <select
                  className="form-select" id="mv-medication"
                  value={medication} onChange={(event) => setMedication(event.target.value)}
                >
                  {medicationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="mv-dose">Dose</label>
                <input
                  type="text" className="form-control" id="mv-dose" placeholder="e.g. 100 mg"
                  value={dose} onChange={(event) => setDose(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-frequency">Frequency</label>
                <select
                  className="form-select" id="mv-frequency"
                  value={frequency} onChange={(event) => setFrequency(event.target.value)}
                >
                  {frequencyOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-course">Course Length</label>
                <select
                  className="form-select" id="mv-course"
                  value={courseLength} onChange={(event) => setCourseLength(event.target.value)}
                >
                  {courseLengthOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-start">Start Date</label>
                <DateField id="mv-start" value={startDate} onChange={setStartDate} />
                {/* The course the start and the length produce. */}
                <span className="fs-12 text-muted">Runs to {courseEnd}</span>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-prescribed-by">Prescribed By</label>
                <select
                  className="form-select" id="mv-prescribed-by"
                  value={prescribedBy} onChange={(event) => setPrescribedBy(event.target.value)}
                >
                  {staffChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-admin-notes">Administration Notes</label>
                <textarea
                  className="form-control" rows={2} id="mv-admin-notes"
                  placeholder="Written to the prescription record"
                  value={administrationNotes}
                  onChange={(event) => setAdministrationNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rxAllergy"
                    checked={checkAllergies} onChange={(event) => setCheckAllergies(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rxAllergy">
                    Check the prescription against the recorded allergies
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rxSlip"
                    checked={printSlip} onChange={(event) => setPrintSlip(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rxSlip">
                    Print a prescription slip for the guardian
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Schedule Follow-Up */}
      <Modal
        open={active === 'followup' && row !== null}
        onClose={onClose}
        title="Schedule Follow-Up"
        onSubmit={(event) => {
          event.preventDefault();
          onScheduleFollowUp({ preset, reviewer, reviewDate, reviewTime, purpose, preparation });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-calendar-time me-1" />Schedule Follow-Up
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row}>
              <span className={followUpBadge[followUpStateOf(row)]}>{followUpStateOf(row)}</span>
            </PatientStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Visit" value={`${row.visitDate} · ${row.reason}`} />
              <Row label="Current Follow-Up" value={followUpLabelOf(row)} />
              <Row label="Treatment" value={courseLabelOf(row)} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Review in</span>
              <div className="d-flex flex-wrap gap-3">
                {followUpPresets.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="followup-preset"
                      id={`fu-${option}`} checked={preset === option}
                      onChange={() => {
                        setPreset(option);
                        // The review date follows from the preset, not a free guess.
                        const days = option === '3 days' ? 3
                          : option === '1 week' ? 7 : option === '2 weeks' ? 14 : 30;
                        setReviewDate(toInputDate(shiftDate(REGISTER_DATE, days)));
                      }}
                    />
                    <label className="form-check-label fs-13" htmlFor={`fu-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-review-date">Review Date</label>
                <DateField id="mv-review-date" value={reviewDate} onChange={setReviewDate} />
                <span className={`fs-12 ${reviewInDays < 0 ? 'text-danger' : 'text-muted'}`}>
                  {reviewInDays < 0 ? `${dayText(reviewInDays)} in the past`
                    : reviewInDays === 0 ? 'Today' : `In ${dayText(reviewInDays)}`}
                </span>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-review-time">Review Time</label>
                <input
                  type="time" className="form-control" id="mv-review-time"
                  value={reviewTime} onChange={(event) => setReviewTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-reviewer">Reviewer</label>
                <select
                  className="form-select" id="mv-reviewer"
                  value={reviewer} onChange={(event) => setReviewer(event.target.value)}
                >
                  {staffChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-purpose">Purpose of Review</label>
                <input
                  type="text" className="form-control" id="mv-purpose"
                  placeholder="e.g. Repeat haemoglobin after four weeks of iron therapy"
                  value={purpose} onChange={(event) => setPurpose(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-preparation">Preparation Notes</label>
                <textarea
                  className="form-control" rows={2} id="mv-preparation"
                  placeholder="Sent with the reminder"
                  value={preparation} onChange={(event) => setPreparation(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="fuRemind"
                    checked={remindGuardian} onChange={(event) => setRemindGuardian(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="fuRemind">
                    Remind the guardian the day before the review
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="fuTeacher"
                    /* Nobody to tell when the patient is a member of staff. */
                    disabled={row.personType === 'Staff'}
                    checked={informTeacher && row.personType !== 'Staff'}
                    onChange={(event) => setInformTeacher(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="fuTeacher">
                    Inform the class teacher of the appointment
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Refer to Hospital */}
      <Modal
        open={active === 'refer' && row !== null}
        onClose={onClose}
        title="Refer to Hospital"
        onSubmit={(event) => {
          event.preventDefault();
          onRefer({
            transport, referralId, facility, doctor: receivingDoctor,
            referredAt, urgency, reason: referralReason,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger">
              <i className="ti ti-medical-cross me-1" />Raise Referral
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Diagnosis" value={row.diagnosis || 'Not recorded'} />
              <Row label="Oxygen Saturation" value={row.vitals.oxygen} />
              <Row label="Pulse" value={row.vitals.pulse} last />
            </div>

            {row.referral ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  A referral to {row.referral.facility} was already raised at {row.referral.referredAt}.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Transport</span>
              <div className="d-flex flex-wrap gap-3">
                {transportOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="referral-transport"
                      id={`ref-${option}`} checked={transport === option}
                      onChange={() => setTransport(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`ref-${option}`}>
                      <i
                        className={`ti ${option === 'Ambulance' ? 'ti-ambulance' : option === 'Guardian' ? 'ti-users' : 'ti-user'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="mv-referral-id">Referral ID</label>
                <input
                  type="text" className="form-control" id="mv-referral-id"
                  value={referralId} onChange={(event) => setReferralId(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="mv-facility">Facility</label>
                <select
                  className="form-select" id="mv-facility"
                  value={facility} onChange={(event) => setFacility(event.target.value)}
                >
                  {facilityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-receiving-doctor">Receiving Doctor</label>
                <select
                  className="form-select" id="mv-receiving-doctor"
                  value={receivingDoctor} onChange={(event) => setReceivingDoctor(event.target.value)}
                >
                  {receivingDoctorOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-referred-at">Referred At</label>
                <input
                  type="time" className="form-control" id="mv-referred-at"
                  value={referredAt} onChange={(event) => setReferredAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="mv-urgency">Urgency</label>
                <select
                  className="form-select" id="mv-urgency"
                  value={urgency} onChange={(event) => setUrgency(event.target.value)}
                >
                  {urgencyOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="mv-referral-reason">Reason for Referral</label>
                <textarea
                  className="form-control" rows={2} id="mv-referral-reason"
                  placeholder="Sent with the referral letter"
                  value={referralReason} onChange={(event) => setReferralReason(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="refSummary"
                    checked={sendSummary} onChange={(event) => setSendSummary(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="refSummary">
                    Send the consultation summary and vitals with the referral
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="refGuardian"
                    checked={askGuardian} onChange={(event) => setAskGuardian(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="refGuardian">
                    Ask the guardian to meet the patient at the facility
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Medical History */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Medical history'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('followup')}>
              <i className="ti ti-calendar-time me-1" />Schedule Follow-Up
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-stethoscope me-1" />Open Visit Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.patient}  •  {row.group}  •  {row.visitDate}
            </p>

            <PatientStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: visitTypeIcon[row.visitType], tint: 'primary', label: 'Visit Type', value: row.visitType },
                { icon: 'ti ti-clock', tint: 'info', label: 'Consultation', value: `${row.consultationMinutes} min` },
                { icon: 'ti ti-flask', tint: 'warning', label: 'Investigations', value: investigationSummaryOf(row) },
                { icon: 'ti ti-calendar-time', tint: 'success', label: 'Follow-Up', value: followUpStateOf(row) },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3 d-flex align-items-center gap-2">
                    <span className={`avatar avatar-sm bg-${tile.tint}-transparent text-${tile.tint} rounded flex-shrink-0`}>
                      <i className={tile.icon} />
                    </span>
                    <div className="overflow-hidden">
                      <span className="fs-12 text-muted d-block text-truncate">{tile.label}</span>
                      <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Patient Information</h6>
                <div className="border rounded p-3">
                  {patientPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Visit Summary</h6>
                <div className="border rounded p-3">
                  {visitPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Medical Assessment</h6>
                <div className="border rounded p-3">
                  {assessmentPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Vital Signs</h6>
                <div className="border rounded p-3">
                  {vitalsPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Medical Timeline</h6>
            {timelineOf(row).map((entry) => (
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

            {row.followUp?.reviewDate ? (
              <>
                <h6 className="fs-13 mb-2 mt-3">Follow-Up Plan</h6>
                <div className="border rounded p-3">
                  {followUpPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                  <p className="fs-13 text-muted mb-0 mt-2">{row.followUp.purpose}</p>
                </div>
              </>
            ) : null}

            <h6 className="fs-13 mb-2 mt-3">Clinical Notes</h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={visitTypeBadge[row.visitType]}>{row.visitType}</span>
              <span className={followUpBadge[followUpStateOf(row)]}>{followUpStateOf(row)}</span>
            </div>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ConsultationModals;
