import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { SickRoomVisit } from '../data/visits.data';
import {
  REGISTER_TIME,
  addMinutes,
  conditionCategoryOptions,
  dischargeBadge,
  dischargeKindOptions,
  dischargeOf,
  durationText,
  groupOptions,
  guardianPairsOf,
  medicationOptions,
  minutesOf,
  notifyMethodOptions,
  notifyOutcomeOptions,
  nurseChoices,
  patientPairsOf,
  personTypeOptions,
  returnToSchoolOptions,
  severityBadge,
  severityOptions,
  stayOf,
  timelineOf,
  treatmentBadge,
  treatmentKindOptions,
  treatmentOf,
  visitPairsOf,
  vitalsPairsOf,
} from '../data/visits.data';

export type SickRoomModalId =
  | 'admit' | 'update' | 'medication' | 'notify' | 'discharge' | 'view';

export interface VisitDraft {
  personType: string;
  severity: string;
  visitId: string;
  patient: string;
  group: string;
  checkIn: string;
  nurse: string;
  complaint: string;
  condition: string;
  observation: string;
  temperature: string;
  pulse: string;
  bloodPressure: string;
  oxygen: string;
  respiration: string;
  allergies: string;
  guardian: string;
  contact: string;
  notes: string;
  notifyGuardian: boolean;
  informTeacher: boolean;
}

export const emptyDraft: VisitDraft = {
  personType: personTypeOptions[0], severity: severityOptions[0], visitId: '', patient: '',
  group: groupOptions[0], checkIn: REGISTER_TIME, nurse: nurseChoices[0], complaint: '',
  condition: conditionCategoryOptions[0], observation: '', temperature: '', pulse: '',
  bloodPressure: '', oxygen: '', respiration: '', allergies: '', guardian: '', contact: '',
  notes: '', notifyGuardian: true, informTeacher: true,
};

export const draftOf = (row: SickRoomVisit): VisitDraft => ({
  personType: row.personType,
  severity: row.severity,
  visitId: row.id,
  patient: row.patient,
  group: groupOptions.find((option) => option.endsWith(row.group)) ?? groupOptions[0],
  checkIn: row.checkIn,
  nurse: nurseChoices.find((choice) => choice.startsWith(row.nurse)) ?? nurseChoices[0],
  complaint: row.complaint,
  condition: conditionCategoryOptions.find((option) => option === row.condition)
    ?? conditionCategoryOptions[0],
  observation: row.observations[0]?.note ?? '',
  temperature: row.vitals.temperature.replace(' °C', ''),
  pulse: row.vitals.pulse.replace(' bpm', ''),
  bloodPressure: row.vitals.bloodPressure.replace(' mmHg', ''),
  oxygen: row.vitals.oxygen.replace('%', ''),
  respiration: row.vitals.respiration.replace(' per minute', ''),
  allergies: '',
  guardian: row.guardian?.name ?? '',
  contact: row.guardian?.contact ?? '',
  notes: row.notes,
  notifyGuardian: Boolean(row.guardian),
  informTeacher: true,
});

export interface MedicationPayload {
  kind: string;
  medication: string;
  dose: string;
  givenAt: string;
  by: string;
  nextReview: string;
  notes: string;
}

export interface NotifyPayload {
  method: string;
  contactedAt: string;
  calledBy: string;
  outcome: string;
  message: string;
}

export interface DischargePayload {
  kind: string;
  time: string;
  by: string;
  handedOverTo: string;
  finalTemperature: string;
  returnToSchool: string;
  notes: string;
  raiseExitPass: boolean;
}

export interface SickRoomModalsProps {
  active: SickRoomModalId | null;
  row: SickRoomVisit | null;
  onClose: () => void;
  onAdmit: (draft: VisitDraft) => void;
  onUpdate: (draft: VisitDraft) => void;
  onRecordMedication: (payload: MedicationPayload) => void;
  onNotify: (payload: NotifyPayload) => void;
  onDischarge: (payload: DischargePayload) => void;
  onOpen: (modal: SickRoomModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const PatientStrip = ({ row, children }: { row: SickRoomVisit; children?: ReactNode }) => (
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
    {children ?? <span className={severityBadge[row.severity]}>{row.severity}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: VisitDraft;
  onField: (field: keyof VisitDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'admit' | 'update';
}

const VisitForm = ({ draft, onField, suffix, mode }: FormProps) => (
  <>
    {mode === 'admit' ? (
      <>
        <div className="mb-3">
          <span className="form-label d-block">Patient</span>
          <div className="d-flex flex-wrap gap-3">
            {personTypeOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="patient-type"
                  id={`adm-${option}${suffix}`} checked={draft.personType === option}
                  onChange={() => onField('personType', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`adm-${option}${suffix}`}>
                  <i className={`ti ${option === 'Staff' ? 'ti-id-badge-2' : 'ti-school'} me-1`} />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <span className="form-label d-block">Severity</span>
          <div className="d-flex flex-wrap gap-3">
            {severityOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="severity"
                  id={`sev-${option}${suffix}`} checked={draft.severity === option}
                  onChange={() => onField('severity', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`sev-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Emergency' ? 'ti-ambulance' : option === 'Moderate' ? 'ti-alert-triangle' : 'ti-circle-check'} me-1`}
                  />
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
        <label className="form-label" htmlFor={`sr-id${suffix}`}>Visit ID</label>
        <input
          type="text" className="form-control" id={`sr-id${suffix}`}
          placeholder="Generated on admission"
          value={draft.visitId} onChange={(event) => onField('visitId', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-patient${suffix}`}>Patient Name</label>
        <input
          type="text" className="form-control" id={`sr-patient${suffix}`} placeholder="e.g. Meera Iyer"
          value={draft.patient} onChange={(event) => onField('patient', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-group${suffix}`}>Class / Department</label>
        <select
          className="form-select" id={`sr-group${suffix}`}
          value={draft.group} onChange={(event) => onField('group', event.target.value)}
        >
          {groupOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-in${suffix}`}>Check-In Time</label>
        <input
          type="time" className="form-control" id={`sr-in${suffix}`}
          value={draft.checkIn} onChange={(event) => onField('checkIn', event.target.value)}
        />
      </div></div>
      <div className="col-md-8"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-nurse${suffix}`}>Attending Nurse</label>
        <select
          className="form-select" id={`sr-nurse${suffix}`}
          value={draft.nurse} onChange={(event) => onField('nurse', event.target.value)}
        >
          {nurseChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-complaint${suffix}`}>Presenting Complaint</label>
        <input
          type="text" className="form-control" id={`sr-complaint${suffix}`}
          placeholder="e.g. Fever and sore throat"
          value={draft.complaint} onChange={(event) => onField('complaint', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-condition${suffix}`}>Condition Category</label>
        <select
          className="form-select" id={`sr-condition${suffix}`}
          value={draft.condition} onChange={(event) => onField('condition', event.target.value)}
        >
          {conditionCategoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-observation${suffix}`}>Initial Observation</label>
        <textarea
          className="form-control" rows={2} id={`sr-observation${suffix}`}
          placeholder="What the nurse saw on arrival"
          value={draft.observation} onChange={(event) => onField('observation', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Vital Signs</h6>
    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-temp${suffix}`}>Temperature (°C)</label>
        <input
          type="text" className="form-control" id={`sr-temp${suffix}`} placeholder="e.g. 38.4"
          value={draft.temperature} onChange={(event) => onField('temperature', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-pulse${suffix}`}>Pulse (bpm)</label>
        <input
          type="text" className="form-control" id={`sr-pulse${suffix}`} placeholder="e.g. 96"
          value={draft.pulse} onChange={(event) => onField('pulse', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-bp${suffix}`}>Blood Pressure</label>
        <input
          type="text" className="form-control" id={`sr-bp${suffix}`} placeholder="e.g. 104/68"
          value={draft.bloodPressure} onChange={(event) => onField('bloodPressure', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-spo${suffix}`}>Oxygen Saturation (%)</label>
        <input
          type="text" className="form-control" id={`sr-spo${suffix}`} placeholder="e.g. 98"
          value={draft.oxygen} onChange={(event) => onField('oxygen', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-resp${suffix}`}>Respiration</label>
        <input
          type="text" className="form-control" id={`sr-resp${suffix}`} placeholder="Breaths per minute"
          value={draft.respiration} onChange={(event) => onField('respiration', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-allergies${suffix}`}>Known Allergies</label>
        <input
          type="text" className="form-control" id={`sr-allergies${suffix}`}
          placeholder="Leave blank if none recorded"
          value={draft.allergies} onChange={(event) => onField('allergies', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Guardian &amp; Notes</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-guardian${suffix}`}>Guardian / Emergency Contact</label>
        <input
          type="text" className="form-control" id={`sr-guardian${suffix}`}
          placeholder="e.g. Mrs. Latha Iyer"
          value={draft.guardian} onChange={(event) => onField('guardian', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-contact${suffix}`}>Contact Number</label>
        <input
          type="text" className="form-control" id={`sr-contact${suffix}`}
          placeholder="e.g. +1 55 3390 8827"
          value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
        />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`sr-notes${suffix}`}>Internal Medical Notes</label>
        <textarea
          className="form-control" rows={2} id={`sr-notes${suffix}`}
          placeholder="Visible to the sick room team only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`srNotify${suffix}`}
            checked={draft.notifyGuardian}
            onChange={(event) => onField('notifyGuardian', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`srNotify${suffix}`}>
            {mode === 'admit'
              ? 'Notify the guardian as soon as the visit is opened'
              : 'Add this update to the treatment timeline'}
          </label>
        </div>
        {mode === 'admit' ? (
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`srTeacher${suffix}`}
              checked={draft.informTeacher}
              onChange={(event) => onField('informTeacher', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`srTeacher${suffix}`}>
              Inform the class teacher that the student has left class
            </label>
          </div>
        ) : null}
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const SickRoomModals = ({
  active, row, onClose, onAdmit, onUpdate, onRecordMedication, onNotify, onDischarge,
  onOpen, onOpenPanel,
}: SickRoomModalsProps) => {
  const [draft, setDraft] = useState<VisitDraft>(emptyDraft);

  const [kind, setKind] = useState(treatmentKindOptions[0]);
  const [medication, setMedication] = useState(medicationOptions[0]);
  const [dose, setDose] = useState('');
  const [givenAt, setGivenAt] = useState(REGISTER_TIME);
  const [administeredBy, setAdministeredBy] = useState(nurseChoices[0]);
  const [nextReview, setNextReview] = useState(addMinutes(REGISTER_TIME, 30));
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [checkAllergies, setCheckAllergies] = useState(true);
  const [guardianConsent, setGuardianConsent] = useState(true);

  const [method, setMethod] = useState(notifyMethodOptions[0]);
  const [contactedAt, setContactedAt] = useState(REGISTER_TIME);
  const [calledBy, setCalledBy] = useState(nurseChoices[0]);
  const [outcome, setOutcome] = useState(notifyOutcomeOptions[0]);
  const [message, setMessage] = useState('');
  const [recordContact, setRecordContact] = useState(true);
  const [copySecond, setCopySecond] = useState(false);

  const [dischargeKind, setDischargeKind] = useState(dischargeKindOptions[0]);
  const [dischargeTime, setDischargeTime] = useState(REGISTER_TIME);
  const [dischargedBy, setDischargedBy] = useState(nurseChoices[0]);
  const [handedOverTo, setHandedOverTo] = useState('');
  const [finalTemperature, setFinalTemperature] = useState('');
  const [returnToSchool, setReturnToSchool] = useState(returnToSchoolOptions[0]);
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [raiseExitPass, setRaiseExitPass] = useState(true);
  const [updateTeacher, setUpdateTeacher] = useState(true);

  useEffect(() => {
    if (active === 'admit') setDraft(emptyDraft);
    else if (active === 'update' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'medication') {
      setKind(treatmentKindOptions[0]);
      setMedication(medicationOptions[0]);
      setDose('');
      setGivenAt(REGISTER_TIME);
      setAdministeredBy(nurseChoices.find((choice) => choice.startsWith(row.nurse)) ?? nurseChoices[0]);
      setNextReview(addMinutes(REGISTER_TIME, 30));
      setTreatmentNotes('');
    }
    if (active === 'notify') {
      setMethod(notifyMethodOptions[0]);
      setContactedAt(REGISTER_TIME);
      setCalledBy(nurseChoices.find((choice) => choice.startsWith(row.nurse)) ?? nurseChoices[0]);
      setOutcome(notifyOutcomeOptions[0]);
      setMessage('');
    }
    if (active === 'discharge') {
      setDischargeKind(row.personType === 'Staff' ? dischargeKindOptions[0] : dischargeKindOptions[0]);
      setDischargeTime(REGISTER_TIME);
      setDischargedBy(nurseChoices.find((choice) => choice.startsWith(row.nurse)) ?? nurseChoices[0]);
      setHandedOverTo(row.guardian ? `${row.guardian.name} · ${row.guardian.relationship}` : '');
      setFinalTemperature('');
      setDischargeNotes('');
    }
  }, [active, row]);

  const field = (key: keyof VisitDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The stay the discharge time being entered would close. */
  const stayAtDischarge = row
    ? Math.max(0, minutesOf(dischargeTime) - minutesOf(row.checkIn))
    : 0;

  return (
    <>
      {/* Admit Patient */}
      <Modal
        open={active === 'admit'}
        onClose={onClose}
        title="Admit Patient"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onAdmit(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Admit Patient</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Open a sick room visit and record the first observation</p>
        <VisitForm draft={draft} onField={field} suffix="" mode="admit" />
      </Modal>

      {/* Update Medical Record */}
      <Modal
        open={active === 'update' && row !== null}
        onClose={onClose}
        title="Update Medical Record"
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
              {row.id}  •  {row.patient}  •  {treatmentOf(row).toLowerCase()}
            </p>
            <VisitForm draft={draft} onField={field} suffix="-2" mode="update" />
          </>
        ) : null}
      </Modal>

      {/* Record Medication */}
      <Modal
        open={active === 'medication' && row !== null}
        onClose={onClose}
        title="Record Medication"
        onSubmit={(event) => {
          event.preventDefault();
          onRecordMedication({
            kind, medication, dose, givenAt, by: administeredBy, nextReview, notes: treatmentNotes,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-pill me-1" />Record Medication
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row}>
              <span className={treatmentBadge[treatmentOf(row)]}>{treatmentOf(row)}</span>
            </PatientStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Complaint" value={row.complaint} />
              <Row label="Temperature" value={row.vitals.temperature} />
              <Row
                label="Entries So Far"
                value={row.medications.length > 0
                  ? `${row.medications.length} · last at ${row.medications[row.medications.length - 1].at}`
                  : 'None recorded'}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Treatment given</span>
              <div className="d-flex flex-wrap gap-3">
                {treatmentKindOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="treatment-kind"
                      id={`med-${option}`} checked={kind === option}
                      onChange={() => setKind(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`med-${option}`}>
                      <i
                        className={`ti ${option === 'First Aid' ? 'ti-first-aid-kit' : option === 'Rest Only' ? 'ti-bed' : 'ti-pill'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="sr-medication">Medication</label>
                <select
                  className="form-select" id="sr-medication"
                  /* Nothing to name when only rest was given. */
                  disabled={kind === 'Rest Only'}
                  value={medication} onChange={(event) => setMedication(event.target.value)}
                >
                  {medicationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="sr-dose">Dose</label>
                <input
                  type="text" className="form-control" id="sr-dose" placeholder="e.g. 250 mg oral"
                  disabled={kind === 'Rest Only'}
                  value={kind === 'Rest Only' ? '' : dose}
                  onChange={(event) => setDose(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-given-at">Given At</label>
                <input
                  type="time" className="form-control" id="sr-given-at"
                  value={givenAt} onChange={(event) => setGivenAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-administered-by">Administered By</label>
                <select
                  className="form-select" id="sr-administered-by"
                  value={administeredBy} onChange={(event) => setAdministeredBy(event.target.value)}
                >
                  {nurseChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-next-review">Next Review</label>
                <input
                  type="time" className="form-control" id="sr-next-review"
                  value={nextReview} onChange={(event) => setNextReview(event.target.value)}
                />
                <span className="fs-12 text-muted">
                  {durationText(Math.max(0, minutesOf(nextReview) - minutesOf(givenAt)))} after the dose
                </span>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="sr-treatment-notes">Treatment Notes</label>
                <textarea
                  className="form-control" rows={2} id="sr-treatment-notes"
                  placeholder="Written to the treatment timeline"
                  value={treatmentNotes} onChange={(event) => setTreatmentNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="medAllergy"
                    checked={checkAllergies} onChange={(event) => setCheckAllergies(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="medAllergy">
                    Check the medication against the recorded allergies
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="medConsent"
                    /* No guardian consent to obtain on a staff visit. */
                    disabled={row.personType === 'Staff'}
                    checked={guardianConsent && row.personType !== 'Staff'}
                    onChange={(event) => setGuardianConsent(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="medConsent">
                    Guardian consent obtained before administering
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Notify Guardian */}
      <Modal
        open={active === 'notify' && row !== null}
        onClose={onClose}
        title="Notify Guardian"
        onSubmit={(event) => {
          event.preventDefault();
          onNotify({ method, contactedAt, calledBy, outcome, message });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-bell me-1" />Send Notification
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row} />
            <div className="border rounded p-3 mb-3">
              {row.guardian ? (
                guardianPairsOf(row).slice(0, 3).map((pair, index, all) => (
                  <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                ))
              ) : (
                <p className="fs-13 text-muted mb-0">
                  No guardian on the record — this is a staff visit.
                </p>
              )}
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Contact by</span>
              <div className="d-flex flex-wrap gap-3">
                {notifyMethodOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="notify-method"
                      id={`ntf-${option}`} checked={method === option}
                      onChange={() => setMethod(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`ntf-${option}`}>
                      <i
                        className={`ti ${option === 'SMS' ? 'ti-message' : option === 'Email' ? 'ti-mail' : 'ti-phone'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-contacted-at">Contacted At</label>
                <input
                  type="time" className="form-control" id="sr-contacted-at"
                  value={contactedAt} onChange={(event) => setContactedAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-called-by">Called By</label>
                <select
                  className="form-select" id="sr-called-by"
                  value={calledBy} onChange={(event) => setCalledBy(event.target.value)}
                >
                  {nurseChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-outcome">Outcome</label>
                <select
                  className="form-select" id="sr-outcome"
                  value={outcome} onChange={(event) => setOutcome(event.target.value)}
                >
                  {notifyOutcomeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="sr-message">Message</label>
                <textarea
                  className="form-control" rows={3} id="sr-message"
                  placeholder="What the guardian is told"
                  value={message} onChange={(event) => setMessage(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ntfRecord"
                    checked={recordContact} onChange={(event) => setRecordContact(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ntfRecord">
                    Record the contact on the visit audit history
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ntfSecond"
                    checked={copySecond} onChange={(event) => setCopySecond(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ntfSecond">
                    Copy the second emergency contact if there is no answer
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Discharge Patient */}
      <Modal
        open={active === 'discharge' && row !== null}
        onClose={onClose}
        title="Discharge Patient"
        onSubmit={(event) => {
          event.preventDefault();
          onDischarge({
            kind: dischargeKind, time: dischargeTime, by: dischargedBy, handedOverTo,
            finalTemperature, returnToSchool, notes: dischargeNotes, raiseExitPass,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-door-exit me-1" />Discharge Patient
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PatientStrip row={row}>
              <span className={dischargeBadge[dischargeOf(row)]}>{dischargeOf(row)}</span>
            </PatientStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Admitted" value={`${row.checkIn} · ${row.nurse}`} />
              <Row label="Complaint" value={row.complaint} />
              {/* Counted against the discharge time being entered. */}
              <Row label="Length of Stay" value={durationText(stayAtDischarge)} last />
            </div>

            {row.dischargedAt ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  This visit was already closed at {row.dischargedAt} · {row.outcome}.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Discharge to</span>
              <div className="d-flex flex-wrap gap-3">
                {dischargeKindOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="discharge-kind"
                      id={`dis-${option}`} checked={dischargeKind === option}
                      onChange={() => setDischargeKind(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`dis-${option}`}>
                      <i
                        className={`ti ${option === 'Sent Home' ? 'ti-home' : option === 'Referred Out' ? 'ti-medical-cross' : 'ti-school'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-discharge-time">Discharge Time</label>
                <input
                  type="time" className="form-control" id="sr-discharge-time"
                  value={dischargeTime} onChange={(event) => setDischargeTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-discharged-by">Discharged By</label>
                <select
                  className="form-select" id="sr-discharged-by"
                  value={dischargedBy} onChange={(event) => setDischargedBy(event.target.value)}
                >
                  {nurseChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="sr-final-temp">Final Temperature (°C)</label>
                <input
                  type="text" className="form-control" id="sr-final-temp"
                  placeholder="Recorded at discharge"
                  value={finalTemperature} onChange={(event) => setFinalTemperature(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="sr-handed-over">Handed Over To</label>
                <input
                  type="text" className="form-control" id="sr-handed-over"
                  /* Nobody to hand over to when the patient walks back to class. */
                  disabled={dischargeKind === 'To Class'}
                  value={dischargeKind === 'To Class' ? '' : handedOverTo}
                  onChange={(event) => setHandedOverTo(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="sr-return">Return to School</label>
                <select
                  className="form-select" id="sr-return"
                  value={returnToSchool} onChange={(event) => setReturnToSchool(event.target.value)}
                >
                  {returnToSchoolOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="sr-discharge-notes">Discharge Notes</label>
                <textarea
                  className="form-control" rows={2} id="sr-discharge-notes"
                  placeholder="Written to the visit record"
                  value={dischargeNotes} onChange={(event) => setDischargeNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="disPass"
                    disabled={dischargeKind === 'To Class'}
                    checked={raiseExitPass && dischargeKind !== 'To Class'}
                    onChange={(event) => setRaiseExitPass(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="disPass">
                    Raise a student exit pass for the gate
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="disTeacher"
                    checked={updateTeacher} onChange={(event) => setUpdateTeacher(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="disTeacher">
                    Update the class teacher and the attendance register
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
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('update')}>
              <i className="ti ti-edit me-1" />Update Record
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-stethoscope me-1" />Open Medical Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.patient}  •  {row.group}  •  {row.date}
            </p>

            <PatientStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-clock', tint: 'info', label: 'Check-In', value: row.checkIn },
                { icon: 'ti ti-bed', tint: 'warning', label: 'Stay', value: durationText(stayOf(row)) },
                { icon: 'ti ti-stethoscope', tint: 'primary', label: 'Treatment', value: treatmentOf(row) },
                { icon: 'ti ti-door-exit', tint: 'success', label: 'Discharge', value: dischargeOf(row) },
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
                <h6 className="fs-13 mb-2">Vital Signs</h6>
                <div className="border rounded p-3">
                  {vitalsPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Guardian Notification</h6>
                <div className="border rounded p-3">
                  {row.guardian ? (
                    guardianPairsOf(row).map((pair, index, all) => (
                      <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                    ))
                  ) : (
                    <p className="fs-13 text-muted mb-0">
                      Not required — this is a staff visit.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Visit Timeline</h6>
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

            <h6 className="fs-13 mb-2 mt-3">Internal Medical Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default SickRoomModals;
