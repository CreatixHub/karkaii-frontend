import type { AccordionId, RuleSettings, RuleTemplate } from '../data/attendanceRules.data';
import {
  accordionSections,
  actionOptions,
  departmentOptions,
  employeeCategoryOptions,
  fallbackCaptureOptions,
  lateAllowedOptions,
  primaryCaptureOptions,
  weekDays,
} from '../data/attendanceRules.data';

export interface RuleBuilderProps {
  rule: RuleTemplate;
  settings: RuleSettings;
  onChange: (patch: Partial<RuleSettings>) => void;
  open: AccordionId;
  onOpen: (section: AccordionId) => void;
}

const Field = ({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  className: string;
  children: React.ReactNode;
}) => (
  <div className={className}>
    <label className="form-label fs-12 mb-1" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
  </div>
);

const RuleBuilder = ({ rule, settings, onChange, open, onOpen }: RuleBuilderProps) => {
  const body = (id: AccordionId) => {
    if (id === 'timing') {
      return (
        <div className="row g-3">
          <Field label="Start Time" htmlFor="start-time" className="col-md-3 col-sm-6">
            <input
              type="time"
              className="form-control"
              id="start-time"
              value={settings.startTime}
              onChange={(event) => onChange({ startTime: event.target.value })}
            />
          </Field>
          <Field label="End Time" htmlFor="end-time" className="col-md-3 col-sm-6">
            <input
              type="time"
              className="form-control"
              id="end-time"
              value={settings.endTime}
              onChange={(event) => onChange({ endTime: event.target.value })}
            />
          </Field>
          <Field label="Minimum Hours" htmlFor="minimum-hours" className="col-md-3 col-sm-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="minimum-hours"
                value={settings.minimumHours}
                onChange={(event) => onChange({ minimumHours: event.target.value })}
              />
              <span className="input-group-text">hrs</span>
            </div>
          </Field>
          <Field label="Break Duration" htmlFor="break-duration" className="col-md-3 col-sm-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="break-duration"
                value={settings.breakDuration}
                onChange={(event) => onChange({ breakDuration: event.target.value })}
              />
              <span className="input-group-text">min</span>
            </div>
          </Field>
        </div>
      );
    }

    if (id === 'grace') {
      return (
        <div className="row g-3">
          <Field label="Grace Period" htmlFor="grace-period" className="col-md-3 col-sm-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="grace-period"
                value={settings.gracePeriod}
                onChange={(event) => onChange({ gracePeriod: event.target.value })}
              />
              <span className="input-group-text">min</span>
            </div>
          </Field>
          <Field label="Mark Late After" htmlFor="mark-late-after" className="col-md-3 col-sm-6">
            <input
              type="time"
              className="form-control"
              id="mark-late-after"
              value={settings.markLateAfter}
              onChange={(event) => onChange({ markLateAfter: event.target.value })}
            />
          </Field>
          <Field label="Early Exit Before" htmlFor="early-exit-before" className="col-md-3 col-sm-6">
            <input
              type="time"
              className="form-control"
              id="early-exit-before"
              value={settings.earlyExitBefore}
              onChange={(event) => onChange({ earlyExitBefore: event.target.value })}
            />
          </Field>
          <Field label="Half Day Below" htmlFor="half-day-below" className="col-md-3 col-sm-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="half-day-below"
                value={settings.halfDayBelow}
                onChange={(event) => onChange({ halfDayBelow: event.target.value })}
              />
              <span className="input-group-text">hrs</span>
            </div>
          </Field>
          <Field
            label="Late Arrivals Allowed / Month"
            htmlFor="late-arrivals-allowed-month"
            className="col-md-6"
          >
            <select
              className="form-select"
              id="late-arrivals-allowed-month"
              value={settings.lateAllowed}
              onChange={(event) => onChange({ lateAllowed: event.target.value })}
            >
              {lateAllowedOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Action on Exceeding" htmlFor="action-on-exceeding" className="col-md-6">
            <select
              className="form-select"
              id="action-on-exceeding"
              value={settings.actionOnExceeding}
              onChange={(event) => onChange({ actionOnExceeding: event.target.value })}
            >
              {actionOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>
      );
    }

    if (id === 'scope') {
      return (
        <div className="row g-3">
          <Field label="Employee Category" htmlFor="employee-category" className="col-md-4 col-sm-6">
            <select
              className="form-select"
              id="employee-category"
              value={settings.employeeCategory}
              onChange={(event) => onChange({ employeeCategory: event.target.value })}
            >
              {employeeCategoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Department" htmlFor="department" className="col-md-4 col-sm-6">
            <select
              className="form-select"
              id="department"
              value={settings.department}
              onChange={(event) => onChange({ department: event.target.value })}
            >
              {departmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Effective From" htmlFor="effective-from" className="col-md-4 col-sm-6">
            <input
              type="text"
              className="form-control datetimepicker"
              id="effective-from"
              value={settings.effectiveFrom}
              onChange={(event) => onChange({ effectiveFrom: event.target.value })}
            />
          </Field>
          <div className="col-12">
            <label className="form-label fs-12 mb-1">Working Days</label>
            <div className="d-flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const on = settings.workingDays.includes(day);
                return (
                  <button
                    type="button"
                    className={`btn btn-sm btn-outline-primary${on ? ' active' : ''}`}
                    key={day}
                    aria-pressed={on}
                    onClick={() =>
                      onChange({
                        workingDays: on
                          ? settings.workingDays.filter((value) => value !== day)
                          : [...settings.workingDays, day],
                      })
                    }
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="row g-3">
        <Field label="Primary Capture Method" htmlFor="primary-capture-method" className="col-md-6">
          <select
            className="form-select"
            id="primary-capture-method"
            value={settings.primaryCapture}
            onChange={(event) => onChange({ primaryCapture: event.target.value })}
          >
            {primaryCaptureOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Fallback Method" htmlFor="fallback-method" className="col-md-6">
          <select
            className="form-select"
            id="fallback-method"
            value={settings.fallbackCapture}
            onChange={(event) => onChange({ fallbackCapture: event.target.value })}
          >
            {fallbackCaptureOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <div className="col-md-6">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="cap_auto_absent"
              checked={settings.autoMarkAbsent}
              onChange={(event) => onChange({ autoMarkAbsent: event.target.checked })}
            />
            <label className="form-check-label fs-13" htmlFor="cap_auto_absent">
              Auto-mark absent with no punch by 11:00 AM
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="cap_manual"
              checked={settings.allowManualOverride}
              onChange={(event) => onChange({ allowManualOverride: event.target.checked })}
            />
            <label className="form-check-label fs-13" htmlFor="cap_manual">
              Allow manual override with HR approval
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded me-3">
            <i className={`${rule.icon} fs-20`} />
          </span>
          <div>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
              <h5 className="mb-0">{rule.label}</h5>
              <span className="badge badge-soft-bordered">{rule.code}</span>
            </div>
            <p className="mb-0 fs-12 text-muted">
              {rule.scope} &nbsp;•&nbsp; Effective 01 Apr 2026
            </p>
          </div>
        </div>
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="rule_active"
            checked={settings.active}
            onChange={(event) => onChange({ active: event.target.checked })}
          />
          <label className="form-check-label fs-13" htmlFor="rule_active">
            Rule active
          </label>
        </div>
      </div>
      <div className="card-body">
        <div className="accordion accordions-items-seperate" id="ruleBuilder">
          {accordionSections.map((section) => {
            const expanded = open === section.id;
            return (
              <div className="accordion-item card" key={section.id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button${expanded ? '' : ' collapsed'}`}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`rb_${section.id}`}
                    onClick={() => onOpen(section.id)}
                  >
                    <i className={`${section.icon} me-2`} />
                    {section.title}
                  </button>
                </h2>
                <div
                  id={`rb_${section.id}`}
                  className={`accordion-collapse collapse${expanded ? ' show' : ''}`}
                >
                  <div className="accordion-body">{body(section.id)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;
