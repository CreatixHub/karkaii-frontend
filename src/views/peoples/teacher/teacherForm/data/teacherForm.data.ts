export type FieldKind = 'text' | 'email' | 'select' | 'date' | 'textarea' | 'tags';

export interface FormFieldSpec {
  id: string;
  label: string;
  kind: FieldKind;
  /** Bootstrap column classes exactly as the template has them. */
  col: string;
  /** `edit-teacher.html` overrides the column for Notes only. */
  editCol?: string;
  /** `<option>` text, in template order; the first entry is the placeholder. */
  options?: string[];
  rows?: number;
  placeholder?: string;
}

export interface FormSectionSpec {
  key: string;
  /** Tabler icon class on the card header's round avatar. */
  icon: string;
  title: string;
  /** The `.row` wrapping the section's fields — the template varies it. */
  rowClass: string;
  /** Personal Information alone leads with the avatar / photo uploader. */
  photoUpload?: boolean;
  fields: FormFieldSpec[];
}

/* The four column recipes the template reuses across the nine cards. */
const COL_PERSONAL = 'col-xxl col-xl-3 col-md-6';
const COL_PERSONAL_FIXED = 'col-xxl-3 col-xl-3 col-md-6';
const COL_THIRD = 'col-lg-4 col-md-6';
const COL_QUARTER = 'col-lg-3 col-md-6';
const COL_SOCIAL = 'col-xxl col-xl-3 col-lg-4 col-md-6';

export const personalFields: FormFieldSpec[] = [
  { id: 'teacher-id', label: 'Teacher ID', kind: 'text', col: COL_PERSONAL },
  { id: 'first-name', label: 'First Name', kind: 'text', col: COL_PERSONAL },
  { id: 'last-name', label: 'Last Name', kind: 'text', col: COL_PERSONAL },
  { id: 'class', label: 'Class', kind: 'select', col: COL_PERSONAL, options: ['Select', 'III A', 'II (A)', 'VI (A)', 'VIII'] },
  { id: 'subject', label: 'Subject', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Physics', 'Computer', 'English', 'Spanish'] },
  { id: 'gender', label: 'Gender', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Male', 'Female'] },
  { id: 'primary-contact-number', label: 'Primary Contact Number', kind: 'text', col: COL_PERSONAL },
  { id: 'email-address', label: 'Email Address', kind: 'email', col: COL_PERSONAL },
  { id: 'blood-group', label: 'Blood Group', kind: 'select', col: COL_PERSONAL, options: ['Select', 'O +ve', 'B +ve', 'B -ve'] },
  { id: 'date-of-joining', label: 'Date of Joining', kind: 'date', col: COL_PERSONAL },
  { id: 'father-s-name', label: 'Father’s Name', kind: 'text', col: COL_PERSONAL },
  { id: 'mother-s-name', label: 'Mother’s Name', kind: 'text', col: COL_PERSONAL },
  { id: 'date-of-birth', label: 'Date of Birth', kind: 'date', col: COL_PERSONAL },
  { id: 'marital-status', label: 'Marital Status', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Single', 'Married'] },
  { id: 'language-known', label: 'Language Known', kind: 'tags', col: COL_PERSONAL },
  { id: 'qualification', label: 'Qualification', kind: 'text', col: COL_PERSONAL },
  { id: 'work-experience', label: 'Work Experience', kind: 'text', col: COL_PERSONAL },
  { id: 'previous-school-if-any', label: 'Previous School if Any', kind: 'text', col: COL_PERSONAL },
  { id: 'previous-school-address', label: 'Previous School Address', kind: 'text', col: COL_PERSONAL },
  { id: 'previous-school-phone-no', label: 'Previous School Phone No', kind: 'text', col: COL_PERSONAL },
  { id: 'address', label: 'Address', kind: 'text', col: COL_PERSONAL_FIXED },
  { id: 'permanent-address', label: 'Permanent Address', kind: 'text', col: COL_PERSONAL_FIXED },
  { id: 'pan-number-id-number', label: 'PAN Number / ID Number', kind: 'text', col: COL_PERSONAL_FIXED },
  { id: 'status', label: 'Status', kind: 'select', col: COL_PERSONAL_FIXED, options: ['Select', 'Active', 'Inactive'] },
  {
    id: 'notes',
    label: 'Notes',
    kind: 'textarea',
    col: 'col-12 col-xxl-12 col-xl-12',
    editCol: 'col-lg-12',
    rows: 4,
    placeholder: 'Other Information',
  },
];

export const payrollFields: FormFieldSpec[] = [
  { id: 'epf-no', label: 'EPF No', kind: 'text', col: COL_THIRD },
  { id: 'basic-salary', label: 'Basic Salary', kind: 'text', col: COL_THIRD },
  { id: 'contract-type', label: 'Contract Type', kind: 'select', col: COL_THIRD, options: ['Select', 'Permanent', 'Temporary'] },
  { id: 'work-shift', label: 'Work Shift', kind: 'select', col: COL_THIRD, options: ['Select', 'Morning', 'Afternoon'] },
  { id: 'work-location', label: 'Work Location', kind: 'text', col: COL_THIRD },
  { id: 'date-of-leaving', label: 'Date of Leaving', kind: 'date', col: COL_THIRD },
];

export const leaveFields: FormFieldSpec[] = [
  { id: 'medical-leaves', label: 'Medical Leaves', kind: 'text', col: COL_QUARTER },
  { id: 'casual-leaves', label: 'Casual Leaves', kind: 'text', col: COL_QUARTER },
  { id: 'maternity-leaves', label: 'Maternity Leaves', kind: 'text', col: COL_QUARTER },
  { id: 'sick-leaves', label: 'Sick Leaves', kind: 'text', col: COL_QUARTER },
];

export const bankFields: FormFieldSpec[] = [
  { id: 'account-name', label: 'Account Name', kind: 'text', col: COL_THIRD },
  { id: 'account-number', label: 'Account Number', kind: 'text', col: COL_THIRD },
  { id: 'bank-name', label: 'Bank Name', kind: 'text', col: COL_THIRD },
  { id: 'ifsc-code', label: 'IFSC Code', kind: 'text', col: COL_THIRD },
  { id: 'branch-name', label: 'Branch Name', kind: 'text', col: COL_THIRD },
];

export const transportFields: FormFieldSpec[] = [
  { id: 'route', label: 'Route', kind: 'select', col: COL_THIRD, options: ['Select', 'Newyork', 'Denver', 'Chicago'] },
  { id: 'vehicle-number', label: 'Vehicle Number', kind: 'select', col: COL_THIRD, options: ['Select', 'AM 54548', 'AM 64528', 'AM 123548'] },
  { id: 'pickup-point', label: 'Pickup Point', kind: 'select', col: COL_THIRD, options: ['Select', 'Cincinatti', 'Illinois', 'Morgan'] },
];

export const hostelFields: FormFieldSpec[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', col: 'col-md-6', options: ['Select', 'Phoenix Residence', 'Tranquil Haven', 'Radiant Towers', 'Nova Nest'] },
  { id: 'room-no', label: 'Room No', kind: 'select', col: 'col-md-6', options: ['Select', '20', '22', '24', '26'] },
];

export const socialFields: FormFieldSpec[] = [
  { id: 'facebook', label: 'Facebook', kind: 'text', col: COL_SOCIAL },
  { id: 'instagram', label: 'Instagram', kind: 'text', col: COL_SOCIAL },
  { id: 'linked-in', label: 'Linked In', kind: 'text', col: COL_SOCIAL },
  { id: 'youtube', label: 'Youtube', kind: 'text', col: COL_SOCIAL },
  { id: 'twitter-url', label: 'Twitter URL', kind: 'text', col: COL_SOCIAL },
];

/**
 * The seven field-driven cards, in template order. Documents and Password have
 * bespoke bodies (file pickers / `.pass-group`) and live in `index.tsx`.
 */
export const formSections: FormSectionSpec[] = [
  {
    key: 'personal',
    icon: 'ti ti-info-square-rounded',
    title: 'Personal Information',
    // The template's own class list — five columns from xxl, six from md.
    rowClass: 'row row-cols-xxl-5 row-cols-md-6',
    photoUpload: true,
    fields: personalFields,
  },
  { key: 'payroll', icon: 'ti ti-user-shield', title: 'Payroll', rowClass: 'row', fields: payrollFields },
  { key: 'leaves', icon: 'ti ti-users', title: 'Leaves', rowClass: 'row', fields: leaveFields },
  { key: 'bank', icon: 'ti ti-map', title: 'Bank Account Detail', rowClass: 'row', fields: bankFields },
  { key: 'transport', icon: 'ti ti-bus-stop', title: 'Transport Information', rowClass: 'row', fields: transportFields },
  { key: 'hostel', icon: 'ti ti-building-fortress', title: 'Hostel Information', rowClass: 'row', fields: hostelFields },
  {
    key: 'social',
    icon: 'ti ti-building',
    title: 'Social Media Links',
    // `rows-cols-xxl-5` is the template's own typo — kept so the markup matches.
    rowClass: 'row rows-cols-xxl-5',
    fields: socialFields,
  },
];

/** The Documents card: two PDF pickers whose filename line the template hardcodes. */
export interface DocumentUploadSpec {
  key: string;
  label: string;
  /** Copy inside the `.drag-upload-btn`, which doubles as the input's aria-label. */
  button: string;
  /** The `<p class="mb-2">` the template ships next to the picker. */
  fileName: string;
}

export const documentUploads: DocumentUploadSpec[] = [
  { key: 'resume', label: 'Upload Resume', button: 'Change', fileName: 'Resume.pdf' },
  { key: 'joining-letter', label: 'Upload Joining Letter', button: 'Upload Document', fileName: 'Resume.pdf' },
];

/** The Password card's two `.pass-group` inputs. */
export const passwordFields = [
  { id: 'new-password', label: 'New Password' },
  { id: 'confirm-password', label: 'Confirm Password' },
];

export const documentsSection = { icon: 'ti ti-file', title: 'Documents' };
export const passwordSection = { icon: 'ti ti-file', title: 'Password' };

/**
 * `add-teacher.html` already ships one prefill: the tags input carries
 * `value="English, Spanish"`, so both modes start with it.
 */
export const BASE_DEFAULTS: Record<string, string> = {
  'language-known': 'English, Spanish',
};

/**
 * Every `value=` / `<option selected>` in `edit-teacher.html`, keyed by field id
 * — the Teresa / T849126 record. `last-name`, `medical-leaves` and
 * `maternity-leaves` are the only controls the edit page leaves blank.
 */
export const EDIT_DEFAULTS: Record<string, string> = {
  // Personal Information
  'teacher-id': 'T849126',
  'first-name': 'Teresa',
  class: 'III A',
  subject: 'Physics',
  gender: 'Female',
  'primary-contact-number': '+1 46548 84498',
  'email-address': 'jan@example.com',
  'blood-group': 'O +ve',
  'date-of-joining': '15-12-2023',
  'father-s-name': 'Francis Saviour',
  'mother-s-name': 'Stella Bruce',
  'date-of-birth': '15-12-1992',
  'marital-status': 'Single',
  'language-known': 'English, Spanish',
  qualification: 'MBA',
  // Two spaces between "2" and "Years" in the template — kept verbatim.
  'work-experience': '2  Years',
  'previous-school-if-any': 'Oxford Matriculation, USA',
  'previous-school-address': '1852 Barnes Avenue, Cincinnati, OH 45202',
  'previous-school-phone-no': '+1 35676 45556',
  address: '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  'permanent-address': '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  'pan-number-id-number': '343445954908',
  status: 'Active',
  notes:
    "Depending on the specific needs of your organization or system, additional information may be collected or tracked. It's important to ensure that any data collected complies with privacy regulations and policies to protect students' sensitive information.",

  // Payroll
  'epf-no': '34234345',
  'basic-salary': '150000',
  'contract-type': 'Permanent',
  'work-shift': 'Morning',
  'work-location': '2nd Floor',
  'date-of-leaving': '01-12-2024',

  // Leaves
  'casual-leaves': '02',
  'sick-leaves': '02',

  // Bank Account Detail
  'account-name': 'Teresa',
  'account-number': '0126784900',
  'bank-name': 'Bank of America',
  'ifsc-code': 'BOA83209832',
  'branch-name': 'Cincinnati',

  // Transport Information
  route: 'Newyork',
  'vehicle-number': 'AM 54548',
  'pickup-point': 'Cincinatti',

  // Hostel Information
  hostel: 'Phoenix Residence',
  'room-no': '20',

  // Social Media Links — the template's own label/value mismatch is preserved.
  facebook: 'www.facebook.com',
  instagram: 'www.twitter.com',
  'linked-in': 'www.Linkedin.com',
  youtube: 'www.youtube.com',
  'twitter-url': 'www.instagram.com',
};
