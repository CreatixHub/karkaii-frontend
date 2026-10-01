export interface RadioChoice {
  id: string;
  label: string;
  icon?: string;
}

export const categoryChoices: RadioChoice[] = [
  { id: 'adaAcad', label: 'Academic', icon: 'ti ti-school' },
  { id: 'adaSport', label: 'Sports', icon: 'ti ti-medal' },
  { id: 'adaCult', label: 'Cultural', icon: 'ti ti-music' },
  { id: 'adaComp', label: 'Competition', icon: 'ti ti-award' },
];

export const documentTypeChoices: RadioChoice[] = [
  { id: 'upcCert', label: 'Certificate', icon: 'ti ti-certificate' },
  { id: 'upcResult', label: 'Result Sheet', icon: 'ti ti-file-text' },
  { id: 'upcPhoto', label: 'Photograph', icon: 'ti ti-photo' },
];

export const nominationScopeChoices: RadioChoice[] = [
  { id: 'nomSchool', label: 'School Award' },
  { id: 'nomExternal', label: 'External Contest' },
  { id: 'nomScholar', label: 'Scholarship' },
];

export const printTemplateChoices: RadioChoice[] = [
  { id: 'prnCert', label: 'Certificate', icon: 'ti ti-certificate' },
  { id: 'prnMerit', label: 'Merit Card', icon: 'ti ti-award' },
  { id: 'prnList', label: 'Assembly List', icon: 'ti ti-list' },
];

/* ------------------------------ Summary cards ------------------------------- */

export interface DialogSummaryRow {
  label: string;
  value: string;
}

export interface DialogSummary {
  tint: string;
  icon: string;
  name: string;
  meta: string;
  asideLabel: string;
  asideBadge: string;
  asideBadgeClass: string;
  rows: DialogSummaryRow[];
  footerLabel: string;
  footerValue: string;
  footerValueClass: string;
}

export const uploadSummary: DialogSummary = {
  tint: 'bg-success-transparent text-success',
  icon: 'ti ti-medal',
  name: 'Aarav Kumar',
  meta: 'ACH-2026-0221 · Class VII A',
  asideLabel: 'Status',
  asideBadge: 'Verified',
  asideBadgeClass: 'badge-soft-success',
  rows: [
    { label: 'Award', value: '200m Runner-Up · District' },
    { label: 'Awarded On', value: '24 Jul 2026' },
  ],
  footerLabel: 'Certificate',
  footerValue: 'Not yet received',
  footerValueClass: 'text-warning',
};

export const nominateSummary: DialogSummary = {
  tint: 'bg-purple-transparent text-purple',
  icon: 'ti ti-music',
  name: 'Ishaan Verma',
  meta: 'ACH-2026-0242 · Class IV A',
  asideLabel: 'Level',
  asideBadge: 'International',
  asideBadgeClass: 'badge-soft-purple',
  rows: [
    { label: 'Contest', value: 'International Junior Art Contest' },
    { label: 'Entry', value: 'Watercolour · Water and Life' },
  ],
  footerLabel: 'Result Due',
  footerValue: '12 Aug 2026',
  footerValueClass: 'text-info',
};

export interface PrintSummary {
  name: string;
  title: string;
  badges: { className: string; label: string }[];
}

export const printSummary: PrintSummary = {
  name: 'Ananya Rao',
  title: 'State Science Exhibition — First Place',
  badges: [
    { className: 'badge-soft-warning', label: 'State' },
    { className: 'badge-soft-success', label: 'Certificate SSC-2026-0417' },
    { className: 'badge-soft-secondary', label: '35 points' },
  ],
};

/* -------------------------- View Achievement Details ------------------------ */

export interface ViewTile {
  id: string;
  tint: string;
  icon: string;
  label: string;
  value: string;
}

export interface ViewRow {
  label: string;
  value: string;
  badgeClass?: string;
}

export interface ViewHistoryRow {
  id: string;
  date: string;
  achievement: string;
  level: { label: string; className: string };
  points: string;
}

export interface ViewDoc {
  id: string;
  tint: string;
  icon: string;
  title: string;
  meta: string;
  download: string;
  last?: boolean;
}

export const viewAchievement = {
  id: 'ACH-2026-0218',
  headerMeta: ['Ananya Rao', 'Class X B', '18 Jul 2026'],
  student: 'Ananya Rao',
  studentMeta: 'AD9887402 · Class X B · mentor Mr. Vikram Sethi',
  status: 'Certificate Issued',
  tiles: [
    {
      id: 'level',
      tint: 'bg-warning-transparent text-warning',
      icon: 'ti ti-award',
      label: 'Level',
      value: 'State',
    },
    {
      id: 'placing',
      tint: 'bg-success-transparent text-success',
      icon: 'ti ti-trophy',
      label: 'Placing',
      value: 'Winner',
    },
    {
      id: 'points',
      tint: 'bg-primary-transparent text-primary',
      icon: 'ti ti-star',
      label: 'Points',
      value: '35 of 65',
    },
    {
      id: 'certificate',
      tint: 'bg-purple-transparent text-purple',
      icon: 'ti ti-certificate',
      label: 'Certificate',
      value: 'SSC-2026-0417',
    },
  ] as ViewTile[],
  achievementRows: [
    { label: 'Category', value: 'Competition', badgeClass: 'badge-soft-warning' },
    { label: 'Award Date', value: '18 Jul 2026' },
    { label: 'Verified By', value: 'Mrs. Alice Ray' },
    { label: 'Academic Year', value: '2026-2027' },
  ] as ViewRow[],
  eventRows: [
    { label: 'Event', value: 'Science Exhibition 2026' },
    { label: 'Organiser', value: 'State Science Council' },
    { label: 'Held On', value: '17 Jul 2026' },
    { label: 'Entry', value: 'Water filtration study' },
  ] as ViewRow[],
  history: [
    {
      id: 'state',
      date: '18 Jul 2026',
      achievement: 'State Science Exhibition — First Place',
      level: { label: 'State', className: 'badge-soft-warning' },
      points: '35',
    },
    {
      id: 'district',
      date: '12 Mar 2026',
      achievement: 'District Science Fair — First Place',
      level: { label: 'District', className: 'badge-soft-primary' },
      points: '20',
    },
    {
      id: 'school',
      date: '8 Nov 2025',
      achievement: 'School Science Quiz — Winner',
      level: { label: 'School', className: 'badge-soft-info' },
      points: '10',
    },
  ] as ViewHistoryRow[],
  documents: [
    {
      id: 'certificate',
      tint: 'bg-success-transparent text-success',
      icon: 'ti ti-certificate',
      title: 'Certificate SSC-2026-0417',
      meta: 'Issued 22 Jul 2026 by the State Science Council',
      download: 'Download certificate',
    },
    {
      id: 'report',
      tint: 'bg-danger-transparent text-danger',
      icon: 'ti ti-file-type-pdf',
      title: 'Project Report.pdf',
      meta: 'Water filtration study · 214 KB',
      download: 'Download report',
      last: true,
    },
  ] as ViewDoc[],
  remarks:
    'Selected for the national round in October. The project drew a special mention from the judging panel.',
};
