import { useCallback, useState } from 'react';
import Modal from '@components/ui/Modal';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { ValidationSchema } from '@utils/validation';

type EventAudience = 'all' | 'students' | 'staffs';

const CLASSES = ['All Classes', 'I', 'II', 'III', 'IV'];
const SECTIONS = ['All Sections', 'A', 'B'];
const TEACHER_OPTIONS = ['Select', 'I', 'II', 'III', 'IV'];
const CATEGORIES = ['Celebration', 'Training', 'Meeting', 'Holidays'];

const STAFF_ROLES = [
  { id: 'admin', label: 'Admin', defaultChecked: false },
  { id: 'teacher', label: 'Teacher', defaultChecked: true },
  { id: 'driver', label: 'Driver', defaultChecked: false },
  { id: 'accountant', label: 'Accountant', defaultChecked: false },
  { id: 'librarian', label: 'Librarian', defaultChecked: false },
  { id: 'receptionist', label: 'Receptionist', defaultChecked: false },
];

interface EventValues extends Record<string, unknown> {
  classes: string;
  sections: string;
  teachers: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  message: string;
}

const INITIAL_VALUES: EventValues = {
  classes: CLASSES[0],
  sections: SECTIONS[0],
  teachers: '',
  title: '',
  category: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  message:
    'Meeting with Staffs on the Quality Improvement s and completion of syllabus before the August,  enhance the students health issue',
};

const validationSchema: ValidationSchema<EventValues> = {
  title: required('Event title is required'),
  category: required('Select an event category'),
  startDate: required('Choose a start date'),
  endDate: required('Choose an end date'),
};

export interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (values: EventValues) => void;
}

const AddEventModal = ({ open, onClose, onSaved }: AddEventModalProps) => {
  const [audience, setAudience] = useState<EventAudience>('all');
  const [roles, setRoles] = useState<string[]>(
    STAFF_ROLES.filter((role) => role.defaultChecked).map((role) => role.id),
  );
  const [attachmentName, setAttachmentName] = useState('Fees_Structure.pdf');

  const form = useForm<EventValues, EventValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: async (values) => {
      // Replace with `eventsService.create({ ...values, audience, roles })`.
      return values;
    },
    onSuccess: (values) => {
      onSaved?.(values);
      form.reset();
      onClose();
    },
  });

  const toggleRole = useCallback((roleId: string) => {
    setRoles((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  }, []);

  const fieldError = (field: keyof EventValues) =>
    form.touched[field] && form.errors[field] ? (
      <span className="text-danger fs-12 d-block mt-1">{form.errors[field]}</span>
    ) : null;

  // "All" shows the student panel, matching the template's default state.
  const showStudentPanel = audience === 'all' || audience === 'students';
  const showStaffPanel = audience === 'staffs';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Event"
      onSubmit={form.handleSubmit}
      footer={
        <>
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      }
    >
      <div className="row">
        <div className="col-md-12">
          <div>
            <label className="form-label">Event For</label>
            <div className="d-flex align-items-center flex-wrap">
              {(['all', 'students', 'staffs'] as EventAudience[]).map((value) => (
                <div className="form-check me-3 mb-3" key={value}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="event"
                    id={`event-${value}`}
                    checked={audience === value}
                    onChange={() => setAudience(value)}
                  />
                  <label className="form-check-label" htmlFor={`event-${value}`}>
                    {value === 'all' ? 'All' : value === 'students' ? 'Students' : 'Staffs'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {showStudentPanel ? (
            <div className="all-content">
              <div className="mb-3">
                <label className="form-label" htmlFor="classes">
                  Classes
                </label>
                <select
                  className="form-control"
                  id="classes"
                  name="classes"
                  value={form.values.classes}
                  onChange={form.handleChange}
                >
                  {CLASSES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="sections">
                  Sections
                </label>
                <select
                  className="form-control"
                  id="sections"
                  name="sections"
                  value={form.values.sections}
                  onChange={form.handleChange}
                >
                  {SECTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {showStaffPanel ? (
            <div className="all-content">
              <div className="mb-3">
                <div className="bg-light-500 p-3 pb-2 rounded">
                  <label className="form-label">Role</label>
                  <div className="row">
                    {[STAFF_ROLES.slice(0, 3), STAFF_ROLES.slice(3)].map((column, index) => (
                      <div className="col-md-6" key={index}>
                        {column.map((role) => (
                          <div className="form-check form-check-sm mb-2" key={role.id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`role-${role.id}`}
                              checked={roles.includes(role.id)}
                              onChange={() => toggleRole(role.id)}
                            />
                            <label className="form-check-label ms-1" htmlFor={`role-${role.id}`}>
                              {role.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="all-teachers">
                  All Teachers
                </label>
                <select
                  className="form-control"
                  id="all-teachers"
                  name="teachers"
                  value={form.values.teachers}
                  onChange={form.handleChange}
                >
                  {TEACHER_OPTIONS.map((option) => (
                    <option key={option} value={option === 'Select' ? '' : option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          <div className="mb-3">
            <label className="form-label" htmlFor="event-title">
              Event Title
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Title"
              id="event-title"
              name="title"
              value={form.values.title}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {fieldError('title')}
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="event-category">
              Event Category
            </label>
            <select
              className="form-control"
              id="event-category"
              name="category"
              value={form.values.category}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            >
              <option value="">Select</option>
              {CATEGORIES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            {fieldError('category')}
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="start-date">
                  Start Date
                </label>
                <div className="date-pic">
                  <input
                    type="date"
                    className="form-control"
                    id="start-date"
                    name="startDate"
                    value={form.values.startDate}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  <span className="cal-icon">
                    <i className="ti ti-calendar" />
                  </span>
                </div>
                {fieldError('startDate')}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="end-date">
                  End Date
                </label>
                <div className="date-pic">
                  <input
                    type="date"
                    className="form-control"
                    id="end-date"
                    name="endDate"
                    value={form.values.endDate}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  <span className="cal-icon">
                    <i className="ti ti-calendar" />
                  </span>
                </div>
                {fieldError('endDate')}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="start-time-2">
                  Start Time
                </label>
                <div className="date-pic">
                  <input
                    type="time"
                    className="form-control"
                    id="start-time-2"
                    name="startTime"
                    value={form.values.startTime}
                    onChange={form.handleChange}
                  />
                  <span className="cal-icon">
                    <i className="ti ti-clock" />
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="end-time-2">
                  End Time
                </label>
                <div className="date-pic">
                  <input
                    type="time"
                    className="form-control"
                    id="end-time-2"
                    name="endTime"
                    value={form.values.endTime}
                    onChange={form.handleChange}
                  />
                  <span className="cal-icon">
                    <i className="ti ti-clock" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-light p-3 pb-2 rounded">
              <div className="mb-3">
                <label className="form-label">Attachment</label>
                <p>Upload size of 4MB, Accepted Format PDF</p>
              </div>
              <div className="d-flex align-items-center flex-wrap">
                <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                  <i className="ti ti-file-upload me-1" />
                  Upload
                  <input
                    type="file"
                    className="form-control image_sign"
                    accept="application/pdf"
                    aria-label="Upload"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) setAttachmentName(file.name);
                    }}
                  />
                </div>
                <p className="mb-2">{attachmentName}</p>
              </div>
            </div>
          </div>

          <div className="mb-0">
            <label className="form-label" htmlFor="message">
              Message
            </label>
            <textarea
              className="form-control"
              rows={4}
              id="message"
              name="message"
              value={form.values.message}
              onChange={form.handleChange}
            />
          </div>

          {form.submitError ? (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {form.submitError.message}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default AddEventModal;
