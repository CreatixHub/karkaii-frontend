import { daysBetween } from '../../../../report/ai-insights/data/dates';

/** The profile's own clock — "Today, 09:42" on the audit trail. */
export const RUN_DATE = '31 Jul 2026';
export const LAST_UPDATED = 'Today, 09:42';

export const SCHOOL_NAME = 'Karkaii International School';
export const ACADEMIC_YEAR = '2026 – 2027';

/** The template's completeness meter. See the deviation note above. */
export const COMPLETENESS = 86;

/** Value the profile prints where a field has never been filled in. */
export const UNSET = 'Not set';

/* ------------------------------------------------------------------ *
 * The identity panel                                                 *
 * ------------------------------------------------------------------ */

export interface Fact {
  label: string;
  value: string;
  icon: string;
  /** The three tinted facts the template features. */
  tone?: string;
  /** Bootstrap text colour on the value, e.g. "text-success". */
  valueClass?: string;
}

export const FACTS: Fact[] = [
  { label: 'Affiliation board', value: 'CBSE', icon: 'ti ti-certificate', tone: 'fc-primary' },
  { label: 'Established', value: '2011', icon: 'ti ti-calendar-star', tone: 'fc-purple' },
  { label: 'Students enrolled', value: '2,480', icon: 'ti ti-users', tone: 'fc-success' },
  { label: 'School code', value: 'PIS-2011-KA', icon: 'ti ti-hash' },
  { label: 'Academic year', value: ACADEMIC_YEAR, icon: 'ti ti-calendar-due' },
  { label: 'Status', value: 'Active', icon: 'ti ti-circle-check', valueClass: 'text-success' },
  { label: 'Last updated', value: LAST_UPDATED, icon: 'ti ti-history' },
];

/* ------------------------------------------------------------------ *
 * The rows every card is built from                                  *
 * ------------------------------------------------------------------ */

export interface ProfileRow {
  key: string;
  value: string;
  /** Rendered inside a <code> element, as the template does for references. */
  code?: boolean;
}

export const isUnset = (row: ProfileRow) => row.value === UNSET;

/** What a card's badge says when the template counts its fields. */
export const fieldsLabelOf = (rows: ProfileRow[]) => `${rows.length} fields`;

/** What a card's badge says when the template counts what is missing. */
export const unsetLabelOf = (rows: ProfileRow[]) => {
  const missing = rows.filter(isUnset).length;
  return missing === 0 ? 'Complete' : `${missing} not set`;
};

/* ------------------------------------------------------------------ *
 * The sections                                                       *
 * ------------------------------------------------------------------ */

export type SectionId =
  | 'general'
  | 'identity'
  | 'branding'
  | 'contact'
  | 'address'
  | 'social'
  | 'communication'
  | 'academic'
  | 'campus'
  | 'management'
  | 'compliance'
  | 'documents'
  | 'security'
  | 'audit';

export interface Section {
  id: SectionId;
  group: string;
  label: string;
  icon: string;
  /** The pane heading — the eyebrow is the group name. */
  title: string;
  sub: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'general',
    group: 'Profile',
    label: 'General Information',
    icon: 'ti ti-info-circle',
    title: 'General Information',
    sub: 'The canonical record. Every field here is read by another module, so a change made once applies everywhere.',
  },
  {
    id: 'identity',
    group: 'Profile',
    label: 'School Identity',
    icon: 'ti ti-id-badge-2',
    title: 'School Identity',
    sub: 'How the school names itself on certificates, letters and anything else it issues.',
  },
  {
    id: 'branding',
    group: 'Profile',
    label: 'Branding',
    icon: 'ti ti-palette',
    title: 'Branding',
    sub: 'Logos, colours and where each is applied. Replacing an asset updates every surface that uses it.',
  },
  {
    id: 'contact',
    group: 'Contact',
    label: 'Contact Information',
    icon: 'ti ti-phone',
    title: 'Contact Information',
    sub: 'The numbers and inboxes printed on the public site, invoices and every letter.',
  },
  {
    id: 'address',
    group: 'Contact',
    label: 'Address',
    icon: 'ti ti-map-pin',
    title: 'Address & Location',
    sub: 'Where the trust is registered, where the campus is, and what appears on the map.',
  },
  {
    id: 'social',
    group: 'Contact',
    label: 'Social Media',
    icon: 'ti ti-brand-x',
    title: 'Social Media',
    sub: 'The accounts linked from the public site and printed on the prospectus.',
  },
  {
    id: 'communication',
    group: 'Contact',
    label: 'Communication',
    icon: 'ti ti-message-2',
    title: 'Communication',
    sub: 'How the school identifies itself on every message it sends.',
  },
  {
    id: 'academic',
    group: 'Academic',
    label: 'Academic Details',
    icon: 'ti ti-school',
    title: 'Academic Details',
    sub: 'The structural settings that shape timetables, terms, reports and assessment.',
  },
  {
    id: 'campus',
    group: 'Academic',
    label: 'Campus & Languages',
    icon: 'ti ti-building',
    title: 'Campus, Languages & Time',
    sub: 'Physical and regional settings used across the platform.',
  },
  {
    id: 'management',
    group: 'Governance',
    label: 'Management',
    icon: 'ti ti-users',
    title: 'Management',
    sub: 'The people whose names appear on issued documents and official correspondence.',
  },
  {
    id: 'compliance',
    group: 'Governance',
    label: 'Affiliation & Compliance',
    icon: 'ti ti-certificate',
    title: 'Affiliation & Compliance',
    sub: 'Registrations and licences, with the rib coloured by how close each is to expiry.',
  },
  {
    id: 'documents',
    group: 'Records',
    label: 'Documents',
    icon: 'ti ti-folder',
    title: 'Documents',
    sub: 'Everything on file for the institution. Certificates here are the ones referenced in Compliance.',
  },
  {
    id: 'security',
    group: 'Records',
    label: 'Security',
    icon: 'ti ti-lock',
    title: 'Security',
    sub: 'Access control, retention and the last review of this profile.',
  },
  {
    id: 'audit',
    group: 'Records',
    label: 'Audit History',
    icon: 'ti ti-history',
    title: 'Audit History',
    sub: 'Every change to this profile, who made it and what the value was before.',
  },
];

/** The rail's group headings, with the count the template prints beside each. */
export const NAV_GROUPS = ['Profile', 'Contact', 'Academic', 'Governance', 'Records'].map(
  (group) => ({ group, sections: SECTIONS.filter((section) => section.group === group) }),
);

/* ------------------------------------------------------------------ *
 * Section content                                                    *
 * ------------------------------------------------------------------ */

export const GENERAL_ROWS: ProfileRow[] = [
  { key: 'School name', value: SCHOOL_NAME },
  { key: 'School code', value: 'PIS-2011-KA', code: true },
  { key: 'School type', value: 'Co-educational · Day and boarding' },
  { key: 'Affiliation board', value: 'CBSE · Central Board of Secondary Education' },
  { key: 'Established year', value: '2011' },
  { key: 'Academic year', value: `${ACADEMIC_YEAR} · Term 2 active` },
  { key: 'Medium of instruction', value: 'English · Hindi as second language' },
  { key: 'Website', value: 'www.karkaii.edu' },
  { key: 'Official email', value: 'office@karkaii.edu' },
  { key: 'Primary phone', value: '+91 80 4123 8800' },
  { key: 'Status', value: 'Active' },
];

export const IDENTITY_ROWS: ProfileRow[] = [
  { key: 'Legal name', value: 'Karkaii Educational Trust (Regd.)' },
  { key: 'Display name', value: SCHOOL_NAME },
  { key: 'Short name', value: 'PIS' },
  { key: 'Motto', value: '“Learn. Question. Grow.”' },
  { key: 'Founded by', value: 'Dr. R. Venkataraman' },
  { key: 'Registration number', value: 'TR/KA/2011/4471', code: true },
  { key: 'Tagline for certificates', value: UNSET },
];

export interface Asset {
  name: string;
  spec: string;
  image: string;
  /** The dark logo sits in a dark well. */
  dark?: boolean;
}

export const ASSETS: Asset[] = [
  { name: 'School Logo', spec: 'SVG · 240 × 60', image: 'assets/img/karkaii-logo.png' },
  { name: 'Dark Logo', spec: 'SVG · 240 × 60', image: 'assets/img/karkaii-logo.png', dark: true },
  { name: 'Compact Logo', spec: 'SVG · 60 × 60', image: 'assets/img/karkaii-logo.png' },
  { name: 'Favicon', spec: 'PNG · 32 × 32', image: 'assets/img/favicon.png' },
];

export interface Swatch {
  name: string;
  hex: string;
  use: string;
}

export const COLOURS: Swatch[] = [
  { name: 'Primary Color', hex: '#3D5EE1', use: 'Buttons, links and headers' },
  { name: 'Secondary Color', hex: '#6FCCD8', use: 'Accents and highlights' },
  { name: 'Success Color', hex: '#1ABE17', use: 'Confirmations and passes' },
  { name: 'Ink Color', hex: '#202C4B', use: 'Headings and printed text' },
];

export interface Surface {
  name: string;
  note: string;
  icon: string;
  applied: boolean;
}

export const SURFACES: Surface[] = [
  {
    name: 'Email Branding',
    note: 'Header, footer and signature on every outgoing message',
    icon: 'ti ti-mail',
    applied: true,
  },
  {
    name: 'Certificate Branding',
    note: 'Crest, seal and signature block on issued certificates',
    icon: 'ti ti-certificate',
    applied: true,
  },
  {
    name: 'ID Card Branding',
    note: 'Student and staff card front and reverse',
    icon: 'ti ti-id',
    applied: true,
  },
  {
    name: 'Report Branding',
    note: 'Cover page and page furniture on generated reports',
    icon: 'ti ti-report',
    applied: true,
  },
  {
    name: 'Invoice Branding',
    note: 'Letterhead and payment footer on fee invoices',
    icon: 'ti ti-file-invoice',
    applied: false,
  },
];

export const UNAPPLIED_SURFACES = SURFACES.filter((surface) => !surface.applied).length;

export interface ContactBlock {
  title: string;
  icon: string;
  lines: string[];
}

export const CONTACT_BLOCKS: ContactBlock[] = [
  {
    title: 'Principal Office',
    icon: 'ti ti-user-star',
    lines: ['Block A, Second Floor', '+91 80 4123 8801', 'principal@karkaii.edu'],
  },
  {
    title: 'Reception',
    icon: 'ti ti-headset',
    lines: ['Main Block, Ground Floor', '+91 80 4123 8800', 'Mon–Sat, 08:00–17:00'],
  },
  {
    title: 'Phone Numbers',
    icon: 'ti ti-phone',
    lines: ['Main +91 80 4123 8800', 'Admissions +91 80 4123 8805', 'Transport +91 80 4123 8809'],
  },
  {
    title: 'Email Addresses',
    icon: 'ti ti-mail',
    lines: ['office@karkaii.edu', 'admissions@karkaii.edu', 'accounts@karkaii.edu'],
  },
  {
    title: 'Emergency Contact',
    icon: 'ti ti-urgent',
    lines: ['24-hour line +91 98450 11223', 'Nurse station +91 80 4123 8812', 'Nearest hospital 2.4 km'],
  },
];

export const ADDRESS_BLOCKS: ContactBlock[] = [
  {
    title: 'Office Address',
    icon: 'ti ti-building-bank',
    lines: ['Karkaii Educational Trust', '4th Floor, Ashirwad Tower', 'Residency Road, Bengaluru 560025'],
  },
  {
    title: 'Campus Address',
    icon: 'ti ti-map-pin',
    lines: ['Survey No. 118, Sarjapur Road', 'Off Outer Ring Road', 'Bengaluru 560035, Karnataka'],
  },
  {
    title: 'Map Location',
    icon: 'ti ti-map-2',
    lines: ['12.9081° N, 77.6476° E', 'Pinned and verified', 'Shown on the public site'],
  },
];

export interface SocialLink {
  name: string;
  handle: string;
  icon: string;
  state: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', handle: 'facebook.com/karkaiiintl', icon: 'ti ti-brand-facebook', state: 'Connected' },
  { name: 'X (Twitter)', handle: '@karkaiiintl', icon: 'ti ti-brand-x', state: 'Connected' },
  { name: 'Instagram', handle: '@karkaii.international', icon: 'ti ti-brand-instagram', state: 'Connected' },
  { name: 'YouTube', handle: 'youtube.com/@karkaiiintl', icon: 'ti ti-brand-youtube', state: 'Connected' },
  { name: 'LinkedIn', handle: UNSET, icon: 'ti ti-brand-linkedin', state: 'Not linked' },
  { name: 'Public website', handle: 'www.karkaii.edu', icon: 'ti ti-world', state: 'Live' },
];

export const COMMUNICATION_ROWS: ProfileRow[] = [
  { key: 'Default sender name', value: SCHOOL_NAME },
  { key: 'Default sender email', value: 'noreply@karkaii.edu' },
  { key: 'Reply-to address', value: 'office@karkaii.edu' },
  { key: 'SMS sender id', value: 'PRESKL', code: true },
  { key: 'WhatsApp business number', value: 'Not configured' },
  { key: 'Letterhead template', value: 'Classic · used on 6 document types' },
  { key: 'Email footer', value: 'Address, phone and unsubscribe line' },
  { key: 'Quiet hours', value: '21:00 – 07:00 · emergencies excepted' },
];

export const ACADEMIC_ROWS: ProfileRow[] = [
  { key: 'Academic board', value: 'CBSE · affiliated since 2013' },
  { key: 'Grade levels', value: 'Nursery to Class XII · 14 levels' },
  {
    key: 'Departments',
    value: '9 · Mathematics, Science, Languages, Humanities, Arts, Sports, IT, Library, Counselling',
  },
  { key: 'Campus type', value: 'Single campus · day and boarding' },
  { key: 'Session type', value: 'Annual · three terms' },
  { key: 'Working days', value: 'Monday to Saturday · second Saturday off' },
  { key: 'School timings', value: '08:00 – 15:30 · senior school to 16:15' },
  { key: 'Examination pattern', value: 'Continuous assessment plus three term exams' },
];

export const CAMPUS_ROWS: ProfileRow[] = [
  { key: 'Campus area', value: '6.2 acres · 4 blocks' },
  { key: 'Classrooms', value: '68 · 2 science labs, 1 computer lab' },
  { key: 'Facilities', value: 'Library, sports ground, auditorium, hostel, infirmary' },
  { key: 'Medium of instruction', value: 'English' },
  { key: 'Second language', value: 'Hindi' },
  { key: 'Third language', value: 'Kannada · Classes V to VIII' },
  { key: 'Timezone', value: 'Asia/Kolkata · UTC +05:30' },
  { key: 'Date format', value: 'DD MMM YYYY' },
  { key: 'Currency', value: 'INR · ₹' },
  { key: 'Week starts on', value: 'Monday' },
];

export interface Person {
  role: string;
  name: string;
  contact: string;
  image: string;
  state: string;
}

export const PEOPLE: Person[] = [
  {
    role: 'Principal',
    name: 'Dr. Anitha Krishnan',
    contact: 'principal@karkaii.edu · +91 80 4123 8801',
    image: 'assets/img/teachers/teacher-01.jpg',
    state: 'In office',
  },
  {
    role: 'Vice Principal',
    name: 'Mr. Suresh Iyer',
    contact: 'viceprincipal@karkaii.edu · Ext. 8802',
    image: 'assets/img/teachers/teacher-02.jpg',
    state: 'In office',
  },
  {
    role: 'Administrator',
    name: 'Ms. Latha Rao',
    contact: 'admin@karkaii.edu · Ext. 8803',
    image: 'assets/img/teachers/teacher-03.jpg',
    state: 'In office',
  },
  {
    role: 'Chairman',
    name: 'Mr. R. Venkataraman',
    contact: 'chairman@karkaii.edu · By appointment',
    image: 'assets/img/teachers/teacher-04.jpg',
    state: 'Trust',
  },
  {
    role: 'Academic Head',
    name: 'Mrs. Kavitha Menon',
    contact: 'academics@karkaii.edu · Ext. 8806',
    image: 'assets/img/teachers/teacher-05.jpg',
    state: 'In office',
  },
  {
    role: 'Finance Officer',
    name: 'Mr. Deepak Shetty',
    contact: 'accounts@karkaii.edu · Ext. 8807',
    image: 'assets/img/teachers/teacher-06.jpg',
    state: 'In office',
  },
];

export const TRUST_ROWS: ProfileRow[] = [
  { key: 'Trust name', value: 'Karkaii Educational Trust (Regd.)' },
  { key: 'Trust registration', value: 'TR/KA/2011/4471', code: true },
  { key: 'Registered office', value: 'Ashirwad Tower, Residency Road, Bengaluru 560025' },
  { key: 'Management committee', value: '9 members · last constituted May 2025' },
  { key: 'Chairman', value: 'Mr. R. Venkataraman' },
  { key: 'Secretary', value: 'Mrs. Padma Venkataraman' },
  { key: 'Committee term ends', value: 'April 2028' },
  { key: 'Office contact', value: '+91 80 4123 8888 · trust@karkaii.edu' },
];

/* ------------------------------------------------------------------ *
 * Compliance                                                         *
 * ------------------------------------------------------------------ */

/** How close to expiry the template treats as "expiring soon". */
export const EXPIRY_WINDOW_DAYS = 90;

export interface Licence {
  title: string;
  note: string;
  reference: string;
  /** Null where the registration never expires or is still being renewed. */
  expiresOn: string | null;
  /** What the footer says instead of an expiry date. */
  standing?: string;
  /** Set where the licence is with the issuing office rather than in force. */
  inReview?: boolean;
}

export const LICENCES: Licence[] = [
  {
    title: 'Affiliation Number',
    note: 'CBSE affiliation for Classes I to XII',
    reference: '830142',
    expiresOn: '31 Mar 2029',
  },
  {
    title: 'Recognition Number',
    note: 'State recognition, Department of Education',
    reference: 'KA/EDN/2011/1187',
    expiresOn: '30 Jun 2028',
  },
  {
    title: 'Education Board',
    note: 'Central Board of Secondary Education',
    reference: 'CBSE-NCR-830142',
    expiresOn: null,
    standing: 'Renewed 12 Apr 2026',
  },
  {
    title: 'Accreditation',
    note: 'NAAC institutional accreditation, Grade A',
    reference: 'NAAC/2021/A/2288',
    expiresOn: '14 Oct 2026',
  },
  {
    title: 'Tax Registration',
    note: 'PAN and 12A exemption certificate',
    reference: 'AAATP4471K',
    expiresOn: null,
    standing: 'No expiry',
  },
  {
    title: 'Government Approval',
    note: 'Building and fire safety clearance',
    reference: 'BBMP/FS/2024/9910',
    expiresOn: '31 Dec 2027',
  },
  {
    title: 'School License',
    note: 'Municipal trade and operating licence',
    reference: 'BBMP/TL/2026/4471',
    expiresOn: '30 Sep 2026',
  },
  {
    title: 'Hostel Licence',
    note: 'Residential facility operating permit',
    reference: 'Awaiting renewal receipt',
    expiresOn: null,
    standing: 'Submitted 18 Jul 2026',
    inReview: true,
  },
];

/**
 * Days until a licence expires, against the profile's clock.
 *
 * The template counts the expiry day itself — 31 Jul to 14 Oct reads as 76 days
 * left, not 75 — so the last day is included.
 */
export const daysLeftOf = (licence: Licence) =>
  licence.expiresOn === null ? null : daysBetween(RUN_DATE, licence.expiresOn) + 1;

export const isExpiringOf = (licence: Licence) => {
  const days = daysLeftOf(licence);
  return days !== null && days <= EXPIRY_WINDOW_DAYS;
};

/** The footer line: an expiry date, or the standing the licence has instead. */
export const licenceFootOf = (licence: Licence) => {
  if (licence.expiresOn === null) return licence.standing ?? '—';
  return `${isExpiringOf(licence) ? 'Expires' : 'Valid to'} ${licence.expiresOn}`;
};

/** The badge: how long is left, or what standing the licence has. */
export const licenceBadgeOf = (licence: Licence) => {
  if (licence.inReview) return { tone: 'is-pending', label: 'In review' };
  const days = daysLeftOf(licence);
  if (days !== null && days <= EXPIRY_WINDOW_DAYS) {
    return { tone: 'is-pending', label: `${days} days left` };
  }
  return { tone: 'is-active', label: 'Valid' };
};

export const EXPIRING_SOON = LICENCES.filter(isExpiringOf).length;

/* ------------------------------------------------------------------ *
 * Documents, security and the audit trail                            *
 * ------------------------------------------------------------------ */

export interface Document {
  title: string;
  spec: string;
  kind: 'pdf' | 'zip' | 'doc' | 'folder';
}

export const DOCUMENT_ICON: Record<Document['kind'], string> = {
  pdf: 'ti ti-file-type-pdf',
  zip: 'ti ti-file-zip',
  doc: 'ti ti-file-type-doc',
  folder: 'ti ti-folder',
};

export const DOCUMENTS: Document[] = [
  { title: 'Recognition Certificate', spec: 'PDF · 1.2 MB · Uploaded 12 Apr 2026', kind: 'pdf' },
  { title: 'Affiliation Certificate', spec: 'PDF · 890 KB · Uploaded 12 Apr 2026', kind: 'pdf' },
  { title: 'School Logo Pack', spec: 'ZIP · 4.1 MB · SVG, PNG and EPS', kind: 'zip' },
  { title: 'Prospectus 2026–27', spec: 'PDF · 6.8 MB · Uploaded 02 May 2026', kind: 'pdf' },
  { title: 'School Brochure', spec: 'DOCX · 2.4 MB · Uploaded 02 May 2026', kind: 'doc' },
  {
    title: 'Policy Documents',
    spec: '7 files · Admission, fees, conduct, safeguarding',
    kind: 'folder',
  },
  { title: 'Fire Safety Clearance', spec: 'PDF · 640 KB · Uploaded 08 Jan 2026', kind: 'pdf' },
  { title: 'Tax Exemption Certificate', spec: 'PDF · 410 KB · Uploaded 19 Feb 2026', kind: 'pdf' },
];

export const SECURITY_ROWS: ProfileRow[] = [
  { key: 'Two-factor authentication', value: 'Required for administrators' },
  { key: 'Password policy', value: '12 characters · rotation every 180 days' },
  { key: 'Session timeout', value: '30 minutes idle' },
  { key: 'Login IP restriction', value: 'Not enabled' },
  { key: 'Who can edit this profile', value: '3 administrators' },
  { key: 'Data retention', value: 'Student records 7 years after leaving' },
  { key: 'Audit log retention', value: '3 academic years' },
  { key: 'Open access requests', value: '2 awaiting approval' },
];

export const OPEN_REQUESTS = 2;

export interface AuditEvent {
  title: string;
  note: string;
  actor: string;
  at: string;
  /** Set where the change replaced a value the trail still prints. */
  from?: string;
  to?: string;
}

export const AUDIT: AuditEvent[] = [
  {
    title: 'School Created',
    note: 'Institution record created and the trust registration attached.',
    actor: 'Ms. Latha Rao',
    at: '14 Jun 2011, 10:00',
  },
  {
    title: 'Profile Updated',
    note: 'Prospectus and brochure replaced for the new academic year.',
    actor: 'Ms. Latha Rao',
    at: '02 May 2026, 14:22',
  },
  {
    title: 'Branding Changed',
    note: 'Primary colour updated across certificates, ID cards and reports.',
    actor: 'Mr. Suresh Iyer',
    at: '19 Jun 2026, 11:05',
    from: '#2E5BFF',
    to: '#3D5EE1',
  },
  {
    title: 'Academic Year Updated',
    note: 'Session rolled forward and term dates published to all portals.',
    actor: 'Dr. Anitha Krishnan',
    at: '01 Jul 2026, 08:30',
    from: '2025 – 2026',
    to: ACADEMIC_YEAR,
  },
  {
    title: 'Affiliation Renewed',
    note: 'CBSE affiliation renewed and the certificate re-uploaded.',
    actor: 'Dr. Anitha Krishnan',
    at: '12 Apr 2026, 16:40',
    from: 'Valid to 2026',
    to: 'Valid to 2029',
  },
  {
    title: 'Profile Published',
    note: 'Latest changes pushed live to the public site and the parent portal.',
    actor: 'Ms. Latha Rao',
    at: LAST_UPDATED,
  },
];

/** The two-letter monogram the trail prints beside each actor. */
export const initialsOf = (name: string) =>
  name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* ------------------------------------------------------------------ *
 * What the page counts about itself                                  *
 * ------------------------------------------------------------------ */

const ALL_ROWS = [
  ...GENERAL_ROWS,
  ...IDENTITY_ROWS,
  ...COMMUNICATION_ROWS,
  ...ACADEMIC_ROWS,
  ...CAMPUS_ROWS,
  ...TRUST_ROWS,
  ...SECURITY_ROWS,
];

/** Fields never filled in — across the rows and the two lists that can be unset. */
export const EMPTY_FIELDS =
  ALL_ROWS.filter(isUnset).length +
  SOCIAL_LINKS.filter((link) => link.handle === UNSET).length +
  UNAPPLIED_SURFACES;

/** The changes held as drafts, which the header badge counts. */
export const UNPUBLISHED_CHANGES = 4;

/* ------------------------------------------------------------------ *
 * The settings panel                                                 *
 * ------------------------------------------------------------------ */

export const PANEL_TITLE = 'Primary Color';
export const PANEL_SUB =
  'Branding · Applied to 5 surfaces · Last changed 19 Jun 2026 by Mr. Suresh Iyer';
export const PANEL_VALUE = '#3D5EE1';
export const PANEL_PREVIOUS = '#2E5BFF';
export const PANEL_NOTE =
  'Changing this colour updates buttons, links, headers and every generated document at the next publish. It does not affect documents already issued.';

export const PANEL_PREVIEWS = [
  'On white · letterhead and reports',
  'On ink · certificates and ID cards',
  'Primary button',
  'Secondary button',
  'Link style',
];

export interface PanelCheck {
  label: string;
  passed: boolean;
}

export const PANEL_CHECKS: PanelCheck[] = [
  { label: 'Value is a valid hexadecimal colour', passed: true },
  { label: 'Contrast against white passes AA at 4.7:1', passed: true },
  { label: 'Contrast against the ink colour passes AA', passed: true },
  {
    label: 'Contrast on the certificate gold background is 3.9:1, below AA for body text',
    passed: false,
  },
  { label: 'Renders correctly in the four generated PDF templates', passed: true },
];

export const PANEL_WARNINGS = PANEL_CHECKS.filter((check) => !check.passed).length;

export const PANEL_RELATED: ProfileRow[] = [
  { key: 'Secondary colour', value: '#6FCCD8' },
  { key: 'Ink colour', value: '#202C4B' },
  { key: 'Certificate branding', value: 'Applied' },
  { key: 'Email branding', value: 'Applied' },
  { key: 'Invoice branding', value: UNSET },
];

export const PANEL_USAGE: ProfileRow[] = [
  { key: 'Email header and signature', value: '1,240 messages this month' },
  { key: 'Certificates and ID cards', value: '412 issued this term' },
  { key: 'Generated reports', value: '86 report packs' },
  { key: 'Public site and parent portal', value: 'Live' },
  { key: 'Fee invoices', value: 'Not applied yet' },
];
