import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AlumniFormField from './components/AlumniFormField';
import { alumniCards } from './data/addAlumni.data';

const routes = all_routes;

const AddAlumni = () => {
  const navigate = useNavigate();
  const { toasts, push, dismiss } = useToasts();

  const [values, setValues] = useState<Record<string, string>>({});

  const setValue = (id: string, value: string) => setValues((current) => ({ ...current, [id]: value }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    push('Alumni saved successfully');
    navigate(routes.alumni);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Add Alumni</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item">
                    <Link to={routes.alumni}>Alumni</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Alumni
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <Link to={routes.alumni} className="btn btn-outline-light bg-white mb-2">
                <i className="ti ti-arrow-left me-1" />
                Back
              </Link>
            </div>
          </div>
          {/* /Page Header */}

          <form onSubmit={submit}>
            <div className="row">
              <div className="col-md-12">
                {alumniCards.map((card) => (
                  <div className="card" key={card.id}>
                    <div className="card-header">
                      {card.large ? (
                        <h4 className="mb-0 fs-16 fw-medium">
                          <i className={`${card.icon} me-2`} />
                          {card.title}
                        </h4>
                      ) : (
                        <h5 className="mb-0">
                          <i className={`${card.icon} me-2`} />
                          {card.title}
                        </h5>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {card.fields.map((field) => (
                          <AlumniFormField
                            key={field.id}
                            field={field}
                            value={values[field.id] ?? ''}
                            onChange={setValue}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-end mb-4">
                  <Link to={routes.alumni} className="btn btn-light me-2">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    <i className="ti ti-check me-1" />
                    Save Alumni
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="addAlumniToasts" />
    </>
  );
};

export default AddAlumni;
