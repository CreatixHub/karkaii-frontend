export type FieldKind = 'text' | 'email' | 'select' | 'date' | 'textarea' | 'tags';

export interface FormFieldSpec {
  id: string;
  label: string;
  kind: FieldKind;
  /** Bootstrap column classes exactly as the template has them. */
  col: string;
  options?: string[];
  rows?: number;
  /** Extra classes on the control, e.g. the siblings Class select's `w-100`. */
  controlClass?: string;
  /** Wrapper spacing; the template varies between `mb-3`, `mb-2` and `mb-4`. */
  wrapper?: string;
  placeholder?: string;
}

export interface FormSectionSpec {
  id: string;
  icon: string;
  title: string;
  /** Section-nav label — the rail wording differs from the card heading. */
  navLabel: string;
  navIcon: string;
  bodyClass: string;
  fields: FormFieldSpec[];
}

const COL_PERSONAL = 'col-xxl col-xl-4 col-md-6';
const COL_QUARTER = 'col-lg-3 col-md-6';

export const personalFields: FormFieldSpec[] = [
  { id: 'academic-year', label: 'Academic Year', kind: 'select', col: COL_PERSONAL, options: ['June 2024/25', 'June 2023/24', 'June 2022/23'] },
  { id: 'admission-number', label: 'Admission Number', kind: 'text', col: COL_PERSONAL },
  { id: 'admission-date', label: 'Admission Date', kind: 'date', col: COL_PERSONAL },
  { id: 'roll-number', label: 'Roll Number', kind: 'text', col: COL_PERSONAL },
  { id: 'status', label: 'Status', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Active', 'Inactive'] },
  { id: 'first-name', label: 'First Name', kind: 'text', col: COL_PERSONAL },
  { id: 'last-name', label: 'Last Name', kind: 'text', col: COL_PERSONAL },
  { id: 'class', label: 'Class', kind: 'select', col: COL_PERSONAL, options: ['Select', 'I', 'II', 'III', 'IV', 'V'] },
  { id: 'section', label: 'Section', kind: 'select', col: COL_PERSONAL, options: ['Select', 'A', 'B'] },
  { id: 'gender', label: 'Gender', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Male', 'Female'] },
  { id: 'date-of-birth', label: 'Date of Birth', kind: 'date', col: COL_PERSONAL },
  { id: 'blood-group', label: 'Blood Group', kind: 'select', col: COL_PERSONAL, options: ['Select', 'O +ve', 'B +ve', 'B -ve'] },
  { id: 'house', label: 'House', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Red'] },
  { id: 'religion', label: 'Religion', kind: 'select', col: COL_PERSONAL, options: ['Select', 'Christianity', 'Buddhism', 'Irreligion'] },
  { id: 'category', label: 'Category', kind: 'select', col: COL_PERSONAL, options: ['Select', 'OBC', 'BC'] },
  { id: 'primary-contact-number', label: 'Primary Contact Number', kind: 'text', col: COL_PERSONAL },
  { id: 'email-address', label: 'Email Address', kind: 'email', col: COL_PERSONAL },
  { id: 'caste', label: 'Caste', kind: 'text', col: COL_PERSONAL },
  { id: 'mother-tongue', label: 'Mother Tongue', kind: 'select', col: COL_PERSONAL, options: ['Select', 'English', 'Spanish'] },
  { id: 'language-known', label: 'Language Known', kind: 'tags', col: COL_PERSONAL },
];

/** The guardian card is three labelled groups, not one flat grid. */
export const guardianGroups: { id: string; title: string; fields: FormFieldSpec[] }[] = [
  {
    id: 'father',
    title: "Father’s Info",
    fields: [
      { id: 'father-name', label: 'Father Name', kind: 'text', col: COL_QUARTER },
      { id: 'email', label: 'Email', kind: 'text', col: COL_QUARTER },
      { id: 'phone-number', label: 'Phone Number', kind: 'text', col: COL_QUARTER },
      { id: 'father-occupation', label: 'Father Occupation', kind: 'text', col: COL_QUARTER },
    ],
  },
  {
    id: 'mother',
    title: "Mother’s Info",
    fields: [
      { id: 'mother-name', label: 'Mother Name', kind: 'text', col: COL_QUARTER },
      { id: 'email-2', label: 'Email', kind: 'text', col: COL_QUARTER },
      { id: 'phone-number-2', label: 'Phone Number', kind: 'text', col: COL_QUARTER },
      { id: 'mother-occupation', label: 'Mother Occupation', kind: 'text', col: COL_QUARTER },
    ],
  },
  {
    id: 'guardian',
    title: 'Guardian Details',
    fields: [
      { id: 'guardian-name', label: 'Guardian Name', kind: 'text', col: COL_QUARTER },
      { id: 'guardian-relation', label: 'Guardian Relation', kind: 'text', col: COL_QUARTER },
      { id: 'phone-number-3', label: 'Phone Number', kind: 'text', col: COL_QUARTER },
      { id: 'email-3', label: 'Email', kind: 'email', col: COL_QUARTER },
      { id: 'occupation', label: 'Occupation', kind: 'text', col: COL_QUARTER },
      { id: 'address', label: 'Address', kind: 'text', col: COL_QUARTER },
    ],
  },
];

export const siblingFields: FormFieldSpec[] = [
  { id: 'name', label: 'Name', kind: 'select', col: COL_QUARTER, options: ['Select', 'Ralph Claudia', 'Julie Scott', 'Maria'] },
  { id: 'roll-no', label: 'Roll No', kind: 'select', col: COL_QUARTER, options: ['Select', '35013', '35011', '35010'] },
  { id: 'admission-no', label: 'Admission No', kind: 'select', col: COL_QUARTER, options: ['Select', 'AD9892434', 'AD9892433', 'AD9892432'] },
  { id: 'class-2', label: 'Class', kind: 'select', col: COL_QUARTER, options: ['Select', 'I', 'II', 'III'], controlClass: 'w-100' },
];

export const addressFields: FormFieldSpec[] = [
  { id: 'current-address', label: 'Current Address', kind: 'text', col: 'col-md-6', placeholder: 'Enter Current Address' },
  { id: 'permanent-address', label: 'Permanent Address', kind: 'text', col: 'col-md-6' },
];

export const transportFields: FormFieldSpec[] = [
  { id: 'route', label: 'Route', kind: 'select', col: 'col-lg-4 col-md-6', options: ['Select', 'Newyork', 'Denver', 'Chicago'] },
  { id: 'vehicle-number', label: 'Vehicle Number', kind: 'select', col: 'col-lg-4 col-md-6', options: ['Select', 'AM 54548', 'AM 64528', 'AM 123548'] },
  { id: 'pickup-point', label: 'Pickup Point', kind: 'select', col: 'col-lg-4 col-md-6', options: ['Select', 'Cincinatti', 'Illinois', 'Morgan'] },
];

export const hostelFields: FormFieldSpec[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', col: 'col-md-6', options: ['Select', 'Phoenix Residence', 'Tranquil Haven', 'Radiant Towers', 'Nova Nest'] },
  { id: 'room-no', label: 'Room No', kind: 'select', col: 'col-md-6', options: ['Select', '20', '22', '24', '26'] },
];

export const medicalTagFields: FormFieldSpec[] = [
  { id: 'allergies', label: 'Allergies', kind: 'tags', col: 'col-md-12' },
  { id: 'medications', label: 'Medications', kind: 'tags', col: 'col-md-12' },
];

export const previousSchoolFields: FormFieldSpec[] = [
  { id: 'school-name', label: 'School Name', kind: 'text', col: 'col-md-6' },
  { id: 'address-2', label: 'Address', kind: 'text', col: 'col-md-6' },
];

export const otherFields: FormFieldSpec[] = [
  { id: 'bank-name', label: 'Bank Name', kind: 'text', col: 'col-md-5' },
  { id: 'branch', label: 'Branch', kind: 'text', col: 'col-md-2' },
  { id: 'ifsc-number', label: 'IFSC Number', kind: 'text', col: 'col-md-5' },
];

/** The rail in `add-student.html`; absent from the edit page. */
export const sectionNav = [
  { id: 'sec-personal', icon: 'ti ti-info-square-rounded', label: 'Personal Information' },
  { id: 'sec-guardian', icon: 'ti ti-users', label: 'Parents & Guardian' },
  { id: 'sec-siblings', icon: 'ti ti-friends', label: 'Siblings' },
  { id: 'sec-address', icon: 'ti ti-map-pin', label: 'Address' },
  { id: 'sec-transport', icon: 'ti ti-bus', label: 'Transport' },
  { id: 'sec-hostel', icon: 'ti ti-building-fortress', label: 'Hostel' },
  { id: 'sec-documents', icon: 'ti ti-files', label: 'Documents' },
  { id: 'sec-medical', icon: 'ti ti-heartbeat', label: 'Medical History' },
  { id: 'sec-previous', icon: 'ti ti-school', label: 'Previous School' },
  { id: 'sec-other', icon: 'ti ti-dots', label: 'Other Details' },
];

export const sectionMeta = {
  personal: { id: 'sec-personal', icon: 'ti ti-info-square-rounded', title: 'Personal Information' },
  guardian: { id: 'sec-guardian', icon: 'ti ti-users', title: 'Parents & Guardian Information' },
  siblings: { id: 'sec-siblings', icon: 'ti ti-users', title: 'Sibilings' },
  address: { id: 'sec-address', icon: 'ti ti-map-pin-plus', title: 'Address' },
  transport: { id: 'sec-transport', icon: 'ti ti-bus', title: 'Transport Information' },
  hostel: { id: 'sec-hostel', icon: 'ti ti-building-fortress', title: 'Hostel Information' },
  documents: { id: 'sec-documents', icon: 'ti ti-file', title: 'Documents' },
  medical: { id: 'sec-medical', icon: 'ti ti-medical-cross', title: 'Medical History' },
  previous: { id: 'sec-previous', icon: 'ti ti-building', title: 'Previous School Details' },
  other: { id: 'sec-other', icon: 'ti ti-building-bank', title: 'Other Details' },
};

/** `edit-student.html`'s prefilled values, keyed by field id. */
export const EDIT_DEFAULTS: Record<string, string> = {
  'academic-year': 'June 2024/25',
  'admission-number': 'AD9892434',
  'admission-date': '15/12/1991',
  'roll-number': '35013',
  status: 'Active',
  'first-name': 'Ralph',
  'last-name': 'Claudia',
  class: 'I',
  section: 'A',
  gender: 'Male',
  'date-of-birth': '15/12/1992',
  'blood-group': 'O +ve',
  house: 'Red',
  religion: 'Christianity',
  category: 'OBC',
  'primary-contact-number': '+1 46548 84498',
  'email-address': 'jan@example.com',
  caste: 'Catholic',
  'mother-tongue': 'English',
  'language-known': 'English, Spanish',
  'father-name': 'Jerald Vicinius',
  email: 'jera@example.com',
  'phone-number': '+1 45545 46464',
  'father-occupation': 'Mechanic',
  'mother-name': 'Roberta Webber',
  'email-2': 'robe@example.com',
  'phone-number-2': '+1 46499 24357',
  'mother-occupation': 'Homemaker',
  'guardian-name': 'Jerald Vicinius',
  'phone-number-3': '+1 45545 46464',
  'email-3': 'jera@example.com',
  occupation: 'Mechanic',
  address: '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  name: 'Ralph Claudia',
  'roll-no': '35013',
  'admission-no': 'AD9892434',
  'class-2': 'I',
  'current-address': '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  'permanent-address': '3495 Red Hawk Road, Buffalo Lake, MN 55314',
  route: 'Newyork',
  'vehicle-number': 'AM 54548',
  'pickup-point': 'Cincinatti',
  hostel: 'Tranquil Haven',
  'room-no': '20',
  allergies: 'Allergy, Skin Allergy',
  medications: 'Medecine Name',
  'school-name': 'Oxford Matriculation, USA',
  'address-2': '1852 Barnes Avenue, Cincinnati, OH 45202',
  'bank-name': 'Bank of America',
  branch: 'Cincinnati',
  'ifsc-number': 'BOA83209832',
  'other-information':
    "Depending on the specific needs of your organization or system, additional information may be collected or tracked. It's important to ensure that any data collected complies with privacy regulations and policies to protect students' sensitive information.",
};

export const OTHER_INFORMATION_ID = 'other-information';
