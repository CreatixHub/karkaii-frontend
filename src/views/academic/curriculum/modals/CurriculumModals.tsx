import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { CurriculumCard, CurriculumModalId } from '../data/curriculum.data';

export interface CurriculumModalsProps {
  active: CurriculumModalId | null;
  card: CurriculumCard | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (name: string) => void;
  onSave: (id: string, name: string, status: string) => void;
  onConfirmDelete: () => void;
}

const SUBJECTS = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Biology', 'Chemistry'];
const TYPES = ['Core', 'Elective', 'Co-curricular', 'Remedial'];
const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SECTIONS = ['Section A', 'Section B', 'Section C'];
const YEARS = ['2024 / 2025', '2023 / 2024'];
const DEPARTMENTS = ['Mathematics', 'Science', 'Languages', 'Computing'];
const STATUSES = ['Published', 'In Review', 'Draft', 'Archived'];

const Field = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="mb-3">
    <label className="form-label" htmlFor={id}>
      {label}
    </label>
    {children}
  </div>
);

const CurriculumModals = ({
  active,
  card,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: CurriculumModalsProps) => {
  const [addName, setAddName] = useState('');
  const [addSubject, setAddSubject] = useState(SUBJECTS[0]);
  const [addType, setAddType] = useState(TYPES[0]);
  const [addGrade, setAddGrade] = useState(GRADES[0]);
  const [addClass, setAddClass] = useState(SECTIONS[0]);
  const [addYear, setAddYear] = useState(YEARS[0]);
  const [addDepartment, setAddDepartment] = useState(DEPARTMENTS[0]);
  const [addDuration, setAddDuration] = useState('');
  const [addDescription, setAddDescription] = useState('');

  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState(STATUSES[0]);
  const [editDescription, setEditDescription] = useState('');

  const [unitTitle, setUnitTitle] = useState('');
  const [unitChapters, setUnitChapters] = useState('');
  const [unitDuration, setUnitDuration] = useState('');

  const [lessonUnit, setLessonUnit] = useState('Unit 1 · Algebra');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonObjective, setLessonObjective] = useState('');

  const [activityTitle, setActivityTitle] = useState('');
  const [activityType, setActivityType] = useState('Assignment');
  const [activityDuration, setActivityDuration] = useState('');

  const [leadTeacher, setLeadTeacher] = useState('Teresa Susan');
  const [assignClass, setAssignClass] = useState('Grade 10 · A');

  const [importSource, setImportSource] = useState('CSV File');

  useEffect(() => {
    if (active !== 'edit' || !card) return;
    setEditName(card.name);
    setEditStatus(card.status);
  }, [active, card]);

  const finish = (message: string) => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {/* New Curriculum */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="New Curriculum"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addName.trim() || 'New Curriculum');
          setAddName('');
          setAddDescription('');
          onClose();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Create Curriculum
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <Field id="cur-add-name" label="Curriculum Name">
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mathematics"
                id="cur-add-name"
                value={addName}
                onChange={(event) => setAddName(event.target.value)}
              />
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-subject" label="Subject">
              <select
                className="form-select"
                id="cur-add-subject"
                value={addSubject}
                onChange={(event) => setAddSubject(event.target.value)}
              >
                {SUBJECTS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-type" label="Curriculum Type">
              <select
                className="form-select"
                id="cur-add-type"
                value={addType}
                onChange={(event) => setAddType(event.target.value)}
              >
                {TYPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-grade" label="Grade">
              <select
                className="form-select"
                id="cur-add-grade"
                value={addGrade}
                onChange={(event) => setAddGrade(event.target.value)}
              >
                {GRADES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-class" label="Class">
              <select
                className="form-select"
                id="cur-add-class"
                value={addClass}
                onChange={(event) => setAddClass(event.target.value)}
              >
                {SECTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-year" label="Academic Year">
              <select
                className="form-select"
                id="cur-add-year"
                value={addYear}
                onChange={(event) => setAddYear(event.target.value)}
              >
                {YEARS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-department" label="Department">
              <select
                className="form-select"
                id="cur-add-department"
                value={addDepartment}
                onChange={(event) => setAddDepartment(event.target.value)}
              >
                {DEPARTMENTS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-add-duration" label="Total Duration">
              <input
                type="text"
                className="form-control"
                placeholder="120"
                id="cur-add-duration"
                value={addDuration}
                onChange={(event) => setAddDuration(event.target.value)}
              />
            </Field>
          </div>
          <div className="col-md-12">
            <Field id="cur-add-description" label="Description">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Short description of the curriculum"
                id="cur-add-description"
                value={addDescription}
                onChange={(event) => setAddDescription(event.target.value)}
              />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Edit Curriculum */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Curriculum"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          if (card) onSave(card.id, editName, editStatus);
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
            <Field id="cur-edit-name" label="Curriculum Name">
              <input
                type="text"
                className="form-control"
                id="cur-edit-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="cur-edit-status" label="Status">
              <select
                className="form-select"
                id="cur-edit-status"
                value={editStatus}
                onChange={(event) => setEditStatus(event.target.value)}
              >
                {STATUSES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-12">
            <Field id="cur-edit-description" label="Description">
              <textarea
                className="form-control"
                rows={3}
                id="cur-edit-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
              />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Curriculum Details */}
      <Modal
        open={active === 'details'}
        onClose={onClose}
        title="Curriculum Details"
        dialogClassName="modal-lg"
        footer={
          <Link to="#" className="btn btn-light" onClick={onClose}>
            Close
          </Link>
        }
      >
        {card ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className={`avatar avatar-lg bg-${card.tone}-transparent text-${card.tone} rounded me-2`}>
                <i className={`${card.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {card.name} <span className={`badge ${card.statusBadge} ms-1`}>{card.status}</span>
                </h5>
                <span className="fs-12 text-muted">{card.meta}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-list-numbers" />
                  Structure
                </h6>
                <p className="fs-13 mb-0">
                  {card.units} units · {card.lessons} lessons · {card.topics} topics
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-progress" />
                  Completion
                </h6>
                <p className="fs-13 mb-0">{card.percent}% complete</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-category" />
                  Type
                </h6>
                <p className="fs-13 mb-0">{card.typeLabel}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-clock" />
                  Last Updated
                </h6>
                <p className="fs-13 mb-0">{card.updated.replace('Updated ', '')}</p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Add Unit */}
      <Modal
        open={active === 'addUnit'}
        onClose={onClose}
        title="Add Unit"
        onSubmit={(event) => {
          event.preventDefault();
          finish(unitTitle.trim() ? `${unitTitle} added` : 'Unit added');
          setUnitTitle('');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Unit
            </button>
          </>
        }
      >
        <Field id="cur-unit-title" label="Unit Title">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Algebra"
            id="cur-unit-title"
            value={unitTitle}
            onChange={(event) => setUnitTitle(event.target.value)}
          />
        </Field>
        <Field id="cur-unit-chapters" label="No. of Chapters">
          <input
            type="text"
            className="form-control"
            placeholder="6"
            id="cur-unit-chapters"
            value={unitChapters}
            onChange={(event) => setUnitChapters(event.target.value)}
          />
        </Field>
        <Field id="cur-unit-duration" label="Duration">
          <input
            type="text"
            className="form-control"
            placeholder="18"
            id="cur-unit-duration"
            value={unitDuration}
            onChange={(event) => setUnitDuration(event.target.value)}
          />
        </Field>
      </Modal>

      {/* Add Lesson */}
      <Modal
        open={active === 'addLesson'}
        onClose={onClose}
        title="Add Lesson"
        onSubmit={(event) => {
          event.preventDefault();
          finish(lessonTitle.trim() ? `${lessonTitle} added` : 'Lesson added');
          setLessonTitle('');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Lesson
            </button>
          </>
        }
      >
        <Field id="cur-lesson-unit" label="Unit">
          <select
            className="form-select"
            id="cur-lesson-unit"
            value={lessonUnit}
            onChange={(event) => setLessonUnit(event.target.value)}
          >
            <option>Unit 1 · Algebra</option>
            <option>Unit 2 · Geometry</option>
            <option>Unit 3 · Trigonometry</option>
          </select>
        </Field>
        <Field id="cur-lesson-title" label="Lesson Title">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Linear Equations"
            id="cur-lesson-title"
            value={lessonTitle}
            onChange={(event) => setLessonTitle(event.target.value)}
          />
        </Field>
        <Field id="cur-lesson-objective" label="Learning Objective">
          <textarea
            className="form-control"
            rows={3}
            id="cur-lesson-objective"
            value={lessonObjective}
            onChange={(event) => setLessonObjective(event.target.value)}
          />
        </Field>
      </Modal>

      {/* Add Activity */}
      <Modal
        open={active === 'addActivity'}
        onClose={onClose}
        title="Add Activity"
        onSubmit={(event) => {
          event.preventDefault();
          finish(activityTitle.trim() ? `${activityTitle} added` : 'Activity added');
          setActivityTitle('');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Activity
            </button>
          </>
        }
      >
        <Field id="cur-activity-title" label="Activity Title">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Group Problem Set"
            id="cur-activity-title"
            value={activityTitle}
            onChange={(event) => setActivityTitle(event.target.value)}
          />
        </Field>
        <Field id="cur-activity-type" label="Type">
          <select
            className="form-select"
            id="cur-activity-type"
            value={activityType}
            onChange={(event) => setActivityType(event.target.value)}
          >
            <option>Assignment</option>
            <option>Practical</option>
            <option>Project</option>
            <option>Quiz</option>
          </select>
        </Field>
        <Field id="cur-activity-duration" label="Duration">
          <input
            type="text"
            className="form-control"
            placeholder="45 min"
            id="cur-activity-duration"
            value={activityDuration}
            onChange={(event) => setActivityDuration(event.target.value)}
          />
        </Field>
      </Modal>

      {/* Assign Classes & Teacher */}
      <Modal
        open={active === 'assignClasses'}
        onClose={onClose}
        title="Assign Classes & Teacher"
        onSubmit={(event) => {
          event.preventDefault();
          finish(`${leadTeacher} assigned to ${assignClass}`);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </>
        }
      >
        <Field id="cur-assign-curriculum" label="Curriculum">
          <select className="form-select" id="cur-assign-curriculum" defaultValue={card?.name ?? SUBJECTS[0]}>
            {SUBJECTS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field id="cur-assign-teacher" label="Lead Teacher">
          <select
            className="form-select"
            id="cur-assign-teacher"
            value={leadTeacher}
            onChange={(event) => setLeadTeacher(event.target.value)}
          >
            <option>Teresa Susan</option>
            <option>John Doe</option>
            <option>Hellana Robert</option>
            <option>Morgan Lee</option>
          </select>
        </Field>
        <Field id="cur-assign-classes" label="Assign to Classes">
          <select
            className="form-select"
            id="cur-assign-classes"
            value={assignClass}
            onChange={(event) => setAssignClass(event.target.value)}
          >
            <option>Grade 10 · A</option>
            <option>Grade 10 · B</option>
            <option>Grade 11 · A</option>
            <option>Grade 11 · B</option>
          </select>
        </Field>
      </Modal>

      {/* Import Curriculum */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Curriculum"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Curriculum import queued');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Import
            </button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Curriculum file" />
        </div>
        <Field id="cur-import-source" label="Import Source">
          <select
            className="form-select"
            id="cur-import-source"
            value={importSource}
            onChange={(event) => setImportSource(event.target.value)}
          >
            <option>CSV File</option>
            <option>Excel File</option>
            <option>Another Academic Year</option>
          </select>
        </Field>
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
        <p>You want to delete all the marked items, this cant be undone once you delete.</p>
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

export default CurriculumModals;
