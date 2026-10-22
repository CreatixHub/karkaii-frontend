import { daysBetween, shortDate } from '../../../ai-insights/data/dates';

/** This page's clock. See the deviation note above. */
export const RUN_DATE = '31 Jul 2026';

export const ACADEMIC_YEAR = '2026-2027';

/* ------------------------------------------------------------------ *
 * The register-wide figures                                          *
 * ------------------------------------------------------------------ */

export const TOTAL_TEMPLATES = 14;
export const ACTIVE_TEMPLATES = 8;
export const DRAFT_TEMPLATES = 3;
export const DEFAULT_TEMPLATES = 5;
export const TEMPLATES_IN_USE = 6;
export const IN_REVIEW_TEMPLATES = 1;
export const ARCHIVED_TEMPLATES = 2;

/* ------------------------------------------------------------------ *
 * What a card is made of                                             *
 * ------------------------------------------------------------------ */

export type RecipientType = 'Student' | 'Staff' | 'Visitor';
export type Orientation = 'Portrait' | 'Landscape';
export type TemplateStatus = 'Active' | 'Draft' | 'In Review' | 'Archived';
export type TemplateType = 'Identity card' | 'Day pass' | 'Transport pass' | 'Library card';

/** The three stocks the office prints on, and how many fit an A4 sheet. */
export const CARD_SIZES = [
  { name: 'CR80 · 85.6 x 54 mm', perSheet: 10, stock: 'CR80 · 85.6 x 54 mm' },
  { name: 'CR100 · 98.5 x 67 mm', perSheet: 8, stock: 'CR100 · 98.5 x 67 mm' },
  { name: 'Badge · 100 x 70 mm', perSheet: 6, stock: 'Adhesive badge' },
];

export const sizeOf = (name: string) =>
  CARD_SIZES.find((entry) => entry.name === name) ?? CARD_SIZES[0];

export const BAND_TINT: Record<string, string> = {
  Yellow: 'warning',
  Green: 'success',
  Blue: 'primary',
  Grey: 'secondary',
  Orange: 'danger',
  Teal: 'info',
};

export const RECIPIENT_TINT: Record<RecipientType, string> = {
  Student: 'info',
  Staff: 'success',
  Visitor: 'warning',
};

export const BAND_COLOURS = ['Yellow', 'Green', 'Blue', 'Grey', 'Orange', 'Teal'];

export const LOGO_PLACEMENTS = ['Top left', 'Top right', 'Centred', 'Left panel'];

export const WATERMARKS = [
  'Faint crest at 6 percent',
  'Faint crest at 8 percent',
  'Day colour block',
  'None',
];

export const QR_OPTIONS = ['QR on the reverse face', 'QR on the front face', 'None'];

export const BARCODE_OPTIONS = ['Code 128 under the QR', 'Code 128 on the reverse', 'None'];

export const SECONDARY_FIELDS = [
  'Admission number',
  'Blood group',
  'Employee number',
  'Route and stop',
  'Validity window',
];

export const REVERSE_FIELDS = [
  'Guardian contact',
  'Access zones',
  'Signature block',
  'Medical flag',
  'Not printed',
];

export const EDITORS = [
  'Ms. Fatima Sheikh · School Office',
  'Ms. Dana Ruiz · Administration',
  'Mr. Samuel Roy · Security',
];

export const RECIPIENT_GROUPS = [
  'Student · junior',
  'Student · middle',
  'Student · senior',
  'Student · transport',
  'Staff',
  'Visitor',
];

export interface Component {
  name: string;
  place: string;
}

export interface Revision {
  version: string;
  change: string;
  date: string;
  by: string;
}

export interface Assignment {
  scope: string;
  cards: number;
  isDefault: boolean;
}

export interface Template {
  code: string;
  name: string;
  recipientType: RecipientType;
  type: TemplateType;
  orientation: Orientation;
  size: string;
  band: string;
  status: TemplateStatus;
  isDefault: boolean;
  /** Null while nothing has been assigned to the template. */
  assignedTo: string | null;
  scope: string | null;
  /** Cards printed from this template. Every sheet figure follows from it. */
  cards: number;
  /** The elements placed on the card, in the order the layout lists them. */
  components: Component[];
  logo: string;
  watermark: string;
  qr: string;
  barcode: string;
  encoded: string;
  gateReader: string;
  libraryReader: string;
  /** Newest first. The version, the revision count and the dates come off this. */
  history: Revision[];
  /** Only the archived templates have one. */
  withdrawnOn: string | null;
  supersededBy: string | null;
  /** The panel breaks the assignment down where the office keeps one. */
  breakdown: Assignment[];
  notes: string;
}

const seeded: Template[] = [
  {
    code: 'TPL-JR-01',
    name: 'Junior Student Card',
    recipientType: 'Student',
    type: 'Identity card',
    orientation: 'Portrait',
    size: 'CR80 · 85.6 x 54 mm',
    band: 'Yellow',
    status: 'Active',
    isDefault: true,
    assignedTo: 'Classes I to V',
    scope: 'Junior section, all sections',
    cards: 412,
    components: [
      { name: 'Photograph', place: 'Top centre · 35 x 45 mm' },
      { name: 'Name and class', place: 'Below the photograph · bold 12 pt' },
      { name: 'Admission number', place: 'Left column · 9 pt' },
      { name: 'Guardian contact', place: 'Reverse face · 9 pt' },
      { name: 'House band', place: 'Header strip · 8 mm' },
    ],
    logo: 'School crest, top left · 14 mm',
    watermark: 'Faint crest at 6 percent',
    qr: 'QR on the reverse face',
    barcode: 'Code 128 under the QR',
    encoded: 'Admission number and card number',
    gateReader: 'Supported',
    libraryReader: 'Supported',
    history: [
      { version: 'v3.2', change: 'Band colour matched to the junior crest', date: '10 Jun 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v3.0', change: 'Guardian contact block added', date: '2 Jun 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v2.0', change: 'Photograph frame enlarged', date: '11 Mar 2025', by: 'Ms. Fatima Sheikh' },
      { version: 'v1.0', change: 'First junior layout', date: '4 Apr 2024', by: 'Ms. Fatima Sheikh' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [],
    notes:
      'Junior cards carry the guardian contact on the reverse because junior students are handed over at the gate.',
  },
  {
    code: 'TPL-MD-01',
    name: 'Middle Student Card',
    recipientType: 'Student',
    type: 'Identity card',
    orientation: 'Portrait',
    size: 'CR80 · 85.6 x 54 mm',
    band: 'Green',
    status: 'Active',
    isDefault: true,
    assignedTo: 'Classes VI to VIII',
    scope: 'Middle section, all sections',
    cards: 386,
    components: [
      { name: 'Photograph', place: 'Top centre · 35 x 45 mm' },
      { name: 'Name and class', place: 'Below the photograph · bold 12 pt' },
      { name: 'Blood group', place: 'Right column · 9 pt' },
      { name: 'House band', place: 'Header strip · 8 mm' },
      { name: 'Signature block', place: 'Reverse face · class teacher' },
    ],
    logo: 'School crest, top left · 14 mm',
    watermark: 'Faint crest at 6 percent',
    qr: 'QR on the reverse face',
    barcode: 'Code 128 under the QR',
    encoded: 'Admission number and card number',
    gateReader: 'Supported',
    libraryReader: 'Supported',
    history: [
      { version: 'v2.4', change: 'Library barcode moved to the reverse', date: '2 Jun 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v2.0', change: 'Blood group field added', date: '11 Mar 2025', by: 'Ms. Fatima Sheikh' },
      { version: 'v1.0', change: 'First middle layout', date: '4 Apr 2024', by: 'Ms. Fatima Sheikh' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [],
    notes:
      'Used for Kabir Shah IDC-2026-0163 and Aarav Kumar IDC-2026-0126. Reverse barcode reads at the library desk.',
  },
  {
    code: 'TPL-SR-01',
    name: 'Senior Student Card',
    recipientType: 'Student',
    type: 'Identity card',
    orientation: 'Portrait',
    size: 'CR80 · 85.6 x 54 mm',
    band: 'Blue',
    status: 'Active',
    isDefault: true,
    assignedTo: 'Classes IX to XII',
    scope: 'Senior section, all sections',
    cards: 366,
    components: [
      { name: 'Photograph', place: 'Top centre · 35 x 45 mm' },
      { name: 'Name and class', place: 'Below the photograph · bold 12 pt' },
      { name: 'Laboratory access', place: 'Right column · badge' },
      { name: 'Medical flag', place: 'Reverse face · optional box' },
      { name: 'House band', place: 'Header strip · 8 mm' },
    ],
    logo: 'School crest, top left · 14 mm',
    watermark: 'Faint crest at 6 percent',
    qr: 'QR on the reverse face',
    barcode: 'Code 128 under the QR',
    encoded: 'Admission number and card number',
    gateReader: 'Supported',
    libraryReader: 'Supported',
    history: [
      { version: 'v4.1', change: 'Medical flag box added on the reverse', date: '9 Jun 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v4.0', change: 'Laboratory access flag added', date: '28 May 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v3.0', change: 'Carried over from the legacy layout', date: '4 Apr 2024', by: 'Ms. Fatima Sheikh' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [],
    notes:
      'The medical flag box added in v4.1 is what carries the asthma marker on Rohan Desai IDC-2026-0241.',
  },
  {
    code: 'TPL-ST-01',
    name: 'Staff Identity Card',
    recipientType: 'Staff',
    type: 'Identity card',
    orientation: 'Landscape',
    size: 'CR80 · 85.6 x 54 mm',
    band: 'Grey',
    status: 'Active',
    isDefault: true,
    assignedTo: 'All departments',
    scope: 'Teaching, administration and support',
    cards: 96,
    components: [
      { name: 'Photograph', place: 'Left panel · 30 x 40 mm' },
      { name: 'Name and designation', place: 'Right panel · bold 12 pt' },
      { name: 'Department', place: 'Right panel · 9 pt' },
      { name: 'Employee number', place: 'Footer strip · 9 pt' },
      { name: 'Access zones', place: 'Reverse face · list' },
    ],
    logo: 'School crest, left panel · 12 mm',
    watermark: 'None',
    qr: 'QR on the front face',
    barcode: 'None',
    encoded: 'Employee number and card number',
    gateReader: 'Supported',
    libraryReader: 'QR only',
    history: [
      { version: 'v2.0', change: 'Department and designation split', date: '16 Jun 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v1.0', change: 'First staff layout', date: '18 Apr 2024', by: 'Ms. Dana Ruiz' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [],
    notes:
      'Carries the gate turnstile access list on the reverse. Used by every staff member including SEC gate officers.',
  },
  {
    code: 'TPL-VS-01',
    name: 'Visitor Day Pass',
    recipientType: 'Visitor',
    type: 'Day pass',
    orientation: 'Landscape',
    size: 'Badge · 100 x 70 mm',
    band: 'Orange',
    status: 'Active',
    isDefault: true,
    assignedTo: 'Reception and all gates',
    scope: 'Main, North, Service and Hostel gates',
    cards: 68,
    components: [
      { name: 'Visitor name', place: 'Top band · bold 14 pt' },
      { name: 'Validity window', place: 'Centre · bold 16 pt' },
      { name: 'Host and escort', place: 'Below the window · 9 pt' },
      { name: 'Gate and zones', place: 'Footer strip · 9 pt' },
      { name: 'Photograph', place: 'Optional · left panel' },
    ],
    logo: 'School crest, top right · 10 mm',
    watermark: 'Day colour block',
    qr: 'QR on the front face',
    barcode: 'None',
    encoded: 'Pass number and validity window',
    gateReader: 'Supported',
    libraryReader: 'QR only',
    history: [
      { version: 'v1.6', change: 'Host and escort line added', date: '14 Jul 2026', by: 'Ms. Fiona Marsh' },
      { version: 'v1.5', change: 'Validity window printed larger', date: '20 Jan 2026', by: 'Mr. Samuel Roy' },
      { version: 'v1.0', change: 'First visitor badge', date: '2 May 2025', by: 'Mr. Samuel Roy' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [
      { scope: 'Main Gate', cards: 41, isDefault: true },
      { scope: 'North Gate', cards: 14, isDefault: true },
      { scope: 'Service and Hostel gates', cards: 13, isDefault: true },
    ],
    notes:
      'Prints on adhesive badge stock at the gate desks. The large validity window is what the corridor readers check by eye.',
  },
  {
    code: 'TPL-TR-01',
    name: 'Transport Bus Pass',
    recipientType: 'Student',
    type: 'Transport pass',
    orientation: 'Landscape',
    size: 'Badge · 100 x 70 mm',
    band: 'Teal',
    status: 'In Review',
    isDefault: false,
    assignedTo: 'Bus routes 1 to 9',
    scope: 'Every route, morning and evening',
    cards: 0,
    components: [
      { name: 'Student name and class', place: 'Top band · bold 12 pt' },
      { name: 'Route and stop', place: 'Centre · bold 14 pt' },
      { name: 'Boarding time', place: 'Below the route · 9 pt' },
      { name: 'Guardian contact', place: 'Footer strip · 9 pt' },
      { name: 'Photograph', place: 'Left panel · 25 x 32 mm' },
    ],
    logo: 'School crest, top right · 10 mm',
    watermark: 'Route colour block',
    qr: 'QR on the front face',
    barcode: 'None',
    encoded: 'Admission number and route code',
    gateReader: 'Supported',
    libraryReader: 'QR only',
    history: [
      { version: 'v1.2', change: 'Route and stop fields widened', date: '27 Jul 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v1.0', change: 'First transport layout', date: '6 Jul 2026', by: 'Ms. Dana Ruiz' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [],
    notes:
      'Held in review until the transport office confirms the route codes. Nothing prints from this template yet.',
  },
  {
    code: 'TPL-SR-02',
    name: 'Senior Card, 2027 refresh',
    recipientType: 'Student',
    type: 'Identity card',
    orientation: 'Portrait',
    size: 'CR100 · 98.5 x 67 mm',
    band: 'Blue',
    status: 'Draft',
    isDefault: false,
    assignedTo: null,
    scope: null,
    cards: 0,
    components: [
      { name: 'Photograph', place: 'Top centre · 40 x 50 mm' },
      { name: 'Name and class', place: 'Below the photograph · bold 14 pt' },
      { name: 'Laboratory access', place: 'Right column · badge' },
      { name: 'House band', place: 'Header strip · 10 mm' },
      { name: 'Medical flag', place: 'Reverse face · optional box' },
    ],
    logo: 'School crest, centred · 16 mm',
    watermark: 'Faint crest at 8 percent',
    qr: 'QR on the reverse face',
    barcode: 'Code 128 under the QR',
    encoded: 'Admission number and card number',
    gateReader: 'Supported',
    libraryReader: 'Supported',
    history: [
      { version: 'v0.4', change: 'Photograph frame and crest rebalanced', date: '30 Jul 2026', by: 'Ms. Dana Ruiz' },
      { version: 'v0.1', change: 'Larger stock trial layout', date: '21 Jul 2026', by: 'Ms. Dana Ruiz' },
    ],
    withdrawnOn: null,
    supersededBy: null,
    breakdown: [],
    notes:
      'Trial of the larger CR100 stock for the 2027-2028 session. Costed but not yet approved by the purchase committee.',
  },
  {
    code: 'TPL-SR-00',
    name: 'Senior Card, legacy 2024',
    recipientType: 'Student',
    type: 'Identity card',
    orientation: 'Portrait',
    size: 'CR80 · 85.6 x 54 mm',
    band: 'Blue',
    status: 'Archived',
    isDefault: false,
    assignedTo: null,
    scope: null,
    cards: 0,
    components: [
      { name: 'Photograph', place: 'Top centre · 32 x 42 mm' },
      { name: 'Name and class', place: 'Below the photograph · bold 11 pt' },
      { name: 'Admission number', place: 'Left column · 8 pt' },
      { name: 'House band', place: 'Header strip · 6 mm' },
      { name: 'Signature block', place: 'Reverse face · principal' },
    ],
    logo: 'School crest, top left · 12 mm',
    watermark: 'None',
    qr: 'None',
    barcode: 'Code 128 on the reverse',
    encoded: 'Admission number only',
    gateReader: 'Barcode only',
    libraryReader: 'Supported',
    history: [
      { version: 'v3.8', change: 'Final revision before withdrawal', date: '3 Feb 2026', by: 'Ms. Fatima Sheikh' },
      { version: 'v3.0', change: 'Original senior layout', date: '9 Apr 2024', by: 'Ms. Fatima Sheikh' },
    ],
    withdrawnOn: '28 May 2026',
    supersededBy: 'TPL-SR-01',
    breakdown: [],
    notes:
      'Kept on the register so cards printed before 28 May 2026 can still be identified at the readers.',
  },
];

export const templates: Template[] = seeded;

/* ------------------------------------------------------------------ *
 * What a template knows about itself                                 *
 * ------------------------------------------------------------------ */

export const agoOf = (date: string | null) => {
  if (!date) return '—';
  const days = daysBetween(date, RUN_DATE);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

/** The newest revision. Everything about the version comes off it. */
export const currentRevisionOf = (row: Template) => row.history[0];

export const versionOf = (row: Template) => currentRevisionOf(row).version;
export const revisionsOf = (row: Template) => row.history.length;
export const lastUpdatedOf = (row: Template) => currentRevisionOf(row).date;
export const updatedByOf = (row: Template) => currentRevisionOf(row).by;

export const revisionsLabelOf = (row: Template) => {
  const count = revisionsOf(row);
  return `${count} ${count === 1 ? 'revision' : 'revisions'} on file`;
};

export const perSheetOf = (row: Template) => sizeOf(row.size).perSheet;

export const sheetsOf = (row: Template) =>
  row.cards === 0 ? 0 : Math.ceil(row.cards / perSheetOf(row));

export const sheetRunOf = (row: Template) =>
  row.cards === 0 ? 'Nothing queued' : `${sheetsOf(row)} sheets for ${row.cards} cards`;

export const componentsLabelOf = (row: Template) =>
  `${row.components.length} placed ${row.components.length === 1 ? 'element' : 'elements'}`;

/** Whether anything at all is placed on the back of the card. */
export const sidesOf = (row: Template) => {
  const onReverse =
    row.components.some((part) => /reverse/i.test(part.place)) ||
    /reverse/i.test(row.qr) ||
    /reverse/i.test(row.barcode);
  return onReverse ? 'Front and reverse' : 'Front only';
};

const componentNamed = (row: Template, name: string) =>
  row.components.find((part) => part.name.toLowerCase() === name.toLowerCase());

export const signatureBlockOf = (row: Template) => {
  const block = componentNamed(row, 'Signature block');
  return block ? block.place.split(' · ')[0] : 'Not printed';
};

export const photographFrameOf = (row: Template) => {
  const photo = componentNamed(row, 'Photograph');
  return photo ? photo.place : 'Not printed';
};

export const statusPill = (status: TemplateStatus) =>
  ({
    Active: 'is-active',
    Draft: 'is-pending',
    'In Review': 'is-review',
    Archived: 'is-archived',
  })[status];

/** The line under the status pill. */
export const statusNoteOf = (row: Template) => {
  if (row.status === 'Active') return `${row.cards} cards printed`;
  if (row.status === 'In Review') return 'Awaiting sign off';
  if (row.status === 'Draft') return `Last saved ${shortDate(lastUpdatedOf(row))}`;
  return `Withdrawn ${shortDate(row.withdrawnOn ?? lastUpdatedOf(row))}`;
};

/** The line under the Default badge. */
export const defaultNoteOf = (row: Template) =>
  row.isDefault && row.assignedTo ? `For ${row.assignedTo.toLowerCase()}` : 'Assigned by hand';

/** The line under the Assigned To column. */
export const assignedNoteOf = (row: Template) => {
  if (row.cards > 0) return `${row.cards} cards · ${sheetsOf(row)} A4 sheets`;
  if (row.status === 'In Review') return 'Awaiting transport office sign off';
  if (row.status === 'Draft') return 'Draft for the next session';
  return `Superseded by ${row.supersededBy}`;
};

export const assignedLabelOf = (row: Template) => {
  if (row.assignedTo) return row.assignedTo;
  return row.status === 'Archived' ? 'Withdrawn' : 'Not assigned';
};

/** What the assigned-records block says when nothing is assigned. */
export const unassignedNoteOf = (row: Template) => {
  if (row.status === 'In Review') return 'Assignment holds until sign off';
  if (row.status === 'Draft') return 'Assign after publishing';
  return 'Template withdrawn from use';
};

/** The icon the row avatar carries — portrait cards, landscape passes. */
export const iconOf = (row: Template) =>
  row.orientation === 'Portrait' ? 'ti ti-id' : 'ti ti-credit-card';

export const tintOf = (row: Template) => BAND_TINT[row.band] ?? 'primary';

/**
 * The buttons the expanded detail offers. The template gives each row a
 * different pair, always the next thing the template needs.
 */
export interface DetailAction {
  label: string;
  icon: string;
  modal: 'create' | 'edit' | 'duplicate' | 'preview' | 'default' | 'assign' | 'view';
  primary: boolean;
}

export const detailActionsOf = (row: Template): DetailAction[] => {
  if (row.status === 'Archived') {
    return [
      { label: 'Duplicate', icon: 'ti ti-copy', modal: 'duplicate', primary: true },
      { label: 'View Details', icon: 'ti ti-eye', modal: 'view', primary: false },
    ];
  }
  if (row.status === 'Draft') {
    return [
      { label: 'Edit Template', icon: 'ti ti-edit', modal: 'edit', primary: true },
      { label: 'Preview', icon: 'ti ti-photo', modal: 'preview', primary: false },
    ];
  }
  if (row.status === 'In Review') {
    return [
      { label: 'Assign Template', icon: 'ti ti-users', modal: 'assign', primary: true },
      { label: 'Edit Template', icon: 'ti ti-edit', modal: 'edit', primary: false },
    ];
  }
  return [
    { label: 'Preview', icon: 'ti ti-photo', modal: 'preview', primary: true },
    { label: 'Edit Template', icon: 'ti ti-edit', modal: 'edit', primary: false },
  ];
};

/** The audit trail the side panel prints. */
export interface Entry {
  title: string;
  note: string;
}

export const auditOf = (row: Template): Entry[] => {
  const first = row.history[row.history.length - 1];
  const trail: Entry[] = [
    { title: 'Template published', note: `${first.date} · ${first.by}` },
  ];
  if (row.isDefault) {
    trail.push({
      title: `Set as the ${row.recipientType.toLowerCase()} default`,
      note: `${first.date} · ${first.by}`,
    });
  }
  if (row.assignedTo) {
    trail.push({
      title: `Assigned to ${row.assignedTo.toLowerCase()}`,
      note: `${lastUpdatedOf(row)} · ${updatedByOf(row)}`,
    });
  }
  if (row.withdrawnOn) {
    trail.push({ title: 'Template withdrawn', note: `${row.withdrawnOn} · school office` });
  }
  return trail;
};

export const searchIndexOf = (row: Template) =>
  [row.code, row.name, row.recipientType, row.orientation, row.size, row.band, versionOf(row), row.status]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter options and the counts                                  *
 * ------------------------------------------------------------------ */

export const templateTypeOptions: TemplateType[] = [
  'Identity card',
  'Day pass',
  'Transport pass',
  'Library card',
];
export const orientationOptions: Orientation[] = ['Portrait', 'Landscape'];
export const recipientTypeOptions: RecipientType[] = ['Student', 'Staff', 'Visitor'];
export const statusOptions: TemplateStatus[] = ['Active', 'Draft', 'In Review', 'Archived'];
export const cardSizeOptions = CARD_SIZES.map((entry) => entry.name);
export const defaultOptions = ['Default only', 'Not default'];

/** The template picker every dialog carries. */
export const templateOptions = templates.map((row) => `${row.code} · ${row.name}`);

/** The groups a template can be assigned to. */
export const assignmentOptions = [
  'Classes I to V',
  'Classes VI to VIII',
  'Classes IX to XII',
  'All departments',
  'Bus routes 1 to 9',
  'Reception and all gates',
];

export const countByStatus = (rows: Template[], status: TemplateStatus) =>
  rows.filter((row) => row.status === status).length;

export const countDefault = (rows: Template[]) => rows.filter((row) => row.isDefault).length;

export const countInUse = (rows: Template[]) => rows.filter((row) => row.cards > 0).length;

export const totalCards = (rows: Template[]) => rows.reduce((total, row) => total + row.cards, 0);

export const totalSheets = (rows: Template[]) =>
  rows.reduce((total, row) => total + sheetsOf(row), 0);

/** The date the dialogs propose. */
export const EFFECTIVE_FROM = RUN_DATE;
