export const classOptions = [
  'Class II',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class IX',
  'Class X',
];

export const sectionOptions = ['A', 'B', 'C'];

export const bulkClassOptions = ['All classes', ...classOptions];

export const bulkSectionOptions = ['All sections', ...sectionOptions];

export const templateOptions = [
  'Junior card, yellow band',
  'Middle card, green band',
  'Senior card, blue band',
  'Staff card, grey band',
];

export const houseOptions = ['Everest', 'Nilgiri', 'Aravalli', 'Vindhya'];

export const bloodGroupOptions = ['O positive', 'A positive', 'B positive', 'AB positive'];

export const academicYearOptions = ['2026-2027', '2025-2026'];

export const signatureOptions = ['Principal', 'Mrs. Alice Ray · Chief Warden', 'Class Teacher'];

export const readerAccessOptions = [
  'Gate, library and laboratory',
  'Gate and library',
  'Gate only',
];

export const staffOptions = [
  'Ms. Fatima Sheikh · School Office',
  'Ms. Dana Ruiz · Administration',
  'Mrs. Ellen Cruz · Class Teacher',
];

export const sheetLayoutOptions = [
  '8 cards per A4 sheet',
  '4 cards per A4 sheet',
  'Single card, PVC blank',
];

/** The card picker shared by the Print, Issue and Replace dialogs. */
export const cardOptions = [
  'IDC-2026-0118 · Ananya Rao',
  'IDC-2026-0126 · Aarav Kumar',
  'IDC-2026-0131 · Lisa Gourley',
  'IDC-2026-0155 · Rohan Desai',
  'IDC-2026-0241 · Rohan Desai',
  'IDC-2026-0163 · Kabir Shah',
  'IDC-2026-0248 · Meera Iyer',
  'IDC-2026-0252 · Ishaan Verma',
];

export interface SegmentOption {
  id: string;
  label: string;
  icon?: string;
}

export const generateTemplates: SegmentOption[] = [
  { id: 'gidJunior', label: 'Junior' },
  { id: 'gidMiddle', label: 'Middle' },
  { id: 'gidSenior', label: 'Senior' },
];

export const bulkSelections: SegmentOption[] = [
  { id: 'blkClass', label: 'By Class' },
  { id: 'blkSection', label: 'By Section' },
  { id: 'blkNew', label: 'New Admissions' },
];

export const printJobs: SegmentOption[] = [
  { id: 'pidSingle', label: 'Single Card' },
  { id: 'pidBatch', label: 'Batch Run' },
  { id: 'pidProof', label: 'Paper Proof' },
];

export const handedToOptions: SegmentOption[] = [
  { id: 'issStudent', label: 'Student', icon: 'ti ti-user' },
  { id: 'issGuardian', label: 'Guardian', icon: 'ti ti-users' },
  { id: 'issTeacher', label: 'Class Teacher', icon: 'ti ti-school' },
];

export const replacementReasons: SegmentOption[] = [
  { id: 'repLost', label: 'Lost' },
  { id: 'repDamaged', label: 'Damaged' },
  { id: 'repDetail', label: 'Detail Change' },
];

/** Preset dates the dialogs ship with, in the template's `DD-MM-YYYY` form. */
export const modalDates = {
  validTo: '31-03-2027',
  generatedOn: '31-07-2026',
  printDate: '04-08-2026',
  issueDate: '31-07-2026',
  reportedOn: '29-07-2026',
};

export const printRunReference = 'BR-2026-021';

/** "View ID Card Details" — the four milestone tiles. */
export const viewMilestones = [
  { id: 'generated', tint: 'bg-info-transparent text-info', icon: 'ti ti-id', label: 'Generated', value: '12 Jun 2026' },
  { id: 'printed', tint: 'bg-purple-transparent text-purple', icon: 'ti ti-printer', label: 'Printed', value: '14 Jun 2026' },
  { id: 'issued', tint: 'bg-success-transparent text-success', icon: 'ti ti-circle-check', label: 'Issued', value: '16 Jun 2026' },
  { id: 'valid', tint: 'bg-warning-transparent text-warning', icon: 'ti ti-calendar-event', label: 'Valid To', value: '31 Mar 2027' },
];

export interface LabelledValue {
  label: string;
  value: string;
  badge?: string;
}

export const viewCardInformation: LabelledValue[] = [
  { label: 'Template', value: 'Senior card, blue band', badge: 'badge-soft-info' },
  { label: 'Photograph', value: 'Studio, 12 May 2026' },
  { label: 'Print Runs', value: '1 run' },
  { label: 'Replacements', value: 'None' },
];

export const viewVerification: LabelledValue[] = [
  { label: 'Barcode', value: 'AD9887402-0118' },
  { label: 'Verification Code', value: '0118-7402-BX' },
  { label: 'Gate Reader', value: 'Active', badge: 'badge-soft-success' },
  { label: 'Library Reader', value: 'Active', badge: 'badge-soft-success' },
];

export interface LifecycleRow {
  date: string;
  event: string;
  eventBadge: string;
  by: string;
}

export const viewLifecycle: LifecycleRow[] = [
  { date: '12 Jun 2026', event: 'Generated', eventBadge: 'badge-soft-info', by: 'Ms. Fatima Sheikh' },
  { date: '14 Jun 2026', event: 'Printed · BR-2026-014', eventBadge: 'badge-soft-purple', by: 'Ms. Fatima Sheikh' },
  { date: '16 Jun 2026', event: 'Issued to the student', eventBadge: 'badge-soft-success', by: 'Ms. Fatima Sheikh' },
  { date: '16 Jun 2026', event: 'Reader access activated', eventBadge: 'badge-soft-success', by: 'Automated' },
];

/* ------------------------- ID Card Details offcanvas ------------------------ */

export const panelStudentRows: LabelledValue[] = [
  { label: 'House', value: 'Everest', badge: 'badge-soft-primary' },
  { label: 'Blood Group', value: 'O positive' },
  { label: 'Guardian', value: 'Mr. Nikhil Desai' },
  { label: 'Emergency', value: '+1 55 7745 1102' },
];

export const panelConfigurationRows: LabelledValue[] = [
  { label: 'Template', value: 'Senior card, blue band' },
  { label: 'Replaces', value: 'IDC-2026-0155' },
  { label: 'Reader Access', value: 'Gate, library and laboratory' },
  { label: 'Medical Flag', value: 'Asthma', badge: 'badge-soft-warning' },
];

export const panelMilestones = [
  { id: 'generated', label: 'Generated', value: '22 Jul', valueClass: 'fs-14 mb-0' },
  { id: 'printed', label: 'Printed', value: '24 Jul', valueClass: 'fs-14 mb-0' },
  { id: 'issued', label: 'Issued', value: '27 Jul', valueClass: 'fs-14 mb-0 text-success' },
];

export interface PanelEvent {
  tint: string;
  icon: string;
  title: string;
  meta: string;
}

export const panelTimeline: PanelEvent[] = [
  {
    tint: 'bg-danger-transparent text-danger',
    icon: 'ti ti-alert-triangle',
    title: 'IDC-2026-0155 reported lost',
    meta: '20 Jul 2026 · lost on the school bus',
  },
  {
    tint: 'bg-info-transparent text-info',
    icon: 'ti ti-id',
    title: 'Replacement generated',
    meta: '22 Jul 2026 · Ms. Fatima Sheikh',
  },
  {
    tint: 'bg-purple-transparent text-purple',
    icon: 'ti ti-printer',
    title: 'Single card printed',
    meta: '24 Jul 2026 · replacement run',
  },
  {
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-circle-check',
    title: 'Collected by the student',
    meta: '27 Jul 2026 · replacement fee paid',
  },
];

export interface ReaderRow {
  reader: string;
  scope: string;
  status: string;
  badge: string;
}

export const panelReaders: ReaderRow[] = [
  { reader: 'Main Gate', scope: 'Turnstile lanes 1 to 3', status: 'Active', badge: 'badge-soft-success' },
  { reader: 'Library', scope: 'Circulation desk', status: 'Active', badge: 'badge-soft-success' },
  { reader: 'IDC-2026-0155', scope: 'All readers', status: 'Blocked', badge: 'badge-soft-danger' },
];

export const panelAudit: PanelEvent[] = [
  {
    tint: 'bg-primary-transparent text-primary',
    icon: 'ti ti-plus',
    title: 'Replacement record created',
    meta: '22 Jul 2026 · school office',
  },
  {
    tint: 'bg-danger-transparent text-danger',
    icon: 'ti ti-ban',
    title: 'Old card blocked at every reader',
    meta: '22 Jul 2026 · automated',
  },
  {
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-link',
    title: 'Medical flag carried over',
    meta: '22 Jul 2026 · guardian request',
  },
];
