/** The seven dialogs that follow the page body. */
export type IdCardModalId =
  | 'generate'
  | 'bulkGenerate'
  | 'preview'
  | 'print'
  | 'issue'
  | 'replace'
  | 'view';

/** Targets a row action can point at — the dialogs plus the details offcanvas. */
export type IdCardAction = IdCardModalId | 'panel';

/** A `label / value` line inside a detail block. */
export interface DetailRow {
  label: string;
  value: string;
  /** When set, the value renders as a badge carrying this class. */
  badge?: string;
}

/** The bordered, centred placeholder the template uses for an empty block. */
export interface EmptyBlock {
  tint: string;
  icon: string;
  title: string;
  hint: string;
}

/** A bordered history line — avatar, title, meta. */
export interface TimelineEntry {
  tint: string;
  icon: string;
  title: string;
  meta: string;
}

/** The miniature card face rendered in the "ID Card Preview" block. */
export interface CardProof {
  avatarTint: string;
  name: string;
  classSection: string;
  house: string;
  houseBadge: string;
  admissionNo: string;
  cardNo: string;
  validTo: string;
  barcode: string;
}

/** A button in the Internal Notes block. */
export interface NoteAction {
  label: string;
  icon: string;
  className: string;
  action: IdCardAction;
}

/** The "Generated On" / "Issue Date" cells: a date, an age and a footnote. */
export interface DateCell {
  date: string;
  dateClass: string;
  ago?: string;
  note: string;
  noteClass: string;
}

export interface IdCardDetail {
  profile: DetailRow[];
  proof: CardProof | null;
  proofEmpty: EmptyBlock | null;
  cardInfo: DetailRow[];
  printEntries: TimelineEntry[];
  printRuns: string | null;
  printEmpty: EmptyBlock | null;
  issueEntries: TimelineEntry[];
  issuedOn: string | null;
  issueEmpty: EmptyBlock | null;
  replacementRows: DetailRow[];
  replacementEntry: TimelineEntry | null;
  replacementEmpty: EmptyBlock | null;
  qrRows: DetailRow[];
  qrEmpty: EmptyBlock | null;
  noteBadges: { label: string; className: string }[];
  note: string;
  actions: NoteAction[];
}

export interface IdCard {
  id: string;
  avatarTint: string;
  name: string;
  sub: string;
  admissionNo: string;
  className: string;
  section: string;
  cardNo: string;
  template: string;
  house: string;
  academicYear: string;
  /** Drives the "No Photo" quick filter. */
  photograph: string;
  generated: DateCell;
  issue: DateCell;
  cardStatus: { pill: string; label: string; note: string };
  issueStatus: { badge: string; label: string; note: string };
  detail: IdCardDetail;
}

/* -------------------------------------------------------------------------- */
/* Blocks the template repeats verbatim across several rows                    */
/* -------------------------------------------------------------------------- */

const noReplacement: EmptyBlock = {
  tint: 'bg-success-transparent text-success',
  icon: 'ti ti-circle-check',
  title: 'No replacement on record',
  hint: 'Original card still in use',
};

const notIssued: EmptyBlock = {
  tint: 'bg-secondary-transparent text-secondary',
  icon: 'ti ti-id-off',
  title: 'Not issued yet',
  hint: 'Held at the office once printed',
};

const readerRows: DetailRow[] = [
  { label: 'Gate Reader', value: 'Main Gate, turnstile lanes 1 to 3' },
  { label: 'Library Reader', value: 'Circulation desk' },
];

const batchPrint: TimelineEntry = {
  tint: 'bg-purple-transparent text-purple',
  icon: 'ti ti-printer',
  title: 'Batch print run BR-2026-014',
  meta: '14 Jun 2026 · Ms. Fatima Sheikh',
};

const collected = (meta: string): TimelineEntry => ({
  tint: 'bg-success-transparent text-success',
  icon: 'ti ti-circle-check',
  title: 'Collected by the student at the school office',
  meta,
});

const previewPrintPanel: NoteAction[] = [
  { label: 'Preview', icon: 'ti ti-photo', className: 'btn btn-outline-light bg-white btn-sm', action: 'preview' },
  { label: 'Print Card', icon: 'ti ti-printer', className: 'btn btn-primary btn-sm', action: 'print' },
  { label: 'ID Card Panel', icon: 'ti ti-id', className: 'btn btn-outline-light bg-white btn-sm', action: 'panel' },
];

const viewDetails: NoteAction = {
  label: 'View Details',
  icon: 'ti ti-eye',
  className: 'btn btn-outline-light bg-white btn-sm',
  action: 'view',
};

const openPanel: NoteAction = {
  label: 'ID Card Panel',
  icon: 'ti ti-id',
  className: 'btn btn-outline-light bg-white btn-sm',
  action: 'panel',
};

const studioPhoto = 'Studio photograph, 12 May 2026';

/* -------------------------------------------------------------------------- */

export const idCards: IdCard[] = [
  {
    id: 'id_01',
    avatarTint: 'bg-primary-transparent text-primary',
    name: 'Ananya Rao',
    sub: 'Everest House · O positive',
    admissionNo: 'AD9887402',
    className: 'Class X',
    section: 'B',
    cardNo: 'IDC-2026-0118',
    template: 'Senior card, blue band',
    house: 'Everest',
    academicYear: '2026-2027',
    photograph: studioPhoto,
    generated: { date: '12 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '49 days ago', note: '1 print run', noteClass: 'text-muted' },
    issue: { date: '16 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '45 days ago', note: 'Valid to 31 Mar 2027', noteClass: 'text-muted' },
    cardStatus: { pill: 'is-completed', label: 'Printed', note: 'Printed 14 Jun' },
    issueStatus: { badge: 'badge-soft-success', label: 'Issued', note: 'Ms. Fatima Sheikh' },
    detail: {
      profile: [
        { label: 'Student', value: 'Ananya Rao' },
        { label: 'Admission No.', value: 'AD9887402' },
        { label: 'Class & Section', value: 'X · Section B' },
        { label: 'House', value: 'Everest', badge: 'badge-soft-primary' },
        { label: 'Guardian', value: 'Mrs. Kavita Rao' },
        { label: 'Contact', value: '+1 55 2298 6614' },
      ],
      proof: {
        avatarTint: 'bg-primary-transparent text-primary',
        name: 'Ananya Rao',
        classSection: 'Class X · Section B',
        house: 'Everest',
        houseBadge: 'badge-soft-primary',
        admissionNo: 'AD9887402',
        cardNo: 'IDC-2026-0118',
        validTo: '31 Mar 2027',
        barcode: 'AD9887402-0118',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0118' },
        { label: 'Template', value: 'Senior card, blue band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '12 Jun 2026' },
        { label: 'Photograph', value: studioPhoto },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [batchPrint],
      printRuns: '1',
      printEmpty: null,
      issueEntries: [collected('16 Jun 2026 · Ms. Fatima Sheikh')],
      issuedOn: '16 Jun 2026',
      issueEmpty: null,
      replacementRows: [],
      replacementEntry: null,
      replacementEmpty: noReplacement,
      qrRows: [
        { label: 'Barcode', value: 'AD9887402-0118' },
        { label: 'Verification Code', value: '0118-7402-BX' },
        { label: 'QR Printed', value: 'Yes' },
        { label: 'Reader Access', value: 'Active' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Everest House', className: 'badge-soft-primary' },
        { label: 'Issued', className: 'badge-soft-success' },
      ],
      note: 'Card carries library and laboratory access. Reprint not required this session.',
      actions: previewPrintPanel,
    },
  },
  {
    id: 'id_02',
    avatarTint: 'bg-success-transparent text-success',
    name: 'Aarav Kumar',
    sub: 'Nilgiri House · B positive',
    admissionNo: 'AD9891255',
    className: 'Class VII',
    section: 'A',
    cardNo: 'IDC-2026-0126',
    template: 'Middle card, green band',
    house: 'Nilgiri',
    academicYear: '2026-2027',
    photograph: studioPhoto,
    generated: { date: '12 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '49 days ago', note: '2 print runs', noteClass: 'text-muted' },
    issue: { date: '22 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '39 days ago', note: 'Valid to 31 Mar 2027', noteClass: 'text-muted' },
    cardStatus: { pill: 'is-active', label: 'Reprinted', note: '2 print runs' },
    issueStatus: { badge: 'badge-soft-success', label: 'Issued', note: 'Ms. Fatima Sheikh' },
    detail: {
      profile: [
        { label: 'Student', value: 'Aarav Kumar' },
        { label: 'Admission No.', value: 'AD9891255' },
        { label: 'Class & Section', value: 'VII · Section A' },
        { label: 'House', value: 'Nilgiri', badge: 'badge-soft-success' },
        { label: 'Guardian', value: 'Mr. Rajesh Kumar' },
        { label: 'Contact', value: '+1 55 8820 3391' },
      ],
      proof: {
        avatarTint: 'bg-success-transparent text-success',
        name: 'Aarav Kumar',
        classSection: 'Class VII · Section A',
        house: 'Nilgiri',
        houseBadge: 'badge-soft-success',
        admissionNo: 'AD9891255',
        cardNo: 'IDC-2026-0126',
        validTo: '31 Mar 2027',
        barcode: 'AD9891255-0126',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0126' },
        { label: 'Template', value: 'Middle card, green band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '12 Jun 2026' },
        { label: 'Photograph', value: studioPhoto },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [
        batchPrint,
        {
          tint: 'bg-purple-transparent text-purple',
          icon: 'ti ti-printer',
          title: 'Reprint, photograph smudged on the first run',
          meta: '19 Jun 2026 · Ms. Fatima Sheikh',
        },
      ],
      printRuns: '2',
      printEmpty: null,
      issueEntries: [collected('22 Jun 2026 · Ms. Fatima Sheikh')],
      issuedOn: '22 Jun 2026',
      issueEmpty: null,
      replacementRows: [],
      replacementEntry: null,
      replacementEmpty: noReplacement,
      qrRows: [
        { label: 'Barcode', value: 'AD9891255-0126' },
        { label: 'Verification Code', value: '0126-1255-AVII' },
        { label: 'QR Printed', value: 'Yes' },
        { label: 'Reader Access', value: 'Active' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Nilgiri House', className: 'badge-soft-success' },
        { label: 'Issued', className: 'badge-soft-success' },
      ],
      note: 'First print was rejected at quality check. The reprint carries the same card number.',
      actions: previewPrintPanel,
    },
  },
  {
    id: 'id_03',
    avatarTint: 'bg-warning-transparent text-warning',
    name: 'Lisa Gourley',
    sub: 'Aravalli House · A positive',
    admissionNo: 'AD9892431',
    className: 'Class II',
    section: 'B',
    cardNo: 'IDC-2026-0131',
    template: 'Junior card, yellow band',
    house: 'Aravalli',
    academicYear: '2026-2027',
    photograph: studioPhoto,
    generated: { date: '12 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '49 days ago', note: '1 print run', noteClass: 'text-muted' },
    issue: { date: '17 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '44 days ago', note: 'Valid to 31 Mar 2027', noteClass: 'text-muted' },
    cardStatus: { pill: 'is-completed', label: 'Printed', note: 'Printed 14 Jun' },
    issueStatus: { badge: 'badge-soft-success', label: 'Issued', note: 'Mrs. Ellen Cruz' },
    detail: {
      profile: [
        { label: 'Student', value: 'Lisa Gourley' },
        { label: 'Admission No.', value: 'AD9892431' },
        { label: 'Class & Section', value: 'II · Section B' },
        { label: 'House', value: 'Aravalli', badge: 'badge-soft-warning' },
        { label: 'Guardian', value: 'Mrs. Janet Gourley' },
        { label: 'Contact', value: '+1 55 7712 4409' },
      ],
      proof: {
        avatarTint: 'bg-warning-transparent text-warning',
        name: 'Lisa Gourley',
        classSection: 'Class II · Section B',
        house: 'Aravalli',
        houseBadge: 'badge-soft-warning',
        admissionNo: 'AD9892431',
        cardNo: 'IDC-2026-0131',
        validTo: '31 Mar 2027',
        barcode: 'AD9892431-0131',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0131' },
        { label: 'Template', value: 'Junior card, yellow band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '12 Jun 2026' },
        { label: 'Photograph', value: studioPhoto },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [batchPrint],
      printRuns: '1',
      printEmpty: null,
      issueEntries: [
        {
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-circle-check',
          title: 'Handed to the guardian at the reception desk',
          meta: '17 Jun 2026 · Mrs. Ellen Cruz',
        },
      ],
      issuedOn: '17 Jun 2026',
      issueEmpty: null,
      replacementRows: [],
      replacementEntry: null,
      replacementEmpty: noReplacement,
      qrRows: [
        { label: 'Barcode', value: 'AD9892431-0131' },
        { label: 'Verification Code', value: '0131-2431-BII' },
        { label: 'QR Printed', value: 'Yes' },
        { label: 'Reader Access', value: 'Active' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Aravalli House', className: 'badge-soft-warning' },
        { label: 'Issued', className: 'badge-soft-success' },
      ],
      note: 'Junior cards are handed to the guardian rather than the student, per the junior section policy.',
      actions: previewPrintPanel,
    },
  },
  {
    id: 'id_04',
    avatarTint: 'bg-primary-transparent text-primary',
    name: 'Rohan Desai',
    sub: 'Everest House · O positive',
    admissionNo: 'AD9889014',
    className: 'Class IX',
    section: 'C',
    cardNo: 'IDC-2026-0155',
    template: 'Senior card, blue band',
    house: 'Everest',
    academicYear: '2026-2027',
    photograph: studioPhoto,
    generated: { date: '12 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '49 days ago', note: '1 print run', noteClass: 'text-muted' },
    issue: { date: '16 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '45 days ago', note: 'Blocked 20 Jul', noteClass: 'text-danger' },
    cardStatus: { pill: 'is-archived', label: 'Superseded', note: 'Replaced by IDC-2026-0241' },
    issueStatus: { badge: 'badge-soft-danger', label: 'Blocked', note: 'Superseded by IDC-2026-0241' },
    detail: {
      profile: [
        { label: 'Student', value: 'Rohan Desai' },
        { label: 'Admission No.', value: 'AD9889014' },
        { label: 'Class & Section', value: 'IX · Section C' },
        { label: 'House', value: 'Everest', badge: 'badge-soft-primary' },
        { label: 'Guardian', value: 'Mr. Nikhil Desai' },
        { label: 'Contact', value: '+1 55 7745 1102' },
      ],
      proof: {
        avatarTint: 'bg-danger-transparent text-danger',
        name: 'Rohan Desai',
        classSection: 'Class IX · Section C',
        house: 'Everest',
        houseBadge: 'badge-soft-primary',
        admissionNo: 'AD9889014',
        cardNo: 'IDC-2026-0155',
        validTo: '31 Mar 2027',
        barcode: 'AD9889014-0155',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0155' },
        { label: 'Template', value: 'Senior card, blue band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '12 Jun 2026' },
        { label: 'Photograph', value: studioPhoto },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [batchPrint],
      printRuns: '1',
      printEmpty: null,
      issueEntries: [collected('16 Jun 2026 · Ms. Fatima Sheikh')],
      issuedOn: '16 Jun 2026',
      issueEmpty: null,
      replacementRows: [
        { label: 'Status', value: 'Superseded', badge: 'badge-soft-danger' },
        { label: 'Reported Lost', value: '20 Jul 2026' },
        { label: 'Replaced By', value: 'IDC-2026-0241' },
        { label: 'Reader Access', value: 'Blocked at every reader' },
      ],
      replacementEntry: {
        tint: 'bg-danger-transparent text-danger',
        icon: 'ti ti-ban',
        title: 'Card blocked on the access registry',
        meta: '20 Jul 2026 · school office',
      },
      replacementEmpty: null,
      qrRows: [
        { label: 'Barcode', value: 'AD9889014-0155' },
        { label: 'Verification Code', value: '0155-9014-CIX' },
        { label: 'QR Printed', value: 'Yes' },
        { label: 'Reader Access', value: 'Blocked' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Everest House', className: 'badge-soft-primary' },
        { label: 'Blocked', className: 'badge-soft-danger' },
      ],
      note: 'Reported lost on the school bus on 20 Jul. Blocked at every reader and replaced by IDC-2026-0241.',
      actions: [viewDetails, openPanel],
    },
  },
  {
    id: 'id_05',
    avatarTint: 'bg-primary-transparent text-primary',
    name: 'Rohan Desai',
    sub: 'Everest House · O positive',
    admissionNo: 'AD9889014',
    className: 'Class IX',
    section: 'C',
    cardNo: 'IDC-2026-0241',
    template: 'Senior card, blue band',
    house: 'Everest',
    academicYear: '2026-2027',
    photograph: studioPhoto,
    generated: { date: '22 Jul 2026', dateClass: 'fs-13 fw-medium', ago: '9 days ago', note: '1 print run', noteClass: 'text-muted' },
    issue: { date: '27 Jul 2026', dateClass: 'fs-13 fw-medium', ago: '4 days ago', note: 'Valid to 31 Mar 2027', noteClass: 'text-muted' },
    cardStatus: { pill: 'is-completed', label: 'Printed', note: 'Printed 24 Jul' },
    issueStatus: { badge: 'badge-soft-info', label: 'Replacement Issued', note: 'Replaces IDC-2026-0155' },
    detail: {
      profile: [
        { label: 'Student', value: 'Rohan Desai' },
        { label: 'Admission No.', value: 'AD9889014' },
        { label: 'Class & Section', value: 'IX · Section C' },
        { label: 'House', value: 'Everest', badge: 'badge-soft-primary' },
        { label: 'Guardian', value: 'Mr. Nikhil Desai' },
        { label: 'Contact', value: '+1 55 7745 1102' },
      ],
      proof: {
        avatarTint: 'bg-primary-transparent text-primary',
        name: 'Rohan Desai',
        classSection: 'Class IX · Section C',
        house: 'Everest',
        houseBadge: 'badge-soft-primary',
        admissionNo: 'AD9889014',
        cardNo: 'IDC-2026-0241',
        validTo: '31 Mar 2027',
        barcode: 'AD9889014-0241',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0241' },
        { label: 'Template', value: 'Senior card, blue band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '22 Jul 2026' },
        { label: 'Photograph', value: studioPhoto },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [
        {
          tint: 'bg-purple-transparent text-purple',
          icon: 'ti ti-printer',
          title: 'Replacement print, single card',
          meta: '24 Jul 2026 · Ms. Fatima Sheikh',
        },
      ],
      printRuns: '1',
      printEmpty: null,
      issueEntries: [
        {
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-circle-check',
          title: 'Collected by the student, replacement fee paid',
          meta: '27 Jul 2026 · Ms. Fatima Sheikh',
        },
      ],
      issuedOn: '27 Jul 2026',
      issueEmpty: null,
      replacementRows: [
        { label: 'Status', value: 'Replacement', badge: 'badge-soft-info' },
        { label: 'Replaces', value: 'IDC-2026-0155' },
        { label: 'Replacement Fee', value: 'Paid at the school office' },
        { label: 'Reader Access', value: 'Active' },
      ],
      replacementEntry: {
        tint: 'bg-info-transparent text-info',
        icon: 'ti ti-refresh',
        title: 'Issued in place of IDC-2026-0155',
        meta: '27 Jul 2026 · school office',
      },
      replacementEmpty: null,
      qrRows: [
        { label: 'Barcode', value: 'AD9889014-0241' },
        { label: 'Verification Code', value: '0241-9014-CIX' },
        { label: 'QR Printed', value: 'Yes' },
        { label: 'Reader Access', value: 'Active' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Everest House', className: 'badge-soft-primary' },
        { label: 'Replacement Issued', className: 'badge-soft-info' },
      ],
      note: 'Replacement card. Asthma flag carried over from the medical register at the guardian request.',
      actions: previewPrintPanel,
    },
  },
  {
    id: 'id_06',
    avatarTint: 'bg-primary-transparent text-primary',
    name: 'Kabir Shah',
    sub: 'Everest House · B positive',
    admissionNo: 'AD9892008',
    className: 'Class VI',
    section: 'B',
    cardNo: 'IDC-2026-0163',
    template: 'Middle card, green band',
    house: 'Everest',
    academicYear: '2026-2027',
    photograph: studioPhoto,
    generated: { date: '12 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '49 days ago', note: '1 print run', noteClass: 'text-muted' },
    issue: { date: '16 Jun 2026', dateClass: 'fs-13 fw-medium', ago: '45 days ago', note: 'Lost 29 Jul', noteClass: 'text-danger' },
    cardStatus: { pill: 'is-completed', label: 'Printed', note: 'Printed 14 Jun' },
    issueStatus: { badge: 'badge-soft-danger', label: 'Reported Lost', note: 'Replacement not yet raised' },
    detail: {
      profile: [
        { label: 'Student', value: 'Kabir Shah' },
        { label: 'Admission No.', value: 'AD9892008' },
        { label: 'Class & Section', value: 'VI · Section B' },
        { label: 'House', value: 'Everest', badge: 'badge-soft-primary' },
        { label: 'Guardian', value: 'Mrs. Nita Shah' },
        { label: 'Contact', value: '+1 55 5528 9943' },
      ],
      proof: {
        avatarTint: 'bg-primary-transparent text-primary',
        name: 'Kabir Shah',
        classSection: 'Class VI · Section B',
        house: 'Everest',
        houseBadge: 'badge-soft-primary',
        admissionNo: 'AD9892008',
        cardNo: 'IDC-2026-0163',
        validTo: '31 Mar 2027',
        barcode: 'AD9892008-0163',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0163' },
        { label: 'Template', value: 'Middle card, green band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '12 Jun 2026' },
        { label: 'Photograph', value: studioPhoto },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [batchPrint],
      printRuns: '1',
      printEmpty: null,
      issueEntries: [collected('16 Jun 2026 · Ms. Fatima Sheikh')],
      issuedOn: '16 Jun 2026',
      issueEmpty: null,
      replacementRows: [
        { label: 'Status', value: 'Reported Lost', badge: 'badge-soft-danger' },
        { label: 'Reported On', value: '29 Jul 2026' },
        { label: 'Replacement', value: 'Not yet raised' },
        { label: 'Reader Access', value: 'Blocked at every reader' },
      ],
      replacementEntry: {
        tint: 'bg-danger-transparent text-danger',
        icon: 'ti ti-alert-triangle',
        title: 'Replacement request pending',
        meta: 'Reported 29 Jul 2026 · 2 days ago',
      },
      replacementEmpty: null,
      qrRows: [
        { label: 'Barcode', value: 'AD9892008-0163' },
        { label: 'Verification Code', value: '0163-2008-BVI' },
        { label: 'QR Printed', value: 'Yes' },
        { label: 'Reader Access', value: 'Blocked' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Everest House', className: 'badge-soft-primary' },
        { label: 'Reported Lost', className: 'badge-soft-danger' },
      ],
      note: 'Reported lost on 29 Jul. The card is blocked at every reader and a replacement has not been raised yet.',
      actions: [
        { label: 'Replace Card', icon: 'ti ti-refresh', className: 'btn btn-primary btn-sm', action: 'replace' },
        viewDetails,
        openPanel,
      ],
    },
  },
  {
    id: 'id_07',
    avatarTint: 'bg-success-transparent text-success',
    name: 'Meera Iyer',
    sub: 'Nilgiri House · A positive',
    admissionNo: 'AD9893660',
    className: 'Class V',
    section: 'A',
    cardNo: 'IDC-2026-0248',
    template: 'Junior card, yellow band',
    house: 'Nilgiri',
    academicYear: '2026-2027',
    photograph: 'Retake, 24 Jul 2026',
    generated: { date: '28 Jul 2026', dateClass: 'fs-13 fw-medium', ago: '3 days ago', note: '0 print runs', noteClass: 'text-muted' },
    issue: { date: '—', dateClass: 'fs-13 text-muted', note: 'Awaiting the print run', noteClass: 'text-warning' },
    cardStatus: { pill: 'is-pending', label: 'Print Queued', note: 'Generated 28 Jul' },
    issueStatus: { badge: 'badge-soft-secondary', label: 'Pending Print', note: 'In the next batch run' },
    detail: {
      profile: [
        { label: 'Student', value: 'Meera Iyer' },
        { label: 'Admission No.', value: 'AD9893660' },
        { label: 'Class & Section', value: 'V · Section A' },
        { label: 'House', value: 'Nilgiri', badge: 'badge-soft-success' },
        { label: 'Guardian', value: 'Mrs. Latha Iyer' },
        { label: 'Contact', value: '+1 55 3390 8827' },
      ],
      proof: {
        avatarTint: 'bg-success-transparent text-success',
        name: 'Meera Iyer',
        classSection: 'Class V · Section A',
        house: 'Nilgiri',
        houseBadge: 'badge-soft-success',
        admissionNo: 'AD9893660',
        cardNo: 'IDC-2026-0248',
        validTo: '31 Mar 2027',
        barcode: 'AD9893660-0248',
      },
      proofEmpty: null,
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0248' },
        { label: 'Template', value: 'Junior card, yellow band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: '28 Jul 2026' },
        { label: 'Photograph', value: 'Retake, 24 Jul 2026' },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [],
      printRuns: null,
      printEmpty: {
        tint: 'bg-warning-transparent text-warning',
        icon: 'ti ti-printer-off',
        title: 'Not printed yet',
        hint: 'Queued for the next batch run',
      },
      issueEntries: [],
      issuedOn: null,
      issueEmpty: notIssued,
      replacementRows: [],
      replacementEntry: null,
      replacementEmpty: noReplacement,
      qrRows: [
        { label: 'Barcode', value: 'AD9893660-0248' },
        { label: 'Verification Code', value: '0248-3660-AV' },
        { label: 'QR Printed', value: 'On the next print run' },
        { label: 'Reader Access', value: 'Active' },
        ...readerRows,
      ],
      qrEmpty: null,
      noteBadges: [
        { label: 'Nilgiri House', className: 'badge-soft-success' },
        { label: 'Pending Print', className: 'badge-soft-secondary' },
      ],
      note: 'Photograph retaken after a change of spectacles. Queued for the next batch print run on 4 Aug.',
      actions: [
        { label: 'Print Card', icon: 'ti ti-printer', className: 'btn btn-primary btn-sm', action: 'print' },
        { label: 'Preview', icon: 'ti ti-photo', className: 'btn btn-outline-light bg-white btn-sm', action: 'preview' },
        openPanel,
      ],
    },
  },
  {
    id: 'id_08',
    avatarTint: 'bg-purple-transparent text-purple',
    name: 'Ishaan Verma',
    sub: 'Vindhya House · AB positive',
    admissionNo: 'AD9894107',
    className: 'Class IV',
    section: 'A',
    cardNo: 'IDC-2026-0252',
    template: 'Junior card, yellow band',
    house: 'Vindhya',
    academicYear: '2026-2027',
    photograph: 'Not on file',
    generated: { date: '—', dateClass: 'fs-13 text-muted', note: 'Photograph required', noteClass: 'text-warning' },
    issue: { date: '—', dateClass: 'fs-13 text-muted', note: 'Awaiting the print run', noteClass: 'text-warning' },
    cardStatus: { pill: 'is-inactive', label: 'Not Generated', note: 'Number reserved' },
    issueStatus: { badge: 'badge-soft-secondary', label: 'Not Generated', note: 'Awaiting a photograph' },
    detail: {
      profile: [
        { label: 'Student', value: 'Ishaan Verma' },
        { label: 'Admission No.', value: 'AD9894107' },
        { label: 'Class & Section', value: 'IV · Section A' },
        { label: 'House', value: 'Vindhya', badge: 'badge-soft-purple' },
        { label: 'Guardian', value: 'Mr. Suresh Verma' },
        { label: 'Contact', value: '+1 55 4417 2230' },
      ],
      proof: null,
      proofEmpty: {
        tint: 'bg-secondary-transparent text-secondary',
        icon: 'ti ti-photo-off',
        title: 'No card proof yet',
        hint: 'A studio photograph is required first',
      },
      cardInfo: [
        { label: 'Card No.', value: 'IDC-2026-0252' },
        { label: 'Template', value: 'Junior card, yellow band' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Generated On', value: 'Not generated' },
        { label: 'Photograph', value: 'Not on file' },
        { label: 'Valid To', value: '31 Mar 2027' },
      ],
      printEntries: [],
      printRuns: null,
      printEmpty: {
        tint: 'bg-warning-transparent text-warning',
        icon: 'ti ti-printer-off',
        title: 'Not printed yet',
        hint: 'Card has not been generated',
      },
      issueEntries: [],
      issuedOn: null,
      issueEmpty: notIssued,
      replacementRows: [],
      replacementEntry: null,
      replacementEmpty: noReplacement,
      qrRows: [],
      qrEmpty: {
        tint: 'bg-secondary-transparent text-secondary',
        icon: 'ti ti-qrcode',
        title: 'No code assigned',
        hint: 'Generated with the card',
      },
      noteBadges: [
        { label: 'Vindhya House', className: 'badge-soft-purple' },
        { label: 'Not Generated', className: 'badge-soft-secondary' },
      ],
      note: 'Mid term admission. The card cannot be generated until a studio photograph is uploaded.',
      actions: [
        { label: 'Generate Card', icon: 'ti ti-id', className: 'btn btn-primary btn-sm', action: 'generate' },
        viewDetails,
        openPanel,
      ],
    },
  },
];
