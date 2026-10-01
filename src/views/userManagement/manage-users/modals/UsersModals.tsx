import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import { useForm } from '@hooks/useForm';
import { email as emailRule, required } from '@utils/validation';
import type { UserModalId } from '../data/users.data';
import { branchOptions, roleOptions } from '../data/users.data';

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

export interface InviteValues extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branch: string;
  sendInvite: boolean;
}

const EMPTY_INVITE: InviteValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  branch: branchOptions[0],
  sendInvite: true,
};

const inviteSchema = {
  firstName: required('Enter the first name.'),
  lastName: required('Enter the last name.'),
  email: emailRule('Enter a valid email address.'),
  role: required('Select a role.'),
};

export interface UsersModalsProps {
  active: UserModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (values: InviteValues) => void;
  onConfirmDelete: () => void;
}

const UsersModals = ({ active, onClose, onToast, onAdd, onConfirmDelete }: UsersModalsProps) => {
  const inviteForm = useForm<InviteValues>({
    initialValues: EMPTY_INVITE,
    validationSchema: inviteSchema,
    onSubmit: async (values) => {
      onAdd(values);
    },
    onSuccess: () => {
      inviteForm.reset(EMPTY_INVITE);
      onClose();
    },
  });

  const closeInvite = () => {
    inviteForm.reset(EMPTY_INVITE);
    onClose();
  };

  return (
    <>
      {/* Add New User */}
      <Modal
        open={active === 'invite'}
        onClose={closeInvite}
        title="Add New User"
        titleIcon="ti ti-square-rounded-plus me-2 text-primary"
        closeVariant="plain"
        formClassName="usr-vform"
        onSubmit={inviteForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={closeInvite}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary usr-submit" disabled={inviteForm.isSubmitting}>
              Add User
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="first-name">
              First Name
            </label>
            <input
              type="text"
              className={`form-control${
                inviteForm.errors.firstName && inviteForm.touched.firstName ? ' is-invalid' : ''
              }`}
              placeholder="Enter first name"
              id="first-name"
              name="firstName"
              value={inviteForm.values.firstName}
              onChange={inviteForm.handleChange}
              onBlur={inviteForm.handleBlur}
            />
            {fieldError(inviteForm.errors.firstName, inviteForm.touched.firstName)}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="last-name">
              Last Name
            </label>
            <input
              type="text"
              className={`form-control${inviteForm.errors.lastName && inviteForm.touched.lastName ? ' is-invalid' : ''}`}
              placeholder="Enter last name"
              id="last-name"
              name="lastName"
              value={inviteForm.values.lastName}
              onChange={inviteForm.handleChange}
              onBlur={inviteForm.handleBlur}
            />
            {fieldError(inviteForm.errors.lastName, inviteForm.touched.lastName)}
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="email-address">
              Email Address
            </label>
            <input
              type="email"
              className={`form-control${inviteForm.errors.email && inviteForm.touched.email ? ' is-invalid' : ''}`}
              placeholder="name@preskool.com"
              id="email-address"
              name="email"
              value={inviteForm.values.email}
              onChange={inviteForm.handleChange}
              onBlur={inviteForm.handleBlur}
            />
            {fieldError(inviteForm.errors.email, inviteForm.touched.email)}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="role-2">
              Role
            </label>
            <select
              className={`form-select${inviteForm.errors.role && inviteForm.touched.role ? ' is-invalid' : ''}`}
              id="role-2"
              name="role"
              value={inviteForm.values.role}
              onChange={inviteForm.handleChange}
              onBlur={inviteForm.handleBlur}
            >
              <option value="">Select role</option>
              {roleOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            {fieldError(inviteForm.errors.role, inviteForm.touched.role)}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="branch-2">
              Branch
            </label>
            <select
              className="form-select"
              id="branch-2"
              name="branch"
              value={inviteForm.values.branch}
              onChange={inviteForm.handleChange}
            >
              {branchOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="sendInvite"
                name="sendInvite"
                checked={inviteForm.values.sendInvite}
                onChange={inviteForm.handleChange}
              />
              <label className="form-check-label" htmlFor="sendInvite">
                Send an email invitation to set up the account
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Import Users */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Users"
        titleIcon="ti ti-file-import me-2 text-primary"
        closeVariant="plain"
        formClassName="usr-vform"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Users imported successfully.');
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary usr-submit">
              Import
            </button>
          </>
        }
      >
        <p className="text-muted fs-13">
          Upload a CSV or Excel file to bulk import users. Download the <Link to="#">sample template</Link> to get
          started.
        </p>
        <label className="form-label" htmlFor="choose-file">
          Choose file
        </label>
        <input type="file" className="form-control" accept=".csv,.xls,.xlsx" id="choose-file" />
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
        <p>You want to delete the selected user(s). This action cannot be undone once you delete.</p>
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

export default UsersModals;
