import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { useToasts } from '@hooks/useToasts';
import { useAuth } from '@hooks/useAuth';
import { roleHomeRoute } from '@features/auth/roleHome';
import { getMyStudent } from '@services/students/students.me';
import { changePassword } from '@services/auth/changePassword';
import { accountFrom, statsFor } from './data/profile.data';

/** One labelled, read-only value. */
const Field = ({ id, label, value, placeholder }: { id: string; label: string; value: string; placeholder: string }) => (
  <>
    <label className="form-label" htmlFor={id}>
      {label}
    </label>
    <input type="text" className="form-control" placeholder={placeholder} id={id} value={value} readOnly />
  </>
);

const Profile = () => {
  const { toasts, push, dismiss } = useToasts();
  const { user } = useAuth();

  const [student, setStudent] = useState<unknown>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  // Students have a student record (address etc.); other roles simply don't.
  const load = useCallback(async () => {
    try {
      setStudent(await getMyStudent());
    } catch {
      setStudent(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const account = useMemo(() => accountFrom(user, student), [user, student]);
  const mustChange = Boolean((user as { mustChangePassword?: boolean } | null)?.mustChangePassword);
  const stats = statsFor(account, mustChange);
  const initials =
    `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase() || '?';

  const openPassword = () => {
    setPasswords({ current: '', next: '', confirm: '' });
    setPasswordOpen(true);
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (passwords.next.length < 8) {
      push('New password must be at least 8 characters', 'danger');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      push('The two new passwords do not match', 'danger');
      return;
    }
    if (passwords.next === passwords.current) {
      push('New password must be different from the current one', 'danger');
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword: passwords.current, newPassword: passwords.next });
      push('Password changed');
      setPasswordOpen(false);
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not change the password', 'danger');
    } finally {
      setSaving(false);
    }
  };

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
                    <a href={roleHomeRoute(user?.role ?? 'admin')}>Dashboard</a>
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
                    void load();
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
                  <h4 className="fs-16 fw-medium">My Account</h4>
                </div>
                <div className="card-body text-center">
                  <span
                    className="avatar avatar-xxl rounded-circle bg-primary-transparent text-primary fs-24 fw-semibold d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 90, height: 90 }}
                  >
                    {initials}
                  </span>
                  <h5 className="mb-1">{[account.firstName, account.lastName].filter(Boolean).join(' ') || '-'}</h5>
                  <p className="text-muted mb-0">{account.userName || ''}</p>
                </div>
              </div>
            </div>

            <div className="flex-fill ps-0 border-0">
              <div className="d-md-flex">
                <div className="flex-fill">
                  <div className="card">
                    <div className="card-header">
                      <h5>Personal Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field id="first-name" label="First Name" placeholder="-" value={account.firstName} />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field id="last-name" label="Last Name" placeholder="-" value={account.lastName} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <Field id="email-address" label="Email Address" placeholder="-" value={account.email} />
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field id="user-name" label="User Name" placeholder="-" value={account.userName} />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field id="phone-number" label="Phone Number" placeholder="-" value={account.phone} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h5>Address Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <Field id="address" label="Address" placeholder="-" value={account.address} />
                      </div>
                      <div className="d-block d-xl-flex">
                        <div className="mb-3 flex-fill me-xl-3 me-0">
                          <Field id="city" label="City" placeholder="-" value={account.city} />
                        </div>
                        <div className="mb-3 flex-fill">
                          <Field id="postal-code" label="Postal Code" placeholder="-" value={account.postalCode} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5>Password</h5>
                      <ActionLink className="btn btn-primary btn-sm" onClick={openPassword}>
                        Change
                      </ActionLink>
                    </div>
                    <div className="card-body">
                      <p className="mb-0 text-muted">
                        {mustChange
                          ? 'You are using a temporary password. Please change it.'
                          : 'Use Change to set a new password.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Change Password"
        onSubmit={savePassword}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setPasswordOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Change Password'}
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
            onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))}
            required
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
            required
          />
          <div className="form-text">At least 8 characters.</div>
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
            onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))}
            required
          />
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="profileToasts" />
    </>
  );
};

export default Profile;