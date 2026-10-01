import type { Control, PanelCard } from '../../../shared/SettingsPanelCard';
import {
  ACTIVE_KEYS,
  AVAILABLE_VERSION,
  CONNECTED_INTEGRATIONS,
  DISK_ALERT_AT,
  DISK_PERCENT,
  INSTALLATION,
  INTEGRATIONS,
  LOG_RETENTION_DAYS,
  OVERDUE_KEYS,
  RELEASES,
  ROTATION_DAYS,
  SCHOOLS,
  STOPPED_INTEGRATIONS,
  USERS,
} from './systemSettings.data';

export type { Control, Row, PanelCard } from '../../../shared/SettingsPanelCard';
export { footOf } from '../../../shared/SettingsPanelCard';

export type Card = PanelCard;

const on = (value: boolean): Control => ({ kind: 'switch', on: value });
const choose = (value: string, ...rest: string[]): Control => ({
  kind: 'select',
  options: [value, ...rest],
  value,
});
const typed = (value: string): Control => ({ kind: 'input', value });
const reading = (value: string): Control => ({ kind: 'reading', value });
const plain = (value: string): Control => ({ kind: 'tag', value });

const HALF = 'col-12 col-xl-6';

/* ------------------------------------------------------------------ *
 * 01 General                                                         *
 * ------------------------------------------------------------------ */

export const GENERAL_CARDS: Card[] = [
  {
    id: 'identity',
    title: 'Identity',
    note: 'What the installation calls itself',
    icon: 'ti ti-app-window',
    badge: { tone: 'is-up', label: 'Published' },
    span: HALF,
    rows: [
      {
        id: 'name',
        label: 'Application name',
        note: 'Shown in the browser tab, on emails and on printed documents',
        control: typed(INSTALLATION.name),
      },
      {
        id: 'url',
        label: 'Application URL',
        note: 'Every generated link is built from this',
        control: typed(INSTALLATION.url),
      },
      {
        id: 'admin',
        label: 'Admin URL',
        note: 'A separate path keeps the console off the public site',
        control: typed(INSTALLATION.adminPath),
      },
      {
        id: 'support',
        label: 'Support contact',
        note: 'Printed on error pages',
        control: typed(INSTALLATION.support),
      },
      {
        id: 'install-id',
        label: 'Installation ID',
        note: 'Fixed at install and used for licensing',
        control: plain(INSTALLATION.id),
      },
    ],
  },
  {
    id: 'locale',
    title: 'Locale defaults',
    note: 'Inherited by every school on this installation',
    icon: 'ti ti-world',
    badge: { tone: 'is-accent', label: 'Inherited' },
    span: HALF,
    foot: '5 settings · overridable',
    rows: [
      {
        id: 'timezone',
        label: 'Timezone',
        note: 'Asia/Kolkata · GMT +5:30',
        control: choose('Asia/Kolkata', 'Asia/Dubai', 'UTC'),
      },
      {
        id: 'language',
        label: 'Default language',
        note: 'English (India)',
        control: choose('English (India)', 'Tamil', 'Hindi'),
      },
      {
        id: 'date-format',
        label: 'Date format',
        note: '31 Jul 2026',
        control: choose('31 Jul 2026', '2026-07-31', '07/31/2026'),
      },
      {
        id: 'currency',
        label: 'Currency',
        note: 'Indian Rupee',
        control: choose('INR — ₹', 'USD — $', 'AED'),
      },
      {
        id: 'override',
        label: 'A school may override these',
        note: 'Localization settings are per school',
        control: on(true),
      },
    ],
  },
  {
    id: 'sessions',
    title: 'Sessions',
    note: 'How long a signed-in user stays signed in',
    icon: 'ti ti-clock-shield',
    badge: { tone: 'is-accent', label: '30 min idle' },
    span: HALF,
    rows: [
      {
        id: 'idle',
        label: 'Idle timeout',
        note: 'Then a re-prompt, not a sign-out',
        control: typed('30'),
      },
      {
        id: 'lifetime',
        label: 'Absolute lifetime',
        note: 'Whatever the activity',
        control: typed('12'),
      },
      {
        id: 'concurrent',
        label: 'Concurrent sessions',
        note: 'Per user account',
        control: typed('5'),
      },
      {
        id: 'driver',
        label: 'Session driver',
        note: 'Redis — survives an application restart',
        control: choose('Redis', 'Database', 'File'),
      },
      {
        id: 'remember',
        label: 'Remember me',
        note: 'Extends a session to 30 days on a trusted device',
        control: on(true),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 02 Application                                                     *
 * ------------------------------------------------------------------ */

export const APPLICATION_CARDS: Card[] = [
  {
    id: 'tenancy',
    title: 'Tenancy',
    note: 'How many schools this installation serves',
    icon: 'ti ti-users-group',
    badge: { tone: 'is-accent', label: `${SCHOOLS.length} schools` },
    span: HALF,
    rows: [
      {
        id: 'mode',
        label: 'Mode',
        note: 'Multi-tenant — one database, scoped by school',
        control: choose('Multi-tenant, shared', 'Multi-tenant, isolated', 'Single school'),
      },
      {
        id: 'schools',
        label: 'Schools',
        note: SCHOOLS.join(', '),
        control: reading(String(SCHOOLS.length)),
      },
      {
        id: 'users',
        label: 'Users across all schools',
        note: 'Staff, guardians and students',
        control: reading(USERS.toLocaleString('en-US')),
      },
      {
        id: 'cross-school',
        label: 'Cross-school access',
        note: 'Off — nobody sees another school’s records',
        control: on(false),
      },
      {
        id: 'onboarding',
        label: 'New school onboarding',
        note: 'Manual, by a Super Administrator',
        control: on(false),
      },
    ],
  },
  {
    id: 'flags',
    title: 'Feature flags',
    note: 'What is switched on for this installation',
    icon: 'ti ti-flag',
    badge: { tone: 'is-accent', label: '6 flags' },
    span: HALF,
    rows: [
      { id: 'ai', label: 'AI module', note: 'Insights, forecasts and the assistant', control: on(true) },
      {
        id: 'parent',
        label: 'Parent portal',
        note: 'Guardian sign-in and fee payment',
        control: on(true),
      },
      {
        id: 'transport',
        label: 'Transport module',
        note: 'Routes, vehicles and tracking',
        control: on(true),
      },
      { id: 'hostel', label: 'Hostel module', note: 'Only one school uses it', control: on(true) },
      {
        id: 'beta',
        label: 'Beta features',
        note: 'Off in production, on in staging',
        control: on(false),
      },
      {
        id: 'api-v2',
        label: 'Public API v2',
        note: 'Not released — v1 remains the supported interface',
        control: on(false),
      },
    ],
  },
  {
    id: 'notification-defaults',
    title: 'Notification defaults',
    note: 'What a new school inherits',
    icon: 'ti ti-mail',
    badge: { tone: 'is-up', label: 'Configured' },
    span: HALF,
    rows: [
      {
        id: 'email',
        label: 'Email transport',
        note: 'Amazon SES — set in email settings',
        control: plain('Email settings'),
      },
      {
        id: 'sms',
        label: 'SMS gateway',
        note: 'MSG91 — set in SMS settings',
        control: plain('SMS settings'),
      },
      {
        id: 'push',
        label: 'Push notifications',
        note: 'Not configured — no mobile application yet',
        control: plain('Not set'),
      },
      {
        id: 'notices',
        label: 'Platform notices',
        note: 'Maintenance and outage notices to all administrators',
        control: on(true),
      },
    ],
  },
  {
    id: 'uploads',
    title: 'Uploads',
    note: 'What the application will accept',
    icon: 'ti ti-file-upload',
    badge: { tone: 'is-accent', label: '25 MB' },
    span: HALF,
    rows: [
      { id: 'size', label: 'Maximum file size', note: 'Per file', control: typed('25') },
      {
        id: 'types',
        label: 'Permitted types',
        note: 'Documents, images and spreadsheets',
        control: reading('pdf jpg png xlsx docx'),
      },
      {
        id: 'executables',
        label: 'Executables',
        note: 'Refused outright, whatever the extension says',
        control: on(false),
      },
      {
        id: 'scan',
        label: 'Virus scan on upload',
        note: 'ClamAV, before the file is stored',
        control: on(true),
      },
      {
        id: 'reencode',
        label: 'Image re-encoding',
        note: 'Strips metadata, including location',
        control: on(true),
      },
    ],
  },
];

/** The flag card counts what is on rather than how many rows it has. */
export const FLAGS_ON = APPLICATION_CARDS[1].rows.filter(
  (row) => row.control.kind === 'switch' && row.control.on,
).length;
export const FLAGS_FOOT = `${APPLICATION_CARDS[1].rows.length} flags · ${FLAGS_ON} on`;

/* ------------------------------------------------------------------ *
 * 04 Performance                                                     *
 * ------------------------------------------------------------------ */

export const PERFORMANCE_CARDS: Card[] = [
  {
    id: 'delivery',
    title: 'Delivery',
    note: 'What reaches the browser, and how much of it',
    icon: 'ti ti-rocket',
    badge: { tone: 'is-up', label: 'Optimised' },
    span: HALF,
    rows: [
      {
        id: 'compression',
        label: 'Compression',
        note: 'Brotli, falling back to gzip',
        control: choose('Brotli + gzip', 'gzip only', 'Off'),
      },
      {
        id: 'bundling',
        label: 'Asset bundling',
        note: 'Minified and fingerprinted at build',
        control: on(true),
      },
      {
        id: 'lazy',
        label: 'Lazy loading',
        note: 'Images below the fold load when scrolled to',
        control: on(true),
      },
      {
        id: 'images',
        label: 'Image optimisation',
        note: 'WebP with a JPEG fallback, resized on upload',
        control: on(true),
      },
      {
        id: 'cdn',
        label: 'CDN',
        note: `Not in use — a single region serves all ${SCHOOLS.length} schools`,
        control: on(false),
      },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    note: 'Where most of the time actually goes',
    icon: 'ti ti-database-cog',
    badge: { tone: 'is-accent', label: 'Tuned' },
    span: HALF,
    rows: [
      {
        id: 'query-cache',
        label: 'Query cache',
        note: 'Read queries cached for 60 seconds',
        control: on(true),
      },
      {
        id: 'slow-log',
        label: 'Slow query log',
        note: 'Anything over 500ms is recorded',
        control: typed('500'),
      },
      {
        id: 'pool',
        label: 'Connection pool',
        note: 'Maximum simultaneous connections',
        control: typed('40'),
      },
      {
        id: 'indexes',
        label: 'Index maintenance',
        note: 'Rebuilt weekly during the maintenance window',
        control: on(true),
      },
      {
        id: 'replica',
        label: 'Read replica',
        note: 'Not configured — load does not warrant one yet',
        control: on(false),
      },
    ],
  },
  {
    id: 'mode',
    title: 'Performance mode',
    note: 'What the platform gives up when it is busy',
    icon: 'ti ti-adjustments-alt',
    badge: { tone: 'is-accent', label: 'Balanced' },
    span: HALF,
    rows: [
      {
        id: 'mode',
        label: 'Mode',
        note: 'Balanced — the default',
        control: choose('Balanced', 'Maximum performance', 'Low resource'),
      },
      {
        id: 'defer',
        label: 'Under load, defer',
        note: 'Report generation and AI batch work',
        control: on(true),
      },
      {
        id: 'never-defer',
        label: 'Under load, never defer',
        note: 'Sign-in, fee payment and attendance',
        control: on(true),
      },
      {
        id: 'timeout',
        label: 'Request timeout',
        note: 'A request longer than this is abandoned',
        control: typed('30'),
      },
      {
        id: 'rate-limit',
        label: 'Rate limit per user',
        note: 'Requests per minute',
        control: typed('120'),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 05 Storage                                                         *
 * ------------------------------------------------------------------ */

export const STORAGE_CARDS: Card[] = [
  {
    id: 'locations',
    title: 'Storage locations',
    note: 'Where each kind of file lives',
    icon: 'ti ti-cloud',
    badge: { tone: 'is-accent', label: '2 drivers' },
    span: HALF,
    rows: [
      {
        id: 'media',
        label: 'Media',
        note: 'S3 · preskool-media · ap-south-1',
        control: choose('Amazon S3', 'Local disk', 'Google Cloud Storage'),
      },
      {
        id: 'documents',
        label: 'Documents',
        note: 'S3, with server-side encryption',
        control: on(true),
      },
      {
        id: 'logs',
        label: 'Logs',
        note: 'Local disk — never leaves the host',
        control: choose('Local disk', 'S3', 'External log service'),
      },
      {
        id: 'backups',
        label: 'Backups',
        note: 'S3 in a second region',
        control: choose('S3 · ap-southeast-1', 'S3 · same region', 'Local disk'),
      },
      {
        id: 'temp',
        label: 'Temporary files',
        note: 'Local, cleared nightly',
        control: on(true),
      },
    ],
  },
  {
    id: 'retention',
    title: 'Retention',
    note: 'What is kept, and for how long',
    icon: 'ti ti-trash',
    badge: { tone: 'is-warn', label: '1 too long' },
    span: HALF,
    rows: [
      {
        id: 'app-logs',
        label: 'Application logs',
        note: `${LOG_RETENTION_DAYS} days — the largest reclaimable item`,
        control: typed(String(LOG_RETENTION_DAYS)),
      },
      {
        id: 'audit-logs',
        label: 'Audit logs',
        note: '3 academic years — required, not negotiable',
        control: typed('1095'),
      },
      {
        id: 'temp-uploads',
        label: 'Temporary uploads',
        note: 'Cleared after 24 hours',
        control: typed('1'),
      },
      {
        id: 'deleted',
        label: 'Deleted records',
        note: 'Held 30 days in a recycle bin, then purged',
        control: typed('30'),
      },
      {
        id: 'old-backups',
        label: 'Old backups',
        note: 'Handled by the backup retention policy',
        control: plain('Backups'),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 06 Cache                                                           *
 * ------------------------------------------------------------------ */

export const CACHE_CARD: Card = {
  id: 'cache-config',
  title: 'Cache configuration',
  note: 'What is held in memory and for how long',
  icon: 'ti ti-bolt',
  badge: { tone: 'is-up', label: 'Redis' },
  span: HALF,
  rows: [
    {
      id: 'driver',
      label: 'Driver',
      note: 'Redis — shared across application instances',
      control: choose('Redis', 'Memcached', 'File', 'Off'),
    },
    {
      id: 'lifetime',
      label: 'Default lifetime',
      note: 'Seconds, unless a store overrides it',
      control: typed('3600'),
    },
    {
      id: 'config-cache',
      label: 'Configuration cache',
      note: 'Compiled at deploy, never at runtime',
      control: on(true),
    },
    {
      id: 'route-cache',
      label: 'Route and view cache',
      note: 'Compiled at deploy',
      control: on(true),
    },
    {
      id: 'write-through',
      label: 'Cache on write',
      note: 'A record is cached the moment it is saved',
      control: on(false),
    },
  ],
};

/* ------------------------------------------------------------------ *
 * 07 Jobs                                                            *
 * ------------------------------------------------------------------ */

export const JOB_FAILURE_CARD: Card = {
  id: 'job-failure',
  title: 'Failure handling',
  note: 'What happens to a job that does not finish',
  icon: 'ti ti-repeat',
  badge: { tone: 'is-accent', label: '3 attempts' },
  span: HALF,
  rows: [
    {
      id: 'attempts',
      label: 'Attempts',
      note: 'Then the job is moved to the failed table',
      control: typed('3'),
    },
    {
      id: 'backoff',
      label: 'Backoff',
      note: '1 min, 5 min, 30 min',
      control: choose('1 / 5 / 30 min', 'Fixed 5 min', 'Immediate'),
    },
    {
      id: 'timeout',
      label: 'Timeout',
      note: 'A job running longer than this is killed',
      control: typed('300'),
    },
    {
      id: 'notify',
      label: 'Notify on failure',
      note: 'The IT administrator, once per job type per hour',
      control: on(true),
    },
    {
      id: 'retain',
      label: 'Retain failed jobs',
      note: 'For inspection before they are discarded',
      control: typed('7'),
    },
  ],
};

/* ------------------------------------------------------------------ *
 * 08 Maintenance                                                     *
 * ------------------------------------------------------------------ */

export const MAINTENANCE_CARDS: Card[] = [
  {
    id: 'scheduled',
    title: 'Scheduled maintenance',
    note: 'When the platform expects to be interrupted',
    icon: 'ti ti-calendar-clock',
    badge: { tone: 'is-accent', label: 'Nightly window' },
    span: HALF,
    rows: [
      {
        id: 'window',
        label: 'Window',
        note: 'Fewer than five users are signed in at this hour',
        control: typed('02:00 – 04:00'),
      },
      {
        id: 'auto-tasks',
        label: 'Automatic tasks in the window',
        note: 'Backup, index rebuild, cleanup and optimisation',
        control: on(true),
      },
      {
        id: 'next-outage',
        label: 'Next planned outage',
        note: `For the ${AVAILABLE_VERSION} upgrade`,
        control: reading('16 Aug 2026, 02:00'),
      },
      {
        id: 'notice',
        label: 'Notice period',
        note: 'Administrators are told this far ahead',
        control: typed('7'),
      },
      {
        id: 'guardians',
        label: 'Notify guardians',
        note: 'Off — a nightly window nobody notices needs no notice',
        control: on(false),
      },
    ],
  },
  {
    id: 'debug',
    title: 'Debug & error reporting',
    note: 'What the platform says when it goes wrong',
    icon: 'ti ti-bug',
    badge: { tone: 'is-up', label: 'Safe' },
    span: HALF,
    rows: [
      {
        id: 'debug-mode',
        label: 'Debug mode',
        note: 'Off — a stack trace on a public page leaks paths and queries',
        control: on(false),
      },
      {
        id: 'detail',
        label: 'Error detail shown to users',
        note: 'A reference number only',
        control: choose('Reference number only', 'Short message', 'Full trace'),
      },
      {
        id: 'reporting',
        label: 'Error reporting service',
        note: 'Sentry · ap-south-1',
        control: on(true),
      },
      {
        id: 'scrub',
        label: 'Scrub personal data from reports',
        note: 'Names, emails and numbers removed before sending',
        control: on(true),
      },
      {
        id: 'new-error',
        label: 'Notify on a new error type',
        note: 'Once per type per hour, not per occurrence',
        control: on(true),
      },
    ],
  },
  {
    id: 'cleanup',
    title: 'Cleanup & optimisation',
    note: 'Housekeeping that runs on its own',
    icon: 'ti ti-broom',
    badge: { tone: 'is-up', label: 'Nightly' },
    span: HALF,
    foot: '5 tasks · all automatic',
    rows: [
      {
        id: 'temp',
        label: 'Temporary file purge',
        note: 'Daily at 03:00 · freed 1.2 GB last night',
        control: on(true),
      },
      {
        id: 'orphans',
        label: 'Orphaned media',
        note: 'Files with no record pointing at them',
        control: on(true),
      },
      { id: 'sessions', label: 'Expired sessions', note: 'Cleared hourly', control: on(true) },
      {
        id: 'tables',
        label: 'Table optimisation',
        note: 'Weekly, in the maintenance window',
        control: on(true),
      },
      {
        id: 'recycle',
        label: 'Recycle bin purge',
        note: 'Records deleted more than 30 days ago',
        control: on(true),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 09 Security                                                        *
 * ------------------------------------------------------------------ */

export const SECURITY_CARDS: Card[] = [
  {
    id: 'transport',
    title: 'Transport & headers',
    note: 'What the browser is told to enforce',
    icon: 'ti ti-lock',
    badge: { tone: 'is-up', label: 'Enforced' },
    span: HALF,
    rows: [
      {
        id: 'https',
        label: 'HTTPS only',
        note: 'A plaintext request is redirected, then refused',
        control: on(true),
      },
      { id: 'hsts', label: 'HSTS', note: 'Two years, including subdomains', control: typed('730') },
      {
        id: 'csp',
        label: 'Content security policy',
        note: 'No inline script, no external origins',
        control: on(true),
      },
      {
        id: 'frame',
        label: 'Clickjacking protection',
        note: 'The application may not be framed',
        control: on(true),
      },
      {
        id: 'tls',
        label: 'TLS minimum',
        note: 'TLS 1.2',
        control: choose('TLS 1.2', 'TLS 1.3'),
      },
    ],
  },
  {
    id: 'access',
    title: 'Access control',
    note: 'Who may reach the platform at all',
    icon: 'ti ti-shield-lock',
    badge: { tone: 'is-accent', label: 'Open with limits' },
    span: HALF,
    rows: [
      {
        id: 'allow-list',
        label: 'IP allow-list for the console',
        note: 'School network and two administrator addresses',
        control: on(true),
      },
      {
        id: 'banned',
        label: 'Banned addresses',
        note: 'Added automatically after repeated failures',
        control: reading('18'),
      },
      {
        id: 'rate-limit',
        label: 'Rate limit',
        note: 'Requests per minute per address',
        control: typed('300'),
      },
      {
        id: 'lockout',
        label: 'Failed sign-in lockout',
        note: 'Five attempts, then fifteen minutes',
        control: on(true),
      },
      {
        id: 'break-glass',
        label: 'Break-glass account',
        note: 'One, with an offline credential and full audit',
        control: plain('1'),
      },
    ],
  },
  {
    id: 'secrets',
    title: 'Secrets & encryption',
    note: 'How the platform keeps what it holds',
    icon: 'ti ti-key',
    badge: { tone: 'is-up', label: 'AES-256' },
    span: HALF,
    rows: [
      {
        id: 'at-rest',
        label: 'Encryption at rest',
        note: 'Database volume and object storage',
        control: on(true),
      },
      {
        id: 'app-key',
        label: 'Application key',
        note: 'Rotated at install only — rotating it re-encrypts everything',
        control: plain('••••••9F41'),
      },
      {
        id: 'store',
        label: 'Secrets store',
        note: 'Environment file, outside the web root',
        control: choose('Environment file', 'AWS Secrets Manager', 'Vault'),
      },
      {
        id: 'in-logs',
        label: 'Secrets in logs',
        note: 'Redacted before anything is written',
        control: on(true),
      },
      {
        id: 'backup-key',
        label: 'Backup encryption',
        note: 'Separate key from the application key',
        control: on(true),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 10 Logging                                                         *
 * ------------------------------------------------------------------ */

export const LOGGING_CARDS: Card[] = [
  {
    id: 'log-config',
    title: 'Log configuration',
    note: 'What is written, and where',
    icon: 'ti ti-adjustments',
    badge: { tone: 'is-accent', label: 'info and above' },
    span: HALF,
    rows: [
      {
        id: 'level',
        label: 'Level',
        note: 'Debug is written in staging only',
        control: choose('info', 'debug', 'warning', 'error'),
      },
      {
        id: 'channels',
        label: 'Channels',
        note: 'Daily file, plus errors to Sentry',
        control: choose('Daily file + Sentry', 'Daily file', 'Syslog'),
      },
      { id: 'rotation', label: 'Rotation', note: 'One file a day', control: on(true) },
      {
        id: 'retention',
        label: 'Retention',
        note: 'Ninety days — the largest reclaimable partition',
        control: typed(String(LOG_RETENTION_DAYS)),
      },
      {
        id: 'pii',
        label: 'Personal data',
        note: 'Names and identifiers redacted before writing',
        control: on(true),
      },
    ],
  },
  {
    id: 'log-alerts',
    title: 'Log alerts',
    note: 'What raises a notice rather than a line',
    icon: 'ti ti-bell',
    badge: { tone: 'is-warn', label: '2 firing' },
    span: HALF,
    rows: [
      {
        id: 'any-error',
        label: 'Any error level entry',
        note: 'To the IT administrator',
        control: on(true),
      },
      {
        id: 'repeated',
        label: 'Repeated identical error',
        note: 'Grouped — one notice per type per hour',
        control: on(true),
      },
      {
        id: 'disk',
        label: 'Disk above threshold',
        note: `Currently firing at ${DISK_PERCENT}%`,
        control: on(true),
      },
      {
        id: 'service-down',
        label: 'Service down',
        note: 'Firing for the AI service since 27 Jul',
        control: on(true),
      },
      {
        id: 'quiet',
        label: 'Quiet hours',
        note: 'None — a platform alert at 03:00 is the point',
        control: on(false),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 11 API                                                             *
 * ------------------------------------------------------------------ */

export const API_CARD: Card = {
  id: 'rest',
  title: 'REST API',
  note: 'How the platform is reached from outside',
  icon: 'ti ti-api',
  badge: { tone: 'is-up', label: 'v1 live' },
  span: HALF,
  rows: [
    { id: 'enabled', label: 'Enabled', note: 'Four consumers are using it', control: on(true) },
    {
      id: 'base-url',
      label: 'Base URL',
      note: `${INSTALLATION.url}/api/v1`,
      control: typed(`${INSTALLATION.url}/api/v1`),
    },
    {
      id: 'auth',
      label: 'Authentication',
      note: 'Bearer token, scoped per key',
      control: choose('Bearer token', 'OAuth 2.0', 'Basic auth'),
    },
    {
      id: 'rate-limit',
      label: 'Rate limit',
      note: 'Requests per minute per key',
      control: typed('600'),
    },
    {
      id: 'versioning',
      label: 'Versioning',
      note: 'A version is supported for 18 months after the next one ships',
      control: plain('v1'),
    },
  ],
};

export const API_KEYS_CARD: Card = {
  id: 'api-keys',
  title: 'API keys',
  note: 'Who is holding one',
  icon: 'ti ti-key',
  badge: { tone: 'is-warn', label: `${OVERDUE_KEYS} overdue` },
  span: HALF,
  foot: `${ACTIVE_KEYS} active keys`,
  rows: [
    {
      id: 'rotation',
      label: 'Rotation policy',
      note: `Every ${ROTATION_DAYS} days`,
      control: choose(`${ROTATION_DAYS} days`, '90 days', 'Manual'),
    },
    {
      id: 'revoked',
      label: 'Revoked keys',
      note: 'Kept in the audit record, never reissued',
      control: reading('3'),
    },
  ],
};

/* ------------------------------------------------------------------ *
 * 12 Integrations                                                    *
 * ------------------------------------------------------------------ */

export const INTEGRATIONS_CARD: Card = {
  id: 'connected',
  title: 'Connected services',
  note: 'What the platform talks to',
  icon: 'ti ti-plug-connected',
  badge: { tone: 'is-warn', label: `${STOPPED_INTEGRATIONS} stopped` },
  span: HALF,
  foot: `${INTEGRATIONS.length} services · ${CONNECTED_INTEGRATIONS} connected`,
  rows: INTEGRATIONS.map((entry) => ({
    id: entry.id,
    label: entry.label,
    note: entry.note,
    control: plain(entry.connected ? 'Connected' : 'Stopped'),
  })),
};

export const WEBHOOKS_CARD: Card = {
  id: 'webhooks',
  title: 'Webhooks',
  note: 'What is allowed to call in',
  icon: 'ti ti-webhook',
  badge: { tone: 'is-up', label: 'Signed' },
  span: HALF,
  rows: [
    {
      id: 'endpoints',
      label: 'Incoming endpoints',
      note: 'Payment settlement and SMS delivery receipts',
      control: reading('2'),
    },
    {
      id: 'signature',
      label: 'Signature verification',
      note: 'HMAC SHA-256 — unsigned calls are discarded',
      control: on(true),
    },
    {
      id: 'replay',
      label: 'Replay protection',
      note: 'A signature is accepted once, within five minutes',
      control: on(true),
    },
    {
      id: 'allow-list',
      label: 'Source allow-list',
      note: 'Only the provider’s published ranges',
      control: on(true),
    },
    {
      id: 'failures',
      label: 'Failures in 30 days',
      note: 'All were unsigned probes from the open internet',
      control: reading('41'),
    },
  ],
};

/* ------------------------------------------------------------------ *
 * 13 Environment                                                     *
 * ------------------------------------------------------------------ */

export const ENVIRONMENTS_CARD: Card = {
  id: 'environments',
  title: 'Environments',
  note: 'Three, and what each is for',
  icon: 'ti ti-git-branch',
  badge: { tone: 'is-accent', label: '3' },
  span: HALF,
  rows: [
    {
      id: 'production',
      label: 'Production',
      note: `${INSTALLATION.url.replace('https://', '')} · ${USERS.toLocaleString('en-US')} users`,
      control: plain('Live'),
    },
    {
      id: 'staging',
      label: 'Staging',
      note: 'staging.preskool.edu · a copy refreshed weekly',
      control: plain('Non-live'),
    },
    {
      id: 'local',
      label: 'Local',
      note: 'Developer machines · seeded data only',
      control: plain('Off-platform'),
    },
    {
      id: 'promotion',
      label: 'Promotion path',
      note: 'Local, then staging, then production — never directly',
      control: on(true),
    },
    {
      id: 'prod-in-staging',
      label: 'Production data in staging',
      note: 'Off — staging uses anonymised records',
      control: on(false),
    },
  ],
};

export const INFRASTRUCTURE_CARD: Card = {
  id: 'infrastructure',
  title: 'Infrastructure',
  note: 'The machines underneath',
  icon: 'ti ti-server-2',
  badge: { tone: 'is-accent', label: INSTALLATION.region },
  span: HALF,
  foot: 'Single region · no failover configured',
  rows: [
    {
      id: 'app-host',
      label: 'Application host',
      note: `${INSTALLATION.host} · 4 vCPU, 16 GB`,
      control: { kind: 'none' },
    },
    {
      id: 'db-host',
      label: 'Database host',
      note: 'preskool-db-01 · managed, daily snapshot',
      control: { kind: 'none' },
    },
    {
      id: 'cache-host',
      label: 'Cache host',
      note: 'preskool-cache-01 · Redis 7.2',
      control: { kind: 'none' },
    },
    {
      id: 'object-storage',
      label: 'Object storage',
      note: 'S3 · preskool-media · versioned',
      control: { kind: 'none' },
    },
    {
      id: 'region',
      label: 'Region',
      note: `${INSTALLATION.region} · Mumbai`,
      control: { kind: 'none' },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * 14 Health alerting                                                 *
 * ------------------------------------------------------------------ */

export const ALERTING_CARD: Card = {
  id: 'alerting',
  title: 'Alerting',
  note: 'Who is told, and when',
  icon: 'ti ti-bell-ringing',
  badge: { tone: 'is-accent', label: '2 recipients' },
  span: HALF,
  rows: [
    {
      id: 'service-down',
      label: 'Service down',
      note: 'Immediately, to the IT administrator',
      control: on(true),
    },
    {
      id: 'check-failing',
      label: 'Health check failing',
      note: 'After two consecutive failures, not the first',
      control: on(true),
    },
    {
      id: 'disk',
      label: `Disk above ${DISK_ALERT_AT}%`,
      note: `Currently at ${DISK_PERCENT}%, so not yet firing`,
      control: on(true),
    },
    {
      id: 'certificate',
      label: 'Certificate expiring',
      note: 'Thirty days ahead',
      control: on(true),
    },
    {
      id: 'channel',
      label: 'Channel',
      note: 'Email and SMS — a platform alert should reach a phone',
      control: choose('Email and SMS', 'Email only', 'SMS only'),
    },
  ],
};

/* ------------------------------------------------------------------ *
 * 15 Backups                                                         *
 * ------------------------------------------------------------------ */

export const BACKUP_CARDS: Card[] = [
  {
    id: 'schedule',
    title: 'Backup schedule',
    note: 'What runs, and where it lands',
    icon: 'ti ti-archive',
    badge: { tone: 'is-up', label: 'Nightly' },
    span: HALF,
    rows: [
      {
        id: 'automatic',
        label: 'Automatic backup',
        note: 'Every night at 02:00',
        control: on(true),
      },
      {
        id: 'contents',
        label: 'Contents',
        note: 'Database, uploaded files and configuration',
        control: choose('Database, files, config', 'Database only', 'Everything including logs'),
      },
      {
        id: 'destination',
        label: 'Destination',
        note: 'S3 in a second region, so a regional failure is survivable',
        control: choose('S3 · ap-southeast-1', 'S3 · same region', 'Local disk'),
      },
      {
        id: 'encryption',
        label: 'Encryption',
        note: 'A key separate from the application key',
        control: on(true),
      },
      {
        id: 'verify',
        label: 'Verify after writing',
        note: 'The archive is opened and checked, not just written',
        control: on(true),
      },
    ],
  },
  {
    id: 'restore',
    title: 'Retention & restore',
    note: 'How far back you can actually go',
    icon: 'ti ti-history',
    badge: { tone: 'is-warn', label: 'Never tested' },
    span: HALF,
    foot: 'The restore drill is the single largest gap here',
    rows: [
      { id: 'daily', label: 'Daily backups kept', note: 'Rolling', control: typed('30') },
      { id: 'weekly', label: 'Weekly archives kept', note: 'One a week', control: typed('12') },
      { id: 'yearly', label: 'Yearly archives', note: 'Kept indefinitely', control: on(true) },
      {
        id: 'target',
        label: 'Restore target',
        note: 'Staging first, always — never straight to production',
        control: choose('Staging first', 'Direct to production'),
      },
      {
        id: 'drill',
        label: 'Last restore drill',
        note: 'Never run — a backup nobody has restored is a hope, not a backup',
        control: plain('Never'),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 16 Updates                                                         *
 * ------------------------------------------------------------------ */

export const UPDATE_POLICY_CARD: Card = {
  id: 'update-policy',
  title: 'Update policy',
  note: 'What the platform may do on its own',
  icon: 'ti ti-settings-automation',
  badge: { tone: 'is-accent', label: 'Manual' },
  span: HALF,
  rows: [
    {
      id: 'automatic',
      label: 'Automatic updates',
      note: 'Off — a school ERP does not update itself mid-term',
      control: on(false),
    },
    {
      id: 'security',
      label: 'Security patches',
      note: 'Applied within 72 hours, in the maintenance window',
      control: on(true),
    },
    {
      id: 'channel',
      label: 'Update channel',
      note: 'Stable',
      control: choose('Stable', 'Beta', 'Long-term support'),
    },
    {
      id: 'notify',
      label: 'Notify on release',
      note: 'To the IT administrator',
      control: on(true),
    },
    {
      id: 'rollback',
      label: 'Rollback window',
      note: 'Seven days after a minor release',
      control: typed('7'),
    },
  ],
};

export const VERSION_CARD: Card = {
  id: 'versions',
  title: 'Version history',
  note: 'What has been installed here',
  icon: 'ti ti-versions',
  badge: { tone: 'is-accent', label: `${RELEASES.length} releases` },
  span: HALF,
  foot: 'Installed 08 Sep 2025',
  rows: RELEASES.map((release) => ({
    id: release.id,
    label: release.version,
    note: release.note,
    control: release.tag ? plain(release.tag) : { kind: 'none' as const },
  })),
};

/* ------------------------------------------------------------------ *
 * 17 Licensing                                                       *
 * ------------------------------------------------------------------ */

export const LICENCE_CARDS: Card[] = [
  {
    id: 'licence',
    title: 'Licence',
    note: 'What this installation is entitled to',
    icon: 'ti ti-license',
    badge: { tone: 'is-up', label: 'Valid' },
    span: HALF,
    rows: [
      {
        id: 'key',
        label: 'Licence key',
        note: 'Bound to the installation ID',
        control: plain('PRSK-••••-22A8'),
      },
      {
        id: 'type',
        label: 'Type',
        note: 'Extended · multi-school',
        control: choose('Extended · multi-school', 'Regular · single school'),
      },
      {
        id: 'schools',
        label: 'Schools permitted',
        note: 'Three of five used',
        control: reading(`${SCHOOLS.length} / 5`),
      },
      {
        id: 'users',
        label: 'Users permitted',
        note: 'Unlimited on this tier',
        control: plain('Unlimited'),
      },
      {
        id: 'valid',
        label: 'Valid until',
        note: 'Perpetual — support renews separately',
        control: reading('Perpetual'),
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & updates',
    note: 'What runs out, and when',
    icon: 'ti ti-lifebuoy',
    badge: { tone: 'is-warn', label: 'Expires in 68 days' },
    span: HALF,
    foot: 'Renewal not yet raised with the trust office',
    rows: [
      {
        id: 'plan',
        label: 'Support plan',
        note: 'Business · 8 hour response',
        control: choose('Business', 'Standard', 'Enterprise'),
      },
      {
        id: 'entitlement',
        label: 'Update entitlement',
        note: 'Until 08 Oct 2026',
        control: reading('68 days'),
      },
      {
        id: 'after',
        label: 'After expiry',
        note: 'The platform keeps working; new versions stop arriving',
        control: { kind: 'none' },
      },
      {
        id: 'renewal',
        label: 'Renewal',
        note: 'Handled by the trust office, not from here',
        control: plain('Off-platform'),
      },
      {
        id: 'remind',
        label: 'Remind before expiry',
        note: 'Days ahead',
        control: typed('30'),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 18 Advanced                                                        *
 * ------------------------------------------------------------------ */

export const EXPERIMENTAL_CARD: Card = {
  id: 'experimental',
  title: 'Experimental features',
  note: 'Not for production, and off here',
  icon: 'ti ti-flask',
  badge: { tone: 'is-warn', label: 'Off in production' },
  span: HALF,
  rows: [
    {
      id: 'timetable',
      label: 'New timetable engine',
      note: 'On in staging since June, no issues logged',
      control: on(false),
    },
    {
      id: 'streaming',
      label: 'Streaming report generation',
      note: 'Would remove the wait on large report runs',
      control: on(false),
    },
    {
      id: 'replica',
      label: 'Read replica routing',
      note: 'Requires a replica, which is not provisioned',
      control: on(false),
    },
    { id: 'api-v2', label: 'API v2', note: 'Not released', control: on(false) },
  ],
};
