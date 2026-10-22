import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ScheduleModalId, ScheduleRow } from '../data/scheduleExam.data';
import { meterTone, passPercent, timeRange, viewInstructions } from '../data/scheduleExam.data';

/** One line of the `.exam-schedule-add` block. */
export interface ScheduleLine {
  date: string;
  subject: string;
  room: string;
  maxMarks: string;
  minMarks: string;
}

export interface ScheduleDraft {
  className: string;
  section: string;
  examName: string;
  startTime: string;
  endTime: string;
  duration: string;
  lines: ScheduleLine[];
}

export interface ScheduleModalsProps {
  active: ScheduleModalId | null;
  schedule: ScheduleRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: ScheduleDraft) => void;
  onSave: (id: string, draft: ScheduleDraft) => void;
  onConfirmDelete: () => void;
  onPrint: () => void;
}

/* The option lists are the template's, typos included — "Week text", "Mothly Test". */
const SECTION_OPTIONS = ['Select', 'A', 'B', 'C'];
const EXAM_NAME_OPTIONS = ['Select', 'Week text', 'Mothly Test', 'Chapter Wise Test', 'Unit Test'];
const START_TIME_OPTIONS = ['Select', '09:30 AM', '10:30 AM', '11:00 AM', '12:30 PM'];
const END_TIME_OPTIONS = ['Select', '10:45 AM', '11:00 AM', '11:30 AM', '12:00 PM'];
const DURATION_OPTIONS = ['Select', '3 hrs'];
const EXAM_DATE_OPTIONS = ['Select', '13 May 2024', '14 May 2024', '15 May 2024'];
const SUBJECT_OPTIONS = ['Select', 'English', 'Spanish', 'Physics'];
const ROOM_OPTIONS = ['Select', '101', '103', '104'];
const MAX_MARK_OPTIONS = ['Select', '100'];
const MIN_MARK_OPTIONS = ['Select', '35'];

const EMPTY_LINE: ScheduleLine = {
  date: 'Select',
  subject: 'Select',
  room: 'Select',
  maxMarks: 'Select',
  minMarks: 'Select',
};

const EMPTY: ScheduleDraft = {
  className: '',
  section: 'Select',
  examName: 'Select',
  startTime: 'Select',
  endTime: 'Select',
  duration: 'Select',
  lines: [EMPTY_LINE],
};

/** The template's option lists are short, so a row's real value is often not among them. */
const pick = (options: string[], value: string) => (options.includes(value) ? value : 'Select');

const Field = ({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="mb-3">
    <label className="form-label" htmlFor={id}>
      {label}
    </label>
    <select className="form-select" id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </div>
);

const ScheduleHeaderFields = ({
  prefix,
  draft,
  onChange,
  classPlaceholder,
}: {
  prefix: string;
  draft: ScheduleDraft;
  onChange: (patch: Partial<ScheduleDraft>) => void;
  classPlaceholder?: string;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label" htmlFor={`${prefix}-class`}>
              Class
            </label>
            <input
              type="text"
              className="form-control"
              id={`${prefix}-class`}
              placeholder={classPlaceholder}
              value={draft.className}
              onChange={(event) => onChange({ className: event.target.value })}
            />
          </div>
        </div>
        <div className="col-md-4">
          <Field
            id={`${prefix}-section`}
            label="Section"
            options={SECTION_OPTIONS}
            value={draft.section}
            onChange={(section) => onChange({ section })}
          />
        </div>
        <div className="col-md-4">
          <Field
            id={`${prefix}-exam-name`}
            label="Exam Name"
            options={EXAM_NAME_OPTIONS}
            value={draft.examName}
            onChange={(examName) => onChange({ examName })}
          />
        </div>
        <div className="col-md-4">
          <Field
            id={`${prefix}-start-time`}
            label="Start Time"
            options={START_TIME_OPTIONS}
            value={draft.startTime}
            onChange={(startTime) => onChange({ startTime })}
          />
        </div>
        <div className="col-md-4">
          <Field
            id={`${prefix}-end-time`}
            label="End Time"
            options={END_TIME_OPTIONS}
            value={draft.endTime}
            onChange={(endTime) => onChange({ endTime })}
          />
        </div>
        <div className="col-md-4">
          <Field
            id={`${prefix}-duration-min`}
            label="Duration(min)"
            options={DURATION_OPTIONS}
            value={draft.duration}
            onChange={(duration) => onChange({ duration })}
          />
        </div>
      </div>
    </div>
  </div>
);

const ScheduleLines = ({
  prefix,
  lines,
  onLine,
  onRemove,
}: {
  prefix: string;
  lines: ScheduleLine[];
  onLine: (index: number, patch: Partial<ScheduleLine>) => void;
  /** Omitted by the Edit dialog, which ships a single non-removable line. */
  onRemove?: (index: number) => void;
}) => (
  <div className="exam-schedule-add">
    {lines.map((line, index) => (
      <div
        className="exam-schedule-row d-flex align-items-center flex-wrap column-gap-3"
        key={`${prefix}-line-${index}`}
      >
        <div className="shedule-info flex-fill">
          <Field
            id={`${prefix}-exam-date-${index}`}
            label="Exam Date"
            options={EXAM_DATE_OPTIONS}
            value={line.date}
            onChange={(date) => onLine(index, { date })}
          />
        </div>
        <div className="shedule-info flex-fill">
          <Field
            id={`${prefix}-subject-${index}`}
            label="Subject"
            options={SUBJECT_OPTIONS}
            value={line.subject}
            onChange={(subject) => onLine(index, { subject })}
          />
        </div>
        <div className="shedule-info flex-fill">
          <Field
            id={`${prefix}-room-no-${index}`}
            label="Room No"
            options={ROOM_OPTIONS}
            value={line.room}
            onChange={(room) => onLine(index, { room })}
          />
        </div>
        <div className="shedule-info flex-fill">
          <Field
            id={`${prefix}-max-marks-${index}`}
            label="Max Marks"
            options={MAX_MARK_OPTIONS}
            value={line.maxMarks}
            onChange={(maxMarks) => onLine(index, { maxMarks })}
          />
        </div>
        <div className="shedule-info flex-fill">
          <div className="d-flex align-items-end">
            <div className="mb-3 flex-fill">
              <Field
                id={`${prefix}-min-marks-${index}`}
                label="Min Marks"
                options={MIN_MARK_OPTIONS}
                value={line.minMarks}
                onChange={(minMarks) => onLine(index, { minMarks })}
              />
            </div>
            {onRemove ? (
              <div className="mb-3 ms-2">
                <Link
                  to="#"
                  className="delete-schedule-table"
                  aria-label="Remove this exam line"
                  onClick={() => onRemove(index)}
                >
                  <i className="ti ti-trash" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ScheduleModals = ({
  active,
  schedule,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
  onPrint,
}: ScheduleModalsProps) => {
  const [addDraft, setAddDraft] = useState<ScheduleDraft>(EMPTY);
  const [editDraft, setEditDraft] = useState<ScheduleDraft>(EMPTY);
  const [importMode, setImportMode] = useState('Create new schedules');

  // The Edit dialog opens on a real row, so it starts from that row's values wherever the
  // template's short option lists can express them.
  useEffect(() => {
    if (active !== 'edit' || !schedule) return;
    setEditDraft({
      className: schedule.className,
      section: pick(SECTION_OPTIONS, schedule.section),
      examName: pick(EXAM_NAME_OPTIONS, schedule.type),
      startTime: pick(START_TIME_OPTIONS, schedule.startTime),
      endTime: pick(END_TIME_OPTIONS, schedule.endTime),
      duration: 'Select',
      lines: [
        {
          date: pick(EXAM_DATE_OPTIONS, schedule.date),
          subject: pick(SUBJECT_OPTIONS, schedule.subject),
          room: 'Select',
          maxMarks: pick(MAX_MARK_OPTIONS, String(schedule.totalMarks)),
          minMarks: pick(MIN_MARK_OPTIONS, String(schedule.passMarks)),
        },
      ],
    });
  }, [active, schedule]);

  const closeAdd = () => {
    setAddDraft(EMPTY);
    onClose();
  };

  const patchAddLine = (index: number, patch: Partial<ScheduleLine>) =>
    setAddDraft((current) => ({
      ...current,
      lines: current.lines.map((line, position) => (position === index ? { ...line, ...patch } : line)),
    }));

  const patchEditLine = (index: number, patch: Partial<ScheduleLine>) =>
    setEditDraft((current) => ({
      ...current,
      lines: current.lines.map((line, position) => (position === index ? { ...line, ...patch } : line)),
    }));

  // The template always kept one line on screen, so the last one cannot be removed.
  const removeAddLine = (index: number) =>
    setAddDraft((current) =>
      current.lines.length === 1
        ? current
        : { ...current, lines: current.lines.filter((_, position) => position !== index) },
    );

  const percent = schedule ? passPercent(schedule) : 0;

  return (
    <>
      {/* Add Exam Schedule */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Exam Schedule"
        dialogClassName="modal-xl"
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
              Add Exam Schedule
            </button>
          </>
        }
      >
        <ScheduleHeaderFields
          prefix="se-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
        <ScheduleLines
          prefix="se-add"
          lines={addDraft.lines}
          onLine={patchAddLine}
          onRemove={removeAddLine}
        />
        <div>
          <Link
            to="#"
            className="btn btn-primary add-new-schedule"
            onClick={() => setAddDraft((current) => ({ ...current, lines: [...current.lines, EMPTY_LINE] }))}
          >
            <i className="ti ti-square-rounded-plus-filled me-2" />
            Add New
          </Link>
        </div>
      </Modal>

      {/* Edit Exam Schedule */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Exam Schedule"
        dialogClassName="modal-xl"
        bodyClassName="pb-1"
        onSubmit={(event) => {
          event.preventDefault();
          if (schedule) onSave(schedule.id, editDraft);
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
        <ScheduleHeaderFields
          prefix="se-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
          classPlaceholder="Enter Class"
        />
        <ScheduleLines prefix="se-edit" lines={editDraft.lines} onLine={patchEditLine} />
      </Modal>

      {/* Exam Schedule Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Exam Schedule Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={onPrint}>
              Print Schedule
            </Link>
          </>
        }
      >
        {schedule ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-light text-${schedule.tone} rounded d-inline-flex align-items-center justify-content-center me-2`}
              >
                <i className={`${schedule.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {schedule.name}{' '}
                  <span className={`dt-pill ${schedule.pillClass} ms-1`}>
                    {schedule.pillIcon ? (
                      <i className={schedule.pillIcon} />
                    ) : (
                      <span className="dt-pill-dot" />
                    )}
                    {schedule.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {schedule.id} · {schedule.type} · Class {schedule.className}-{schedule.section} ·{' '}
                  {schedule.subject} · {schedule.date} · {timeRange(schedule)}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-list-check" />
                  Instructions
                </h6>
                <p className="fs-13 mb-0">{viewInstructions(schedule)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-award" />
                  Marks
                </h6>
                <div className={`meter ${meterTone(schedule)} mb-1`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">
                  Total {schedule.totalMarks} · Passing {schedule.passMarks} · {schedule.students} students
                  registered
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-building" />
                  Exam Hall
                </h6>
                <p className="fs-13 mb-0">
                  {schedule.hall} · capacity {schedule.capacity} seats · {schedule.students} allocated.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-shield-check" />
                  Invigilator
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={schedule.invigilator.avatar}
                      className="rounded-circle flex-shrink-0"
                      alt={schedule.invigilator.name}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{schedule.invigilator.name}</span>
                    <span className="fs-12 text-muted">Lead · Coordinator: {schedule.coordinator.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Exam Schedule */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Exam Schedule"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          onToast('File queued — 10 schedules validated.');
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
          <input type="file" aria-label="Exam schedule file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="se-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="se-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new schedules</option>
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

export default ScheduleModals;
