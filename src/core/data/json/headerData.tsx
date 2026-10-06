import { all_routes } from "@/routes/all_routes";

const routes = all_routes;

// Content of the header dropdown panels, taken from html/sidebar.html.

export const currentAcademicYear = "2026 / 2027";

export const academicYears = [
  { year: "2025 / 2026", status: "Current session", active: true },
  { year: "2024 / 2025", status: "Archived", active: false },
  { year: "2023 / 2024", status: "Archived", active: false },
  { year: "2022 / 2023", status: "Archived", active: false },
];

export const languages = [
  { name: "English", native: "United States", flag: "assets/img/flags/us.png", active: true },
  { name: "French", native: "France", flag: "assets/img/flags/fr.png", active: false },
  { name: "Spanish", native: "España", flag: "assets/img/flags/es.png", active: false },
  { name: "German", native: "Deutschland", flag: "assets/img/flags/de.png", active: false },
];

export const addNewActions = [
  { title: "New Student", subtitle: "Admit & assign to a class", icon: "ti ti-school", tone: "anew-blue", link: routes.addStudent },
  { title: "New Teacher", subtitle: "Add faculty & subjects", icon: "ti ti-users", tone: "anew-green", link: routes.addTeacher },
  { title: "New Staff", subtitle: "Onboard a staff member", icon: "ti ti-users-group", tone: "anew-amber", link: routes.addStaff },
  // `exam-schedule.html` in the template is a dead link; the real page is schedule-exam.html
  { title: "Create Exam", subtitle: "Schedule a new examination", icon: "ti ti-file-certificate", tone: "anew-purple", link: routes.examSchedule },
  { title: "Collect Fee", subtitle: "Record a fee payment", icon: "ti ti-cash", tone: "anew-cyan", link: routes.collectFees },
  // `add-invoices.html` in the template is a dead link; the real page is add-invoice.html
  { title: "New Invoice", subtitle: "Generate a billing invoice", icon: "ti ti-license", tone: "anew-pink", link: routes.addInvoice },
];

export const notifications = [
  {
    avatar: "assets/img/profiles/avatar-27.jpg",
    badgeIcon: "ti ti-alert-triangle",
    badgeTone: "nb-red",
    time: "Just now",
    unread: true,
    actions: false,
    text: (
      <p>
        <b>Shawn</b>&apos;s performance in Math is below the threshold.
      </p>
    ),
  },
  {
    avatar: "assets/img/profiles/avatar-23.jpg",
    badgeIcon: "ti ti-calendar-event",
    badgeTone: "nb-blue",
    time: "10 mins ago",
    unread: true,
    actions: true,
    text: (
      <p>
        <b>Sylvia</b> requested an appointment at 02:00 PM.
      </p>
    ),
  },
  {
    avatar: "assets/img/profiles/avatar-25.jpg",
    badgeIcon: "ti ti-user-plus",
    badgeTone: "nb-green",
    time: "2 hrs ago",
    unread: true,
    actions: false,
    text: (
      <p>
        New student record <b>George</b> was created by <b>Teressa</b>.
      </p>
    ),
  },
  {
    avatar: "assets/img/profiles/avatar-01.jpg",
    badgeIcon: "ti ti-chalkboard",
    badgeTone: "nb-purple",
    time: "09:45 AM",
    unread: false,
    actions: false,
    text: (
      <p>
        A new teacher record for <b>Elisa</b> was added.
      </p>
    ),
  },
];

export const messages = [
  { name: "Sylvia", time: "2m", preview: "Can we reschedule the meeting?", avatar: "assets/img/profiles/avatar-23.jpg", status: "is-online", unread: 2 },
  { name: "George", time: "18m", preview: "Shared the exam results file.", avatar: "assets/img/profiles/avatar-25.jpg", status: "is-idle", unread: 1 },
  { name: "Elisa", time: "1h", preview: "Thanks for the update!", avatar: "assets/img/profiles/avatar-01.jpg", status: "is-online", unread: 0 },
  { name: "Marcus", time: "3h", preview: "The transport route has been updated.", avatar: "assets/img/profiles/avatar-05.jpg", status: "is-idle", unread: 0 },
];

export const appTiles = [
  { label: "Calendar", icon: "ti ti-calendar", tone: "ai-blue", link: routes.calendar },
  { label: "Email", icon: "ti ti-mail", tone: "ai-green", link: routes.email },
  { label: "To Do", icon: "ti ti-checklist", tone: "ai-amber", link: routes.todo },
  { label: "Files", icon: "ti ti-folder", tone: "ai-red", link: routes.fileManager },
  { label: "Notes", icon: "ti ti-notes", tone: "ai-indigo", link: routes.notes },
  // `accounts-invoices.html` in the template is a dead link; the real page is invoices.html
  { label: "Invoices", icon: "ti ti-file-invoice", tone: "ai-teal", link: routes.accountsInvoices },
  { label: "Tickets", icon: "ti ti-ticket", tone: "ai-pink", link: routes.tickets },
];

export const searchRecent = [
  { label: "Fee collection report", link: routes.feesMaster },
  { label: "Today's attendance", link: routes.studentAttendance },
  { label: "Term-1 exam schedule", link: routes.examSchedule },
];

export const searchQuickLinks = [
  { label: "Students", icon: "ti ti-users-group", tone: "ic-blue", link: routes.studentGrid },
  { label: "Teachers", icon: "ti ti-chalkboard", tone: "ic-green", link: routes.teacherGrid },
  { label: "Fees", icon: "ti ti-report-money", tone: "ic-amber", link: routes.feesMaster },
  { label: "Examinations", icon: "ti ti-file-certificate", tone: "ic-purple", link: routes.exam },
  { label: "Library", icon: "ti ti-books", tone: "ic-teal", link: routes.libraryBooks },
];

export const DOCS_URL = "https://preschool.dreamstechnologies.com/documentation/index.html";
