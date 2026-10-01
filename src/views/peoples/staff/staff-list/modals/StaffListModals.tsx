import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DateField from '@components/ui/DateField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { email as emailRule, required } from '@utils/validation';
import type { StaffListModalId, StaffRow } from '../data/staffList.data';
import {
  attendanceRows,
  attendanceTotals,
  departmentOptions,
  designationOptions,
  documentRows,
  employmentTypeOptions,
  importModes,
  performanceNote,
  performanceOverall,
  performanceScores,
} from '../data/staffList.data';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD/MM/YYYY';

/** antd wants a dayjs value; the form keeps the template's `dd/mm/yyyy` string. */

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

interface StaffFormValues extends Record<string, unknown> {
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  mobile: string;
  employmentType: string;
  joiningDate: string;
}

const EMPTY_STAFF: StaffFormValues = {
  name: '',
  employeeId: '',
  department: departmentOptions[0],
  designation: designationOptions[0],
  email: '',
  mobile: '',
  employmentType: employmentTypeOptions[0],
  joiningDate: '',
};

const staffSchema = {
  name: required('Enter the employee name.'),
  email: emailRule('Enter a valid email.'),
};

interface AssignFormValues extends Record<string, unknown> {
  department: string;
  designation: string;
  effectiveDate: string;
}

const EMPTY_ASSIGN: AssignFormValues = {
  department: '',
  designation: designationOptions[0],
  effectiveDate: '24/07/2026',
};

const assignSchema = {
  department: required('Select a department.'),
};

export interface StaffListModalsProps {
  active: StaffListModalId | null;
  /** The row that opened the dialog; the bulk bar passes null. */
  staff: StaffRow | null;
  onClose: () => void;
  /** Switches to another dialog for the same row, as the template's footers do. */
  onSwitch: (modal: StaffListModalId) => void;
  onToast: (message: string) => void;
  onAdd: (values: StaffFormValues) => void;
  onSave: (id: string, values: StaffFormValues) => void;
  onAssign: (id: string, values: AssignFormValues) => void;
  onConfirmDelete: () => void;
}

const StaffListModals = ({
  active,
  staff,
  onClose,
  onSwitch,
  onToast,
  onAdd,
  onSave,
  onAssign,
  onConfirmDelete,
}: StaffListModalsProps) => {
  const addForm = useForm<StaffFormValues>({
    initialValues: EMPTY_STAFF,
    validationSchema: staffSchema,
    onSubmit: async (values) => {
      onAdd(values);
    },
    onSuccess: () => {
      addForm.reset(EMPTY_STAFF);
      onClose();
    },
  });

  const editForm = useForm<StaffFormValues>({
    initialValues: EMPTY_STAFF,
    validationSchema: staffSchema,
    onSubmit: async (values) => {
      if (staff) onSave(staff.id, values);
    },
    onSuccess: onClose,
  });

  const assignForm = useForm<AssignFormValues>({
    initialValues: EMPTY_ASSIGN,
    validationSchema: assignSchema,
    onSubmit: async (values) => {
      if (staff) onAssign(staff.id, values);
    },
    onSuccess: onClose,
  });

  useEffect(() => {
    if (active === 'edit' && staff) {
      editForm.reset({
        name: staff.name,
        employeeId: staff.id,
        department: staff.department,
        designation: staff.designation,
        email: staff.email,
        mobile: staff.phone,
        employmentType: staff.employmentType,
        joiningDate: dayjs(staff.joined).isValid() ? dayjs(staff.joined).format(DATE_FORMAT) : '',
      });
    }
    if (active === 'assign' && staff) {
      assignForm.reset({ ...EMPTY_ASSIGN, designation: staff.designation });
    }
    // The `reset` helpers are stable; depending on the form objects would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, staff]);

  const closeAdd = () => {
    addForm.reset(EMPTY_STAFF);
    onClose();
  };

  /** Add and Edit share an identical eight-field grid; only the ids differ. */
  const staffFields = (form: typeof addForm, suffix: string, readOnlyId: boolean) => (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label" htmlFor={`employee-name${suffix}`}>
          Employee Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control${form.errors.name && form.touched.name ? ' is-invalid' : ''}`}
          id={`employee-name${suffix}`}
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        {fieldError(form.errors.name, form.touched.name)}
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`employee-id${suffix}`}>
          Employee ID
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="STF-0000"
          id={`employee-id${suffix}`}
          name="employeeId"
          readOnly={readOnlyId}
          value={form.values.employeeId}
          onChange={form.handleChange}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`department${suffix}`}>
          Department
        </label>
        <select
          className="form-select"
          id={`department${suffix}`}
          name="department"
          value={form.values.department}
          onChange={form.handleChange}
        >
          {departmentOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`designation${suffix}`}>
          Designation
        </label>
        <select
          className="form-select"
          id={`designation${suffix}`}
          name="designation"
          value={form.values.designation}
          onChange={form.handleChange}
        >
          {designationOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`email${suffix}`}>
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className={`form-control${form.errors.email && form.touched.email ? ' is-invalid' : ''}`}
          id={`email${suffix}`}
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        {fieldError(form.errors.email, form.touched.email)}
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`mobile-number${suffix}`}>
          Mobile Number
        </label>
        <input
          type="text"
          className="form-control"
          id={`mobile-number${suffix}`}
          name="mobile"
          value={form.values.mobile}
          onChange={form.handleChange}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`employment-type${suffix}`}>
          Employment Type
        </label>
        <select
          className="form-select"
          id={`employment-type${suffix}`}
          name="employmentType"
          value={form.values.employmentType}
          onChange={form.handleChange}
        >
          {employmentTypeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor={`joining-date${suffix}`}>
          Joining Date
        </label>
        <div className="input-icon-end position-relative">
          <DateField format="d/m/Y"
            placeholder="dd/mm/yyyy"
            id={`joining-date${suffix}`}
            value={form.values.joiningDate}
            onChange={(dateString) => form.setFieldValue('joiningDate', dateString as string)}
          />
          <span className="input-icon-addon">
            <i className="ti ti-calendar" />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Add Staff */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Staff"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={addForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit" disabled={addForm.isSubmitting}>
              Add Staff
            </button>
          </>
        }
      >
        {staffFields(addForm, '', false)}
      </Modal>

      {/* Edit Staff */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Staff"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={editForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit" disabled={editForm.isSubmitting}>
              Save Changes
            </button>
          </>
        }
      >
        {staffFields(editForm, '-2', true)}
      </Modal>

      {/* Staff Profile */}
      <Modal
        open={active === 'profile'}
        onClose={onClose}
        title="Staff Profile"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-outline-primary me-2" onClick={() => onSwitch('documents')}>
              Documents
            </Link>
            <Link to="#" className="btn btn-primary" onClick={() => onSwitch('edit')}>
              Edit Staff
            </Link>
          </>
        }
      >
        {staff ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath src={staff.avatar} className="rounded-circle flex-shrink-0" alt={staff.name} />
              </span>
              <div>
                <h5 className="mb-0">
                  {staff.name}{' '}
                  <span className={`dt-pill ${staff.statusClass} ms-1`}>
                    {staff.statusIcon ? <i className={staff.statusIcon} /> : <span className="dt-pill-dot" />}
                    {staff.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {staff.id} · {staff.designation} · {staff.department}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-mail" />
                  Contact
                </h6>
                <p className="fs-13 mb-0">
                  {staff.email} · {staff.phone}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-building" />
                  Branch
                </h6>
                <p className="fs-13 mb-0">
                  {staff.branch} · {staff.employmentType}.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-user-cog" />
                  Reporting Manager
                </h6>
                <p className="fs-13 mb-0">{staff.reportsTo}.</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading">
                  <i className="ti ti-briefcase" />
                  Experience
                </h6>
                <p className="fs-13 mb-0">
                  {staff.qualification} · {staff.experience} years · Joined {staff.joined}.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Department Assignment */}
      <Modal
        open={active === 'assign'}
        onClose={onClose}
        title="Department Assignment"
        formClassName="validated-form"
        onSubmit={assignForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary form-submit" disabled={assignForm.isSubmitting}>
              Assign Department
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="staff">
              Staff
            </label>
            <input
              type="text"
              className="form-control"
              readOnly
              id="staff"
              value={staff ? `${staff.name} — ${staff.id}` : ''}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="department-4">
              Department <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select${
                assignForm.errors.department && assignForm.touched.department ? ' is-invalid' : ''
              }`}
              id="department-4"
              name="department"
              value={assignForm.values.department}
              onChange={assignForm.handleChange}
              onBlur={assignForm.handleBlur}
            >
              <option value="">Select department</option>
              {departmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            {fieldError(assignForm.errors.department, assignForm.touched.department)}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="designation-4">
              Designation
            </label>
            <select
              className="form-select"
              id="designation-4"
              name="designation"
              value={assignForm.values.designation}
              onChange={assignForm.handleChange}
            >
              {designationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="effective-date">
              Effective Date
            </label>
            <div className="input-icon-end position-relative">
              <DateField format="d/m/Y"
                placeholder="dd/mm/yyyy"
                id="effective-date"
                value={assignForm.values.effectiveDate}
                onChange={(dateString) => assignForm.setFieldValue('effectiveDate', dateString as string)}
              />
              <span className="input-icon-addon">
                <i className="ti ti-calendar" />
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Document Management */}
      <Modal
        open={active === 'documents'}
        onClose={onClose}
        title="Document Management"
        dialogClassName="modal-lg"
        footer={
          <Link to="#" className="btn btn-light" onClick={onClose}>
            Close
          </Link>
        }
      >
        <div className="table-responsive">
          <table className="table table-nowrap mb-3">
            <thead>
              <tr>
                <th>Document</th>
                <th>Reference</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {documentRows.map((document) => (
                <tr key={document.reference}>
                  <td>
                    <i className={document.icon} />
                    {document.label}
                  </td>
                  <td>{document.reference}</td>
                  <td>{document.uploaded}</td>
                  <td>
                    <span className={`badge ${document.statusClass}`}>{document.status}</span>
                  </td>
                  <td className="text-end">
                    <Link
                      to="#"
                      className="dt-ib"
                      title="Download"
                      onClick={() => onToast(`${document.label} download queued.`)}
                    >
                      <i className="ti ti-download" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="stacked-dropdown">
          <i className="ti ti-cloud-upload" />
          <b>Upload a new document</b>
          <span className="fs-12 text-muted">PDF, JPG or PNG · max 10 MB</span>
          <input type="file" aria-label="Staff document" />
        </div>
      </Modal>

      {/* Attendance Summary */}
      <Modal
        open={active === 'attendance'}
        onClose={onClose}
        title="Attendance Summary"
        dialogClassName="modal-lg"
        footer={
          <Link to="#" className="btn btn-light" onClick={onClose}>
            Close
          </Link>
        }
      >
        <div className="d-flex flex-wrap gap-2 mb-3">
          {attendanceTotals.map((total) => (
            <span className={`badge ${total.accent} p-2`} key={total.label}>
              <i className={`${total.icon} me-1`} />
              {total.label}
            </span>
          ))}
        </div>
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRows.map((entry) => (
                <tr key={entry.date}>
                  <td>{entry.date}</td>
                  <td>{entry.checkIn}</td>
                  <td>{entry.checkOut}</td>
                  <td>
                    <span className={`badge ${entry.statusClass}`}>{entry.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Performance Details */}
      <Modal
        open={active === 'performance'}
        onClose={onClose}
        title="Performance Details"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <Link to="#" className="btn btn-primary" onClick={() => onSwitch('profile')}>
              View Profile
            </Link>
          </>
        }
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="fs-13 fw-medium">{performanceOverall.label}</span>
          <span className={`badge ${performanceOverall.accent}`}>{performanceOverall.value}</span>
        </div>
        <ul className="list-unstyled fs-13 mb-3">
          {performanceScores.map((score, index) => (
            <li
              className={`d-flex align-items-center justify-content-between py-2${
                index === performanceScores.length - 1 ? '' : ' border-bottom'
              }`}
              key={score.label}
            >
              <span className="text-muted">{score.label}</span>
              <span className="fw-medium">{score.value}</span>
            </li>
          ))}
        </ul>
        <div className="alert alert-light border mb-0 fs-12" role="note">
          <i className="ti ti-info-circle me-1" />
          {performanceNote}
        </div>
      </Modal>

      {/* Import Staff */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Staff"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('File queued — 10 staff validated.');
          onClose();
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
          <input type="file" aria-label="Staff list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">
            Import mode
          </label>
          <select className="form-select" id="import-mode" defaultValue={importModes[0]}>
            {importModes.map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
      </Modal>

      {/* Delete */}
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

export default StaffListModals;
