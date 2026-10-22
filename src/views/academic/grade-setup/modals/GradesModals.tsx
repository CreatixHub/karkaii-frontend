import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { GradeModalId, GradeRow } from '../data/gradeSetup.data';
import {
  importSuccess,
  markSpan,
  meterWidth,
  viewDescription,
  viewSubtitle,
} from '../data/gradeSetup.data';

export interface GradeDraft {
  grade: string;
  marksFrom: string;
  marksUpto: string;
  gradePoints: string;
  status: string;
  description: string;
}

export interface GradesModalsProps {
  active: GradeModalId | null;
  grade: GradeRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: GradeDraft) => void;
  onSave: (id: string, draft: GradeDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const MARKS_FROM_OPTIONS = ['Select', '90'];
const MARKS_UPTO_OPTIONS = ['Select', '100'];
const GRADE_POINT_OPTIONS = ['Select', '0', '1', '2', '3', '4', '5', '6', '7'];
const STATUS_OPTIONS = ['Select', 'Active', 'Inactive'];

const EMPTY: GradeDraft = {
  grade: '',
  marksFrom: 'Select',
  marksUpto: 'Select',
  gradePoints: 'Select',
  status: 'Select',
  description: '',
};

/** The template's Edit dialog shipped pre-filled with grade "O", 90–100, 0 points. */
const EDIT_DEFAULT: GradeDraft = {
  grade: 'O',
  marksFrom: '90',
  marksUpto: '100',
  gradePoints: '0',
  status: 'Active',
  description: '',
};

const GradeForm = ({
  prefix,
  draft,
  onChange,
  gradePlaceholder,
  descriptionPlaceholder,
}: {
  prefix: string;
  draft: GradeDraft;
  onChange: (patch: Partial<GradeDraft>) => void;
  gradePlaceholder?: string;
  descriptionPlaceholder?: string;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-grade`}>
          Grade
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-grade`}
          placeholder={gradePlaceholder}
          value={draft.grade}
          onChange={(event) => onChange({ grade: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-marks-from`}>
          Marks From(%)
        </label>
        <select
          className="select form-select"
          id={`${prefix}-marks-from`}
          value={draft.marksFrom}
          onChange={(event) => onChange({ marksFrom: event.target.value })}
        >
          {MARKS_FROM_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-marks-upto`}>
          Marks Upto(%)
        </label>
        <select
          className="select form-select"
          id={`${prefix}-marks-upto`}
          value={draft.marksUpto}
          onChange={(event) => onChange({ marksUpto: event.target.value })}
        >
          {MARKS_UPTO_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-grade-points`}>
          Grade Points
        </label>
        <select
          className="select form-select"
          id={`${prefix}-grade-points`}
          value={draft.gradePoints}
          onChange={(event) => onChange({ gradePoints: event.target.value })}
        >
          {GRADE_POINT_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-status`}>
          Status
        </label>
        <select
          className="select form-select"
          id={`${prefix}-status`}
          value={draft.status}
          onChange={(event) => onChange({ status: event.target.value })}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-description`}>
          Description
        </label>
        <textarea
          className="form-control"
          rows={4}
          id={`${prefix}-description`}
          placeholder={descriptionPlaceholder}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
    </div>
  </div>
);

const GradesModals = ({
  active,
  grade,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: GradesModalsProps) => {
  const [addDraft, setAddDraft] = useState<GradeDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<GradeDraft>(EDIT_DEFAULT);
  const [importMode, setImportMode] = useState('Create new grades');

  // The Edit dialog opens on whichever row was clicked, falling back to the
  // template's own pre-filled values when a row carries nothing to map.
  useEffect(() => {
    if (active !== 'edit' || !grade) return;
    setEditDraft({
      grade: grade.letter,
      marksFrom: grade.min === 90 ? '90' : 'Select',
      marksUpto: grade.max === 100 ? '100' : 'Select',
      gradePoints: GRADE_POINT_OPTIONS.includes(String(Math.round(grade.pointValue)))
        ? String(Math.round(grade.pointValue))
        : 'Select',
      status: grade.status === 'Active' || grade.status === 'Default' ? 'Active' : 'Inactive',
      description: grade.remark,
    });
  }, [active, grade]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  return (
    <>
      {/* Add Grade */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Grade"
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
              Add Grade
            </button>
          </>
        }
      >
        <GradeForm
          prefix="gs-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Grade */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Grade"
        onSubmit={(event) => {
          event.preventDefault();
          if (grade) onSave(grade.id, editDraft);
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
        <GradeForm
          prefix="gs-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
          gradePlaceholder="Enter Grade"
          descriptionPlaceholder="Add Comment"
        />
      </Modal>

      {/* Grade Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Grade Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Grade
            </Link>
          </>
        }
      >
        {grade ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-${grade.tone}-transparent text-${grade.tone} fw-bold rounded d-inline-flex align-items-center justify-content-center me-2`}
              >
                {grade.letter}
              </span>
              <div>
                <h5 className="mb-0">
                  {grade.name}{' '}
                  <span className={`dt-pill ${grade.pillClass} ms-1`}>
                    {grade.pillIcon ? <i className={grade.pillIcon} /> : <span className="dt-pill-dot" />}
                    {grade.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{viewSubtitle(grade)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-file-description" />
                  Description
                </h6>
                <p className="fs-13 mb-0">{viewDescription(grade)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-ruler-2" />
                  Mark Range
                </h6>
                <div className={`meter meter-${grade.meterTone} mb-1`}>
                  <span style={{ width: meterWidth(grade) }} />
                </div>
                <p className="fs-12 text-muted mb-0">
                  Minimum {grade.min} · Maximum {grade.max} · {markSpan(grade)} point span
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-file-certificate" />
                  Linked Exams
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  {grade.linkedExams.map((exam) => (
                    <span className="badge badge-soft-primary" key={exam}>
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Created By
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={grade.author.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={grade.author.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{grade.author.name}</span>
                    <span className="fs-12 text-muted">Updated {grade.updated}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Grades */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Grades"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast(importSuccess);
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
          <input type="file" aria-label="Grade file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="gs-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="gs-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new grades</option>
            <option>Update existing by letter</option>
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

export default GradesModals;
