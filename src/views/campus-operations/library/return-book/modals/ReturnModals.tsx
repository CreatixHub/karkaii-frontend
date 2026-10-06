import { useEffect, useState } from 'react';
import TimeField from '@components/ui/TimeField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { BookReturn, Condition } from '../data/bookReturns.data';
import {
  conditionBadge,
  coverConditionOptions,
  damageTypeOptions,
  fineDueOf,
  importModes,
  inspectConditionOptions,
  memberSelectOptions,
  metaOf,
  overdueFineOf,
  pagesIntactOptions,
  paymentMethodOptions,
  processConditionOptions,
  processedSentenceOf,
  receivedByOptions,
  severityOptions,
  statusIcon,
  statusPill,
  timelineSentenceOf,
  toInputDate,
} from '../data/bookReturns.data';

export type ReturnModalId =
  | 'view' | 'process' | 'fine' | 'inspect' | 'damage'
  | 'lost' | 'receipt' | 'import' | 'book' | 'delete';

/** The Process Return form — the only dialog that writes a whole record. */
export interface ReturnDraft {
  member: string;
  returnDate: string;
  condition: Condition;
  fine: string;
  receivedBy: string;
  notes: string;
}

export const emptyDraft: ReturnDraft = {
  member: '',
  returnDate: '08/05/2024',
  condition: 'Good',
  fine: '0',
  receivedBy: receivedByOptions[0],
  notes: '',
};

export const draftOf = (row: BookReturn): ReturnDraft => ({
  member: `${row.member} — ${row.card}`,
  returnDate: toInputDate(row.returnDate) || '08/05/2024',
  condition: row.condition === 'Not inspected' || row.condition === 'Fair' ? 'Good' : row.condition,
  fine: String(overdueFineOf(row)),
  receivedBy: row.receivedBy ?? receivedByOptions[0],
  notes: '',
});

export interface InspectDraft {
  condition: Condition;
  pagesIntact: string;
  cover: string;
  repairFee: string;
  notes: string;
}

export interface DamageDraft {
  damageType: string;
  severity: string;
  charge: string;
}

export interface LostDraft {
  reportedDate: string;
  charge: string;
  notes: string;
}

export interface ReturnModalsProps {
  active: ReturnModalId | null;
  row: BookReturn | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onProcess: (draft: ReturnDraft) => void;
  onCollect: (amount: string, method: string) => void;
  onInspect: (draft: InspectDraft) => void;
  onAssess: (draft: DamageDraft) => void;
  onReportLost: (draft: LostDraft) => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View Return hand off to the receipt, as the template's footer does. */
  onOpen: (modal: ReturnModalId) => void;
}

/* --------------------------------- Helpers --------------------------------- */

const ConditionBadge = ({ condition }: { condition: Condition }) => {
  const badge = conditionBadge[condition];
  return (
    <span className={badge.className}>
      <i className={`${badge.icon} me-1`} />{badge.label}
    </span>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const ReturnModals = ({
  active, row, deleteCount, onClose, onProcess, onCollect, onInspect, onAssess,
  onReportLost, onDelete, onImport, onToast, onOpen,
}: ReturnModalsProps) => {
  const [draft, setDraft] = useState<ReturnDraft>(emptyDraft);
  const [amount, setAmount] = useState('0');
  const [method, setMethod] = useState(paymentMethodOptions[0]);
  const [inspect, setInspect] = useState<InspectDraft>({
    condition: 'Good', pagesIntact: pagesIntactOptions[0], cover: coverConditionOptions[0],
    repairFee: '0', notes: '',
  });
  const [damage, setDamage] = useState<DamageDraft>({
    damageType: damageTypeOptions[0], severity: severityOptions[0], charge: '15',
  });
  const [lost, setLost] = useState<LostDraft>({ reportedDate: '08/05/2024', charge: '45', notes: '' });
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening starts from the record the dialog was opened on. */
  useEffect(() => {
    if (active === 'process') setDraft(row ? draftOf(row) : emptyDraft);
    if (active === 'fine') {
      setAmount(row ? String(fineDueOf(row)) : '0');
      setMethod(paymentMethodOptions[0]);
    }
    if (active === 'inspect') {
      setInspect({
        condition: row && row.condition === 'Damaged' ? 'Damaged' : 'Good',
        pagesIntact: pagesIntactOptions[0],
        cover: coverConditionOptions[0],
        repairFee: row ? String(row.repairFee) : '0',
        notes: '',
      });
    }
    if (active === 'damage') {
      setDamage({ damageType: damageTypeOptions[0], severity: severityOptions[0], charge: '15' });
    }
    if (active === 'lost') {
      setLost({
        reportedDate: '08/05/2024',
        charge: String(row && row.replacementCharge > 0 ? row.replacementCharge : 45),
        notes: '',
      });
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof ReturnDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const meta = row ? metaOf(row) : null;
  const outstanding = row ? fineDueOf(row) : 0;

  return (
    <>
      {/* View Return */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Return Record"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('receipt')}>
              Print Return Receipt
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3 p-3 bg-light rounded">
              <span className="avatar avatar-lg me-1">
                <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.member} />
              </span>
              <div className="flex-fill">
                <h5 className="mb-0 fs-15">
                  {row.member} <span className="fs-12 text-muted">· {row.card} · {row.memberType}</span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.bookTitle} · {row.bookCode} · {row.category}
                </span>
              </div>
              <span className={`dt-pill ${statusPill[row.status]}`}>
                {statusIcon[row.status]
                  ? <i className={statusIcon[row.status] as string} />
                  : <span className="dt-pill-dot" />}
                {row.status}
              </span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-timeline-event" />Timeline</h6>
                <p className="fs-13 mb-0">{timelineSentenceOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user-check" />Processed</h6>
                <p className="fs-13 mb-0">{processedSentenceOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-zoom-check" />Condition</h6>
                <div className="d-flex flex-wrap gap-1"><ConditionBadge condition={row.condition} /></div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge badge-soft-primary">ReturnReceipt.pdf</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Process Book Return */}
      <Modal
        open={active === 'process'}
        onClose={onClose}
        title="Process Book Return"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onProcess(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Process Return</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="member">
              Member <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="member" required
              value={draft.member} onChange={(event) => field('member', event.target.value)}
            >
              <option value="">Select member</option>
              {memberSelectOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="return-date-2">Return Date</label>
            <div className="input-icon-end position-relative">
              <TimeField
                value={draft.returnDate}
                onChange={(next: string) => field('returnDate', next)}
                id="return-date-2"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="condition">
              Condition <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="condition"
              value={draft.condition} onChange={(event) => field('condition', event.target.value)}
            >
              {processConditionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fine-if-overdue">Fine (if overdue)</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="fine-if-overdue"
                value={draft.fine} onChange={(event) => field('fine', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="received-by">Received By</label>
            <select
              className="form-select" id="received-by"
              value={draft.receivedBy} onChange={(event) => field('receivedBy', event.target.value)}
            >
              {receivedByOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="notes">Notes</label>
            <textarea
              className="form-control" rows={2} placeholder="Optional notes" id="notes"
              value={draft.notes} onChange={(event) => field('notes', event.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Fine Collection */}
      <Modal
        open={active === 'fine' && row !== null}
        onClose={onClose}
        title="Fine Collection"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onCollect(amount, method); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Collect Fine</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-cash fs-16" />
              <span className="fs-13">{row.bookTitle} · {row.member} · ${outstanding} outstanding</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="fine-amount">Fine Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control" id="fine-amount" value={outstanding} readOnly />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="amount-collecting">
                  Amount Collecting <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="amount-collecting" required
                    value={amount} onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="payment-method">Payment Method</label>
                <select
                  className="form-select" id="payment-method"
                  value={method} onChange={(event) => setMethod(event.target.value)}
                >
                  {paymentMethodOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Book Condition Inspection */}
      <Modal
        open={active === 'inspect' && row !== null}
        onClose={onClose}
        title="Book Condition Inspection"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onInspect(inspect); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Inspection</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-zoom-check fs-16" />
              <span className="fs-13">{row.bookTitle} · {row.bookCode}</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="overall-condition">Overall Condition</label>
                <select
                  className="form-select" id="overall-condition"
                  value={inspect.condition}
                  onChange={(event) =>
                    setInspect({ ...inspect, condition: event.target.value as Condition })}
                >
                  {inspectConditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="pages-intact">Pages Intact</label>
                <select
                  className="form-select" id="pages-intact"
                  value={inspect.pagesIntact}
                  onChange={(event) => setInspect({ ...inspect, pagesIntact: event.target.value })}
                >
                  {pagesIntactOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="cover-condition">Cover Condition</label>
                <select
                  className="form-select" id="cover-condition"
                  value={inspect.cover}
                  onChange={(event) => setInspect({ ...inspect, cover: event.target.value })}
                >
                  {coverConditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="repair-fee">Repair Fee</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="repair-fee"
                    value={inspect.repairFee}
                    onChange={(event) => setInspect({ ...inspect, repairFee: event.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="inspection-notes">Inspection Notes</label>
                <textarea
                  className="form-control" rows={2} placeholder="Condition remarks" id="inspection-notes"
                  value={inspect.notes}
                  onChange={(event) => setInspect({ ...inspect, notes: event.target.value })}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Damage Assessment */}
      <Modal
        open={active === 'damage' && row !== null}
        onClose={onClose}
        title="Damage Assessment"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssess(damage); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Assessment</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning border-0 d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-tool fs-16" />
              <span className="fs-13">Assessing damage for {row.bookTitle} · {row.bookCode}</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="damage-type">Damage Type</label>
                <select
                  className="form-select" id="damage-type"
                  value={damage.damageType}
                  onChange={(event) => setDamage({ ...damage, damageType: event.target.value })}
                >
                  {damageTypeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="severity">Severity</label>
                <select
                  className="form-select" id="severity"
                  value={damage.severity}
                  onChange={(event) => setDamage({ ...damage, severity: event.target.value })}
                >
                  {severityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="assessed-charge">Assessed Charge</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="assessed-charge"
                    value={damage.charge}
                    onChange={(event) => setDamage({ ...damage, charge: event.target.value })}
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Lost Book Report */}
      <Modal
        open={active === 'lost' && row !== null}
        onClose={onClose}
        title="Lost Book Report"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onReportLost(lost); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger">File Report</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger border-0 d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-alert-octagon fs-16" />
              <span className="fs-13">Reporting {row.bookTitle} · {row.bookCode} as lost</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="reported-date">Reported Date</label>
                <div className="input-icon-end position-relative">
                  <TimeField
                    value={lost.reportedDate}
                    onChange={(next: string) => setLost({ ...lost, reportedDate: next })}
                    id="reported-date"
                  />
                  <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="replacement-charge">Replacement Charge</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="replacement-charge"
                    value={lost.charge}
                    onChange={(event) => setLost({ ...lost, charge: event.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="report-notes">Report Notes</label>
                <textarea
                  className="form-control" rows={2} placeholder="Circumstances of the loss" id="report-notes"
                  value={lost.notes}
                  onChange={(event) => setLost({ ...lost, notes: event.target.value })}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Return Receipt Preview */}
      <Modal
        open={active === 'receipt' && row !== null}
        onClose={onClose}
        title="Return Receipt Preview"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`Return receipt queued for ${row?.card}`); }}
            >
              <i className="ti ti-printer me-1" />Print Receipt
            </button>
          </>
        }
      >
        {row ? (
          <div className="border rounded p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <ImageWithBasePath src="assets/img/karkaii-logo.png" alt="Logo" height={28} />
                <span className="fw-semibold">Global International Library</span>
              </div>
              <span className="badge badge-soft-primary">Return Receipt</span>
            </div>
            <ul className="list-unstyled fs-13 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Member</span>
                <span className="fw-medium">{row.member} · {row.card}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Book</span>
                <span className="fw-medium">{row.bookTitle} · {row.bookCode}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Return Date</span>
                <span className="fw-medium">{row.returnDate ?? '—'}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Condition</span>
                <span className="fw-medium">{conditionBadge[row.condition].label}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1 border-top pt-2">
                <span className="text-muted">Fine Paid</span>
                <span className={`fw-semibold text-${outstanding > 0 ? 'danger' : 'success'}`}>
                  ${outstanding}
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </Modal>

      {/* Import Records */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Records"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onImport(mode); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Records file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">Import mode</label>
          <select
            className="form-select" id="import-mode"
            value={mode} onChange={(event) => setMode(event.target.value)}
          >
            {importModes.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
      </Modal>

      {/* Book Details */}
      <Modal
        open={active === 'book' && row !== null}
        onClose={onClose}
        title="Book Details"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={onClose}>Close</button>}
      >
        {row && meta ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-book fs-20" />
              </span>
              <div>
                <h5 className="mb-0">{row.bookTitle}</h5>
                <span className="fs-12 text-muted">
                  {row.isbn} · {row.bookCode} · {row.category} · Shelf {meta.shelf}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user-edit" />Author</h6>
                <p className="fs-13 mb-0">{meta.author} · {meta.publisher} · {meta.language}.</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-stack-2" />Copies</h6>
                <p className="fs-13 mb-0">
                  {meta.total} total · {meta.available} available · {meta.issued} issued.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => { event.preventDefault(); onDelete(); }}
      >
        <span className="delete-icon"><i className="ti ti-trash-x" /></span>
        <h4>Confirm Deletion</h4>
        <p>
          You want to delete {deleteCount === 1 ? 'this record' : `all ${deleteCount} marked items`}, this
          cant be undone once you delete.
        </p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-danger">Yes, Delete</button>
        </div>
      </Modal>
    </>
  );
};

export default ReturnModals;
