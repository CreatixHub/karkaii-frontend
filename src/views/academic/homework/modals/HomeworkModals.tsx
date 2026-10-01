import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type {
  HomeworkModalId,
  HomeworkRow,
  SubmissionRow,
  TabRow,
  TrackingRow,
} from '../data/homework.data';
import {
  gradingCriteria,
  homeworkAttachments,
  homeworkDescription,
  homeworkInstructions,
  learningObjectives,
  referenceMaterials,
  submissionSummary,
} from '../data/homework.data';

export interface HomeworkDraft {
  className: string;
  section: string;
  subject: string;
  homeworkDate: string;
  submissionDate: string;
  attachmentLink: string;
  description: string;
  active: boolean;
}

export interface GradeDraft {
  marks: string;
  outOf: string;
  grade: string;
  status: string;
  remarks: string;
}

export interface FeedbackDraft {
  type: string;
  message: string;
  notifyParent: boolean;
}

export interface HomeworkModalsProps {
  active: HomeworkModalId | null;
  row: TabRow | null;
  selectedCount: number;
  onClose: () => void;
  onAdd: (draft: HomeworkDraft) => void;
  onSave: (id: string, draft: HomeworkDraft) => void;
  onSaveGrade: (draft: GradeDraft) => void;
  onSendFeedback: (draft: FeedbackDraft) => void;
  onImport: (mode: string) => void;
  onConfirmDelete: () => void;
  /** Homework Details → Grade Submissions, and Analytics → Open Gradebook. */
  onGradebook: () => void;
}

/* ---------------------------- Template option sets --------------------------- */

const SECTIONS = ['Select', 'A', 'B', 'C'];
const SUBJECTS = ['Select', 'English', 'Physics', 'Chemsitry', 'Biology'];
const GRADES = ['A+', 'A', 'B+', 'B', 'C'];
const GRADE_STATUSES = ['Reviewed', 'Returned for revision', 'Pending'];
const FEEDBACK_TYPES = ['Appreciation', 'Improvement', 'Correction Needed'];
const IMPORT_MODES = ['Create new homework', 'Update existing by code', 'Create and update'];

const EMPTY_HOMEWORK: HomeworkDraft = {
  className: '',
  section: SECTIONS[0],
  subject: SUBJECTS[0],
  homeworkDate: '',
  submissionDate: '',
  attachmentLink: '',
  description: '',
  active: true,
};

const EMPTY_GRADE: GradeDraft = {
  marks: '',
  outOf: '',
  grade: 'A',
  status: 'Reviewed',
  remarks: '',
};

const EMPTY_FEEDBACK: FeedbackDraft = {
  type: FEEDBACK_TYPES[0],
  message: '',
  notifyParent: false,
};

/* --------------------------------- Helpers -------------------------------- */

const asHomework = (row: TabRow | null): HomeworkRow | null =>
  row && row.kind === 'homework' ? row : null;

const asSubmission = (row: TabRow | null): SubmissionRow | null =>
  row && row.kind === 'submission' ? row : null;

/** The subtitle line each dialog prints under its heading. */
const rowSubtitle = (row: TabRow): string => {
  switch (row.kind) {
    case 'homework':
      return `${row.id} · ${row.subject} · ${row.className}-${row.section} · Due ${row.due} · ${row.teacher}`;
    case 'tracking':
      return `${row.subject} · ${row.classLabel}`;
    case 'submission':
      return `${row.admission} · ${row.classLabel} · ${row.homework}`;
    case 'late':
    default:
      return `${row.classLabel} · ${row.homework} · Due ${row.due}`;
  }
};

const rowTitle = (row: TabRow): string =>
  row.kind === 'submission' ? row.student : row.kind === 'late' ? row.student : row.name;

/* --------------------------------- Fields --------------------------------- */

const DetailBlock = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) => (
  <div className="col-md-6">
    <h6 className="details-heading">
      <i className={icon} />
      {title}
    </h6>
    {children}
  </div>
);

const HomeworkForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: HomeworkDraft;
  onChange: (patch: Partial<HomeworkDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-class`}>
          Class
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-class`}
          value={draft.className}
          onChange={(event) => onChange({ className: event.target.value })}
        />
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-section`}>
              Section
            </label>
            <select
              className="form-select"
              id={`${prefix}-section`}
              value={draft.section}
              onChange={(event) => onChange({ section: event.target.value })}
            >
              {SECTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-subject`}>
              Subject
            </label>
            <select
              className="form-select"
              id={`${prefix}-subject`}
              value={draft.subject}
              onChange={(event) => onChange({ subject: event.target.value })}
            >
              {SUBJECTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-homework-date`}>
              Homework Date
            </label>
            <div className="input-icon-end position-relative">
              <input
                type="date"
                className="form-control"
                id={`${prefix}-homework-date`}
                value={draft.homeworkDate}
                onChange={(event) => onChange({ homeworkDate: event.target.value })}
              />
              <span className="input-icon-addon">
                <i className="ti ti-calendar" />
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-submission-date`}>
              Submission Date
            </label>
            <div className="input-icon-end position-relative">
              <input
                type="date"
                className="form-control"
                id={`${prefix}-submission-date`}
                value={draft.submissionDate}
                onChange={(event) => onChange({ submissionDate: event.target.value })}
              />
              <span className="input-icon-addon">
                <i className="ti ti-calendar" />
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* The template labels both of the next two fields "Attachments". */}
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-attachment`}>
          Attachments
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-attachment`}
          value={draft.attachmentLink}
          onChange={(event) => onChange({ attachmentLink: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-description`}>
          Attachments
        </label>
        <textarea
          className="form-control"
          rows={4}
          id={`${prefix}-description`}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="status-title">
          <h5>Status</h5>
          <p>Change the Status by toggle </p>
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`${prefix}-switch`}
            aria-label="Toggle option"
            checked={draft.active}
            onChange={(event) => onChange({ active: event.target.checked })}
          />
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------- Component ------------------------------- */

const HomeworkModals = ({
  active,
  row,
  selectedCount,
  onClose,
  onAdd,
  onSave,
  onSaveGrade,
  onSendFeedback,
  onImport,
  onConfirmDelete,
  onGradebook,
}: HomeworkModalsProps) => {
  const [addDraft, setAddDraft] = useState<HomeworkDraft>(EMPTY_HOMEWORK);
  const [editDraft, setEditDraft] = useState<HomeworkDraft>(EMPTY_HOMEWORK);
  const [gradeDraft, setGradeDraft] = useState<GradeDraft>(EMPTY_GRADE);
  const [feedbackDraft, setFeedbackDraft] = useState<FeedbackDraft>(EMPTY_FEEDBACK);
  const [importMode, setImportMode] = useState(IMPORT_MODES[0]);

  const homework = asHomework(row);
  const submission = asSubmission(row);

  // Seed Edit from the homework row that opened it.
  useEffect(() => {
    if (active !== 'edit' || !homework) return;
    setEditDraft({
      className: `${homework.className}-${homework.section}`,
      section: homework.section,
      subject: homework.subject,
      homeworkDate: '',
      submissionDate: '',
      attachmentLink: '',
      description: homeworkDescription(homework),
      active: homework.status !== 'Draft',
    });
  }, [active, homework]);

  // Grade opens against the submission's existing marks where the row carries them.
  useEffect(() => {
    if (active !== 'grade') return;
    setGradeDraft(
      submission
        ? { ...EMPTY_GRADE, grade: submission.grade || 'A', status: 'Reviewed' }
        : EMPTY_GRADE,
    );
  }, [active, submission]);

  const closeAdd = () => {
    setAddDraft(EMPTY_HOMEWORK);
    onClose();
  };

  return (
    <>
      {/* -------------------------------- Add Home Work ------------------------- */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Home Work"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addDraft);
          setAddDraft(EMPTY_HOMEWORK);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Homework
            </button>
          </>
        }
      >
        <HomeworkForm
          prefix="hw-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* ------------------------------- Edit Home Work ------------------------- */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Home Work"
        onSubmit={(event) => {
          event.preventDefault();
          if (homework) onSave(homework.id, editDraft);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <HomeworkForm
          prefix="hw-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* ------------------------------ Homework Details ------------------------ */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Homework Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <button type="button" className="btn btn-primary" onClick={onGradebook}>
              Grade Submissions
            </button>
          </>
        }
      >
        {homework ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-light text-${homework.tone} rounded d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0`}
              >
                <i className={`${homework.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {homework.name}{' '}
                  <span className={`dt-pill ${homework.pillClass} ms-1`}>
                    {homework.pillIcon ? (
                      <i className={homework.pillIcon} />
                    ) : (
                      <span className="dt-pill-dot" />
                    )}
                    {homework.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{rowSubtitle(homework)}</span>
              </div>
            </div>
            <div className="row g-3">
              <DetailBlock icon="ti ti-file-description" title="Description">
                <p className="fs-13 mb-0">{homeworkDescription(homework)}</p>
              </DetailBlock>
              <DetailBlock icon="ti ti-target" title="Learning Objectives">
                <ul className="fs-13 mb-0 ps-3">
                  {learningObjectives(homework.subject).map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </DetailBlock>
              <DetailBlock icon="ti ti-book" title="Reference Materials">
                <p className="fs-13 mb-0">{referenceMaterials(homework)}</p>
              </DetailBlock>
              <DetailBlock icon="ti ti-checklist" title="Submissions">
                <div className={`meter ${homework.meter} mb-1`}>
                  <span style={{ width: `${homework.percent}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">{submissionSummary(homework)}</p>
              </DetailBlock>
              <DetailBlock icon="ti ti-list-check" title="Instructions">
                <p className="fs-13 mb-0">{homeworkInstructions}</p>
              </DetailBlock>
              <DetailBlock icon="ti ti-user" title="Assigned By">
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={homework.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={homework.teacher}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{homework.teacher}</span>
                    <span className="fs-12 text-muted">{homework.subject} Dept</span>
                  </div>
                </div>
              </DetailBlock>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ------------------------------ Import Home Work ------------------------ */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Home Work"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onImport(importMode);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Import
            </button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Homework file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="hw-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="hw-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            {IMPORT_MODES.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample
            rows.
          </span>
        </div>
      </Modal>

      {/* ----------------------------- Student Submission ---------------------- */}
      <Modal
        open={active === 'submission'}
        onClose={onClose}
        title="Student Submission"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <button type="button" className="btn btn-primary" onClick={onGradebook}>
              Grade Submission
            </button>
          </>
        }
      >
        {submission ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath
                  src={submission.studentAvatar}
                  className="rounded-circle"
                  alt={submission.student}
                />
              </span>
              <div>
                <h5 className="mb-0">
                  {submission.student}{' '}
                  <span className={`dt-pill ${submission.reviewPill} ms-1`}>
                    <i className={submission.reviewIcon} />
                    {submission.review}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{rowSubtitle(submission)}</span>
              </div>
            </div>
            <div className="row g-3">
              <DetailBlock icon="ti ti-calendar-event" title="Submitted">
                <p className="fs-13 mb-0">
                  {submission.date} · {submission.time}
                </p>
              </DetailBlock>
              <DetailBlock icon="ti ti-file" title="Submission Type">
                <span className={`badge ${submission.typeBadge}`}>
                  <i className={`${submission.typeIcon} me-1`} />
                  {submission.type}
                </span>
              </DetailBlock>
              <DetailBlock icon="ti ti-award" title="Grade">
                <span className={`badge ${submission.gradeBadge}`}>{submission.grade}</span>
              </DetailBlock>
              <DetailBlock icon="ti ti-message-dots" title="Feedback">
                <span className={`badge ${submission.feedbackBadge}`}>
                  {submission.feedbackIcon ? (
                    <i className={`${submission.feedbackIcon} me-1`} />
                  ) : null}
                  {submission.feedback}
                </span>
              </DetailBlock>
              <DetailBlock icon="ti ti-list-details" title="Details">
                <ul className="fs-13 mb-0 ps-3">
                  {submission.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </DetailBlock>
              <DetailBlock icon="ti ti-paperclip" title="Attachments">
                <div className="d-flex flex-wrap gap-2">
                  {submission.attachments.map((attachment) => (
                    <span className={`badge ${attachment.badge}`} key={attachment.label}>
                      {attachment.icon ? <i className={`${attachment.icon} me-1`} /> : null}
                      {attachment.label}
                    </span>
                  ))}
                </div>
              </DetailBlock>
              <div className="col-md-12">
                <h6 className="details-heading">
                  <i className="ti ti-message" />
                  Comments
                </h6>
                <p className="fs-13 mb-0">{submission.comments}</p>
              </div>
              <div className="col-md-12">
                <h6 className="details-heading">
                  <i className="ti ti-history" />
                  History
                </h6>
                <ul className="list-unstyled mb-0">
                  {submission.history.map((entry) => (
                    <li className="fs-13 d-flex align-items-center gap-2 mb-1" key={entry.text}>
                      <i className={`${entry.icon} text-muted`} />
                      {entry.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ------------------------------- Grade Homework ------------------------- */}
      <Modal
        open={active === 'grade'}
        onClose={onClose}
        title="Grade Homework"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveGrade(gradeDraft);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Grade
            </button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          {row ? (row.kind === 'submission' ? row.homework : rowTitle(row)) : ''}
        </p>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="hw-marks-obtained">
                Marks Obtained
              </label>
              <input
                type="number"
                className="form-control"
                id="hw-marks-obtained"
                value={gradeDraft.marks}
                onChange={(event) =>
                  setGradeDraft((current) => ({ ...current, marks: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="hw-out-of">
                Out of
              </label>
              <input
                type="number"
                className="form-control"
                id="hw-out-of"
                value={gradeDraft.outOf}
                onChange={(event) =>
                  setGradeDraft((current) => ({ ...current, outOf: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="hw-grade">
                Grade
              </label>
              <select
                className="form-select"
                id="hw-grade"
                value={gradeDraft.grade}
                onChange={(event) =>
                  setGradeDraft((current) => ({ ...current, grade: event.target.value }))
                }
              >
                {GRADES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="hw-grade-status">
                Status
              </label>
              <select
                className="form-select"
                id="hw-grade-status"
                value={gradeDraft.status}
                onChange={(event) =>
                  setGradeDraft((current) => ({ ...current, status: event.target.value }))
                }
              >
                {GRADE_STATUSES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Rubric</label>
              <ul className="list-unstyled mb-0">
                {gradingCriteria.map((criterion) => (
                  <li
                    className="d-flex align-items-center justify-content-between fs-13 py-1 border-bottom"
                    key={criterion.label}
                  >
                    <span className="text-muted">{criterion.label}</span>
                    <span className="fw-medium">{criterion.weight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="hw-remarks">
                Remarks
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="hw-remarks"
                value={gradeDraft.remarks}
                onChange={(event) =>
                  setGradeDraft((current) => ({ ...current, remarks: event.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Teacher Feedback ------------------------ */}
      <Modal
        open={active === 'feedback'}
        onClose={onClose}
        title="Teacher Feedback"
        onSubmit={(event) => {
          event.preventDefault();
          onSendFeedback(feedbackDraft);
          setFeedbackDraft(EMPTY_FEEDBACK);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Send Feedback
            </button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">{row ? rowTitle(row) : ''}</p>
        <div className="mb-3">
          <label className="form-label" htmlFor="hw-feedback-type">
            Feedback Type
          </label>
          <select
            className="form-select"
            id="hw-feedback-type"
            value={feedbackDraft.type}
            onChange={(event) =>
              setFeedbackDraft((current) => ({ ...current, type: event.target.value }))
            }
          >
            {FEEDBACK_TYPES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="hw-feedback-message">
            Message
          </label>
          <textarea
            className="form-control"
            rows={4}
            id="hw-feedback-message"
            value={feedbackDraft.message}
            onChange={(event) =>
              setFeedbackDraft((current) => ({ ...current, message: event.target.value }))
            }
          />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fs-15">Notify parent</h5>
            <p className="fs-12 text-muted mb-0">Send a copy to the parent portal</p>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="hw-notify-parent"
              aria-label="Notify parent"
              checked={feedbackDraft.notifyParent}
              onChange={(event) =>
                setFeedbackDraft((current) => ({ ...current, notifyParent: event.target.checked }))
              }
            />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Homework Analytics ---------------------- */}
      <Modal
        open={active === 'analytics'}
        onClose={onClose}
        title="Homework Analytics"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <button type="button" className="btn btn-primary" onClick={onGradebook}>
              Open Gradebook
            </button>
          </>
        }
      >
        {row && (row.kind === 'homework' || row.kind === 'tracking') ? (
          <AnalyticsBody row={row} />
        ) : null}
      </Modal>

      {/* --------------------------- Delete confirmation ----------------------- */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirmDelete();
        }}
      >
        <span className="delete-icon">
          <i className="ti ti-trash-x" />
        </span>
        <h4>Confirm Deletion</h4>
        <p>
          {selectedCount > 1
            ? `You want to delete all the ${selectedCount} marked items, this cant be undone once you delete.`
            : 'You want to delete all the marked items, this cant be undone once you delete.'}
        </p>
        <div className="d-flex justify-content-center">
          <Link to="#" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </Link>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

/**
 * The analytics sheet — five stat tiles and a grade spread. The template printed Reading
 * Comprehension's own figures (38/42 submitted, 30/38 graded, 82 % average, A 17 · B 11 · C 2);
 * they are derived here so every row gets a truthful sheet. The grade spread splits the graded
 * count on the template's own 57 / 37 / 6 ratio, which is what its three numbers work out to.
 */
const AnalyticsBody = ({ row }: { row: HomeworkRow | TrackingRow }) => {
  const submitted = row.submitted;
  const total = row.total;
  const graded = row.kind === 'homework' ? Math.max(submitted - row.late, 0) : row.reviewed;
  const average = row.kind === 'homework' ? row.percent : row.score;
  const pending = row.pending;
  const late = row.kind === 'homework' ? row.late : 0;
  const returned = row.kind === 'tracking' ? row.returned : row.files;

  const spread = [
    { grade: 'A', count: Math.round(graded * 0.57) },
    { grade: 'B', count: Math.round(graded * 0.37) },
    { grade: 'C', count: graded - Math.round(graded * 0.57) - Math.round(graded * 0.37) },
  ];

  const subtitle =
    row.kind === 'homework'
      ? `${row.subject} · ${row.className}-${row.section} · ${row.teacher}`
      : `${row.subject} · ${row.classLabel}`;

  return (
    <>
      <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
        <span
          className={`avatar avatar-lg bg-light text-${row.tone} rounded d-inline-flex align-items-center justify-content-center me-2 flex-shrink-0`}
        >
          <i className={`${row.icon} fs-20`} />
        </span>
        <div>
          <h5 className="mb-0">{row.name}</h5>
          <span className="fs-12 text-muted">{subtitle}</span>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-md-4">
          <span className="fs-12 text-muted d-block">Submitted</span>
          <span className="fs-12 fw-medium">
            {submitted} / {total}
          </span>
        </div>
        <div className="col-6 col-md-4">
          <span className="fs-12 text-muted d-block">Graded</span>
          <span className="fs-12 fw-medium">
            {graded} / {submitted}
          </span>
        </div>
      </div>

      <div className="row g-3 text-center mb-3">
        <div className="col">
          <h5 className="mb-0">{average}%</h5>
          <span className="fs-12 text-muted">Avg Score</span>
        </div>
        <div className="col">
          <h5 className="mb-0">{pending}</h5>
          <span className="fs-12 text-muted">Pending</span>
        </div>
        <div className="col">
          <h5 className="mb-0">{late}</h5>
          <span className="fs-12 text-muted">Late</span>
        </div>
        <div className="col">
          <h5 className="mb-0">{returned}</h5>
          <span className="fs-12 text-muted">Returned</span>
        </div>
      </div>

      <h6 className="details-heading">
        <i className="ti ti-chart-bar" />
        Grade Spread
      </h6>
      <ul className="list-unstyled mb-3">
        {spread.map((entry) => (
          <li
            className="d-flex align-items-center justify-content-between py-1 border-bottom"
            key={entry.grade}
          >
            <span className="fs-12 text-muted">{entry.grade}</span>
            <span className="fs-12 fw-medium">{entry.count}</span>
          </li>
        ))}
      </ul>

      <h6 className="details-heading">
        <i className="ti ti-paperclip" />
        Attachments
      </h6>
      <div className="d-flex flex-wrap gap-2">
        {homeworkAttachments.map((attachment) => (
          <span className={`badge ${attachment.badge}`} key={attachment.label}>
            {attachment.icon ? <i className={`${attachment.icon} me-1`} /> : null}
            {attachment.label}
          </span>
        ))}
      </div>
    </>
  );
};

export default HomeworkModals;
