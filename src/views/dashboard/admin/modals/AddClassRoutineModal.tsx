import Modal from '@components/ui/Modal';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { ValidationSchema } from '@utils/validation';

const TEACHERS = ['Erickson', 'Mori', 'Joseph', 'James'];
const CLASSES = ['I', 'II', 'III', 'IV'];
const SECTIONS = ['A', 'B', 'C'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CLASS_ROOMS = ['101', '102', '103', '104', '105'];

interface ClassRoutineValues extends Record<string, unknown> {
  teacher: string;
  className: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  classRoom: string;
  active: boolean;
}

const INITIAL_VALUES: ClassRoutineValues = {
  teacher: '',
  className: '',
  section: '',
  day: '',
  startTime: '',
  endTime: '',
  classRoom: '',
  active: false,
};

const validationSchema: ValidationSchema<ClassRoutineValues> = {
  teacher: required('Select a teacher'),
  className: required('Select a class'),
  section: required('Select a section'),
  day: required('Select a day'),
  startTime: required('Choose a start time'),
  endTime: required('Choose an end time'),
  classRoom: required('Select a class room'),
};

export interface AddClassRoutineModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (values: ClassRoutineValues) => void;
}

const AddClassRoutineModal = ({ open, onClose, onSaved }: AddClassRoutineModalProps) => {
  const form = useForm<ClassRoutineValues, ClassRoutineValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: async (values) => {
      // Replace with `classRoutineService.create(values)` once the API exists.
      return values;
    },
    onSuccess: (values) => {
      onSaved?.(values);
      form.reset();
      onClose();
    },
  });

  const fieldError = (field: keyof ClassRoutineValues) =>
    form.touched[field] && form.errors[field] ? (
      <span className="text-danger fs-12 d-block mt-1">{form.errors[field]}</span>
    ) : null;

  const renderSelect = (
    id: keyof ClassRoutineValues,
    label: string,
    options: string[],
  ) => (
    <div className="mb-3">
      <label className="form-label" htmlFor={String(id)}>
        {label}
      </label>
      <select
        className="form-control"
        id={String(id)}
        name={String(id)}
        value={form.values[id] as string}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {fieldError(id)}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Class Routine"
      wrapContent
      onSubmit={form.handleSubmit}
      footer={
        <>
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Saving...' : 'Add Class Routine'}
          </button>
        </>
      }
    >
      <div className="row">
        <div className="col-md-12">
          {renderSelect('teacher', 'Teacher', TEACHERS)}
          {renderSelect('className', 'Class', CLASSES)}
          {renderSelect('section', 'Section', SECTIONS)}
          {renderSelect('day', 'Day', DAYS)}

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="startTime">
                  Start Time
                </label>
                <div className="date-pic">
                  <input
                    type="time"
                    className="form-control"
                    id="startTime"
                    name="startTime"
                    value={form.values.startTime}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  <span className="cal-icon">
                    <i className="ti ti-clock" />
                  </span>
                </div>
                {fieldError('startTime')}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="endTime">
                  End Time
                </label>
                <div className="date-pic">
                  <input
                    type="time"
                    className="form-control"
                    id="endTime"
                    name="endTime"
                    value={form.values.endTime}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  <span className="cal-icon">
                    <i className="ti ti-clock" />
                  </span>
                </div>
                {fieldError('endTime')}
              </div>
            </div>
          </div>

          {renderSelect('classRoom', 'Class Room', CLASS_ROOMS)}

          <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
            <div className="status-title">
              <h5>Status</h5>
              <p>Change the Status by toggle</p>
            </div>
            <div className="status-toggle modal-status">
              <input
                type="checkbox"
                id="classRoutineStatus"
                name="active"
                className="check"
                checked={form.values.active}
                onChange={form.handleChange}
              />
              <label htmlFor="classRoutineStatus" className="checktoggle">
                {' '}
              </label>
            </div>
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

export default AddClassRoutineModal;
