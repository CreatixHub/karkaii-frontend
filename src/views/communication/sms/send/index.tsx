import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader, WorkspaceHeader, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, FilterField, QuickFilter, SavedView, SortOption, WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import SmsModals from './modals/SmsModals';
import type {
  BulkPayload, DuplicatePayload, GroupPayload, ImportPayload, SchedulePayload, SmsModalId,
  TemplatePayload,
} from './modals/SmsModals';
import type { Encoding, RecipientGroup } from './data/sms.data';
import {
  BULK_FILE, BULK_UPLOADED, BULK_VALIDATION, CREDITS_AVAILABLE, DEFAULT_BODY, DEFAULT_SELECTION,
  DEFAULT_TITLE, LOG_DELIVERED, LOG_FAILED, MESSAGES_PER_MINUTE, RATE_PER_SEGMENT, SENT,
  TOTAL_RECIPIENTS, audienceOptions, classOptions, costOf, deliveryStatusOptions,
  departmentOptions, encodingOptions, expandedLengthOf, failureReasons, gatewayOptions,
  languageOptions, logStateBadge, logStateIcon, logs, mergeFields, minutesToSend, money,
  priorityOptions, quickActions, recipientGroups, remainingOf, renderFor, roundMoney,
  searchIndexOf, sectionOptions, segmentSize, segmentsOf, senderOptions, sendHistory,
  sentRecipients, smsTemplates, successRateOf, templateOptions, templateStarters,
  previewRecipients, usedFieldsOf,
} from './data/sms.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  {
    id: 'sms-template', label: 'SMS Template', kind: 'select',
    chipLabel: 'Template', options: templateOptions, initialValue: 'Fee Reminder',
  },
  { id: 'priority', label: 'Priority', kind: 'select', chipLabel: 'Priority', options: priorityOptions },
  {
    id: 'delivery-status', label: 'Delivery Status', kind: 'select',
    chipLabel: 'Delivery', options: deliveryStatusOptions,
  },
  {
    id: 'date-range', label: 'Date Range', kind: 'daterange', chipLabel: 'Window',
    rangeFormat: 'd M Y', initialValue: '26 Jul 2026 - 02 Aug 2026',
  },
];

/** The rail has no sort order; these exist only because the hook wants one. */
const sortOptions: SortOption[] = [{ id: 'name', label: 'Group name', icon: 'ti ti-abc' }];

const SendSmsPage = () => {
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<SmsModalId | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [starterOpen, setStarterOpen] = useState(false);

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [encoding, setEncoding] = useState<Encoding>('GSM-7');
  const [senderId, setSenderId] = useState(senderOptions[0]);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTION);
  const [previewFor, setPreviewFor] = useState(previewRecipients[0].name);

  const [timing, setTiming] = useState<'now' | 'later' | 'recurring'>('later');
  const [quietHours, setQuietHours] = useState(true);
  const [priority, setPriority] = useState(priorityOptions[0]);
  const [gateway, setGateway] = useState(gatewayOptions[0]);
  const [deliveryReport, setDeliveryReport] = useState(true);
  const [retry, setRetry] = useState(true);
  const [draftSaved, setDraftSaved] = useState('2 min ago');

  const { toasts, push, dismiss } = useToasts();

  /* ------------------------------- Arithmetic ------------------------------- */

  const length = expandedLengthOf(body);
  const segments = segmentsOf(length, encoding);
  const remaining = remainingOf(length, encoding);
  const recipients = recipientGroups
    .filter((group) => selected.includes(group.id))
    .reduce((total, group) => total + group.count, 0);
  const totalSegments = recipients * segments;
  const cost = costOf(recipients, segments);
  const usedFields = usedFieldsOf(body);

  /* -------------------------------- Workspace ------------------------------- */

  const columns = useMemo<ColumnDef<RecipientGroup>[]>(
    () => [{ id: 'name', label: 'Group', render: (row) => row.name }],
    [],
  );

  const workspace = useWorkspace<RecipientGroup>({
    rows: recipientGroups,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.audience && row.audience !== filters.audience) return false;
      // Class, section and department narrow the roll rather than the group
      // list, so a group that cannot carry them drops out.
      if (filters.class && !['students', 'parents', 'classes', 'sections'].includes(row.id)) return false;
      if (filters.section && !['students', 'parents', 'sections'].includes(row.id)) return false;
      if (filters.department && !['teachers', 'staff', 'departments'].includes(row.id)) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'parents') return row.id === 'parents';
      if (quick === 'students') return row.id === 'students';
      if (quick === 'teachers') return row.id === 'teachers';
      if (quick === 'dues') return row.id === 'custom';
      if (quick === 'transport') return row.id === 'transport';
      return row.id === 'manual';
    },
    viewMatch: () => true,
    compare: (a, b) => a.name.localeCompare(b.name),
    defaultSort: 'name',
    defaultQuick: null,
    pageSize: 20,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'drafts', label: 'My Drafts', icon: 'ti ti-pencil' },
      { id: 'scheduled', label: 'Scheduled SMS', icon: 'ti ti-clock' },
      { id: 'delivered', label: 'Delivered Today', icon: 'ti ti-checks' },
      { id: 'failed', label: 'Failed Deliveries', icon: 'ti ti-alert-triangle' },
      { id: 'bulk', label: 'Bulk Sends', icon: 'ti ti-users-plus' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'parents', label: 'Parents', icon: 'ti ti-users', count: 1240 },
      { id: 'students', label: 'Students', icon: 'ti ti-school', count: 1286 },
      { id: 'teachers', label: 'Teachers', icon: 'ti ti-chalkboard', count: 184 },
      { id: 'dues', label: 'Fee dues', icon: 'ti ti-report-money', count: 318 },
      { id: 'transport', label: 'Transport', icon: 'ti ti-bus', count: 612 },
      { id: 'dnd', label: 'DND blocked', icon: 'ti ti-phone-off', count: 23 },
    ],
    [],
  );

  /* -------------------------------- Handlers -------------------------------- */

  const toggleGroup = useCallback((id: string) => {
    setSelected((current) => (current.includes(id)
      ? current.filter((entry) => entry !== id)
      : [...current, id]));
  }, []);

  const useTemplate = useCallback(
    (name: string) => {
      const found = smsTemplates.find((entry) => entry.name === name);
      if (!found) return;
      setTitle(name);
      setBody(found.preview);
      setStarterOpen(false);
      push(`${name} loaded into the composer`);
    },
    [push],
  );

  const saveDraft = useCallback(() => {
    setDraftSaved('just now');
    push(`${title} saved as a draft`);
  }, [push, title]);

  const send = useCallback(() => {
    setActiveModal(null);
    push(
      `${recipients.toLocaleString()} messages queued · ${totalSegments.toLocaleString()} segments · ${money(cost)}`,
    );
  }, [cost, push, recipients, totalSegments]);

  const schedule = useCallback(
    (payload: SchedulePayload) => {
      setActiveModal(null);
      setTiming('later');
      push(`Scheduled for ${payload.sendDate} at ${payload.sendTime} ${payload.timeZone}`);
    },
    [push],
  );

  const saveTemplate = useCallback(
    (payload: TemplatePayload) => {
      setActiveModal(null);
      push(`${payload.name} submitted to the operator for registration`);
    },
    [push],
  );

  const createGroup = useCallback(
    (payload: GroupPayload) => {
      setActiveModal(null);
      push(
        payload.name.trim()
          ? `${payload.name.trim()} saved · ${recipients.toLocaleString()} members${payload.dynamic ? ', re-read at every send' : ''}`
          : 'Give the group a name',
        payload.name.trim() ? 'success' : 'warning',
      );
    },
    [push, recipients],
  );

  const validateBulk = useCallback(
    (payload: BulkPayload) => {
      const deliverable = BULK_VALIDATION.rows
        - (payload.dropDuplicates ? BULK_VALIDATION.duplicates : 0)
        - (payload.skipInvalid ? BULK_VALIDATION.invalid : 0)
        - (payload.honourDnd ? BULK_VALIDATION.dnd : 0);
      setActiveModal(null);
      push(`${deliverable.toLocaleString()} numbers deliverable after validation`);
    },
    [push],
  );

  const importContacts = useCallback(
    (payload: ImportPayload) => {
      setActiveModal(null);
      push(`Contacts imported from ${payload.column.toLowerCase()} with ${payload.countryCode}`);
    },
    [push],
  );

  const duplicate = useCallback(
    (payload: DuplicatePayload) => {
      setActiveModal(null);
      setTitle(payload.title.trim() || `${title} (copy)`);
      push(
        payload.failedOnly
          ? `Copy opened for the ${SENT.failedCount} failed numbers`
          : 'Copy opened in the composer',
      );
    },
    [push, title],
  );

  const previewWho = previewRecipients.find((who) => who.name === previewFor)
    ?? previewRecipients[0];
  const previewText = renderFor(body, previewWho);

  const pairRow = (label: string, note: string, value: string) => (
    <div className="info-row" key={label}>
      <div className="row-key">
        {label}
        {note ? <small>{note}</small> : null}
      </div>
      <div className="row-value">{value}</div>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Send SMS"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => setActiveModal('bulk')}
                  >
                    <i className="ti ti-users-plus me-2" />Bulk SMS
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={saveDraft}
                  >
                    <i className="ti ti-device-floppy me-2" />Save Draft
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => setActiveModal('schedule')}
                  >
                    <i className="ti ti-clock-play me-2" />Schedule SMS
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setActiveModal('confirm')}
                  >
                    <i className="ti ti-send me-2" />Send Now
                  </ActionLink>
                </div>
              </>
            }
          />

          <div className="data-workspace page-toolbar-compact mb-4">
            <div className="card mb-0">
              <WorkspaceHeader
                searchPlaceholder="Search recipients by name, admission no. or mobile…"
                searchLabel="Search recipients"
                search={workspace.search}
                onSearch={workspace.setSearch}
                savedViews={savedViews}
                view={workspace.view}
                onView={workspace.setView}
                onSaveView={() => setActiveModal('group')}
                filterFields={filterFields}
                draft={workspace.draft}
                onDraftField={workspace.setDraftField}
                onApplyFilters={() => { workspace.applyFilters(); push('Filters applied'); }}
                onResetFilters={() => { workspace.resetFilters(); push('Filters cleared'); }}
                /* The footer counts the selection against the whole roll. */
                matchCount={recipients}
                totalCount={TOTAL_RECIPIENTS}
                matchNoun="recipients"
                columnOptions={[]}
                columns={workspace.columns}
                onToggleColumn={workspace.toggleColumn}
                onShowAllColumns={workspace.showAllColumns}
                showColumns={false}
                showDensity={false}
                density={workspace.density}
                onDensity={workspace.setDensity}
                onRefresh={() => { setSelected(DEFAULT_SELECTION); push('Recipient selection reset'); }}
                fullscreen={workspace.fullscreen}
                onFullscreen={workspace.toggleFullscreen}
                quickFilters={quickFilters}
                quick={workspace.quick}
                onQuick={(id) => {
                  workspace.toggleQuick(id);
                  const group = recipientGroups.find((entry) => (
                    (id === 'parents' && entry.id === 'parents')
                    || (id === 'students' && entry.id === 'students')
                    || (id === 'teachers' && entry.id === 'teachers')
                    || (id === 'dues' && entry.id === 'custom')
                    || (id === 'transport' && entry.id === 'transport')
                  ));
                  if (group) toggleGroup(group.id);
                }}
                sortOptions={sortOptions}
                showSort={false}
                /* The rail ends with the template starter, not a sort order. */
                quickRailExtra={(
                  <div className="dropdown">
                    <button
                      type="button" className="workspace-button dropdown-toggle"
                      aria-expanded={starterOpen}
                      onClick={() => setStarterOpen((current) => !current)}
                    >
                      <i className="ti ti-template" />Template
                    </button>
                    <ul className={`dropdown-menu dropdown-menu-end${starterOpen ? ' show' : ''}`}>
                      <li className="context-menu-head">Start from</li>
                      {templateStarters.map((starter) => (
                        <li key={starter.name}>
                          <button
                            type="button" className="dropdown-item"
                            onClick={() => useTemplate(starter.name)}
                          >
                            <i className={starter.icon} />{starter.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                sort={workspace.sort}
                onSort={workspace.setSort}
                chips={workspace.chips}
                onClearChip={workspace.clearChip}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
              />
            </div>
          </div>

          {/* Composer and preview */}
          <div className="row g-4 mb-5">
            <div className="col-12 col-xl-7 col-xxl-8">
              <div className="compose">
                <div className="compose-header">
                  <span className="compose-icon"><i className="ti ti-message-2" /></span>
                  <div className="flex-fill">
                    <p className="compose-title mb-0">Compose SMS</p>
                    <span className="fs-12 text-muted">
                      160 characters to a segment. Every segment beyond the first is billed and
                      delivered separately.
                    </span>
                  </div>
                  <span className="message-status-badge is-accent">
                    <i className="ti ti-pencil" />Draft saved {draftSaved}
                  </span>
                </div>
                <div className="compose-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label" htmlFor="sms-title">
                        SMS title <span className="text-muted fs-12">(internal only)</span>
                      </label>
                      <input
                        type="text" className="form-control" id="sms-title"
                        value={title} onChange={(event) => setTitle(event.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="sms-tpl">SMS template</label>
                      <select
                        className="form-select" id="sms-tpl"
                        value={title}
                        onChange={(event) => useTemplate(event.target.value)}
                      >
                        <option>— None —</option>
                        {smsTemplates.map((entry) => <option key={entry.name}>{entry.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label" htmlFor="sms-body">Message</label>
                    <textarea
                      className="form-control" id="sms-body" rows={6}
                      value={body} onChange={(event) => setBody(event.target.value)}
                    />
                  </div>

                  <span className="fs-12 text-muted d-block mb-1">Insert a merge field</span>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {mergeFields.slice(0, 7).map((field) => (
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        key={field.token}
                        onClick={() => setBody((current) => `${current}${field.token}`)}
                      >
                        <i className="ti ti-plus me-1" />{field.token}
                      </button>
                    ))}
                  </div>

                  {/* Characters, segments and what is left in the last one. */}
                  <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
                    <span className="message-metric"><b>{length}</b> Characters</span>
                    <span className="message-metric"><b>{segments}</b> Segments</span>
                    <span className="message-metric"><b>{encoding}</b> Encoding</span>
                    <span className="message-metric">
                      <b>{remaining}</b> Left in seg {segments}
                    </span>
                  </div>
                  <p className="fs-12 text-muted mb-3">
                    Merge fields are counted at their longest expansion, so the estimate never rises
                    after send.
                  </p>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="sms-lang">Language</label>
                      <select
                        className="form-select" id="sms-lang"
                        value={language} onChange={(event) => setLanguage(event.target.value)}
                      >
                        {languageOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="sms-sender">Sender ID</label>
                      <select
                        className="form-select" id="sms-sender"
                        value={senderId} onChange={(event) => setSenderId(event.target.value)}
                      >
                        {senderOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="sms-enc">Encoding</label>
                      <select
                        className="form-select" id="sms-enc"
                        value={encoding}
                        onChange={(event) => setEncoding(event.target.value as Encoding)}
                      >
                        {encodingOptions.map((option) => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span className="fs-13 text-muted">
                      {recipients.toLocaleString()} recipients · {totalSegments.toLocaleString()}{' '}
                      segments · approx. {roundMoney(cost)}
                    </span>
                    <span className="d-inline-flex flex-wrap gap-2">
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => setActiveModal('preview')}
                      >
                        <i className="ti ti-eye me-1" />Preview
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => setActiveModal('template')}
                      >
                        <i className="ti ti-template me-1" />Save as template
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={saveDraft}
                      >
                        <i className="ti ti-device-floppy me-1" />Save draft
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => setActiveModal('schedule')}
                      >
                        <i className="ti ti-clock-play me-1" />Schedule
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-primary"
                        onClick={() => setActiveModal('confirm')}
                      >
                        <i className="ti ti-send me-1" />Send
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-5 col-xxl-4">
              <div className="card mb-0">
                <div className="card-header d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-device-mobile" />
                  </span>
                  <h5 className="fs-14 mb-0 flex-fill">Message preview</h5>
                  <select
                    className="form-select form-select-sm w-auto"
                    aria-label="Preview recipient"
                    value={previewFor} onChange={(event) => setPreviewFor(event.target.value)}
                  >
                    {previewRecipients.map((who) => <option key={who.name}>{who.name}</option>)}
                  </select>
                </div>
                <div className="card-body">
                  <div className="border rounded p-3 mb-3">
                    <span className="fs-12 text-muted d-block mb-2">{senderId} SMS · today</span>
                    {/* The body with this recipient's values substituted. */}
                    <p className="fs-13 mb-2">{previewText}</p>
                    <span className="fs-12 text-muted">Delivers approx. 07:30 am</span>
                  </div>
                  {pairRow('Recipient', previewWho.note, previewWho.mobile)}
                  {pairRow(
                    'Character usage', 'After merge expansion',
                    `${previewText.length} / ${segments * segmentSize(encoding)}`,
                  )}
                  {pairRow(
                    'SMS segments', '',
                    `${segmentsOf(previewText.length, encoding)} segments`,
                  )}
                  {pairRow('Estimated delivery', 'Transactional route', 'Under 30 sec')}
                  {pairRow(
                    'Estimated cost',
                    `${recipients.toLocaleString()} recipients × ${segments} segments`,
                    money(cost),
                  )}
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-12 text-muted">
                      {CREDITS_AVAILABLE.toLocaleString()} credits available
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('preview')}
                    >
                      Full preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient selection */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Recipients</span>
              <h2>Recipient selection</h2>
              <p>
                Pick the groups this message goes to. Counts are read at send time, and a number
                appearing in two groups is only messaged once.
              </p>
            </div>
            <span className="d-inline-flex align-items-center gap-2">
              <span className="message-status-badge is-live">
                <i className="ti ti-users" />{recipients.toLocaleString()} selected
              </span>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                onClick={() => setActiveModal('group')}
              >
                <i className="ti ti-plus me-1" />Create group
              </button>
            </span>
          </div>
          <div className="row g-3 mb-5">
            {workspace.visible.map((group) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={group.id}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={group.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{group.name}</p>
                      <small>{group.count.toLocaleString()} {group.note}</small>
                    </div>
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input" type="checkbox"
                        id={`sms-group-${group.id}`}
                        aria-label={`Include ${group.name}`}
                        checked={selected.includes(group.id)}
                        onChange={() => toggleGroup(group.id)}
                      />
                    </div>
                  </div>
                  <div className="audience-footer">Last SMS · {group.last}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk SMS centre */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Bulk</span>
              <h2>Bulk SMS center</h2>
              <p>
                For lists that do not exist in the ERP — alumni, vendors, one-off invitees. Every
                upload is validated before a single message is billed.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => push('CSV template downloaded')}
            >
              <i className="ti ti-download me-1" />Download CSV template
            </button>
          </div>
          <div className="row g-3 mb-5">
            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header">
                  <h6 className="fs-14 mb-0">
                    <i className="ti ti-cloud-upload me-1" />Bulk recipient upload
                  </h6>
                </div>
                <div className="card-body">
                  <div className="border rounded text-center p-4 mb-3">
                    <span className="avatar avatar-lg bg-primary-transparent text-primary rounded-circle mb-2">
                      <i className="ti ti-file-upload fs-20" />
                    </span>
                    <h6 className="fs-14 mb-1">Drop a recipient file here</h6>
                    <p className="fs-12 text-muted mb-0">
                      CSV or Excel, up to 5 MB and 20,000 rows. One mobile number per row, with
                      optional columns for merge fields.
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('import')}
                    >
                      <i className="ti ti-file-type-csv me-1" />CSV import
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('import')}
                    >
                      <i className="ti ti-file-type-xls me-1" />Excel import
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('group')}
                    >
                      <i className="ti ti-bookmarks me-1" />Saved groups
                    </button>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fs-12 text-muted">
                      Last upload · {BULK_FILE}, {BULK_UPLOADED}
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-primary"
                      onClick={() => setActiveModal('bulk')}
                    >
                      Upload file
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="fs-14 mb-0"><i className="ti ti-checkup-list me-1" />Validation</h6>
                  <span className="message-status-badge is-high">
                    {BULK_VALIDATION.duplicates > 0 && BULK_VALIDATION.invalid > 0 ? 2 : 1} issues
                  </span>
                </div>
                <div className="card-body">
                  {pairRow('Rows read', BULK_FILE, BULK_VALIDATION.rows.toLocaleString())}
                  {pairRow('Duplicate numbers', 'Kept once, extras dropped', String(BULK_VALIDATION.duplicates))}
                  {pairRow('Invalid numbers', 'Wrong length or non-numeric', String(BULK_VALIDATION.invalid))}
                  {pairRow('DND registered', 'Promotional route blocked', String(BULK_VALIDATION.dnd))}
                  {/* Rows read, less every exclusion. */}
                  {pairRow('Deliverable', 'After every exclusion', BULK_VALIDATION.deliverable.toLocaleString())}
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-12 text-muted">Validated 2 minutes ago</span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('bulk')}
                    >
                      Validate recipients
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header">
                  <h6 className="fs-14 mb-0"><i className="ti ti-calculator me-1" />Estimate</h6>
                </div>
                <div className="card-body">
                  {pairRow('Deliverable recipients', '', BULK_VALIDATION.deliverable.toLocaleString())}
                  {pairRow('Segments each', '', String(segments))}
                  {pairRow(
                    'Total SMS count', '',
                    (BULK_VALIDATION.deliverable * segments).toLocaleString(),
                  )}
                  {pairRow(
                    'Estimated cost', `Demo rate ${money(RATE_PER_SEGMENT)} per segment`,
                    money(costOf(BULK_VALIDATION.deliverable, segments)),
                  )}
                  {pairRow(
                    'Estimated delivery', `At ${MESSAGES_PER_MINUTE} messages a minute`,
                    `${minutesToSend(BULK_VALIDATION.deliverable * segments)} minutes`,
                  )}
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('preview')}
                    >
                      Preview bulk SMS
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-primary"
                      onClick={() => setActiveModal('confirm')}
                    >
                      Send bulk SMS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SMS templates */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Templates</span>
              <h2>SMS templates</h2>
              <p>
                Twelve approved templates. Sender ID and wording are registered with the operator,
                so an unapproved edit will be rejected at the gateway rather than delivered.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => setActiveModal('template')}
            >
              <i className="ti ti-plus me-1" />Create template
            </button>
          </div>
          <div className="row g-3 mb-5">
            {smsTemplates.map((entry) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={entry.name}>
                <div className="template">
                  <div className="template-preview">
                    <div className="template-mini"><b>{entry.preview}</b></div>
                  </div>
                  <div className="template-body">
                    <span className="category">{entry.category}</span>
                    <p className="template-title">{entry.name}</p>
                    <div className="d-flex flex-wrap gap-1">
                      {entry.fields.map((token) => (
                        <span className="fs-12 text-muted" key={token}>{token}</span>
                      ))}
                    </div>
                  </div>
                  <div className="template-footer">
                    {/* The segment count follows the character count. */}
                    <span>
                      {entry.characters} chars · {segmentsOf(entry.characters, 'GSM-7')} segment
                      {segmentsOf(entry.characters, 'GSM-7') === 1 ? '' : 's'}
                    </span>
                    <span className="d-inline-flex gap-1">
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                        aria-label={`Preview ${entry.name}`}
                        onClick={() => { useTemplate(entry.name); setActiveModal('preview'); }}
                      >
                        <i className="ti ti-eye" />
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                        aria-label={`${entry.action === 'edit' ? 'Edit' : 'Copy'} ${entry.name}`}
                        onClick={() => setActiveModal('template')}
                      >
                        <i className={entry.action === 'edit' ? 'ti ti-edit' : 'ti ti-copy'} />
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => useTemplate(entry.name)}
                      >
                        Use
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Merge fields */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Personalization</span>
              <h2>Merge fields</h2>
              <p>
                Each field is replaced per recipient at send time. Character counts assume the
                longest value on record, so the estimate never rises after sending.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => setActiveModal('preview')}
            >
              <i className="ti ti-eye me-1" />Preview message
            </button>
          </div>
          <div className="card mb-5">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="fs-14 mb-0"><i className="ti ti-braces me-1" />Available merge fields</h6>
              <span className="fs-12 text-muted">{mergeFields.length} available</span>
            </div>
            <div className="card-body">
              {mergeFields.map((field) => (
                <div
                  className="d-flex align-items-center justify-content-between gap-2 border-bottom py-2"
                  key={field.token}
                >
                  <div>
                    <h6 className="fs-13 mb-0">
                      {field.label}
                      {/* Used in the message being written right now. */}
                      {usedFields.includes(field.token) ? (
                        <span className="message-status-badge is-live ms-2">In use</span>
                      ) : null}
                    </h6>
                    {field.note ? <span className="fs-12 text-muted">{field.note}</span> : null}
                  </div>
                  <button
                    type="button" className="btn btn-sm btn-outline-light bg-white"
                    onClick={() => setBody((current) => `${current}${field.token}`)}
                  >
                    <i className="ti ti-plus me-1" />{field.token}
                  </button>
                </div>
              ))}
              <p className="fs-12 text-muted mb-0 mt-2">
                A field with no value on record is replaced with an empty string.
              </p>
            </div>
          </div>

          {/* Delivery configuration */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Delivery</span>
              <h2>Delivery configuration</h2>
              <p>
                How this send behaves once it leaves the composer — when, on which route, and what
                happens to the numbers that do not answer.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => push('Gateway settings live under Settings · Communication')}
            >
              <i className="ti ti-settings me-1" />Gateway settings
            </button>
          </div>
          <div className="row g-3 mb-5">
            <div className="col-12 col-xl-6">
              <div className="card mb-0 h-100">
                <div className="card-header">
                  <h6 className="fs-14 mb-0"><i className="ti ti-clock-cog me-1" />Timing</h6>
                </div>
                <div className="card-body">
                  <span className="form-label d-block">When to send</span>
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {([
                      ['now', 'Send immediately'],
                      ['later', 'Schedule later'],
                      ['recurring', 'Recurring'],
                    ] as const).map(([id, label]) => (
                      <div className="form-check" key={id}>
                        <input
                          className="form-check-input" type="radio" name="sms-timing"
                          id={`sms-w-${id}`} checked={timing === id}
                          onChange={() => setTiming(id)}
                        />
                        <label className="form-check-label fs-13" htmlFor={`sms-w-${id}`}>{label}</label>
                      </div>
                    ))}
                  </div>
                  {pairRow(
                    'Send at', timing === 'now' ? 'As soon as it is approved' : 'IST +5:30',
                    timing === 'now' ? 'Immediately' : '05 Aug 2026, 07:30 am',
                  )}
                  {pairRow('Recurrence', '', timing === 'recurring' ? 'Weekly' : 'One-off')}
                  {pairRow('Message expiry', 'Dropped if undelivered by then', '24 hours')}
                  <div className="d-flex align-items-center justify-content-between border rounded p-2 mt-2">
                    <div>
                      <h6 className="fs-13 mb-0">Quiet hours</h6>
                      <span className="fs-12 text-muted">Nothing leaves 9 pm to 7 am</span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input" type="checkbox" role="switch" id="sms-qh"
                        checked={quietHours} onChange={(event) => setQuietHours(event.target.checked)}
                      />
                      <label className="form-check-label visually-hidden" htmlFor="sms-qh">
                        Respect quiet hours
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-12 text-muted">
                      {timing === 'now' ? 'Departs on approval' : 'Departs in 3 days'}
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('schedule')}
                    >
                      Change schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="card mb-0 h-100">
                <div className="card-header">
                  <h6 className="fs-14 mb-0"><i className="ti ti-router me-1" />Route &amp; reporting</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="sms-priority">Priority</label>
                      <select
                        className="form-select" id="sms-priority"
                        value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}
                      >
                        {priorityOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <span className="fs-12 text-muted">Transactional bypasses DND</span>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="sms-gateway">SMS gateway</label>
                      <select
                        className="form-select" id="sms-gateway"
                        value={gateway} onChange={(event) => setGateway(event.target.value)}
                      >
                        {gatewayOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </div>
                  </div>
                  {pairRow('Sender ID', 'Registered with the operator', senderId)}
                  <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                    <div>
                      <h6 className="fs-13 mb-0">Delivery report</h6>
                      <span className="fs-12 text-muted">DLR written back per number</span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input" type="checkbox" role="switch" id="sms-dlr"
                        checked={deliveryReport}
                        onChange={(event) => setDeliveryReport(event.target.checked)}
                      />
                      <label className="form-check-label visually-hidden" htmlFor="sms-dlr">
                        Delivery report
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                    <div>
                      <h6 className="fs-13 mb-0">Retry on failure</h6>
                      <span className="fs-12 text-muted">Twice, ten minutes apart</span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input" type="checkbox" role="switch" id="sms-retry"
                        checked={retry} onChange={(event) => setRetry(event.target.checked)}
                      />
                      <label className="form-check-label visually-hidden" htmlFor="sms-retry">
                        Retry on failure
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-12 text-muted">
                      {CREDITS_AVAILABLE.toLocaleString()} credits available
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => push('Gateway settings live under Settings · Communication')}
                    >
                      Gateway settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SMS logs */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Logs</span>
              <h2>SMS logs</h2>
              <p>
                The last twenty-four hours, one card per send. A failure states the operator's
                reason rather than a generic status.
              </p>
            </div>
            <span className="d-inline-flex align-items-center gap-2">
              <span className="message-status-badge is-live">
                {LOG_DELIVERED.toLocaleString()} delivered
              </span>
              <span className="message-status-badge is-urgent">{LOG_FAILED} failed</span>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                onClick={() => push(`${logs.length} log entries exported`)}
              >
                <i className="ti ti-file-export me-1" />Export
              </button>
            </span>
          </div>
          <div className="row g-3 mb-5">
            {logs.map((entry) => (
              <div className="col-12 col-xxl-6" key={entry.title + entry.at}>
                <div className="schedule">
                  <div className="schedule-main">
                    <div className="d-flex align-items-start gap-2 flex-wrap">
                      <div className="flex-fill">
                        <p className="schedule-title mb-1">{entry.title}</p>
                        <span className="fs-12 text-muted">
                          <i className={`${entry.icon} me-1`} />{entry.audience} · {entry.detail}
                        </span>
                      </div>
                      <span className={logStateBadge[entry.state]}>
                        <i className={logStateIcon[entry.state]} />{entry.state}
                      </span>
                    </div>
                    {entry.reason ? (
                      <p className="fs-12 text-muted mb-0 mt-2">
                        <i className="ti ti-alert-circle me-1" />{entry.reason}
                      </p>
                    ) : null}
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                      <span className="fs-12 text-muted">
                        {entry.at} · {entry.gateway}
                        {entry.failed > 0 && entry.state === 'Delivered'
                          ? ` · ${entry.failed} failed`
                          : ''}
                      </span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label={`View ${entry.title}`}
                          onClick={() => setReaderOpen(true)}
                        >
                          <i className="ti ti-eye" />
                        </button>
                        {entry.state === 'Failed' || entry.state === 'Rejected' ? (
                          <button
                            type="button" className="btn btn-sm btn-outline-light bg-white"
                            onClick={() => push(`${entry.title} resent`)}
                          >
                            <i className="ti ti-refresh me-1" />Resend
                          </button>
                        ) : (
                          <>
                            <button
                              type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                              aria-label={`Report for ${entry.title}`}
                              onClick={() => setActiveModal('report')}
                            >
                              <i className="ti ti-report" />
                            </button>
                            <button
                              type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                              aria-label={`Duplicate ${entry.title}`}
                              onClick={() => setActiveModal('duplicate')}
                            >
                              <i className="ti ti-copy" />
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Shortcuts</span>
              <h2>Quick actions</h2>
              <p>The eight things most often done from this page.</p>
            </div>
          </div>
          <div className="row g-3">
            {quickActions.map((action) => (
              <div className="col-xxl-3 col-lg-4 col-md-6" key={action.title}>
                <ActionLink
                  className="message-action"
                  onClick={() => {
                    if (action.title === 'Compose SMS') { setActiveModal('compose'); return; }
                    if (action.title === 'Bulk SMS') { setActiveModal('bulk'); return; }
                    if (action.title === 'Import Recipients') { setActiveModal('import'); return; }
                    if (action.title === 'Manage Templates') { setActiveModal('template'); return; }
                    if (action.title === 'View SMS Logs') { setReaderOpen(true); return; }
                    if (action.title === 'Create Recipient Group') { setActiveModal('group'); return; }
                    if (action.title === 'Schedule SMS') { setActiveModal('schedule'); return; }
                    push('SMS settings live under Settings · Communication');
                  }}
                >
                  <span className={`message-action-icon ${action.icon}`} />
                  <span className="flex-fill">
                    <span className="d-block fw-medium">{action.title}</span>
                    <span className="fs-12 text-muted">{action.note}</span>
                  </span>
                  <i className="message-action-go ti ti-chevron-right" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Sent SMS reader */}
          <Offcanvas
            open={readerOpen}
            onClose={() => setReaderOpen(false)}
            title={`${SENT.template} · Bulk send`}
            labelledById="sms_reader_title"
            className="message-detail-panel"
          >
            <h5 className="fs-16 mb-2">{SENT.title}</h5>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className="message-status-badge is-live">
                <i className="ti ti-checks" />
                Delivered {SENT.delivered.toLocaleString()} of {SENT.submitted.toLocaleString()}
              </span>
              <span className="message-status-badge">{SENT.segments} segments</span>
              <span className="message-status-badge">{SENT.senderId} · {SENT.gateway}</span>
            </div>
            <p className="fs-12 text-muted mb-3">Sent by {SENT.sentBy} · {SENT.sentAt}</p>

            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <button
                type="button" className="btn btn-outline-light bg-white btn-sm"
                onClick={() => { setReaderOpen(false); setActiveModal('duplicate'); }}
              >
                <i className="ti ti-copy me-1" />Duplicate
              </button>
              <button
                type="button" className="btn btn-outline-light bg-white btn-sm"
                onClick={() => { setReaderOpen(false); setActiveModal('report'); }}
              >
                <i className="ti ti-report me-1" />Delivery report
              </button>
              <button
                type="button" className="btn btn-primary btn-sm"
                onClick={() => push(`Resent to the ${SENT.failedCount} failed numbers`)}
              >
                <i className="ti ti-refresh me-1" />Resend to failed
              </button>
            </div>

            <h6 className="fs-14 mb-2">
              <i className="ti ti-message-2 me-1" />Complete message
              <span className="fs-12 text-muted ms-2">{length} characters</span>
            </h6>
            <p className="fs-12 text-muted mb-1">As stored, with merge fields</p>
            <div className="border rounded p-2 mb-2"><p className="fs-13 mb-0">{body}</p></div>
            <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
              <span className="message-metric"><b>{length}</b> Characters</span>
              <span className="message-metric"><b>{segments}</b> Segments</span>
              <span className="message-metric"><b>{encoding}</b> Encoding</span>
            </div>

            <h6 className="fs-14 mb-2">As one parent received it</h6>
            <div className="border rounded p-3 mb-3">
              <span className="fs-12 text-muted d-block mb-2">
                {SENT.senderId} · {SENT.sentAt.split(',')[0]}, {SENT.sentAt.split(', ')[1]}
              </span>
              <p className="fs-13 mb-2">{renderFor(body, previewRecipients[0])}</p>
              <span className="fs-12 text-muted">Delivered 07:30 am</span>
            </div>

            <h6 className="fs-14 mb-2">
              <i className="ti ti-users me-1" />Recipient list
              <span className="fs-12 text-muted ms-2">{SENT.submitted.toLocaleString()} numbers</span>
            </h6>
            {sentRecipients.map((who) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={who.name}>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{who.name}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {who.note} · {who.mobile}
                  </span>
                </div>
                <span className={who.state === 'Delivered' ? 'message-status-badge is-live' : 'message-status-badge is-urgent'}>
                  {who.state}
                </span>
              </div>
            ))}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fs-12 text-muted">
                Showing {sentRecipients.length} of {SENT.submitted.toLocaleString()}
              </span>
              <ActionLink onClick={() => push('Full recipient list exported')}>Export full list</ActionLink>
            </div>

            <h6 className="fs-14 mb-2">
              <i className="ti ti-history me-1" />SMS history
              <span className="fs-12 text-muted ms-2">This recipient group</span>
            </h6>
            {sendHistory.map((entry) => (
              <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2" key={entry.title}>
                <div>
                  <h6 className="fs-13 mb-0">{entry.title}</h6>
                  <span className="fs-12 text-muted">{entry.meta}</span>
                </div>
                <span className="fs-13 fw-medium">{entry.result}</span>
              </div>
            ))}

            <h6 className="fs-14 mb-2 mt-3"><i className="ti ti-info-circle me-1" />SMS details</h6>
            <div className="border rounded p-3 mb-3">
              {pairRow('Template', '', SENT.template)}
              {pairRow('Language', '', SENT.language)}
              {pairRow('Encoding', '', SENT.encoding)}
              {pairRow('Sender ID', '', SENT.senderId)}
              {pairRow('Sent by', '', SENT.sentBy)}
              {/* Submitted × segments, at the demo rate. */}
              {pairRow(
                'Cost',
                `${(SENT.submitted * SENT.segments).toLocaleString()} segments at ${money(RATE_PER_SEGMENT)}`,
                money(costOf(SENT.submitted, SENT.segments)),
              )}
            </div>

            <h6 className="fs-14 mb-2">
              <i className="ti ti-braces me-1" />Personalization variables
              <span className="fs-12 text-muted ms-2">Used in this message · {usedFields.length}</span>
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {usedFields.map((token) => (
                <span className="message-status-badge is-accent" key={token}>{token}</span>
              ))}
            </div>
            <p className="fs-12 text-muted mb-3">
              All {usedFields.length} resolved for every recipient. No message was sent with an
              empty substitution.
            </p>

            <h6 className="fs-14 mb-2"><i className="ti ti-router me-1" />Delivery configuration</h6>
            <div className="border rounded p-3 mb-3">
              {pairRow('Priority', '', SENT.priority)}
              {pairRow('Gateway', '', `Primary — ${SENT.gateway}`)}
              {pairRow('Delivery report', '', 'On')}
              {pairRow('Retry on failure', '', SENT.retries)}
              {pairRow('Message expiry', '', SENT.expiry)}
            </div>

            <h6 className="fs-14 mb-2"><i className="ti ti-clock-cog me-1" />Schedule details</h6>
            <div className="border rounded p-3 mb-3">
              {pairRow('Scheduled for', '', SENT.sentAt)}
              {pairRow('Time zone', '', SENT.timeZone)}
              {pairRow('Left the gateway', '', SENT.leftGateway)}
              {pairRow('Last DLR received', '', SENT.lastDlr)}
              {pairRow('Recurrence', '', 'One-off')}
            </div>

            <h6 className="fs-14 mb-2">
              <i className="ti ti-checks me-1" />Delivery status
              <span className="fs-12 text-muted ms-2">
                {successRateOf(SENT.delivered, SENT.submitted)}%
              </span>
            </h6>
            <div className="border rounded p-3">
              {pairRow('Delivered', '', SENT.delivered.toLocaleString())}
              {pairRow(
                'Failed',
                failureReasons.map((reason) => reason.label).slice(0, 2).join(', '),
                String(SENT.failedCount),
              )}
              {pairRow('Pending DLR', '', String(SENT.pending))}
              <div className="d-flex align-items-center justify-content-between mt-2">
                <span className="fs-12 text-muted">Final · no DLR pending</span>
                <button
                  type="button" className="btn btn-sm btn-outline-light bg-white"
                  onClick={() => { setReaderOpen(false); setActiveModal('report'); }}
                >
                  Open report
                </button>
              </div>
            </div>
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <SmsModals
        active={activeModal}
        compose={{ title, body, encoding, senderId, recipients }}
        onClose={() => setActiveModal(null)}
        onComposeSave={(nextTitle, nextBody, nextEncoding, nextSender) => {
          setTitle(nextTitle);
          setBody(nextBody);
          setEncoding(nextEncoding);
          setSenderId(nextSender);
          setActiveModal(null);
          push('Composer updated');
        }}
        onSchedule={schedule}
        onSaveTemplate={saveTemplate}
        onCreateGroup={createGroup}
        onValidateBulk={validateBulk}
        onImport={importContacts}
        onSend={send}
        onDuplicate={duplicate}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="smsToasts" />
    </>
  );
};

export default SendSmsPage;
