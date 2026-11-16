import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@hooks/useAuth';
import { roleHomeRoute } from '@features/auth/roleHome';
import { changePassword } from '@services/auth/changePassword';

const ChangePasswordPage = () => {
  const { user, status } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  if (status === 'initializing' || !user) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) return setError('New password must be at least 8 characters.');
    if (newPassword !== confirm) return setError('New password and confirmation do not match.');
    if (newPassword === currentPassword) return setError('New password must be different from the current one.');

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      // Full reload: the session is restored from the server and
      // mustChangePassword comes back false.
      window.location.assign(roleHomeRoute(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the password.');
      setSaving(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-1">Set a new password</h4>
          <p className="text-muted mb-4">
            For your security, please replace the temporary password before continuing.
          </p>

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Current (temporary) password</label>
              <input
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New password</label>
              <input
                type="password"
                className="form-control"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="form-text">At least 8 characters.</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm new password</label>
              <input
                type="password"
                className="form-control"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button type="submit" className="btn btn-primary w-100" disabled={saving}>
              {saving ? 'Saving...' : 'Change password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;