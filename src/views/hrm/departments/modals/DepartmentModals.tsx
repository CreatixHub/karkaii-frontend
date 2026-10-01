import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MultiSelect from '@components/ui/MultiSelect';
import Modal from '@components/ui/Modal';
import type { DepartmentModalId, DepartmentRow, DepartmentStatus } from '../data/departments.data';
import {
  assignStaffDepartments,
  assignStaffOptions,
  assignStaffRoles,
  assignSubjectsDepartments,
  assignSubjectsOptions,
  departmentDetailRows,
} from '../data/departments.data';

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const STAFF_OPTIONS = toOptions(assignStaffOptions);
const SUBJECT_OPTIONS = toOptions(assignSubjectsOptions);

export interface DepartmentDraft {
  name: string;
  status: DepartmentStatus;
}

export interface DepartmentModalsProps {
  active: DepartmentModalId | null;
  /** The department the dialog was opened from; Add passes null. */
  department: DepartmentRow | null;
  onClose: () => void;
  /** Switches to another dialog, as Department Details' footer does. */
  onSwitch: (modal: DepartmentModalId) => void;
  onToast: (message: string) => void;
  onAdd: (draft: DepartmentDraft) => void;
  onSave: (id: string, draft: DepartmentDraft) => void;
  onConfirmDelete: () => void;
}

/** The Status block is identical in Add and Edit; only the switch id differs. */
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

const DepartmentModals = ({
  active,
  department,
  onClose,
  onSwitch,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: DepartmentModalsProps) => {
  const [staffDepartment, setStaffDepartment] = useState(assignStaffDepartments[0]);
  const [staffRole, setStaffRole] = useState(assignStaffRoles[0]);
  const [staffSelection, setStaffSelection] = useState<string[]>([]);

  const [subjectDepartment, setSubjectDepartment] = useState(assignSubjectsDepartments[0]);
  const [subjectSelection, setSubjectSelection] = useState<string[]>([]);

  const [addName, setAddName] = useState('');
  const [addActive, setAddActive] = useState(false);
  const [editName, setEditName] = useState('');
  const [editActive, setEditActive] = useState(false);

  useEffect(() => {
    if (active === 'edit_department' && department) {
      setEditName(department.name);
      setEditActive(department.status === 'Active');
    }
  }, [active, department]);

  const closeAdd = () => {
    setAddName('');
    setAddActive(false);
    onClose();
  };

  const detailValue = (key: (typeof departmentDetailRows)[number]['key']) =>
    department ? String(department[key]) : '';

  return (
    <>
      {/* Assign Staff */}
      <Modal
        open={active === 'assign_staff'}
        onClose={onClose}
        title="Assign Staff"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(
            staffSelection.length > 0
              ? `${staffSelection.length} staff assigned to ${staffDepartment}`
              : 'Select at least one staff member',
          );
          onClose();
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
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="department">
                Department
              </label>
              <select
                className="form-select"
                id="department"
                value={staffDepartment}
                onChange={(event) => setStaffDepartment(event.target.value)}
              >
                {assignStaffDepartments.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="role">
                Role
              </label>
              <select
                className="form-select"
                id="role"
                value={staffRole}
                onChange={(event) => setStaffRole(event.target.value)}
              >
                {assignStaffRoles.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="select-staff">
                Select Staff
              </label>
              <MultiSelect
                inputId="select-staff"
                options={STAFF_OPTIONS}
                value={staffSelection}
                onChange={setStaffSelection}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Subjects */}
      <Modal
        open={active === 'assign_subjects'}
        onClose={onClose}
        title="Assign Subjects"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(
            subjectSelection.length > 0
              ? `${subjectSelection.length} subject(s) assigned to ${subjectDepartment}`
              : 'Select at least one subject',
          );
          onClose();
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
        <div className="mb-3">
          <label className="form-label" htmlFor="department-2">
            Department
          </label>
          <select
            className="form-select"
            id="department-2"
            value={subjectDepartment}
            onChange={(event) => setSubjectDepartment(event.target.value)}
          >
            {assignSubjectsDepartments.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="select-subjects">
            Select Subjects
          </label>
          <MultiSelect
            inputId="select-subjects"
            options={SUBJECT_OPTIONS}
            value={subjectSelection}
            onChange={setSubjectSelection}
          />
        </div>
      </Modal>

      {/* Department Details */}
      <Modal
        open={active === 'department_details'}
        onClose={onClose}
        title="Department Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Close
            </Link>
            <button type="button" className="btn btn-primary" onClick={() => onSwitch('edit_department')}>
              <i className="ti ti-edit me-1" />
              Edit Department
            </button>
          </>
        }
      >
        {department ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span
                className={`avatar avatar-lg bg-${department.tone}-transparent text-${department.tone} rounded me-3`}
              >
                <i className={`${department.icon} fs-24`} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{department.name}</h5>
                  <span className={`badge bg-${department.tone}-transparent text-${department.tone}`}>
                    {department.code}
                  </span>
                  <span
                    className={`badge ${
                      department.status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger'
                    }`}
                  >
                    {department.status}
                  </span>
                </div>
                <p className="mb-0 text-muted fs-13">{department.description}</p>
              </div>
            </div>
            <ul className="list-unstyled mb-0">
              {departmentDetailRows.map((row) => (
                <li className="d-flex justify-content-between py-1 fs-13" key={row.key}>
                  <span className="text-muted">{row.label}</span>
                  <span className="text-dark">{detailValue(row.key)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Modal>

      {/* Add Department */}
      <Modal
        open={active === 'add_department'}
        onClose={closeAdd}
        title="Add Department"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd({ name: addName.trim() || 'New Department', status: addActive ? 'Active' : 'Inactive' });
          closeAdd();
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Department
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="department-name">
                Department Name
              </label>
              <input
                type="text"
                className="form-control"
                id="department-name"
                value={addName}
                onChange={(event) => setAddName(event.target.value)}
              />
            </div>
          </div>
          <StatusToggle id="switch-sm" checked={addActive} onChange={setAddActive} />
        </div>
      </Modal>

      {/* Edit Department */}
      <Modal
        open={active === 'edit_department'}
        onClose={onClose}
        title="Edit Department"
        onSubmit={(event) => {
          event.preventDefault();
          if (department) {
            onSave(department.id, {
              name: editName.trim() || department.name,
              status: editActive ? 'Active' : 'Inactive',
            });
          }
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
              <label className="form-label" htmlFor="department-name-2">
                Department Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Department Name"
                id="department-name-2"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </div>
          </div>
          <StatusToggle id="switch-sm2" checked={editActive} onChange={setEditActive} />
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

export default DepartmentModals;
