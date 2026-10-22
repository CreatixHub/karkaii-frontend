export interface SmartFilter {
  id: string;
  icon: string;
  label: string;
  count: string;
  badgeClass: string;
}

export const smartFilters: SmartFilter[] = [
  { id: 'all', icon: 'ti ti-files', label: 'All Documents', count: '9842', badgeClass: 'badge-soft-primary' },
  { id: 'recent', icon: 'ti ti-clock-hour-4', label: 'Recent', count: '146', badgeClass: 'bg-light text-dark' },
  { id: 'favourites', icon: 'ti ti-star', label: 'Favourites', count: '38', badgeClass: 'bg-light text-dark' },
  { id: 'shared', icon: 'ti ti-share', label: 'Shared', count: '54', badgeClass: 'bg-light text-dark' },
  { id: 'verified', icon: 'ti ti-file-check', label: 'Verified', count: '8120', badgeClass: 'bg-light text-dark' },
  { id: 'pending', icon: 'ti ti-file-alert', label: 'Pending', count: '1240', badgeClass: 'bg-light text-dark' },
  { id: 'expired', icon: 'ti ti-file-x', label: 'Expired', count: '92', badgeClass: 'bg-light text-dark' },
];

export const categories = [
  { id: 'admission', label: 'Admission Documents', color: 'text-primary', count: '1120' },
  { id: 'birth', label: 'Birth Certificate', color: 'text-success', count: '1120' },
  { id: 'transfer', label: 'Transfer Certificate', color: 'text-warning', count: '980' },
  { id: 'marks', label: 'Mark Sheets', color: 'text-info', count: '1200' },
  { id: 'identity', label: 'Identity Proof', color: 'text-danger', count: '1030' },
  { id: 'address', label: 'Address Proof', color: 'text-secondary', count: '910' },
  { id: 'passport', label: 'Passport', color: 'text-primary', count: '320' },
  { id: 'medical', label: 'Medical Records', color: 'text-success', count: '870' },
  { id: 'bonafide', label: 'Bonafide Certificate', color: 'text-warning', count: '440' },
  { id: 'character', label: 'Character Certificate', color: 'text-info', count: '210' },
  { id: 'other', label: 'Other Documents', color: 'text-secondary', count: '642' },
];

export const recentDocuments = [
  { id: 'r1', icon: 'ti ti-file-type-pdf', color: 'text-danger', name: 'birth-certificate.pdf', owner: 'Janet Daniel' },
  { id: 'r2', icon: 'ti ti-file-type-jpg', color: 'text-info', name: 'aadhar-front.jpg', owner: 'George Kettut' },
  { id: 'r3', icon: 'ti ti-file-type-pdf', color: 'text-danger', name: 'medical-fitness.pdf', owner: 'Sophia Reyes' },
];

export const favouriteDocuments = [
  { id: 'f1', name: 'marksheet-term1.pdf' },
  { id: 'f2', name: 'passport-scan.png' },
];

export const sharedDocuments = [
  { id: 's1', name: 'transfer-certificate.pdf' },
  { id: 's2', name: 'bonafide.pdf' },
];

export interface DocumentRecord {
  id: string;
  name: string;
  /** Large icon on the grid card's 4:3 preview. */
  icon: string;
  iconColor: string;
  /** Tint used by the list row's square avatar. */
  avatarClass: string;
  category: { label: string; className: string };
  status: { label: string; className: string };
  favourite: boolean;
  photo: string;
  student: string;
  admissionNo: string;
  className: string;
  size: string;
  date: string;
  uploadedBy: string;
}

export const documents: DocumentRecord[] = [
  {
    id: 'd1',
    name: 'birth-certificate.pdf',
    icon: 'ti ti-file-type-pdf',
    iconColor: 'text-danger',
    avatarClass: 'bg-danger-transparent text-danger',
    category: { label: 'Birth Certificate', className: 'bg-danger-transparent text-danger' },
    status: { label: 'Verified', className: 'badge-soft-success' },
    favourite: true,
    photo: 'assets/img/students/student-01.jpg',
    student: 'Janet Daniel',
    admissionNo: 'AD283778',
    className: 'Class III',
    size: '1.2 MB',
    date: '02 Jul 2026',
    uploadedBy: 'Uploaded by Teena Mathew',
  },
  {
    id: 'd2',
    name: 'aadhar-front.jpg',
    icon: 'ti ti-file-type-jpg',
    iconColor: 'text-info',
    avatarClass: 'bg-info-transparent text-info',
    category: { label: 'Identity Proof', className: 'bg-info-transparent text-info' },
    status: { label: 'Pending', className: 'badge-soft-warning' },
    favourite: false,
    photo: 'assets/img/students/student-02.jpg',
    student: 'George Kettut',
    admissionNo: 'AD283779',
    className: 'Class II',
    size: '640 KB',
    date: '28 Jun 2026',
    uploadedBy: 'Uploaded by Parent',
  },
  {
    id: 'd3',
    name: 'medical-fitness.pdf',
    icon: 'ti ti-file-type-pdf',
    iconColor: 'text-danger',
    avatarClass: 'bg-danger-transparent text-danger',
    category: { label: 'Medical Records', className: 'bg-danger-transparent text-danger' },
    status: { label: 'Expired', className: 'badge-soft-danger' },
    favourite: false,
    photo: 'assets/img/students/student-03.jpg',
    student: 'Sophia Reyes',
    admissionNo: 'AD283780',
    className: 'Class III',
    size: '820 KB',
    date: '10 Jun 2026',
    uploadedBy: 'Uploaded by Teena Mathew',
  },
  {
    id: 'd4',
    name: 'transfer-certificate.pdf',
    icon: 'ti ti-file-type-pdf',
    iconColor: 'text-danger',
    avatarClass: 'bg-danger-transparent text-danger',
    category: { label: 'Transfer Certificate', className: 'bg-danger-transparent text-danger' },
    status: { label: 'Verified', className: 'badge-soft-success' },
    favourite: false,
    photo: 'assets/img/students/student-04.jpg',
    student: 'Liam Walker',
    admissionNo: 'AD283781',
    className: 'Class IV',
    size: '1.1 MB',
    date: '20 Jun 2026',
    uploadedBy: 'Uploaded by Admin',
  },
  {
    id: 'd5',
    name: 'marksheet-term1.pdf',
    icon: 'ti ti-file-type-pdf',
    iconColor: 'text-danger',
    avatarClass: 'bg-danger-transparent text-danger',
    category: { label: 'Mark Sheets', className: 'bg-danger-transparent text-danger' },
    status: { label: 'Pending', className: 'badge-soft-warning' },
    favourite: true,
    photo: 'assets/img/students/student-05.jpg',
    student: 'Mia Bennett',
    admissionNo: 'AD283782',
    className: 'Class II',
    size: '2.1 MB',
    date: '15 Jun 2026',
    uploadedBy: 'Uploaded by Teena Mathew',
  },
  {
    id: 'd6',
    name: 'passport-scan.png',
    icon: 'ti ti-photo',
    iconColor: 'text-success',
    avatarClass: 'bg-success-transparent text-success',
    category: { label: 'Passport', className: 'bg-success-transparent text-success' },
    status: { label: 'Verified', className: 'badge-soft-success' },
    favourite: true,
    photo: 'assets/img/students/student-06.jpg',
    student: 'Noah Diaz',
    admissionNo: 'AD283783',
    className: 'Class I',
    size: '980 KB',
    date: '05 Jun 2026',
    uploadedBy: 'Uploaded by Admin',
  },
];

export interface RowMenuItem {
  id: string;
  icon?: string;
  label?: string;
  modal?: DocumentModalId;
  action?: 'print' | 'favourite';
  divider?: boolean;
  danger?: boolean;
}

/** The row menu shared by the grid card and the list row. */
export const rowMenu: RowMenuItem[] = [
  { id: 'replace', icon: 'ti ti-replace', label: 'Replace File', modal: 'replace' },
  { id: 'print', icon: 'ti ti-printer', label: 'Print', action: 'print' },
  { id: 'rename', icon: 'ti ti-pencil', label: 'Rename', modal: 'rename' },
  { id: 'move', icon: 'ti ti-folder-symlink', label: 'Move', modal: 'move' },
  { id: 'duplicate', icon: 'ti ti-copy', label: 'Duplicate' },
  { id: 'favourite', icon: 'ti ti-star', label: 'Favourite', action: 'favourite' },
  { id: 'archive', icon: 'ti ti-archive', label: 'Archive' },
  { id: 'history', icon: 'ti ti-history', label: 'Version History', modal: 'version' },
  { id: 'divider', divider: true },
  { id: 'delete', icon: 'ti ti-trash', label: 'Delete', modal: 'delete', danger: true },
];

export const filterFields = [
  { id: 'student', label: 'Student', options: ['Janet Daniel', 'George Kettut', 'Sophia Reyes'] },
  { id: 'class', label: 'Class', options: ['Class I', 'Class II', 'Class III', 'Class IV'] },
  { id: 'section', label: 'Section', options: ['A', 'B', 'C'] },
  { id: 'category', label: 'Category', options: ['Birth Certificate', 'Identity Proof', 'Mark Sheets', 'Medical Records'] },
  { id: 'verification', label: 'Verification', options: ['Verified', 'Pending', 'Rejected', 'Expired'] },
  { id: 'file-type', label: 'File Type', options: ['PDF', 'Image', 'Doc'] },
];

export type DocSortKey = 'newest' | 'oldest' | 'name' | 'size';

export const sortOptions: { id: DocSortKey; icon: string; label: string }[] = [
  { id: 'newest', icon: 'ti ti-clock', label: 'Newest first' },
  { id: 'oldest', icon: 'ti ti-history', label: 'Oldest first' },
  { id: 'name', icon: 'ti ti-abc', label: 'Name (A–Z)' },
  { id: 'size', icon: 'ti ti-file', label: 'File size' },
];

export type DocumentModalId =
  | 'replace'
  | 'share'
  | 'verify'
  | 'rename'
  | 'move'
  | 'upload'
  | 'bulkUpload'
  | 'reject'
  | 'version'
  | 'categories'
  | 'delete';
