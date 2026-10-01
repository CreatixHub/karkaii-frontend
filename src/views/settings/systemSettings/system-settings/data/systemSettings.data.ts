/* ------------------------------------------------------------------ *
 * 1. The installation                                                *
 * ------------------------------------------------------------------ */

export const INSTALLATION = {
  name: 'PreSkool',
  url: 'https://preskool.edu',
  adminPath: '/admin',
  support: 'it@preskool.edu',
  id: 'PRSK-9F41-22A8',
  environment: 'Production',
  region: 'ap-south-1',
  host: 'preskool-app-01',
  uptimeDays: 46,
  build: '4.8.2+2091',
  version: '4.8.2',
  lastUpdate: '31 Jul 2026, 02:14',
};

export const USERS = 6214;
export const SCHOOLS = ['Global International', 'Sunrise Public', 'Riverside Academy'];

/* ------------------------------------------------------------------ *
 * 2. Platform services                                               *
 * ------------------------------------------------------------------ */

export type ServiceState = 'Running' | 'Degraded' | 'Stopped';

export interface Service {
  id: string;
  name: string;
  icon: string;
  note: string;
  version: string;
  state: ServiceState;
  /** Percent of the last thirty days the service answered. */
  uptime: string;
  /**
   * Days in the last thirty on which something happened, 0 being the oldest.
   * A day the strip does not name was clean.
   */
  outages: { day: number; level: 'is-warn' | 'is-down' }[];
  restarted: string;
}

export const UPTIME_DAYS = 30;

export const SERVICES: Service[] = [
  {
    id: 'application',
    name: 'Application',
    icon: 'ti ti-app-window',
    note: 'preskool-app-01 · php-fpm 8.3',
    version: '4.8.2',
    state: 'Running',
    uptime: '100%',
    outages: [],
    restarted: 'Restarted 46 days ago',
  },
  {
    id: 'database',
    name: 'Database',
    icon: 'ti ti-database',
    note: 'MySQL 8.0.36 · primary',
    version: '8.0.36',
    state: 'Running',
    uptime: '100%',
    outages: [],
    restarted: 'Restarted 46 days ago',
  },
  {
    id: 'scheduler',
    name: 'Scheduler',
    icon: 'ti ti-clock-play',
    note: 'cron · every minute',
    version: '—',
    state: 'Running',
    uptime: '100%',
    outages: [],
    restarted: 'Restarted 46 days ago',
  },
  {
    id: 'queue',
    name: 'Queue worker',
    icon: 'ti ti-list-check',
    note: '4 workers · redis driver',
    version: '—',
    state: 'Degraded',
    uptime: '99.4%',
    outages: [
      { day: 26, level: 'is-warn' },
      { day: 27, level: 'is-warn' },
    ],
    restarted: 'Restarted 2 hours ago',
  },
  {
    id: 'email',
    name: 'Email service',
    icon: 'ti ti-mail',
    note: 'Amazon SES · ap-south-1',
    version: 'v2',
    state: 'Running',
    uptime: '100%',
    outages: [],
    restarted: 'Restarted 11 Jun 2026',
  },
  {
    id: 'sms',
    name: 'SMS service',
    icon: 'ti ti-message-2',
    note: 'MSG91 · transactional',
    version: 'v5',
    state: 'Running',
    uptime: '99.9%',
    outages: [{ day: 28, level: 'is-warn' }],
    restarted: 'Restarted 14 Jan 2026',
  },
  {
    id: 'storage',
    name: 'Object storage',
    icon: 'ti ti-cloud',
    note: 'S3 · preskool-media',
    version: '—',
    state: 'Running',
    uptime: '100%',
    outages: [],
    restarted: 'Restarted 46 days ago',
  },
  {
    id: 'search',
    name: 'Search service',
    icon: 'ti ti-search',
    note: 'Meilisearch · 12 indexes',
    version: '1.8.0',
    state: 'Running',
    uptime: '99.7%',
    outages: [{ day: 21, level: 'is-down' }],
    restarted: 'Restarted 9 days ago',
  },
  {
    id: 'api',
    name: 'API service',
    icon: 'ti ti-api',
    note: 'REST v1 · 4 consumers',
    version: 'v1',
    state: 'Running',
    uptime: '100%',
    outages: [],
    restarted: 'Restarted 46 days ago',
  },
  {
    id: 'ai',
    name: 'AI services',
    icon: 'ti ti-brain',
    note: 'Inference endpoint · batch nightly',
    version: '2.1.0',
    state: 'Stopped',
    uptime: '73.2%',
    outages: Array.from({ length: 8 }, (_, index) => ({
      day: 22 + index,
      level: 'is-down' as const,
    })),
    restarted: 'Restarted 4 days ago',
  },
];

/** A service that is answering at all, however well. */
export const OPERATIONAL = SERVICES.filter((service) => service.state !== 'Stopped').length;

export const serviceTone = (state: ServiceState) =>
  ({ Running: 'is-up', Degraded: 'is-warn', Stopped: 'is-down' })[state];

/** The card's own LED takes the same reading as its badge. */
export const ledTone = (state: ServiceState) =>
  ({ Running: '', Degraded: 'is-warn', Stopped: 'is-down' })[state];

/** The thirty little bars, with the outage days marked. */
export const stripOf = (service: Service) =>
  Array.from({ length: UPTIME_DAYS }, (_, day) => {
    const outage = service.outages.find((entry) => entry.day === day);
    return { day, level: outage?.level ?? '' };
  });

/* ------------------------------------------------------------------ *
 * 3. Storage                                                         *
 * ------------------------------------------------------------------ */

export interface Partition {
  id: string;
  label: string;
  /** Gigabytes. */
  size: number;
  /** The colour the bar and its key both take. */
  tone: string;
}

export const VOLUME_PATH = '/var/preskool';
export const VOLUME_GB = 500;

export const PARTITIONS: Partition[] = [
  { id: 'application', label: 'Application', size: 46, tone: 'is-app' },
  { id: 'media', label: 'Media', size: 128, tone: 'is-media' },
  { id: 'database', label: 'Database', size: 94, tone: 'is-db' },
  { id: 'logs', label: 'Logs', size: 62, tone: 'is-logs' },
  { id: 'backups', label: 'Backups', size: 82, tone: 'is-backup' },
  { id: 'free', label: 'Free', size: 88, tone: 'is-free' },
];

/**
 * The first band carries no label — at 9% of the bar there is no room for one,
 * which is why the template leaves it empty and names it in the key instead.
 */
export const LABEL_BAND_AT = 10;

export const FREE_GB = PARTITIONS.find((part) => part.id === 'free')?.size ?? 0;
export const USED_GB = VOLUME_GB - FREE_GB;
export const DISK_PERCENT = Math.round((USED_GB / VOLUME_GB) * 100);

/** Each partition's width, the same arithmetic as the gauge. */
export const partitionPercent = (part: Partition) => Math.round((part.size / VOLUME_GB) * 100);

/** Where the platform starts saying something about the disk. */
export const DISK_ALERT_AT = 85;

/** Where the nav's light turns amber, ahead of the alert. */
export const DISK_WARN_AT = 80;

export const STORAGE_ADVICE =
  'Logs are the fastest-growing partition and the easiest to reclaim. Reducing log retention from 90 days to 30 would return roughly 40 GB and cost nothing that is looked at.';

export const MEASURED_AT = 'Measured 31 Jul 2026, 02:14';

/* ------------------------------------------------------------------ *
 * 4. Cache stores                                                    *
 * ------------------------------------------------------------------ */

export type StoreState = 'Warm' | 'Live' | 'Cold' | 'Empty';

export interface CacheStore {
  id: string;
  label: string;
  size: string;
  note: string;
  /** Null where a store has no hit rate to report. */
  hitRate: number | null;
  state: StoreState;
}

export const CACHE_STORES: CacheStore[] = [
  {
    id: 'configuration',
    label: 'Configuration',
    size: '1.2 MB',
    note: 'Compiled settings · rebuilt at deploy only',
    hitRate: 100,
    state: 'Warm',
  },
  {
    id: 'routes',
    label: 'Routes and views',
    size: '8.4 MB',
    note: 'Compiled templates · rebuilt at deploy only',
    hitRate: 100,
    state: 'Warm',
  },
  {
    id: 'queries',
    label: 'Query results',
    size: '412 MB',
    note: 'Read queries · 60 second lifetime',
    hitRate: 94,
    state: 'Warm',
  },
  {
    id: 'sessions',
    label: 'Sessions',
    size: '86 MB',
    note: '1,284 active sessions',
    hitRate: null,
    state: 'Live',
  },
  {
    id: 'reports',
    label: 'Report data',
    size: '1.8 GB',
    note: 'Generated reports · 24 hour lifetime',
    hitRate: 61,
    state: 'Cold',
  },
  {
    id: 'ai',
    label: 'AI inference',
    size: '0 MB',
    note: 'Empty — the AI service is stopped',
    hitRate: null,
    state: 'Empty',
  },
];

export const storeTone = (state: StoreState) =>
  ({ Warm: 'is-up', Live: 'is-accent', Cold: 'is-warn', Empty: '' })[state];

export const hitRateLabel = (rate: number | null) => `${rate === null ? '—' : `${rate}%`} hit rate`;

export const CACHE_ADVICE = [
  {
    id: 'one-at-a-time',
    title: 'Clear one store at a time',
    detail: 'Each store below can be cleared on its own.',
  },
  {
    id: 'window',
    title: 'Prefer the maintenance window',
    detail: '02:00 to 04:00, when fewer than five people are signed in.',
  },
];

export const CACHE_WARNING =
  'Clearing everything at once forces every subsequent request to rebuild from the database. On a school-day morning that is felt immediately by everyone signing in.';

export const LAST_FULL_CLEAR = 'Last full clear 14 Jun 2026';

/* ------------------------------------------------------------------ *
 * 5. Background jobs                                                 *
 * ------------------------------------------------------------------ */

export type JobStatus = 'Healthy' | 'Attention' | 'Failing';

export interface Job {
  id: string;
  name: string;
  when: string;
  lastRun: string;
  status: JobStatus;
}

export const WORKERS_TOTAL = 4;
export const WORKERS_RESPONDING = 3;
export const QUEUE_DEPTH = 214;
export const FAILED_JOBS = 4;

export const JOBS: Job[] = [
  {
    id: 'email',
    name: 'Send queued email',
    when: 'every minute',
    lastRun: 'Last run 2 sec ago · 18,204 today',
    status: 'Healthy',
  },
  {
    id: 'sms',
    name: 'Send queued SMS',
    when: 'every minute',
    lastRun: 'Last run 2 sec ago · 4,182 today',
    status: 'Healthy',
  },
  {
    id: 'reports',
    name: 'Generate report cards',
    when: 'on demand',
    lastRun: 'Last run 4 hours ago · 96 this term',
    status: 'Healthy',
  },
  {
    id: 'backup',
    name: 'Nightly database backup',
    when: '02:00 daily',
    lastRun: 'Last run 10 hours ago · 30 kept',
    status: 'Healthy',
  },
  {
    id: 'reconcile',
    name: 'Reconcile bank settlements',
    when: '06:30 daily',
    lastRun: 'Last run 19 hours ago · 2 unmatched',
    status: 'Attention',
  },
  {
    id: 'purge',
    name: 'Purge temporary files',
    when: '03:00 daily',
    lastRun: 'Last run 11 hours ago · 1.2 GB freed',
    status: 'Healthy',
  },
  {
    id: 'reindex',
    name: 'Rebuild search indexes',
    when: '03:30 weekly',
    lastRun: 'Last run 4 days ago · 12 indexes',
    status: 'Healthy',
  },
  {
    id: 'ai-batch',
    name: 'AI nightly batch',
    when: '01:00 daily',
    lastRun: 'Last run failed 4 days ago · —',
    status: 'Failing',
  },
];

export const jobTone = (status: JobStatus) =>
  ({ Healthy: 'is-up', Attention: 'is-warn', Failing: 'is-down' })[status];

export const WORKER_NOTE = 'Worker 4 stopped responding at 00:12';

/* ------------------------------------------------------------------ *
 * 6. Maintenance                                                     *
 * ------------------------------------------------------------------ */

export const MAINTENANCE_OFF_NOTE = `Turning it on signs everyone out and shows a holding page to all ${USERS.toLocaleString('en-US')} users across ${SCHOOLS.length} schools. Only allow-listed addresses keep access. This is not reversible from a phone, so it is worth being at a desk.`;

export interface ManualAction {
  id: string;
  title: string;
  detail: string;
  label: string;
}

export const MANUAL_ACTIONS: ManualAction[] = [
  {
    id: 'cache',
    title: 'Clear a cache store',
    detail: 'Safe at any time; a store rebuilds itself on the next request.',
    label: 'Clear',
  },
  {
    id: 'reindex',
    title: 'Rebuild search indexes',
    detail: 'Takes about four minutes, during which search returns partial results.',
    label: 'Rebuild',
  },
  {
    id: 'workers',
    title: 'Restart the queue workers',
    detail: 'Rolling, so nothing in flight is lost, but scheduled jobs pause briefly.',
    label: 'Restart',
  },
  {
    id: 'restore',
    title: 'Restore a configuration backup',
    detail: 'Replaces every setting on this page. Needs a second approver.',
    label: 'Restore',
  },
];

/* ------------------------------------------------------------------ *
 * 7. Security scanning                                               *
 * ------------------------------------------------------------------ */

export interface Check {
  id: string;
  title: string;
  detail: string;
  tone: '' | 'is-warn' | 'is-down';
}

export const SCANS: Check[] = [
  {
    id: 'dependencies',
    title: 'Dependency scan — no known vulnerabilities',
    detail: 'Ran 31 Jul against 214 packages.',
    tone: '',
  },
  {
    id: 'integrity',
    title: 'File integrity — nothing modified outside a deploy',
    detail: 'Checked hourly against the deployed manifest.',
    tone: '',
  },
  {
    id: 'uploads',
    title: 'Upload scanning — 8,412 files scanned this month',
    detail: 'Two rejected, both mislabelled executables.',
    tone: '',
  },
  {
    id: 'pentest',
    title: 'Penetration test is 14 months old',
    detail: 'Policy asks for one a year. The last report closed with no high findings.',
    tone: 'is-warn',
  },
];

export const LAST_SCAN = 'Last full scan 31 Jul 2026, 02:40';

/* ------------------------------------------------------------------ *
 * 8. The platform log                                                *
 * ------------------------------------------------------------------ */

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  at: string;
  level: LogLevel;
  message: string;
}

export const LOG_TOTAL = 214908;
export const LOG_RETENTION_DAYS = 90;

export const LOG: LogEntry[] = [
  {
    id: 'g1',
    at: '2026-07-31 02:14:02',
    level: 'info',
    message: 'configuration published by latha.rao · 4 settings changed',
  },
  {
    id: 'g2',
    at: '2026-07-31 02:04:11',
    level: 'info',
    message: 'nightly backup completed · 2.4 GB · 6 min 12 s',
  },
  {
    id: 'g3',
    at: '2026-07-31 03:00:00',
    level: 'info',
    message: 'temporary file purge freed 1.2 GB',
  },
  {
    id: 'g4',
    at: '2026-07-31 06:31:40',
    level: 'warn',
    message: 'bank reconciliation: 2 entries unmatched · queued for review',
  },
  {
    id: 'g5',
    at: '2026-07-27 01:00:14',
    level: 'error',
    message: 'ai.batch.nightly failed · inference endpoint refused connection',
  },
  {
    id: 'g6',
    at: '2026-07-27 01:05:14',
    level: 'error',
    message: 'ai.batch.nightly failed · attempt 2 of 3',
  },
  {
    id: 'g7',
    at: '2026-07-31 00:12:08',
    level: 'warn',
    message: 'queue worker 4 stopped responding · jobs redistributed',
  },
  {
    id: 'g8',
    at: '2026-07-15 02:00:00',
    level: 'info',
    message: 'search indexes rebuilt · 12 indexes · 3 min 48 s',
  },
  {
    id: 'g9',
    at: '2026-07-31 02:14:00',
    level: 'warn',
    message: `disk usage ${DISK_PERCENT}% · alert threshold is ${DISK_ALERT_AT}%`,
  },
  {
    id: 'g10',
    at: '2026-06-15 09:20:31',
    level: 'info',
    message: 'platform upgraded 4.8.1 to 4.8.2 · 4 min downtime',
  },
];

const countLevel = (level: LogLevel) => LOG.filter((entry) => entry.level === level).length;

/** The three chips over the log, counted from the entries under them. */
export const LOG_CHIPS = [
  { id: 'info', tone: 'is-up', label: `${countLevel('info')} info` },
  { id: 'warn', tone: 'is-warn', label: `${countLevel('warn')} warn` },
  { id: 'error', tone: 'is-down', label: `${countLevel('error')} error` },
];

export const logTone = (level: LogLevel) =>
  ({ info: '', warn: 'is-warn', error: 'is-down' })[level];

export const LOG_FOOT = 'Times are Asia/Kolkata · logs are written in UTC';

/* ------------------------------------------------------------------ *
 * 9. API                                                             *
 * ------------------------------------------------------------------ */

export interface ApiKey {
  id: string;
  label: string;
  scope: string;
  ageDays: number;
}

/** A key older than the rotation policy is the one the badge counts. */
export const ROTATION_DAYS = 180;

export const API_KEYS: ApiKey[] = [
  { id: 'reporting', label: 'Reporting integration', scope: 'Read-only', ageDays: 214 },
  { id: 'accounting', label: 'Accounting export', scope: 'Read-only', ageDays: 46 },
  { id: 'mobile', label: 'Mobile application', scope: 'Read and write', ageDays: 90 },
];

export const keyOverdue = (key: ApiKey) => key.ageDays > ROTATION_DAYS;
export const OVERDUE_KEYS = API_KEYS.filter(keyOverdue).length;
export const REVOKED_KEYS = 3;

/** Active keys are the ones held plus the revoked count the card prints. */
export const ACTIVE_KEYS = API_KEYS.length + 1;

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  note: string;
  consumers: string;
  live: boolean;
}

export const ENDPOINTS: Endpoint[] = [
  {
    id: 'students',
    method: 'GET',
    path: '/api/v1/students',
    note: 'Read student records · scoped by school',
    consumers: '4 consumers',
    live: true,
  },
  {
    id: 'attendance',
    method: 'GET',
    path: '/api/v1/attendance',
    note: 'Daily attendance · read only',
    consumers: '2 consumers',
    live: true,
  },
  {
    id: 'payment',
    method: 'POST',
    path: '/api/v1/fees/payment',
    note: 'Record an offline payment',
    consumers: '1 consumer',
    live: true,
  },
  {
    id: 'summary',
    method: 'GET',
    path: '/api/v1/reports/summary',
    note: 'Aggregate figures · no personal data',
    consumers: '3 consumers',
    live: true,
  },
  {
    id: 'payment-callback',
    method: 'POST',
    path: '/hooks/payment/callback',
    note: 'Gateway settlement callback · signed',
    consumers: 'MSG91, Razorpay',
    live: true,
  },
  {
    id: 'sms-dlr',
    method: 'POST',
    path: '/hooks/sms/dlr',
    note: 'SMS delivery receipts · signed',
    consumers: 'MSG91',
    live: true,
  },
  {
    id: 'v2',
    method: 'GET',
    path: '/api/v2/*',
    note: 'Not released — v1 remains supported',
    consumers: 'None',
    live: false,
  },
];

/* ------------------------------------------------------------------ *
 * 10. Integrations                                                   *
 * ------------------------------------------------------------------ */

export interface Integration {
  id: string;
  label: string;
  note: string;
  connected: boolean;
}

export const INTEGRATIONS: Integration[] = [
  { id: 'ses', label: 'Amazon SES', note: 'Outbound email · ap-south-1', connected: true },
  { id: 'msg91', label: 'MSG91', note: 'Outbound SMS · transactional route', connected: true },
  { id: 'razorpay', label: 'Razorpay', note: 'Fee collection · production keys', connected: true },
  { id: 'meili', label: 'Meilisearch', note: 'Search · self-hosted', connected: true },
  {
    id: 'ai',
    label: 'AI inference endpoint',
    note: 'Stopped since 27 Jul',
    connected: false,
  },
  { id: 'sentry', label: 'Sentry', note: 'Error reporting', connected: true },
];

export const CONNECTED_INTEGRATIONS = INTEGRATIONS.filter((entry) => entry.connected).length;
export const STOPPED_INTEGRATIONS = INTEGRATIONS.length - CONNECTED_INTEGRATIONS;

/* ------------------------------------------------------------------ *
 * 11. Environment                                                    *
 * ------------------------------------------------------------------ */

export const RUNTIME_COMMAND = 'preskool@app-01:~$ php artisan about';

export const RUNTIME = [
  ['Environment', 'production'],
  ['PHP', '8.3.9'],
  ['Laravel', '11.14.0'],
  ['Database', 'mysql 8.0.36'],
  ['Cache', 'redis 7.2.4'],
  ['Queue', 'redis'],
  ['Session', 'redis'],
  ['Storage', 's3 (ap-south-1)'],
  ['Debug', 'false'],
  ['Maintenance', 'false'],
];

/** The template pads each key with dots to a fixed width. */
export const RUNTIME_WIDTH = 18;
export const runtimeLine = ([key, value]: string[]) =>
  `${key} ${'.'.repeat(Math.max(1, RUNTIME_WIDTH - key.length))} ${value}`;

export const ENV_VARS = [
  'APP_ENV=production',
  'APP_DEBUG=false',
  'APP_URL=https://preskool.edu',
  'DB_CONNECTION=mysql',
  'CACHE_STORE=redis',
  'QUEUE_CONNECTION=redis',
  'SESSION_DRIVER=redis',
  'FILESYSTEM_DISK=s3',
  'APP_KEY=∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗',
  'DB_PASSWORD=∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗',
];

export const CONSOLE_COMMANDS = [
  'php artisan cache:clear',
  'php artisan queue:restart',
  'php artisan scout:reindex',
  'php artisan backup:run',
  'php artisan schedule:list',
];

/* ------------------------------------------------------------------ *
 * 12. Health                                                         *
 * ------------------------------------------------------------------ */

export interface HealthCheck {
  id: string;
  title: string;
  detail: string;
  passing: boolean;
}

export const HEALTH_INTERVAL = 60;

export const HEALTH: HealthCheck[] = [
  {
    id: 'app',
    title: 'Application responds',
    detail: '186 ms average over the last hour.',
    passing: true,
  },
  {
    id: 'db',
    title: 'Database reachable',
    detail: '12 ms, 14 of 40 connections in use.',
    passing: true,
  },
  {
    id: 'cache',
    title: 'Cache reachable',
    detail: 'Redis 7.2.4, 512 MB of 2 GB used.',
    passing: true,
  },
  {
    id: 'storage',
    title: 'Object storage writable',
    detail: 'Test object written and removed.',
    passing: true,
  },
  {
    id: 'scheduler',
    title: 'Scheduler ran in the last two minutes',
    detail: 'Last tick 41 seconds ago.',
    passing: true,
  },
  {
    id: 'workers',
    title: 'Queue workers',
    detail: 'Three of four responding. Worker 4 stopped at 00:12.',
    passing: false,
  },
  {
    id: 'mail',
    title: 'Mail transport accepts',
    detail: 'SES returned 250 on a balance probe.',
    passing: true,
  },
  {
    id: 'sms',
    title: 'SMS gateway accepts',
    detail: 'MSG91 returned 200 with a credit balance.',
    passing: true,
  },
  {
    id: 'ai',
    title: 'AI inference endpoint',
    detail: 'Connection refused since 27 Jul. Nightly batch has not run in four days.',
    passing: false,
  },
  {
    id: 'tls',
    title: 'TLS certificate valid',
    detail: 'Expires 14 Nov 2026, renewal automatic at 30 days.',
    passing: true,
  },
  {
    id: 'backup',
    title: 'Backup ran in the last 24 hours',
    detail: 'Completed 02:04 today, 2.4 GB.',
    passing: true,
  },
];

export const HEALTH_PASSING = HEALTH.filter((check) => check.passing).length;
export const HEALTH_FAILING = HEALTH.length - HEALTH_PASSING;

export const AVAILABILITY = '99.94%';
export const AVAILABILITY_NOTE =
  'One interruption, on 22 July, when the search service restarted after an index rebuild ran out of memory. Four minutes, outside school hours, nobody signed in.';

/* ------------------------------------------------------------------ *
 * 13. Backups                                                        *
 * ------------------------------------------------------------------ */

export type BackupState = 'Verified' | 'Slow' | 'Verified · kept 1 year';

export interface Backup {
  id: string;
  at: string;
  kind: string;
  detail: string;
  state: BackupState;
}

export const BACKUPS: Backup[] = [
  {
    id: 'b1',
    at: '31 Jul 2026, 02:04',
    kind: 'Full',
    detail: '2.4 GB · took 6 min 12 s · stored in ap-southeast-1',
    state: 'Verified',
  },
  {
    id: 'b2',
    at: '30 Jul 2026, 02:04',
    kind: 'Full',
    detail: '2.4 GB · took 6 min 04 s · stored in ap-southeast-1',
    state: 'Verified',
  },
  {
    id: 'b3',
    at: '29 Jul 2026, 02:04',
    kind: 'Full',
    detail: '2.3 GB · took 5 min 58 s · stored in ap-southeast-1',
    state: 'Verified',
  },
  {
    id: 'b4',
    at: '28 Jul 2026, 02:04',
    kind: 'Full',
    detail: '2.3 GB · took 6 min 21 s · stored in ap-southeast-1',
    state: 'Verified',
  },
  {
    id: 'b5',
    at: '27 Jul 2026, 02:04',
    kind: 'Full',
    detail: '2.3 GB · took 9 min 44 s · stored in ap-southeast-1',
    state: 'Slow',
  },
  {
    id: 'b6',
    at: '24 Jul 2026, 02:04',
    kind: 'Weekly archive',
    detail: '2.2 GB · took 6 min 02 s · stored in ap-southeast-1',
    state: 'Verified · kept 1 year',
  },
];

export const backupTone = (state: BackupState) => (state === 'Slow' ? 'is-warn' : 'is-up');

export const RESTORE_GAP = 'The restore drill is the single largest gap here';

/* ------------------------------------------------------------------ *
 * 14. Updates                                                        *
 * ------------------------------------------------------------------ */

export const AVAILABLE_VERSION = '4.9.0';
export const RELEASED_ON = '22 Jul 2026';
export const UPGRADE_WINDOW = '16 Aug 2026, 02:00';

export const UPGRADE_NOTES: Check[] = [
  {
    id: 'api',
    title: 'No breaking API changes',
    detail: 'v1 endpoints are unchanged.',
    tone: '',
  },
  {
    id: 'host',
    title: 'Runs on the current PHP and database versions',
    detail: 'No host change needed.',
    tone: '',
  },
  {
    id: 'staging',
    title: 'Tested on staging for 7 days',
    detail: 'Refreshed from a production copy on 24 July.',
    tone: '',
  },
  {
    id: 'downtime',
    title: 'Estimated 4 minutes of downtime',
    detail: 'Scheduled for the maintenance window on 16 Aug.',
    tone: '',
  },
];

export interface Release {
  id: string;
  version: string;
  note: string;
  tag: string;
}

export const RELEASES: Release[] = [
  { id: 'r482', version: '4.8.2', note: 'Installed 15 Jun 2026 · 4 min downtime', tag: 'Current' },
  { id: 'r481', version: '4.8.1', note: 'Installed 02 Apr 2026 · 6 min downtime', tag: '' },
  { id: 'r480', version: '4.8.0', note: 'Installed 14 Jan 2026 · 22 min downtime', tag: '' },
  { id: 'r474', version: '4.7.4', note: 'Installed 08 Sep 2025 · first install', tag: 'Install' },
];

/* ------------------------------------------------------------------ *
 * 15. The hero                                                       *
 * ------------------------------------------------------------------ */

export const DRAFTS = 2;

/**
 * What the warning badge counts: the services not running, plus the release
 * waiting to be taken.
 */
export const NEEDS_ATTENTION =
  SERVICES.filter((service) => service.state !== 'Running').length + 1;

/* ------------------------------------------------------------------ *
 * 16. Audit and activity                                             *
 * ------------------------------------------------------------------ */

export interface AuditEntry {
  id: string;
  date: string;
  time: string;
  what: string;
  who: string;
}

export const AUDIT_TOTAL = 1842;

export const AUDIT: AuditEntry[] = [
  {
    id: 's1',
    date: '31 Jul 2026',
    time: '02:14',
    what: 'Configuration published · 4 settings',
    who: 'latha.rao · from 103.21.58.14',
  },
  {
    id: 's2',
    date: '31 Jul 2026',
    time: '00:12',
    what: 'Queue worker 4 stopped responding',
    who: 'System · jobs redistributed automatically',
  },
  {
    id: 's3',
    date: '27 Jul 2026',
    time: '01:00',
    what: 'AI inference endpoint became unreachable',
    who: 'System · nightly batch has not run since',
  },
  {
    id: 's4',
    date: '22 Jul 2026',
    time: '03:41',
    what: 'Search service restarted after an out-of-memory failure',
    who: 'System · 4 minutes unavailable',
  },
  {
    id: 's5',
    date: '15 Jun 2026',
    time: '09:20',
    what: 'Platform upgraded 4.8.1 to 4.8.2',
    who: 'latha.rao · 4 minutes of planned downtime',
  },
  {
    id: 's6',
    date: '02 Jun 2026',
    time: '14:02',
    what: 'Log retention raised from 30 to 90 days',
    who: 'r.venkatesh · the origin of the current disk pressure',
  },
  {
    id: 's7',
    date: '14 Apr 2026',
    time: '11:30',
    what: 'Backup destination moved to a second region',
    who: 'latha.rao · ap-southeast-1',
  },
  {
    id: 's8',
    date: '08 Sep 2025',
    time: '10:00',
    what: 'Platform installed',
    who: 'r.venkatesh · version 4.7.4',
  },
];

export interface Milestone {
  id: string;
  title: string;
  at: string;
  detail: string;
  icon: string;
}

export const TIMELINE: Milestone[] = [
  {
    id: 'installed',
    title: 'Platform installed',
    at: '08 Sep 2025, 10:00',
    detail:
      'Version 4.7.4 on a single host in ap-south-1, with one school and 1,240 users.',
    icon: 'ti ti-server-cog',
  },
  {
    id: 'retention',
    title: 'Configuration updated',
    at: '02 Jun 2026, 14:02',
    detail:
      'Log retention raised from 30 to 90 days. This is where the current disk pressure begins.',
    icon: 'ti ti-adjustments',
  },
  {
    id: 'maintenance',
    title: 'Maintenance enabled',
    at: '15 Jun 2026, 09:16',
    detail:
      'Four minutes of planned downtime for the 4.8.2 upgrade, taken in the nightly window.',
    icon: 'ti ti-tool',
  },
  {
    id: 'backup',
    title: 'Backup completed',
    at: '31 Jul 2026, 02:04',
    detail:
      '2.4 GB written to a second region and verified by opening the archive, not merely by writing it.',
    icon: 'ti ti-archive',
  },
  {
    id: 'optimised',
    title: 'System optimised',
    at: '31 Jul 2026, 03:00',
    detail:
      'Temporary files purged, expired sessions cleared and tables optimised. 1.2 GB reclaimed.',
    icon: 'ti ti-broom',
  },
  {
    id: 'published',
    title: 'Configuration published',
    at: '31 Jul 2026, 02:14',
    detail:
      'Four settings published, two more still held as drafts. The drafts are not in effect anywhere.',
    icon: 'ti ti-rocket',
  },
];

/* ------------------------------------------------------------------ *
 * 17. Recommendations                                                *
 * ------------------------------------------------------------------ */

export interface Advice {
  id: string;
  area: string;
  title: string;
  detail: string;
  severity: 'Act now' | 'Soon';
  action: string;
  /** Which section the button jumps to. */
  goTo: SectionId;
}

export const RECOMMENDATIONS: Advice[] = [
  {
    id: 'ai-service',
    area: 'Availability',
    title: 'Bring the AI service back or switch the module off',
    detail:
      'The inference endpoint has refused connections since 27 July and the nightly batch has not run in four days. Insights shown to teachers are now four days stale without saying so, which is worse than showing nothing.',
    severity: 'Act now',
    action: 'Open services',
    goTo: 'platform',
  },
  {
    id: 'restore-drill',
    area: 'Backups',
    title: 'Run a restore drill',
    detail:
      'Thirty daily backups exist and every one verified on write. None has ever been restored. A backup nobody has restored is a hope rather than a backup, and staging exists precisely so this can be tested without risk.',
    severity: 'Act now',
    action: 'Open backups',
    goTo: 'backups',
  },
  {
    id: 'log-retention',
    area: 'Storage',
    title: 'Reduce log retention to 30 days',
    detail: `Disk is at ${DISK_PERCENT}% against an ${DISK_ALERT_AT}% alert. Logs hold 62 GB and were raised from 30 to 90 days in June for a specific investigation that has since closed. Reverting it returns roughly 40 GB immediately.`,
    severity: 'Soon',
    action: 'Open retention',
    goTo: 'storage',
  },
  {
    id: 'worker-4',
    area: 'Jobs',
    title: 'Restart queue worker 4',
    detail:
      'It stopped responding at 00:12 and the other three have absorbed its work, so nothing is queued behind it. It will not recover on its own, and three workers is thinner cover than intended.',
    severity: 'Soon',
    action: 'Open jobs',
    goTo: 'jobs',
  },
  {
    id: 'upgrade',
    area: 'Updates',
    title: `Take ${AVAILABLE_VERSION} in the August window`,
    detail:
      'It has run on staging for a week without incident, needs four minutes of downtime and is reversible for seven days. Waiting past the term start makes the same upgrade harder to schedule.',
    severity: 'Soon',
    action: 'Open updates',
    goTo: 'updates',
  },
];

export const adviceTone = (severity: Advice['severity']) =>
  severity === 'Act now' ? 'is-down' : 'is-warn';

/* ------------------------------------------------------------------ *
 * 18. The sections                                                   *
 * ------------------------------------------------------------------ */

export type SectionId =
  | 'general'
  | 'application'
  | 'platform'
  | 'performance'
  | 'storage'
  | 'cache'
  | 'jobs'
  | 'maintenance'
  | 'security'
  | 'logging'
  | 'api'
  | 'integrations'
  | 'environment'
  | 'health'
  | 'backups'
  | 'updates'
  | 'licensing'
  | 'advanced'
  | 'audit';

export interface Section {
  id: SectionId;
  label: string;
  icon: string;
  title: string;
  lead: string;
  /** The nav's group heading, printed above the first section in the group. */
  group?: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'general',
    label: 'General',
    icon: 'ti ti-adjustments',
    title: 'General',
    lead: 'What the installation calls itself, and the defaults it hands down.',
    group: 'Application',
  },
  {
    id: 'application',
    label: 'Application',
    icon: 'ti ti-app-window',
    title: 'Application',
    lead: 'Tenancy, feature flags and what the application will accept.',
  },
  {
    id: 'platform',
    label: 'Platform',
    icon: 'ti ti-server-cog',
    title: 'Platform Services',
    lead: `${SERVICES.length} services and ${UPTIME_DAYS} days of history for each.`,
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: 'ti ti-rocket',
    title: 'Performance',
    lead: 'Where the time goes, and what is given up under load.',
    group: 'Runtime',
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: 'ti ti-database',
    title: 'Storage',
    lead: `${USED_GB} GB of ${VOLUME_GB} GB, and what is on it.`,
  },
  {
    id: 'cache',
    label: 'Cache',
    icon: 'ti ti-bolt',
    title: 'Cache',
    lead: 'What is held in memory, and what clearing it costs.',
  },
  {
    id: 'jobs',
    label: 'Background Jobs',
    icon: 'ti ti-list-check',
    title: 'Background Jobs',
    lead: 'What runs on its own, and what is failing.',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: 'ti ti-tool',
    title: 'Maintenance',
    lead: 'Taking the platform away, and putting it back.',
    group: 'Operations',
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'ti ti-shield-lock',
    title: 'Security',
    lead: 'Transport, access, secrets and what checks itself.',
  },
  {
    id: 'logging',
    label: 'Logging',
    icon: 'ti ti-file-text',
    title: 'Logging',
    lead: 'What is written, kept and alerted on.',
  },
  {
    id: 'api',
    label: 'API Services',
    icon: 'ti ti-api',
    title: 'API Services',
    lead: 'How the platform is reached from outside.',
    group: 'Interfaces',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'ti ti-plug-connected',
    title: 'Integrations',
    lead: 'What the platform talks to, and what may call in.',
  },
  {
    id: 'environment',
    label: 'Environment',
    icon: 'ti ti-cloud',
    title: 'Environment',
    lead: 'What the platform is actually running on.',
    group: 'Infrastructure',
  },
  {
    id: 'health',
    label: 'System Health',
    icon: 'ti ti-activity-heartbeat',
    title: 'System Health',
    lead: `${HEALTH.length} checks, every sixty seconds.`,
  },
  {
    id: 'backups',
    label: 'Backups',
    icon: 'ti ti-archive',
    title: 'Backups',
    lead: 'What is kept, and whether it has ever been restored.',
  },
  {
    id: 'updates',
    label: 'Updates',
    icon: 'ti ti-refresh',
    title: 'Updates',
    lead: `${AVAILABLE_VERSION} is available and has been on staging for a week.`,
  },
  {
    id: 'licensing',
    label: 'Licensing',
    icon: 'ti ti-license',
    title: 'Licensing',
    lead: 'What this installation is entitled to, and for how long.',
    group: 'Records',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: 'ti ti-terminal-2',
    title: 'Advanced',
    lead: 'Environment variables, experimental flags and the reset switch.',
  },
  {
    id: 'audit',
    label: 'Audit History',
    icon: 'ti ti-file-search',
    title: 'Audit History',
    lead: 'Every change, with the account against it.',
  },
];

/**
 * The little light beside a nav entry. Four sections carry a warning one, and
 * each has a reason the register can answer rather than a class typed in.
 */
export const navTone = (id: SectionId) => {
  if (id === 'platform') {
    return SERVICES.some((service) => service.state !== 'Running') ? 'is-warn' : '';
  }
  if (id === 'storage') return DISK_PERCENT >= DISK_WARN_AT ? 'is-warn' : '';
  if (id === 'integrations') return STOPPED_INTEGRATIONS > 0 ? 'is-warn' : '';
  if (id === 'updates') return AVAILABLE_VERSION !== INSTALLATION.version ? 'is-warn' : '';
  return '';
};

/* ------------------------------------------------------------------ *
 * The resource gauges in the nav's foot                              *
 * ------------------------------------------------------------------ */

export const RESOURCES = [
  { id: 'cpu', label: 'CPU', percent: 34, tone: '' },
  { id: 'memory', label: 'Memory', percent: 61, tone: '' },
  { id: 'disk', label: 'Disk', percent: DISK_PERCENT, tone: 'is-warn' },
];

/** "Section 07" — the nav's own order, two digits the way the template prints it. */
export const sectionNumber = (id: SectionId) =>
  String(SECTIONS.findIndex((section) => section.id === id) + 1).padStart(2, '0');
