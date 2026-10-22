import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PaymentModals from './modals/PaymentModals';
import type { PaymentModalId } from './modals/PaymentModals';
import type { SettingCard, SettingRow } from './data/payment.data';
import {
  cardBadgeOf,
  CHECKS,
  CONFIGURED_AREAS,
  DELTAS,
  DRAFT_CHANGES,
  ENVIRONMENT,
  FEATURES,
  LAST_UPDATED,
  LIFECYCLE,
  NAV_GROUPS,
  NOTES,
  providerBadge,
  PROVIDERS,
  READINESS,
  RELATED,
  ruleNumberOf,
  RULES,
  SETTING_CARDS,
  settingsLabelOf,
  shareLabelOf,
  TOTAL_AREAS,
  UPDATED_BY,
  VALIDATION_RUN,
  warningLabel,
} from './data/payment.data';

const routes = all_routes as Record<string, string>;

type TabId = 'general' | 'providers' | 'rules' | 'automation';

const TABS: { id: TabId; label: string; icon: string; count?: number }[] = [
  { id: 'general', label: 'General', icon: 'ti ti-adjustments' },
  { id: 'providers', label: 'Providers', icon: 'ti ti-building-bank', count: PROVIDERS.length },
  { id: 'rules', label: 'Business rules', icon: 'ti ti-scale', count: RULES.length },
  { id: 'automation', label: 'Automation', icon: 'ti ti-bolt', count: FEATURES.length },
];

/** One row of a settings card — the control depends on what the setting is. */
const Row = ({ row, id }: { row: SettingRow; id: string }) => (
  <div className="fin-row">
    <div className="fin-row-key">
      <strong>{row.key}</strong>
      <span>{row.note}</span>
    </div>
    <div className="fin-row-ctl">
      {row.kind === 'select' ? (
        <select className="fin-select w-auto" aria-label={row.key} defaultValue={row.options?.[0]}>
          {(row.options ?? []).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : null}
      {row.kind === 'text' ? (
        <input type="text" className="fin-input" defaultValue={row.value} aria-label={row.key} />
      ) : null}
      {row.kind === 'money' ? (
        <span className="fin-money-field">
          <span className="fin-money-sym">₹</span>
          <input type="text" defaultValue={row.value} aria-label={row.key} />
        </span>
      ) : null}
      {row.kind === 'switch' ? (
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={id}
            defaultChecked={row.on}
          />
          <label className="form-check-label visually-hidden" htmlFor={id}>
            Enable
          </label>
        </div>
      ) : null}
    </div>
  </div>
);

const Card = ({ card, onConfigure }: { card: SettingCard; onConfigure: () => void }) => {
  const badge = cardBadgeOf(card);
  return (
    <div className="fin-card">
      <div className="fin-card-head">
        <span className={`fin-card-ic${card.tone ? ` ${card.tone}` : ''}`}>
          <i className={card.icon} />
        </span>
        <div className="flex-fill overflow-hidden">
          <p className="fin-card-title">{card.title}</p>
          <p className="fs-12 text-muted mb-0">{card.note}</p>
        </div>
        <span className={`fin-badge ${badge.tone}`}>{badge.label}</span>
      </div>
      <div className="fin-card-body">
        {card.rows.map((row, index) => (
          <Row key={row.key} row={row} id={`fin-sw-${card.id}-${index}`} />
        ))}
      </div>
      <div className="fin-card-foot">
        <span className="fs-12 text-muted">{settingsLabelOf(card)}</span>
        <button
          type="button"
          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
          aria-label={`Open configuration workspace for ${card.title}`}
          onClick={onConfigure}
        >
          <i className="ti ti-settings me-1" />
          Configure
        </button>
      </div>
    </div>
  );
};

const PaymentSettings = () => {
  const { toasts, push, dismiss } = useToasts();

  const [tab, setTab] = useState<TabId>('general');
  const [modal, setModal] = useState<PaymentModalId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const openWorkspace = () => setPanelOpen(true);

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* ------------------------------ Hero ------------------------------ */}
          <div className="fin-hero">
            <div>
              <div className="fin-hero-top">
                <span className="fin-hero-crest">
                  <i className="ti ti-credit-card" />
                </span>
                <div>
                  <h1 className="fin-hero-title">Payment Settings</h1>
                  <p className="fin-hero-sub">
                    How the school accepts money — providers, methods, limits and the rules that
                    decide when a payment is accepted, retried or refused.
                  </p>
                </div>
                <span className="fin-hero-env">
                  <i className="ti ti-shield-check" />
                  {ENVIRONMENT}
                </span>
              </div>
              <div className="fin-hero-facts">
                <div className="fin-hero-fact">
                  <span>Configuration status</span>
                  <strong className="d-inline-flex align-items-center gap-2">
                    Published <span className="fin-badge is-live">Live</span>
                  </strong>
                </div>
                <div className="fin-hero-fact">
                  <span>Last updated</span>
                  <strong>{LAST_UPDATED}</strong>
                </div>
                <div className="fin-hero-fact">
                  <span>Updated by</span>
                  <strong>{UPDATED_BY}</strong>
                </div>
              </div>
            </div>
            <div className="fin-hero-actions">
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setModal('export')}
              >
                <i className="ti ti-download me-1" />
                Export
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setModal('restore')}
              >
                <i className="ti ti-rotate-2 me-1" />
                Restore defaults
              </button>
              <button
                type="button"
                className="btn btn-light d-inline-flex align-items-center"
                onClick={() => setModal('edit')}
              >
                <i className="ti ti-device-floppy me-1" />
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => setModal('publish')}
              >
                <i className="ti ti-rocket me-1" />
                Publish
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* ------------------------- Settings rail ------------------------ */}
            <div className="col-xxl-3 col-lg-12">
              <nav className="fin-nav nav flex-column" aria-label="Financial settings">
                {NAV_GROUPS.map((group) => (
                  <Fragment key={group.title}>
                    <span className="fin-nav-hdr">{group.title}</span>
                    {group.links.map((link) =>
                      link.route && routes[link.route] ? (
                        <Link
                          key={link.label}
                          to={routes[link.route]}
                          className={`fin-nav-link${link.active ? ' active' : ''}`}
                        >
                          <i className={link.icon} />
                          <span>{link.label}</span>
                          {link.tag ? (
                            <span className={`fin-nav-tag ${link.draft ? 'is-warn' : 'is-set'}`}>
                              {link.tag}
                            </span>
                          ) : null}
                        </Link>
                      ) : (
                        <ActionLink
                          key={link.label}
                          className="fin-nav-link"
                          onClick={() => push(`${link.label} is not configured on this page`, 'info')}
                        >
                          <i className={link.icon} />
                          <span>{link.label}</span>
                          {link.tag ? (
                            <span className={`fin-nav-tag ${link.draft ? 'is-warn' : 'is-set'}`}>
                              {link.tag}
                            </span>
                          ) : null}
                        </ActionLink>
                      ),
                    )}
                  </Fragment>
                ))}
                <div className="fin-nav-foot">
                  <span className="fin-lbl">Centre readiness</span>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className={`fin-meter is-money fin-p-${READINESS} flex-fill`}>
                      <span />
                    </div>
                    <strong className="fs-12 fin-amt">{READINESS}%</strong>
                  </div>
                  <p className="fs-12 text-muted mb-2">
                    {CONFIGURED_AREAS} of {TOTAL_AREAS} areas configured. Late fee rules are still a
                    draft.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                    onClick={() => setModal('import')}
                  >
                    <i className="ti ti-upload me-1" />
                    Import settings
                  </button>
                </div>
              </nav>
            </div>

            {/* ----------------------- Configuration workspace --------------- */}
            <div className="col-xxl-9 col-lg-12">
              <div className="fin-ws mb-4">
                <div className="fin-ws-head">
                  <div className="flex-fill">
                    <h2 className="fin-ws-title">Configuration workspace</h2>
                    <p>
                      {PROVIDERS.length} providers, {RULES.length} business rules and{' '}
                      {FEATURES.length} automations. Changes are held as a draft until you publish.
                    </p>
                  </div>
                  <span className="fin-badge is-review">{DRAFT_CHANGES} unpublished</span>
                </div>
                <div className="fin-ws-body">
                  <div className="fin-tabs nav mb-4" role="tablist" aria-label="Configuration sections">
                    {TABS.map((entry) => (
                      <button
                        key={entry.id}
                        className={`fin-tab${tab === entry.id ? ' active' : ''}`}
                        type="button"
                        role="tab"
                        aria-selected={tab === entry.id}
                        onClick={() => setTab(entry.id)}
                      >
                        <i className={entry.icon} />
                        {entry.label}
                        {entry.count === undefined ? null : (
                          <span className="fin-tab-n">{entry.count}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="tab-content">
                    {tab === 'general' ? (
                      <div className="tab-pane fade show active" role="tabpanel" tabIndex={0}>
                        <div className="row g-4">
                          {SETTING_CARDS.map((card) => (
                            <div className="col-12" key={card.id}>
                              <Card card={card} onConfigure={openWorkspace} />
                            </div>
                          ))}
                          <div className="col-12">
                            <div className="fin-card">
                              <div className="fin-card-head">
                                <span className="fin-card-ic is-warn">
                                  <i className="ti ti-alert-triangle" />
                                </span>
                                <div className="flex-fill overflow-hidden">
                                  <p className="fin-card-title">Validation Rules</p>
                                  <p className="fs-12 text-muted mb-0">
                                    Checked before a payment is accepted
                                  </p>
                                </div>
                                <span className="fin-badge is-test">{warningLabel()}</span>
                              </div>
                              <div className="fin-card-body">
                                {CHECKS.map((check) => (
                                  <div
                                    className={`fin-check${check.passed ? '' : ' is-warn'}`}
                                    key={check.label}
                                  >
                                    <i
                                      className={
                                        check.passed ? 'ti ti-circle-check' : 'ti ti-alert-circle'
                                      }
                                    />
                                    <div>
                                      {check.label}
                                      <span>{check.note}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="fin-card-foot">
                                <span className="fs-12 text-muted">{VALIDATION_RUN}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                                  aria-label="Open configuration workspace for Validation Rules"
                                  onClick={openWorkspace}
                                >
                                  <i className="ti ti-settings me-1" />
                                  Configure
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {tab === 'providers' ? (
                      <div className="tab-pane fade show active" role="tabpanel" tabIndex={0}>
                        <div className="row g-4">
                          {PROVIDERS.map((provider) => (
                            <div className="col-xxl-4 col-md-6" key={provider.id}>
                              <div
                                className={`fin-prov${provider.primary ? ' is-primary' : ''}${
                                  provider.state === 'Disabled' ? ' is-disabled' : ''
                                }`}
                              >
                                <div className="fin-prov-head">
                                  <span className="fin-prov-mark">
                                    <i className={provider.icon} />
                                  </span>
                                  <div className="flex-fill overflow-hidden">
                                    <p className="fin-prov-name">{provider.name}</p>
                                    <p>{provider.note}</p>
                                  </div>
                                  <span className={`fin-badge ${providerBadge(provider.state)}`}>
                                    {provider.state}
                                  </span>
                                </div>
                                <div className="fin-prov-key">
                                  <i className="ti ti-key" />
                                  Key <code>{provider.key}</code>
                                </div>
                                <div className="fin-prov-facts">
                                  <div className="fin-prov-fact">
                                    <span>Mode</span>
                                    <strong>{provider.mode}</strong>
                                  </div>
                                  <div className="fin-prov-fact">
                                    <span>Fee</span>
                                    <strong>{provider.fee}</strong>
                                  </div>
                                  <div className="fin-prov-fact">
                                    <span>Settlement</span>
                                    <strong>{provider.settlement}</strong>
                                  </div>
                                  <div className="fin-prov-fact">
                                    <span>Share of collection</span>
                                    <strong>{shareLabelOf(provider)}</strong>
                                  </div>
                                </div>
                                <div className="fin-prov-foot">
                                  <div className="form-check form-switch mb-0">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`fin-prov-${provider.id}`}
                                      defaultChecked={provider.on}
                                    />
                                    <label
                                      className="form-check-label visually-hidden"
                                      htmlFor={`fin-prov-${provider.id}`}
                                    >
                                      Enable
                                    </label>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                                    aria-label={`Open configuration workspace for ${provider.name}`}
                                    onClick={openWorkspace}
                                  >
                                    <i className="ti ti-settings me-1" />
                                    Configure
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="col-12">
                            <div className="fin-empty">
                              <i className="ti ti-plug-connected" />
                              <h3 className="fs-15 fw-medium">No custom provider connected</h3>
                              <p>
                                If your school settles through a bank or aggregator that is not
                                listed, connect it here with its own credentials and settlement
                                terms.
                              </p>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm d-inline-flex align-items-center"
                                onClick={() => setModal('enable')}
                              >
                                <i className="ti ti-plus me-1" />
                                Connect a provider
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {tab === 'rules' ? (
                      <div className="tab-pane fade show active" role="tabpanel" tabIndex={0}>
                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                          <div>
                            <span className="fin-lbl">Evaluated in order</span>
                            <p className="fs-13 text-muted mb-0">
                              The first rule that matches decides the outcome. Later rules still run
                              unless one stops the payment.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                            onClick={() => setModal('preview')}
                          >
                            <i className="ti ti-player-play me-1" />
                            Preview a payment
                          </button>
                        </div>
                        {RULES.map((rule, index) => (
                          <div className={`fin-rule${rule.on ? '' : ' is-off'}`} key={rule.condition}>
                            <span className="fin-rule-n">{ruleNumberOf(index)}</span>
                            <div className="fin-rule-body">
                              <div className="fin-rule-line">
                                <span className="fin-rule-cond">{rule.condition}</span>
                                <i className="ti ti-arrow-narrow-right" />
                                <span className="fin-rule-then">{rule.action}</span>
                              </div>
                              <span className="fin-rule-note">{rule.note}</span>
                            </div>
                            <div className="fin-rule-ctl">
                              <div className="form-check form-switch mb-0">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id={`fin-rule-${index}`}
                                  defaultChecked={rule.on}
                                />
                                <label
                                  className="form-check-label visually-hidden"
                                  htmlFor={`fin-rule-${index}`}
                                >
                                  Enable
                                </label>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                                aria-label={`Open configuration workspace for rule ${ruleNumberOf(index)}`}
                                onClick={openWorkspace}
                              >
                                <i className="ti ti-eye me-1" />
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {tab === 'automation' ? (
                      <div className="tab-pane fade show active" role="tabpanel" tabIndex={0}>
                        <div className="row g-4">
                          {FEATURES.map((feature) => (
                            <div className="col-xxl-4 col-md-6" key={feature.id}>
                              <div className={`fin-feature${feature.on ? ' is-on' : ''}`}>
                                <div className="fin-feature-top">
                                  <span className="fin-feature-ic">
                                    <i className={feature.icon} />
                                  </span>
                                  <div className="flex-fill overflow-hidden">
                                    <p className="fin-feature-title">{feature.title}</p>
                                    <span
                                      className={`fin-badge ${feature.on ? 'is-live' : 'is-off'}`}
                                    >
                                      {feature.on ? 'Enabled' : 'Disabled'}
                                    </span>
                                  </div>
                                </div>
                                <p className="fin-feature-txt">{feature.text}</p>
                                <div>
                                  <span className="fin-lbl">Depends on</span>
                                  <div className="fin-deps">
                                    {feature.deps.map((dep) => (
                                      <span className="fin-dep" key={dep.label}>
                                        <i className={dep.icon} />
                                        {dep.label}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="fin-feature-foot">
                                  <div className="form-check form-switch mb-0">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id={`fin-feat-${feature.id}`}
                                      defaultChecked={feature.on}
                                    />
                                    <label
                                      className="form-check-label visually-hidden"
                                      htmlFor={`fin-feat-${feature.id}`}
                                    >
                                      Enable
                                    </label>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                                    aria-label={`Open configuration workspace for ${feature.title}`}
                                    onClick={openWorkspace}
                                  >
                                    <i className="ti ti-settings me-1" />
                                    Configure
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* ----------------------- Information centre -------------------- */}
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mt-5 mb-3">
                <div>
                  <h2 className="fin-ws-title">Information centre</h2>
                  <p className="fs-13 text-muted mb-0">
                    Why this configuration looks the way it does, and what still needs attention.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                {NOTES.map((note) => (
                  <div className="col-xl-4 col-md-6" key={note.id}>
                    <div className={`fin-note${note.tone ? ` ${note.tone}` : ''}`}>
                      <div className="fin-note-head">
                        <i className={note.icon} />
                        <h3 className="fs-15 fw-medium">{note.title}</h3>
                      </div>
                      <ul className="fin-note-list">
                        {note.items.map((item) => (
                          <li key={item.text}>
                            {item.lead ? <strong>{item.lead}</strong> : null}
                            {item.lead ? ' ' : null}
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <div className="col-xl-4 col-md-6">
                  <div className="fin-note">
                    <div className="fin-note-head">
                      <i className="ti ti-history" />
                      <h3 className="fs-15 fw-medium">Recent changes</h3>
                    </div>
                    <ul className="fin-note-list">
                      {DELTAS.map((delta) => (
                        <li key={delta.setting}>
                          <strong>{delta.setting}</strong>
                          <span className="fin-delta">
                            <del>{delta.from}</del>
                            <i className="ti ti-arrow-narrow-right" />
                            <ins>{delta.to}</ins>
                          </span>
                          <span className="fs-12 text-muted">
                            {delta.by} · {delta.on}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-xl-4 col-md-6">
                  <div className="fin-note">
                    <div className="fin-note-head">
                      <i className="ti ti-link" />
                      <h3 className="fs-15 fw-medium">Related settings</h3>
                    </div>
                    <ul className="fin-note-list">
                      {RELATED.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.route && routes[link.route] ? routes[link.route] : '#'}
                            className="d-flex align-items-center gap-2 text-decoration-none"
                          >
                            <i className={`${link.icon} fs-16`} />
                            <span>
                              <strong>{link.label}</strong>
                              <br />
                              <span className="fs-12 text-muted">{link.note}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ------------------------ Configuration lifecycle -------------- */}
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mt-5 mb-3">
                <div>
                  <h2 className="fin-ws-title">Configuration lifecycle</h2>
                  <p className="fs-13 text-muted mb-0">
                    Nothing reaches a payer until it is published.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  onClick={() => setModal('preview')}
                >
                  <i className="ti ti-eye me-1" />
                  Preview changes
                </button>
              </div>
              <div className="fin-tl mb-2">
                {LIFECYCLE.map((stage) => (
                  <div
                    className={`fin-tl-step${
                      stage.state === 'done'
                        ? ' is-done'
                        : stage.state === 'current'
                          ? ' is-current'
                          : ''
                    }`}
                    key={stage.title}
                  >
                    <span className="fin-tl-dot">
                      <i className={stage.icon} />
                    </span>
                    <h3 className="fin-tl-title fs-15 fw-medium">{stage.title}</h3>
                    <span className="fin-tl-meta">{stage.meta}</span>
                    <p className="fin-tl-txt">{stage.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModals
        active={modal}
        onClose={() => setModal(null)}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="paymentSettingsToasts" />
    </>
  );
};

export default PaymentSettings;
