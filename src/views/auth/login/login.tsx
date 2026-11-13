import  { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, Navigate, useLocation } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import CopyrightLine from "../CopyrightLine";
import LoginShowcase from "./LoginShowcase";
import { env } from "@config/env";
import { useAuth } from "@hooks/useAuth";
import { useLogin } from "@features/auth";
import { roleHomeRoute } from "@features/auth/roleHome";

const Login = () => {
  const routes = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { form, isLoggingIn } = useLogin();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  // Set by the register hook after a successful sign-up (`navigate(login, { state: { registered: true } })`).
  const justRegistered = Boolean((location.state as { registered?: boolean } | null)?.registered);
  // True once the person pressed "Sign In" on THIS page. From then on useLogin decides where they go
  // (the dashboard of the role they picked), so the "already signed in" shortcut below must stay out of the way.
  const signInPressed = useRef(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    signInPressed.current = true;
    form.handleSubmit(event);
  };

  // Already signed in (e.g. opened /login in a second tab): go straight to the dashboard.
  if (env.authEnabled && isAuthenticated && user && !signInPressed.current) {
    return <Navigate to={roleHomeRoute(user.role)} replace />;
  }

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-6">
            <LoginShowcase />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap ">
              <div className="col-md-8 mx-auto p-4">
                <form onSubmit={handleSubmit} noValidate>
                  <div>
                    <div className=" mx-auto mb-5 text-center">
                      <ImageWithBasePath
                        src="assets/img/karkaii-logo.png"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="card">
                      <div className="card-body pb-3">
                        <div className=" mb-4">
                          <h2 className="mb-2">Welcome</h2>
                          <p className="mb-0">
                            Please enter your details to sign in
                          </p>
                        </div>
                        {justRegistered && (
                          <div className="alert alert-success py-2 mb-3" role="alert">
                            Registered successfully! Please sign in to continue.
                          </div>
                        )}
                        <div className="mb-3">
                          <label className="form-label">Sign in as</label>
                          <select
                            name="role"
                            className="form-select"
                            value={form.values.role}
                            onChange={form.handleChange}
                          >
                            <option value="">My main role (automatic)</option>
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                            <option value="parent">Parent</option>
                            <option value="accountant">Accountant</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="librarian">Librarian</option>
                            <option value="warden">Warden</option>
                            <option value="transport_manager">Transport manager</option>
                            <option value="nurse">Nurse</option>
                            <option value="security">Security</option>
                          </select>
                        </div>
                        <div className="mb-3 ">
                          <label className="form-label">Email Address</label>
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
                          <label className="form-label">Password</label>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              name="password"
                              autoComplete="current-password"
                              value={form.values.password}
                              onChange={form.handleChange}
                              onBlur={form.handleBlur}
                              className={`pass-input form-control${form.touched.password && form.errors.password ? " is-invalid" : ""}`}
                              aria-invalid={Boolean(form.touched.password && form.errors.password)}
                            />
                            <span
                              className={`ti toggle-password ${
                                isPasswordVisible ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                          {form.touched.password && form.errors.password && (
                            <div className="text-danger fs-13 mt-1">{form.errors.password}</div>
                          )}
                        </div>
                        {form.submitError && (
                          <div className="alert alert-danger py-2 mb-3" role="alert">
                            {form.submitError.message}
                          </div>
                        )}
                        <div className="form-wrap form-wrap-checkbox">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                name="rememberMe"
                                id="rememberMe"
                                checked={form.values.rememberMe}
                                onChange={form.handleChange}
                              />
                            </div>
                            <p className="ms-1 mb-0 ">Remember Me</p>
                          </div>
                          <div className="text-end ">
                            <Link to={routes.forgotPassword} className="link-danger">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={form.isSubmitting || isLoggingIn}
                          >
                            {form.isSubmitting || isLoggingIn ? "Signing in..." : "Sign In"}
                          </button>
                        </div>
                        <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Don't have an account?{" "}
                            <Link to={routes.register} className="hover-a ">
                              {" "}
                              Create Account
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
  );
};

export default Login;