import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ResultModalId, ResultRow, ResultStatus } from '../data/examResults.data';
import {
  addStatusOptions,
  componentsCopy,
  examOptions,
  formToasts,
  marksSummary,
  modalRemarkCopy,
  resultStatuses,
  studentMeta,
  subjectOptions,
} from '../data/examResults.data';

export interface ResultDraft {
  student: string;
  exam: string;
  subject: string;
  obtained: string;
  max: string;
  status: ResultStatus;
  rank: string;
  grade: string;
  remarks: string;
}

export interface ResultsModalsProps {
  active: ResultModalId | null;
  result: ResultRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: ResultDraft) => void;
  onSave: (id: string, draft: ResultDraft) => void;
  onConfirmDelete: () => void;
  onDownloadMarksheet: () => void;
}

const EMPTY: ResultDraft = {
  student: '',
  exam: '',
  subject: '',
  obtained: '',
  max: '',
  status: 'Draft',
  rank: '',
  grade: '',
  remarks: '',
};

const ResultsModals = ({
  active,
  result,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onDownloadMarksheet,
}: ResultsModalsProps) => {
  const [addDraft, setAddDraft] = useState<ResultDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<ResultDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new results');

  useEffect(() => {
    if (active !== 'edit' || !result) return;
    setEditDraft({
      student: `${result.name} — ${result.admissionNo}`,
      exam: result.exam,
      subject: result.subject,
      obtained: String(result.obtained),
      max: String(result.max),
      status: result.status,
      rank: result.rank,
      grade: result.grade,
      remarks: result.detail.teacherRemark,
    });
  }, [active, result]);

  const patchAdd = (patch: Partial<ResultDraft>) => setAddDraft((current) => ({ ...current, ...patch }));
  const patchEdit = (patch: Partial<ResultDraft>) => setEditDraft((current) => ({ ...current, ...patch }));

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  return (
    <>
      {/* Add Result */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Result"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addDraft);
          closeAdd();
          onToast(formToasts.add);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Save Result
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="er-add-student">
              Student
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search student by name or admission no"
              required
              id="er-add-student"
              value={addDraft.student}
              onChange={(event) => patchAdd({ student: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-add-examination">
              Examination
            </label>
            <select
              className="form-select"
              required
              id="er-add-examination"
              value={addDraft.exam}
              onChange={(event) => patchAdd({ exam: event.target.value })}
            >
              <option value="">Select exam</option>
              {examOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-add-subject">
              Subject
            </label>
            <select
              className="form-select"
              required
              id="er-add-subject"
              value={addDraft.subject}
              onChange={(event) => patchAdd({ subject: event.target.value })}
            >
              <option value="">Select subject</option>
              {subjectOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-add-obtained">
              Obtained Marks
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              required
              id="er-add-obtained"
              value={addDraft.obtained}
              onChange={(event) => patchAdd({ obtained: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-add-maximum">
              Maximum Marks
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="100"
              required
              id="er-add-maximum"
              value={addDraft.max}
              onChange={(event) => patchAdd({ max: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-add-status">
              Result Status
            </label>
            <select
              className="form-select"
              id="er-add-status"
              value={addDraft.status}
              onChange={(event) => patchAdd({ status: event.target.value as ResultStatus })}
            >
              {addStatusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-add-rank">
              Rank
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              id="er-add-rank"
              value={addDraft.rank}
              onChange={(event) => patchAdd({ rank: event.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Marks */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Marks"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (result) onSave(result.id, editDraft);
          onClose();
          onToast(formToasts.edit);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit">
              Save Changes
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="er-edit-student">
              Student
            </label>
            <input
              type="text"
              className="form-control"
              required
              id="er-edit-student"
              value={editDraft.student}
              onChange={(event) => patchEdit({ student: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-edit-obtained">
              Obtained Marks
            </label>
            <input
              type="number"
              className="form-control"
              required
              id="er-edit-obtained"
              value={editDraft.obtained}
              onChange={(event) => patchEdit({ obtained: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-edit-maximum">
              Maximum Marks
            </label>
            <input
              type="number"
              className="form-control"
              required
              id="er-edit-maximum"
              value={editDraft.max}
              onChange={(event) => patchEdit({ max: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-edit-grade">
              Grade
            </label>
            <input
              type="text"
              className="form-control"
              id="er-edit-grade"
              value={editDraft.grade}
              onChange={(event) => patchEdit({ grade: event.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="er-edit-status">
              Result Status
            </label>
            <select
              className="form-select"
              id="er-edit-status"
              value={editDraft.status}
              onChange={(event) => patchEdit({ status: event.target.value as ResultStatus })}
            >
              {resultStatuses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="er-edit-remarks">
              Teacher Remarks
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="er-edit-remarks"
              value={editDraft.remarks}
              onChange={(event) => patchEdit({ remarks: event.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Result Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Result Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onDownloadMarksheet}>
              Download Marksheet
            </Link>
          </>
        }
      >
        {result ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath
                  src={result.avatar}
                  className="rounded-circle flex-shrink-0"
                  alt={result.name}
                />
              </span>
              <div>
                <h5 className="mb-0">
                  {result.name}{' '}
                  <span className={`dt-pill ${result.pillClass} ms-1`}>
                    {result.pillIcon ? (
                      <i className={result.pillIcon} />
                    ) : (
                      <span className="dt-pill-dot" />
                    )}
                    {result.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{studentMeta(result)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-award" />
                  Marks &amp; Grade
                </h6>
                <div className={`meter meter-${result.meterTone} mb-1`}>
                  <span style={{ width: `${result.percentage}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">{marksSummary(result)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-list-numbers" />
                  Components
                </h6>
                <p className="fs-13 mb-0">{componentsCopy(result)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-message-dots" />
                  Teacher Remarks
                </h6>
                <p className="fs-13 mb-0">{modalRemarkCopy(result)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-paperclip" />
                  Attachments
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className="badge badge-soft-primary">Marksheet.pdf</span>
                  <span className="badge badge-soft-info">Answersheet.pdf</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Results */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Results"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast(formToasts.import);
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
          <input type="file" aria-label="Results file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="er-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="er-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new results</option>
            <option>Update existing by admission no</option>
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

export default ResultsModals;
