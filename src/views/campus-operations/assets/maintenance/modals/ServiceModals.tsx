import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { ServiceRecord } from '../data/services.data';
import {
  assetChoices,
  conditionOptions,
  costCentreOptions,
  costPairsOf,
  cycleOf,
  cycleOptions,
  estimateOf,
  historyRowsOf,
  money,
  natureOptions,
  outcomeOptions,
  paymentStatusOptions,
  placeOf,
  priorityOptions,
  scheduleLabelOf,
  siteContactOptions,
  specialisationOptions,
  statusBadge,
  statusOf,
  technicianChoices,
  typeBadge,
  typeOptions,
  vendorOptions,
  warrantyObservationOf,
  windowOptions,
} from '../data/services.data';

export type ServiceModalId =
  | 'schedule' | 'edit' | 'complete' | 'technician' | 'cost' | 'history';

export interface ServiceDraft {
  nature: string;
  asset: string;
  type: string;
  summary: string;
  scheduled: string;
  window: string;
  cycle: string;
  vendor: string;
  technician: string;
  estimate: string;
  costCentre: string;
  priority: string;
  notes: string;
  repeat: boolean;
  notify: boolean;
}

export const emptyDraft: ServiceDraft = {
  nature: 'Preventive', asset: '', type: typeOptions[0], summary: '',
  scheduled: '18-08-2026', window: windowOptions[0], cycle: cycleOptions[0],
  vendor: vendorOptions[0], technician: 'Assign later', estimate: '',
  costCentre: costCentreOptions[0], priority: priorityOptions[0], notes: '',
  repeat: true, notify: true,
};

/** "8 Aug 2026" → "08-08-2026", which is what the date inputs take. */
const toInputDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? '' : `${day.padStart(2, '0')}-${String(index + 1).padStart(2, '0')}-${year}`;
};

/** "08-08-2026" → "8 Aug 2026", the way a row prints a date. */
export const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

export const draftOf = (row: ServiceRecord): ServiceDraft => ({
  nature: /emergency/i.test(row.type) ? 'Emergency'
    : /inspection/i.test(row.type) ? 'Inspection'
      : /repair/i.test(row.type) ? 'Repair' : 'Preventive',
  asset: assetChoices.find((choice) => choice.endsWith(row.assetId)) ?? '',
  type: row.type,
  summary: row.summary,
  scheduled: toInputDate(row.scheduled),
  window: windowOptions[0],
  cycle: cycleOf(row),
  vendor: vendorOptions.find((option) => option === row.vendor) ?? vendorOptions[0],
  technician: technicianChoices.find((choice) => choice.startsWith(row.technician.name)) ?? 'Assign later',
  estimate: estimateOf(row).toFixed(2),
  costCentre: costCentreOptions.find((option) => option === row.costCentre) ?? costCentreOptions[0],
  priority: row.priority,
  notes: row.notes,
  repeat: Boolean(row.nextService),
  notify: true,
});

export interface CompletePayload {
  outcome: string;
  completedOn: string;
  hours: string;
  actualCost: string;
  condition: string;
  nextService: string;
  work: string;
  backInService: boolean;
}

export interface TechnicianPayload {
  technician: string;
  specialisation: string;
  visitDate: string;
  reportingTime: string;
  hours: string;
  siteContact: string;
  instructions: string;
}

export interface CostPayload {
  invoiceNo: string;
  labour: string;
  parts: string;
  consumables: string;
  costCentre: string;
  paymentStatus: string;
  invoiceDate: string;
  reason: string;
}

export interface ServiceModalsProps {
  active: ServiceModalId | null;
  row: ServiceRecord | null;
  onClose: () => void;
  onSchedule: (draft: ServiceDraft) => void;
  onUpdate: (draft: ServiceDraft) => void;
  onComplete: (payload: CompletePayload) => void;
  onAssign: (payload: TechnicianPayload) => void;
  onRecordCost: (payload: CostPayload) => void;
  onOpen: (modal: ServiceModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const AssetStrip = ({ row, children }: { row: ServiceRecord; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.assetName}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.assetId}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: ServiceDraft;
  onField: (field: keyof ServiceDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'schedule' | 'edit';
  /** Named on the Edit dialog's notify switch. */
  notifyTargets?: string;
}

const ServiceForm = ({ draft, onField, suffix, mode, notifyTargets }: FormProps) => (
  <>
    {mode === 'schedule' ? (
      <div className="mb-3">
        <span className="form-label d-block">Service nature</span>
        <div className="d-flex flex-wrap gap-3">
          {natureOptions.map((option) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input" type="radio" name="service-nature"
                id={`sm-${option}${suffix}`} checked={draft.nature === option}
                onChange={() => onField('nature', option)}
              />
              <label className="form-check-label fs-13" htmlFor={`sm-${option}${suffix}`}>
                <i
                  className={`ti ${option === 'Preventive' ? 'ti-shield-check' : option === 'Repair' ? 'ti-tool' : option === 'Inspection' ? 'ti-checkup-list' : 'ti-alert-triangle'} me-1`}
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
        <label className="form-label" htmlFor={`sm-asset${suffix}`}>Asset</label>
        <select
          className="form-select" id={`sm-asset${suffix}`}
          value={draft.asset} onChange={(event) => onField('asset', event.target.value)}
        >
          <option value="">Select asset</option>
          {assetChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-type${suffix}`}>Maintenance Type</label>
        <select
          className="form-select" id={`sm-type${suffix}`}
          value={draft.type} onChange={(event) => onField('type', event.target.value)}
        >
          {typeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-summary${suffix}`}>Work Summary</label>
        <input
          type="text" className="form-control" id={`sm-summary${suffix}`}
          placeholder="e.g. Quarterly road service · safety check"
          value={draft.summary} onChange={(event) => onField('summary', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Schedule</h6>
    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-date${suffix}`}>Scheduled Date</label>
        <DateField
          id={`sm-date${suffix}`} value={draft.scheduled}
          onChange={(next) => onField('scheduled', next)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-window${suffix}`}>Service Window</label>
        <select
          className="form-select" id={`sm-window${suffix}`}
          value={draft.window} onChange={(event) => onField('window', event.target.value)}
        >
          {windowOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-cycle${suffix}`}>Service Cycle</label>
        <select
          className="form-select" id={`sm-cycle${suffix}`}
          value={draft.cycle} onChange={(event) => onField('cycle', event.target.value)}
        >
          {cycleOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Vendor &amp; Cost</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-vendor${suffix}`}>Service Vendor</label>
        <select
          className="form-select" id={`sm-vendor${suffix}`}
          value={draft.vendor} onChange={(event) => onField('vendor', event.target.value)}
        >
          {vendorOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-technician${suffix}`}>Technician</label>
        <select
          className="form-select" id={`sm-technician${suffix}`}
          value={draft.technician} onChange={(event) => onField('technician', event.target.value)}
        >
          <option>Assign later</option>
          {technicianChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-estimate${suffix}`}>Estimated Cost</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`sm-estimate${suffix}`} min={0} step="0.01"
            placeholder="0.00"
            value={draft.estimate} onChange={(event) => onField('estimate', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-centre${suffix}`}>Cost Centre</label>
        <select
          className="form-select" id={`sm-centre${suffix}`}
          value={draft.costCentre} onChange={(event) => onField('costCentre', event.target.value)}
        >
          {costCentreOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-priority${suffix}`}>Priority</label>
        <select
          className="form-select" id={`sm-priority${suffix}`}
          value={draft.priority} onChange={(event) => onField('priority', event.target.value)}
        >
          {priorityOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`sm-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`sm-notes${suffix}`}
          placeholder="Visible to the estates office only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        {mode === 'schedule' ? (
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`smRepeat${suffix}`}
              checked={draft.repeat} onChange={(event) => onField('repeat', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`smRepeat${suffix}`}>
              Create the next service automatically at the end of the cycle
            </label>
          </div>
        ) : null}
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`smNotify${suffix}`}
            checked={draft.notify} onChange={(event) => onField('notify', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`smNotify${suffix}`}>
            {mode === 'schedule'
              ? 'Notify the custodian and the vendor 3 days before the visit'
              : `Send the revised date to ${notifyTargets ?? 'the vendor and the custodian'}`}
          </label>
        </div>
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const ServiceModals = ({
  active, row, onClose, onSchedule, onUpdate, onComplete, onAssign, onRecordCost,
  onOpen, onOpenPanel,
}: ServiceModalsProps) => {
  const [draft, setDraft] = useState<ServiceDraft>(emptyDraft);

  const [outcome, setOutcome] = useState(outcomeOptions[0]);
  const [completedOn, setCompletedOn] = useState('31-07-2026');
  const [hours, setHours] = useState('2.5');
  const [actualCost, setActualCost] = useState('0.00');
  const [condition, setCondition] = useState(conditionOptions[1]);
  const [nextService, setNextService] = useState('');
  const [work, setWork] = useState('');
  const [backInService, setBackInService] = useState(true);
  const [raiseNext, setRaiseNext] = useState(true);

  const [technician, setTechnician] = useState(technicianChoices[0]);
  const [specialisation, setSpecialisation] = useState(specialisationOptions[0]);
  const [visitDate, setVisitDate] = useState('08-08-2026');
  const [reportingTime, setReportingTime] = useState('08:30');
  const [visitHours, setVisitHours] = useState('6');
  const [siteContact, setSiteContact] = useState(siteContactOptions[0]);
  const [instructions, setInstructions] = useState('');
  const [gatePass, setGatePass] = useState(true);
  const [emailSheet, setEmailSheet] = useState(true);

  const [invoiceNo, setInvoiceNo] = useState('');
  const [labour, setLabour] = useState('0.00');
  const [partsCost, setPartsCost] = useState('0.00');
  const [consumables, setConsumables] = useState('0.00');
  const [costCentre, setCostCentre] = useState(costCentreOptions[0]);
  const [paymentStatus, setPaymentStatus] = useState(paymentStatusOptions[0]);
  const [invoiceDate, setInvoiceDate] = useState('31-07-2026');
  const [reason, setReason] = useState('');
  const [postBudget, setPostBudget] = useState(true);

  useEffect(() => {
    if (active === 'schedule') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'complete') {
      setOutcome(outcomeOptions[0]);
      setCompletedOn('31-07-2026');
      setActualCost(estimateOf(row).toFixed(2));
      setCondition(conditionOptions[1]);
      setNextService(toInputDate(row.nextService) || '');
      setWork('');
      setBackInService(true);
    }
    if (active === 'technician') {
      setTechnician(
        technicianChoices.find((choice) => choice.startsWith(row.technician.name)) ?? technicianChoices[0],
      );
      setSpecialisation(
        specialisationOptions.find((option) => option === row.specialisation) ?? specialisationOptions[0],
      );
      setVisitDate(toInputDate(row.scheduled));
      setInstructions('');
    }
    if (active === 'cost') {
      setInvoiceNo('');
      setLabour(row.labour.toFixed(2));
      setPartsCost(row.parts.reduce((total, part) => total + part.qty * part.price, 0).toFixed(2));
      setConsumables(row.consumables.toFixed(2));
      setCostCentre(row.costCentre);
      setInvoiceDate('31-07-2026');
      setReason('');
    }
  }, [active, row]);

  const field = (key: keyof ServiceDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The Record Cost dialog adds its own lines up and compares them. */
  const typedActual = (Number(labour) || 0) + (Number(partsCost) || 0) + (Number(consumables) || 0);
  const recordedEstimate = row ? estimateOf(row) : 0;
  const typedVariance = Number((typedActual - recordedEstimate).toFixed(2));

  const lifetimeSpend = row
    ? row.lifetimeSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : '0';

  return (
    <>
      {/* Schedule Maintenance */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule Maintenance"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onSchedule(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule Maintenance</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Raise a preventive service or a repair request</p>
        <ServiceForm draft={draft} onField={field} suffix="" mode="schedule" />
      </Modal>

      {/* Edit Maintenance */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Maintenance"
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
              {row.id}  •  {row.assetName}  •  {scheduleLabelOf(row)}
            </p>
            {statusOf(row) === 'Overdue' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Moving the scheduled date clears the overdue flag and shifts every future service in
                  the cycle.
                </span>
              </div>
            ) : null}
            <ServiceForm
              draft={draft} onField={field} suffix="-2" mode="edit"
              notifyTargets={`${row.vendor} and the ${row.custodian}`}
            />
          </>
        ) : null}
      </Modal>

      {/* Complete Service */}
      <Modal
        open={active === 'complete' && row !== null}
        onClose={onClose}
        title="Complete Service"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete({
            outcome, completedOn, hours, actualCost, condition, nextService, work, backInService,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-circle-check me-1" />Complete Service
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AssetStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Maintenance Type" value={row.type} />
              <Row label="Technician" value={row.technician.name} />
              <Row label="Estimated Cost" value={money(estimateOf(row))} last />
            </div>

            {row.completedOn ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This service was already completed on {row.completedOn}.</span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Service outcome</span>
              <div className="d-flex flex-wrap gap-3">
                {outcomeOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="service-outcome"
                      id={`cs-${option}`} checked={outcome === option}
                      onChange={() => setOutcome(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`cs-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="completed-on">Completed On</label>
                <DateField id="completed-on" value={completedOn} onChange={setCompletedOn} />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="hours-on-site">Hours on Site</label>
                <input
                  type="number" className="form-control" id="hours-on-site" min={0} step="0.5"
                  value={hours} onChange={(event) => setHours(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="actual-cost">Actual Cost</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="actual-cost" min={0} step="0.01"
                    value={actualCost} onChange={(event) => setActualCost(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="asset-condition">Asset Condition</label>
                <select
                  className="form-select" id="asset-condition"
                  value={condition} onChange={(event) => setCondition(event.target.value)}
                >
                  {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="next-service-date">Next Service Date</label>
                <DateField id="next-service-date" value={nextService} onChange={setNextService} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="service-report">Service Report</label>
                <input type="file" className="form-control" id="service-report" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="work-carried-out">Work Carried Out</label>
                <textarea
                  className="form-control" rows={2} id="work-carried-out"
                  placeholder="Recorded on the service history"
                  value={work} onChange={(event) => setWork(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="csBack"
                    checked={backInService} onChange={(event) => setBackInService(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="csBack">
                    Return the asset to service and clear any out-of-service flag
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="csNext"
                    checked={raiseNext} onChange={(event) => setRaiseNext(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="csNext">
                    Raise the next service in the cycle automatically
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Technician */}
      <Modal
        open={active === 'technician' && row !== null}
        onClose={onClose}
        title="Assign Technician"
        onSubmit={(event) => {
          event.preventDefault();
          onAssign({
            technician, specialisation, visitDate, reportingTime,
            hours: visitHours, siteContact, instructions,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-user-cog me-1" />Assign Technician
            </button>
          </>
        }
      >
        {row ? (
          <>
            <AssetStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{row.scheduled}</span>
            </AssetStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Service Vendor" value={row.vendor} />
              <Row label="Contract" value={row.contract} />
              <Row label="Location" value={placeOf(row)} last />
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="assign-technician">Technician</label>
                <select
                  className="form-select" id="assign-technician"
                  value={technician} onChange={(event) => setTechnician(event.target.value)}
                >
                  {technicianChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="specialisation">Specialisation</label>
                <select
                  className="form-select" id="specialisation"
                  value={specialisation} onChange={(event) => setSpecialisation(event.target.value)}
                >
                  {specialisationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visit-date">Visit Date</label>
                <DateField id="visit-date" value={visitDate} onChange={setVisitDate} />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="reporting-time">Reporting Time</label>
                {/* The template uses a native time input here, not the timepicker. */}
                <input
                  type="time" className="form-control" id="reporting-time"
                  value={reportingTime} onChange={(event) => setReportingTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="estimated-hours">Estimated Hours</label>
                <input
                  type="number" className="form-control" id="estimated-hours" min={0} step="0.5"
                  value={visitHours} onChange={(event) => setVisitHours(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="site-contact">Site Contact</label>
                <select
                  className="form-select" id="site-contact"
                  value={siteContact} onChange={(event) => setSiteContact(event.target.value)}
                >
                  {siteContactOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="work-instructions">Work Instructions</label>
                <textarea
                  className="form-control" rows={2} id="work-instructions"
                  placeholder="Shared with the vendor on the job sheet"
                  value={instructions} onChange={(event) => setInstructions(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="atGate"
                    checked={gatePass} onChange={(event) => setGatePass(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="atGate">
                    Issue a gate pass for the technician on the visit date
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="atSms"
                    checked={emailSheet} onChange={(event) => setEmailSheet(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="atSms">
                    Send the job sheet to the vendor by email
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Record Cost */}
      <Modal
        open={active === 'cost' && row !== null}
        onClose={onClose}
        title="Record Maintenance Cost"
        onSubmit={(event) => {
          event.preventDefault();
          onRecordCost({
            invoiceNo, labour, parts: partsCost, consumables,
            costCentre, paymentStatus, invoiceDate, reason,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record Cost</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id}  •  {row.assetName}  •  {scheduleLabelOf(row).toLowerCase()}
            </p>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="service-record">Service Record</label>
                <input type="text" className="form-control" id="service-record" value={row.id} readOnly />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="vendor-invoice">Vendor Invoice No</label>
                <input
                  type="text" className="form-control" id="vendor-invoice" placeholder="e.g. SR-INV-2026-0774"
                  value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)}
                />
              </div></div>
            </div>

            <h6 className="fs-13 mb-2">Cost Lines</h6>
            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="labour">Labour</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="labour" min={0} step="0.01"
                    value={labour} onChange={(event) => setLabour(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="spare-parts">Spare Parts</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="spare-parts" min={0} step="0.01"
                    value={partsCost} onChange={(event) => setPartsCost(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="consumables">Consumables</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="consumables" min={0} step="0.01"
                    value={consumables} onChange={(event) => setConsumables(event.target.value)}
                  />
                </div>
              </div></div>
            </div>

            {/* Summed from the lines above, against the record's own estimate. */}
            <div className="border rounded p-3 mb-3">
              <Row label="Estimated Cost" value={money(recordedEstimate)} />
              <Row label="Actual Cost" value={money(typedActual)} />
              <Row
                label="Variance"
                value={`${typedVariance > 0 ? '+' : ''}${money(typedVariance)}`}
                last
              />
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="rc-centre">Cost Centre</label>
                <select
                  className="form-select" id="rc-centre"
                  value={costCentre} onChange={(event) => setCostCentre(event.target.value)}
                >
                  {costCentreOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="payment-status">Payment Status</label>
                <select
                  className="form-select" id="payment-status"
                  value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}
                >
                  {paymentStatusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="invoice-date">Invoice Date</label>
                <DateField id="invoice-date" value={invoiceDate} onChange={setInvoiceDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="invoice-copy">Invoice Copy</label>
                <input type="file" className="form-control" id="invoice-copy" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="variance-reason">Variance Reason</label>
                <textarea
                  className="form-control" rows={2} id="variance-reason"
                  placeholder="Required when the actual cost exceeds the estimate"
                  value={reason} onChange={(event) => setReason(event.target.value)}
                />
                {typedVariance > 0 && !reason.trim() ? (
                  <span className="fs-12 text-warning">
                    The actual cost is over the estimate — give a reason before recording it.
                  </span>
                ) : null}
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rcBudget"
                    checked={postBudget} onChange={(event) => setPostBudget(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rcBudget">
                    Post the cost against the {costCentre.toLowerCase()} budget
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Service History */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title={row?.assetName ?? 'Service history'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('schedule')}>
              <i className="ti ti-square-rounded-plus me-1" />Schedule Service
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-tool me-1" />Open Maintenance Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.assetId}  •  {row.model}  •  service history
            </p>

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-tool', tint: 'primary', label: 'Services', value: `${row.lifetimeServices} records` },
                { icon: 'ti ti-receipt', tint: 'success', label: 'Lifetime Spend', value: `$${lifetimeSpend}` },
                { icon: 'ti ti-calendar-event', tint: 'info', label: 'Last Service', value: row.lastService },
                { icon: 'ti ti-progress', tint: 'warning', label: 'Uptime', value: row.uptime },
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

            <h6 className="fs-13 mb-2">Recorded Services</h6>
            <div className="table-responsive mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th className="fs-12">Service ID</th>
                    <th className="fs-12">Date</th>
                    <th className="fs-12">Type</th>
                    <th className="fs-12">Vendor</th>
                    <th className="fs-12 text-end">Cost</th>
                    <th className="fs-12">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {/* This service first, then the ones already on the asset. */}
                  {historyRowsOf(row).map((entry, index) => (
                    <tr key={`${entry.id}-${index}`}>
                      <td className="fs-13">{entry.id}</td>
                      <td className="fs-13 text-nowrap">{entry.date}</td>
                      <td className="fs-13">{entry.type}</td>
                      <td className="fs-13">{entry.vendor}</td>
                      <td className="fs-13 text-end text-nowrap">
                        {entry.cost === null ? 'No cost' : money(entry.cost)}
                      </td>
                      <td className="fs-13">{entry.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h6 className="fs-13 mb-2">Recurring Observations</h6>
            {[...row.observations, warrantyObservationOf(row)].map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                  <i className="ti ti-alert-triangle" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{entry.title}</h6>
                  <span className="fs-12 text-muted d-block">{entry.meta}</span>
                </div>
              </div>
            ))}

            <div className="border rounded p-3 mt-3">
              {costPairsOf(row).map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>
            <p className="fs-12 text-muted mb-0 mt-2">
              <span className={typeBadge[row.type]}>{row.type}</span> · {row.summary}
            </p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ServiceModals;
