import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import type { AdmitCardModalId, AdmitCardStudent, Examination, SavedBatch } from '../data/admitCard.data';
import { batchSummary, savedBatches } from '../data/admitCard.data';

export interface MailDraft {
  sendTo: string;
  delivery: string;
  to: string;
  cc: string;
  subject: string;
  message: string;
  copyExamCell: boolean;
}

export interface BulkMailDraft {
  batch: string;
  recipients: string;
  subject: string;
  message: string;
  skipPending: boolean;
}

export interface AdmitCardModalsProps {
  active: AdmitCardModalId | null;
  student: AdmitCardStudent;
  examination: Examination;
  /** The batch the toolbar currently has selected, pre-filled into the bulk dialog. */
  batch: SavedBatch;
  onClose: () => void;
  onSend: (message: string) => void;
}

const SEND_TO_OPTIONS = ['Parent / Guardian', 'Student', 'Parent & Student'];
const DELIVERY_OPTIONS = ['Send now', 'Schedule for tomorrow 08:00 AM'];
const RECIPIENT_OPTIONS = ['Parents / Guardians', 'Students', 'Parents & Students'];

/** The counts the bulk dialog quotes in its alert and its submit button. */
const pendingCount = batchSummary.find((item) => item.id === 'pending')?.value ?? '0';
const emailCount = batchSummary.find((item) => item.id === 'emails')?.value ?? '0';

const mailBody = (examination: Examination) =>
  `Dear Parent,\n\nPlease find attached the admit card for the ${examination.label} commencing ${examination.commencing}. Kindly ensure the candidate carries a printed copy along with the school identity card to every session.\n\nRegards,\nExamination Cell, Global International School`;

const bulkBody = (examination: Examination) =>
  `Dear Parent, the admit card for the ${examination.label} is attached. Please print a copy and ensure the candidate carries it to every session along with the school identity card.`;

const AdmitCardModals = ({
  active,
  student,
  examination,
  batch,
  onClose,
  onSend,
}: AdmitCardModalsProps) => {
  const [mail, setMail] = useState<MailDraft>({
    sendTo: SEND_TO_OPTIONS[0],
    delivery: DELIVERY_OPTIONS[0],
    to: student.parentEmail,
    cc: '',
    subject: examination.mailSubject,
    message: mailBody(examination),
    copyExamCell: true,
  });

  const [bulk, setBulk] = useState<BulkMailDraft>({
    batch: batch.label,
    recipients: RECIPIENT_OPTIONS[0],
    subject: examination.mailSubject,
    message: bulkBody(examination),
    skipPending: true,
  });

  // Re-seed each dialog as it opens, so it always reflects the current selection.
  useEffect(() => {
    if (active !== 'sendMail') return;
    setMail({
      sendTo: SEND_TO_OPTIONS[0],
      delivery: DELIVERY_OPTIONS[0],
      to: student.parentEmail,
      cc: '',
      subject: examination.mailSubject,
      message: mailBody(examination),
      copyExamCell: true,
    });
  }, [active, student, examination]);

  useEffect(() => {
    if (active !== 'sendBulkMail') return;
    setBulk({
      batch: batch.label,
      recipients: RECIPIENT_OPTIONS[0],
      subject: examination.mailSubject,
      message: bulkBody(examination),
      skipPending: true,
    });
  }, [active, batch, examination]);

  const patchMail = (patch: Partial<MailDraft>) => setMail((current) => ({ ...current, ...patch }));
  const patchBulk = (patch: Partial<BulkMailDraft>) =>
    setBulk((current) => ({ ...current, ...patch }));

  return (
    <>
      {/* Email Admit Card Modal */}
      <Modal
        open={active === 'sendMail'}
        onClose={onClose}
        title="Email Admit Card"
        titleIcon="ti ti-mail"
        dialogClassName="modal-lg"
        titleAccessory={
          <span className="ms-2 fs-12 text-muted">
            {student.name} &nbsp;•&nbsp; {student.id} &nbsp;•&nbsp; {student.classSection}
          </span>
        }
        onSubmit={(event) => {
          event.preventDefault();
          onSend(`Admit card emailed to ${mail.to}.`);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
              <i className="ti ti-send me-1" />
              Send Email
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-send-to">
                Send To
              </label>
              <select
                className="form-select"
                id="ac-send-to"
                value={mail.sendTo}
                onChange={(event) => patchMail({ sendTo: event.target.value })}
              >
                {SEND_TO_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-delivery">
                Delivery
              </label>
              <select
                className="form-select"
                id="ac-delivery"
                value={mail.delivery}
                onChange={(event) => patchMail({ delivery: event.target.value })}
              >
                {DELIVERY_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-to">
                To
              </label>
              <input
                type="email"
                className="form-control"
                id="ac-to"
                value={mail.to}
                onChange={(event) => patchMail({ to: event.target.value })}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-cc">
                CC
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="exams@karkaii.com"
                id="ac-cc"
                value={mail.cc}
                onChange={(event) => patchMail({ cc: event.target.value })}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-subject">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="ac-subject"
                value={mail.subject}
                onChange={(event) => patchMail({ subject: event.target.value })}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-message">
                Message
              </label>
              <textarea
                className="form-control"
                rows={4}
                id="ac-message"
                value={mail.message}
                onChange={(event) => patchMail({ message: event.target.value })}
              />
            </div>
          </div>
          <div className="col-md-12">
            <label className="form-label">Attachment</label>
            <div className="border rounded d-flex align-items-center justify-content-between flex-wrap gap-2 p-2 mb-3">
              <span className="d-flex align-items-center">
                <span className="avatar avatar-sm bg-danger-transparent text-danger rounded me-2">
                  <i className="ti ti-file-type-pdf" />
                </span>
                <span>
                  <span className="fs-13 fw-medium d-block">{student.attachment}</span>
                  <span className="fs-12 text-muted">
                    {student.attachmentSize} &nbsp;•&nbsp; Generated {student.issuedOn}
                  </span>
                </span>
              </span>
              <span className="badge badge-soft-success">Attached</span>
            </div>
          </div>
          <div className="col-md-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h5 className="mb-0 fs-15">Send a copy to the examination cell</h5>
                <p className="fs-12 mb-0">A delivery record is stored in the communication log</p>
              </div>
              <div className="status-toggle modal-status">
                <input
                  type="checkbox"
                  id="ac-mail-copy-exam-cell"
                  className="check"
                  checked={mail.copyExamCell}
                  onChange={(event) => patchMail({ copyExamCell: event.target.checked })}
                />
                <label htmlFor="ac-mail-copy-exam-cell" className="checktoggle">
                  {' '}
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Email Admit Card Modal */}

      {/* Email Batch Modal */}
      <Modal
        open={active === 'sendBulkMail'}
        onClose={onClose}
        title="Email Admit Cards to Batch"
        titleIcon="ti ti-mail-forward"
        dialogClassName="modal-lg"
        titleAccessory={
          <span className="ms-2 fs-12 text-muted">
            {examination.label} &nbsp;•&nbsp; {bulk.batch}
          </span>
        }
        onSubmit={(event) => {
          event.preventDefault();
          onSend(`Batch email queued for ${emailCount} students in ${bulk.batch}.`);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
              <i className="ti ti-send me-1" />
              Send to {emailCount} Students
            </button>
          </>
        }
      >
        <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <i className="ti ti-alert-triangle me-2" />
          <span className="fs-13">
            {pendingCount} students have a pending admit card. They are excluded unless you turn
            off the skip option below.
          </span>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-batch">
                Batch
              </label>
              <select
                className="form-select"
                id="ac-batch"
                value={bulk.batch}
                onChange={(event) => patchBulk({ batch: event.target.value })}
              >
                {savedBatches.map((item) => (
                  <option key={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-recipients">
                Recipients
              </label>
              <select
                className="form-select"
                id="ac-recipients"
                value={bulk.recipients}
                onChange={(event) => patchBulk({ recipients: event.target.value })}
              >
                {RECIPIENT_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-subject-2">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="ac-subject-2"
                value={bulk.subject}
                onChange={(event) => patchBulk({ subject: event.target.value })}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="ac-message-2">
                Message
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="ac-message-2"
                value={bulk.message}
                onChange={(event) => patchBulk({ message: event.target.value })}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="border rounded overflow-hidden mb-3">
              <ul className="list-group list-group-flush">
                {batchSummary.map((item) => (
                  <li
                    className="list-group-item d-flex align-items-center justify-content-between"
                    key={item.id}
                  >
                    <span className="fs-13 text-muted">{item.label}</span>
                    {item.badge ? (
                      <span className={`badge ${item.badge}`}>{item.value}</span>
                    ) : (
                      <span className="fs-13 fw-medium">{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h5 className="mb-0 fs-15">Skip students with pending admit cards</h5>
                <p className="fs-12 mb-0">Only generated cards are attached to the batch email</p>
              </div>
              <div className="status-toggle modal-status">
                <input
                  type="checkbox"
                  id="ac-mail-skip-pending"
                  className="check"
                  checked={bulk.skipPending}
                  onChange={(event) => patchBulk({ skipPending: event.target.checked })}
                />
                <label htmlFor="ac-mail-skip-pending" className="checktoggle">
                  {' '}
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Email Batch Modal */}
    </>
  );
};

export default AdmitCardModals;
