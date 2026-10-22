import { useEffect, useState } from "react";

// Left-hand panel of the login page: animated brand backdrop, a preview card and a rotating feature highlight.
// Purely decorative (the numbers in the preview card are illustrative) - hence aria-hidden on the artwork.
// Styles: src/style/scss/pages/_login-showcase.scss. Every animation stops under `prefers-reduced-motion`.

const FEATURES = [
  {
    icon: "ti-users-group",
    title: "One school, four dashboards",
    text: "Admins, teachers, students and parents each get a view built for them.",
  },
  {
    icon: "ti-calendar-check",
    title: "Attendance in seconds",
    text: "Mark and review daily attendance for every class, all in one place.",
  },
  {
    icon: "ti-clock-hour-4",
    title: "Timetables and routines",
    text: "Plan classes, teachers and schedules without the spreadsheets.",
  },
  {
    icon: "ti-certificate",
    title: "From exams to report cards",
    text: "Schedule exams, enter marks and publish results to parents.",
  },
];

const ROTATE_MS = 4500;
const BARS = [58, 72, 64, 86, 78, 94, 70];
const CHIPS = [
  { icon: "ti-receipt", label: "Fees collected", cls: "kk-chip--a" },
  { icon: "ti-bell", label: "New notice sent", cls: "kk-chip--b" },
  { icon: "ti-book-2", label: "Homework assigned", cls: "kk-chip--c" },
  { icon: "ti-certificate", label: "Results published", cls: "kk-chip--d" },
];

const LoginShowcase = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % FEATURES.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const feature = FEATURES[active];

  return (
    <div className="kk-showcase d-none d-lg-flex">
      <div className="kk-aurora" aria-hidden="true">
        <span className="kk-blob kk-blob--1" />
        <span className="kk-blob kk-blob--2" />
        <span className="kk-blob kk-blob--3" />
        <span className="kk-dots" />
      </div>

      <div className="kk-content">
        <span className="kk-eyebrow kk-rise" style={{ animationDelay: "0.05s" }}>
          <i className="kk-pulse" aria-hidden="true" />
          School management, simplified
        </span>

        <p className="kk-title kk-rise" style={{ animationDelay: "0.15s" }}>
          Everything your school needs, <span className="kk-shimmer">in one place</span>
        </p>

        <div className="kk-stage kk-rise" style={{ animationDelay: "0.3s" }} aria-hidden="true">
          <div className="kk-card">
            <div className="kk-card-head">
              <span className="kk-card-title">
                <i className="ti ti-calendar-check" /> Attendance overview
              </span>
              <span className="kk-live">Today</span>
            </div>
            <div className="kk-card-body">
              <div className="kk-ring">
                <svg viewBox="0 0 120 120" width="112" height="112">
                  <defs>
                    <linearGradient id="kk-ring-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7dd3fc" />
                      <stop offset="100%" stopColor="#a5b4fc" />
                    </linearGradient>
                  </defs>
                  <circle className="kk-ring-track" cx="60" cy="60" r="52" />
                  <circle className="kk-ring-value" cx="60" cy="60" r="52" />
                </svg>
                <span className="kk-ring-label">
                  94<small>%</small>
                </span>
              </div>
              <div className="kk-bars">
                {BARS.map((h, i) => (
                  <span key={i} className="kk-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.28}s` }} />
                ))}
              </div>
            </div>
          </div>

          {CHIPS.map((c) => (
            <span key={c.label} className={`kk-chip ${c.cls}`}>
              <i className={`ti ${c.icon}`} />
              {c.label}
            </span>
          ))}
        </div>

        <div className="kk-feature kk-rise" style={{ animationDelay: "0.45s" }} aria-live="polite">
          <div key={active} className="kk-feature-body">
            <span className="kk-feature-icon">
              <i className={`ti ${feature.icon}`} aria-hidden="true" />
            </span>
            <div>
              <p className="kk-feature-title">{feature.title}</p>
              <p className="kk-feature-text">{feature.text}</p>
            </div>
          </div>
          <div className="kk-dotnav" role="tablist" aria-label="Feature highlights">
            {FEATURES.map((f, i) => (
              <button
                key={f.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={f.title}
                className={`kk-dotnav-btn${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginShowcase;
