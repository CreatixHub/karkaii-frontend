import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { Book, BookStatus } from '../data/books.data';
import {
  availabilityPct,
  categoryOptions,
  editionOptions,
  languageOptions,
  meterTint,
  statusOptions,
  statusPill,
} from '../data/books.data';

export type BookModalId =
  | 'add' | 'edit' | 'view' | 'issue' | 'reserve'
  | 'availability' | 'barcode' | 'qr' | 'import' | 'delete';

export interface BookDraft {
  title: string;
  code: string;
  shelf: string;
  publisher: string;
  author: string;
  category: string;
  total: string;
  available: string;
  /** The template's Price field; the redesigned grid has no column for it. */
  price: string;
  added: string;
  isbn: string;
  edition: string;
  language: string;
  status: BookStatus;
}

export const emptyDraft: BookDraft = {
  title: '', code: '', shelf: '', publisher: '', author: '', category: categoryOptions[0],
  total: '', available: '', price: '', added: '', isbn: '', edition: editionOptions[0],
  language: languageOptions[0], status: 'Available',
};

export const draftOf = (row: Book): BookDraft => ({
  title: row.title,
  code: row.code,
  shelf: row.shelf,
  publisher: row.publisher,
  author: row.author,
  category: row.category,
  total: String(row.total),
  available: String(row.available),
  price: '',
  added: row.added,
  isbn: row.isbn,
  edition: row.edition,
  language: row.language,
  status: row.status,
});

/** The four members the template's Issue and Reserve selects offer. */
export const memberOptions = [
  'Janet Daniel · LIB-0012',
  'Joann Michael · LIB-0013',
  'Teressa Bize · LIB-0201',
  'George Kelly · LIB-0305',
];

export const importModes = ['Create new books', 'Update existing by ISBN', 'Create and update'];

/** One copy per physical volume, coloured by what the row says it is doing. */
export interface Copy {
  label: string;
  barcode: string;
  status: 'Available' | 'Issued' | 'Reserved' | 'Unavailable';
}

export const copiesOf = (row: Book): Copy[] => {
  const suffix = row.code.replace(/\D/g, '');
  return Array.from({ length: row.total }, (_, index) => {
    const status: Copy['status'] =
      index < row.available ? 'Available'
        : index < row.available + row.issued ? 'Issued'
          : index < row.available + row.issued + row.reserved ? 'Reserved'
            : 'Unavailable';
    return {
      label: `Copy ${index + 1}`,
      barcode: `BC-${suffix}-${String(index + 1).padStart(2, '0')}`,
      status,
    };
  });
};

const copyBadge: Record<Copy['status'], string> = {
  Available: 'badge badge-soft-success',
  Issued: 'badge badge-soft-primary',
  Reserved: 'badge badge-soft-warning',
  Unavailable: 'badge badge-soft-secondary',
};

export interface BookModalsProps {
  active: BookModalId | null;
  row: Book | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: BookDraft) => void;
  onUpdate: (draft: BookDraft) => void;
  onIssue: (member: string) => void;
  onReserve: (member: string) => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View hand off to Issue, as the template's footer button does. */
  onOpen: (modal: BookModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: BookDraft;
  onField: (field: keyof BookDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const BookForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`book-name${suffix}`}>Book Name</label>
        <input
          type="text" className="form-control" id={`book-name${suffix}`} placeholder="Enter Book Name"
          value={draft.title} onChange={(event) => onField('title', event.target.value)}
        />
      </div>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`book-no${suffix}`}>Book No</label>
          <input
            type="text" className="form-control" id={`book-no${suffix}`} placeholder="Enter Book No"
            value={draft.code} onChange={(event) => onField('code', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rack-no${suffix}`}>Rack No</label>
          <input
            type="text" className="form-control" id={`rack-no${suffix}`} placeholder="Enter Rack No"
            value={draft.shelf} onChange={(event) => onField('shelf', event.target.value)}
          />
        </div></div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`publisher${suffix}`}>Publisher</label>
        <input
          type="text" className="form-control" id={`publisher${suffix}`} placeholder="Enter Publisher"
          value={draft.publisher} onChange={(event) => onField('publisher', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`author${suffix}`}>Author</label>
        <input
          type="text" className="form-control" id={`author${suffix}`} placeholder="Enter Author"
          value={draft.author} onChange={(event) => onField('author', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`subject${suffix}`}>Subject</label>
        <select
          className="form-select" id={`subject${suffix}`}
          value={draft.category} onChange={(event) => onField('category', event.target.value)}
        >
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`qty${suffix}`}>Qty</label>
          <input
            type="text" className="form-control" id={`qty${suffix}`} placeholder="Enter Qty"
            value={draft.total} onChange={(event) => onField('total', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`available${suffix}`}>Available</label>
          <input
            type="text" className="form-control" id={`available${suffix}`} placeholder="Enter Available"
            value={draft.available} onChange={(event) => onField('available', event.target.value)}
          />
        </div></div>
      </div>

      {/* Catalogue fields the redesigned grid prints but the template's form omits. */}
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`isbn${suffix}`}>ISBN</label>
          <input
            type="text" className="form-control" id={`isbn${suffix}`} placeholder="978-1250301697"
            value={draft.isbn} onChange={(event) => onField('isbn', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`edition${suffix}`}>Edition</label>
          <select
            className="form-select" id={`edition${suffix}`}
            value={draft.edition} onChange={(event) => onField('edition', event.target.value)}
          >
            {editionOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`language${suffix}`}>Language</label>
          <select
            className="form-select" id={`language${suffix}`}
            value={draft.language} onChange={(event) => onField('language', event.target.value)}
          >
            {languageOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`status${suffix}`}>Status</label>
          <select
            className="form-select" id={`status${suffix}`}
            value={draft.status} onChange={(event) => onField('status', event.target.value)}
          >
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor={`price${suffix}`}>Price</label>
        <input
          type="text" className="form-control" id={`price${suffix}`} placeholder="Enter Price"
          value={draft.price} onChange={(event) => onField('price', event.target.value)}
        />
      </div>
      <div className="mb-0">
        <label className="form-label" htmlFor={`post-date${suffix}`}>Post Date</label>
        <DateField
          value={draft.added}
          onChange={(value) => onField('added', value)}
          format="d M Y"
          id={`post-date${suffix}`}
          placeholder="12 Jan 2024"
          withIcon
        />
      </div>
    </div>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const BookModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onIssue, onReserve,
  onDelete, onImport, onToast, onOpen,
}: BookModalsProps) => {
  const [draft, setDraft] = useState<BookDraft>(emptyDraft);
  const [member, setMember] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [labels, setLabels] = useState('6');
  const [issueDate, setIssueDate] = useState('08/05/2024');
  const [dueDate, setDueDate] = useState('22/05/2024');
  const [reserveUntil, setReserveUntil] = useState('15/05/2024');
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening starts from the row being edited, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'issue' || active === 'reserve') {
      setMember('');
      setPriority('Normal');
    }
    if (active === 'barcode' || active === 'qr') setLabels('6');
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof BookDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const bookLabel = row ? `${row.title} · ${row.code}` : '';

  return (
    <>
      {/* Add Book */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Book"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Book</button>
          </>
        }
      >
        <BookForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Book */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Book"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <BookForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Book */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Book Details"
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
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-book fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.title}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.isbn} · {row.code} · {row.edition} · Shelf {row.shelf}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user-edit" />Author &amp; Publisher</h6>
                <p className="fs-13 mb-0">{row.author} · {row.publisher} · {row.language}.</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-stack-2" />Inventory</h6>
                <div className={`meter meter-${meterTint(row)} mb-1`}>
                  <span style={{ width: `${availabilityPct(row)}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">
                  {row.total} total · {row.available} available · {row.issued} issued · {row.reserved} reserved
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-map-pin" />Location</h6>
                <p className="fs-13 mb-0">{row.category} · Shelf {row.shelf} · added {row.added}.</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-barcode" />Codes</h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge badge-soft-secondary">Barcode</span>
                  <span className="badge badge-soft-secondary">QR</span>
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
        onSubmit={(event) => { event.preventDefault(); onIssue(member); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Issue Book</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="issue-book-title">
              Book <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" id="issue-book-title" value={bookLabel} readOnly />
          </div>
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
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-date">Issue Date</label>
            <DateField
              value={issueDate}
              onChange={setIssueDate}
              format="d/m/Y"
              id="issue-date"
              withIcon
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-due-date">Due Date</label>
            <DateField
              value={dueDate}
              onChange={setDueDate}
              format="d/m/Y"
              id="issue-due-date"
              withIcon
            />
          </div>
        </div>
      </Modal>

      {/* Reserve Book */}
      <Modal
        open={active === 'reserve'}
        onClose={onClose}
        title="Reserve Book"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onReserve(member); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Reserve Book</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="reserve-book-title">
              Book <span className="text-danger">*</span>
            </label>
            <input type="text" className="form-control" id="reserve-book-title" value={bookLabel} readOnly />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="reserve-member">
              Member <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="reserve-member" required
              value={member} onChange={(event) => setMember(event.target.value)}
            >
              <option value="">Select member</option>
              {memberOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="reserve-until">Reserve Until</label>
            <DateField
              value={reserveUntil}
              onChange={setReserveUntil}
              format="d/m/Y"
              id="reserve-until"
              withIcon
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="reserve-priority">Priority</label>
            <select
              className="form-select" id="reserve-priority"
              value={priority} onChange={(event) => setPriority(event.target.value)}
            >
              <option>Normal</option>
              <option>High</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Book Availability */}
      <Modal
        open={active === 'availability' && row !== null}
        onClose={onClose}
        title="Book Availability"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              disabled={!row || row.available === 0}
              onClick={() => onOpen('issue')}
            >
              Issue Available Copy
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-book fs-16" />
              <span className="fs-13">{row.title} · {row.code} · Shelf {row.shelf}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr><th>Copy</th><th>Barcode</th><th className="text-end">Status</th></tr>
                </thead>
                <tbody>
                  {copiesOf(row).map((copy) => (
                    <tr key={copy.barcode}>
                      <td>{copy.label}</td>
                      <td>{copy.barcode}</td>
                      <td className="text-end"><span className={copyBadge[copy.status]}>{copy.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print Barcode */}
      <Modal
        open={active === 'barcode' && row !== null}
        onClose={onClose}
        title="Print Barcode"
        bodyClassName="text-center"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`${labels} barcode labels queued for ${row?.code}`); }}
            >
              <i className="ti ti-printer me-1" />Print Barcode
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-4 d-inline-block">
              <h5 className="mb-1 fs-15">{row.title}</h5>
              <span className="fs-12 text-muted d-block mb-2">{row.code} · Shelf {row.shelf}</span>
              <i className="ti ti-barcode" style={{ fontSize: 64, lineHeight: 1 }} />
              <span className="fs-13 d-block mt-1">{row.isbn.replace(/-/g, ' ')}</span>
            </div>
            <div className="mt-3">
              <label className="form-label" htmlFor="barcode-labels">Number of labels</label>
              <input
                type="number" className="form-control w-auto mx-auto" id="barcode-labels" min={1}
                value={labels} onChange={(event) => setLabels(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print QR Code */}
      <Modal
        open={active === 'qr' && row !== null}
        onClose={onClose}
        title="Print QR Code"
        bodyClassName="text-center"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`${labels} QR labels queued for ${row?.code}`); }}
            >
              <i className="ti ti-printer me-1" />Print QR Code
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-4 d-inline-block">
              <h5 className="mb-1 fs-15">{row.title}</h5>
              <span className="fs-12 text-muted d-block mb-2">{row.code} · ISBN {row.isbn}</span>
              <i className="ti ti-qrcode" style={{ fontSize: 96, lineHeight: 1 }} />
            </div>
            <div className="mt-3">
              <label className="form-label" htmlFor="qr-labels">Number of labels</label>
              <input
                type="number" className="form-control w-auto mx-auto" id="qr-labels" min={1}
                value={labels} onChange={(event) => setLabels(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Books */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Books"
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
          <input type="file" aria-label="Books file" />
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
          You want to delete {deleteCount === 1 ? 'this book' : `all ${deleteCount} marked items`}, this
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

export default BookModals;
