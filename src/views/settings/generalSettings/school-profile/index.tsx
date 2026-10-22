import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import SettingPanel from './components/SettingPanel';
import type { ProfileRow, SectionId } from './data/profile.data';
import {
  ACADEMIC_ROWS,
  ADDRESS_BLOCKS,
  ASSETS,
  AUDIT,
  CAMPUS_ROWS,
  COLOURS,
  COMMUNICATION_ROWS,
  COMPLETENESS,
  CONTACT_BLOCKS,
  DOCUMENT_ICON,
  DOCUMENTS,
  EMPTY_FIELDS,
  EXPIRING_SOON,
  EXPIRY_WINDOW_DAYS,
  FACTS,
  fieldsLabelOf,
  GENERAL_ROWS,
  IDENTITY_ROWS,
  initialsOf,
  licenceBadgeOf,
  licenceFootOf,
  LICENCES,
  NAV_GROUPS,
  OPEN_REQUESTS,
  PEOPLE,
  SCHOOL_NAME,
  SECTIONS,
  SECURITY_ROWS,
  SOCIAL_LINKS,
  SURFACES,
  TRUST_ROWS,
  UNAPPLIED_SURFACES,
  UNPUBLISHED_CHANGES,
  UNSET,
} from './data/profile.data';

const routes = all_routes;

/* ------------------------------ Small parts ------------------------------ */

const SectionHead = ({ eyebrow, icon, title, sub }: { eyebrow: string; icon: string; title: string; sub: string }) => (
  <div className="section-head">
    <div>
      <span className="eyebrow-text mb-1">
        <i className={icon} />
        {eyebrow}
      </span>
      <h2 className="section-head-title">{title}</h2>
      <p className="section-head-sub">{sub}</p>
    </div>
  </div>
);

const OptionCard = ({
  title,
  note,
  icon,
  badge,
  rows,
  onEdit,
}: {
  title: string;
  note: string;
  icon: string;
  badge: { tone: string; label: string; icon?: string };
  rows: ProfileRow[];
  onEdit: (key: string) => void;
}) => (
  <div className="option-card">
    <div className="option-card-head">
      <span className="option-card-icon">
        <i className={icon} />
      </span>
      <div className="flex-fill overflow-hidden">
        <p className="option-card-title">{title}</p>
        <p className="fs-12 text-muted mb-0">{note}</p>
      </div>
      <span className={`meta-badge ${badge.tone}`}>
        {badge.icon ? <i className={`${badge.icon} me-1`} /> : null}
        {badge.label}
      </span>
    </div>
    <div className="option-card-body">
      {rows.map((row) => (
        <div className="option-row" key={row.key}>
          <span className="option-row-key">
            <span className="state-dot" />
            {row.key}
          </span>
          <span className="option-row-value">
            {row.code ? <code>{row.value}</code> : row.value}
          </span>
          <span>
            <ActionLink
              className="inline-edit"
              ariaLabel={`Edit ${row.key}`}
              onClick={() => onEdit(row.key)}
            >
              <i className="ti ti-pencil" />
            </ActionLink>
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Blocks = ({
  blocks,
  onEdit,
}: {
  blocks: { title: string; icon: string; lines: string[] }[];
  onEdit: (key: string) => void;
}) => (
  <div className="row g-4">
    {blocks.map((block) => (
      <div className="col-xl-4 col-md-6" key={block.title}>
        <div className="contact-block">
          <span className="contact-block-icon">
            <i className={block.icon} />
          </span>
          <p className="contact-block-title">{block.title}</p>
          <p className="contact-block-text">
            {block.lines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>
          <ActionLink
            className="fs-12 fw-semibold text-primary d-inline-flex align-items-center mt-3"
            onClick={() => onEdit(block.title)}
          >
            <i className="ti ti-pencil me-1" />
            Edit
          </ActionLink>
        </div>
      </div>
    ))}
  </div>
);

/* -------------------------------- The page ------------------------------- */

const SchoolProfile = () => {
  const { toasts, push, dismiss } = useToasts();

  const [section, setSection] = useState<SectionId>('general');
  const [panelField, setPanelField] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const openPanel = (field: string) => {
    setPanelField(field);
    setPanelOpen(true);
  };

  const current = SECTIONS.find((entry) => entry.id === section) ?? SECTIONS[0];

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* ---------------------------- Page header ---------------------- */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-building-community text-primary me-2" />
                School Profile &amp; Configuration
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.schoolSettings}>Settings</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    School Profile
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className="meta-badge is-draft me-2 mb-2">
                <i className="ti ti-pencil me-1" />
                {UNPUBLISHED_CHANGES} unpublished changes
              </span>
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openPanel('School Profile')}
              >
                <i className="ti ti-pencil me-1" />
                Edit Information
              </ActionLink>
              <ActionLink
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => push('Profile published to the public site and the parent portal')}
              >
                <i className="ti ti-cloud-upload me-1" />
                Publish
              </ActionLink>
            </div>
          </div>

          {/* --------------------------- Identity panel -------------------- */}
          <div className="identity-panel mb-4">
            <div className="identity-panel-inner">
              <div className="identity-panel-main">
                <span className="identity-crest identity-crest-lg">
                  <ImageWithBasePath src="assets/img/favicon.png" alt={SCHOOL_NAME} />
                  <span className="identity-crest-pip">
                    <i className="ti ti-check" />
                  </span>
                </span>

                <div className="flex-fill">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                    <span className="meta-badge is-active">
                      <i className="ti ti-circle-check-filled me-1" />
                      Published
                    </span>
                    <span className="meta-badge is-plain">
                      <i className="ti ti-shield-check me-1" />
                      Verified institution
                    </span>
                  </div>
                  <h1 className="identity-panel-name">{SCHOOL_NAME}</h1>
                  <p className="fs-14 text-muted lh-base mb-0">
                    Everything the system prints, sends or publishes on the school’s behalf is drawn
                    from this profile — certificates, ID cards, invoices, reports and parent letters.
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 flex-shrink-0 identity-panel-actions">
                <ActionLink
                  className="btn btn-primary d-inline-flex align-items-center justify-content-center"
                  onClick={() => push('Profile saved')}
                >
                  <i className="ti ti-device-floppy me-1" />
                  Save Changes
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white btn-icon"
                  ariaLabel="Preview profile"
                  onClick={() => openPanel('School Profile')}
                >
                  <i className="ti ti-eye" />
                </ActionLink>
              </div>

              <div className="identity-facts">
                {FACTS.map((fact) => (
                  <span
                    className={`identity-fact${fact.tone ? ` is-hero ${fact.tone}` : ''}`}
                    key={fact.label}
                  >
                    <span className="identity-fact-ic">
                      <i className={fact.icon} />
                    </span>
                    <span>
                      <span className="eyebrow-label">{fact.label}</span>
                      <b className={fact.valueClass}>{fact.value}</b>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------- Settings workspace ----------------- */}
          <div className="row g-4">
            <div className="col-xl-3 col-lg-4">
              <div className="section-nav nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                {NAV_GROUPS.map((group) => (
                  <Fragment key={group.group}>
                    <span className="section-nav-heading">
                      {group.group}
                      <span className="section-nav-count">{group.sections.length}</span>
                    </span>
                    {group.sections.map((entry) => (
                      <button
                        key={entry.id}
                        className={`section-nav-link${section === entry.id ? ' active' : ''}`}
                        type="button"
                        role="tab"
                        aria-selected={section === entry.id}
                        onClick={() => setSection(entry.id)}
                      >
                        <span className="section-nav-ic">
                          <i className={entry.icon} />
                        </span>
                        {entry.label}
                      </button>
                    ))}
                  </Fragment>
                ))}

                <div className="section-nav-foot">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="eyebrow-label">Profile completeness</span>
                    <span className="fs-12 fw-semibold text-dark">{COMPLETENESS}%</span>
                  </div>
                  <span className={`inline-meter inline-meter-p-${COMPLETENESS}`} />
                  <p className="fs-12 text-muted mb-0 mt-2">
                    {EMPTY_FIELDS} fields are still empty. {EXPIRING_SOON} certificates expire
                    within {EXPIRY_WINDOW_DAYS} days.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-xl-9 col-lg-8">
              <div className="tab-content settings-tab-content">
                <div className="tab-pane fade show active" role="tabpanel" tabIndex={0}>
                  <SectionHead
                    eyebrow={current.group}
                    icon={current.icon}
                    title={current.title}
                    sub={current.sub}
                  />

                  {section === 'general' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <OptionCard
                          title="General Information"
                          note="The core record every other module reads from"
                          icon="ti ti-info-circle"
                          badge={{
                            tone: 'is-active',
                            label: 'Published',
                            icon: 'ti ti-circle-check-filled',
                          }}
                          rows={GENERAL_ROWS}
                          onEdit={openPanel}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'identity' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <OptionCard
                          title="School Identity"
                          note="How the school names itself on printed and issued material"
                          icon="ti ti-id-badge-2"
                          badge={{ tone: 'is-plain', label: fieldsLabelOf(IDENTITY_ROWS) }}
                          rows={IDENTITY_ROWS}
                          onEdit={openPanel}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'branding' ? (
                    <>
                      <div className="row g-4">
                        {ASSETS.map((asset) => (
                          <div className="col-xl-3 col-md-6" key={asset.name}>
                            <div className="asset-card">
                              <div className={`inset-well${asset.dark ? ' is-dark' : ''}`}>
                                <ImageWithBasePath src={asset.image} alt={asset.name} />
                              </div>
                              <div className="asset-card-body">
                                <div className="flex-fill overflow-hidden">
                                  <p className="asset-card-title">{asset.name}</p>
                                  <p className="fs-12 text-muted mb-0">{asset.spec}</p>
                                </div>
                                <span>
                                  <ActionLink
                                    className="inline-edit opacity-100"
                                    ariaLabel={`Replace ${asset.name}`}
                                    onClick={() => openPanel(asset.name)}
                                  >
                                    <i className="ti ti-upload" />
                                  </ActionLink>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {COLOURS.map((colour) => (
                          <div className="col-xl-3 col-md-6" key={colour.name}>
                            <div className="color-swatch">
                              <span className="usage-row-icon">
                                <i className="ti ti-palette" />
                              </span>
                              <div className="flex-fill overflow-hidden">
                                <p className="asset-card-title">{colour.name}</p>
                                <p className="fs-12 text-muted mb-0 text-truncate">
                                  <code>{colour.hex}</code> · {colour.use}
                                </p>
                              </div>
                              <span>
                                <ActionLink
                                  className="inline-edit opacity-100"
                                  ariaLabel={`Edit ${colour.name}`}
                                  onClick={() => openPanel(colour.name)}
                                >
                                  <i className="ti ti-pencil" />
                                </ActionLink>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="row g-4 mt-0">
                        <div className="col-12">
                          <div className="option-card">
                            <div className="option-card-head">
                              <span className="option-card-icon">
                                <i className="ti ti-stack-2" />
                              </span>
                              <div className="flex-fill overflow-hidden">
                                <p className="option-card-title">Where branding is applied</p>
                                <p className="fs-12 text-muted mb-0">
                                  {SURFACES.length} surfaces draw from the assets above
                                </p>
                              </div>
                              <span className="meta-badge is-pending">
                                {UNAPPLIED_SURFACES} not set
                              </span>
                            </div>
                            <div className="option-card-body">
                              {SURFACES.map((surface) => (
                                <div className="usage-row" key={surface.name}>
                                  <span className="usage-row-icon">
                                    <i className={surface.icon} />
                                  </span>
                                  <span className="flex-fill overflow-hidden">
                                    <span className="d-block fs-13 fw-medium text-dark">
                                      {surface.name}
                                    </span>
                                    <span className="d-block fs-12 text-muted">{surface.note}</span>
                                  </span>
                                  <span
                                    className={`meta-badge ${surface.applied ? 'is-active' : 'is-pending'}`}
                                  >
                                    {surface.applied ? 'Applied' : UNSET}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {section === 'contact' ? (
                    <Blocks blocks={CONTACT_BLOCKS} onEdit={openPanel} />
                  ) : null}
                  {section === 'address' ? (
                    <Blocks blocks={ADDRESS_BLOCKS} onEdit={openPanel} />
                  ) : null}

                  {section === 'social' ? (
                    <div className="row g-4">
                      {SOCIAL_LINKS.map((link) => (
                        <div className="col-xl-6 col-md-6" key={link.name}>
                          <div className="color-swatch">
                            <span className="usage-row-icon">
                              <i className={link.icon} />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <p className="asset-card-title">{link.name}</p>
                              <p className="fs-12 text-muted mb-0 text-truncate">{link.handle}</p>
                            </div>
                            <span
                              className={`meta-badge flex-shrink-0 ${
                                link.handle === UNSET ? 'is-pending' : 'is-active'
                              }`}
                            >
                              {link.state}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section === 'communication' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <OptionCard
                          title="Sender & Templates"
                          note="Applied to email, SMS and printed letters"
                          icon="ti ti-message-2"
                          badge={{ tone: 'is-pending', label: '1 not set' }}
                          rows={COMMUNICATION_ROWS}
                          onEdit={openPanel}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'academic' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <OptionCard
                          title="Academic Configuration"
                          note="How the academic year, grades and timings are structured"
                          icon="ti ti-school"
                          badge={{ tone: 'is-active', label: 'Configured' }}
                          rows={ACADEMIC_ROWS}
                          onEdit={openPanel}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'campus' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <OptionCard
                          title="Campus, Languages & Time"
                          note="Physical and regional settings used across the platform"
                          icon="ti ti-building"
                          badge={{ tone: 'is-plain', label: fieldsLabelOf(CAMPUS_ROWS) }}
                          rows={CAMPUS_ROWS}
                          onEdit={openPanel}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'management' ? (
                    <>
                      <div className="row g-4">
                        {PEOPLE.map((person) => (
                          <div className="col-xl-6 col-md-6" key={person.role}>
                            <div className="person-block">
                              <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
                                <ImageWithBasePath src={person.image} alt={person.name} />
                              </span>
                              <div className="flex-fill overflow-hidden">
                                <span className="person-block-role">{person.role}</span>
                                <p className="person-block-name text-truncate">{person.name}</p>
                                <p className="fs-12 text-muted mb-0">{person.contact}</p>
                              </div>
                              <span className="meta-badge is-active flex-shrink-0">
                                {person.state}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="row g-4 mt-0">
                        <div className="col-12">
                          <OptionCard
                            title="Trust & Committee"
                            note="The registered body the school operates under"
                            icon="ti ti-building-bank"
                            badge={{ tone: 'is-plain', label: fieldsLabelOf(TRUST_ROWS) }}
                            rows={TRUST_ROWS}
                            onEdit={openPanel}
                          />
                        </div>
                      </div>
                    </>
                  ) : null}

                  {section === 'compliance' ? (
                    <>
                      <div className="d-flex justify-content-end mb-3">
                        <span className="meta-badge is-pending">
                          <i className="ti ti-alert-triangle me-1" />
                          {EXPIRING_SOON} expiring within {EXPIRY_WINDOW_DAYS} days
                        </span>
                      </div>
                      <div className="row g-4">
                        {LICENCES.map((licence) => {
                          const badge = licenceBadgeOf(licence);
                          return (
                            <div className="col-xl-6 col-md-6" key={licence.title}>
                              <div className="compliance-card">
                                <p className="compliance-card-title">{licence.title}</p>
                                <p className="fs-12 text-muted mb-0">{licence.note}</p>
                                <span className="reference-code">{licence.reference}</span>
                                <div className="compliance-card-foot">
                                  <span className="fs-12 text-muted">{licenceFootOf(licence)}</span>
                                  <span className={`meta-badge ${badge.tone}`}>{badge.label}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null}

                  {section === 'documents' ? (
                    <>
                      <div className="d-flex justify-content-end mb-3">
                        <ActionLink
                          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                          onClick={() => push('Upload a document to the institution file')}
                        >
                          <i className="ti ti-upload me-1" />
                          Upload document
                        </ActionLink>
                      </div>
                      <div className="row g-4">
                        {DOCUMENTS.map((document) => (
                          <div className="col-xl-6 col-md-6" key={document.title}>
                            <div className="document-row">
                              <span className={`document-row-icon is-${document.kind}`}>
                                <i className={DOCUMENT_ICON[document.kind]} />
                              </span>
                              <div className="flex-fill overflow-hidden">
                                <p className="document-row-title text-truncate">{document.title}</p>
                                <p className="fs-12 text-muted mb-0">{document.spec}</p>
                              </div>
                              <span>
                                <ActionLink
                                  className="inline-edit opacity-100"
                                  ariaLabel={`Download ${document.title}`}
                                  onClick={() => push(`${document.title} downloaded`)}
                                >
                                  <i className="ti ti-download" />
                                </ActionLink>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {section === 'security' ? (
                    <div className="row g-4">
                      <div className="col-12">
                        <OptionCard
                          title="Access & Retention"
                          note="Who may change this profile, and how long records are kept"
                          icon="ti ti-lock"
                          badge={{ tone: 'is-pending', label: `${OPEN_REQUESTS} requests` }}
                          rows={SECURITY_ROWS}
                          onEdit={openPanel}
                        />
                      </div>
                    </div>
                  ) : null}

                  {section === 'audit' ? (
                    <>
                      <div className="d-flex justify-content-end mb-3">
                        <ActionLink
                          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                          onClick={() => push('Audit log exported')}
                        >
                          <i className="ti ti-file-export me-1" />
                          Export log
                        </ActionLink>
                      </div>
                      <div>
                        {AUDIT.map((event) => (
                          <div className="audit-event is-done" key={event.title}>
                            <div className="flex-fill overflow-hidden">
                              <p className="audit-event-title">{event.title}</p>
                              <p className="fs-13 text-muted mb-0">{event.note}</p>
                              {event.from ? (
                                <p className="fs-12 mb-0 mt-1">
                                  <span className="delta-value">{event.from}</span>
                                  <i className="ti ti-arrow-narrow-right mx-1" />
                                  <span className="delta-value">{event.to}</span>
                                </p>
                              ) : null}
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                              <span className="audit-actor-avatar">{initialsOf(event.actor)}</span>
                              <div className="text-end">
                                <span className="d-block fs-12 fw-medium text-dark">
                                  {event.actor}
                                </span>
                                <span className="d-block fs-12 text-muted">{event.at}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SettingPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        field={panelField}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="schoolProfileToasts" />
    </>
  );
};

export default SchoolProfile;
