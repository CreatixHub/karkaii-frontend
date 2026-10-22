export type TeacherModalId =
  | 'run_analysis'
  | 'teaching_summary'
  | 'coaching_plan'
  | 'assign_training'
  | 'compare_teachers'
  | 'export_report'
  | 'observation'
  | 'development_plan'
  | 'all_teachers';

export type AixFieldKind = 'select' | 'text' | 'textarea';

export interface AixField {
  /** The template's `id` / `for` pair. */
  id: string;
  label: string;
  kind: AixFieldKind;
  /** Grid width — every field is either half or full width. */
  width: 'col-md-6' | 'col-12';
  /** `select` only, in template order; the first is the default. */
  options?: string[];
  /** `text` / `textarea` only — the template's `value` or inner text. */
  value?: string;
  /** `textarea` only. */
  rows?: number;
}

export interface AixFormModal {
  id: Exclude<TeacherModalId, 'all_teachers'>;
  /** `.aix-eyebrow` above the title. */
  eyebrow: string;
  title: string;
  /** Extra `.modal-dialog` class; the plain dialogs carry none. */
  dialogClass: string;
  /** Second line of the identity strip. */
  subtitle: string;
  fields: AixField[];
  submitLabel: string;
  submitIcon: string;
  /** Raised as a toast on submit — the template had no script behind these. */
  toast: string;
}

export const formModals: AixFormModal[] = [
  {
    id: 'run_analysis',
    eyebrow: 'Analysis',
    title: 'Run AI Analysis',
    dialogClass: '',
    subtitle: 'Last pass reviewed 42 teachers at 06:15 today',
    fields: [
      {
        id: 'scope',
        label: 'Scope',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'All 42 teachers',
          'Mathematics department',
          'Teachers above the period ceiling',
          'This teacher only',
        ],
      },
      {
        id: 'period',
        label: 'Period',
        kind: 'select',
        width: 'col-md-6',
        options: ['This term', 'This academic year', 'Last 24 weeks'],
      },
      {
        id: 'signals',
        label: 'Signals',
        kind: 'select',
        width: 'col-md-6',
        options: ['All signals', 'Engagement and planning', 'Workload only', 'Assessment only'],
      },
      {
        id: 'confidence-floor',
        label: 'Confidence floor',
        kind: 'select',
        width: 'col-md-6',
        options: ['Report above 85%', 'Report above 90%', 'Report everything'],
      },
      {
        id: 'on-completion',
        label: 'On completion',
        kind: 'select',
        width: 'col-md-6',
        options: ['Hold for review', 'Draft coaching plans too', 'Notify heads of department'],
      },
    ],
    submitLabel: 'Run analysis',
    submitIcon: 'ti ti-player-play',
    toast: 'AI analysis started',
  },
  {
    id: 'teaching_summary',
    eyebrow: 'Analysis',
    title: 'Generate Teaching Summary',
    dialogClass: 'modal-lg',
    subtitle: 'Written from the observation and lesson record',
    fields: [
      {
        id: 'audience',
        label: 'Audience',
        kind: 'select',
        width: 'col-md-6',
        options: ['Head of department', 'Principal', 'The teacher', 'Governors'],
      },
      {
        id: 'length',
        label: 'Length',
        kind: 'select',
        width: 'col-md-6',
        options: ['One page', 'Half page', 'Full report'],
      },
      {
        id: 'include',
        label: 'Include',
        kind: 'select',
        width: 'col-md-6',
        options: ['Findings and reasoning', 'Findings only', 'Findings and coaching plan'],
      },
      {
        id: 'framing',
        label: 'Framing',
        kind: 'select',
        width: 'col-md-6',
        options: ['Coaching', 'Neutral record', 'Recognition'],
      },
      {
        id: 'opening-paragraph',
        label: 'Opening paragraph',
        kind: 'textarea',
        width: 'col-12',
        rows: 4,
        value:
          'Teena Mathew holds the highest classroom engagement in the school, sustained across nineteen weeks. The engine attributes this to her worked-example-first structure rather than to class composition, and recommends she lead rather than receive coaching.',
      },
    ],
    submitLabel: 'Generate summary',
    submitIcon: 'ti ti-file-text',
    toast: 'Teaching summary drafted',
  },
  {
    id: 'coaching_plan',
    eyebrow: 'Coaching',
    title: 'Create Coaching Plan',
    dialogClass: 'modal-lg',
    subtitle: 'A lead-others plan rather than an improve-yourself plan',
    fields: [
      {
        id: 'plan-type',
        label: 'Plan type',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'Lead and share · recommended',
          'Targeted improvement',
          'Workload relief',
          'Professional development',
        ],
      },
      {
        id: 'focus',
        label: 'Focus',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'Spread the worked-example structure',
          'Widen whole-class questioning',
          'Deepen written feedback',
          'Digital resources',
        ],
      },
      {
        id: 'duration',
        label: 'Duration',
        kind: 'select',
        width: 'col-md-6',
        options: ['One term', 'Half term', 'Full year'],
      },
      {
        id: 'owner',
        label: 'Owner',
        kind: 'select',
        width: 'col-md-6',
        options: ['Head of Mathematics', 'Deputy principal', 'Peer mentor'],
      },
      { id: 'review-date', label: 'Review date', kind: 'text', width: 'col-md-6', value: '30 Sep 2026' },
      {
        id: 'observation-slots',
        label: 'Observation slots',
        kind: 'text',
        width: 'col-md-6',
        value: '2',
      },
      {
        id: 'plan',
        label: 'Plan',
        kind: 'textarea',
        width: 'col-12',
        rows: 3,
        value:
          'Week 1 prepare a twenty-minute department session. Week 2 deliver it. Week 3 observe two adopting teachers. Week 4 gather feedback and adjust the guidance.',
      },
    ],
    submitLabel: 'Create plan',
    submitIcon: 'ti ti-route',
    toast: 'Coaching plan created',
  },
  {
    id: 'assign_training',
    eyebrow: 'Coaching',
    title: 'Assign Training',
    dialogClass: '',
    subtitle: 'Completion is blocked by workload, not by willingness',
    fields: [
      {
        id: 'programme',
        label: 'Programme',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'Mentoring skills · 2 days',
          'Assessment design lead · half day',
          'Digital resources · 1 day',
          'Leadership foundation · 4 days',
        ],
      },
      {
        id: 'cohort',
        label: 'Cohort',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'This teacher',
          'The four above the period ceiling',
          'Whole department',
          'All teachers below 66% completion',
        ],
      },
      { id: 'start-date', label: 'Start date', kind: 'text', width: 'col-md-6', value: '14 Sep 2026' },
      {
        id: 'protected-periods',
        label: 'Protected periods',
        kind: 'select',
        width: 'col-md-6',
        options: ['Three per term', 'Two per term', 'None — own time'],
      },
      {
        id: 'cover-arranged',
        label: 'Cover arranged',
        kind: 'select',
        width: 'col-md-6',
        options: ['Yes, automatically', 'Yes, manually', 'Not required'],
      },
    ],
    submitLabel: 'Assign training',
    submitIcon: 'ti ti-school',
    toast: 'Training assigned',
  },
  {
    id: 'compare_teachers',
    eyebrow: 'Insights',
    title: 'Compare Teachers',
    dialogClass: '',
    subtitle: 'Four teachers share the worked-example structure',
    fields: [
      {
        id: 'compare-on',
        label: 'Compare on',
        kind: 'select',
        width: 'col-md-6',
        options: ['Teaching method', 'Engagement profile', 'Workload', 'Assessment design'],
      },
      {
        id: 'against',
        label: 'Against',
        kind: 'select',
        width: 'col-md-6',
        options: ['Same department', 'Same method', 'Whole school', 'Same year group'],
      },
      {
        id: 'period-2',
        label: 'Period',
        kind: 'select',
        width: 'col-md-6',
        options: ['This term', 'This year', 'Since method change'],
      },
      {
        id: 'show',
        label: 'Show',
        kind: 'select',
        width: 'col-md-6',
        options: ['Top 4 matches', 'Top 10 matches', 'All 42 teachers'],
      },
    ],
    submitLabel: 'Compare',
    submitIcon: 'ti ti-git-compare',
    toast: 'Comparison ready',
  },
  {
    id: 'export_report',
    eyebrow: 'Analysis',
    title: 'Export Productivity Report',
    dialogClass: '',
    subtitle: 'Exports carry the reasoning behind every finding',
    fields: [
      {
        id: 'contents',
        label: 'Contents',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'Full productivity report',
          'This teacher only',
          'Department summary',
          'Workload report',
        ],
      },
      {
        id: 'format',
        label: 'Format',
        kind: 'select',
        width: 'col-md-6',
        options: ['PDF', 'XLSX', 'CSV', 'Word'],
      },
      {
        id: 'include-reasoning',
        label: 'Include reasoning',
        kind: 'select',
        width: 'col-md-6',
        options: ['Yes, with evidence', 'Yes, summary only', 'No, findings only'],
      },
      {
        id: 'deliver-to',
        label: 'Deliver to',
        kind: 'select',
        width: 'col-md-6',
        options: ['Download', 'Email to me', 'Email to leadership'],
      },
    ],
    submitLabel: 'Export report',
    submitIcon: 'ti ti-file-export',
    toast: 'Productivity report exported',
  },
  {
    id: 'observation',
    eyebrow: 'Coaching',
    title: 'Schedule Classroom Observation',
    dialogClass: 'modal-lg',
    subtitle: 'Second observation cycle is under way',
    fields: [
      { id: 'date', label: 'Date', kind: 'text', width: 'col-md-6', value: '12 Aug 2026' },
      { id: 'period-3', label: 'Period', kind: 'text', width: 'col-md-6', value: 'Period 3' },
      {
        id: 'class',
        label: 'Class',
        kind: 'select',
        width: 'col-md-6',
        options: ['VII-A · Algebra', 'VIII-C · Geometry', 'VI-B · Algebra', 'IX-A · Geometry'],
      },
      {
        id: 'observer',
        label: 'Observer',
        kind: 'select',
        width: 'col-md-6',
        options: ['Head of Mathematics', 'Deputy principal', 'Peer teacher', 'External reviewer'],
      },
      {
        id: 'framework',
        label: 'Framework',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'Standard review framework',
          'Engagement focus',
          'Assessment focus',
          'Informal drop-in',
        ],
      },
      {
        id: 'focus-for-this-observation',
        label: 'Focus for this observation',
        kind: 'textarea',
        width: 'col-12',
        rows: 3,
        value:
          'Watch how the worked-example structure is introduced at the start of the lesson, and how quickly students move from the example to independent work.',
      },
    ],
    submitLabel: 'Schedule observation',
    submitIcon: 'ti ti-eye',
    toast: 'Observation scheduled',
  },
  {
    id: 'development_plan',
    eyebrow: 'Growth',
    title: 'Generate Professional Development Plan',
    dialogClass: 'modal-lg',
    subtitle: 'Meets every published promotion criterion',
    fields: [
      {
        id: 'horizon',
        label: 'Horizon',
        kind: 'select',
        width: 'col-md-6',
        options: ['One term', 'One year', 'Two years'],
      },
      {
        id: 'track-2',
        label: 'Track',
        kind: 'select',
        width: 'col-md-6',
        options: [
          'Mentoring and leadership',
          'Assessment specialism',
          'Subject leadership',
          'Classroom practice',
        ],
      },
      {
        id: 'include-2',
        label: 'Include',
        kind: 'select',
        width: 'col-md-6',
        options: ['Training, mentoring and milestones', 'Training only', 'Milestones only'],
      },
      {
        id: 'review-cadence',
        label: 'Review cadence',
        kind: 'select',
        width: 'col-md-6',
        options: ['Termly', 'Half-termly', 'Annually'],
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        kind: 'textarea',
        width: 'col-12',
        rows: 3,
        value:
          'Now senior teacher. This term mentor. Twelve months assessment lead. Twenty-four months head of department, subject to a second full review cycle.',
      },
    ],
    submitLabel: 'Generate plan',
    submitIcon: 'ti ti-stairs-up',
    toast: 'Development plan generated',
  },
];

/** Every form field's default, keyed by dialog then field id. */
export const formDefaults = (modal: AixFormModal): Record<string, string> =>
  modal.fields.reduce<Record<string, string>>((values, field) => {
    values[field.id] = field.kind === 'select' ? (field.options?.[0] ?? '') : (field.value ?? '');
    return values;
  }, {});
