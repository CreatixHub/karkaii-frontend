import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { SectionModalId, SectionRow } from '../data/classSection.data';
import { subjectBadges, teacherQualification } from '../data/classSection.data';

export interface SectionDraft {
  name: string;
  active: boolean;
}

export interface SectionsModalsProps {
  active: SectionModalId | null;
  section: SectionRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: SectionDraft) => void;
  onSave: (id: string, draft: SectionDraft) => void;
  onConfirmDelete: () => void;
  onEditFromView: () => void;
}

const StatusToggle = ({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
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
        id={id}
        aria-label="Toggle option"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  </div>
);

const SectionsModals = ({
  active,
  section,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onEditFromView,
}: SectionsModalsProps) => {
  const [addDraft, setAddDraft] = useState<SectionDraft>({ name: '', active: false });
  const [editDraft, setEditDraft] = useState<SectionDraft>({ name: '', active: true });
  const [importMode, setImportMode] = useState('Create new sections');

  useEffect(() => {
    if (active !== 'edit' || !section) return;
    setEditDraft({
      // The template showed just the letter in the Section field.
      name: section.name.replace('Section ', ''),
      active: section.status === 'Active' || section.status === 'Full',
    });
  }, [active, section]);

  const closeAdd = () => {
    setAddDraft({ name: '', active: false });
    onClose();
  };

  return (
    <>
      {/* Add Section */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Section"
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
              Add Section
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="sec-add-name">
                Section
              </label>
              <input
                type="text"
                className="form-control"
                id="sec-add-name"
                value={addDraft.name}
                onChange={(event) => setAddDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <StatusToggle
              id="sec-add-switch"
              checked={addDraft.active}
              onChange={(checked) => setAddDraft((current) => ({ ...current, active: checked }))}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Section */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Section"
        onSubmit={(event) => {
          event.preventDefault();
          if (section) onSave(section.id, editDraft);
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
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="sec-edit-name">
                Section
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Section"
                id="sec-edit-name"
                value={editDraft.name}
                onChange={(event) => setEditDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <StatusToggle
              id="sec-edit-switch"
              checked={editDraft.active}
              onChange={(checked) => setEditDraft((current) => ({ ...current, active: checked }))}
            />
          </div>
        </div>
      </Modal>

      {/* Section Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Section Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onEditFromView}>
              Edit Section
            </Link>
          </>
        }
      >
        {section ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg bg-light text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-layout-grid fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  Class {section.className} · {section.name}{' '}
                  <span className={`dt-pill ${section.pillClass} ms-1`}>
                    {section.pillIcon ? (
                      <i className={section.pillIcon} />
                    ) : (
                      <span className="dt-pill-dot" />
                    )}
                    {section.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {section.id} · {section.year} · Room {section.roomNo} · {section.shift} · {section.medium}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user" />
                  Class Teacher
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={section.teacher.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={section.teacher.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{section.teacher.name}</span>
                    <span className="fs-12 text-muted">{teacherQualification}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-door" />
                  Room
                </h6>
                <p className="fs-13 mb-0">
                  Room {section.roomNo} · Floor {section.floor}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-users" />
                  Student Distribution
                </h6>
                <div className={`meter ${section.meterClass} mb-1`}>
                  <span style={{ width: section.meterWidth }} />
                </div>
                <p className="fs-12 text-muted mb-0">
                  {section.students} of {section.capacity} seats · {section.boys} boys · {section.girls} girls ·{' '}
                  {section.seatsLeft} free
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-book" />
                  Subjects
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  {subjectBadges.map((subject) => (
                    <span className={`badge ${subject.badgeClass}`} key={subject.label}>
                      {subject.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Sections */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Sections"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 rows validated.');
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
          <input type="file" aria-label="Section list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="sec-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="sec-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new sections</option>
            <option>Update existing by section code</option>
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

export default SectionsModals;
