import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ExamModalId, ExamRow } from '../data/exams.data';
import { passPercent, timeRange, viewInstructions } from '../data/exams.data';

const routes = all_routes;

export interface ExamDraft {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ExamsModalsProps {
  active: ExamModalId | null;
  exam: ExamRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: ExamDraft) => void;
  onSave: (id: string, draft: ExamDraft) => void;
  onConfirmDelete: () => void;
}

const START_TIMES = ['Select', '09:30 AM', '10:30 AM', '11:00 AM', '12:30 PM'];
const END_TIMES = ['Select', '10:45 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

const EMPTY: ExamDraft = { name: '', date: '', startTime: 'Select', endTime: 'Select' };

const ExamForm = ({
  prefix,
  draft,
  namePlaceholder,
  datePlaceholder,
  onChange,
}: {
  prefix: string;
  draft: ExamDraft;
  namePlaceholder?: string;
  datePlaceholder?: string;
  onChange: (patch: Partial<ExamDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-name`}>
          Exam Name
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-name`}
          placeholder={namePlaceholder}
          value={draft.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-date`}>
          Exam Date
        </label>
        <div className="date-pic">
          <input
            type="text"
            className="form-control datetimepicker"
            id={`${prefix}-date`}
            placeholder={datePlaceholder}
            value={draft.date}
            onChange={(event) => onChange({ date: event.target.value })}
          />
          <span className="cal-icon">
            <i className="ti ti-calendar" />
          </span>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-start-time`}>
          Start Time
        </label>
        <select
          className="select"
          id={`${prefix}-start-time`}
          value={draft.startTime}
          onChange={(event) => onChange({ startTime: event.target.value })}
        >
          {START_TIMES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-end-time`}>
          End Time
        </label>
        <select
          className="select"
          id={`${prefix}-end-time`}
          value={draft.endTime}
          onChange={(event) => onChange({ endTime: event.target.value })}
        >
          {END_TIMES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const ExamsModals = ({
  active,
  exam,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: ExamsModalsProps) => {
  const [addDraft, setAddDraft] = useState<ExamDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<ExamDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new exams');

  useEffect(() => {
    if (active !== 'edit' || !exam) return;
    setEditDraft({
      name: exam.name,
      date: exam.date,
      // The dropdowns only carry the template's four fixed slots, so a row whose time is
      // not one of them falls back to the placeholder rather than adding a phantom option.
      startTime: START_TIMES.includes(exam.startTime) ? exam.startTime : 'Select',
      endTime: END_TIMES.includes(exam.endTime) ? exam.endTime : 'Select',
    });
  }, [active, exam]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  return (
    <>
      {/* Add Exam */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Exam"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addDraft);
          closeAdd();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Exam
            </button>
          </>
        }
      >
        <ExamForm
          prefix="exm-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Exam */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Exam"
        onSubmit={(event) => {
          event.preventDefault();
          if (exam) onSave(exam.id, editDraft);
          onClose();
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
        <ExamForm
          prefix="exm-edit"
          draft={editDraft}
          namePlaceholder="Enter Exam Name"
          datePlaceholder="Select"
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Exam Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Exam Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to={routes.examResult} className="btn btn-primary">
              View Results
            </Link>
          </>
        }
      >
        {exam ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-light text-${exam.tone} rounded d-inline-flex align-items-center justify-content-center me-2`}
              >
                <i className={`${exam.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {exam.name}{' '}
                  <span className={`dt-pill ${exam.pillClass} ms-1`}>
                    {exam.pillIcon ? <i className={exam.pillIcon} /> : <span className="dt-pill-dot" />}
                    {exam.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {exam.id} · {exam.type} · Class {exam.className}-{exam.section} · {exam.subject} ·{' '}
                  {exam.date} · {timeRange(exam)}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-list-check" />
                  Instructions
                </h6>
                <p className="fs-13 mb-0">{viewInstructions(exam)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-award" />
                  Marks
                </h6>
                <div className={`meter meter-${exam.meterTone} mb-1`}>
                  <span style={{ width: `${passPercent(exam)}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">
                  Total {exam.totalMarks} · Passing {exam.passMarks} · {exam.students} students registered
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-paperclip" />
                  Attachments
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge badge-soft-primary">Blueprint.pdf</span>
                  <span className="badge badge-soft-info">Seating.docx</span>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-shield-check" />
                  Coordinator
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={exam.teacher.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={exam.teacher.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{exam.teacher.name}</span>
                    <span className="fs-12 text-muted">{exam.subject} Dept</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Exams */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Exams"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          // The template carried this copy on the submit button's `data-success`.
          onToast('File queued — 10 exams validated.');
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
          <input type="file" aria-label="Exam file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="exm-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="exm-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new exams</option>
            <option>Update existing by code</option>
            <option>Create and update</option>
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
      </Modal>

      {/* Delete confirmation */}
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

export default ExamsModals;
