import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { Asset } from '../data/assets.data';
import {
  accumulatedOf,
  approverOptions,
  assigneeOptions,
  assignmentPairsOf,
  bookValueOf,
  categoryOptions,
  compactOf,
  conditionOptions,
  conditionTint,
  departmentOptions,
  destinationOptions,
  disposalOptions,
  holderNameOf,
  holderOptions,
  isFullyDepreciated,
  locationOptions,
  maintenanceTypeOptions,
  methodOptions,
  modelLineOf,
  money,
  money2,
  newLocationOptions,
  placeOf,
  priorityOptions,
  providerOptions,
  retireReasonOptions,
  schedulePairsOf,
  statusBadge,
  transferReasonOptions,
  warrantyLabelOf,
  warrantyStateOf,
  warrantyUntilLabelOf,
  categoryTint,
} from '../data/assets.data';

export type AssetModalId =
  | 'add' | 'edit' | 'assign' | 'transfer' | 'maintenance' | 'retire' | 'view';

export interface AssetDraft {
  name: string;
  serial: string;
  category: string;
  department: string;
  condition: string;
  location: string;
  spot: string;
  purchaseDate: string;
  purchaseValue: string;
  usefulLife: string;
  method: string;
  vendor: string;
  poNumber: string;
  warrantyUntil: string;
  notes: string;
  /** Add: print a QR tag. Edit: rebuild the accumulated depreciation. */
  tag: boolean;
  ledger: boolean;
}

export const emptyDraft: AssetDraft = {
  name: '', serial: '', category: categoryOptions[0], department: departmentOptions[0],
  condition: 'Excellent', location: locationOptions[0], spot: '',
  purchaseDate: '01-04-2026', purchaseValue: '', usefulLife: '', method: methodOptions[0],
  vendor: '', poNumber: '', warrantyUntil: '31-03-2029', notes: '', tag: true, ledger: true,
};

/** "01 Apr 2023" → "01-04-2023", which is what the date inputs take. */
const toInputDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? value : `${day}-${String(index + 1).padStart(2, '0')}-${year}`;
};

export const draftOf = (row: Asset): AssetDraft => ({
  name: row.name,
  serial: row.serial,
  category: row.category,
  department: row.department,
  condition: row.condition,
  location: row.location,
  spot: row.spot,
  purchaseDate: toInputDate(row.purchaseDate),
  purchaseValue: row.purchaseValue.toFixed(2),
  usefulLife: String(row.usefulLife),
  method: methodOptions[0],
  vendor: row.vendor,
  poNumber: row.poNumber,
  warrantyUntil: toInputDate(row.warrantyUntil),
  notes: row.notes,
  tag: false,
  ledger: true,
});

export interface AssignPayload {
  target: 'Staff' | 'Department' | 'Room';
  assignee: string;
  units: string;
  issueDate: string;
  destination: string;
}

export interface TransferPayload {
  department: string;
  holder: string;
  location: string;
  effective: string;
  reason: string;
}

export interface MaintenancePayload {
  type: string;
  priority: string;
  scheduled: string;
  completion: string;
  provider: string;
  cost: string;
  setStatus: boolean;
}

export interface RetirePayload {
  reason: string;
  date: string;
  disposal: string;
  salvage: string;
  approver: string;
}

export interface AssetModalsProps {
  active: AssetModalId | null;
  row: Asset | null;
  onClose: () => void;
  onAdd: (draft: AssetDraft) => void;
  onUpdate: (draft: AssetDraft) => void;
  onAssign: (payload: AssignPayload) => void;
  onTransfer: (payload: TransferPayload) => void;
  onSchedule: (payload: MaintenancePayload) => void;
  onRetire: (payload: RetirePayload) => void;
  /** The View dialog hands off to Schedule Maintenance and to the panel. */
  onOpen: (modal: AssetModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/** The asset strip the action dialogs open with. */
const AssetStrip = ({ row, children }: { row: Asset; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span
      className={`avatar avatar-md bg-${categoryTint[row.category]}-transparent text-${categoryTint[row.category]} rounded flex-shrink-0`}
    >
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">
        {row.id} · {modelLineOf(row)}
      </span>
    </div>
    {children ?? <span className={statusBadge[row.status]}>{row.status}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: AssetDraft;
  onField: (field: keyof AssetDraft, value: string | boolean) => void;
  suffix: string;
  /** Edit adds the warning banner and swaps the last switch. */
  mode: 'add' | 'edit';
}

const AssetForm = ({ draft, onField, suffix, mode }: FormProps) => {
  const value = Number(draft.purchaseValue) || 0;
  const life = Number(draft.usefulLife) || 0;
  const annual = life > 0 && draft.method === 'Straight line' ? value / life : 0;

  return (
    <>
      {mode === 'edit' ? (
        <div className="alert alert-warning d-flex align-items-center mb-3">
          <i className="ti ti-alert-triangle me-2" />
          <span className="fs-13">
            Changing the purchase value or useful life rebuilds the depreciation schedule from the
            purchase date.
          </span>
        </div>
      ) : null}

      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`as-name${suffix}`}>Asset Name</label>
          <input
            type="text" className="form-control" id={`as-name${suffix}`}
            placeholder="e.g. Interactive Smart Board 75&quot;"
            value={draft.name} onChange={(event) => onField('name', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`as-serial${suffix}`}>Serial / Lot No.</label>
          <input
            type="text" className="form-control" id={`as-serial${suffix}`}
            placeholder="Printed on the asset tag"
            value={draft.serial} onChange={(event) => onField('serial', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`as-category${suffix}`}>Asset Category</label>
          <select
            className="form-select" id={`as-category${suffix}`}
            value={draft.category} onChange={(event) => onField('category', event.target.value)}
          >
            {categoryOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`as-department${suffix}`}>Department</label>
          <select
            className="form-select" id={`as-department${suffix}`}
            value={draft.department} onChange={(event) => onField('department', event.target.value)}
          >
            {departmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`as-condition${suffix}`}>Condition</label>
          <select
            className="form-select" id={`as-condition${suffix}`}
            value={draft.condition} onChange={(event) => onField('condition', event.target.value)}
          >
            {conditionOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`as-location${suffix}`}>Location</label>
          <select
            className="form-select" id={`as-location${suffix}`}
            value={draft.location} onChange={(event) => onField('location', event.target.value)}
          >
            {locationOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`as-spot${suffix}`}>Room / Bay</label>
          <input
            type="text" className="form-control" id={`as-spot${suffix}`} placeholder="e.g. Room 204"
            value={draft.spot} onChange={(event) => onField('spot', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Purchase &amp; Depreciation</h6>
      <div className="row">
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`as-purchased${suffix}`}>Purchase Date</label>
          <DateField
            id={`as-purchased${suffix}`} value={draft.purchaseDate}
            onChange={(next) => onField('purchaseDate', next)}
          />
        </div></div>
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`as-value${suffix}`}>Purchase Value</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number" className="form-control" id={`as-value${suffix}`} min={0} step="0.01"
              value={draft.purchaseValue} onChange={(event) => onField('purchaseValue', event.target.value)}
            />
          </div>
        </div></div>
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`as-life${suffix}`}>Useful Life</label>
          <div className="input-group">
            <input
              type="number" className="form-control" id={`as-life${suffix}`} min={1}
              value={draft.usefulLife} onChange={(event) => onField('usefulLife', event.target.value)}
            />
            <span className="input-group-text">yrs</span>
          </div>
        </div></div>
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`as-method${suffix}`}>Method</label>
          <select
            className="form-select" id={`as-method${suffix}`}
            value={draft.method} onChange={(event) => onField('method', event.target.value)}
          >
            {methodOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          {/* The value over the life — shown so the schedule cannot surprise anyone. */}
          <div className="border rounded p-2 d-flex align-items-center justify-content-between">
            <span className="fs-13 text-muted">Annual Depreciation</span>
            <span className="fs-13 fw-medium">
              {draft.method === 'Straight line' ? money2(annual) : 'Not on a straight line schedule'}
            </span>
          </div>
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Vendor &amp; Warranty</h6>
      <div className="row">
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`as-vendor${suffix}`}>Vendor</label>
          <input
            type="text" className="form-control" id={`as-vendor${suffix}`} placeholder="Supplier name"
            value={draft.vendor} onChange={(event) => onField('vendor', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`as-po${suffix}`}>PO Number</label>
          <input
            type="text" className="form-control" id={`as-po${suffix}`} placeholder="e.g. PO-2026-0231"
            value={draft.poNumber} onChange={(event) => onField('poNumber', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`as-warranty${suffix}`}>Warranty Until</label>
          <DateField
            id={`as-warranty${suffix}`} value={draft.warrantyUntil}
            onChange={(next) => onField('warrantyUntil', next)}
          />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`as-notes${suffix}`}>Internal Notes</label>
          <textarea
            className="form-control" rows={2} id={`as-notes${suffix}`}
            placeholder="Visible to the estates office only"
            value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
          />
        </div></div>
        <div className="col-md-12">
          {mode === 'add' ? (
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`asTag${suffix}`}
                checked={draft.tag} onChange={(event) => onField('tag', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`asTag${suffix}`}>
                Generate a QR asset tag for printing
              </label>
            </div>
          ) : null}
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`asLedger${suffix}`}
              checked={draft.ledger} onChange={(event) => onField('ledger', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`asLedger${suffix}`}>
              {mode === 'add'
                ? 'Post the purchase to the fixed asset ledger'
                : 'Recalculate the accumulated depreciation on save'}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const AssetModals = ({
  active, row, onClose, onAdd, onUpdate, onAssign, onTransfer, onSchedule, onRetire,
  onOpen, onOpenPanel,
}: AssetModalsProps) => {
  const [draft, setDraft] = useState<AssetDraft>(emptyDraft);

  const [target, setTarget] = useState<AssignPayload['target']>('Staff');
  const [assignee, setAssignee] = useState(assigneeOptions[0]);
  const [units, setUnits] = useState('1');
  const [issueDate, setIssueDate] = useState('01-08-2026');
  const [destination, setDestination] = useState(destinationOptions[0]);
  const [expectedReturn, setExpectedReturn] = useState('31-03-2027');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [handover, setHandover] = useState(true);
  const [notifyAssignee, setNotifyAssignee] = useState(true);

  const [toDepartment, setToDepartment] = useState<string>(departmentOptions[0]);
  const [newHolder, setNewHolder] = useState(holderOptions[0]);
  const [newLocation, setNewLocation] = useState(newLocationOptions[0]);
  const [effective, setEffective] = useState('05-08-2026');
  const [transferReason, setTransferReason] = useState(transferReasonOptions[0]);
  const [transferRemarks, setTransferRemarks] = useState('');
  const [moveCost, setMoveCost] = useState(true);
  const [dataWipe, setDataWipe] = useState(false);

  const [maintenanceType, setMaintenanceType] = useState(maintenanceTypeOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[0]);
  const [scheduled, setScheduled] = useState('03-08-2026');
  const [completion, setCompletion] = useState('05-08-2026');
  const [provider, setProvider] = useState(providerOptions[0]);
  const [cost, setCost] = useState('0.00');
  const [work, setWork] = useState('');
  const [setStatus, setSetStatus] = useState(true);
  const [recurring, setRecurring] = useState(false);

  const [retireReason, setRetireReason] = useState(retireReasonOptions[0]);
  const [retireDate, setRetireDate] = useState('15-08-2026');
  const [disposal, setDisposal] = useState(disposalOptions[0]);
  const [salvage, setSalvage] = useState('0.00');
  const [approver, setApprover] = useState(approverOptions[0]);
  const [retireNotes, setRetireNotes] = useState('');
  const [postWriteOff, setPostWriteOff] = useState(true);

  /** Every opening seeds from the row being acted on. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'assign') {
      setTarget(row.holder ? 'Staff' : 'Department');
      setUnits(String(row.units));
      setAssignRemarks('');
    }
    if (active === 'transfer') {
      setToDepartment(departmentOptions.find((option) => option !== row.department) ?? departmentOptions[0]);
      setTransferRemarks('');
    }
    if (active === 'maintenance') {
      setMaintenanceType(maintenanceTypeOptions[0]);
      setPriority(row.condition === 'Poor' ? 'Critical' : row.condition === 'Fair' ? 'High' : 'Normal');
      setProvider(warrantyStateOf(row) === 'Expired' ? providerOptions[0] : providerOptions[2]);
      setCost('0.00');
      setWork('');
      setSetStatus(row.status !== 'Under Maintenance');
    }
    if (active === 'retire') {
      setRetireReason(retireReasonOptions[isFullyDepreciated(row) ? 1 : 0]);
      setSalvage('0.00');
      setRetireNotes(row.notes);
    }
  }, [active, row]);

  const field = (key: keyof AssetDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* Add Asset */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Asset"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onAdd(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Asset</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Register a new asset and open its depreciation schedule
        </p>
        <AssetForm draft={draft} onField={field} suffix="" mode="add" />
      </Modal>

      {/* Edit Asset */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Asset"
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
              {row.id}  •  {row.name}  •  {row.status}
            </p>
            <AssetForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Assign Asset */}
      <Modal
        open={active === 'assign' && row !== null}
        onClose={onClose}
        title="Assign Asset"
        onSubmit={(event) => {
          event.preventDefault();
          onAssign({ target, assignee, units, issueDate, destination });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-user-check me-1" />Assign Asset
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AssetStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Status" value={row.status} />
              <Row label="Currently With" value={holderNameOf(row)} />
              <Row label="Held At" value={placeOf(row)} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Assign to</span>
              <div className="d-flex flex-wrap gap-2">
                {(['Staff', 'Department', 'Room'] as const).map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="assign-target"
                      id={`asg-${option}`} checked={target === option}
                      onChange={() => setTarget(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`asg-${option}`}>
                      <i
                        className={`ti ${option === 'Staff' ? 'ti-user' : option === 'Department' ? 'ti-building' : 'ti-door'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="assignee">Assignee</label>
                <select
                  className="form-select" id="assignee"
                  value={assignee} onChange={(event) => setAssignee(event.target.value)}
                >
                  {assigneeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="units-issued">Units Issued</label>
                <input
                  type="number" className="form-control" id="units-issued" min={1} max={row.units}
                  value={units} onChange={(event) => setUnits(event.target.value)}
                />
                <span className="fs-12 text-muted">{row.units} held on the register</span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="issue-date">Issue Date</label>
                <DateField id="issue-date" value={issueDate} onChange={setIssueDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="destination">Destination</label>
                <select
                  className="form-select" id="destination"
                  value={destination} onChange={(event) => setDestination(event.target.value)}
                >
                  {destinationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="expected-return">Expected Return</label>
                <DateField id="expected-return" value={expectedReturn} onChange={setExpectedReturn} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="assign-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="assign-remarks"
                  placeholder="Recorded on the assignment history"
                  value={assignRemarks} onChange={(event) => setAssignRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="asHandover"
                    checked={handover} onChange={(event) => setHandover(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="asHandover">
                    Generate a handover form for signature
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="asNotify"
                    checked={notifyAssignee} onChange={(event) => setNotifyAssignee(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="asNotify">
                    Notify the assignee and the estates office
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Transfer Asset */}
      <Modal
        open={active === 'transfer' && row !== null}
        onClose={onClose}
        title="Transfer Asset"
        onSubmit={(event) => {
          event.preventDefault();
          onTransfer({
            department: toDepartment, holder: newHolder, location: newLocation,
            effective, reason: transferReason,
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
                A transfer moves the asset value to the receiving department’s cost centre from the
                effective date.
              </span>
            </div>
            <AssetStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{compactOf(row)}</span>
            </AssetStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Current Holder" value={holderNameOf(row)} />
              <Row label="Current Department" value={row.department} />
              <Row label="Book Value" value={money(bookValueOf(row))} last />
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-to-department">Transfer To Department</label>
                <select
                  className="form-select" id="transfer-to-department"
                  value={toDepartment} onChange={(event) => setToDepartment(event.target.value)}
                >
                  {departmentOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-holder">New Holder</label>
                <select
                  className="form-select" id="new-holder"
                  value={newHolder} onChange={(event) => setNewHolder(event.target.value)}
                >
                  {holderOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-location">New Location</label>
                <select
                  className="form-select" id="new-location"
                  value={newLocation} onChange={(event) => setNewLocation(event.target.value)}
                >
                  {newLocationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from">Effective From</label>
                <DateField id="effective-from" value={effective} onChange={setEffective} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-reason">Reason</label>
                <select
                  className="form-select" id="transfer-reason"
                  value={transferReason} onChange={(event) => setTransferReason(event.target.value)}
                >
                  {transferReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="transfer-remarks"
                  placeholder="Recorded on the assignment history"
                  value={transferRemarks} onChange={(event) => setTransferRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="trCost"
                    checked={moveCost} onChange={(event) => setMoveCost(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="trCost">
                    Move the book value to the receiving cost centre
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="trWipe"
                    checked={dataWipe} onChange={(event) => setDataWipe(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="trWipe">
                    Require a data wipe before handover
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Schedule Maintenance */}
      <Modal
        open={active === 'maintenance' && row !== null}
        onClose={onClose}
        title="Schedule Maintenance"
        onSubmit={(event) => {
          event.preventDefault();
          onSchedule({
            type: maintenanceType, priority, scheduled, completion, provider, cost, setStatus,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-tools me-1" />Schedule Maintenance
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AssetStrip row={row}>
              <span className={`badge badge-soft-${conditionTint[row.condition]}`}>{row.condition}</span>
            </AssetStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Location" value={placeOf(row)} />
              <Row
                label="Last Service"
                value={row.maintenance[0] ? `${row.maintenance[0].meta.split(' · ')[0]} · ${row.maintenance[0].title}` : 'None recorded'}
              />
              <Row label="Warranty" value={warrantyUntilLabelOf(row)} last />
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="maintenance-type">Maintenance Type</label>
                <select
                  className="form-select" id="maintenance-type"
                  value={maintenanceType} onChange={(event) => setMaintenanceType(event.target.value)}
                >
                  {maintenanceTypeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="priority">Priority</label>
                <select
                  className="form-select" id="priority"
                  value={priority} onChange={(event) => setPriority(event.target.value)}
                >
                  {priorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="scheduled-date">Scheduled Date</label>
                <DateField id="scheduled-date" value={scheduled} onChange={setScheduled} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="expected-completion">Expected Completion</label>
                <DateField id="expected-completion" value={completion} onChange={setCompletion} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="service-provider">Service Provider</label>
                <select
                  className="form-select" id="service-provider"
                  value={provider} onChange={(event) => setProvider(event.target.value)}
                >
                  {/* The template names the bus's own supplier; every row names its own. */}
                  {providerOptions.map((option) => (
                    <option key={option}>{option === 'Original vendor' ? row.vendor : option}</option>
                  ))}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="estimated-cost">Estimated Cost</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="estimated-cost" min={0} step="0.01"
                    value={cost} onChange={(event) => setCost(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="work-description">Work Description</label>
                <textarea
                  className="form-control" rows={2} id="work-description"
                  placeholder="Recorded on the maintenance history"
                  value={work} onChange={(event) => setWork(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="smStatus"
                    checked={setStatus} onChange={(event) => setSetStatus(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="smStatus">
                    Set the asset status to Under Maintenance
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="smRecur"
                    checked={recurring} onChange={(event) => setRecurring(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="smRecur">
                    Repeat this service every 12 months
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Retire Asset */}
      <Modal
        open={active === 'retire' && row !== null}
        onClose={onClose}
        title="Retire Asset"
        onSubmit={(event) => {
          event.preventDefault();
          onRetire({ reason: retireReason, date: retireDate, disposal, salvage, approver });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Asset</button>
            <button type="submit" className="btn btn-danger">Retire Asset</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Retiring closes the depreciation schedule and writes any remaining book value off to
                disposal.
              </span>
            </div>
            <AssetStrip row={row}>
              <span className={`badge badge-soft-${conditionTint[row.condition]}`}>{row.condition}</span>
            </AssetStrip>
            {/* The asset's own schedule, so the write-off cannot contradict the grid. */}
            <div className="border rounded p-3 mb-3">
              <Row label="Purchased" value={row.purchaseDate} />
              <Row label="Purchase Value" value={money(row.purchaseValue)} />
              <Row label="Accumulated Depreciation" value={`−${money(accumulatedOf(row))}`} />
              <Row label="Book Value to Write Off" value={money(bookValueOf(row))} last />
            </div>
            {isFullyDepreciated(row) ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  Fully depreciated — there is no book value left to write off.
                </span>
              </div>
            ) : null}
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="retire-reason">Reason</label>
                <select
                  className="form-select" id="retire-reason"
                  value={retireReason} onChange={(event) => setRetireReason(event.target.value)}
                >
                  {retireReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="retirement-date">Retirement Date</label>
                <DateField id="retirement-date" value={retireDate} onChange={setRetireDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="disposal-method">Disposal Method</label>
                <select
                  className="form-select" id="disposal-method"
                  value={disposal} onChange={(event) => setDisposal(event.target.value)}
                >
                  {disposalOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="salvage-value">Salvage Value</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="salvage-value" min={0} step="0.01"
                    value={salvage} onChange={(event) => setSalvage(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="approved-by">Approved By</label>
                <select
                  className="form-select" id="approved-by"
                  value={approver} onChange={(event) => setApprover(event.target.value)}
                >
                  {approverOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="retire-notes">Internal Notes</label>
                <textarea
                  className="form-control" rows={2} id="retire-notes"
                  placeholder="Recorded on the audit history"
                  value={retireNotes} onChange={(event) => setRetireNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="raLedger"
                    checked={postWriteOff} onChange={(event) => setPostWriteOff(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="raLedger">
                    Post the write-off to the fixed asset ledger
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Asset */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Asset'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('maintenance')}>
              <i className="ti ti-tools me-1" />Maintenance
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-package me-1" />Open Asset Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">
              {row.id}  •  {row.category}  •  {placeOf(row)}
            </p>

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-coin', tint: 'primary', label: 'Purchase Value', value: money(row.purchaseValue) },
                { icon: 'ti ti-trending-down', tint: 'danger', label: 'Depreciated', value: money(accumulatedOf(row)) },
                { icon: 'ti ti-report-money', tint: 'success', label: 'Book Value', value: money(bookValueOf(row)) },
                { icon: 'ti ti-shield-check', tint: 'info', label: 'Warranty To', value: row.warrantyUntil.split(' ')[2] },
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
                <h6 className="fs-13 mb-2">Asset &amp; Assignment</h6>
                <div className="border rounded p-3">
                  {assignmentPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Depreciation Schedule</h6>
                <div className="border rounded p-3">
                  {schedulePairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Maintenance History</h6>
            {row.maintenance.length === 0 ? (
              <p className="fs-13 text-muted mb-0">No maintenance recorded against this asset.</p>
            ) : (
              row.maintenance.map((entry) => (
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-tools" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                  </div>
                  {/* Under warranty means the school paid nothing for it. */}
                  <span className="fs-12 text-muted text-nowrap">
                    {/warranty/i.test(entry.meta) ? 'No cost' : /\$/.test(entry.meta) ? 'Billed' : 'Closed'}
                  </span>
                </div>
              ))
            )}

            <h6 className="fs-13 mb-2 mt-3">Internal Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
            <p className="fs-12 text-muted mb-0 mt-2">{warrantyLabelOf(row)} · {warrantyStateOf(row)}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AssetModals;
