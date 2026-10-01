import { useState } from 'react';
import type { ProfileAction } from '../data/studentProfileActions';

interface Credential {
  id: 'parent' | 'student';
  cls: string;
  icon: string;
  title: string;
  holder: string;
  username: string;
  password: string;
}

const CREDENTIALS: Credential[] = [
  {
    id: 'parent',
    cls: 'c-parent',
    icon: 'ti ti-user-shield',
    title: 'Parent Account',
    holder: 'Robert Daniel',
    username: 'parent53',
    password: 'parent@53',
  },
  {
    id: 'student',
    cls: 'c-student',
    icon: 'ti ti-backpack',
    title: 'Student Account',
    holder: 'Janet Daniel',
    username: 'student20',
    password: 'stdt@53',
  },
];

const LOGIN_LOG = [
  { id: 'l1', accent: 'accent-success', icon: 'ti ti-device-mobile', who: 'Parent · parent53', detail: 'iPhone 13 · Safari · Downtown', when: 'Today, 08:12 AM', pill: 'ok', status: 'Success' },
  { id: 'l2', accent: 'accent-info', icon: 'ti ti-device-laptop', who: 'Student · student20', detail: 'Windows PC · Chrome · School Lab', when: 'Yesterday, 02:40 PM', pill: 'ok', status: 'Success' },
  { id: 'l3', accent: 'accent-danger', icon: 'ti ti-shield-x', who: 'Parent · parent53', detail: 'Unknown device · Firefox', when: '18 Nov, 11:02 PM', pill: 'bad', status: 'Blocked' },
];

export interface LoginDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onCopy: (value: string) => void;
  onAction: (action: ProfileAction) => void;
}

const LoginDetailsModal = ({ open, onClose, onCopy, onAction }: LoginDetailsModalProps) => {
  const [shown, setShown] = useState<Record<string, boolean>>({});

  if (!open) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-label="Login & Access"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content credential-content">
            <button type="button" className="credential-close" aria-label="Close" onClick={onClose}>
              <i className="ti ti-x" />
            </button>

            <div className="credential-head">
              <span className="avatar avatar-icon avatar-lg">
                <i className="ti ti-key" />
              </span>
              <div className="credential-head-tx">
                <h4>Login &amp; Access</h4>
                <span>Portal credentials · Janet Daniel · Class III-A</span>
              </div>
            </div>

            <div className="modal-body credential-body">
              <div className="credential-status">
                <span className="credential-status-on">
                  <span className="d" />
                  Portal Active
                </span>
                <span className="credential-status-meta">
                  <i className="ti ti-login-2" />
                  Last login Today, 08:12 AM · iPhone · Safari
                </span>
              </div>

              <div className="credential-creds">
                {CREDENTIALS.map((credential) => {
                  const visible = shown[credential.id] ?? false;
                  return (
                    <div className={`credential-cred ${credential.cls}`} key={credential.id}>
                      <div className="credential-cred-top">
                        <span className="avatar avatar-icon avatar-md avatar-accent">
                          <i className={credential.icon} />
                        </span>
                        <div className="credential-cred-id">
                          <b>{credential.title}</b>
                          <span>{credential.holder}</span>
                        </div>
                        <em className="profile-pill ok">
                          <i className="ti ti-circle-check" />
                          Active
                        </em>
                      </div>

                      <div className="credential-field">
                        <span className="k">
                          <i className="ti ti-at" />
                          Username
                        </span>
                        <span className="v">{credential.username}</span>
                        <button
                          type="button"
                          className="credential-ib"
                          title="Copy username"
                          aria-label="Copy username"
                          onClick={() => onCopy(credential.username)}
                        >
                          <i className="ti ti-copy" />
                        </button>
                      </div>

                      <div className="credential-field">
                        <span className="k">
                          <i className="ti ti-lock" />
                          Password
                        </span>
                        <span className="v pw">
                          {visible ? credential.password : '•'.repeat(credential.password.length)}
                        </span>
                        <button
                          type="button"
                          className="credential-ib"
                          title="Show / hide"
                          aria-label="Show or hide password"
                          onClick={() =>
                            setShown((current) => ({
                              ...current,
                              [credential.id]: !current[credential.id],
                            }))
                          }
                        >
                          <i className={visible ? 'ti ti-eye-off' : 'ti ti-eye'} />
                        </button>
                        <button
                          type="button"
                          className="credential-ib"
                          title="Copy password"
                          aria-label="Copy password"
                          onClick={() => onCopy(credential.password)}
                        >
                          <i className="ti ti-copy" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h5 className="credential-h fs-15">
                <i className="ti ti-history" />
                Recent Login Activity
              </h5>
              <div className="login-log">
                {LOGIN_LOG.map((row) => (
                  <div className="login-log-row" key={row.id}>
                    <span className={`ic ${row.accent}`}>
                      <i className={row.icon} />
                    </span>
                    <div className="tx">
                      <b>{row.who}</b>
                      <span>{row.detail}</span>
                    </div>
                    <span className="login-log-time">
                      {row.when}
                      <em className={`profile-pill ${row.pill}`}>{row.status}</em>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer credential-foot">
              <button
                type="button"
                className="btn btn-outline-danger me-auto"
                onClick={() => onAction('reset_password')}
              >
                <i className="ti ti-lock-cog me-1" />
                Reset Password
              </button>
              <button type="button" className="btn btn-light" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default LoginDetailsModal;
