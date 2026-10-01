import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MultiSelect from '@components/ui/MultiSelect';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { GuardianRecord } from '../data/guardians.data';
import type { GuardianModalId } from '../data/guardiansWorkspace.data';
import { childOptions } from '../data/guardiansWorkspace.data';

const routes = all_routes;

const IMPORT_MODES = ['Create new guardians', 'Update existing by guardian ID', 'Create and update'];

export interface GuardianDraft {
  name: string;
  phone: string;
  email: string;
  children: string[];
}

export interface GuardianModalsProps {
  active: GuardianModalId | null;
  /** The card that opened the dialog; bulk actions pass null. */
  guardian: GuardianRecord | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onAdd: (draft: GuardianDraft) => void;
  onSave: (id: string, draft: GuardianDraft) => void;
  onConfirmDelete: () => void;
}

const GuardianModals = ({
  active,
  guardian,
  onClose,
  onToast,
  onAdd,
  onSave,
  onConfirmDelete,
}: GuardianModalsProps) => {
  const [importMode, setImportMode] = useState(IMPORT_MODES[0]);

  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addChildren, setAddChildren] = useState<string[]>([]);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editChildren, setEditChildren] = useState<string[]>([]);

  useEffect(() => {
    if (active === 'edit' && guardian) {
      setEditName(guardian.name);
      setEditPhone(guardian.phone);
      setEditEmail(guardian.email);
      setEditChildren(guardian.students.names.split(', '));
    }
  }, [active, guardian]);

  const closeAdd = () => {
    setAddName('');
    setAddPhone('');
    setAddEmail('');
    setAddChildren([]);
    onClose();
  };

  /** View Details lists one block per linked student; the template hard-codes two. */
  const viewChildren = guardian
    ? guardian.students.names.split(', ').map((name, index) => ({
        name,
        classLabel: (guardian.students.classes.split(', ')[index] ?? guardian.students.classes)
          .split(' ')
          .join(', '),
        admissionNo: `AD989243${4 - index}`,
        roll: 35010 + index * 2,
        gender: index % 2 === 0 ? 'Female' : 'Male',
        joined: index % 2 === 0 ? '22 Mar 2018' : '18 Mar 2018',
        avatar: guardian.students.avatar,
      }))
    : [];

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
          <select
            className="form-select"
            id="import-mode"
            value={importMode}
            onChange={(event) => setImportMode(event.target.value)}
          >
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
        onSubmit={(event) => {
          event.preventDefault();
          onAdd({
            name: addName.trim() || 'New Guardian',
            phone: addPhone.trim(),
            email: addEmail.trim(),
            children: addChildren,
          });
          closeAdd();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={closeAdd}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
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
            className="form-control"
            id="name"
            value={addName}
            onChange={(event) => setAddName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-number">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone-number"
            value={addPhone}
            onChange={(event) => setAddPhone(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email-address">
            Email Address
          </label>
          <input
            type="text"
            className="form-control"
            id="email-address"
            value={addEmail}
            onChange={(event) => setAddEmail(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="child">
            Child
          </label>
          <MultiSelect
            inputId="child"
            options={childOptions}
            value={addChildren}
            onChange={setAddChildren}
          />
        </div>
      </Modal>

      {/* Edit Guardian */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Guardian"
        onSubmit={(event) => {
          event.preventDefault();
          if (guardian) {
            onSave(guardian.id, {
              name: editName.trim() || guardian.name,
              phone: editPhone.trim(),
              email: editEmail.trim(),
              children: editChildren,
            });
          }
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
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
            className="form-control"
            id="name-2"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="phone-number-2">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone-number-2"
            value={editPhone}
            onChange={(event) => setEditPhone(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email-address-2">
            Email Address
          </label>
          <input
            type="text"
            className="form-control"
            id="email-address-2"
            value={editEmail}
            onChange={(event) => setEditEmail(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="child-2">
            Child
          </label>
          <MultiSelect
            inputId="child-2"
            options={childOptions}
            value={editChildren}
            onChange={setEditChildren}
          />
        </div>
      </Modal>

      {/* View Details */}
      <Modal
        open={active === 'viewDetails'}
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
                      <p>Added on {guardian.createdDate}</p>
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
            {viewChildren.map((child) => (
              <div className="border rounded p-4 pb-1 mb-3" key={child.admissionNo}>
                <div className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-3 border-bottom">
                  <span className="link-primary mb-2">{child.admissionNo}</span>
                  <span className="badge badge-soft-success badge-md mb-2">
                    <i className="ti ti-circle-filled me-2" />
                    Active
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
                      <p className="mb-1">Roll No</p>
                      <h6 className="fw-normal">{child.roll}</h6>
                    </li>
                    <li className="mb-3 me-4">
                      <p className="mb-1">Gender</p>
                      <h6 className="fw-normal">{child.gender}</h6>
                    </li>
                    <li className="mb-3">
                      <p className="mb-1">Date of Joined</p>
                      <h6 className="fw-normal">{child.joined}</h6>
                    </li>
                  </ul>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-light mb-3 me-3"
                      onClick={() => onToast(`Fees form opened for ${child.name}`)}
                    >
                      Add Fees
                    </button>
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
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default GuardianModals;
