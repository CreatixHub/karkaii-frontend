import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { ClassRow, ClassesModalId } from '../data/classes.data';
import { modalToasts } from '../data/classes.data';

export interface ClassDraft {
  name: string;
  section: string;
  students: string;
  subjects: string;
  active: boolean;
}

export interface ClassesModalsProps {
  active: ClassesModalId | null;
  /** The row that opened the dialog; Add and the bulk actions pass null. */
  row: ClassRow | null;
  selectedCount: number;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: ClassDraft) => void;
  onSave: (id: string, draft: ClassDraft) => void;
  onConfirmDelete: () => void;
}

const CLASS_OPTIONS = ['Class I · Section A', 'Class II · Section B', 'Class III · Section A'];

const TEACHER_OPTIONS = [
  'Ms. Teresa Susan · Mathematics',
  'Mr. John Doe · Science',
  'Ms. Rita Owen · English',
  'Ms. Nina Patel · Computer Science',
];

const ASSISTANT_OPTIONS = ['None', 'Mr. Dan Ruiz · Physical Education', 'Ms. Carla Reed · Geography'];

const SUBJECT_OPTIONS: { id: string; label: string; preset: boolean }[] = [
  { id: 'subMath', label: 'Mathematics', preset: true },
  { id: 'subSci', label: 'Science', preset: true },
  { id: 'subEng', label: 'English', preset: true },
  { id: 'subGeo', label: 'Geography', preset: false },
  { id: 'subCom', label: 'Computer Science', preset: false },
  { id: 'subPe', label: 'Physical Education', preset: false },
];

const SECTION_OPTIONS = ['A', 'B', 'C', 'D'];

const presetSubjects = () =>
  SUBJECT_OPTIONS.reduce<Record<string, boolean>>((acc, subject) => {
    acc[subject.id] = subject.preset;
    return acc;
  }, {});

/** The Status block, identical in the Add and Edit forms bar the switch id. */
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

const CancelButton = ({ onClose }: { onClose: () => void }) => (
  <button type="button" className="btn btn-light me-2" onClick={onClose}>
    Cancel
  </button>
);

const ClassesModals = ({
  active,
  row,
  selectedCount,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: ClassesModalsProps) => {
  /* ----------------------------- Assign Teacher ---------------------------- */
  const [assignClass, setAssignClass] = useState(CLASS_OPTIONS[0]);
  const [assignTeacher, setAssignTeacher] = useState(TEACHER_OPTIONS[0]);
  const [assignAssistant, setAssignAssistant] = useState(ASSISTANT_OPTIONS[0]);
  const [effectiveFrom, setEffectiveFrom] = useState('');

  /* ----------------------------- Assign Subjects --------------------------- */
  const [subjectClass, setSubjectClass] = useState(CLASS_OPTIONS[0]);
  const [subjects, setSubjects] = useState<Record<string, boolean>>(presetSubjects);
  const [periodsPerWeek, setPeriodsPerWeek] = useState('');

  /* --------------------------- Generate Timetable -------------------------- */
  const [timetableClass, setTimetableClass] = useState('Class I · Section A');
  const [term, setTerm] = useState('Term II');
  const [periodsPerDay, setPeriodsPerDay] = useState('7');
  const [periodDuration, setPeriodDuration] = useState('45 minutes');
  const [avoidClashes, setAvoidClashes] = useState(true);

  /* ------------------------------- Announce -------------------------------- */
  const [audience, setAudience] = useState('Students and guardians');
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceMessage, setAnnounceMessage] = useState('');

  /* -------------------------------- Import --------------------------------- */
  const [importMode, setImportMode] = useState('Create new classes');

  /* ------------------------------ Add and Edit ----------------------------- */
  const [addDraft, setAddDraft] = useState<ClassDraft>({
    name: '',
    section: 'Select',
    students: '',
    subjects: '',
    active: false,
  });
  const [editDraft, setEditDraft] = useState<ClassDraft>({
    name: '',
    section: 'A',
    students: '',
    subjects: '',
    active: true,
  });

  // Edit opens against the row that was clicked, so refill whenever that changes.
  useEffect(() => {
    if (active !== 'edit' || !row) return;
    setEditDraft({
      // The template showed just the numeral in the Class Name field.
      name: row.numeral,
      section: row.name.split('Section ')[1] ?? 'A',
      students: String(row.students),
      subjects: String(row.detail.subjects.length).padStart(2, '0'),
      active: row.status === 'active',
    });
  }, [active, row]);

  const resetAssignTeacher = () => {
    setEffectiveFrom('');
    onClose();
  };
  const resetAssignSubjects = () => {
    setSubjects(presetSubjects());
    setPeriodsPerWeek('');
    onClose();
  };
  const resetAnnounce = () => {
    setAnnounceTitle('');
    setAnnounceMessage('');
    onClose();
  };
  const closeAdd = () => {
    setAddDraft({ name: '', section: 'Select', students: '', subjects: '', active: false });
    onClose();
  };

  /** The template toasted on submit and closed the dialog; both happen here. */
  const finish = (key: keyof typeof modalToasts, reset: () => void) => {
    reset();
    onToast(modalToasts[key]);
  };

  return (
    <>
      {/* Assign Teacher */}
      <Modal
        open={active === 'assignTeacher'}
        onClose={resetAssignTeacher}
        title="Assign Class Teacher"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          finish('assignTeacher', resetAssignTeacher);
        }}
        footer={
          <>
            <CancelButton onClose={resetAssignTeacher} />
            <button type="submit" className="btn btn-primary form-submit" disabled={!effectiveFrom.trim()}>
              Assign Teacher
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-assign-class">
            Class
          </label>
          <select
            className="form-select"
            id="cls-assign-class"
            value={assignClass}
            onChange={(event) => setAssignClass(event.target.value)}
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-assign-teacher">
            Class Teacher
          </label>
          <select
            className="form-select"
            id="cls-assign-teacher"
            value={assignTeacher}
            onChange={(event) => setAssignTeacher(event.target.value)}
          >
            {TEACHER_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-assistant-teacher">
            Assistant Teacher
          </label>
          <select
            className="form-select"
            id="cls-assistant-teacher"
            value={assignAssistant}
            onChange={(event) => setAssignAssistant(event.target.value)}
          >
            {ASSISTANT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="cls-effective-from">
            Effective from
          </label>
          <input
            type="text"
            className="form-control"
            required
            id="cls-effective-from"
            value={effectiveFrom}
            onChange={(event) => setEffectiveFrom(event.target.value)}
          />
        </div>
      </Modal>

      {/* Assign Subjects */}
      <Modal
        open={active === 'assignSubject'}
        onClose={resetAssignSubjects}
        title="Assign Subjects"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          finish('assignSubject', resetAssignSubjects);
        }}
        footer={
          <>
            <CancelButton onClose={resetAssignSubjects} />
            <button type="submit" className="btn btn-primary form-submit" disabled={!periodsPerWeek.trim()}>
              Assign Subjects
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-subject-class">
            Class
          </label>
          <select
            className="form-select"
            id="cls-subject-class"
            value={subjectClass}
            onChange={(event) => setSubjectClass(event.target.value)}
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <label className="form-label">Subjects</label>
        <div className="row g-2 mb-3">
          {SUBJECT_OPTIONS.map((subject) => (
            <div className="col-6" key={subject.id}>
              <div className="form-check form-check-md">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={subject.id}
                  checked={subjects[subject.id] ?? false}
                  onChange={(event) =>
                    setSubjects((current) => ({ ...current, [subject.id]: event.target.checked }))
                  }
                />
                <label className="form-check-label" htmlFor={subject.id}>
                  {subject.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="cls-periods-per-week">
            Periods per week
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 6"
            required
            id="cls-periods-per-week"
            value={periodsPerWeek}
            onChange={(event) => setPeriodsPerWeek(event.target.value)}
          />
        </div>
      </Modal>

      {/* Generate Timetable */}
      <Modal
        open={active === 'timetable'}
        onClose={onClose}
        title="Generate Timetable"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          finish('timetable', onClose);
        }}
        footer={
          <>
            <CancelButton onClose={onClose} />
            <button type="submit" className="btn btn-primary form-submit" disabled={!periodsPerDay.trim()}>
              Generate
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="cls-timetable-class">
              Class
            </label>
            <select
              className="form-select"
              id="cls-timetable-class"
              value={timetableClass}
              onChange={(event) => setTimetableClass(event.target.value)}
            >
              <option>Class I · Section A</option>
              <option>All primary classes</option>
              <option>All classes</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cls-academic-term">
              Academic Term
            </label>
            <select
              className="form-select"
              id="cls-academic-term"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              <option>Term II</option>
              <option>Term III</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cls-periods-per-day">
              Periods per day
            </label>
            <input
              type="text"
              className="form-control"
              required
              id="cls-periods-per-day"
              value={periodsPerDay}
              onChange={(event) => setPeriodsPerDay(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="cls-period-duration">
              Period duration
            </label>
            <select
              className="form-select"
              id="cls-period-duration"
              value={periodDuration}
              onChange={(event) => setPeriodDuration(event.target.value)}
            >
              <option>45 minutes</option>
              <option>40 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div className="col-12">
            <div className="form-check form-check-md">
              <input
                className="form-check-input"
                type="checkbox"
                id="ttAvoid"
                checked={avoidClashes}
                onChange={(event) => setAvoidClashes(event.target.checked)}
              />
              <label className="form-check-label" htmlFor="ttAvoid">
                Avoid teacher clashes across sections
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Send Announcement */}
      <Modal
        open={active === 'announce'}
        onClose={resetAnnounce}
        title="Send Announcement"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          finish('announce', resetAnnounce);
        }}
        footer={
          <>
            <CancelButton onClose={resetAnnounce} />
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={!announceTitle.trim() || !announceMessage.trim()}
            >
              Send
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-audience">
            Audience
          </label>
          <select
            className="form-select"
            id="cls-audience"
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
          >
            <option>Students and guardians</option>
            <option>Guardians only</option>
            <option>Teaching staff</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-announce-title">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Announcement title"
            required
            id="cls-announce-title"
            value={announceTitle}
            onChange={(event) => setAnnounceTitle(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="cls-announce-message">
            Message
          </label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Write your announcement…"
            required
            id="cls-announce-message"
            value={announceMessage}
            onChange={(event) => setAnnounceMessage(event.target.value)}
          />
        </div>
      </Modal>

      {/* Import Classes */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Classes"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          finish('import', onClose);
        }}
        footer={
          <>
            <CancelButton onClose={onClose} />
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
          <input type="file" aria-label="Class list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cls-import-mode">
            Import mode
          </label>
          <select
            className="form-select"
            id="cls-import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
            <option>Create new classes</option>
            <option>Update existing by class code</option>
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

      {/* Add Class */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Class"
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
              Add Class
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-class-name">
                Class Name
              </label>
              <input
                type="text"
                className="form-control"
                id="cls-class-name"
                value={addDraft.name}
                onChange={(event) => setAddDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-add-section">
                Section
              </label>
              <select
                className="select"
                id="cls-add-section"
                value={addDraft.section}
                onChange={(event) => setAddDraft((current) => ({ ...current, section: event.target.value }))}
              >
                <option>Select</option>
                {SECTION_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-add-students">
                No of Students
              </label>
              <input
                type="text"
                className="form-control"
                id="cls-add-students"
                value={addDraft.students}
                onChange={(event) => setAddDraft((current) => ({ ...current, students: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-add-subjects">
                No of Subjects
              </label>
              <input
                type="text"
                className="form-control"
                id="cls-add-subjects"
                value={addDraft.subjects}
                onChange={(event) => setAddDraft((current) => ({ ...current, subjects: event.target.value }))}
              />
            </div>
            <StatusToggle
              id="cls-add-switch"
              checked={addDraft.active}
              onChange={(checked) => setAddDraft((current) => ({ ...current, active: checked }))}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Class */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Class"
        onSubmit={(event) => {
          event.preventDefault();
          if (row) onSave(row.id, editDraft);
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
              <label className="form-label" htmlFor="cls-edit-name">
                Class Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Class Name"
                id="cls-edit-name"
                value={editDraft.name}
                onChange={(event) => setEditDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-edit-section">
                Section
              </label>
              <select
                className="select"
                id="cls-edit-section"
                value={editDraft.section}
                onChange={(event) => setEditDraft((current) => ({ ...current, section: event.target.value }))}
              >
                <option>Select</option>
                {SECTION_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-edit-students">
                No of Students
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter no of Students"
                id="cls-edit-students"
                value={editDraft.students}
                onChange={(event) => setEditDraft((current) => ({ ...current, students: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="cls-edit-subjects">
                No of Subjects
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter no of Subjects"
                id="cls-edit-subjects"
                value={editDraft.subjects}
                onChange={(event) => setEditDraft((current) => ({ ...current, subjects: event.target.value }))}
              />
            </div>
            <StatusToggle
              id="cls-edit-switch"
              checked={editDraft.active}
              onChange={(checked) => setEditDraft((current) => ({ ...current, active: checked }))}
            />
          </div>
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

      {/* Class Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="Class Details"
        titleAccessory={
          row ? (
            <span className={`badge ms-2 badge-soft-${row.status === 'active' ? 'success' : 'secondary'}`}>
              <i className="ti ti-circle-filled me-1 fs-5" />
              {row.statusLabel}
            </span>
          ) : null
        }
      >
        <div className="row">
          <div className="col-md-6">
            <div className="class-detail-info">
              <p>Class Name</p>
              <span>{row?.numeral ?? '—'}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="class-detail-info">
              <p>Section</p>
              <span>{row ? row.name.split('Section ')[1] ?? '—' : '—'}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="class-detail-info">
              <p>No of Subjects</p>
              <span>{row ? String(row.detail.subjects.length).padStart(2, '0') : '—'}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="class-detail-info">
              <p>No of Students</p>
              <span>{row?.students ?? '—'}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClassesModals;
