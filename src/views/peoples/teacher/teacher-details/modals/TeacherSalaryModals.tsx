import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import { loginDetails } from '../data/teacherProfile.data';
import { leaveDayOptions, leaveTypeOptions } from '../data/teacherLeaves.data';

/** The template's flatpickr placeholder is `15 May 2024`. */
export type TeacherSalaryModalId = 'applyLeave' | 'loginDetail';

export interface TeacherSalaryModalsProps {
  active: TeacherSalaryModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

const TeacherSalaryModals = ({ active, onClose, onToast }: TeacherSalaryModalsProps) => {
  const leaveForm = useForm<
    {
      leaveDate: string;
      type: string;
      from: string;
      to: string;
      dayPart: string;
      noOfDays: string;
      reason: string;
    },
    string
  >({
    initialValues: {
      leaveDate: '',
      type: '',
      from: '',
      to: '',
      dayPart: leaveDayOptions[0],
      noOfDays: '',
      reason: '',
    },
    validationSchema: {
      type: required('Select a leave type.'),
      from: required('Select a start date.'),
      to: (value, values) => {
        if (!String(value)) return 'Select an end date.';
        if (String(values.from) && String(value) < String(values.from)) {
          return 'Leave to date must be on/after the from date.';
        }
        return null;
      },
      noOfDays: (value) => (Number(value) > 0 ? null : 'Enter the number of days.'),
    },
    onSubmit: async (values) => `${values.type} applied for ${values.noOfDays} day(s)`,
    onSuccess: (message) => {
      onToast(message);
      leaveForm.reset();
      onClose();
    },
  });

  // Closing has to clear the form as well as hide it. `Modal` unmounts its
  // children, so the uncontrolled date pickers come back empty on the next
  // open while `values.from` / `values.to` would still hold the old range —
  // a submit would then file a leave for dates the user cannot see.
  const closeLeave = () => {
    leaveForm.reset();
    onClose();
  };

  return (
    <>
      {/* Apply Leave */}
      <Modal
        open={active === 'applyLeave'}
        onClose={closeLeave}
        title="Apply Leave"
        onSubmit={leaveForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={closeLeave}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={leaveForm.isSubmitting}>
              Apply Leave
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="leave-date">
                Leave Date
              </label>
              <div className="date-pic">
                <DateField format="d M Y"
                  placeholder="15 May 2024"
                  id="leave-date"
                  onChange={(dateString) =>
                    leaveForm.setFieldValue('leaveDate', dateString as string)
                  }
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="leave-type">
                Leave Type
              </label>
              <CommonSelect
                inputId="leave-type"
                options={leaveTypeOptions.map((option) => ({ value: option, label: option }))}
                value={leaveForm.values.type ? { value: leaveForm.values.type, label: leaveForm.values.type } : null}
                onChange={(option) => leaveForm.setFieldValue('type', option?.value ?? '')}
              />
              {fieldError(leaveForm.errors.type, leaveForm.touched.type)}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="leave-from-date">
                Leave From date
              </label>
              <div className="date-pic">
                <DateField format="d M Y"
                  placeholder="15 May 2024"
                  id="leave-from-date"
                  onChange={(dateString) =>
                    leaveForm.setFieldValue('from', dateString as string)
                  }
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
              {fieldError(leaveForm.errors.from, leaveForm.touched.from)}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="leave-to-date">
                Leave to Date
              </label>
              <div className="date-pic">
                <DateField format="d M Y"
                  placeholder="15 May 2024"
                  id="leave-to-date"
                  onChange={(dateString) => leaveForm.setFieldValue('to', dateString as string)}
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
              {fieldError(leaveForm.errors.to, leaveForm.touched.to)}
            </div>
            <div className="mb-3">
              <label className="form-label">Leave Days</label>
              <div className="d-flex align-items-center check-radio-group">
                {leaveDayOptions.map((option) => (
                  <label className="custom-radio" key={option}>
                    <input
                      type="radio"
                      name="radio"
                      checked={leaveForm.values.dayPart === option}
                      onChange={() => leaveForm.setFieldValue('dayPart', option)}
                    />
                    <span className="checkmark" />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="no-of-days">
                No of Days
              </label>
              <input
                type="text"
                className="form-control"
                id="no-of-days"
                name="noOfDays"
                value={leaveForm.values.noOfDays}
                onChange={leaveForm.handleChange}
                onBlur={leaveForm.handleBlur}
              />
              {fieldError(leaveForm.errors.noOfDays, leaveForm.touched.noOfDays)}
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="reason">
                Reason
              </label>
              <input
                type="text"
                className="form-control"
                id="reason"
                name="reason"
                value={leaveForm.values.reason}
                onChange={leaveForm.handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>
      {/* /Apply Leave */}

      {/* Login Details */}
      <Modal
        open={active === 'loginDetail'}
        onClose={onClose}
        title="Login Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
        }
      >
        <div className="student-detail-info">
          <span className="student-img">
            <ImageWithBasePath src={loginDetails.avatar} alt="Img" />
          </span>
          <div className="name-info">
            <h5 className="fs-15">
              {loginDetails.name} <span>{loginDetails.classSection}</span>
            </h5>
          </div>
        </div>
        <div className="table-responsive custom-table no-datatable_length">
          <table className="table datanew">
            <thead className="thead-light">
              <tr>
                <th>User Type</th>
                <th>User Name</th>
                <th>Password </th>
              </tr>
            </thead>
            <tbody>
              {loginDetails.credentials.map((row) => (
                <tr key={row.userType}>
                  <td>{row.userType}</td>
                  <td>{row.userName}</td>
                  <td>{row.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
      {/* /Login Details */}
    </>
  );
};

export default TeacherSalaryModals;
