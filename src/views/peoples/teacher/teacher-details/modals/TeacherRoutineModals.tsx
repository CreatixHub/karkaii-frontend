import { useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { LeaveDayOption } from '../data/teacherRoutine.data';
import {
  leaveDayOptions,
  leaveTypes,
  routineLoginCredentials,
  routineLoginProfile,
} from '../data/teacherRoutine.data';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD MMM YYYY';

/** The epoch value the routine form stores alongside each formatted date. */
const toTimestamp = (value: string) => {
  const parsed = value ? dayjs(value, DATE_FORMAT, true) : null;
  return parsed && parsed.isValid() ? parsed.valueOf() : 0;
};
const DAY_MS = 24 * 60 * 60 * 1000;

export type TeacherRoutineModalId = 'applyLeave' | 'loginDetail';

type ApplyLeaveValues = {
  leaveDate: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  /** Epoch ms for the two range ends, so "No of Days" is derivable. */
  fromTime: number;
  toTime: number;
  leaveDays: LeaveDayOption;
  noOfDays: string;
  reason: string;
};

const initialLeave: ApplyLeaveValues = {
  leaveDate: '',
  leaveType: '',
  fromDate: '',
  toDate: '',
  fromTime: 0,
  toTime: 0,
  leaveDays: 'Full day',
  noOfDays: '',
  reason: '',
};

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

export interface TeacherRoutineModalsProps {
  active: TeacherRoutineModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

const TeacherRoutineModals = ({ active, onClose, onToast }: TeacherRoutineModalsProps) => {
  const leaveForm = useForm<ApplyLeaveValues, string>({
    initialValues: initialLeave,
    validationSchema: {
      leaveType: (value) =>
        !value || value === 'Select' ? 'Please select a leave type.' : null,
      fromDate: required('Please pick a start date.'),
      toDate: (value, values) => {
        if (!value) return 'Please pick an end date.';
        if (values.fromTime && values.toTime && values.toTime < values.fromTime) {
          return 'Leave to date must be on or after the from date.';
        }
        return null;
      },
      reason: required('Please give a reason.'),
    },
    onSubmit: async (values) => `Leave applied for ${values.noOfDays || '1'} day(s)`,
    onSuccess: (message) => {
      onToast(message);
      leaveForm.reset();
      onClose();
    },
  });

  const { fromTime, toTime, leaveDays } = leaveForm.values;
  const { setFieldValue } = leaveForm;

  // The template asked the user to retype the span they had just picked.
  useEffect(() => {
    if (!fromTime || !toTime || toTime < fromTime) return;
    const wholeDays = Math.round((toTime - fromTime) / DAY_MS) + 1;
    setFieldValue('noOfDays', String(leaveDays === 'Full day' ? wholeDays : wholeDays - 0.5));
  }, [fromTime, toTime, leaveDays, setFieldValue]);

  // Closing has to clear the form as well as hide it. `Modal` unmounts its
  // children, so the uncontrolled date pickers come back empty on the next
  // open while `fromDate` / `toDate` (and the epoch pair behind "No of Days")
  // would still hold the old range — a submit would then file a leave for
  // dates the user cannot see.
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
                options={leaveTypes
                  .filter((type) => type !== 'Select')
                  .map((type) => ({ value: type, label: type }))}
                value={
                  leaveForm.values.leaveType
                    ? { value: leaveForm.values.leaveType, label: leaveForm.values.leaveType }
                    : null
                }
                onChange={(option) => leaveForm.setFieldValue('leaveType', option?.value ?? '')}
              />
              {fieldError(leaveForm.errors.leaveType, leaveForm.touched.leaveType)}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="leave-from-date">
                Leave From date
              </label>
              <div className="date-pic">
                <DateField format="d M Y"
                  placeholder="15 May 2024"
                  id="leave-from-date"
                  onChange={(dateString) => {
                    leaveForm.setFieldValue('fromDate', dateString);
                    leaveForm.setFieldValue('fromTime', toTimestamp(dateString));
                  }}
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
              {fieldError(leaveForm.errors.fromDate, leaveForm.touched.fromDate)}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="leave-to-date">
                Leave to Date
              </label>
              <div className="date-pic">
                <DateField format="d M Y"
                  placeholder="15 May 2024"
                  id="leave-to-date"
                  onChange={(dateString) => {
                    leaveForm.setFieldValue('toDate', dateString);
                    leaveForm.setFieldValue('toTime', toTimestamp(dateString));
                  }}
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
              {fieldError(leaveForm.errors.toDate, leaveForm.touched.toDate)}
            </div>
            <div className="mb-3">
              <label className="form-label">Leave Days</label>
              <div className="d-flex align-items-center check-radio-group">
                {leaveDayOptions.map((option) => (
                  <label className="custom-radio" key={option}>
                    <input
                      type="radio"
                      name="radio"
                      checked={leaveForm.values.leaveDays === option}
                      onChange={() => leaveForm.setFieldValue('leaveDays', option)}
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
              />
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
                onBlur={leaveForm.handleBlur}
              />
              {fieldError(leaveForm.errors.reason, leaveForm.touched.reason)}
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
        dialogClassName=" modal-lg"
        footer={
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
        }
      >
        <div className="student-detail-info">
          <span className="student-img">
            <ImageWithBasePath src={routineLoginProfile.avatar} alt="Img" />
          </span>
          <div className="name-info">
            <h5 className="fs-15">
              {routineLoginProfile.name} <span>{routineLoginProfile.classSection}</span>
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
              {routineLoginCredentials.map((credential) => (
                <tr key={credential.userType}>
                  <td>{credential.userType}</td>
                  <td>{credential.userName}</td>
                  <td>{credential.password}</td>
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

export default TeacherRoutineModals;
