import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import CopyrightLine from "../auth/CopyrightLine";

/** When the site opens. Every figure on the page counts down to this. */
const LAUNCH = new Date("2026-10-12T09:00:00");

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** What is left between now and the launch, broken into the four units shown. */
const remainingUntil = (target: Date) => {
  const left = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(left / DAY),
    hours: Math.floor((left % DAY) / HOUR),
    minutes: Math.floor((left % HOUR) / MINUTE),
    seconds: Math.floor((left % MINUTE) / SECOND),
  };
};

const ComingSoon = () => {
  const [left, setLeft] = useState(() => remainingUntil(LAUNCH));

  useEffect(() => {
    const intervalId = setInterval(() => setLeft(remainingUntil(LAUNCH)), 1000);
    return () => clearInterval(intervalId);
  }, []);

  /** The template pads every unit to two digits. */
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    <div className="main-wrapper">
      <div className="text-center mt-4">
        <ImageWithBasePath src="assets/img/logo.svg" alt="img" className="img-fluid" />
      </div>
      <div className="comming-soon-pg w-100">
        <div>
          <div className="error-img m-auto">
            <ImageWithBasePath
              src="assets/img/authentication/coming-soon.svg"
              className="img-fluid"
              alt="Img"
            />
          </div>
          <ul className="d-inline-flex align-items-center justify-content-center mb-3">
            <li className="me-sm-3 me-2">
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="days fs-sm-30 fs-30">{pad(left.days)}</h3>
                <p className="fs-16">Day</p>
              </div>
            </li>
            <li className="text-gray fw-medium me-sm-3 me-2">:</li>
            <li className="me-sm-3 me-2">
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="hours fs-sm-30 fs-30">{pad(left.hours)}</h3>
                <p className="fs-16">Hrs</p>
              </div>
            </li>
            <li className="text-gray fw-medium me-sm-3 me-2">:</li>
            <li className="me-sm-3 me-2">
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="minutes fs-sm-30 fs-30">{pad(left.minutes)}</h3>
                <p className="fs-16">Min</p>
              </div>
            </li>
            <li className="text-gray fw-medium me-sm-3 me-2">:</li>
            <li>
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="seconds fs-sm-30 fs-30">{pad(left.seconds)}</h3>
                <p className="fs-16">Sec</p>
              </div>
            </li>
          </ul>
          <div className="subscribe-form">
            <div className="mb-3 position-relative">
              <label className="d-flex form-label" htmlFor="subscribe-to-get-notified">
                Subscribe to get notified!
              </label>
              <div className="bg-white border border-2 p-1 d-flex align-items-center rounded ps-0">
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Enter Your Email"
                  id="subscribe-to-get-notified"
                />
                <Link to="#" className="btn btn-primary">
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            <Link to="#" className="btn btn-dark btn-icon btn-sm me-2">
              <i className="ti ti-brand-facebook fs-16" />
            </Link>
            <Link to="#" className="btn btn-dark btn-icon btn-sm me-2">
              <i className="ti ti-brand-instagram fs-16" />
            </Link>
            <Link to="#" className="btn btn-dark btn-icon btn-sm me-2">
              <i className="ti ti-brand-twitter fs-16" />
            </Link>
            <Link to="#" className="btn btn-dark btn-icon btn-sm me-2">
              <i className="ti ti-brand-pinterest fs-16" />
            </Link>
            <Link to="#" className="btn btn-dark btn-icon btn-sm">
              <i className="ti ti-brand-linkedin fs-16" />
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center mb-5">
        <CopyrightLine />
      </div>
    </div>
  );
};

export default ComingSoon;
