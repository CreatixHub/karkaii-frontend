import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ReviewStep from './components/ReviewStep';
import WizardField from './components/WizardField';
import WizardNav from './components/WizardNav';
import {
  academicFields,
  documentFields,
  emergencyFields,
  guardianFields,
  medicalFields,
  personalFields,
  previousSchoolFields,
  transportFields,
  wizardSteps,
} from './data/addAdmission.data';

const routes = all_routes;

const AddAdmission = () => {
  const navigate = useNavigate();
  const { toasts, push, dismiss } = useToasts();

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const setValue = (id: string, value: string) => setValues((current) => ({ ...current, [id]: value }));

  const field = (spec: Parameters<typeof WizardField>[0]['field']) => (
    <WizardField key={spec.id} field={spec} value={values[spec.id] ?? ''} onChange={setValue} />
  );

  const goTo = (index: number) => setStep(Math.max(0, Math.min(wizardSteps.length - 1, index)));

  const submit = () => {
    push('Admission application submitted successfully');
    navigate(routes.admissions);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">New Admission</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item">
                    <Link to={routes.admissions}>Admissions</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    New Application
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <Link to={routes.admissions} className="btn btn-outline-light bg-white mb-2">
                <i className="ti ti-arrow-left me-1" />
                Back to List
              </Link>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="mb-0">Admission Application Form</h4>
                </div>
                <div className="card-body">
                  <div id="admission-wizard" className="twitter-bs-wizard">
                    <WizardNav steps={wizardSteps} current={step} onGoTo={goTo} />

                    <div className="tab-content twitter-bs-wizard-tab-content">
                      {/* Step 1: Personal */}
                      {step === 0 ? (
                        <div className="tab-pane show active" id="step-personal">
                          <div className="mb-4">
                            <h5>{wizardSteps[0].heading}</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">{personalFields.map(field)}</div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(1)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 2: Academic */}
                      {step === 1 ? (
                        <div className="tab-pane show active" id="step-academic">
                          <div className="mb-4">
                            <h5>{wizardSteps[1].heading}</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">{academicFields.map(field)}</div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(0)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(2)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 3: Guardian & Emergency */}
                      {step === 2 ? (
                        <div className="tab-pane show active" id="step-guardian">
                          <div className="mb-4">
                            <h5>Guardian &amp; Emergency Contact</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">{guardianFields.map(field)}</div>
                            <hr />
                            <div className="row">{emergencyFields.map(field)}</div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(1)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(3)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 4: Medical */}
                      {step === 3 ? (
                        <div className="tab-pane show active" id="step-medical">
                          <div className="mb-4">
                            <h5>{wizardSteps[3].heading}</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">{medicalFields.map(field)}</div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(2)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(4)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 5: Transport & Hostel */}
                      {step === 4 ? (
                        <div className="tab-pane show active" id="step-transport">
                          <div className="mb-4">
                            <h5>Transport &amp; Hostel</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">{transportFields.map(field)}</div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(3)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(5)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 6: Previous School */}
                      {step === 5 ? (
                        <div className="tab-pane show active" id="step-previous">
                          <div className="mb-4">
                            <h5>{wizardSteps[5].heading}</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">{previousSchoolFields.map(field)}</div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(4)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(6)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 7: Documents */}
                      {step === 6 ? (
                        <div className="tab-pane show active" id="step-documents">
                          <div className="mb-4">
                            <h5>{wizardSteps[6].heading}</h5>
                          </div>
                          <form onSubmit={(event) => event.preventDefault()}>
                            <div className="row">
                              {documentFields.map(field)}
                              <div className="col-12 col-lg-12">
                                <small className="text-muted">
                                  Accepted formats: PDF, JPG, PNG · max 5 MB each.
                                </small>
                              </div>
                            </div>
                          </form>
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(5)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="next float-end">
                              <button type="button" className="btn btn-primary" onClick={() => goTo(7)}>
                                Next <i className="ti ti-chevron-right ms-1" />
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {/* Step 8: Review & Submit */}
                      {step === 7 ? (
                        <div className="tab-pane show active" id="step-review">
                          <div className="mb-4">
                            <h5>{wizardSteps[7].heading}</h5>
                          </div>
                          <ReviewStep confirmed={confirmed} onConfirm={setConfirmed} onGoTo={goTo} />
                          <ul className="pager wizard twitter-bs-wizard-pager-link">
                            <li className="previous">
                              <button type="button" className="btn btn-light" onClick={() => goTo(6)}>
                                <i className="ti ti-chevron-left me-1" /> Previous
                              </button>
                            </li>
                            <li className="float-end">
                              <button type="button" className="btn btn-primary" onClick={submit}>
                                <i className="ti ti-check me-1" />
                                Submit Application
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="addAdmToasts" />
    </>
  );
};

export default AddAdmission;
