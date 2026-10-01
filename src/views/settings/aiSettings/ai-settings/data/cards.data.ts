import {
  ALERT_AT,
  AUDIT_RETENTION_DAYS,
  DEFAULT_PROVIDER,
  FAILING_AUTOMATIONS,
  millions,
  RETENTION_DAYS,
  shareOf,
  SPEND,
  TOKEN_CEILING,
  USED_PERCENT,
} from './aiSettings.data';

import type { Control, PanelCard } from '../../../shared/SettingsPanelCard';

export type { Control, Row, PanelCard } from '../../../shared/SettingsPanelCard';
export { footOf } from '../../../shared/SettingsPanelCard';

/** The card shape this page uses, named for what it is here. */
export type Card = PanelCard;

const on = (value: boolean): Control => ({ kind: 'switch', on: value });
const choose = (value: string, ...rest: string[]): Control => ({
  kind: 'select',
  options: [value, ...rest],
  value,
});
const typed = (value: string): Control => ({ kind: 'input', value });

/* ------------------------------------------------------------------ *
 * Section 01 — General                                               *
 * ------------------------------------------------------------------ */

export const GENERAL_CARDS: Card[] = [
  {
    id: 'platform',
    title: 'AI across the platform',
    note: 'One switch above everything else on this page',
    icon: 'ti ti-power',
    badge: { tone: 'is-on', label: 'Enabled' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'ai-features',
        label: 'AI features',
        note: 'Off here stops every AI page and automation at once',
        control: on(true),
      },
      {
        id: 'default-provider',
        label: 'Default provider',
        note: 'Used unless a feature names another',
        control: choose(DEFAULT_PROVIDER.name, 'OpenAI', 'Azure OpenAI', 'Google Gemini'),
      },
      {
        id: 'default-model',
        label: 'Default model',
        note: 'The model a feature gets if it does not choose',
        control: choose('claude-sonnet-4', 'gpt-4o', 'gemini-1.5-pro'),
      },
      {
        id: 'fallback',
        label: 'Fallback provider',
        note: 'Used only when the default does not answer',
        control: choose('Azure OpenAI', 'OpenAI', 'None — fail instead'),
      },
      {
        id: 'attribution',
        label: 'Show AI attribution',
        note: 'Every generated passage is labelled as such, always',
        control: on(true),
      },
    ],
  },
  {
    id: 'decisions',
    title: 'What AI may decide',
    note: 'The line between a suggestion and an action',
    icon: 'ti ti-hand-stop',
    iconTone: 'is-warn',
    badge: { tone: 'is-accent', label: 'Advisory only' },
    span: 'col-12 col-xl-6',
    foot: 'These five are the governance position, not preferences',
    rows: [
      {
        id: 'act-alone',
        label: 'AI may take an action on its own',
        note: 'Off — every output is a recommendation to a person',
        control: on(false),
      },
      {
        id: 'approval',
        label: 'Human approval before sending',
        note: 'Any message drafted by AI is read before it leaves',
        control: on(true),
      },
      {
        id: 'marking',
        label: 'AI in a marking decision',
        note: 'Off — homework evaluation suggests, a teacher marks',
        control: on(false),
      },
      {
        id: 'promotion',
        label: 'AI in a promotion decision',
        note: 'Off — and it cannot be switched on from this page',
        control: on(false),
      },
      {
        id: 'accountability',
        label: 'Named accountability',
        note: 'Every acted-on suggestion records the person who accepted it',
        control: on(true),
      },
    ],
  },
  {
    id: 'transparency',
    title: 'Transparency',
    note: 'What a reader is told about how something was produced',
    icon: 'ti ti-eye',
    badge: { tone: 'is-on', label: 'Full' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'label',
        label: 'Label generated text',
        note: 'A visible mark on every AI passage',
        control: on(true),
      },
      {
        id: 'model-shown',
        label: 'Show the model used',
        note: 'On hover, on any AI output',
        control: on(true),
      },
      {
        id: 'confidence',
        label: 'Show confidence',
        note: 'Where the feature produces one',
        control: on(true),
      },
      {
        id: 'inputs',
        label: 'Explain the inputs',
        note: 'Which records were read to produce a finding',
        control: on(true),
      },
      {
        id: 'report',
        label: 'Let a user report an output',
        note: 'One click, and it lands in the moderation queue',
        control: on(true),
      },
    ],
  },
  {
    id: 'change-control',
    title: 'Who may change this',
    note: 'AI configuration is a platform permission',
    icon: 'ti ti-user-shield',
    badge: { tone: 'is-accent', label: 'Restricted' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'roles',
        label: 'Permitted roles',
        note: 'Super Administrator and the Academic Head',
        control: { kind: 'button', label: 'Manage' },
      },
      {
        id: 'second-approver',
        label: 'Second approver',
        note: 'For provider, permission and privacy changes',
        control: on(true),
      },
      {
        id: 'two-factor',
        label: 'Two-factor required',
        note: 'To publish anything on this page',
        control: on(true),
      },
      {
        id: 'notice',
        label: 'Change notice',
        note: 'Every teacher is told when AI behaviour changes',
        control: on(true),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Section 06 — Automation policy                                     *
 * ------------------------------------------------------------------ */

export const AUTOMATION_CARDS: Card[] = [
  {
    id: 'policy',
    title: 'Automation policy',
    note: 'What a scheduled run is permitted to do',
    icon: 'ti ti-robot',
    badge: { tone: 'is-accent', label: 'Draft only' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'may-send',
        label: 'Automations may send a message',
        note: 'Off — every draft waits for a person',
        control: on(false),
      },
      {
        id: 'out-of-hours',
        label: 'Run outside school hours',
        note: 'Overnight work does not compete with the school day',
        control: on(true),
      },
      {
        id: 'deep-queue',
        label: 'Skip a run if the queue is deep',
        note: 'Above 200 jobs, the run is postponed rather than queued',
        control: on(true),
      },
      {
        id: 'runtime',
        label: 'Maximum runtime',
        note: 'Minutes, before a run is abandoned',
        control: typed('20'),
      },
      {
        id: 'cost-ceiling',
        label: 'Cost ceiling per run',
        note: 'A run that would exceed this stops and reports',
        control: typed('₹400'),
      },
    ],
  },
  {
    id: 'failure',
    title: 'When a run fails',
    note: 'What happens next, and who hears about it',
    icon: 'ti ti-repeat',
    iconTone: 'is-warn',
    badge: { tone: 'is-stop', label: `${FAILING_AUTOMATIONS} failing` },
    span: 'col-12 col-xl-6',
    foot: 'Teacher insights has been failing for 4 days',
    rows: [
      {
        id: 'attempts',
        label: 'Attempts',
        note: 'Then the run is marked failed and left alone',
        control: typed('2'),
      },
      {
        id: 'retry-delay',
        label: 'Retry delay',
        note: 'Long enough for a transient outage to clear',
        control: typed('30'),
      },
      {
        id: 'fallback',
        label: 'Fall back to another provider',
        note: 'Off — a different model gives different findings',
        control: on(false),
      },
      {
        id: 'notify',
        label: 'Notify on failure',
        note: 'The IT administrator, once per automation per day',
        control: on(true),
      },
      {
        id: 'resume',
        label: 'Resume automatically',
        note: 'When the provider answers again, without anyone acting',
        control: on(true),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Section 07 — Department scope                                      *
 * ------------------------------------------------------------------ */

export const SCOPE_CARD: Card = {
  id: 'scope',
  title: 'Department scope',
  note: 'Which parts of the school each area may ask about',
  icon: 'ti ti-building',
  badge: { tone: 'is-accent', label: 'Scoped' },
  span: 'col-12 col-xl-4',
  rows: [
    {
      id: 'academics',
      label: 'Academics',
      note: 'Every student, every subject',
      control: { kind: 'none' },
    },
    {
      id: 'accounts',
      label: 'Accounts',
      note: 'Fee and collection records only — no marks, no attendance',
      control: { kind: 'none' },
    },
    {
      id: 'transport',
      label: 'Transport',
      note: 'Route and stop data only',
      control: { kind: 'none' },
    },
    {
      id: 'library',
      label: 'Library',
      note: 'Issue and return records only',
      control: { kind: 'none' },
    },
    {
      id: 'hostel',
      label: 'Hostel',
      note: 'Resident students only, and only for that school',
      control: { kind: 'none' },
    },
    {
      id: 'cross',
      label: 'Cross-department queries',
      note: 'Off — a question cannot reach outside its own scope',
      control: on(false),
    },
  ],
};

/** The scope card counts scopes, not settings. */
export const SCOPE_FOOT = `${SCOPE_CARD.rows.length} scopes`;

/* ------------------------------------------------------------------ *
 * Section 08 — Privacy                                               *
 * ------------------------------------------------------------------ */

export const PRIVACY_CARDS: Card[] = [
  {
    id: 'what-is-sent',
    title: 'What is sent to a provider',
    note: 'The single most consequential setting here',
    icon: 'ti ti-eye-off',
    iconTone: 'is-model',
    badge: { tone: 'is-on', label: 'Masked' },
    span: 'col-12 col-xl-6',
    foot: 'A provider sees a pattern, not a person',
    rows: [
      {
        id: 'names',
        label: 'Student names',
        note: 'Replaced by a reference before the request leaves',
        control: on(true),
      },
      {
        id: 'guardians',
        label: 'Guardian names and contacts',
        note: 'Never sent, under any circumstance',
        control: on(true),
      },
      {
        id: 'identifiers',
        label: 'Addresses and identifiers',
        note: 'Never sent',
        control: on(true),
      },
      { id: 'photos', label: 'Photographs', note: 'Never sent', control: on(true) },
      {
        id: 'records',
        label: 'Marks, attendance and fee status',
        note: 'Sent, against a reference rather than a name',
        control: on(true),
      },
      {
        id: 'remarks',
        label: 'Free-text teacher remarks',
        note: 'Off — they often name other students',
        control: on(false),
      },
    ],
  },
  {
    id: 'what-they-keep',
    title: 'What a provider may keep',
    note: 'And what the school insists it does not',
    icon: 'ti ti-database-off',
    badge: { tone: 'is-on', label: 'Zero retention' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'zero-retention',
        label: 'Zero-retention endpoint',
        note: 'Required — a provider without one cannot be connected',
        control: on(true),
      },
      {
        id: 'training',
        label: 'Training on school data',
        note: 'Contractually prohibited with every connected provider',
        control: on(false),
      },
      {
        id: 'provider-logs',
        label: 'Provider-side logging',
        note: 'Disabled where the provider allows it',
        control: on(true),
      },
      {
        id: 'residency',
        label: 'Data residency',
        note: 'India or on-premise only',
        control: choose('India or on-premise', 'Any region'),
      },
      {
        id: 'local-sensitive',
        label: 'Local model for sensitive work',
        note: 'Anything involving a safeguarding note stays on-premise',
        control: on(true),
      },
    ],
  },
  {
    id: 'what-we-keep',
    title: 'What the school keeps',
    note: 'Prompts, outputs and the trail between them',
    icon: 'ti ti-clock',
    badge: { tone: 'is-accent', label: `${RETENTION_DAYS} days` },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'retention',
        label: 'Prompt and output retention',
        note: 'Days, then deleted',
        control: typed(String(RETENTION_DAYS)),
      },
      {
        id: 'audit-retention',
        label: 'Audit of who asked what',
        note: 'Three academic years — separate from the content',
        control: typed(String(AUDIT_RETENTION_DAYS)),
      },
      {
        id: 'acted-on',
        label: 'Findings acted upon',
        note: 'Kept with the student record, as a decision was made on them',
        control: on(true),
      },
      {
        id: 'not-acted-on',
        label: 'Findings not acted upon',
        note: `Deleted with the rest at ${RETENTION_DAYS} days`,
        control: on(true),
      },
      {
        id: 'erasure',
        label: 'Right to erasure',
        note: 'A student record deletion removes their AI history too',
        control: on(true),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Section 09 — Ceilings and spend                                    *
 * ------------------------------------------------------------------ */

export const CEILINGS_CARD: Card = {
  id: 'ceilings',
  title: 'Ceilings',
  note: 'Where the platform stops spending',
  icon: 'ti ti-adjustments-alt',
  badge: { tone: 'is-accent', label: 'Hard stop' },
  span: 'col-12 col-xl-7',
  rows: [
    {
      id: 'token-ceiling',
      label: 'Monthly token ceiling',
      note: 'Across every provider',
      control: typed((TOKEN_CEILING * 1_000_000).toLocaleString('en-US')),
    },
    {
      id: 'cost-ceiling',
      label: 'Monthly cost ceiling',
      note: 'Whichever is reached first',
      control: typed('₹25,000'),
    },
    {
      id: 'feature-ceiling',
      label: 'Per-feature ceiling',
      note: 'No single feature may take more than this share',
      control: typed('35'),
    },
    {
      id: 'user-ceiling',
      label: 'Per-user daily requests',
      note: 'Applies to the assistant and ad-hoc queries',
      control: typed('60'),
    },
    {
      id: 'at-ceiling',
      label: 'At the ceiling',
      note: 'Refuse rather than overspend',
      control: choose('Refuse', 'Warn and continue', 'Fall back to the local model'),
    },
  ],
};

/** The spend card is the register's five lines, each showing its own share. */
export const SPEND_CARD: Card = {
  id: 'spend',
  title: 'Where it is going',
  note: `The ${SPEND.length} features that spend most`,
  icon: 'ti ti-chart-arrows',
  badge: { tone: '', label: `Top ${SPEND.length}` },
  span: 'col-12 col-xl-7',
  foot: 'Homework evaluation would halve on the haiku model',
  rows: SPEND.map((line) => ({
    id: line.id,
    label: line.label,
    note: line.note ? `${millions(line.used)} tokens · ${line.note}` : `${millions(line.used)} tokens`,
    control: { kind: 'reading', value: `${shareOf(line.used)}%` },
  })),
};

/* ------------------------------------------------------------------ *
 * Section 10 — Notifications                                         *
 * ------------------------------------------------------------------ */

export const NOTIFICATION_CARDS: Card[] = [
  {
    id: 'admins',
    title: 'What administrators are told',
    note: 'About the AI configuration itself',
    icon: 'ti ti-bell',
    badge: { tone: 'is-accent', label: '5 on' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'provider-down',
        label: 'A provider stops answering',
        note: 'Immediately, to the IT administrator',
        control: on(true),
      },
      {
        id: 'automation-fails',
        label: 'An automation fails',
        note: 'Once per automation per day, not per attempt',
        control: on(true),
      },
      {
        id: 'usage-threshold',
        label: `Usage passes ${ALERT_AT}% of the ceiling`,
        note: `Currently at ${USED_PERCENT}%`,
        control: on(true),
      },
      {
        id: 'prompt-changed',
        label: 'A prompt template is changed',
        note: 'To the Academic Head, with the diff',
        control: on(true),
      },
      {
        id: 'refusal',
        label: 'A guardrail refusal',
        note: 'Weekly digest rather than one at a time',
        control: on(true),
      },
    ],
  },
  {
    id: 'teachers',
    title: 'What teachers are told',
    note: 'About AI in their own work',
    icon: 'ti ti-message-2',
    badge: { tone: 'is-accent', label: 'Restrained' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'new-finding',
        label: 'New finding on their class',
        note: 'In the platform, not by email',
        control: choose('In-platform only', 'Email digest', 'Email each time'),
      },
      {
        id: 'draft-ready',
        label: 'Draft feedback ready to review',
        note: 'Once a day, not once per submission',
        control: on(true),
      },
      {
        id: 'behaviour-changed',
        label: 'AI behaviour changed',
        note: 'When a model, prompt or permission changes',
        control: on(true),
      },
      {
        id: 'weekly',
        label: 'Weekly AI summary',
        note: 'Off — it repeats what is already on the pages',
        control: on(false),
      },
    ],
  },
];

/** The admin card counts what is switched on rather than how many rows it has. */
export const ADMIN_ON = NOTIFICATION_CARDS[0].rows.filter(
  (row) => row.control.kind === 'switch' && row.control.on,
).length;

/* ------------------------------------------------------------------ *
 * Section 11 — Moderation                                            *
 * ------------------------------------------------------------------ */

export const MODERATION_CARDS: Card[] = [
  {
    id: 'output',
    title: 'Output filtering',
    note: 'Checked before anything reaches a person',
    icon: 'ti ti-filter',
    badge: { tone: 'is-on', label: '6 checks' },
    span: 'col-12 col-xl-6',
    foot: '6 checks · 41 refusals in 30 days',
    rows: [
      {
        id: 'names-another',
        label: 'Names another student',
        note: 'Refused and regenerated once, then abandoned',
        control: on(true),
      },
      {
        id: 'disciplinary',
        label: 'Contains a disciplinary judgement',
        note: 'Refused',
        control: on(true),
      },
      {
        id: 'prediction',
        label: 'Contains a prediction about an individual',
        note: 'Refused',
        control: on(true),
      },
      {
        id: 'unsafe',
        label: 'Unsafe or distressing content',
        note: 'Refused and flagged to safeguarding',
        control: on(true),
      },
      {
        id: 'reading-age',
        label: 'Reading age above the audience',
        note: 'Rewritten for guardian-facing text',
        control: on(true),
      },
      {
        id: 'length',
        label: 'Exceeds the length set for the feature',
        note: 'Truncated at a sentence boundary',
        control: on(true),
      },
    ],
  },
  {
    id: 'input',
    title: 'Input filtering',
    note: 'What a user may ask in the first place',
    icon: 'ti ti-message-report',
    badge: { tone: 'is-on', label: 'Enforced' },
    span: 'col-12 col-xl-6',
    rows: [
      {
        id: 'about-staff',
        label: 'Questions about staff',
        note: 'Refused for everyone below the Principal',
        control: on(true),
      },
      {
        id: 'out-of-scope',
        label: 'Questions outside the asker’s scope',
        note: 'Refused rather than answered partially',
        control: on(true),
      },
      {
        id: 'injection',
        label: 'Attempts to change the instruction',
        note: 'Detected and logged, not answered',
        control: on(true),
      },
      {
        id: 'free-text',
        label: 'Free-text passed straight to a model',
        note: 'Off — every request goes through a template',
        control: on(false),
      },
      {
        id: 'log-refusals',
        label: 'Log refused requests',
        note: 'With the account, for pattern review',
        control: on(true),
      },
    ],
  },
];

/** The output card's badge and foot both count its checks. */
export const OUTPUT_CHECKS = MODERATION_CARDS[0].rows.length;
export const REFUSALS_30_DAYS = 41;

export const REPORTED = {
  title: 'Nothing has been reported this term',
  note: 'Any user can flag an AI output in one click and it lands here for review. Three were reported last term, all in homework feedback, all resolved by tightening the rubric instruction in the template rather than by changing the model.',
  action: 'View last term’s reports',
};
