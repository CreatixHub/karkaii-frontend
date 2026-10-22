import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Allocation } from '../data/allocations.data';
import {
  allocateToOptions,
  approverOptions,
  assetChoices,
  assetLineOf,
  assigneeChoices,
  categoryTint,
  conditionOptions,
  conditionTint,
  damageTypeOptions,
  daysBetween,
  departmentOptions,
  detailPairsOf,
  dueLabelOf,
  expectedLabelOf,
  heldLabelOf,
  liabilityOptions,
  locationOptions,
  newLocationOptions,
  placeOf,
  receivedByOptions,
  returnToOptions,
  severityOptions,
  statusBadge,
  statusOf,
  transferReasonOptions,
  transferToOptions,
  unitLineOf,
  viewApprovalPairsOf,
} from '../data/allocations.data';

export type AllocationModalId =
  | 'allocate' | 'edit' | 'return' | 'transfer' | 'damage' | 'view';

export interface AllocationDraft {
  target: string;
  asset: string;
  units: string;
  assignee: string;
  department: string;
  location: string;
  spot: string;
  allocatedDate: string;
  expectedReturn: string;
  condition: string;
  approvedBy: string;
  requestRef: string;
  notes: string;
  handover: boolean;
  remind: boolean;
}

export const emptyDraft: AllocationDraft = {
  target: 'Staff', asset: '', units: '1', assignee: assigneeChoices[0],
  department: departmentOptions[0], location: locationOptions[0], spot: '',
  allocatedDate: '03-08-2026', expectedReturn: '31-03-2027', condition: 'Excellent',
  approvedBy: approverOptions[0], requestRef: '', notes: '', handover: true, remind: true,
};

/** "12 Apr 2023" → "12-04-2023", which is what the date inputs take. */
const toInputDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? '' : `${day.padStart(2, '0')}-${String(index + 1).padStart(2, '0')}-${year}`;
};

/** "12-04-2023" → "12 Apr 2023", the way a row prints a date. */
export const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

export const draftOf = (row: Allocation): AllocationDraft => ({
  target: row.assignee.type,
  asset: assetChoices.find((choice) => choice.endsWith(row.assetId)) ?? '',
  units: String(row.units),
  assignee: assigneeChoices.find((choice) => choice.startsWith(row.assignee.name)) ?? assigneeChoices[0],
  department: row.department,
  location: locationOptions.find((option) => option === row.location) ?? locationOptions[0],
  spot: row.spot,
  allocatedDate: toInputDate(row.allocatedOn),
  expectedReturn: toInputDate(row.expectedReturn),
  condition: row.condition,
  approvedBy: approverOptions.find((option) => option === row.approvedBy) ?? approverOptions[0],
  requestRef: row.requestRef,
  notes: row.notes,
  handover: true,
  remind: true,
});

export interface ReturnPayload {
  condition: string;
  returnDate: string;
  receivedBy: string;
  units: string;
  returnTo: string;
  remarks: string;
}

export interface TransferPayload {
  to: string;
  department: string;
  location: string;
  effective: string;
  condition: string;
  reason: string;
}

export interface DamagePayload {
  type: string;
  severity: string;
  reportedOn: string;
  reportedBy: string;
  estimate: string;
  liability: string;
  description: string;
}

export interface AllocationModalsProps {
  active: AllocationModalId | null;
  row: Allocation | null;
  onClose: () => void;
  onAllocate: (draft: AllocationDraft) => void;
  onUpdate: (draft: AllocationDraft) => void;
  onReturn: (payload: ReturnPayload) => void;
  onTransfer: (payload: TransferPayload) => void;
  onDamage: (payload: DamagePayload) => void;
  onOpen: (modal: AllocationModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/** The asset strip the action dialogs open with. */
const AssetStrip = ({ row, children }: { row: Allocation; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span
      className={`avatar avatar-md bg-${categoryTint[row.category]}-transparent text-${categoryTint[row.category]} rounded flex-shrink-0`}
    >
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.assetName}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.assetId}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/** The assignee strip, which carries a photo or an icon. */
const AssigneeStrip = ({ row }: { row: Allocation }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    {row.assignee.avatar ? (
      <span className="avatar avatar-md rounded flex-shrink-0">
        <ImageWithBasePath src={row.assignee.avatar} className="rounded" alt={row.assignee.name} />
      </span>
    ) : (
      <span
        className={`avatar avatar-md bg-${row.assignee.tint ?? 'primary'}-transparent text-${row.assignee.tint ?? 'primary'} rounded flex-shrink-0`}
      >
        <i className={row.assignee.icon ?? 'ti ti-user'} />
      </span>
    )}
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.assignee.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">
        {row.id} · {row.assetName}
      </span>
    </div>
    <span className={statusBadge[statusOf(row)]}>{dueLabelOf(row)}</span>
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: AllocationDraft;
  onField: (field: keyof AllocationDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'allocate' | 'edit';
}

const AllocationForm = ({ draft, onField, suffix, mode }: FormProps) => (
  <>
    {mode === 'allocate' ? (
      <div className="mb-3">
        <span className="form-label d-block">Allocate to</span>
        <div className="d-flex flex-wrap gap-3">
          {allocateToOptions.map((option) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input" type="radio" name="allocate-target"
                id={`alc-${option}${suffix}`} checked={draft.target === option}
                onChange={() => onField('target', option)}
              />
              <label className="form-check-label fs-13" htmlFor={`alc-${option}${suffix}`}>
                <i
                  className={`ti ${option === 'Student' ? 'ti-school' : option === 'Department' ? 'ti-building' : option === 'Classroom' ? 'ti-door' : 'ti-user'} me-1`}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    ) : null}

    <div className="row">
      <div className="col-md-8"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-asset${suffix}`}>Asset</label>
        <select
          className="form-select" id={`alc-asset${suffix}`}
          value={draft.asset} onChange={(event) => onField('asset', event.target.value)}
        >
          <option value="">Select asset</option>
          {assetChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-units${suffix}`}>Units to Allocate</label>
        <input
          type="number" className="form-control" id={`alc-units${suffix}`} min={1}
          value={draft.units} onChange={(event) => onField('units', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Assignee</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-assignee${suffix}`}>Assignee</label>
        <select
          className="form-select" id={`alc-assignee${suffix}`}
          value={draft.assignee} onChange={(event) => onField('assignee', event.target.value)}
        >
          {assigneeChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-department${suffix}`}>Department / Class</label>
        <select
          className="form-select" id={`alc-department${suffix}`}
          value={draft.department} onChange={(event) => onField('department', event.target.value)}
        >
          {departmentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-location${suffix}`}>Location</label>
        <select
          className="form-select" id={`alc-location${suffix}`}
          value={draft.location} onChange={(event) => onField('location', event.target.value)}
        >
          {locationOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-spot${suffix}`}>Room / Store</label>
        <input
          type="text" className="form-control" id={`alc-spot${suffix}`} placeholder="e.g. Room 204"
          value={draft.spot} onChange={(event) => onField('spot', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Dates &amp; Condition</h6>
    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-date${suffix}`}>Allocated Date</label>
        <DateField
          id={`alc-date${suffix}`} value={draft.allocatedDate}
          onChange={(next) => onField('allocatedDate', next)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-return${suffix}`}>Expected Return</label>
        <DateField
          id={`alc-return${suffix}`} value={draft.expectedReturn}
          onChange={(next) => onField('expectedReturn', next)}
        />
        <span className="fs-12 text-muted">Leave blank for a permanent allocation</span>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-condition${suffix}`}>Condition at Issue</label>
        <select
          className="form-select" id={`alc-condition${suffix}`}
          value={draft.condition} onChange={(event) => onField('condition', event.target.value)}
        >
          {conditionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-approver${suffix}`}>Approved By</label>
        <select
          className="form-select" id={`alc-approver${suffix}`}
          value={draft.approvedBy} onChange={(event) => onField('approvedBy', event.target.value)}
        >
          {approverOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-ref${suffix}`}>Request Reference</label>
        <input
          type="text" className="form-control" id={`alc-ref${suffix}`} placeholder="e.g. REQ-2026-0301"
          value={draft.requestRef} onChange={(event) => onField('requestRef', event.target.value)}
        />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`alc-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`alc-notes${suffix}`}
          placeholder="Visible to the estates office only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        {mode === 'allocate' ? (
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`alcHandover${suffix}`}
              checked={draft.handover} onChange={(event) => onField('handover', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`alcHandover${suffix}`}>
              Generate a handover form for signature
            </label>
          </div>
        ) : null}
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`alcRemind${suffix}`}
            checked={draft.remind} onChange={(event) => onField('remind', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`alcRemind${suffix}`}>
            {mode === 'allocate'
              ? 'Send a return reminder 7 days before the due date'
              : 'Notify the assignee and the guardian of the new date'}
          </label>
        </div>
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const AllocationModals = ({
  active, row, onClose, onAllocate, onUpdate, onReturn, onTransfer, onDamage,
  onOpen, onOpenPanel,
}: AllocationModalsProps) => {
  const [draft, setDraft] = useState<AllocationDraft>(emptyDraft);

  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnDate, setReturnDate] = useState('31-07-2026');
  const [receivedBy, setReceivedBy] = useState(receivedByOptions[0]);
  const [returnUnits, setReturnUnits] = useState('1');
  const [returnTo, setReturnTo] = useState(returnToOptions[0]);
  const [returnRemarks, setReturnRemarks] = useState('');
  const [setAvailable, setSetAvailable] = useState(true);
  const [clearOverdue, setClearOverdue] = useState(true);

  const [transferTo, setTransferTo] = useState(transferToOptions[0]);
  const [newDepartment, setNewDepartment] = useState<string>(departmentOptions[0]);
  const [newLocation, setNewLocation] = useState(newLocationOptions[0]);
  const [effective, setEffective] = useState('05-08-2026');
  const [transferCondition, setTransferCondition] = useState('Good');
  const [transferReason, setTransferReason] = useState(transferReasonOptions[0]);
  const [transferRemarks, setTransferRemarks] = useState('');
  const [closeCurrent, setCloseCurrent] = useState(true);
  const [dataWipe, setDataWipe] = useState(false);

  const [damageType, setDamageType] = useState(damageTypeOptions[0]);
  const [severity, setSeverity] = useState(severityOptions[0]);
  const [reportedOn, setReportedOn] = useState('31-07-2026');
  const [reportedBy, setReportedBy] = useState('');
  const [estimate, setEstimate] = useState('0.00');
  const [liability, setLiability] = useState(liabilityOptions[0]);
  const [description, setDescription] = useState('');
  const [openMaintenance, setOpenMaintenance] = useState(true);
  const [flagRetirement, setFlagRetirement] = useState(false);

  useEffect(() => {
    if (active === 'allocate') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'return') {
      setReturnCondition(row.condition);
      setReturnDate('31-07-2026');
      setReturnUnits(String(row.units));
      setReturnRemarks('');
    }
    if (active === 'transfer') {
      setNewDepartment(departmentOptions.find((option) => option !== row.department) ?? departmentOptions[0]);
      setTransferCondition(row.condition);
      setTransferRemarks('');
    }
    if (active === 'damage') {
      setDamageType(row.damage?.type ?? damageTypeOptions[0]);
      setSeverity(row.damage?.severity ?? severityOptions[0]);
      setReportedBy(`${row.assignee.name} · custodian`);
      setEstimate(row.damage ? row.damage.estimate.toFixed(2) : '0.00');
      setLiability(row.damage?.liability ?? liabilityOptions[0]);
      setDescription(row.damage ? row.conditionNote : '');
    }
  }, [active, row]);

  const field = (key: keyof AllocationDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The days held recount as the return date is changed. */
  const daysOnReturn = row ? Math.max(0, daysBetween(row.allocatedOn, toRowDate(returnDate))) : 0;

  const reportedByOptions = row
    ? [`${row.assignee.name} · custodian`, 'Estates Office', 'Department Head']
    : ['Estates Office', 'Department Head'];

  return (
    <>
      {/* Allocate Asset */}
      <Modal
        open={active === 'allocate'}
        onClose={onClose}
        title="Allocate Asset"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onAllocate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Allocate Asset</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Issue an asset to a person, department or classroom
        </p>
        <AllocationForm draft={draft} onField={field} suffix="" mode="allocate" />
      </Modal>

      {/* Edit Allocation */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Allocation"
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
              {row.id}  •  {row.assignee.name}  •  {dueLabelOf(row)}
            </p>
            {statusOf(row) === 'Overdue Return' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Extending the return date clears the overdue flag and cancels the escalation to the
                  class teacher.
                </span>
              </div>
            ) : null}
            <AllocationForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Return Asset */}
      <Modal
        open={active === 'return' && row !== null}
        onClose={onClose}
        title="Return Asset"
        onSubmit={(event) => {
          event.preventDefault();
          onReturn({
            condition: returnCondition, returnDate, receivedBy,
            units: returnUnits, returnTo, remarks: returnRemarks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-arrow-back-up me-1" />Confirm Return
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AssigneeStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Allocated On" value={row.allocatedOn} />
              <Row label="Expected Return" value={expectedLabelOf(row)} />
              {/* Recounted from the date being entered, not the template's fixed figure. */}
              <Row label="Days Held" value={`${daysOnReturn.toLocaleString('en-US')} days`} last />
            </div>

            {row.actualReturn ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  This allocation was already closed on {row.actualReturn}.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Condition on return</span>
              <div className="d-flex flex-wrap gap-3">
                {conditionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="return-condition"
                      id={`ret-${option}`} checked={returnCondition === option}
                      onChange={() => setReturnCondition(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`ret-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="return-date">Return Date</label>
                <DateField id="return-date" value={returnDate} onChange={setReturnDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="received-by">Received By</label>
                <select
                  className="form-select" id="received-by"
                  value={receivedBy} onChange={(event) => setReceivedBy(event.target.value)}
                >
                  {receivedByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="units-returned">Units Returned</label>
                <input
                  type="number" className="form-control" id="units-returned" min={1} max={row.units}
                  value={returnUnits} onChange={(event) => setReturnUnits(event.target.value)}
                />
                <span className="fs-12 text-muted">{unitLineOf(row)} out</span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="return-to">Return To</label>
                <select
                  className="form-select" id="return-to"
                  value={returnTo} onChange={(event) => setReturnTo(event.target.value)}
                >
                  {returnToOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="return-remarks">Return Remarks</label>
                <textarea
                  className="form-control" rows={2} id="return-remarks"
                  placeholder="Recorded on the allocation history"
                  value={returnRemarks} onChange={(event) => setReturnRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="retAvail"
                    checked={setAvailable} onChange={(event) => setSetAvailable(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="retAvail">
                    Set the asset status back to Available
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="retClear"
                    checked={clearOverdue} onChange={(event) => setClearOverdue(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="retClear">
                    Clear the overdue flag and close the escalation
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Transfer Allocation */}
      <Modal
        open={active === 'transfer' && row !== null}
        onClose={onClose}
        title="Transfer Asset"
        onSubmit={(event) => {
          event.preventDefault();
          onTransfer({
            to: transferTo, department: newDepartment, location: newLocation,
            effective, condition: transferCondition, reason: transferReason,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-transfer me-1" />Transfer Asset
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                A transfer closes the current allocation and opens a new one against the receiving
                assignee.
              </span>
            </div>
            <AssetStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Current Assignee" value={row.assignee.name} />
              <Row label="Current Department" value={row.department} />
              <Row label="Held At" value={placeOf(row)} last />
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-to">Transfer To</label>
                <select
                  className="form-select" id="transfer-to"
                  value={transferTo} onChange={(event) => setTransferTo(event.target.value)}
                >
                  {transferToOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-department">New Department</label>
                <select
                  className="form-select" id="new-department"
                  value={newDepartment} onChange={(event) => setNewDepartment(event.target.value)}
                >
                  {departmentOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-location-al">New Location</label>
                <select
                  className="form-select" id="new-location-al"
                  value={newLocation} onChange={(event) => setNewLocation(event.target.value)}
                >
                  {newLocationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from-al">Effective From</label>
                <DateField id="effective-from-al" value={effective} onChange={setEffective} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="condition-at-transfer">Condition at Transfer</label>
                <select
                  className="form-select" id="condition-at-transfer"
                  value={transferCondition} onChange={(event) => setTransferCondition(event.target.value)}
                >
                  {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-reason-al">Reason</label>
                <select
                  className="form-select" id="transfer-reason-al"
                  value={transferReason} onChange={(event) => setTransferReason(event.target.value)}
                >
                  {transferReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-remarks-al">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="transfer-remarks-al"
                  placeholder="Recorded on both allocation records"
                  value={transferRemarks} onChange={(event) => setTransferRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="tfClose"
                    checked={closeCurrent} onChange={(event) => setCloseCurrent(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="tfClose">
                    Close the current allocation on the effective date
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="tfWipe"
                    checked={dataWipe} onChange={(event) => setDataWipe(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="tfWipe">
                    Require a data wipe before handover
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Report Damaged Asset */}
      <Modal
        open={active === 'damage' && row !== null}
        onClose={onClose}
        title="Report Damaged Asset"
        onSubmit={(event) => {
          event.preventDefault();
          onDamage({
            type: damageType, severity, reportedOn, reportedBy, estimate, liability, description,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger">Report Damage</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Reporting damage sets the allocation to Damage Reported and opens a maintenance
                request.
              </span>
            </div>
            <AssetStrip row={row}>
              <span className={`badge badge-soft-${conditionTint[row.condition]}`}>{row.condition}</span>
            </AssetStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Held By" value={row.assignee.name} />
              <Row label="Department" value={row.department} />
              <Row label="Held For" value={heldLabelOf(row)} last />
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="damage-type">Damage Type</label>
                <select
                  className="form-select" id="damage-type"
                  value={damageType} onChange={(event) => setDamageType(event.target.value)}
                >
                  {damageTypeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="severity">Severity</label>
                <select
                  className="form-select" id="severity"
                  value={severity} onChange={(event) => setSeverity(event.target.value)}
                >
                  {severityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reported-on">Reported On</label>
                <DateField id="reported-on" value={reportedOn} onChange={setReportedOn} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reported-by">Reported By</label>
                <select
                  className="form-select" id="reported-by"
                  value={reportedBy} onChange={(event) => setReportedBy(event.target.value)}
                >
                  {reportedByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="repair-estimate">Repair Estimate</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="repair-estimate" min={0} step="0.01"
                    value={estimate} onChange={(event) => setEstimate(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="liability">Liability</label>
                <select
                  className="form-select" id="liability"
                  value={liability} onChange={(event) => setLiability(event.target.value)}
                >
                  {liabilityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="damage-description">Damage Description</label>
                <textarea
                  className="form-control" rows={2} id="damage-description"
                  placeholder="Recorded on the asset condition history"
                  value={description} onChange={(event) => setDescription(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="photo-evidence">Photo Evidence</label>
                <input type="file" className="form-control" id="photo-evidence" />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dmMaint"
                    checked={openMaintenance} onChange={(event) => setOpenMaintenance(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dmMaint">
                    Open a maintenance request for the estates team
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dmRetire"
                    checked={flagRetirement} onChange={(event) => setFlagRetirement(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dmRetire">
                    Flag the asset for retirement review
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Allocation */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Allocation'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('transfer')}>
              <i className="ti ti-transfer me-1" />Transfer
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-clipboard-list me-1" />Open Allocation Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.assetName}  •  {row.assetId}  •  allocated {row.allocatedOn}
            </p>

            <AssigneeStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: row.icon, tint: categoryTint[row.category], label: 'Category', value: row.category },
                { icon: 'ti ti-door', tint: 'info', label: 'Location', value: row.spot },
                { icon: 'ti ti-calendar-event', tint: 'primary', label: 'Held For', value: heldLabelOf(row) },
                { icon: 'ti ti-clipboard-check', tint: conditionTint[row.condition], label: 'Condition', value: row.condition },
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
                <h6 className="fs-13 mb-2">Allocation Detail</h6>
                <div className="border rounded p-3">
                  {detailPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Approval</h6>
                <div className="border rounded p-3">
                  {viewApprovalPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Allocation Timeline</h6>
            {row.history.map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-clipboard-list" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                </div>
              </div>
            ))}
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
              <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                <i className="ti ti-clipboard-check" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Condition verified — {row.condition}</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  {row.lastVerified} · annual verification
                </span>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Internal Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
            <p className="fs-12 text-muted mb-0 mt-2">{assetLineOf(row)}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AllocationModals;
