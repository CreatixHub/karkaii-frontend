import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MultiSelect from '@components/ui/MultiSelect';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useForm } from '@hooks/useForm';
import { email as emailRule, required } from '@utils/validation';
import type { GuardianListModalId, GuardianRow } from '../data/guardiansList.data';

const routes = all_routes;

const IMPORT_MODES = ['Create new guardians', 'Update existing by guardian ID', 'Create and update'];

const CHILD_OPTIONS = ['Janet', 'Joann', 'Kathleen', 'Gifford', 'Lisa', 'Ralph', 'Julie', 'Susan', 'Richard', 'Veronica']
  .map((name) => ({ value: name, label: name }));

/** Renders a field's message only once the user has been near the field. */
const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

interface GuardianFormValues extends Record<string, unknown> {
  name: string;
  phone: string;
  email: string;
  children: string[];
}

const EMPTY_FORM: GuardianFormValues = { name: '', phone: '', email: '', children: [] };

const validationSchema = {
  name: required('Name is required'),
  email: emailRule('Enter a valid email address'),
};

export interface GuardianListModalsProps {
  active: GuardianListModalId | null;
  /** The row that opened the dialog; the bulk bar passes null. */
  guardian: GuardianRow | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (values: GuardianFormValues) => void;
  onSave: (id: string, values: GuardianFormValues) => void;
  onConfirmDelete: () => void;
}

const GuardianListModals = ({
  active,
  guardian,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: GuardianListModalsProps) => {
  const addForm = useForm<GuardianFormValues>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      onAdd(values);
    },
    onSuccess: () => {
      addForm.reset(EMPTY_FORM);
      onClose();
    },
  });

  const editForm = useForm<GuardianFormValues>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      if (guardian) onSave(guardian.id, values);
    },
    onSuccess: onClose,
  });

  useEffect(() => {
    if (active === 'edit' && guardian) {
      editForm.reset({
        name: guardian.name,
        phone: guardian.phone,
        email: guardian.email,
        children: guardian.children.map((child) => child.name),
      });
    }
    // `editForm.reset` is stable; re-running on the form object would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, guardian]);

  const closeAdd = () => {
    addForm.reset(EMPTY_FORM);
    onClose();
  };

  return (
    <>
      {/* Import Guardians */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Guardians"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('File queued — 11 rows validated.');
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
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
          <input type="file" aria-label="Guardian list file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">
            Import mode
          </label>
          <select className="form-select" id="import-mode" defaultValue={IMPORT_MODES[0]}>
            {IMPORT_MODES.map((mode) => (
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

      {/* Add Guardian */}
      <Modal
        open={active === 'add'}
        onClose={closeAdd}
        title="Add Guardian"
        onSubmit={addForm.handleSubmit}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={addForm.isSubmitting}>
              Add Guardian
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
            <i className="ti ti-photo-plus fs-16" />
          </div>
          <div className="profile-upload">
            <div className="profile-uploader d-flex align-items-center">
              <div className="drag-upload-btn mb-3">
                Upload
                <input type="file" className="form-control image-sign" multiple aria-label="Upload" />
              </div>
              <button type="button" className="btn btn-primary mb-3">
                Remove
              </button>
            </div>
            <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className={`form-control${addForm.errors.name && addForm.touched.name ? ' is-invalid' : ''}`}
            id="name"
            name="name"
            value={addForm.values.name}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
          />
          {fieldError(addForm.errors.name, addForm.touched.name)}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-number">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone-number"
            name="phone"
            value={addForm.values.phone}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email-address">
            Email Address
          </label>
          <input
            type="text"
            className={`form-control${addForm.errors.email && addForm.touched.email ? ' is-invalid' : ''}`}
            id="email-address"
            name="email"
            value={addForm.values.email}
            onChange={addForm.handleChange}
            onBlur={addForm.handleBlur}
          />
          {fieldError(addForm.errors.email, addForm.touched.email)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="child">
            Child
          </label>
          <MultiSelect
            inputId="child"
            options={CHILD_OPTIONS}
            value={addForm.values.children}
            onChange={(values) => addForm.setFieldValue('children', values)}
          />
        </div>
      </Modal>

      {/* Edit Guardian */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Guardian"
        onSubmit={editForm.handleSubmit}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={editForm.isSubmitting}>
              Save Changes
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
            {guardian ? (
              <ImageWithBasePath src={guardian.avatar} className="img-fluid rounded-circle" alt={guardian.name} />
            ) : (
              <i className="ti ti-photo-plus fs-16" />
            )}
          </div>
          <div className="profile-upload">
            <div className="profile-uploader d-flex align-items-center">
              <div className="drag-upload-btn mb-3">
                Upload
                <input type="file" className="form-control image-sign" multiple aria-label="Upload" />
              </div>
              <button type="button" className="btn btn-primary mb-3">
                Remove
              </button>
            </div>
            <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name-2">
            Name
          </label>
          <input
            type="text"
            className={`form-control${editForm.errors.name && editForm.touched.name ? ' is-invalid' : ''}`}
            id="name-2"
            name="name"
            value={editForm.values.name}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
          {fieldError(editForm.errors.name, editForm.touched.name)}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-number-2">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone-number-2"
            name="phone"
            value={editForm.values.phone}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email-address-2">
            Email Address
          </label>
          <input
            type="text"
            className={`form-control${editForm.errors.email && editForm.touched.email ? ' is-invalid' : ''}`}
            id="email-address-2"
            name="email"
            value={editForm.values.email}
            onChange={editForm.handleChange}
            onBlur={editForm.handleBlur}
          />
          {fieldError(editForm.errors.email, editForm.touched.email)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="child-2">
            Child
          </label>
          <MultiSelect
            inputId="child-2"
            options={CHILD_OPTIONS}
            value={editForm.values.children}
            onChange={(values) => editForm.setFieldValue('children', values)}
          />
        </div>
      </Modal>

      {/* View Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="View Details"
        dialogClassName="modal-lg"
        bodyClassName="mb-0"
      >
        {guardian ? (
          <>
            <div className="parent-wrap">
              <div className="row align-items-center">
                <div className="col-12 col-lg-6">
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-xl me-2">
                      <ImageWithBasePath src={guardian.avatar} alt={guardian.name} />
                    </span>
                    <div className="parent-name">
                      <h5 className="mb-1">{guardian.name}</h5>
                      <p>
                        {guardian.relationship} · {guardian.id}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <ul className="d-flex align-items-center">
                    <li className="mb-3 me-5">
                      <p className="mb-1">Email</p>
                      <h6 className="fw-normal">{guardian.email}</h6>
                    </li>
                    <li className="mb-3">
                      <p className="mb-1">Phone</p>
                      <h6 className="fw-normal">{guardian.phone}</h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h5 className="mb-3">Children Details</h5>
            {guardian.children.map((child) => (
              <div className="border rounded p-4 pb-1 mb-3" key={child.admissionNo}>
                <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
                  <span className="link-primary mb-2">{child.admissionNo}</span>
                  <span className="badge badge-soft-success badge-md mb-2">
                    <i className="ti ti-circle-filled me-2" />
                    {child.status}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="d-flex align-items-center mb-3">
                    <Link to={routes.studentDetail} className="avatar">
                      <ImageWithBasePath
                        src={child.avatar}
                        className="img-fluid rounded-circle flex-shrink-0"
                        alt={child.name}
                      />
                    </Link>
                    <div className="ms-2">
                      <p className="mb-0">
                        <Link to={routes.studentDetail}>{child.name}</Link>
                      </p>
                      <span>{child.classLabel}</span>
                    </div>
                  </div>
                  <ul className="d-flex align-items-center flex-wrap">
                    <li className="mb-3 me-4">
                      <p className="mb-1">Academic Year</p>
                      <h6 className="fw-normal">{guardian.year}</h6>
                    </li>
                    <li className="mb-3 me-4">
                      <p className="mb-1">Transport</p>
                      <h6 className="fw-normal">{guardian.transport}</h6>
                    </li>
                    <li className="mb-3">
                      <p className="mb-1">Fees</p>
                      <h6 className="fw-normal">{guardian.feeStatus}</h6>
                    </li>
                  </ul>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="btn btn-light mb-3 me-3"
                      onClick={() => onToast(`Fees form opened for ${child.name}`)}
                    >
                      Add Fees
                    </Link>
                    <Link to={routes.studentDetail} className="btn btn-primary mb-3">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : null}
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

export default GuardianListModals;
