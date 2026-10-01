// Per-module body skins used by the HTML template (`<body class="sc-skin-*">`).
// Keyed by route path so the layout can apply the same class in React.
const MODULE_SKINS: Record<string, string[]> = {
  "sc-skin-students": [
    "add-admission", "add-alumni", "admission-details", "admissions",
    "alumni-profile", "alumni", "behavior-discipline", "digital-id-card",
    "document-viewer", "rewards-gamification", "student-360",
    "student-attendance-history", "student-documents",
  ],
  "sc-skin-ai": [
    "ai-attendance-predictor", "ai-behavior-analysis", "ai-command-center",
    "ai-fee-forecast", "ai-homework-evaluation", "ai-notification-assistant",
    "ai-parent-insights", "ai-report-generator", "ai-risk-detection",
    "ai-scholarship-recommendation", "ai-student-assistant",
    "ai-student-intelligence", "ai-teacher-productivity",
    "ai-timetable-optimizer",
  ],
  "sc-skin-fees": [
    "fee-installments", "online-payment-receipts", "scholarship-management",
    "student-wallet",
  ],
  "sc-skin-exams": [
    "online-examination", "performance-analytics", "question-bank",
  ],
  "sc-skin-hr": ["audit-log"],
};

const SKIN_BY_PATH: Record<string, string> = {};
for (const [skin, pages] of Object.entries(MODULE_SKINS)) {
  for (const page of pages) SKIN_BY_PATH[`/${page}`] = skin;
}

export const skinForPath = (pathname: string): string =>
  SKIN_BY_PATH[pathname] ?? "";
