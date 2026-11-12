import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CopyrightLine from "../CopyrightLine";
import { env } from "@config/env";
import { useAuth } from "@hooks/useAuth";
import { useSignup } from "@features/auth";
import { roleHomeRoute } from "@features/auth/roleHome";

type PasswordField = "password" | "confirmPassword";

const Register = () => {
  const routes = all_routes;
  const { form, isSigningUp } = useSignup();
  const { user, isAuthenticated } = useAuth();

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Already signed in (e.g. opened /register in a second tab): go straight to the dashboard.
  if (env.authEnabled && isAuthenticated && user) {
    return <Navigate to={roleHomeRoute(user.role)} replace />;
  }
  return (
    <>
      <div className="container-fuild">
        <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row">
            <div className="col-lg-6">
              <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-lg-block d-none flex-wrap vh-100 overflowy-auto">
                <div>
                  <ImageWithBasePath
                    src="assets/img/authentication/authentication-01.jpg"
                    alt="Img"
                  />
                </div>
                <div className="authen-overlay-item  w-100 p-4">
                  <h4 className="text-white mb-3">What's New on Karkaii !!!</h4>
                  <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                    <div>
                      <h6>Summer Vacation Holiday Homework</h6>
                      <p className="mb-0 text-truncate">
                        The school will remain closed from April 20th to June...
                      </p>
                    </div>
                    <Link to="3">
                      <i className="ti ti-chevrons-right" />
                    </Link>
                  </div>
                  <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                    <div>
                      <h6>New Academic Session Admission Start(2024-25)</h6>
                      <p className="mb-0 text-truncate">
                        An academic term is a portion of an academic year, the
                        time ....
                      </p>
                    </div>
                    <Link to="3">
                      <i className="ti ti-chevrons-right" />
                    </Link>
                  </div>
                  <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                    <div>
                      <h6>Date sheet Final Exam Nursery to Sr.Kg</h6>
                      <p className="mb-0 text-truncate">
                        Dear Parents, As the final examination for the session
                        2026-27 is ...
                      </p>
                    </div>
                    <Link to="3">
                      <i className="ti ti-chevrons-right" />
                    </Link>
                  </div>
                  <div className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card">
                    <div>
                      <h6>Annual Day Function</h6>
                      <p className="mb-0 text-truncate">
                        Annual functions provide a platform for students to
                        showcase their...
                      </p>
                    </div>
                    <Link to="3">
                      <i className="ti ti-chevrons-right" />
                    </Link>
                  </div>
                  <div className="d-flex align-items-center flex-row mb-0 justify-content-between p-3 br-5 gap-3 card">
                    <div>
                      <h6>Summer Vacation Holiday Homework</h6>
                      <p className="mb-0 text-truncate">
                        The school will remain closed from April 20th to June
                        15th for summer...
                      </p>
                    </div>
                    <Link to="3">
                      <i className="ti ti-chevrons-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
                <div className="col-md-8 mx-auto p-4">
                  <form onSubmit={form.handleSubmit} noValidate>
                    <div>
                      <div className=" mx-auto mb-5 text-center">
                        <ImageWithBasePath
                          src="assets/img/karkaii-logo.png"
                          className="img-fluid"
                          alt="Logo"
                        />
                      </div>
                      <div className="card">
                        <div className="card-body p-4">
                          <div className=" mb-4">
                            <h2 className="mb-2">Register</h2>
                            <p className="mb-0">
                              Please enter your details to sign up
                            </p>
                          </div>
                          <div className="mt-4">
                            <div className="mb-3 ">
                              <label className="form-label">Name</label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-user" />
                                </span>
                                <input
                                  type="text"
                                  name="fullName"
                                  autoComplete="name"
                                  value={form.values.fullName}
                                  onChange={form.handleChange}
                                  onBlur={form.handleBlur}
                                  className={`form-control${form.touched.fullName && form.errors.fullName ? " is-invalid" : ""}`}
                                  aria-invalid={Boolean(form.touched.fullName && form.errors.fullName)}
                                />
                              </div>
                              {form.touched.fullName && form.errors.fullName && (
                                <div className="text-danger fs-13 mb-2">{form.errors.fullName}</div>
                              )}
                              <label className="form-label">
                                Email Address
                              </label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-mail" />
                                </span>
                                <input
                                  type="email"
                                  name="email"
                                  autoComplete="username"
                                  value={form.values.email}
                                  onChange={form.handleChange}
                                  onBlur={form.handleBlur}
                                  className={`form-control${form.touched.email && form.errors.email ? " is-invalid" : ""}`}
                                  aria-invalid={Boolean(form.touched.email && form.errors.email)}
                                />
                              </div>
                              {form.touched.email && form.errors.email && (
                                <div className="text-danger fs-13 mb-2">{form.errors.email}</div>
                              )}
                              <label className="form-label">School Name</label>
                              <div className="input-icon mb-3 position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-building" />
                                </span>
                                <input
                                  type="text"
                                  name="schoolName"
                                  value={form.values.schoolName}
                                  onChange={form.handleChange}
                                  onBlur={form.handleBlur}
                                  className={`form-control${form.touched.schoolName && form.errors.schoolName ? " is-invalid" : ""}`}
                                  aria-invalid={Boolean(form.touched.schoolName && form.errors.schoolName)}
                                />
                              </div>
                              {form.touched.schoolName && form.errors.schoolName && (
                                <div className="text-danger fs-13 mb-2">{form.errors.schoolName}</div>
                              )}
                              <label className="form-label">Password</label>
                              <div className="pass-group mb-3">
                                <input
                                  type={
                                    passwordVisibility.password
                                      ? "text"
                                      : "password"
                                  }
                                  name="password"
                                  autoComplete="new-password"
                                  value={form.values.password}
                                  onChange={form.handleChange}
                                  onBlur={form.handleBlur}
                                  className={`pass-input form-control${form.touched.password && form.errors.password ? " is-invalid" : ""}`}
                                  aria-invalid={Boolean(form.touched.password && form.errors.password)}
                                />
                                <span
                                  className={`ti toggle-passwords ${
                                    passwordVisibility.password
                                      ? "ti-eye"
                                      : "ti-eye-off"
                                  }`}
                                  onClick={() =>
                                    togglePasswordVisibility("password")
                                  }
                                ></span>
                              </div>
                              {form.touched.password && form.errors.password && (
                                <div className="text-danger fs-13 mb-2">{form.errors.password}</div>
                              )}
                              <label className="form-label">
                                Confirm Password
                              </label>
                              <div className="pass-group">
                                <input
                                  type={
                                    passwordVisibility.confirmPassword
                                      ? "text"
                                      : "password"
                                  }
                                  name="confirmPassword"
                                  autoComplete="new-password"
                                  value={form.values.confirmPassword}
                                  onChange={form.handleChange}
                                  onBlur={form.handleBlur}
                                  className={`pass-input form-control${form.touched.confirmPassword && form.errors.confirmPassword ? " is-invalid" : ""}`}
                                  aria-invalid={Boolean(form.touched.confirmPassword && form.errors.confirmPassword)}
                                />
                                <span
                                  className={`ti toggle-passwords ${
                                    passwordVisibility.confirmPassword
                                      ? "ti-eye"
                                      : "ti-eye-off"
                                  }`}
                                  onClick={() =>
                                    togglePasswordVisibility("confirmPassword")
                                  }
                                ></span>
                              </div>
                              {form.touched.confirmPassword && form.errors.confirmPassword && (
                                <div className="text-danger fs-13 mt-1">{form.errors.confirmPassword}</div>
                              )}
                            </div>
                            {form.submitError && (
                              <div className="alert alert-danger py-2 mb-3" role="alert">
                                {form.submitError.message}
                              </div>
                            )}
                            <div className="form-wrap form-wrap-checkbox mb-3">
                              <div className="d-flex align-items-center">
                                <div className="form-check form-check-md mb-0 me-2">
                                  <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={form.values.agreeToTerms}
                                    onChange={form.handleChange}
                                  />
                                </div>
                                <h6 className="fw-normal text-dark mb-0">
                                  I Agree to
                                  <Link to="#" className="hover-a ">
                                    {" "}
                                    Terms &amp; Privacy
                                  </Link>
                                </h6>
                              </div>
                              {form.touched.agreeToTerms && form.errors.agreeToTerms && (
                                <div className="text-danger fs-13 mt-1">{form.errors.agreeToTerms}</div>
                              )}
                            </div>
                          </div>
                          <div className="mb-3">
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                              disabled={form.isSubmitting || isSigningUp}
                            >
                              {form.isSubmitting || isSigningUp ? "Creating your school…" : "Sign Up"}
                            </button>
                          </div>
                          <div className="text-center">
                            <h6 className="fw-normal text-dark mb-0">
                              Already have an account?
                              <Link to={routes.login} className="hover-a ">
                                {" "}
                                Sign In
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 text-center">
                        <CopyrightLine className="mb-0 " />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
