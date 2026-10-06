import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Member, MemberStatus, MemberType } from '../data/libraryMembers.data';
import {
  academicSummary,
  attachmentsOf,
  bookOptions,
  borrowingSummaryOf,
  classOptions,
  departmentOptions,
  expiryAfter,
  fineLinesOf,
  identityLineOf,
  memberOptionsFrom,
  membershipSummaryOf,
  memberTypeOptions,
  renewalPeriods,
  sectionOptions,
  statusIcon,
  statusOptions,
  statusPill,
} from '../data/libraryMembers.data';

export type MemberModalId =
  | 'add' | 'edit' | 'view' | 'issue' | 'return'
  | 'renew' | 'fines' | 'card' | 'import' | 'delete';

export interface MemberDraft {
  name: string;
  card: string;
  /** The template's Email field; the redesigned grid has no column for it. */
  email: string;
  /** The template's "Date of Join" — the grid's registration date. */
  dateOfJoin: string;
  /** The template's Phone Number field; likewise column-less. */
  phone: string;
  memberId: string;
  type: MemberType;
  classLevel: string;
  section: string;
  department: string;
  expires: string;
  status: MemberStatus;
}

export const emptyDraft: MemberDraft = {
  name: '', card: '', email: '', dateOfJoin: '', phone: '', memberId: '',
  type: 'Student', classLevel: classOptions[0], section: sectionOptions[0],
  department: departmentOptions[0], expires: '', status: 'Active',
};

export const draftOf = (row: Member): MemberDraft => ({
  name: row.name,
  card: row.card,
  email: '',
  dateOfJoin: row.registered,
  phone: '',
  memberId: row.memberId,
  type: row.type,
  classLevel: row.classLevel ?? classOptions[0],
  section: row.section ?? sectionOptions[0],
  department: row.department ?? departmentOptions[0],
  expires: row.expires,
  status: row.status,
});

export const importModes = ['Create new members', 'Update existing by card no', 'Create and update'];

export interface IssuePayload {
  member: string;
  book: string;
  issueDate: string;
  dueDate: string;
}

export interface ReturnPayload {
  member: string;
  book: string;
  returnDate: string;
  fine: string;
}

export interface RenewPayload {
  period: string;
  expires: string;
  fee: string;
}

export interface MemberModalsProps {
  active: MemberModalId | null;
  row: Member | null;
  /** The live roster, so the Issue and Return selects follow the grid. */
  members: Member[];
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: MemberDraft) => void;
  onUpdate: (draft: MemberDraft) => void;
  onIssue: (payload: IssuePayload) => void;
  onReturn: (payload: ReturnPayload) => void;
  onRenew: (payload: RenewPayload) => void;
  onCollectFine: () => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View hand off to Issue, as the template's footer button does. */
  onOpen: (modal: MemberModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: MemberDraft;
  onField: (field: keyof MemberDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const MemberForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`name${suffix}`}>Name</label>
        <input
          type="text" className="form-control" id={`name${suffix}`} placeholder="Enter Name"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`card-no${suffix}`}>Card No</label>
        <input
          type="text" className="form-control" id={`card-no${suffix}`} placeholder="Enter Card No"
          value={draft.card} onChange={(event) => onField('card', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`email${suffix}`}>Email</label>
        <input
          type="text" className="form-control" id={`email${suffix}`} placeholder="Enter Email"
          value={draft.email} onChange={(event) => onField('email', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`date-of-join${suffix}`}>Date of Join</label>
        <div className="input-icon-end position-relative">
          <DateField
            value={draft.dateOfJoin}
            onChange={(next: string) => onField('dateOfJoin', next)}
            format="d/m/Y"
            id={`date-of-join${suffix}`}
            placeholder="12 Apr 2023"
          />
          <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`phone-number${suffix}`}>Phone Number</label>
        <input
          type="text" className="form-control" id={`phone-number${suffix}`} placeholder="Enter Phone Number"
          value={draft.phone} onChange={(event) => onField('phone', event.target.value)}
        />
      </div>

      {/* Membership fields the redesigned grid prints but the template's form omits. */}
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`member-id${suffix}`}>Member ID</label>
          <input
            type="text" className="form-control" id={`member-id${suffix}`} placeholder="AD202401"
            value={draft.memberId} onChange={(event) => onField('memberId', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`member-type${suffix}`}>Member Type</label>
          <select
            className="form-select" id={`member-type${suffix}`}
            value={draft.type} onChange={(event) => onField('type', event.target.value)}
          >
            {memberTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>

        {draft.type === 'Student' ? (
          <>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`class${suffix}`}>Class</label>
              <select
                className="form-select" id={`class${suffix}`}
                value={draft.classLevel} onChange={(event) => onField('classLevel', event.target.value)}
              >
                {classOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor={`section${suffix}`}>Section</label>
              <select
                className="form-select" id={`section${suffix}`}
                value={draft.section} onChange={(event) => onField('section', event.target.value)}
              >
                {sectionOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
          </>
        ) : (
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`department${suffix}`}>Department</label>
            <select
              className="form-select" id={`department${suffix}`}
              value={draft.department} onChange={(event) => onField('department', event.target.value)}
            >
              {departmentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        )}

        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`expiry${suffix}`}>Membership Expiry</label>
          <div className="input-icon-end position-relative">
            <DateField
              value={draft.expires}
              onChange={(next: string) => onField('expires', next)}
              format="d/m/Y"
              id={`expiry${suffix}`}
              placeholder="11 Apr 2025"
            />
            <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
          </div>
        </div></div>
        <div className="col-md-6"><div className="mb-0">
          <label className="form-label" htmlFor={`membership-status${suffix}`}>Membership Status</label>
          <select
            className="form-select" id={`membership-status${suffix}`}
            value={draft.status} onChange={(event) => onField('status', event.target.value)}
          >
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </div>
    </div>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const MemberModals = ({
  active, row, members, deleteCount, onClose, onCreate, onUpdate, onIssue, onReturn,
  onRenew, onCollectFine, onDelete, onImport, onToast, onOpen,
}: MemberModalsProps) => {
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft);
  const [member, setMember] = useState('');
  const [book, setBook] = useState('');
  const [issueDate, setIssueDate] = useState('08/05/2024');
  const [dueDate, setDueDate] = useState('22/05/2024');
  const [returnDate, setReturnDate] = useState('08/05/2024');
  const [returnFine, setReturnFine] = useState('0');
  const [period, setPeriod] = useState(renewalPeriods[0]);
  const [fee, setFee] = useState('10');
  const [mode, setMode] = useState(importModes[0]);

  const memberOptions = memberOptionsFrom(members);

  /** Each opening starts from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'issue') {
      setMember(row ? `${row.name} — ${row.card}` : '');
      setBook('');
      setIssueDate('08/05/2024');
      setDueDate('22/05/2024');
    }
    if (active === 'return') {
      setMember(row ? `${row.name} — ${row.card}` : '');
      setBook('');
      setReturnDate('08/05/2024');
      setReturnFine(row && row.overdue > 0 ? String(row.fine) : '0');
    }
    if (active === 'renew') {
      setPeriod(renewalPeriods[0]);
      setFee('10');
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof MemberDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The Renew dialog's read-only New Expiry, recomputed as the period changes. */
  const newExpiry = row ? expiryAfter(row.expires, period) : '';
  const fineLines = row ? fineLinesOf(row) : [];
  const fineTotal = fineLines.reduce((sum, line) => sum + line.amount, 0);

  return (
    <>
      {/* Add Member */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Member"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Member</button>
          </>
        }
      >
        <MemberForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Member */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Member"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <MemberForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Member */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Member Profile"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('issue')}>Issue Book</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.name}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    {statusIcon[row.status]
                      ? <i className={statusIcon[row.status] as string} />
                      : <span className="dt-pill-dot" />}
                    {row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{identityLineOf(row)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-calendar" />Membership</h6>
                <p className="fs-13 mb-0">{membershipSummaryOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-book" />Borrowing</h6>
                <p className="fs-13 mb-0">{borrowingSummaryOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-clock" />Last Visit</h6>
                <p className="fs-13 mb-0">{row.lastVisit} · Reference section.</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
                <div className="d-flex flex-wrap gap-1">
                  {attachmentsOf(row).map((file) => (
                    <span key={file.label} className={file.badge}>{file.label}</span>
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
        onSubmit={(event) => {
          event.preventDefault();
          onIssue({ member, book, issueDate, dueDate });
        }}
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
              value={member} onChange={(event) => setMember(event.target.value)}
            >
              <option value="">Select member</option>
              {memberOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="issue-book">
              Book <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="issue-book" required
              value={book} onChange={(event) => setBook(event.target.value)}
            >
              <option value="">Select book</option>
              {bookOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-date">Issue Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={issueDate}
                onChange={(next: string) => setIssueDate(next)}
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
                value={dueDate}
                onChange={(next: string) => setDueDate(next)}
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
        open={active === 'return'}
        onClose={onClose}
        title="Return Book"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onReturn({ member, book, returnDate, fine: returnFine });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Return Book</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="return-member">
              Member <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="return-member" required
              value={member} onChange={(event) => setMember(event.target.value)}
            >
              <option value="">Select member</option>
              {memberOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="issued-book">
              Issued Book <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="issued-book" required
              value={book} onChange={(event) => setBook(event.target.value)}
            >
              <option value="">Select issued book</option>
              {bookOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="return-date">Return Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={returnDate}
                onChange={(next: string) => setReturnDate(next)}
                format="d/m/Y"
                id="return-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fine-if-overdue">Fine (if overdue)</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="fine-if-overdue" min={0}
                value={returnFine} onChange={(event) => setReturnFine(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Renew Membership */}
      <Modal
        open={active === 'renew' && row !== null}
        onClose={onClose}
        title="Renew Membership"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onRenew({ period, expires: newExpiry, fee });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Renew Membership</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-user fs-16" />
              <span className="fs-13">{row.name} · {row.card} · expires {row.expires}</span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="renewal-period">Renewal Period</label>
                <select
                  className="form-select" id="renewal-period"
                  value={period} onChange={(event) => setPeriod(event.target.value)}
                >
                  {renewalPeriods.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="new-expiry">New Expiry</label>
                <input type="text" className="form-control" id="new-expiry" value={newExpiry} readOnly />
              </div>
              <div className="col-md-12">
                <label className="form-label" htmlFor="renewal-fee">Renewal Fee</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="renewal-fee" min={0}
                    value={fee} onChange={(event) => setFee(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Outstanding Fine Details */}
      <Modal
        open={active === 'fines' && row !== null}
        onClose={onClose}
        title="Outstanding Fine Details"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onCollectFine(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="submit" className="btn btn-primary" disabled={fineTotal === 0}>Collect Fine</button>
          </>
        }
      >
        {row && fineLines.length > 0 ? (
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr><th>Book</th><th>Days Overdue</th><th className="text-end">Fine</th></tr>
              </thead>
              <tbody>
                {fineLines.map((line) => (
                  <tr key={line.book}>
                    <td>{line.book}</td>
                    <td>{line.days}</td>
                    <td className="text-end">${line.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={2}>Total</th>
                  <th className="text-end text-danger">${fineTotal}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="fs-13 text-muted mb-0">
            {row ? `${row.name} has no outstanding fines.` : 'No outstanding fines.'}
          </p>
        )}
      </Modal>

      {/* Library Card Preview */}
      <Modal
        open={active === 'card' && row !== null}
        onClose={onClose}
        title="Library Card Preview"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`Library card queued for ${row?.name}`); }}
            >
              <i className="ti ti-printer me-1" />Print Card
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
              <span className="badge badge-soft-primary">Member Card</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="avatar avatar-xxl">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
              </span>
              <div className="flex-fill">
                <h5 className="mb-1">{row.name}</h5>
                <p className="fs-13 mb-1 text-muted">
                  Card No: <span className="fw-medium text-dark">{row.card}</span>
                </p>
                <p className="fs-13 mb-1 text-muted">
                  Member ID: <span className="fw-medium text-dark">{row.memberId}</span>
                </p>
                <p className="fs-13 mb-1 text-muted">
                  Member: <span className="fw-medium text-dark">{row.type} · {academicSummary(row)}</span>
                </p>
                <p className="fs-13 mb-0 text-muted">
                  Valid till: <span className="fw-medium text-dark">{row.expires}</span>
                </p>
              </div>
              <span className="avatar avatar-xl"><i className="ti ti-qrcode fs-40" /></span>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Import Members */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Members"
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
          <input type="file" aria-label="Members file" />
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
          You want to delete {deleteCount === 1 ? 'this member' : `all ${deleteCount} marked items`}, this
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

export default MemberModals;
