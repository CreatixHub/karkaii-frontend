import { useEffect, useState, type FormEvent } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { Account } from './data/profile.data';
import { ACCOUNT, statsFor } from './data/profile.data';

const routes = all_routes;

type ProfileDialog = 'personal' | 'address' | 'password' | null;

/** One labelled input, the shape the template repeats down both cards. */
const Field = ({
  id,
  label,
  value,
  placeholder,
  type = 'text',
  onChange,
  readOnly = false,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) => (
  <>
    <label className="form-label" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      id={id}
      value={value}
      readOnly={readOnly}
      onChange={(event) => onChange?.(event.target.value)}
    />
  </>
);

const Profile = () => {
  const { toasts, push, dismiss } = useToasts();

  const [account, setAccount] = useState<Account>(ACCOUNT);
  const [dialog, setDialog] = useState<ProfileDialog>(null);
  const [draft, setDraft] = useState<Account>(ACCOUNT);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    if (dialog === 'personal' || dialog === 'address') setDraft(account);
    if (dialog === 'password') setPasswords({ current: '', next: '', confirm: '' });
  }, [dialog, account]);

  const stats = statsFor(account);

  const saveDetails = (event: FormEvent) => {
    event.preventDefault();
    setAccount(draft);
    push(dialog === 'address' ? 'Address information saved' : 'Personal information saved');
    setDialog(null);
  };

  const savePassword = (event: FormEvent) => {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      push('The two new passwords do not match', 'danger');
      return;
    }
    push('Password changed');
    setDialog(null);
  };

  const set = (field: keyof Account) => (value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Profile</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href={routes.adminDashboard}>Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">Settings</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Profile
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <ActionLink
                  className="btn btn-outline-light bg-white btn-icon"
                  ariaLabel="Refresh"
                  onClick={() => {
                    setAccount(ACCOUNT);
                    push('Profile reloaded');
                  }}
                >
                  <i className="ti ti-refresh" />
                </ActionLink>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-3">
            {stats.map((stat) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={stat.id}>
                <div className={`stats-card stats-card-directory stats-${stat.tint}`}>
                  <span className="stats-avatar stats-icon">
                    <i className={stat.icon} />
                  </span>
                  <div>
                    <h3 className="stats-value mb-0">{stat.value}</h3>
                    <p className="stats-label">{stat.label}</p>
                    <span className="stats-role">{stat.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}

          <div className="d-md-flex d-block mt-3">
            <div className="settings-right-sidebar me-md-3 border-0">
              <div className="card">
                <div className="card-header">
                  <h4 className="fs-16 fw-medium">Personal Information</h4>
                </div>
                <div className="card-body">
                  <div className="settings-profile-upload">
                    <span className="profile-pic">
                      <ImageWithBasePath src={account.photo} alt="Profile" />
                    </span>
                    <div className="title-upload">
                      <h5>Edit Your Photo</h5>
                      <ActionLink className="me-2" onClick={() => push('Photo removed')}>
                        Delete{' '}
                      </ActionLink>
                      <ActionLink className="text-primary" onClick={() => push('Choose a new photo')}>
                        Update
                      </ActionLink>
                    </div>
                  </div>
                  <div className="profile-uploader profile-uploader-two mb-0">
                    <span className="upload-icon">
                      <i className="ti ti-upload" />
                    </span>
                    <div className="drag-upload-btn bg-transparent me-0 border-0">
                      <p className="upload-btn">
                        <span>Click to Upload</span> or drag and drop{' '}
                      </p>
                      <h6>JPG or PNG</h6>
                      <h6>(Max 450 x 450 px)</h6>
                    </div>
                    <input type="file" className="form-control" multiple id="image_sign" />
                    <div id="frames" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-fill ps-0 border-0">
              <div className="d-md-flex">
                <div className="flex-fill">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>Personal Information</h5>
                      <ActionLink
                        className="btn btn-primary btn-sm"
                        onClick={() => setDialog('personal')}
                      >
                        <i className="ti ti-edit me-2" />
                        Edit
                      </ActionLink>
                    </div>
                    <div className="card-body">
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field
                            id="first-name"
                            label="First Name"
                            placeholder="Enter First Name"
                            value={account.firstName}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field
                            id="last-name"
                            label="Last Name"
                            placeholder="Enter Last Name"
                            value={account.lastName}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <Field
                          id="email-address"
                          label="Email Address"
                          type="email"
                          placeholder="Enter Email"
                          value={account.email}
                          readOnly
                        />
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field
                            id="user-name"
                            label="User Name"
                            placeholder="Enter User Name"
                            value={account.userName}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field
                            id="phone-number"
                            label="Phone Number"
                            placeholder="Enter Phone Number"
                            value={account.phone}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>Address Information</h5>
                      <ActionLink
                        className="btn btn-primary btn-sm"
                        onClick={() => setDialog('address')}
                      >
                        <i className="ti ti-edit me-2" />
                        Edit
                      </ActionLink>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <Field
                          id="address"
                          label="Address"
                          placeholder="Enter Address"
                          value={account.address}
                          readOnly
                        />
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field
                            id="country"
                            label="Country"
                            placeholder="Enter Country"
                            value={account.country}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field
                            id="state-province"
                            label="State / Province"
                            placeholder="Enter State"
                            value={account.state}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field
                            id="city"
                            label="City"
                            placeholder="City"
                            value={account.city}
                            readOnly
                          />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field
                            id="postal-code"
                            label="Postal Code"
                            placeholder="Enter Postal Code"
                            value={account.postalCode}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>Password</h5>
                      <ActionLink
                        className="btn btn-primary btn-sm"
                        onClick={() => setDialog('password')}
                      >
                        Change
                      </ActionLink>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="current-password">
                          Current Password
                        </label>
                        <div className="pass-group d-flex">
                          <input
                            type={passwordShown ? 'text' : 'password'}
                            autoComplete="current-password"
                            className="pass-input form-control"
                            id="current-password"
                            value=""
                            readOnly
                          />
                          <span
                            className={`ti toggle-password ${passwordShown ? 'ti-eye' : 'ti-eye-off'}`}
                            role="button"
                            tabIndex={0}
                            aria-label={passwordShown ? 'Hide password' : 'Show password'}
                            onClick={() => setPasswordShown((current) => !current)}
                            onKeyDown={(event) => {
                              if (event.key !== 'Enter' && event.key !== ' ') return;
                              event.preventDefault();
                              setPasswordShown((current) => !current);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={dialog === 'personal'}
        onClose={() => setDialog(null)}
        title="Edit Personal Information"
        onSubmit={saveDetails}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <Field
              id="edit-first-name"
              label="First Name"
              placeholder="Enter First Name"
              value={draft.firstName}
              onChange={set('firstName')}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Field
              id="edit-last-name"
              label="Last Name"
              placeholder="Enter Last Name"
              value={draft.lastName}
              onChange={set('lastName')}
            />
          </div>
          <div className="col-md-12 mb-3">
            <Field
              id="edit-email"
              label="Email Address"
              type="email"
              placeholder="Enter Email"
              value={draft.email}
              onChange={set('email')}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Field
              id="edit-user-name"
              label="User Name"
              placeholder="Enter User Name"
              value={draft.userName}
              onChange={set('userName')}
            />
          </div>
          <div className="col-md-6 mb-0">
            <Field
              id="edit-phone"
              label="Phone Number"
              placeholder="Enter Phone Number"
              value={draft.phone}
              onChange={set('phone')}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'address'}
        onClose={() => setDialog(null)}
        title="Edit Address Information"
        onSubmit={saveDetails}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12 mb-3">
            <Field
              id="edit-address"
              label="Address"
              placeholder="Enter Address"
              value={draft.address}
              onChange={set('address')}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Field
              id="edit-country"
              label="Country"
              placeholder="Enter Country"
              value={draft.country}
              onChange={set('country')}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Field
              id="edit-state"
              label="State / Province"
              placeholder="Enter State"
              value={draft.state}
              onChange={set('state')}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Field
              id="edit-city"
              label="City"
              placeholder="City"
              value={draft.city}
              onChange={set('city')}
            />
          </div>
          <div className="col-md-6 mb-0">
            <Field
              id="edit-postal"
              label="Postal Code"
              placeholder="Enter Postal Code"
              value={draft.postalCode}
              onChange={set('postalCode')}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'password'}
        onClose={() => setDialog(null)}
        title="Change Password"
        onSubmit={savePassword}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="pw-current">
            Current Password
          </label>
          <input
            type="password"
            className="form-control"
            id="pw-current"
            autoComplete="current-password"
            value={passwords.current}
            onChange={(event) =>
              setPasswords((current) => ({ ...current, current: event.target.value }))
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="pw-new">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="pw-new"
            autoComplete="new-password"
            value={passwords.next}
            onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="pw-confirm">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="pw-confirm"
            autoComplete="new-password"
            value={passwords.confirm}
            onChange={(event) =>
              setPasswords((current) => ({ ...current, confirm: event.target.value }))
            }
          />
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="profileToasts" />
    </>
  );
};

export default Profile;
