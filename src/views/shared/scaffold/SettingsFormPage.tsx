import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import SettingsIndexNav from './SettingsIndexNav';
import { ACADEMIC_YEARS, INSTITUTIONS, switchesFor } from './data/scaffold.data';

const routes = all_routes;

export interface SettingsFormPageProps {
  /** The page title, which also names the first switch. */
  title: string;
  /** The middle breadcrumb entry. */
  section?: string;
}

const SettingsFormPage = ({ title, section = 'Administration' }: SettingsFormPageProps) => {
  const { toasts, push, dismiss } = useToasts();

  const switches = switchesFor(title);

  const [form, setForm] = useState({
    institution: INSTITUTIONS[0],
    academicYear: ACADEMIC_YEARS[0],
    contact: '',
    email: '',
    notes: '',
  });
  const [flags, setFlags] = useState<Record<string, boolean>>(
    Object.fromEntries(switches.map((entry) => [entry.id, true])),
  );

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const reset = () => {
    setForm({
      institution: INSTITUTIONS[0],
      academicYear: ACADEMIC_YEARS[0],
      contact: '',
      email: '',
      notes: '',
    });
    setFlags(Object.fromEntries(switches.map((entry) => [entry.id, true])));
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
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
                  reset();
                  push(`${title} reloaded`);
                }}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-3 col-lg-4 d-flex">
              <SettingsIndexNav />
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{title}</h5>
                </div>
                <div className="card-body">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      push(`${title} saved`);
                    }}
                    onReset={(event) => {
                      event.preventDefault();
                      reset();
                    }}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="institution">
                            Institution
                          </label>
                          <select
                            className="form-select"
                            id="institution"
                            value={form.institution}
                            onChange={(event) => set('institution')(event.target.value)}
                          >
                            {INSTITUTIONS.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="academic-year">
                            Academic Year
                          </label>
                          <select
                            className="form-select"
                            id="academic-year"
                            value={form.academicYear}
                            onChange={(event) => set('academicYear')(event.target.value)}
                          >
                            {ACADEMIC_YEARS.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="primary-contact">
                            Primary Contact
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="primary-contact"
                            value={form.contact}
                            onChange={(event) => set('contact')(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="support-email">
                            Support Email
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="support-email"
                            value={form.email}
                            onChange={(event) => set('email')(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <hr className="my-2" />
                      </div>

                      {switches.map((entry) => (
                        <div className="col-md-12 mb-3" key={entry.id}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="status-title">
                              <h6 className="mb-1">{entry.label}</h6>
                              <p className="mb-0 fs-13 text-muted">{entry.note}</p>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                aria-label={entry.label}
                                checked={flags[entry.id]}
                                onChange={() =>
                                  setFlags((current) => ({
                                    ...current,
                                    [entry.id]: !current[entry.id],
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="col-md-12">
                        <div className="mb-0">
                          <label className="form-label" htmlFor="notes">
                            Notes
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Internal notes for this setting"
                            id="notes"
                            value={form.notes}
                            onChange={(event) => set('notes')(event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                      <button type="reset" className="btn btn-light">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="administrationToasts" />
    </>
  );
};

export default SettingsFormPage;
