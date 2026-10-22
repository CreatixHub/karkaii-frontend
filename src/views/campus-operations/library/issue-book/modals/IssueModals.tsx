import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { BookIssue } from '../data/bookIssues.data';
import {
  FINE_RATE,
  TODAY,
  addDays,
  attachmentsOf,
  bookSelectOptions,
  circulationOf,
  classLabelOf,
  daysOverdueOf,
  fineKindOf,
  memberSelectOptions,
  reservationCountOf,
  shelfLineOf,
  statusIcon,
  statusPill,
  timelineOf,
  toDialogDate,
} from '../data/bookIssues.data';

export type IssueModalId =
  | 'view' | 'issue' | 'return' | 'renew' | 'fine'
  | 'availability' | 'slip' | 'import' | 'delete' | 'details';

/* --------------------------------- Drafts ---------------------------------- */

export interface IssueDraft {
  member: string;
  book: string;
  issueDate: string;
  dueDate: string;
}

/** The template's own defaults: 08/05/2024 issued, 22/05/2024 due. */
export const emptyIssueDraft: IssueDraft = {
  member: '',
  book: '',
  issueDate: toDialogDate(TODAY),
  dueDate: toDialogDate(addDays(TODAY, 14)),
};

/** "Issue Another Book" opens with the row's member already chosen. */
export const issueDraftOf = (row: BookIssue): IssueDraft => ({
  ...emptyIssueDraft,
  member: `${row.member} — ${row.card}`,
});

export interface ReturnDraft {
  returnDate: string;
  condition: string;
  fine: string;
  fineStatus: string;
}

export const returnDraftOf = (row: BookIssue): ReturnDraft => ({
  returnDate: toDialogDate(TODAY),
  condition: 'Good',
  fine: String(row.fine),
  fineStatus: row.fine > 0 ? 'Collected' : 'No Fine',
});

export interface RenewDraft {
  period: string;
}

export const emptyRenewDraft: RenewDraft = { period: '14 Days' };

export const conditionOptions = ['Good', 'Damaged', 'Lost'];

export const fineStatusOptions = ['No Fine', 'Collected', 'Waived'];

export const renewalPeriodOptions = ['14 Days', '7 Days', '21 Days'];

export const importModes = [
  'Create new records',
  'Update existing by card + book',
  'Create and update',
];

/** "14 Days" → 14. */
export const daysOfPeriod = (period: string): number => Number(period.replace(/\D/g, '')) || 14;

/* --------------------------------- Copies ---------------------------------- */

export interface Copy {
  label: string;
  status: 'Available' | 'Issued' | 'Reserved' | 'Lost';
}

/**
 * Three copies, as the template's table has, but each one coloured by the
 * record rather than hard-coded: copy 1 is this loan, copy 3 is only held back
 * while the queue has someone in it.
 */
export const copiesOf = (row: BookIssue): Copy[] => {
  const own: Copy['status'] =
    row.status === 'Returned' ? 'Available' : row.status === 'Lost' ? 'Lost' : 'Issued';
  return [
    { label: 'Copy 1', status: own },
    { label: 'Copy 2', status: 'Available' },
    { label: 'Copy 3', status: reservationCountOf(row) > 0 ? 'Reserved' : 'Available' },
  ];
};

const copyBadge: Record<Copy['status'], string> = {
  Available: 'badge badge-soft-success',
  Issued: 'badge badge-soft-primary',
  Reserved: 'badge badge-soft-warning',
  Lost: 'badge badge-soft-danger',
};

/* ---------------------------------- Props ----------------------------------- */

export interface IssueModalsProps {
  active: IssueModalId | null;
  row: BookIssue | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onIssue: (draft: IssueDraft) => void;
  onReturn: (draft: ReturnDraft) => void;
  onRenew: (draft: RenewDraft) => void;
  onCollectFine: () => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  onPrintSlip: () => void;
  /** Lets View Issue hand off to Print Slip, and Availability to Issue Book. */
  onOpen: (modal: IssueModalId) => void;
}

/* --------------------------------- Modals ---------------------------------- */

const IssueModals = ({
  active, row, deleteCount, onClose, onIssue, onReturn, onRenew, onCollectFine,
  onDelete, onImport, onPrintSlip, onOpen,
}: IssueModalsProps) => {
  const [issueDraft, setIssueDraft] = useState<IssueDraft>(emptyIssueDraft);
  const [returnDraft, setReturnDraft] = useState<ReturnDraft>({
    returnDate: toDialogDate(TODAY), condition: 'Good', fine: '0', fineStatus: 'No Fine',
  });
  const [renewDraft, setRenewDraft] = useState<RenewDraft>(emptyRenewDraft);
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening starts from the record the action was fired on. */
  useEffect(() => {
    if (active === 'issue') setIssueDraft(row ? issueDraftOf(row) : emptyIssueDraft);
    if (active === 'return' && row) setReturnDraft(returnDraftOf(row));
    if (active === 'renew') setRenewDraft(emptyRenewDraft);
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const pill = (record: BookIssue) => (
    <span className={`dt-pill ${statusPill[record.status]}`}>
      {statusIcon[record.status]
        ? <i className={statusIcon[record.status] as string} />
        : <span className="dt-pill-dot" />}
      {record.status}
    </span>
  );

  /** Renew Book's read-only field, recomputed as the period changes. */
  const newDueDate = row ? addDays(row.dueOn, daysOfPeriod(renewDraft.period)) : '';

  const overdueDays = row ? daysOverdueOf(row) : 0;
  const fineKind = row ? fineKindOf(row) : 'none';

  return (
    <>
      {/* View Issue */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Issue Record"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('slip')}>
              Print Issue Slip
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3 p-3 bg-light rounded">
              <span className="avatar avatar-lg me-1">
                <img src={row.photo} className="rounded-circle flex-shrink-0" alt={row.member} />
              </span>
              <div className="flex-fill">
                <h5 className="mb-0 fs-15">
                  {row.member}{' '}
                  <span className="fs-12 text-muted">· {row.card} · {row.memberType}</span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.title} · {row.bookCode} · {row.category}
                </span>
              </div>
              {pill(row)}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-history" />Issue Timeline</h6>
                <p className="fs-13 mb-0">{timelineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user-check" />Circulation</h6>
                <p className="fs-13 mb-0">{circulationOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-book" />Book</h6>
                <p className="fs-13 mb-0">{shelfLineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
                <div className="d-flex flex-wrap gap-1">
                  {attachmentsOf(row).map((file) => (
                    <span className={file.badge} key={file.label}>{file.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Issue Book */}
      <Modal
        open={active === 'issue'}
        onClose={onClose}
        title="Issue Book"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onIssue(issueDraft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Issue Book</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="issue-member">
              Member <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="issue-member" required
              value={issueDraft.member}
              onChange={(event) => setIssueDraft((current) => ({ ...current, member: event.target.value }))}
            >
              <option value="">Select member</option>
              {memberSelectOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="issue-book-title">
              Book <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="issue-book-title" required
              value={issueDraft.book}
              onChange={(event) => setIssueDraft((current) => ({ ...current, book: event.target.value }))}
            >
              <option value="">Select book</option>
              {bookSelectOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-date">Issue Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={issueDraft.issueDate}
                onChange={(next: string) => setIssueDraft((current) => ({ ...current, issueDate: next }))}
                format="d/m/Y"
                id="issue-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-due-date">Due Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={issueDraft.dueDate}
                onChange={(next: string) => setIssueDraft((current) => ({ ...current, dueDate: next }))}
                format="d/m/Y"
                id="issue-due-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Return Book */}
      <Modal
        open={active === 'return' && row !== null}
        onClose={onClose}
        title="Return Book"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onReturn(returnDraft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Return Book</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-book fs-16" />
              <span className="fs-13">{row.title} · {row.member} · Due {row.dueOn}</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="return-date">Return Date</label>
                <div className="input-icon-end position-relative">
                  <DateField
                    value={returnDraft.returnDate}
                    onChange={(next: string) => setReturnDraft((current) => ({ ...current, returnDate: next }))}
                    format="d/m/Y"
                    id="return-date"
                  />
                  <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="return-condition">Condition</label>
                <select
                  className="form-select" id="return-condition"
                  value={returnDraft.condition}
                  onChange={(event) => setReturnDraft((current) => ({ ...current, condition: event.target.value }))}
                >
                  {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="return-fine">Fine (if overdue)</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="return-fine" min={0}
                    value={returnDraft.fine}
                    onChange={(event) => setReturnDraft((current) => ({ ...current, fine: event.target.value }))}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="return-fine-status">Fine Status</label>
                <select
                  className="form-select" id="return-fine-status"
                  value={returnDraft.fineStatus}
                  onChange={(event) => setReturnDraft((current) => ({ ...current, fineStatus: event.target.value }))}
                >
                  {fineStatusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Renew Book */}
      <Modal
        open={active === 'renew' && row !== null}
        onClose={onClose}
        title="Renew Book"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onRenew(renewDraft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Renew Book</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-refresh fs-16" />
              <span className="fs-13">
                {row.title} · {row.member} · {row.renewals} renewal{row.renewals === 1 ? '' : 's'} used
              </span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="renewal-period">Renewal Period</label>
                <select
                  className="form-select" id="renewal-period"
                  value={renewDraft.period}
                  onChange={(event) => setRenewDraft({ period: event.target.value })}
                >
                  {renewalPeriodOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="new-due-date">New Due Date</label>
                <input type="text" className="form-control" id="new-due-date" value={newDueDate} readOnly />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Calculate Fine */}
      <Modal
        open={active === 'fine' && row !== null}
        onClose={onClose}
        title="Calculate Fine"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              disabled={!row || row.fine === 0}
              onClick={onCollectFine}
            >
              Collect Fine
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-calculator fs-16" />
              <span className="fs-13">{row.title} · {row.member} · Due {row.dueOn}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">Days Overdue</td>
                    <td className="text-end fw-medium">{overdueDays}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Rate per Day</td>
                    <td className="text-end fw-medium">${FINE_RATE}</td>
                  </tr>
                  {fineKind === 'replacement' ? (
                    <tr>
                      <td className="text-muted">Replacement Charge</td>
                      <td className="text-end fw-medium">${row.fine}</td>
                    </tr>
                  ) : null}
                  <tr className="border-top">
                    <th>Total Fine</th>
                    <th className="text-end text-danger">${row.fine}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Book Availability */}
      <Modal
        open={active === 'availability' && row !== null}
        onClose={onClose}
        title="Book Availability"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('issue')}>
              Issue Available Copy
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-book fs-16" />
              <span className="fs-13">{row.title} · {row.bookCode} · Shelf {row.shelf}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr><th>Copy</th><th className="text-end">Status</th></tr>
                </thead>
                <tbody>
                  {copiesOf(row).map((copy) => (
                    <tr key={copy.label}>
                      <td>{copy.label}</td>
                      <td className="text-end">
                        <span className={copyBadge[copy.status]}>{copy.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print Issue Slip */}
      <Modal
        open={active === 'slip' && row !== null}
        onClose={onClose}
        title="Issue Slip Preview"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onPrintSlip}>
              <i className="ti ti-printer me-1" />Print Slip
            </button>
          </>
        }
      >
        {row ? (
          <div className="border rounded p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <img src="assets/img/karkaii-logo.png" alt="Logo" style={{ height: 28 }} />
                <span className="fw-semibold">Global International Library</span>
              </div>
              <span className="badge badge-soft-primary">Issue Slip</span>
            </div>
            <ul className="list-unstyled fs-13 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Member</span>
                <span className="fw-medium">{row.member} · {row.card}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Book</span>
                <span className="fw-medium">{row.title} · {row.bookCode}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Issue Date</span>
                <span className="fw-medium">{row.issuedOn}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1 border-top pt-2">
                <span className="text-muted">Due Date</span>
                <span className="fw-semibold text-danger">{row.dueOn}</span>
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
          You want to delete {deleteCount === 1 ? 'this issue record' : `all ${deleteCount} marked items`},
          this cant be undone once you delete.
        </p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-danger">Yes, Delete</button>
        </div>
      </Modal>

      {/* View Details — the page's legacy dialog, populated from the row. */}
      <Modal
        open={active === 'details' && row !== null}
        onClose={onClose}
        title="View Details"
        dialogClassName="modal-lg"
      >
        {row ? (
          <div className="view-book">
            <div className="view-book-title">
              <h5>Issue Book Details</h5>
            </div>
            <div className="book-issue-details">
              <div className="book-details-head">
                <span className="text-primary">
                  IB{row.card.replace(/\D/g, '')}{row.bookCode.replace(/\D/g, '')}
                </span>
                <h6><span>Issue Date :</span> {row.issuedOn}</h6>
              </div>
              <ul className="book-taker-info">
                <li>
                  <div className="d-flex align-items-center">
                    <span className="student-img">
                      <img src={row.photo} className="img-fluid rounded-circle flex-shrink-0" alt={row.member} />
                    </span>
                    <h6>
                      {row.member.split(' ')[0]} <br /> {classLabelOf(row) || row.memberType}
                    </h6>
                  </div>
                </li>
                <li>
                  <span>Roll No</span>
                  <h6>{row.memberId}</h6>
                </li>
                <li>
                  <span>Book Name</span>
                  <h6>{row.title}</h6>
                </li>
                <li>
                  <span>Book No</span>
                  <h6>{row.bookCode}</h6>
                </li>
                <li>
                  <span>Due Date</span>
                  <h6>{row.dueOn}</h6>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default IssueModals;
