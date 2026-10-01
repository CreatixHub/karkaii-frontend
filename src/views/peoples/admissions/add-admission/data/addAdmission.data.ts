export type WizardFieldKind = 'text' | 'email' | 'number' | 'file' | 'select' | 'date' | 'textarea';

export interface WizardFieldSpec {
  id: string;
  label: string;
  kind: WizardFieldKind;
  col: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
  rows?: number;
  wrapper?: string;
}

export interface WizardStepDef {
  id: string;
  title: string;
  icon: string;
  heading: string;
}

export const wizardSteps: WizardStepDef[] = [
  { id: 'step-personal', title: 'Personal', icon: 'ti ti-user', heading: 'Personal Details' },
  { id: 'step-academic', title: 'Academic', icon: 'ti ti-book', heading: 'Academic Details' },
  { id: 'step-guardian', title: 'Guardian', icon: 'ti ti-users', heading: 'Guardian & Emergency Contact' },
  { id: 'step-medical', title: 'Medical', icon: 'ti ti-heartbeat', heading: 'Medical Details' },
  { id: 'step-transport', title: 'Transport & Hostel', icon: 'ti ti-bus', heading: 'Transport & Hostel' },
  { id: 'step-previous', title: 'Previous School', icon: 'ti ti-school', heading: 'Previous School' },
  { id: 'step-documents', title: 'Documents', icon: 'ti ti-files', heading: 'Required Documents' },
  { id: 'step-review', title: 'Review', icon: 'ti ti-checks', heading: 'Review & Submit' },
];

export const personalFields: WizardFieldSpec[] = [
  { id: 'first-name', label: 'First Name', kind: 'text', col: 'col-12 col-lg-4', required: true },
  { id: 'last-name', label: 'Last Name', kind: 'text', col: 'col-12 col-lg-4', required: true },
  { id: 'gender', label: 'Gender', kind: 'select', col: 'col-12 col-lg-4', required: true, options: ['Select', 'Male', 'Female'] },
  { id: 'date-of-birth', label: 'Date of Birth', kind: 'date', col: 'col-12 col-lg-4', required: true },
  { id: 'blood-group', label: 'Blood Group', kind: 'select', col: 'col-12 col-lg-4', options: ['Select', 'A+', 'B+', 'O+', 'AB+'] },
  { id: 'religion', label: 'Religion', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'nationality', label: 'Nationality', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'mother-tongue', label: 'Mother Tongue', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'photo', label: 'Photo', kind: 'file', col: 'col-12 col-lg-4', accept: 'image/*' },
  { id: 'address', label: 'Address', kind: 'textarea', col: 'col-12 col-lg-12', rows: 2, wrapper: 'mb-0' },
];

export const academicFields: WizardFieldSpec[] = [
  { id: 'class-applied', label: 'Class Applied', kind: 'select', col: 'col-12 col-lg-4', required: true, options: ['Select', 'I', 'II', 'III', 'IV'] },
  { id: 'section-preference', label: 'Section Preference', kind: 'select', col: 'col-12 col-lg-4', options: ['Select', 'A', 'B', 'C'] },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', col: 'col-12 col-lg-4', required: true, options: ['2024 / 2025', '2025 / 2026'] },
  { id: 'admission-type', label: 'Admission Type', kind: 'select', col: 'col-12 col-lg-4', options: ['New Admission', 'Transfer'] },
  { id: 'second-language', label: 'Second Language', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'application-source', label: 'Application Source', kind: 'select', col: 'col-12 col-lg-4', options: ['Walk-in', 'Online', 'Referral'], wrapper: 'mb-0' },
];

export const guardianFields: WizardFieldSpec[] = [
  { id: 'parent-guardian-name', label: 'Parent / Guardian Name', kind: 'text', col: 'col-12 col-lg-6', required: true },
  { id: 'relationship', label: 'Relationship', kind: 'select', col: 'col-12 col-lg-6', options: ['Father', 'Mother', 'Guardian'] },
  { id: 'phone', label: 'Phone', kind: 'text', col: 'col-12 col-lg-6', required: true },
  { id: 'email', label: 'Email', kind: 'email', col: 'col-12 col-lg-6' },
  { id: 'occupation', label: 'Occupation', kind: 'text', col: 'col-12 col-lg-6' },
  { id: 'annual-income', label: 'Annual Income', kind: 'text', col: 'col-12 col-lg-6' },
];

export const emergencyFields: WizardFieldSpec[] = [
  { id: 'emergency-contact-name', label: 'Emergency Contact Name', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'relationship-2', label: 'Relationship', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'emergency-phone', label: 'Emergency Phone', kind: 'text', col: 'col-12 col-lg-4', wrapper: 'mb-0' },
];

export const medicalFields: WizardFieldSpec[] = [
  { id: 'allergies', label: 'Allergies', kind: 'text', col: 'col-12 col-lg-6', placeholder: 'If any' },
  { id: 'medical-conditions', label: 'Medical Conditions', kind: 'text', col: 'col-12 col-lg-6', placeholder: 'If any' },
  { id: 'medications', label: 'Medications', kind: 'text', col: 'col-12 col-lg-6' },
  { id: 'family-doctor-contact', label: 'Family Doctor Contact', kind: 'text', col: 'col-12 col-lg-6', wrapper: 'mb-0' },
];

export const transportFields: WizardFieldSpec[] = [
  { id: 'transport-required', label: 'Transport Required', kind: 'select', col: 'col-12 col-lg-4', options: ['No', 'Yes'] },
  { id: 'route', label: 'Route', kind: 'select', col: 'col-12 col-lg-4', options: ['Select', 'Route 12 - Downtown'] },
  { id: 'pickup-point', label: 'Pickup Point', kind: 'text', col: 'col-12 col-lg-4' },
  { id: 'hostel-required', label: 'Hostel Required', kind: 'select', col: 'col-12 col-lg-4', options: ['No', 'Yes'] },
  { id: 'hostel-name', label: 'Hostel Name', kind: 'select', col: 'col-12 col-lg-4', options: ['Select', 'Boys Hostel A', 'Girls Hostel A'] },
  { id: 'room-type', label: 'Room Type', kind: 'select', col: 'col-12 col-lg-4', options: ['Select', 'Single', 'Shared'], wrapper: 'mb-0' },
];

export const previousSchoolFields: WizardFieldSpec[] = [
  { id: 'school-name', label: 'School Name', kind: 'text', col: 'col-12 col-lg-6' },
  { id: 'board', label: 'Board', kind: 'text', col: 'col-12 col-lg-6' },
  { id: 'last-class-attended', label: 'Last Class Attended', kind: 'text', col: 'col-12 col-lg-6' },
  { id: 'tc-number', label: 'TC Number', kind: 'text', col: 'col-12 col-lg-6', wrapper: 'mb-0' },
];

export const documentFields: WizardFieldSpec[] = [
  { id: 'birth-certificate', label: 'Birth Certificate', kind: 'file', col: 'col-12 col-lg-6', required: true, accept: '.pdf,.jpg,.png' },
  { id: 'id-aadhar-proof', label: 'ID / Aadhar Proof', kind: 'file', col: 'col-12 col-lg-6', accept: '.pdf,.jpg,.png' },
  { id: 'transfer-certificate', label: 'Transfer Certificate', kind: 'file', col: 'col-12 col-lg-6', accept: '.pdf,.jpg,.png' },
  { id: 'address-proof', label: 'Address Proof', kind: 'file', col: 'col-12 col-lg-6', accept: '.pdf,.jpg,.png' },
];

export interface ReviewCard {
  step: number;
  title: string;
  summary: string;
  target: string;
}

export const reviewCards: ReviewCard[] = [
  { step: 0, title: 'Personal', summary: 'Name, Gender, DOB, Address', target: 'step-personal' },
  { step: 1, title: 'Academic', summary: 'Class, Section, Academic Year', target: 'step-academic' },
  { step: 2, title: 'Guardian', summary: 'Parent name, Phone, Email', target: 'step-guardian' },
  { step: 6, title: 'Documents', summary: 'Uploaded files', target: 'step-documents' },
];
