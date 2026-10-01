import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import type { LessonModalId, LessonPlan } from '../data/lessonPlanning.data';

export interface LessonDraft {
  title: string;
  subject: string;
  lessonType: string;
  grade: string;
  className: string;
  teacher: string;
  week: string;
  duration: string;
  status: string;
  summary: string;
}

export interface ActivityDraft {
  title: string;
  stage: string;
  duration: string;
  instructions: string;
}

export interface ResourceDraft {
  name: string;
  type: string;
  url: string;
}

export interface AssignDraft {
  planId: string;
  teacher: string;
  grade: string;
  className: string;
}

export interface LessonModalsProps {
  active: LessonModalId | null;
  plan: LessonPlan | null;
  plans: LessonPlan[];
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: LessonDraft) => void;
  onSave: (id: string, draft: LessonDraft) => void;
  onAddActivity: (draft: ActivityDraft) => void;
  onAddResource: (draft: ResourceDraft) => void;
  onAssign: (draft: AssignDraft) => void;
  onPublish: (note: string) => void;
  onImport: (year: string) => void;
  onConfirmDelete: () => void;
  onEditFromDetails: () => void;
}

/* ---------------------------- Template option sets --------------------------- */

const SUBJECTS = ['Mathematics', 'Physics', 'English', 'Biology', 'Computer Science', 'History'];
const LESSON_TYPES = ['Core', 'Elective'];
const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const CLASSES = ['Section A', 'Section B'];
const TEACHERS = ['Grace Lee', 'Hassan Ali', 'Olivia Park', 'Rohan Das'];
const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
const STATUSES = ['Draft', 'In Review', 'Published'];
const STAGES = [
  'Warm-up',
  'Introduction',
  'Main Activity',
  'Group Activity',
  'Practical Session',
  'Assessment',
  'Homework',
];
const RESOURCE_TYPES = [
  'PDF',
  'PowerPoint',
  'Word Document',
  'Image',
  'Video',
  'Worksheet',
  'External Link',
];
const YEARS = ['2024 / 2025', '2023 / 2024'];

const EMPTY_LESSON: LessonDraft = {
  title: '',
  subject: SUBJECTS[0],
  lessonType: LESSON_TYPES[0],
  grade: GRADES[1],
  className: CLASSES[0],
  teacher: TEACHERS[0],
  week: WEEKS[0],
  duration: '',
  status: STATUSES[0],
  summary: '',
};

const EMPTY_ACTIVITY: ActivityDraft = {
  title: '',
  stage: STAGES[0],
  duration: '',
  instructions: '',
};

const EMPTY_RESOURCE: ResourceDraft = { name: '', type: RESOURCE_TYPES[0], url: '' };

/* --------------------------------- Fields --------------------------------- */

const TextField = ({
  domId,
  label,
  value,
  onChange,
  col = 'col-md-6',
  last = false,
}: {
  domId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  col?: string;
  last?: boolean;
}) => (
  <div className={col}>
    <div className={last ? 'mb-0' : 'mb-3'}>
      <label className="form-label" htmlFor={domId}>
        {label}
      </label>
      <input
        type="text"
        className="form-control"
        id={domId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  </div>
);

const SelectField = ({
  domId,
  label,
  value,
  options,
  onChange,
  col = 'col-md-6',
}: {
  domId: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  col?: string;
}) => (
  <div className={col}>
    <div className="mb-3">
      <label className="form-label" htmlFor={domId}>
        {label}
      </label>
      <select
        className="form-select"
        id={domId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);

/** The ten-field form both the Add and Edit dialogs render. */
const LessonForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: LessonDraft;
  onChange: (patch: Partial<LessonDraft>) => void;
}) => (
  <div className="row">
    <TextField
      col="col-md-12"
      domId={`${prefix}-title`}
      label="Lesson Title"
      value={draft.title}
      onChange={(title) => onChange({ title })}
    />
    <SelectField
      domId={`${prefix}-subject`}
      label="Subject"
      value={draft.subject}
      options={SUBJECTS}
      onChange={(subject) => onChange({ subject })}
    />
    <SelectField
      domId={`${prefix}-type`}
      label="Lesson Type"
      value={draft.lessonType}
      options={LESSON_TYPES}
      onChange={(lessonType) => onChange({ lessonType })}
    />
    <SelectField
      domId={`${prefix}-grade`}
      label="Grade"
      value={draft.grade}
      options={GRADES}
      onChange={(grade) => onChange({ grade })}
    />
    <SelectField
      domId={`${prefix}-class`}
      label="Class"
      value={draft.className}
      options={CLASSES}
      onChange={(className) => onChange({ className })}
    />
    <SelectField
      domId={`${prefix}-teacher`}
      label="Teacher"
      value={draft.teacher}
      options={TEACHERS}
      onChange={(teacher) => onChange({ teacher })}
    />
    <SelectField
      domId={`${prefix}-week`}
      label="Week"
      value={draft.week}
      options={WEEKS}
      onChange={(week) => onChange({ week })}
    />
    <TextField
      domId={`${prefix}-duration`}
      label="Duration (minutes)"
      value={draft.duration}
      onChange={(duration) => onChange({ duration })}
    />
    <SelectField
      domId={`${prefix}-status`}
      label="Status"
      value={draft.status}
      options={STATUSES}
      onChange={(status) => onChange({ status })}
    />
    <div className="col-md-12">
      <div className="mb-0">
        <label className="form-label" htmlFor={`${prefix}-summary`}>
          Lesson Summary
        </label>
        <textarea
          className="form-control"
          rows={3}
          id={`${prefix}-summary`}
          value={draft.summary}
          onChange={(event) => onChange({ summary: event.target.value })}
        />
      </div>
    </div>
  </div>
);

/* -------------------------------- Component ------------------------------- */

const LessonModals = ({
  active,
  plan,
  plans,
  onClose,
  onToast,
  onAdd,
  onSave,
  onAddActivity,
  onAddResource,
  onAssign,
  onPublish,
  onImport,
  onConfirmDelete,
  onEditFromDetails,
}: LessonModalsProps) => {
  const [addDraft, setAddDraft] = useState<LessonDraft>(EMPTY_LESSON);
  const [editDraft, setEditDraft] = useState<LessonDraft>(EMPTY_LESSON);
  const [activityDraft, setActivityDraft] = useState<ActivityDraft>(EMPTY_ACTIVITY);
  const [resourceDraft, setResourceDraft] = useState<ResourceDraft>(EMPTY_RESOURCE);
  const [assignDraft, setAssignDraft] = useState<AssignDraft>({
    planId: '',
    teacher: TEACHERS[0],
    grade: GRADES[1],
    className: CLASSES[0],
  });
  const [publishNote, setPublishNote] = useState('');
  const [importYear, setImportYear] = useState(YEARS[0]);

  // Seed Edit from the plan that opened it.
  useEffect(() => {
    if (active !== 'edit' || !plan) return;
    setEditDraft({
      title: plan.title,
      subject: plan.subject,
      lessonType: plan.category === 'core' ? 'Core' : 'Elective',
      grade: plan.grade,
      className: plan.className,
      teacher: plan.teacher,
      week: plan.week,
      duration: `${plan.duration}`,
      status: plan.status === 'Archived' ? 'Draft' : plan.status,
      summary: plan.summary,
    });
  }, [active, plan]);

  // Assign opens with the current plan, teacher and class already chosen.
  useEffect(() => {
    if (active !== 'assignTeacher' || !plan) return;
    setAssignDraft({
      planId: plan.id,
      teacher: plan.teacher,
      grade: plan.grade,
      className: plan.className,
    });
  }, [active, plan]);

  const closeAdd = () => {
    setAddDraft(EMPTY_LESSON);
    onClose();
  };

  return (
    <>
      {/* ---------------------------- New Lesson Plan --------------------------- */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="New Lesson Plan"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(addDraft);
          setAddDraft(EMPTY_LESSON);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Create Lesson Plan
            </button>
          </>
        }
      >
        <LessonForm
          prefix="lp-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* ---------------------------- Edit Lesson Plan -------------------------- */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Lesson Plan"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          if (plan) onSave(plan.id, editDraft);
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
        <LessonForm
          prefix="lp-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* ------------------------------ Lesson Details -------------------------- */}
      <Modal
        open={active === 'details'}
        onClose={onClose}
        title="Lesson Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <button type="button" className="btn btn-primary" onClick={onEditFromDetails}>
              <i className="ti ti-edit me-1" />
              Edit Lesson
            </button>
          </>
        }
      >
        {plan ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span
                className={`avatar avatar-lg bg-${plan.tone}-transparent text-${plan.tone} rounded me-3`}
              >
                <i className={`${plan.icon} fs-24`} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{plan.title}</h5>
                  <span className="badge bg-primary-transparent text-primary">{plan.code}</span>
                  <span className={`badge ${plan.statusBadge}`}>{plan.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {plan.subject} · {plan.grade} · {plan.className} · {plan.teacher}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Academic Year</span>
                    <span className="text-dark">{plan.year}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Week</span>
                    <span className="text-dark">{plan.week}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13">
                    <span className="text-muted">Duration</span>
                    <span className="text-dark">{plan.duration} Minutes</span>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Objectives</span>
                    <span className="text-dark">{plan.objectives}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13 border-bottom">
                    <span className="text-muted">Activities</span>
                    <span className="text-dark">{plan.activities}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1 fs-13">
                    <span className="text-muted">Completion</span>
                    <span className="text-success fw-semibold">{plan.percent}%</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ------------------------------- Add Activity --------------------------- */}
      <Modal
        open={active === 'addActivity'}
        onClose={onClose}
        title="Add Activity"
        onSubmit={(event) => {
          event.preventDefault();
          onAddActivity(activityDraft);
          setActivityDraft(EMPTY_ACTIVITY);
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
        <div className="row">
          <TextField
            col="col-md-12"
            domId="lp-activity-title"
            label="Activity Title"
            value={activityDraft.title}
            onChange={(title) => setActivityDraft((current) => ({ ...current, title }))}
          />
          <SelectField
            domId="lp-activity-stage"
            label="Stage"
            value={activityDraft.stage}
            options={STAGES}
            onChange={(stage) => setActivityDraft((current) => ({ ...current, stage }))}
          />
          <TextField
            domId="lp-activity-duration"
            label="Duration (minutes)"
            value={activityDraft.duration}
            onChange={(duration) => setActivityDraft((current) => ({ ...current, duration }))}
          />
          <div className="col-md-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="lp-activity-instructions">
                Instructions
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="lp-activity-instructions"
                value={activityDraft.instructions}
                onChange={(event) =>
                  setActivityDraft((current) => ({ ...current, instructions: event.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Add Resource --------------------------- */}
      <Modal
        open={active === 'addResource'}
        onClose={onClose}
        title="Add Resource"
        onSubmit={(event) => {
          event.preventDefault();
          onAddResource(resourceDraft);
          setResourceDraft(EMPTY_RESOURCE);
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Resource
            </button>
          </>
        }
      >
        <div className="row">
          <TextField
            col="col-md-12"
            domId="lp-resource-name"
            label="Resource Name"
            value={resourceDraft.name}
            onChange={(name) => setResourceDraft((current) => ({ ...current, name }))}
          />
          <SelectField
            domId="lp-resource-type"
            label="Type"
            value={resourceDraft.type}
            options={RESOURCE_TYPES}
            onChange={(type) => setResourceDraft((current) => ({ ...current, type }))}
          />
          <TextField
            domId="lp-resource-url"
            label="Link / URL"
            value={resourceDraft.url}
            onChange={(url) => setResourceDraft((current) => ({ ...current, url }))}
          />
          <div className="col-md-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="lp-resource-file">
                Upload File
              </label>
              <input type="file" className="form-control" id="lp-resource-file" />
            </div>
          </div>
        </div>
      </Modal>

      {/* -------------------------- Assign Teacher & Class ---------------------- */}
      <Modal
        open={active === 'assignTeacher'}
        onClose={onClose}
        title="Assign Teacher & Class"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onAssign(assignDraft);
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
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="lp-assign-plan">
                Lesson Plan
              </label>
              <select
                className="form-select"
                id="lp-assign-plan"
                value={assignDraft.planId}
                onChange={(event) =>
                  setAssignDraft((current) => ({ ...current, planId: event.target.value }))
                }
              >
                {plans.map((entry) => (
                  <option value={entry.id} key={entry.id}>
                    {entry.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <SelectField
            domId="lp-assign-teacher"
            label="Teacher"
            value={assignDraft.teacher}
            options={TEACHERS}
            onChange={(teacher) => setAssignDraft((current) => ({ ...current, teacher }))}
          />
          <SelectField
            domId="lp-assign-grade"
            label="Grade"
            value={assignDraft.grade}
            options={GRADES}
            onChange={(grade) => setAssignDraft((current) => ({ ...current, grade }))}
          />
          <SelectField
            domId="lp-assign-class"
            label="Class"
            value={assignDraft.className}
            options={CLASSES}
            onChange={(className) => setAssignDraft((current) => ({ ...current, className }))}
          />
        </div>
      </Modal>

      {/* ------------------------------ Publish Lesson -------------------------- */}
      <Modal
        open={active === 'publish'}
        onClose={onClose}
        title="Publish Lesson"
        onSubmit={(event) => {
          event.preventDefault();
          onPublish(publishNote);
          setPublishNote('');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Publish
            </button>
          </>
        }
      >
        <p className="fs-13 text-muted">
          Publishing makes{' '}
          <span className="text-dark fw-medium">{plan?.title ?? 'this lesson plan'}</span> visible to
          the assigned class and its teacher.
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="lp-publish-note">
            Publish Note (optional)
          </label>
          <textarea
            className="form-control"
            rows={3}
            id="lp-publish-note"
            value={publishNote}
            onChange={(event) => setPublishNote(event.target.value)}
          />
        </div>
      </Modal>

      {/* --------------------------- Import Lesson Plans ------------------------ */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Lesson Plans"
        onSubmit={(event) => {
          event.preventDefault();
          onImport(importYear);
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
        <div className="row">
          <SelectField
            col="col-md-12"
            domId="lp-import-year"
            label="Academic Year"
            value={importYear}
            options={YEARS}
            onChange={setImportYear}
          />
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="lp-import-file">
                Upload File
              </label>
              <input type="file" className="form-control" id="lp-import-file" />
            </div>
          </div>
          <div className="col-md-12">
            <Link
              to="#"
              className="text-primary fs-13"
              onClick={() => onToast('Sample import template downloaded.')}
            >
              <i className="ti ti-download me-1" />
              Download sample template
            </Link>
          </div>
        </div>
      </Modal>

      {/* --------------------------- Delete confirmation ------------------------ */}
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

export default LessonModals;
