import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

export interface PageLink {
  id: string;
  label: string;
  icon: string;
  /** Where the card goes, or null when this build has no such page. */
  route: string | null;
}

export interface Wave {
  id: string;
  title: string;
  icon: string;
  /** Bootstrap tint stem; every card in the wave takes it. */
  tint: string;
  pages: PageLink[];
}

export const WAVES: Wave[] = [
  {
    id: 'student-modules-v2-0',
    title: 'Student Modules v2.0',
    icon: 'ti ti-school',
    tint: 'primary',
    pages: [
      { id: 'admissions', label: 'Admissions', icon: 'ti ti-file-description', route: routes.admissions },
      { id: 'new-admission-wizard', label: 'New Admission (Wizard)', icon: 'ti ti-forms', route: routes.addAdmission },
      { id: 'admission-details', label: 'Admission Details', icon: 'ti ti-id', route: routes.admissionDetails },
      { id: 'alumni-directory', label: 'Alumni Directory', icon: 'ti ti-users', route: routes.alumni },
      { id: 'alumni-profile', label: 'Alumni Profile', icon: 'ti ti-user-circle', route: routes.alumniProfile },
      { id: 'add-alumni', label: 'Add Alumni', icon: 'ti ti-user-plus', route: routes.addAlumni },
      { id: 'attendance-history', label: 'Attendance History', icon: 'ti ti-calendar-stats', route: routes.studentAttendanceHistory },
      { id: 'student-documents', label: 'Student Documents', icon: 'ti ti-files', route: routes.studentDocuments },
      { id: 'document-viewer', label: 'Document Viewer', icon: 'ti ti-file-search', route: routes.documentViewer },
    ],
  },
  {
    id: 'wave-1-flagships',
    title: 'Wave 1 — Flagships',
    icon: 'ti ti-sparkles',
    tint: 'info',
    pages: [
      { id: 'executive-dashboard', label: 'Executive Dashboard', icon: 'ti ti-chart-arcs', route: null },
      { id: 'student-360', label: 'Student 360°', icon: 'ti ti-user-circle', route: routes.student360 },
      { id: 'ai-command-center', label: 'AI Command Center', icon: 'ti ti-robot', route: routes.aiCommandCenter },
      { id: 'ai-attendance-predictor', label: 'AI Attendance Predictor', icon: 'ti ti-calendar-stats', route: routes.aiAttendancePredictor },
      { id: 'ai-risk-detection', label: 'AI Risk Detection', icon: 'ti ti-shield-exclamation', route: routes.aiRiskDetection },
    ],
  },
  {
    id: 'wave-2-operations-finance',
    title: 'Wave 2 — Operations & Finance',
    icon: 'ti ti-settings',
    tint: 'success',
    pages: [
      { id: 'fee-installments', label: 'Fee Installments', icon: 'ti ti-calendar-dollar', route: routes.feeInstallments },
      { id: 'online-payment-receipts', label: 'Online Payment & Receipts', icon: 'ti ti-credit-card', route: routes.onlinePaymentReceipts },
      { id: 'transport-live-map', label: 'Transport Live Map', icon: 'ti ti-map-2', route: null },
      { id: 'visitor-management', label: 'Visitor Management', icon: 'ti ti-user-shield', route: null },
      { id: 'health-infirmary', label: 'Health & Infirmary', icon: 'ti ti-first-aid-kit', route: null },
      { id: 'inventory-assets', label: 'Inventory & Assets', icon: 'ti ti-package', route: null },
    ],
  },
  {
    id: 'wave-3-academics',
    title: 'Wave 3 — Academics',
    icon: 'ti ti-book',
    tint: 'warning',
    pages: [
      { id: 'curriculum-builder', label: 'Curriculum Builder', icon: 'ti ti-sitemap', route: null },
      { id: 'lesson-planning', label: 'Lesson Planning', icon: 'ti ti-notebook', route: routes.lessonPlanning },
      { id: 'online-examination', label: 'Online Examination', icon: 'ti ti-file-check', route: routes.onlineExamination },
      { id: 'question-bank', label: 'Question Bank', icon: 'ti ti-help-circle', route: routes.questionBank },
      { id: 'communication-center', label: 'Communication Center', icon: 'ti ti-speakerphone', route: null },
      { id: 'performance-analytics', label: 'Performance Analytics', icon: 'ti ti-chart-histogram', route: routes.performanceAnalytics },
    ],
  },
  {
    id: 'wave-4-governance',
    title: 'Wave 4 — Governance',
    icon: 'ti ti-shield-lock',
    tint: 'danger',
    pages: [
      { id: 'audit-log', label: 'Audit Log', icon: 'ti ti-history', route: routes.auditLog },
      { id: 'approval-workflow', label: 'Approval Workflow', icon: 'ti ti-checks', route: null },
      { id: 'behavior-discipline', label: 'Behavior & Discipline', icon: 'ti ti-mood-cog', route: routes.behaviorDiscipline },
      { id: 'feedback-surveys', label: 'Feedback & Surveys', icon: 'ti ti-clipboard-list', route: null },
      { id: 'forms-builder', label: 'Forms Builder', icon: 'ti ti-forms', route: null },
    ],
  },
  {
    id: 'wave-5-extended-modules',
    title: 'Wave 5 - Extended Modules',
    icon: 'ti ti-stack-2',
    tint: 'secondary',
    pages: [
      { id: 'principal-dashboard', label: 'Principal Dashboard', icon: 'ti ti-chart-arcs', route: null },
      { id: 'teacher-360', label: 'Teacher 360°', icon: 'ti ti-user-circle', route: null },
      { id: 'scholarship-management', label: 'Scholarship Management', icon: 'ti ti-award', route: routes.scholarshipManagement },
      { id: 'rewards-gamification', label: 'Rewards & Gamification', icon: 'ti ti-medal', route: routes.rewardsGamification },
      { id: 'digital-id-card', label: 'Digital ID Card', icon: 'ti ti-id', route: routes.digitalIdCard },
      { id: 'student-wallet', label: 'Student Wallet', icon: 'ti ti-wallet', route: routes.studentWallet },
    ],
  },
];

/** What the header badge counts. */
export const PAGE_COUNT = WAVES.reduce((total, wave) => total + wave.pages.length, 0);

export const INTRO =
  'Click any page to open it. This index lists all v2.0 modules added in this engagement, grouped by wave.';
