import { all_routes } from "@/routes/all_routes";

/**
 * Which roles may see each TOP-LEVEL sidebar item (matched by its label in sidebarData.tsx).
 *
 * - "admin" (owners and admins) always sees everything, so it is not listed here.
 * - An item that is not listed here is hidden from every other role (safe default for new menu items).
 * - This only hides the menu. The pages are guarded separately, and the API enforces permissions.
 */

const ALL_STAFF = ["accountant", "receptionist", "librarian", "warden", "transport_manager", "nurse", "security"];
const EVERYONE = ["teacher", "student", "parent", ...ALL_STAFF];

const MENU_ACCESS: Record<string, string[]> = {
  // Main
  Dashboard: EVERYONE, // its sub-items are narrowed below

  // People & Admission
  Students: ["teacher", "receptionist"],
  Parents: ["teacher", "receptionist"],

  // Academic
  "Classes & Sections": ["teacher"],
  "Subjects & Curriculum": ["teacher", "student", "parent"],
  Subjects: ["teacher", "student", "parent"],
  Timetable: ["teacher", "student", "parent"],
  Learning: ["teacher", "student", "parent"],
  Examination: ["teacher", "student", "parent"],

  // HRM
  Holidays: EVERYONE,
  Attendance: ["teacher", "student", "parent"],

  // Finance & Accounts
  Fees: ["accountant", "student", "parent"],
  Billing: ["accountant"],
  Accounts: ["accountant"],

  // Campus Operations
  Library: ["librarian", "teacher", "student", "parent"],
  Transport: ["transport_manager", "student", "parent"],
  Sports: EVERYONE,
  Hostel: ["warden", "student"],
  Cafeteria: EVERYONE,
  Security: ["security"],
  "Gate Pass": ["security", "receptionist"],
  Medical: ["nurse"],

  // Administration
  Events: EVERYONE,
};

// Staff roles that share the admin dashboard (there are only four dashboards).
const ADMIN_DASHBOARD_ROLES = ["accountant", "receptionist", "librarian", "warden", "transport_manager", "nurse", "security"];

function dashboardLinkAllowed(link: string | undefined, role: string): boolean {
  if (link === all_routes.teacherDashboard) return role === "teacher";
  if (link === all_routes.studentDashboard) return role === "student";
  if (link === all_routes.parentDashboard) return role === "parent";
  if (link === all_routes.adminDashboard) return ADMIN_DASHBOARD_ROLES.includes(role);
  return false;
}

interface MenuLike<T> {
  label: string;
  link?: string;
  submenuItems?: T[];
}

/**
 * The menu items `role` may see. "admin" gets everything; no role (e.g. a person with no school yet) gets nothing.
 */
export function filterMenuItems<T extends MenuLike<T>>(items: T[], role: string | null | undefined): T[] {
  if (!role) return [];
  if (role === "admin") return items;

  return items
    .filter((item) => MENU_ACCESS[item.label]?.includes(role) ?? false)
    .map((item) =>
      item.label === "Dashboard" && item.submenuItems
        ? { ...item, submenuItems: item.submenuItems.filter((child) => dashboardLinkAllowed(child.link, role)) }
        : item,
    );
}