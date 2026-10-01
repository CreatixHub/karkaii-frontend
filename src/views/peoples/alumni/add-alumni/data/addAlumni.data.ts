export type AlumniFieldKind = 'text' | 'email' | 'number' | 'file' | 'select' | 'date' | 'url';

export interface AlumniFieldSpec {
  id: string;
  label: string;
  kind: AlumniFieldKind;
  col: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
  /** Tabler icon rendered before the label, e.g. the social link fields. */
  icon?: string;
  wrapper?: string;
}

export interface AlumniCardDef {
  id: string;
  title: string;
  icon: string;
  fields: AlumniFieldSpec[];
  /** The template's first card header is an `<h4>`; the rest are `<h5>`. */
  large?: boolean;
}

export const personalFields: AlumniFieldSpec[] = [
  { id: 'first-name', label: 'First Name', kind: 'text', col: 'col-12 col-lg-4', required: true },
  { id: 'last-name', label: 'Last Name', kind: 'text', col: 'col-12 col-lg-4', required: true },
  { id: 'admission-no', label: 'Admission No', kind: 'text', col: 'col-12 col-lg-4', required: true },
  { id: 'gender', label: 'Gender', kind: 'select', col: 'col-12 col-lg-4', options: ['Select', 'Male', 'Female'] },
  { id: 'date-of-birth', label: 'Date of Birth', kind: 'date', col: 'col-12 col-lg-4', placeholder: 'Select' },
  { id: 'photo', label: 'Photo', kind: 'file', col: 'col-12 col-lg-4', accept: 'image/*' },
  { id: 'phone', label: 'Phone', kind: 'text', col: 'col-12 col-lg-6' },
  { id: 'email', label: 'Email', kind: 'email', col: 'col-12 col-lg-6' },
  { id: 'city', label: 'City', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'country', label: 'Country', kind: 'text', col: 'col-12 col-lg-4' },
  {
    id: 'status',
    label: 'Status',
    kind: 'select',
    col: 'col-12 col-lg-4',
    wrapper: 'mb-0',
    options: ['Working Professional', 'Higher Studies', 'Entrepreneur', 'Not Working'],
  },
];

export const academicFields: AlumniFieldSpec[] = [
  { id: 'batch', label: 'Batch', kind: 'text', col: 'col-12 col-lg-4', required: true, placeholder: 'e.g. 2018-2022' },
  { id: 'passed-out-year', label: 'Passed Out Year', kind: 'number', col: 'col-12 col-lg-4', required: true, placeholder: 'e.g. 2022' },
  { id: 'course', label: 'Course', kind: 'select', col: 'col-12 col-lg-4', wrapper: 'mb-0', options: ['Science', 'Commerce', 'Arts'] },
];

export const employmentFields: AlumniFieldSpec[] = [
  { id: 'current-company', label: 'Current Company', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'designation', label: 'Designation', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'work-location', label: 'Work Location', kind: 'text', col: 'col-12 col-lg-4', wrapper: 'mb-0' },
];

export const higherStudiesFields: AlumniFieldSpec[] = [
  { id: 'degree-program', label: 'Degree / Program', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'institution', label: 'Institution', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'duration', label: 'Duration', kind: 'text', col: 'col-12 col-lg-4', wrapper: 'mb-0', placeholder: 'e.g. 2022 - 2026' },
];

export const skillsSocialFields: AlumniFieldSpec[] = [
  { id: 'skills', label: 'Skills', kind: 'text', col: 'col-12 col-lg-12', placeholder: 'Comma separated (e.g. JavaScript, Python)' },
  { id: 'linkedin', label: 'LinkedIn', kind: 'url', col: 'col-12 col-lg-6', icon: 'ti ti-brand-linkedin', placeholder: 'https://linkedin.com/in/...' },
  { id: 'x-twitter', label: 'X (Twitter)', kind: 'url', col: 'col-12 col-lg-6', icon: 'ti ti-brand-x', placeholder: 'https://x.com/...' },
  { id: 'github', label: 'GitHub', kind: 'url', col: 'col-12 col-lg-6', icon: 'ti ti-brand-github', placeholder: 'https://github.com/...' },
  { id: 'website', label: 'Website', kind: 'url', col: 'col-12 col-lg-6', wrapper: 'mb-0', icon: 'ti ti-world', placeholder: 'https://...' },
];

export const alumniCards: AlumniCardDef[] = [
  { id: 'personal', title: 'Personal Details', icon: 'ti ti-user', fields: personalFields, large: true },
  { id: 'academic', title: 'Academic History', icon: 'ti ti-book', fields: academicFields },
  { id: 'employment', title: 'Employment', icon: 'ti ti-briefcase', fields: employmentFields },
  { id: 'higher-studies', title: 'Higher Studies', icon: 'ti ti-school', fields: higherStudiesFields },
  { id: 'skills-social', title: 'Skills & Social Links', icon: 'ti ti-tags', fields: skillsSocialFields },
];
