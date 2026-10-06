
import { Link } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CopyrightLine from "../CopyrightLine";

const ResetPasswordSuccess3 = () => {
  const routes = all_routes;
  return (
    <>
      {" "}
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="row justify-content-center flex-fill">
          <div className="col-md-4 mx-auto p-4">
            <div className=" mx-auto mb-5 text-center">
              <ImageWithBasePath
                src="assets/img/karkaii-logo.png"
                className="img-fluid"
                alt="Logo"
              />
            </div>
            <div className="card">
              <div className="card-body text-center">
                <span className="avatar avatar-lg rounded-circle bg-success mb-3">
                  <i className="ti ti-check fs-24" />
                </span>
                <h3 className="mb-2">Success</h3>
                <p>Your Password Reset Successfully</p>
                <Link to={routes.login3} className="btn btn-primary w-100">
                  Back to Login
                </Link>
              </div>
            </div>
            <div className="mt-5 text-center">
              <CopyrightLine className="mb-0 " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordSuccess3;
