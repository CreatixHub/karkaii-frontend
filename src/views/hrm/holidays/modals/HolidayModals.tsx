import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import type { Holiday } from '../data/holidays.data';
import {
  academicYearOptions,
  categoryMeta,
  noticeFile,
  weekdayOf,
} from '../data/holidays.data';

export type HolidayModalId = 'add' | 'edit' | 'import' | 'notice' | 'delete';

export interface HolidayDraft {
  title: string;
  date: string;
  description: string;
  active: boolean;
}

export const emptyDraft: HolidayDraft = { title: '', date: '', description: '', active: false };

export interface HolidayModalsProps {
  active: HolidayModalId | null;
  /** The record the dialog was opened against; null for a bare Add. */
  holiday: Holiday | null;
  /** Pre-filled values for Add — the calendar's per-cell "+" seeds the date. */
  addSeed: HolidayDraft;
  onClose: () => void;
  onToast: (message: string) => void;
  onCreate: (draft: HolidayDraft) => void;
  onUpdate: (draft: HolidayDraft) => void;
  onConfirmDelete: () => void;
  onPrint: () => void;
}

/** Add and Edit share one body; the template gave them the `-2` id suffix split. */
interface HolidayFormProps {
  draft: HolidayDraft;
  onChange: (patch: Partial<HolidayDraft>) => void;
  suffix: string;
  switchId: string;
}

const HolidayForm = ({ draft, onChange, suffix, switchId }: HolidayFormProps) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`holiday-title${suffix}`}>
          Holiday Title
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Holiday Title"
          id={`holiday-title${suffix}`}
          value={draft.title}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`date${suffix}`}>
          Date
        </label>
        <div className="input-icon-end position-relative">
          <input
            type="text"
            className="form-control datetimepicker"
            placeholder="Enter Date"
            id={`date${suffix}`}
            value={draft.date}
            onChange={(event) => onChange({ date: event.target.value })}
          />
          <span className="input-icon-addon">
            <i className="ti ti-calendar" />
          </span>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`description${suffix}`}>
          Description
        </label>
        <textarea
          rows={4}
          className="form-control"
          placeholder="Add Comment"
          id={`description${suffix}`}
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
            id={switchId}
            aria-label="Toggle option"
            checked={draft.active}
            onChange={(event) => onChange({ active: event.target.checked })}
          />
        </div>
      </div>
    </div>
  </div>
);

const HolidayModals = ({
  active,
  holiday,
  addSeed,
  onClose,
  onToast,
  onCreate,
  onUpdate,
  onConfirmDelete,
  onPrint,
}: HolidayModalsProps) => {
  const [addDraft, setAddDraft] = useState<HolidayDraft>(emptyDraft);
  const [editDraft, setEditDraft] = useState<HolidayDraft>(emptyDraft);

  // Reopening Add seeds it from whichever calendar cell's "+" was pressed.
  useEffect(() => {
    if (active === 'add') setAddDraft(addSeed);
  }, [active, addSeed]);

  // Edit loads the selected record each time it opens.
  useEffect(() => {
    if (active === 'edit' && holiday) {
      setEditDraft({
        title: holiday.name,
        date: holiday.start,
        description: holiday.description,
        active: true,
      });
    }
  }, [active, holiday]);

  const noticeTone = holiday ? categoryMeta[holiday.category].tone : 'danger';
  const noticeIcon = holiday ? categoryMeta[holiday.category].icon : 'ti ti-flag';

  return (
    <>
      {/* Add Holiday */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Holiday"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(addDraft);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Holiday
            </button>
          </>
        }
      >
        <HolidayForm
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
          suffix=""
          switchId="switch-sm"
        />
      </Modal>

      {/* Edit Holiday */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Holiday"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(editDraft);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <HolidayForm
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
          suffix="-2"
          switchId="switch-sm2"
        />
      </Modal>

      {/* Import Holiday Calendar */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Holiday Calendar"
        formClassName="hol-form"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Holiday calendar imported.');
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary hol-submit">
              Import
            </button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV, Excel or .ics file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Calendar file" />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="academic-year-2">
              Academic Year
            </label>
            <select className="form-select" id="academic-year-2" defaultValue={academicYearOptions[0]}>
              {academicYearOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="import-mode">
              Import mode
            </label>
            <select className="form-select" id="import-mode" defaultValue="Create new holidays">
              <option>Create new holidays</option>
              <option>Update existing by name</option>
              <option>Create and update</option>
            </select>
          </div>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mt-3 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
      </Modal>

      {/* Holiday Notice Preview */}
      <Modal
        open={active === 'notice'}
        onClose={onClose}
        title="Holiday Notice Preview"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={onPrint}>
              <i className="ti ti-printer me-1" />
              Print Notice
            </button>
          </>
        }
      >
        <div className="border rounded p-4 text-center mb-3">
          <span
            className={`avatar avatar-lg bg-${noticeTone}-transparent text-${noticeTone} rounded-circle flex-shrink-0 mb-2 d-inline-flex align-items-center justify-content-center`}
          >
            <i className={`${noticeIcon} fs-20`} />
          </span>
          <h4 className="mb-1">{holiday?.name ?? 'Holiday'}</h4>
          <p className="text-muted mb-2">
            {holiday ? `${holiday.type} · ${holiday.start} · ${weekdayOf(holiday.start)}` : '—'}
          </p>
          <p className="fs-13 mb-0">
            This is to inform all students, parents and staff that the school will remain closed on{' '}
            <b>{holiday?.start ?? '—'}</b> on account of {holiday?.name ?? 'this holiday'}. Applicable to{' '}
            {holiday?.classes ?? 'All Classes'} at {holiday?.branch ?? 'All Branches'}.
          </p>
        </div>
        <div className="d-flex align-items-center justify-content-between border rounded p-2">
          <div className="d-flex align-items-center gap-2">
            <span className="avatar avatar-sm bg-danger-transparent text-danger rounded d-inline-flex align-items-center justify-content-center">
              <i className="ti ti-file-type-pdf" />
            </span>
            <div>
              <span className="fw-medium d-block fs-13">{noticeFile.name}</span>
              <span className="fs-12 text-muted">
                {noticeFile.size} · Issued by {noticeFile.issuedBy}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-sm"
            onClick={() => onToast('Holiday notice download started')}
          >
            <i className="ti ti-download me-1" />
            Download
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
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
        <p>You want to delete all the marked items, this cant be undone once you delete.</p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default HolidayModals;
