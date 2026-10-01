import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { StaffEntry } from '../data/staffEntries.data';
import {
  GRACE_MINUTES,
  REGISTER_TIME,
  approverOptions,
  attendancePairsOf,
  checkInLabelOf,
  checkInMethodOptions,
  departmentBadge,
  departmentOptions,
  durationLabel,
  entryPairsOf,
  exitVerificationOptions,
  gateOptions,
  lateReasonOptions,
  methodOptions,
  minutesOf,
  movementOptions,
  officerOptions,
  onSiteOf,
  overrideReasonOptions,
  overrideScopeOptions,
  pastShiftStartOf,
  shiftBadge,
  shiftChoices,
  shiftLabelOf,
  shiftWindowOf,
  sinceShiftEndOf,
  staffChoices,
  statusBadge,
  statusOf,
  timelineOf,
  zoneOptions,
} from '../data/staffEntries.data';

export type StaffModalId = 'manual' | 'edit' | 'checkin' | 'checkout' | 'override' | 'view';

export interface StaffDraft {
  movement: string;
  staff: string;
  staffId: string;
  department: string;
  designation: string;
  shift: string;
  gate: string;
  entryDate: string;
  checkIn: string;
  checkOut: string;
  method: string;
  officer: string;
  vehicle: string;
  notes: string;
  linkGate: boolean;
  postAttendance: boolean;
}

export const emptyDraft: StaffDraft = {
  movement: movementOptions[0], staff: '', staffId: '', department: departmentOptions[0],
  designation: '', shift: shiftChoices[1].label, gate: gateOptions[0],
  entryDate: '31-07-2026', checkIn: '08:30', checkOut: '17:00',
  method: methodOptions[0], officer: officerOptions[0], vehicle: '', notes: '',
  linkGate: true, postAttendance: true,
};

export const draftOf = (row: StaffEntry): StaffDraft => ({
  movement: row.checkOut ? movementOptions[2] : movementOptions[0],
  staff: staffChoices.find((choice) => choice.startsWith(row.name)) ?? '',
  staffId: row.staffId,
  department: row.department,
  designation: row.designation,
  shift: shiftChoices.find((choice) => choice.shift === row.shift)?.label ?? shiftChoices[1].label,
  gate: row.gate,
  entryDate: '31-07-2026',
  checkIn: row.checkIn || row.shiftStart,
  checkOut: row.checkOut || row.shiftEnd,
  method: methodOptions.find((option) => option === row.verification) ?? methodOptions[0],
  officer: officerOptions.find((option) => option === row.officer) ?? officerOptions[0],
  vehicle: row.vehicle,
  notes: row.notes,
  linkGate: Boolean(row.gateRegister),
  postAttendance: true,
});

export interface CheckInPayload {
  method: string;
  time: string;
  gate: string;
  officer: string;
  lateReason: string;
  remarks: string;
  flagLate: boolean;
}

export interface CheckOutPayload {
  verification: string;
  date: string;
  time: string;
  gate: string;
  approvedBy: string;
  evidence: string;
  remarks: string;
}

export interface OverridePayload {
  scope: string;
  reason: string;
  authorisedBy: string;
  officer: string;
  validUntil: string;
  zones: string;
  remarks: string;
  raiseCard: boolean;
}

export interface StaffEntryModalsProps {
  active: StaffModalId | null;
  row: StaffEntry | null;
  onClose: () => void;
  onRecord: (draft: StaffDraft) => void;
  onUpdate: (draft: StaffDraft) => void;
  onCheckIn: (payload: CheckInPayload) => void;
  onCheckOut: (payload: CheckOutPayload) => void;
  onOverride: (payload: OverridePayload) => void;
  onOpen: (modal: StaffModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const StaffStrip = ({ row, children }: { row: StaffEntry; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    {row.avatar ? (
      <span className="avatar avatar-md rounded flex-shrink-0">
        <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
      </span>
    ) : (
      <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
        <i className={row.icon} />
      </span>
    )}
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.staffId}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: StaffDraft;
  onField: (field: keyof StaffDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'manual' | 'edit';
}

const StaffForm = ({ draft, onField, suffix, mode }: FormProps) => {
  const chosen = shiftChoices.find((choice) => choice.label === draft.shift) ?? shiftChoices[1];
  /** The punctuality the entered check-in produces against the chosen shift. */
  const variance = minutesOf(chosen.start) - minutesOf(draft.checkIn);
  const recordsIn = draft.movement !== 'Check-Out';
  const recordsOut = draft.movement !== 'Check-In';

  return (
    <>
      {mode === 'manual' ? (
        <div className="mb-3">
          <span className="form-label d-block">Movement being recorded</span>
          <div className="d-flex flex-wrap gap-3">
            {movementOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="movement"
                  id={`mse-${option}${suffix}`} checked={draft.movement === option}
                  onChange={() => onField('movement', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`mse-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Check-In' ? 'ti-door-enter' : option === 'Check-Out' ? 'ti-door-exit' : 'ti-clock'} me-1`}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-staff${suffix}`}>Staff Member</label>
          <select
            className="form-select" id={`se-staff${suffix}`}
            value={draft.staff} onChange={(event) => onField('staff', event.target.value)}
          >
            <option value="">Select staff</option>
            {staffChoices.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-id${suffix}`}>Staff ID</label>
          <input
            type="text" className="form-control" id={`se-id${suffix}`} placeholder="e.g. EMP-2019-014"
            value={draft.staffId} onChange={(event) => onField('staffId', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-dept${suffix}`}>Department</label>
          <select
            className="form-select" id={`se-dept${suffix}`}
            value={draft.department} onChange={(event) => onField('department', event.target.value)}
          >
            {departmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-designation${suffix}`}>Designation</label>
          <input
            type="text" className="form-control" id={`se-designation${suffix}`}
            placeholder="e.g. Assistant Warden"
            value={draft.designation} onChange={(event) => onField('designation', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Shift &amp; Gate</h6>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-shift${suffix}`}>Shift</label>
          <select
            className="form-select" id={`se-shift${suffix}`}
            value={draft.shift}
            onChange={(event) => {
              const next = shiftChoices.find((choice) => choice.label === event.target.value);
              onField('shift', event.target.value);
              // The window comes with the shift, so the times cannot drift off it.
              if (next) {
                onField('checkIn', next.start);
                onField('checkOut', next.end);
              }
            }}
          >
            {shiftChoices.map((choice) => <option key={choice.label}>{choice.label}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-gate${suffix}`}>Gate</label>
          <select
            className="form-select" id={`se-gate${suffix}`}
            value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
          >
            {gateOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`se-date${suffix}`}>Entry Date</label>
          <DateField
            id={`se-date${suffix}`} value={draft.entryDate}
            onChange={(next) => onField('entryDate', next)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`se-in${suffix}`}>Check-In Time</label>
          <input
            type="time" className="form-control" id={`se-in${suffix}`} disabled={!recordsIn}
            value={draft.checkIn} onChange={(event) => onField('checkIn', event.target.value)}
          />
          {recordsIn ? (
            <span className={`fs-12 ${variance < -GRACE_MINUTES ? 'text-warning' : 'text-muted'}`}>
              {variance === 0 ? 'On time'
                : variance > 0 ? `${durationLabel(variance)} before the shift start`
                  : `${durationLabel(-variance)} after the shift start`}
            </span>
          ) : null}
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`se-out${suffix}`}>Check-Out Time</label>
          <input
            type="time" className="form-control" id={`se-out${suffix}`} disabled={!recordsOut}
            value={draft.checkOut} onChange={(event) => onField('checkOut', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Verification</h6>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-method${suffix}`}>Verification Method</label>
          <select
            className="form-select" id={`se-method${suffix}`}
            value={draft.method} onChange={(event) => onField('method', event.target.value)}
          >
            {methodOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-officer${suffix}`}>Gate Officer</label>
          <select
            className="form-select" id={`se-officer${suffix}`}
            value={draft.officer} onChange={(event) => onField('officer', event.target.value)}
          >
            {officerOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-vehicle${suffix}`}>Vehicle Registration</label>
          <input
            type="text" className="form-control" id={`se-vehicle${suffix}`}
            placeholder="Leave blank if on foot"
            value={draft.vehicle} onChange={(event) => onField('vehicle', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`se-doc${suffix}`}>Supporting Document</label>
          <input type="file" className="form-control" id={`se-doc${suffix}`} />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`se-notes${suffix}`}>Security Notes</label>
          <textarea
            className="form-control" rows={2} id={`se-notes${suffix}`}
            placeholder="Visible to the security desk only"
            value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
          />
        </div></div>
        <div className="col-md-12">
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`seGate${suffix}`}
              checked={draft.linkGate} onChange={(event) => onField('linkGate', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`seGate${suffix}`}>
              {mode === 'manual'
                ? 'Create a matching entry on the gate register'
                : 'Clear the missing check-out flag once the time is saved'}
            </label>
          </div>
          {mode === 'manual' ? (
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`seAttend${suffix}`}
                checked={draft.postAttendance}
                onChange={(event) => onField('postAttendance', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`seAttend${suffix}`}>
                Post the movement to the staff attendance register
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const StaffEntryModals = ({
  active, row, onClose, onRecord, onUpdate, onCheckIn, onCheckOut, onOverride,
  onOpen, onOpenPanel,
}: StaffEntryModalsProps) => {
  const [draft, setDraft] = useState<StaffDraft>(emptyDraft);

  const [inMethod, setInMethod] = useState(checkInMethodOptions[0]);
  const [inTime, setInTime] = useState(REGISTER_TIME);
  const [inGate, setInGate] = useState(gateOptions[0]);
  const [inOfficer, setInOfficer] = useState(officerOptions[0]);
  const [lateReason, setLateReason] = useState(lateReasonOptions[0]);
  const [inRemarks, setInRemarks] = useState('');
  const [flagLate, setFlagLate] = useState(true);
  const [notifyHead, setNotifyHead] = useState(true);

  const [exitVerification, setExitVerification] = useState(exitVerificationOptions[0]);
  const [outDate, setOutDate] = useState('31-07-2026');
  const [outTime, setOutTime] = useState(REGISTER_TIME);
  const [outGate, setOutGate] = useState(gateOptions[0]);
  const [approvedBy, setApprovedBy] = useState(approverOptions[0]);
  const [evidence, setEvidence] = useState('');
  const [closureRemarks, setClosureRemarks] = useState('');
  const [clearMissing, setClearMissing] = useState(true);
  const [raiseFault, setRaiseFault] = useState(false);

  const [scope, setScope] = useState(overrideScopeOptions[1]);
  const [overrideReason, setOverrideReason] = useState(overrideReasonOptions[0]);
  const [authorisedBy, setAuthorisedBy] = useState(approverOptions[0]);
  const [overrideOfficer, setOverrideOfficer] = useState(officerOptions[0]);
  const [validUntil, setValidUntil] = useState('17:00');
  const [zones, setZones] = useState(zoneOptions[0]);
  const [overrideRemarks, setOverrideRemarks] = useState('');
  const [raiseCard, setRaiseCard] = useState(true);
  const [writeAudit, setWriteAudit] = useState(true);

  useEffect(() => {
    if (active === 'manual') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'checkin') {
      setInMethod(checkInMethodOptions[0]);
      setInTime(REGISTER_TIME);
      setInGate(row.gate);
      setInRemarks('');
    }
    if (active === 'checkout') {
      setExitVerification(exitVerificationOptions[0]);
      setOutTime(sinceShiftEndOf(row) > 0 ? row.shiftEnd : REGISTER_TIME);
      setOutGate(row.gate);
      setEvidence(`${row.camera} · exit clip`);
      setClosureRemarks('');
    }
    if (active === 'override') {
      setScope(overrideScopeOptions[1]);
      setOverrideReason(overrideReasonOptions[0]);
      setOverrideOfficer(officerOptions.find((option) => option === row.officer) ?? officerOptions[0]);
      setValidUntil(row.shiftEnd);
      setOverrideRemarks('');
    }
  }, [active, row]);

  const field = (key: keyof StaffDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** Recounted from the time being entered, not the template's fixed figures. */
  const lateOnCheckIn = row
    ? Math.max(0, minutesOf(inTime) - minutesOf(row.shiftStart))
    : 0;
  const onSiteAtExit = row && row.checkIn
    ? (() => {
      const span = minutesOf(outTime) - minutesOf(row.checkIn);
      return span >= 0 ? span : span + 1440;
    })()
    : 0;

  return (
    <>
      {/* Manual Staff Entry */}
      <Modal
        open={active === 'manual'}
        onClose={onClose}
        title="Manual Staff Entry"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onRecord(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record Entry</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Record an entry the reader could not capture</p>
        <StaffForm draft={draft} onField={field} suffix="" mode="manual" />
      </Modal>

      {/* Edit Entry */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Entry"
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
              {row.id}  •  {row.name}  •  {statusOf(row).toLowerCase()}
            </p>
            {statusOf(row) === 'Missing Check-Out' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Setting a check-out time closes the entry and clears the missing check-out flag
                  against this shift.
                </span>
              </div>
            ) : null}
            <StaffForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Check-In */}
      <Modal
        open={active === 'checkin' && row !== null}
        onClose={onClose}
        title="Check-In"
        onSubmit={(event) => {
          event.preventDefault();
          onCheckIn({
            method: inMethod, time: inTime, gate: inGate, officer: inOfficer,
            lateReason, remarks: inRemarks, flagLate,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-door-enter me-1" />Confirm Check-In
            </button>
          </>
        }
      >
        {row ? (
          <>
            <StaffStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Shift" value={shiftLabelOf(row)} />
              <Row label="Gate" value={`${row.gate} · ${row.lane.split('·').pop()?.trim()}`} />
              {/* Counted from the shift start to now, not a fixed figure. */}
              <Row
                label="Past Shift Start"
                value={pastShiftStartOf(row) > 0 ? durationLabel(pastShiftStartOf(row)) : 'Not yet due'}
                last
              />
            </div>

            {row.checkIn ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  This entry was already checked in at {checkInLabelOf(row)}.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Verification method</span>
              <div className="d-flex flex-wrap gap-3">
                {checkInMethodOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="check-in-method"
                      id={`sci-${option}`} checked={inMethod === option}
                      onChange={() => setInMethod(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`sci-${option}`}>
                      <i
                        className={`ti ${option === 'Biometric' ? 'ti-fingerprint' : option === 'Manual' ? 'ti-shield-check' : 'ti-id-badge-2'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="staff-check-in-time">Check-In Time</label>
                <input
                  type="time" className="form-control" id="staff-check-in-time"
                  value={inTime} onChange={(event) => setInTime(event.target.value)}
                />
                <span className={`fs-12 ${lateOnCheckIn > GRACE_MINUTES ? 'text-warning' : 'text-muted'}`}>
                  {lateOnCheckIn > 0
                    ? `${durationLabel(lateOnCheckIn)} after the ${row.shiftStart} start`
                    : `Before the ${row.shiftStart} start`}
                </span>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="staff-check-in-gate">Gate</label>
                <select
                  className="form-select" id="staff-check-in-gate"
                  value={inGate} onChange={(event) => setInGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="staff-check-in-officer">Gate Officer</label>
                <select
                  className="form-select" id="staff-check-in-officer"
                  value={inOfficer} onChange={(event) => setInOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              {lateOnCheckIn > GRACE_MINUTES ? (
                <div className="col-md-12"><div className="mb-3">
                  <label className="form-label" htmlFor="late-reason">Late Reason</label>
                  <select
                    className="form-select" id="late-reason"
                    value={lateReason} onChange={(event) => setLateReason(event.target.value)}
                  >
                    {lateReasonOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div></div>
              ) : null}
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="staff-gate-remarks">Gate Remarks</label>
                <textarea
                  className="form-control" rows={2} id="staff-gate-remarks"
                  placeholder="Recorded on the staff register"
                  value={inRemarks} onChange={(event) => setInRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="sciLate"
                    checked={flagLate} onChange={(event) => setFlagLate(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="sciLate">
                    Flag the arrival as late on the attendance register
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="sciNotify"
                    checked={notifyHead} onChange={(event) => setNotifyHead(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="sciNotify">
                    Notify the department head of the late arrival
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Check-Out */}
      <Modal
        open={active === 'checkout' && row !== null}
        onClose={onClose}
        title="Check-Out"
        onSubmit={(event) => {
          event.preventDefault();
          onCheckOut({
            verification: exitVerification, date: outDate, time: outTime,
            gate: outGate, approvedBy, evidence, remarks: closureRemarks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-door-exit me-1" />Confirm Check-Out
            </button>
          </>
        }
      >
        {row ? (
          <>
            {sinceShiftEndOf(row) > 0 && !row.checkOut ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This {row.shift.toLowerCase()} shift ended at {row.shiftEnd} with no exit scan.
                  Closing it manually needs a supervisor sign off.
                </span>
              </div>
            ) : null}
            <StaffStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Checked In" value={checkInLabelOf(row)} />
              <Row label="Shift Window" value={`${row.shift} · ${shiftWindowOf(row)}`} />
              <Row
                label={sinceShiftEndOf(row) > 0 ? 'Since Shift End' : 'On Site'}
                value={durationLabel(sinceShiftEndOf(row) > 0 ? sinceShiftEndOf(row) : onSiteOf(row))}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Exit verification</span>
              <div className="d-flex flex-wrap gap-3">
                {exitVerificationOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="exit-verification"
                      id={`sco-${option}`} checked={exitVerification === option}
                      onChange={() => setExitVerification(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`sco-${option}`}>
                      <i
                        className={`ti ${option === 'CCTV' ? 'ti-camera' : option === 'Register' ? 'ti-file-text' : 'ti-id-badge-2'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="staff-check-out-date">Check-Out Date</label>
                <DateField id="staff-check-out-date" value={outDate} onChange={setOutDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="staff-check-out-time">Check-Out Time</label>
                <input
                  type="time" className="form-control" id="staff-check-out-time"
                  value={outTime} onChange={(event) => setOutTime(event.target.value)}
                />
                <span className="fs-12 text-muted">On site {durationLabel(onSiteAtExit)}</span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="staff-exit-gate">Exit Gate</label>
                <select
                  className="form-select" id="staff-exit-gate"
                  value={outGate} onChange={(event) => setOutGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="staff-approved-by">Approved By</label>
                <select
                  className="form-select" id="staff-approved-by"
                  value={approvedBy} onChange={(event) => setApprovedBy(event.target.value)}
                >
                  {approverOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="evidence-reference">Evidence Reference</label>
                <input
                  type="text" className="form-control" id="evidence-reference"
                  value={evidence} onChange={(event) => setEvidence(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="closure-remarks">Closure Remarks</label>
                <textarea
                  className="form-control" rows={2} id="closure-remarks"
                  placeholder="Recorded on the staff register"
                  value={closureRemarks} onChange={(event) => setClosureRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="scoClear"
                    checked={clearMissing} onChange={(event) => setClearMissing(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="scoClear">
                    Clear the missing check-out flag for this shift
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="scoReader"
                    checked={raiseFault} onChange={(event) => setRaiseFault(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="scoReader">
                    Raise a reader fault ticket for the gate house
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Access Override */}
      <Modal
        open={active === 'override' && row !== null}
        onClose={onClose}
        title="Access Override"
        onSubmit={(event) => {
          event.preventDefault();
          onOverride({
            scope, reason: overrideReason, authorisedBy, officer: overrideOfficer,
            validUntil, zones, remarks: overrideRemarks, raiseCard,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-shield-check me-1" />Grant Override
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                An override bypasses the card reader and is written to the audit trail with the
                officer name.
              </span>
            </div>
            <StaffStrip row={row}>
              <span className={departmentBadge[row.department]}>{row.department}</span>
            </StaffStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Reader" value={row.override ? 'Rejected' : 'Working'} />
              <Row label="Gate" value={`${row.gate} · ${row.lane}`} />
              <Row label="Card" value={row.card} />
              <Row label="Ticket" value={row.overrideTicket || 'Not raised'} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Override scope</span>
              <div className="d-flex flex-wrap gap-3">
                {overrideScopeOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="override-scope"
                      id={`ovr-${option}`} checked={scope === option}
                      onChange={() => setScope(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`ovr-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="override-reason">Reason</label>
                <select
                  className="form-select" id="override-reason"
                  value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)}
                >
                  {overrideReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="authorised-by">Authorised By</label>
                <select
                  className="form-select" id="authorised-by"
                  value={authorisedBy} onChange={(event) => setAuthorisedBy(event.target.value)}
                >
                  {approverOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="override-officer">Gate Officer</label>
                <select
                  className="form-select" id="override-officer"
                  value={overrideOfficer} onChange={(event) => setOverrideOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="override-valid">Valid Until</label>
                <input
                  type="time" className="form-control" id="override-valid"
                  /* Only a single entry stops at a time; the wider scopes do not. */
                  disabled={scope === 'Until Reissue'}
                  value={scope === 'Until Reissue' ? '' : validUntil}
                  onChange={(event) => setValidUntil(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="access-zones">Access Zones</label>
                <select
                  className="form-select" id="access-zones"
                  value={zones} onChange={(event) => setZones(event.target.value)}
                >
                  {zoneOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="override-remarks">Override Remarks</label>
                <textarea
                  className="form-control" rows={2} id="override-remarks"
                  placeholder="Written to the audit trail"
                  value={overrideRemarks} onChange={(event) => setOverrideRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ovrCard"
                    checked={raiseCard} onChange={(event) => setRaiseCard(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ovrCard">
                    Raise a replacement card request with administration
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ovrAudit"
                    checked={writeAudit} onChange={(event) => setWriteAudit(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ovrAudit">
                    Write the override to the security audit trail
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Entry */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Staff entry'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('checkout')}>
              <i className="ti ti-door-exit me-1" />Check-Out
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-shield-check me-1" />Open Staff Entry Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.name}  •  {row.staffId}  •  31 Jul 2026
            </p>

            <StaffStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-door-enter', tint: 'success', label: 'Check-In', value: checkInLabelOf(row) },
                { icon: 'ti ti-clock', tint: 'warning', label: 'On Site', value: row.checkIn ? durationLabel(onSiteOf(row)) : '—' },
                { icon: 'ti ti-calendar-event', tint: 'info', label: 'Shift', value: shiftWindowOf(row) },
                { icon: 'ti ti-id-badge-2', tint: 'primary', label: 'Verified By', value: row.verification },
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
                <h6 className="fs-13 mb-2">Entry Detail</h6>
                <div className="border rounded p-3">
                  {entryPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Attendance This Month</h6>
                <div className="border rounded p-3">
                  {attendancePairsOf(row).slice(0, 4).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Entry &amp; Exit Timeline</h6>
            {timelineOf(row).map((entry) => (
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

            <h6 className="fs-13 mb-2 mt-3">Security Notes</h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={departmentBadge[row.department]}>{row.department}</span>
              <span className={shiftBadge[row.shift]}>{row.shift}</span>
              <span className="badge badge-soft-secondary">{row.verification}</span>
            </div>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default StaffEntryModals;
