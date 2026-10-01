import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { RecordCard } from './data/scaffold.data';
import { recordsFor, STATS, STATUS_OPTIONS, STATUS_TINT } from './data/scaffold.data';

const routes = all_routes;

export interface RecordCardsPageProps {
  /** Plural page title, e.g. "Subscription Plans". */
  title: string;
  /** Singular noun the cards and dialogs are named after, e.g. "Subscription Plan". */
  noun: string;
  /** The tile icon each card carries. */
  icon?: string;
  section?: string;
}

const RecordCardsPage = ({
  title,
  noun,
  icon = 'ti ti-award',
  section = 'Administration',
}: RecordCardsPageProps) => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<RecordCard[]>(() => recordsFor(noun));
  const [dialog, setDialog] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [target, setTarget] = useState<RecordCard | null>(null);

  const [form, setForm] = useState<{ name: string; status: string; description: string }>({
    name: '',
    status: STATUS_OPTIONS[0],
    description: '',
  });

  const open = (next: 'add' | 'edit' | 'delete', row: RecordCard | null) => {
    setTarget(row);
    setForm({
      name: row?.name ?? '',
      status: (row && STATUS_OPTIONS.includes(row.status) ? row.status : STATUS_OPTIONS[0]) as string,
      description: '',
    });
    setDialog(next);
  };

  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    push(message);
    setDialog(null);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">{title}</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">{section}</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => {
                  setRows(recordsFor(noun));
                  push(`${title} reloaded`);
                }}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => open('add', null)}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add {noun}
              </button>
            </div>
          </div>

          <div className="row">
            {STATS.map((stat) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={stat.id}>
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">{stat.label}</p>
                      <h4 className="mb-0">{stat.value}</h4>
                    </div>
                    <span
                      className={`avatar avatar-lg bg-${stat.tint}-transparent text-${stat.tint} rounded`}
                    >
                      <i className={`${stat.icon} fs-24`} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            {rows.map((row) => (
              <div className="col-xl-4 col-md-6 d-flex" key={row.id}>
                <div className="card flex-fill">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span
                        className={`avatar avatar-lg bg-${row.tint}-transparent text-${row.tint} rounded`}
                      >
                        <i className={`${icon} fs-24`} />
                      </span>
                      <span
                        className={`badge badge-soft-${STATUS_TINT[row.status]} d-inline-flex align-items-center`}
                      >
                        <i className="ti ti-circle-filled fs-5 me-1" />
                        {row.status}
                      </span>
                    </div>
                    <h5 className="mb-1">{row.name}</h5>
                    <p className="text-muted mb-3">Reference {row.reference}</p>
                    <ul className="list-unstyled mb-3">
                      <li className="d-flex justify-content-between py-1 fs-13">
                        <span className="text-muted">Members</span>
                        <span className="text-dark">{row.members}</span>
                      </li>
                      <li className="d-flex justify-content-between py-1 fs-13">
                        <span className="text-muted">Updated</span>
                        <span className="text-dark">{row.updatedOn}</span>
                      </li>
                    </ul>
                    <div className="d-flex align-items-center gap-2">
                      <ActionLink
                        className="btn btn-light btn-sm flex-fill"
                        onClick={() => open('edit', row)}
                      >
                        <i className="ti ti-edit me-1" />
                        Edit
                      </ActionLink>
                      <ActionLink
                        className="btn btn-outline-danger btn-sm"
                        ariaLabel={`Delete ${row.name}`}
                        onClick={() => open('delete', row)}
                      >
                        <i className="ti ti-trash" />
                      </ActionLink>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={dialog === 'add' || dialog === 'edit'}
        onClose={() => setDialog(null)}
        title={`${dialog === 'edit' ? 'Edit' : 'Add'} ${noun}`}
        onSubmit={submit(
          dialog === 'edit' ? `${target?.name ?? noun} updated` : `${noun} added`,
        )}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              {dialog === 'edit' ? 'Save Changes' : `Add ${noun}`}
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="record-name">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="record-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="record-status">
              Status
            </label>
            <select
              className="form-select"
              id="record-status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="record-description">
              Description
            </label>
            <textarea
              className="form-control"
              rows={3}
              id="record-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialog === 'delete'}
        onClose={() => setDialog(null)}
        title="Confirm Deletion"
        bodyClassName="text-center"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setDialog(null)}>
              Cancel
            </ActionLink>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                setRows((current) => current.filter((row) => row.id !== target?.id));
                push(`${target?.name ?? noun} deleted`, 'danger');
                setDialog(null);
              }}
            >
              Yes, Delete
            </button>
          </>
        }
      >
        <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3">
          <i className="ti ti-trash fs-24" />
        </span>
        <p className="fs-14 mb-0">
          You want to delete all the marked items, this cant be undone once you delete.
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="administrationRecordToasts" />
    </>
  );
};

export default RecordCardsPage;
