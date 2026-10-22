export interface PanelRow {
  label: string;
  value: string;
  badgeClass?: string;
  /** The event row is the only one the template right-aligns. */
  alignEnd?: boolean;
}

export interface PanelTile {
  label: string;
  value: string;
  valueClass?: string;
}

export interface PanelEntry {
  id: string;
  tint: string;
  icon: string;
  title: string;
  meta: string;
  /** Documents carry a download button; timeline and audit rows do not. */
  download?: string;
  /** The template truncates the document titles only. */
  truncate?: boolean;
  last?: boolean;
}

export interface AchievementPanelData {
  student: string;
  meta: string;
  status: string;
  studentRows: PanelRow[];
  summaryRows: PanelRow[];
  tiles: PanelTile[];
  awardRows: PanelRow[];
  documents: PanelEntry[];
  timeline: PanelEntry[];
  audit: PanelEntry[];
}

export const achievementPanel: AchievementPanelData = {
  student: 'Ananya Rao',
  meta: 'AD9887402 · Class X B',
  status: 'Certificate Issued',
  studentRows: [
    { label: 'Academic Year', value: '2026-2027' },
    { label: 'Awards This Year', value: '3 on the register' },
    { label: 'Recognition Points', value: '65 points' },
    { label: 'House', value: 'Everest', badgeClass: 'badge-soft-primary' },
  ],
  summaryRows: [
    { label: 'Achievement ID', value: 'ACH-2026-0218' },
    { label: 'Category', value: 'Competition', badgeClass: 'badge-soft-warning' },
    { label: 'Event', value: 'State Science Exhibition', alignEnd: true },
    { label: 'Mentor', value: 'Mr. Vikram Sethi' },
  ],
  tiles: [
    { label: 'Level', value: 'State', valueClass: 'text-warning' },
    { label: 'Placing', value: 'Winner', valueClass: 'text-success' },
    { label: 'Points', value: '35' },
  ],
  awardRows: [
    { label: 'Issued By', value: 'State Science Council' },
    { label: 'Awarded On', value: '18 Jul 2026' },
    { label: 'Certificate No.', value: 'SSC-2026-0417' },
    { label: 'On Report Card', value: 'Yes', badgeClass: 'badge-soft-success' },
  ],
  documents: [
    {
      id: 'certificate',
      tint: 'bg-success-transparent text-success',
      icon: 'ti ti-certificate',
      title: 'State Science Certificate.pdf',
      meta: 'SSC-2026-0417 · 96 KB',
      download: 'Download certificate',
      truncate: true,
    },
    {
      id: 'report',
      tint: 'bg-danger-transparent text-danger',
      icon: 'ti ti-file-type-pdf',
      title: 'Project Report.pdf',
      meta: 'Water filtration study · 214 KB',
      download: 'Download report',
      truncate: true,
      last: true,
    },
  ],
  timeline: [
    {
      id: 'held',
      tint: 'bg-primary-transparent text-primary',
      icon: 'ti ti-calendar-event',
      title: 'Exhibition held',
      meta: '17 Jul 2026 · Civic Convention Centre',
    },
    {
      id: 'announced',
      tint: 'bg-warning-transparent text-warning',
      icon: 'ti ti-trophy',
      title: 'First place announced',
      meta: '18 Jul 2026 · State Science Council',
    },
    {
      id: 'verified',
      tint: 'bg-info-transparent text-info',
      icon: 'ti ti-check',
      title: 'Result verified by the school',
      meta: '20 Jul 2026 · Mrs. Alice Ray',
    },
    {
      id: 'filed',
      tint: 'bg-success-transparent text-success',
      icon: 'ti ti-certificate',
      title: 'Certificate received and filed',
      meta: '22 Jul 2026 · SSC-2026-0417',
      last: true,
    },
  ],
  audit: [
    {
      id: 'created',
      tint: 'bg-primary-transparent text-primary',
      icon: 'ti ti-plus',
      title: 'Achievement record created',
      meta: '18 Jul 2026 · Mr. Vikram Sethi',
    },
    {
      id: 'attached',
      tint: 'bg-info-transparent text-info',
      icon: 'ti ti-link',
      title: 'Certificate attached to the record',
      meta: '22 Jul 2026 · school office',
    },
    {
      id: 'printed',
      tint: 'bg-secondary-transparent text-secondary',
      icon: 'ti ti-printer',
      title: 'Merit card printed for the assembly',
      meta: '24 Jul 2026 · one copy',
      last: true,
    },
  ],
};
