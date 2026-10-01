import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import RuleBuilder from './components/RuleBuilder';
import type { AccordionId, RuleSettings } from './data/attendanceRules.data';
import {
  buildPreview,
  buildRelatedRules,
  defaultSettings,
  ruleTemplates,
} from './data/attendanceRules.data';

const routes = all_routes;

/** Every template starts from the same defaults and then holds its own edits. */
const seedSettings = (): Record<string, RuleSettings> =>
  Object.fromEntries(ruleTemplates.map((rule) => [rule.id, { ...defaultSettings }]));

const AttendanceRules = () => {
  const [selectedId, setSelectedId] = useState(ruleTemplates[0].id);
  const [settingsById, setSettingsById] = useState<Record<string, RuleSettings>>(seedSettings);
  const [open, setOpen] = useState<AccordionId>('timing');

  const { toasts, push, dismiss } = useToasts();

  const rule = ruleTemplates.find((item) => item.id === selectedId) ?? ruleTemplates[0];
  const settings = settingsById[selectedId] ?? defaultSettings;

  const preview = useMemo(() => buildPreview(settings), [settings]);
  const relatedRules = useMemo(() => buildRelatedRules(settings), [settings]);

  const patchSettings = (patch: Partial<RuleSettings>) =>
    setSettingsById((current) => ({ ...current, [selectedId]: { ...current[selectedId], ...patch } }));

  const discard = () => {
    setSettingsById((current) => ({ ...current, [selectedId]: { ...defaultSettings } }));
    push(`${rule.label} reset to defaults`);
  };

  const save = () => push(`${rule.label} (${rule.code}) rule set saved`);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Attendance Rules</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Attendance Rules
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={discard}
              >
                <i className="ti ti-rotate me-1" />
                Discard
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={save}
              >
                <i className="ti ti-device-floppy me-1" />
                Save Rule Set
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Rule Templates */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded me-2">
                  <i className="ti ti-adjustments-alt" />
                </span>
                <h4 className="mb-0 fs-15 fw-medium">Rule Templates</h4>
              </div>
              <span className="fs-12 text-muted">Pick a rule to configure it in the builder below</span>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {ruleTemplates.map((template) => (
                  <button
                    type="button"
                    className={`btn btn-outline-primary d-inline-flex align-items-center${
                      selectedId === template.id ? ' active' : ''
                    }`}
                    key={template.id}
                    aria-pressed={selectedId === template.id}
                    onClick={() => setSelectedId(template.id)}
                  >
                    <i className={`${template.icon} me-1`} />
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* /Rule Templates */}

          <div className="row">
            {/* Rule Builder */}
            <div className="col-12 col-xl-8">
              <RuleBuilder
                rule={rule}
                settings={settings}
                onChange={patchSettings}
                open={open}
                onOpen={setOpen}
              />
            </div>

            {/* Policy Preview */}
            <div className="col-12 col-xl-4">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm bg-info-transparent text-info rounded me-2">
                      <i className="ti ti-player-play" />
                    </span>
                    <h3 className="mb-0 fs-15 fw-medium">Policy Preview</h3>
                  </div>
                  <span className="badge badge-soft-bordered fs-10">Simulated</span>
                </div>
                <div className="card-body">
                  <p className="fs-12 text-muted mb-3">How the current settings resolve a day of punches.</p>
                  {preview.map((card, index) => (
                    <div
                      className={`border rounded p-3${index === preview.length - 1 ? '' : ' mb-3'}`}
                      key={card.id}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i className={`${card.icon} text-muted me-2`} />
                        <span className="fs-13 fw-medium">{card.headline}</span>
                      </div>
                      <p className="fs-12 text-muted mb-2">{card.detail}</p>
                      <div className="d-flex align-items-center">
                        <i className="ti ti-arrow-narrow-right text-muted me-2" />
                        <span className={`badge badge-soft-${card.badge.tone} d-inline-flex align-items-center`}>
                          <i className={`${card.badge.icon} me-1`} />
                          {card.badge.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* /Policy Preview */}
          </div>

          {/* Related Rules */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-sm bg-purple-transparent text-purple rounded me-2">
                  <i className="ti ti-git-branch" />
                </span>
                <h4 className="mb-0 fs-15 fw-medium">Related Rules</h4>
              </div>
              <span className="fs-12 text-muted">What a breach of this rule triggers downstream</span>
            </div>
            <div className="card-body">
              <div className="d-lg-flex align-items-stretch gap-2">
                {relatedRules.map((related, index) => (
                  <Fragment key={related.title}>
                    <div
                      className={`border rounded p-3 flex-fill${
                        index === relatedRules.length - 1 ? '' : ' mb-3 mb-lg-0'
                      }`}
                    >
                      <span className={`avatar avatar-sm bg-${related.tint}-transparent text-${related.tint} rounded mb-2`}>
                        <i className={related.icon} />
                      </span>
                      <h6 className="fs-14 mb-1">{related.title}</h6>
                      <p className="fs-12 text-muted mb-0">{related.note}</p>
                    </div>
                    {index === relatedRules.length - 1 ? null : (
                      <div className="d-flex align-items-center justify-content-center mb-3 mb-lg-0">
                        <i className="ti ti-chevron-right fs-20 text-muted d-none d-lg-inline" />
                        <i className="ti ti-chevron-down fs-20 text-muted d-lg-none" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          {/* /Related Rules */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="arToasts" />
    </>
  );
};

export default AttendanceRules;
