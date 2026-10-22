/* ------------------------------------------------------------------ *
 * 1. Providers                                                       *
 * ------------------------------------------------------------------ */

export type ProviderState = 'Connected' | 'Idle' | 'Disconnected' | 'Not connected' | 'Via Local AI' | 'Empty';

export interface Provider {
  id: string;
  name: string;
  icon: string;
  endpoint: string;
  /** What the card says the provider is for. */
  note: string;
  state: ProviderState;
  auth: string;
  models: string[];
  enabled: boolean;
}

export const PROVIDERS: Provider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: 'ti ti-brain',
    endpoint: 'api.anthropic.com/v1',
    note: '',
    state: 'Connected',
    auth: 'API key · sk-ant-••••7K2a',
    models: ['claude-sonnet-4', 'claude-haiku-4'],
    enabled: true,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'ti ti-circle-dashed',
    endpoint: 'api.openai.com/v1',
    note: 'Used by the report generator only',
    state: 'Connected',
    auth: 'API key · sk-••••91cX',
    models: ['gpt-4o', 'gpt-4o-mini'],
    enabled: true,
  },
  {
    id: 'azure',
    name: 'Azure OpenAI',
    icon: 'ti ti-brand-windows',
    endpoint: 'karkaii.openai.azure.com',
    note: 'Standby — the failover route',
    state: 'Connected',
    auth: 'Managed identity',
    models: ['gpt-4o (azure)'],
    enabled: true,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: 'ti ti-brand-google',
    endpoint: 'generativelanguage.googleapis.com',
    note: 'Configured, not routed to anything',
    state: 'Idle',
    auth: 'Service account',
    models: ['gemini-1.5-pro'],
    enabled: true,
  },
  {
    id: 'local',
    name: 'Local AI',
    icon: 'ti ti-cpu',
    endpoint: 'ollama.karkaii.local:11434',
    note: 'On-premise — nothing leaves the building',
    state: 'Connected',
    auth: 'None — trusted network',
    models: ['llama-3.1-8b'],
    enabled: true,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: 'ti ti-diamond',
    endpoint: 'api.mistral.ai/v1',
    note: 'Evaluated in June, not adopted',
    state: 'Disconnected',
    auth: 'Key removed',
    models: [],
    enabled: false,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'ti ti-fish',
    endpoint: 'api.deepseek.com',
    note: 'Not connected — no data agreement in place',
    state: 'Not connected',
    auth: 'None',
    models: [],
    enabled: false,
  },
  {
    id: 'meta',
    name: 'Meta Llama',
    icon: 'ti ti-brand-meta',
    endpoint: 'Hosted by the local runtime',
    note: 'Served through Local AI rather than directly',
    state: 'Via Local AI',
    auth: 'None',
    models: [],
    enabled: false,
  },
  {
    id: 'custom',
    name: 'Custom provider',
    icon: 'ti ti-plug',
    endpoint: 'Any OpenAI-compatible endpoint',
    note: 'Nothing configured yet',
    state: 'Empty',
    auth: 'None',
    models: [],
    enabled: false,
  },
];

/** Which provider everything goes to unless a feature names another. */
export const DEFAULT_PROVIDER = PROVIDERS[0];
export const FALLBACK_PROVIDER = 'Azure OpenAI';

/** A provider carrying traffic is one that is switched on. */
export const CONNECTED_COUNT = PROVIDERS.filter((provider) => provider.enabled).length;

export const providerTone = (state: ProviderState) =>
  ({
    Connected: 'is-on',
    Idle: 'is-warn',
    Disconnected: 'is-off',
    'Not connected': 'is-off',
    'Via Local AI': 'is-off',
    Empty: 'is-off',
  })[state];

/* ------------------------------------------------------------------ *
 * 2. Models                                                          *
 * ------------------------------------------------------------------ */

export type ModelState = 'Active' | 'Standby' | 'Idle';

export interface Model {
  id: string;
  provider: string;
  purpose: string;
  state: ModelState;
  /** Thousands of tokens. */
  window: number;
  typical: number;
  reserve: number;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  /**
   * The two settings only the workspace shows. The template opens the workspace
   * for one model, so these carry that model's values on every model rather
   * than inventing a different pair per row.
   */
  topP: number;
  timeout: number;
  /** When the model was first configured, as the workspace prints it. */
  configured: string;
  /** The model's own trail, where the template gives it one. */
  history?: { id: string; date: string; time: string; what: string; who: string }[];
  /** The month so far, where the template gives a model its own figures. */
  usage?: {
    tokens: number;
    requests: number;
    latency: string;
    failureRate: string;
    cost: string;
  };
}

export const MODELS: Model[] = [
  {
    id: 'claude-sonnet-4',
    provider: 'Anthropic',
    purpose: 'General reasoning · the default for most features',
    state: 'Active',
    window: 200,
    typical: 14,
    reserve: 8,
    temperature: 0.7,
    maxTokens: 4096,
    enabled: true,
    topP: 0.9,
    timeout: 45,
    configured: '14 January 2026',
    history: [
      { id: 'h1', date: '31 Jul 2026', time: '09:04', what: 'Set as the default model', who: 'latha.rao' },
      {
        id: 'h2',
        date: '22 Jul 2026',
        time: '11:40',
        what: 'Teacher remarks removed from its inputs',
        who: 'latha.rao',
      },
      {
        id: 'h3',
        date: '04 Jun 2026',
        time: '15:00',
        what: 'Temperature lowered from 0.9 to 0.7',
        who: 'Academic committee',
      },
      { id: 'h4', date: '14 Jan 2026', time: '11:00', what: 'Model configured', who: 'r.venkatesh' },
    ],
    usage: {
      tokens: 7.4,
      requests: 26140,
      latency: '2.4 s',
      failureRate: '0.4%',
      cost: '₹11,280',
    },
  },
  {
    id: 'claude-haiku-4',
    provider: 'Anthropic',
    purpose: 'Short, high-volume work — notifications and summaries',
    state: 'Active',
    window: 200,
    typical: 6,
    reserve: 4,
    temperature: 0.4,
    maxTokens: 1024,
    enabled: true,
    topP: 0.9,
    timeout: 45,
    configured: '14 January 2026',
  },
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    purpose: 'Report generation, where long structured output is wanted',
    state: 'Active',
    window: 128,
    typical: 22,
    reserve: 14,
    temperature: 0.6,
    maxTokens: 8192,
    enabled: true,
    topP: 0.9,
    timeout: 45,
    configured: '18 February 2026',
  },
  {
    id: 'gpt-4o-mini',
    provider: 'OpenAI',
    purpose: 'Cheap fallback for the notification assistant',
    state: 'Active',
    window: 128,
    typical: 8,
    reserve: 5,
    temperature: 0.5,
    maxTokens: 2048,
    enabled: true,
    topP: 0.9,
    timeout: 45,
    configured: '18 February 2026',
  },
  {
    id: 'gpt-4o (azure)',
    provider: 'Azure OpenAI',
    purpose: 'The failover route — identical model, different tenancy',
    state: 'Standby',
    window: 128,
    typical: 0,
    reserve: 0,
    temperature: 0.6,
    maxTokens: 8192,
    enabled: true,
    topP: 0.9,
    timeout: 45,
    configured: '06 March 2026',
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'Google Gemini',
    purpose: 'Configured but not routed to any feature',
    state: 'Idle',
    window: 1000,
    typical: 0,
    reserve: 0,
    temperature: 0.7,
    maxTokens: 8192,
    enabled: false,
    topP: 0.9,
    timeout: 45,
    configured: '21 April 2026',
  },
  {
    id: 'llama-3.1-8b',
    provider: 'Local AI',
    purpose: 'On-premise — used where nothing may leave the building',
    state: 'Active',
    window: 128,
    typical: 4,
    reserve: 2,
    temperature: 0.3,
    maxTokens: 2048,
    enabled: true,
    topP: 0.9,
    timeout: 45,
    configured: '18 May 2026',
  },
];

export const DEFAULT_MODEL = MODELS[0];

/**
 * The context ruler's two channels: how much of the window a typical request
 * occupies, and how much is held back for the reply.
 */
export const rulerOf = (model: Model) => ({
  p: Math.round((model.typical / model.window) * 100),
  q: Math.round((model.reserve / model.window) * 100),
});

/**
 * The temperature dial. The template's own arithmetic scales the value by 90
 * and truncates, which is why 0.7 fills 62 rather than 63.
 */
export const TEMPERATURE_SCALE = 90;
export const TEMPERATURE_MAX = 2;
export const temperaturePercent = (temperature: number) =>
  Math.floor(temperature * TEMPERATURE_SCALE);

/** The output dial runs against the largest output any model here allows. */
export const MAX_TOKENS_CEILING = 16384;
export const MAX_TOKENS_FLOOR = 256;
export const maxTokensPercent = (tokens: number) =>
  Math.floor((tokens / MAX_TOKENS_CEILING) * 100);

/** Top-p runs 0 to 1, so its dial is the value itself. */
export const TOP_P_MAX = 1;
export const topPPercent = (value: number) => Math.round((value / TOP_P_MAX) * 100);

/** The timeout dial runs between its own ends rather than from zero. */
export const TIMEOUT_FLOOR = 10;
export const TIMEOUT_CEILING = 120;
export const timeoutPercent = (seconds: number) =>
  Math.round(((seconds - TIMEOUT_FLOOR) / (TIMEOUT_CEILING - TIMEOUT_FLOOR)) * 100);

export const modelTone = (state: ModelState) =>
  ({ Active: 'is-on', Standby: 'is-on', Idle: 'is-warn' })[state];

export const tokens = (count: number) => count.toLocaleString('en-US');

/* ------------------------------------------------------------------ *
 * 3. Features                                                        *
 * ------------------------------------------------------------------ */

export interface Feature {
  id: string;
  name: string;
  icon: string;
  note: string;
  /** The model id this feature is routed to. */
  model: string;
  audience: string;
  enabled: boolean;
}

export const FEATURES: Feature[] = [
  {
    id: 'attendance',
    name: 'Attendance Intelligence',
    icon: 'ti ti-calendar-stats',
    note: 'Patterns in absence, flagged before they become chronic',
    model: 'claude-sonnet-4',
    audience: 'Staff',
    enabled: true,
  },
  {
    id: 'risk',
    name: 'Risk Detection',
    icon: 'ti ti-alert-triangle',
    note: 'Students whose trajectory is worth a conversation',
    model: 'claude-sonnet-4',
    audience: 'Staff',
    enabled: true,
  },
  {
    id: 'student-intelligence',
    name: 'Student Intelligence',
    icon: 'ti ti-user-search',
    note: 'A single read across every record a student has',
    model: 'claude-sonnet-4',
    audience: 'Staff',
    enabled: true,
  },
  {
    id: 'homework',
    name: 'Homework Evaluation',
    icon: 'ti ti-notebook',
    note: 'Draft feedback for a teacher to correct and sign',
    model: 'claude-sonnet-4',
    audience: 'Teachers',
    enabled: true,
  },
  {
    id: 'timetable',
    name: 'Timetable Optimization',
    icon: 'ti ti-table',
    note: 'Clash-free arrangements, ranked by teacher load',
    model: 'claude-sonnet-4',
    audience: 'Academic Head',
    enabled: true,
  },
  {
    id: 'teacher-productivity',
    name: 'Teacher Productivity',
    icon: 'ti ti-chalkboard',
    note: 'How a teaching week was actually spent',
    model: 'claude-sonnet-4',
    audience: 'Teachers',
    enabled: true,
  },
  {
    id: 'parent-insights',
    name: 'Parent Insights',
    icon: 'ti ti-users',
    note: 'A weekly note to a guardian, in plain language',
    model: 'claude-haiku-4',
    audience: 'Staff',
    enabled: true,
  },
  {
    id: 'report-generator',
    name: 'Report Generator',
    icon: 'ti ti-file-analytics',
    note: 'Structured reports built from the records supplied',
    model: 'gpt-4o',
    audience: 'Staff',
    enabled: true,
  },
  {
    id: 'notification-assistant',
    name: 'Notification Assistant',
    icon: 'ti ti-bell',
    note: 'Drafts a message from an intent, for a person to send',
    model: 'claude-haiku-4',
    audience: 'Staff',
    enabled: true,
  },
  {
    id: 'student-assistant',
    name: 'Student Assistant',
    icon: 'ti ti-school',
    note: 'Study guidance for a student, inside their own record only',
    model: 'llama-3.1-8b',
    audience: 'Students',
    enabled: false,
  },
];

export const ENABLED_FEATURES = FEATURES.filter((feature) => feature.enabled).length;

/** Which features a model actually carries. */
export const featuresOnModel = (modelId: string) =>
  FEATURES.filter((feature) => feature.model === modelId);

/** Which features a provider carries, across all of its models. */
export const featuresOnProvider = (providerName: string) => {
  const owned = MODELS.filter((model) => model.provider === providerName).map((model) => model.id);
  return FEATURES.filter((feature) => owned.includes(feature.model));
};

/* ------------------------------------------------------------------ *
 * 4. Prompt templates                                                *
 * ------------------------------------------------------------------ */

export type PromptState = 'Published' | 'Draft';

export interface Prompt {
  id: string;
  name: string;
  /** The feature id this template serves. */
  feature: string;
  version: number;
  state: PromptState;
  system: string;
  /** The task, with `{{variable}}` markers the page renders as `<var>`. */
  task: string;
}

export const PROMPTS: Prompt[] = [
  {
    id: 'academic-assistant',
    name: 'Academic Assistant',
    feature: 'student-intelligence',
    version: 4,
    state: 'Published',
    system:
      'You are an assistant to a school administrator. Answer only from the records provided. If a record does not contain the answer, say so rather than inferring it.',
    task: 'Summarise the academic position of {{student}} in Class {{class}} for term {{term}}. Name the two subjects most worth attention and say why.',
  },
  {
    id: 'attendance-analysis',
    name: 'Attendance Analysis',
    feature: 'attendance',
    version: 6,
    state: 'Published',
    system:
      'Report patterns, not predictions about individuals. Never characterise a family or a reason for absence.',
    task: 'Given the attendance record for {{class}} across {{period}}, identify absence patterns worth a conversation. Exclude documented medical leave.',
  },
  {
    id: 'risk-detection',
    name: 'Risk Detection',
    feature: 'risk',
    version: 9,
    state: 'Published',
    system:
      'Findings are advisory. Always state what evidence supports a finding and what would contradict it.',
    task: 'Review {{student}} across attendance, marks, homework and fee status for {{period}}. State the concern, the evidence, and one action a teacher could take this week.',
  },
  {
    id: 'homework-evaluation',
    name: 'Homework Evaluation',
    feature: 'homework',
    version: 5,
    state: 'Published',
    system: 'You draft feedback for a teacher to correct and sign. You never award a mark.',
    task: 'Read the submission for {{assignment}} against the rubric supplied. Draft feedback of at most 80 words, addressed to the student, naming one strength and one specific improvement.',
  },
  {
    id: 'teacher-summary',
    name: 'Teacher Summary',
    feature: 'teacher-productivity',
    version: 3,
    state: 'Published',
    system: 'Describe how time was spent. Do not rank teachers or compare one to another.',
    task: 'Summarise the teaching week for {{teacher}}: periods taught, substitutions covered, marking outstanding. Note anything unusual against their own previous four weeks.',
  },
  {
    id: 'parent-summary',
    name: 'Parent Summary',
    feature: 'parent-insights',
    version: 7,
    state: 'Published',
    system:
      'Write to a guardian, in plain language, without jargon or abbreviations. Never mention another student.',
    task: 'Write a weekly note to the guardian of {{student}} covering attendance, one piece of work worth mentioning and anything upcoming. At most 120 words.',
  },
  {
    id: 'report-generator',
    name: 'Report Generator',
    feature: 'report-generator',
    version: 2,
    state: 'Draft',
    system:
      'Produce structured output only. Every figure must come from the data supplied; do not compute new ones.',
    task: 'Generate the {{report_type}} report for {{scope}} covering {{period}}, using the section order in the template provided.',
  },
  {
    id: 'student-guidance',
    name: 'Student Guidance',
    feature: 'student-assistant',
    version: 1,
    state: 'Draft',
    system:
      'You are speaking to a school student. Be encouraging and concrete. Never discuss another student, staff, fees or discipline.',
    task: 'Suggest a study plan for {{student}} for the coming week, based only on their own marks and homework record.',
  },
];

/** What a template's "Used by" line reads — the feature it serves. */
export const featureNameOf = (featureId: string) =>
  FEATURES.find((feature) => feature.id === featureId)?.name ?? featureId;

export const PROMPT_FOOTNOTE = 'Variables are filled from the record at run time';

/**
 * Splits a task into plain text and `{{variable}}` markers so the page can wrap
 * the markers in `<var>` the way the template does.
 */
export const promptParts = (task: string) =>
  task.split(/(\{\{[a-z_]+\}\})/).map((piece, index) => ({
    id: index,
    text: piece,
    isVariable: piece.startsWith('{{'),
  }));

/* ------------------------------------------------------------------ *
 * 5. Automation                                                      *
 * ------------------------------------------------------------------ */

export type AutomationStatus = 'Healthy' | 'Slow' | 'Failing' | 'Paused';

export interface Automation {
  id: string;
  name: string;
  /** When it goes — a clock time, or the event that sets it off. */
  when: string;
  kind: 'Scheduled' | 'Event-driven' | 'On submission';
  note: string;
  lastRun: string;
  status: AutomationStatus;
  enabled: boolean;
}

export const AUTOMATIONS: Automation[] = [
  {
    id: 'attendance-analysis',
    name: 'Attendance analysis',
    when: '11:15 daily, after the register locks',
    kind: 'Scheduled',
    note: 'Findings go to the class teacher. Nothing is sent to a guardian.',
    lastRun: 'Today, 11:15',
    status: 'Healthy',
    enabled: true,
  },
  {
    id: 'daily-reports',
    name: 'Daily reports',
    when: '18:00 daily',
    kind: 'Scheduled',
    note: 'A one-page summary for the Principal, drafted and held for reading.',
    lastRun: 'Today, 18:00',
    status: 'Healthy',
    enabled: true,
  },
  {
    id: 'weekly-intelligence',
    name: 'Weekly intelligence',
    when: '07:00 Monday',
    kind: 'Scheduled',
    note: 'Cross-module read for the academic committee.',
    lastRun: 'Mon, 07:00',
    status: 'Healthy',
    enabled: true,
  },
  {
    id: 'risk-monitoring',
    name: 'Risk monitoring',
    when: 'On a third unexplained absence',
    kind: 'Event-driven',
    note: 'Raises a case for review; never contacts a family directly.',
    lastRun: '2 hours ago',
    status: 'Healthy',
    enabled: true,
  },
  {
    id: 'homework-review',
    name: 'Homework review',
    when: 'Within an hour of a submission',
    kind: 'On submission',
    note: 'Drafts feedback for the teacher to correct and sign.',
    lastRun: '38 minutes ago',
    status: 'Healthy',
    enabled: true,
  },
  {
    id: 'fee-forecast',
    name: 'Fee forecast',
    when: '02:30 daily',
    kind: 'Scheduled',
    note: 'Projects collection against the term target for the accounts desk.',
    lastRun: 'Today, 02:31 · 14 min',
    status: 'Slow',
    enabled: true,
  },
  {
    id: 'parent-summaries',
    name: 'Parent summaries',
    when: '16:00 Friday',
    kind: 'Scheduled',
    note: 'Held: every summary is read by the class teacher before it is sent, and the queue is 84 deep.',
    lastRun: 'Not run',
    status: 'Paused',
    enabled: false,
  },
  {
    id: 'teacher-insights',
    name: 'Teacher insights',
    when: '07:00 Monday',
    kind: 'Scheduled',
    note: 'Failing since the AI service stopped. It will resume on its own once the service returns.',
    lastRun: 'Failed 4 days ago',
    status: 'Failing',
    enabled: true,
  },
];

/** An automation is running if it is switched on and not failing. */
export const RUNNING_AUTOMATIONS = AUTOMATIONS.filter(
  (job) => job.enabled && job.status !== 'Failing',
).length;

export const FAILING_AUTOMATIONS = AUTOMATIONS.filter((job) => job.status === 'Failing').length;

/** What the hero's warning badge counts: anything slow or failing. */
export const NEEDS_ATTENTION = AUTOMATIONS.filter(
  (job) => job.status === 'Slow' || job.status === 'Failing',
).length;

export const automationTone = (status: AutomationStatus) =>
  ({ Healthy: 'is-on', Slow: 'is-warn', Failing: 'is-stop', Paused: '' })[status];

export const automationRowTone = (status: AutomationStatus) =>
  ({ Healthy: '', Slow: 'is-warn', Failing: 'is-stop', Paused: 'is-off' })[status];

/* ------------------------------------------------------------------ *
 * 6. Permissions                                                     *
 * ------------------------------------------------------------------ */

export type Grant = 'yes' | 'limited' | 'no';

export interface Role {
  id: string;
  name: string;
  note: string;
  /** Read a finding · act on it · change a prompt · change a provider. */
  grants: [Grant, Grant, Grant, Grant];
}

export const PERMISSION_COLUMNS = ['Read', 'Act', 'Prompts', 'Providers'];

export const ROLES: Role[] = [
  {
    id: 'super-admin',
    name: 'Super Administrator',
    note: 'Configures everything on this page',
    grants: ['yes', 'yes', 'yes', 'yes'],
  },
  {
    id: 'principal',
    name: 'Principal',
    note: 'Reads every finding; approves policy changes',
    grants: ['yes', 'yes', 'limited', 'no'],
  },
  {
    id: 'academic-head',
    name: 'Academic Head',
    note: 'Timetable, homework and academic intelligence',
    grants: ['yes', 'yes', 'limited', 'no'],
  },
  {
    id: 'class-teacher',
    name: 'Class teacher',
    note: 'Their own classes only',
    grants: ['yes', 'limited', 'no', 'no'],
  },
  {
    id: 'subject-teacher',
    name: 'Subject teacher',
    note: 'Their own subject and sections',
    grants: ['yes', 'limited', 'no', 'no'],
  },
  {
    id: 'accounts',
    name: 'Accounts',
    note: 'Fee forecast and collection intelligence only',
    grants: ['limited', 'limited', 'no', 'no'],
  },
  {
    id: 'guardian',
    name: 'Guardian',
    note: 'Summaries about their own child, once a teacher has read them',
    grants: ['limited', 'no', 'no', 'no'],
  },
  {
    id: 'student',
    name: 'Student',
    note: 'Study guidance within their own record',
    grants: ['limited', 'no', 'no', 'no'],
  },
];

export const grantTone = (grant: Grant) =>
  ({ yes: 'is-yes', limited: 'is-limited', no: '' })[grant];

export const grantIcon = (grant: Grant) =>
  ({ yes: 'ti ti-check', limited: 'ti ti-alert-triangle', no: 'ti ti-minus' })[grant];

export const PERMISSION_LEGEND = [
  { id: 'yes', grant: 'yes' as Grant, label: 'Permitted' },
  { id: 'limited', grant: 'limited' as Grant, label: 'Within their own scope only' },
  { id: 'no', grant: 'no' as Grant, label: 'Not permitted' },
];

export const PERMISSION_FOOT =
  'Nobody below Super Administrator may change a provider, including the Principal';

/* ------------------------------------------------------------------ *
 * 7. Guardrails                                                      *
 * ------------------------------------------------------------------ */

export interface Guardrail {
  id: string;
  rule: string;
  detail: string;
  tone: '' | 'is-warn';
}

export const GUARDRAILS: Guardrail[] = [
  {
    id: 'no-comparison',
    rule: 'Never compares one named student with another',
    detail: 'Enforced in every system prompt, not left to the model.',
    tone: '',
  },
  {
    id: 'no-family',
    rule: 'Never comments on a family circumstance',
    detail: 'Even where the record contains one.',
    tone: '',
  },
  {
    id: 'no-discipline',
    rule: 'Never produces a disciplinary recommendation',
    detail: 'Discipline is a human judgement with a right of reply.',
    tone: '',
  },
  {
    id: 'no-prediction',
    rule: 'Never predicts an outcome for an individual',
    detail: 'Patterns across a cohort, not a forecast about a child.',
    tone: '',
  },
  {
    id: 'safeguarding',
    rule: 'Safeguarding content routes to the local model',
    detail: 'And raises a flag rather than producing an answer.',
    tone: 'is-warn',
  },
];

/**
 * The template's badge reads "7 active" over five listed rules — the other two
 * are the moderation checks that refuse rather than rewrite, counted here.
 */
export const ACTIVE_GUARDRAILS = 7;

export const GUARDRAIL_REVIEW = 'Reviewed by the academic committee, 04 Jun 2026';

/* ------------------------------------------------------------------ *
 * 8. Usage                                                           *
 * ------------------------------------------------------------------ */

/** Millions of tokens. */
export const TOKENS_USED = 12.8;
export const TOKEN_CEILING = 20;
export const REQUESTS = 41204;
export const COST_SO_FAR = '₹18,420';
export const COST_PROJECTED = '₹24,900';

export const USED_PERCENT = Math.round((TOKENS_USED / TOKEN_CEILING) * 100);

export interface Spend {
  id: string;
  label: string;
  note: string;
  /** Millions of tokens. */
  used: number;
}

export const SPEND: Spend[] = [
  {
    id: 'report-generator',
    label: 'Report Generator',
    note: 'long structured output',
    used: 4.1,
  },
  {
    id: 'homework',
    label: 'Homework Evaluation',
    note: 'one call per submission',
    used: 3.2,
  },
  { id: 'risk', label: 'Risk Detection', note: 'cross-module reads', used: 2.1 },
  { id: 'student-intelligence', label: 'Student Intelligence', note: '', used: 1.6 },
  {
    id: 'rest',
    label: 'Everything else',
    note: `across ${FEATURES.length - 4} features`,
    used: 1.8,
  },
];

/** Each line's share of the month, which is why the five add to a hundred. */
export const shareOf = (used: number) => Math.round((used / TOKENS_USED) * 100);

export const millions = (value: number) => `${value.toFixed(1)}M`;

/** The alert fires here; the card prints the current figure beside it. */
export const ALERT_AT = 80;

/* ------------------------------------------------------------------ *
 * 9. Logs                                                            *
 * ------------------------------------------------------------------ */

export type LogKind = 'run' | 'refuse' | 'slow' | 'error' | 'config';

export interface LogEntry {
  id: string;
  kind: LogKind;
  detail: string;
  at: string;
}

export const LOG: LogEntry[] = [
  {
    id: 'l1',
    kind: 'run',
    detail: 'attendance.analysis · claude-sonnet-4 · 1,204 tokens · 2.1 s',
    at: '2026-07-31 11:15:04',
  },
  {
    id: 'l2',
    kind: 'run',
    detail: 'attendance.analysis · 38 classes read · names masked',
    at: '2026-07-31 11:15:02',
  },
  {
    id: 'l3',
    kind: 'refuse',
    detail: 'guardrail: output named a second student · regenerated',
    at: '2026-07-31 10:42:18',
  },
  {
    id: 'l4',
    kind: 'run',
    detail: 'homework.evaluation · claude-sonnet-4 · 842 tokens',
    at: '2026-07-31 10:20:55',
  },
  {
    id: 'l5',
    kind: 'slow',
    detail: 'fee.forecast took 14 min against a 20 min ceiling',
    at: '2026-07-31 02:31:40',
  },
  {
    id: 'l6',
    kind: 'error',
    detail: 'teacher.insights failed · provider endpoint refused connection',
    at: '2026-07-27 07:00:12',
  },
  {
    id: 'l7',
    kind: 'config',
    detail: 'default model changed to claude-sonnet-4 by latha.rao',
    at: '2026-07-31 09:04:02',
  },
  {
    id: 'l8',
    kind: 'refuse',
    detail: 'input outside scope: accounts asked for attendance · logged',
    at: '2026-07-30 15:22:31',
  },
  {
    id: 'l9',
    kind: 'run',
    detail: 'daily.report · gpt-4o · 6,102 tokens · held for reading',
    at: '2026-07-30 18:00:00',
  },
  {
    id: 'l10',
    kind: 'run',
    detail: 'attendance.analysis · no findings raised',
    at: '2026-07-30 11:15:03',
  },
];

const countKind = (kind: LogKind) => LOG.filter((entry) => entry.kind === kind).length;

/** The three chips over the log, counted from the entries under them. */
export const LOG_CHIPS = [
  { id: 'runs', tone: 'is-on', label: `${countKind('run')} runs` },
  { id: 'refusals', tone: 'is-warn', label: `${countKind('refuse')} refusals` },
  { id: 'errors', tone: 'is-stop', label: `${countKind('error')} error` },
];

export const logRowTone = (kind: LogKind) =>
  ({ run: '', refuse: 'is-warn', slow: 'is-warn', error: 'is-stop', config: '' })[kind];

export const LOG_NOTE = 'A refusal is a guardrail working, not a fault';

export const RETENTION_DAYS = 90;
export const AUDIT_RETENTION_DAYS = 1095;

/* ------------------------------------------------------------------ *
 * 10. Audit history                                                  *
 * ------------------------------------------------------------------ */

export interface AuditEntry {
  id: string;
  date: string;
  time: string;
  what: string;
  who: string;
}

export const AUDIT: AuditEntry[] = [
  {
    id: 'a1',
    date: '31 Jul 2026',
    time: '09:04',
    what: 'Default model changed to claude-sonnet-4',
    who: 'latha.rao · was claude-sonnet-3.7',
  },
  {
    id: 'a2',
    date: '28 Jul 2026',
    time: '16:20',
    what: 'Parent summaries automation paused',
    who: 'Academic Head · review queue was 84 deep',
  },
  {
    id: 'a3',
    date: '27 Jul 2026',
    time: '07:00',
    what: 'Teacher insights began failing',
    who: 'System · provider endpoint unreachable',
  },
  {
    id: 'a4',
    date: '22 Jul 2026',
    time: '11:40',
    what: 'Free-text teacher remarks excluded from requests',
    who: 'latha.rao · they often name other students',
  },
  {
    id: 'a5',
    date: '04 Jun 2026',
    time: '15:00',
    what: 'Guardrails reviewed and reaffirmed',
    who: 'Academic committee · minute 2026/AC/09',
  },
  {
    id: 'a6',
    date: '18 May 2026',
    time: '10:12',
    what: 'Local AI connected for safeguarding-adjacent work',
    who: 'r.venkatesh · on-premise',
  },
  {
    id: 'a7',
    date: '02 Apr 2026',
    time: '09:30',
    what: 'Student assistant disabled pending review',
    who: 'Academic committee · still off',
  },
  {
    id: 'a8',
    date: '14 Jan 2026',
    time: '11:00',
    what: 'Anthropic connected as the default provider',
    who: 'r.venkatesh · zero-retention endpoint',
  },
];

/** Every change ever made, of which the page shows the most recent eight. */
export const AUDIT_TOTAL = 148;

export const LAST_CHANGE = { on: '31 Jul 2026', by: 'Ms. Latha Rao' };

/**
 * A model's trail. Only the default one carries a written history; every other
 * model has the one entry its configuration date states.
 */
export const historyOf = (model: Model) =>
  model.history ?? [
    {
      id: `${model.id}-configured`,
      date: model.configured,
      time: '11:00',
      what: 'Model configured',
      who: 'r.venkatesh',
    },
  ];

/* ------------------------------------------------------------------ *
 * 11. The pending publication                                        *
 * ------------------------------------------------------------------ */

export interface PendingChange {
  id: string;
  what: string;
  effect: string;
}

export const PENDING: PendingChange[] = [
  {
    id: 'report-template',
    what: 'Report generator template v2 published',
    effect: 'Would let the report generator run without a draft warning.',
  },
  {
    id: 'homework-model',
    what: 'Homework evaluation routed to claude-haiku-4',
    effect: 'Halves the largest single line of monthly spend.',
  },
  {
    id: 'alert-threshold',
    what: 'Usage alert threshold lowered to 75%',
    effect: 'Currently 80%, which leaves little room to act.',
  },
];

/** What the hero and the Publish dialog both call the draft count. */
export const DRAFT_COUNT = PENDING.length;

export const STAFF_COUNT = 96;

/* ------------------------------------------------------------------ *
 * 12. The sections                                                   *
 * ------------------------------------------------------------------ */

export type SectionId =
  | 'general'
  | 'providers'
  | 'models'
  | 'features'
  | 'prompts'
  | 'automation'
  | 'permissions'
  | 'privacy'
  | 'limits'
  | 'notifications'
  | 'moderation'
  | 'logs'
  | 'audit';

export interface Section {
  id: SectionId;
  label: string;
  icon: string;
  /** The nav's count chip, where the section has one to show. */
  count?: number;
  /** The line under the section heading. */
  lead: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'general',
    label: 'General',
    icon: 'ti ti-adjustments',
    lead: 'The switch above everything, and the line between advice and action.',
  },
  {
    id: 'providers',
    label: 'AI Providers',
    icon: 'ti ti-plug-connected',
    count: PROVIDERS.length,
    lead: `${PROVIDERS.length} configured, ${CONNECTED_COUNT} connected, one carrying traffic.`,
  },
  {
    id: 'models',
    label: 'AI Models',
    icon: 'ti ti-box-model',
    count: MODELS.length,
    lead: `${MODELS.length} models, and what each is actually asked to do.`,
  },
  {
    id: 'features',
    label: 'AI Features',
    icon: 'ti ti-sparkles',
    count: FEATURES.length,
    lead: `${FEATURES.length} features, each routed to a named model.`,
  },
  {
    id: 'prompts',
    label: 'Prompt Templates',
    icon: 'ti ti-file-text',
    count: PROMPTS.length,
    lead: `${PROMPTS.length} templates, in two parts each.`,
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: 'ti ti-robot',
    count: AUTOMATIONS.length,
    lead: 'What runs on its own, and what it is allowed to produce.',
  },
  {
    id: 'permissions',
    label: 'Permissions',
    icon: 'ti ti-lock-access',
    lead: 'Who may read a finding, act on it, or change how it is made.',
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: 'ti ti-shield-lock',
    lead: 'What leaves the building, and what comes back.',
  },
  {
    id: 'limits',
    label: 'Usage Limits',
    icon: 'ti ti-gauge',
    lead: 'Where the platform stops spending.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'ti ti-bell',
    lead: 'Who is told what, and how often.',
  },
  {
    id: 'moderation',
    label: 'Content Moderation',
    icon: 'ti ti-filter',
    lead: 'What is checked before anything reaches a person.',
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: 'ti ti-list-details',
    lead: 'Every run, refusal and configuration change.',
  },
  {
    id: 'audit',
    label: 'Audit History',
    icon: 'ti ti-file-search',
    count: AUDIT_TOTAL,
    lead: 'Every change, with the account against it.',
  },
];

/** "Section 07" — the nav's own order, two digits the way the template prints it. */
export const sectionNumber = (id: SectionId) =>
  String(SECTIONS.findIndex((section) => section.id === id) + 1).padStart(2, '0');
