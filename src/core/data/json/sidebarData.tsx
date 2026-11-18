import { all_routes } from "@/routes/all_routes";

const routes = all_routes;

// Only the finalised modules are shown here. The original template menu (with every other
// section) is kept in sidebarData.backup.tsx: copy an item back from there to bring it back.
export const SidebarData = [
  {
    label: "Main",
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: "ti ti-layout-dashboard",
        submenu: true,
        submenuItems: [
          {
            label: "Admin Dashboard",
            submenu: false,
            link: routes.adminDashboard,
          },
          {
            label: "Teacher Dashboard",
            submenu: false,
            link: routes.teacherDashboard,
          },
          {
            label: "Student Dashboard",
            submenu: false,
            link: routes.studentDashboard,
          },
          {
            label: "Parent Dashboard",
            submenu: false,
            link: routes.parentDashboard,
          },
        ],
      },
    ],
  },
  {
    label: "People & Admission",
    submenuHdr: "People & Admission",
    submenuItems: [
      {
        label: "Students",
        icon: "ti ti-school",
        submenu: true,
        submenuItems: [
          {
            label: "Students",
            submenu: false,
            link: routes.studentGrid,
          },
          {
            label: "Student Profile",
            submenu: false,
            link: routes.studentDetail,
          },
          {
            label: "Admissions",
            submenu: false,
            link: routes.admissions,
          },
          {
            label: "Student Promotion",
            submenu: false,
            link: routes.studentPromotion,
          },
          {
            label: "Alumni",
            submenu: false,
            link: routes.alumni,
          },
          {
            label: "Student Attendance History",
            submenu: false,
            link: routes.studentAttendanceHistory,
          },
          {
            label: "Student Documents",
            submenu: false,
            link: routes.studentDocuments,
          },
        ],
      },
      {
        label: "Teachers",
        icon: "ti ti-users",
        submenu: true,
        submenuItems: [
          {
            label: "Teachers",
            submenu: false,
            link: routes.teacherGrid,
          },
          {
            label: "Add Teacher",
            submenu: false,
            link: routes.addTeacher,
          },
          {
            label: "Teacher Profile",
            submenu: false,
            link: routes.teacherDetails,
          },
          {
            label: "Routine",
            submenu: false,
            link: routes.teachersRoutine,
          },
        ],
      },
      {
        label: "Staff",
        icon: "ti ti-user-cog",
        submenu: true,
        submenuItems: [
          {
            label: "Staff List",
            submenu: false,
            link: routes.staff,
          },
          {
            label: "Departments",
            submenu: false,
            link: routes.departments,
          },
          {
            label: "Designation",
            submenu: false,
            link: routes.designation,
          },
        ],
      },
      {
        label: "Users",
        icon: "ti ti-users-minus",
        submenu: true,
        submenuItems: [
          {
            label: "Users",
            submenu: false,
            link: routes.manageusers,
          },
          {
            label: "Roles & Permissions",
            submenu: false,
            link: routes.rolesPermissions,
          },
          {
            label: "Delete Account Request",
            submenu: false,
            link: routes.deleteRequest,
          },
        ],
      },
    ],
  },
  {
    label: "Academic",
    submenuHdr: "Academic",
    submenuItems: [
      {
        label: "Classes & Sections",
        icon: "ti ti-school-bell",
        submenu: true,
        submenuItems: [
          {
            label: "Classes",
            submenu: false,
            link: routes.classes,
          },
          {
            label: "Classrooms",
            submenu: false,
            link: routes.classRoom,
          },
          {
            label: "Sections",
            submenu: false,
            link: routes.classSection,
          },
        ],
      },
      {
        label: "Subjects",
        icon: "ti ti-book",
        submenu: false,
        link: routes.classSubject,
      },
      {
        label: "Timetable",
        icon: "ti ti-table",
        submenu: true,
        submenuItems: [
          {
            label: "Class Timetable",
            submenu: false,
            link: routes.classTimetable,
          },
          {
            label: "Teacher Timetable",
            submenu: false,
            link: routes.teacherTimeTable,
          },
        ],
      },
      {
        label: "Learning",
        icon: "ti ti-book-2",
        submenu: true,
        submenuItems: [
          {
            label: "Study Materials",
            submenu: false,
            link: routes.studyMaterials,
          },
          {
            label: "Homework",
            submenu: false,
            link: routes.classHomeWork,
          },
        ],
      },
    ],
  },
  {
    label: "HRM",
    submenuHdr: "HRM",
    submenuItems: [
      {
        label: "Holidays",
        icon: "ti ti-calendar-event",
        submenu: false,
        link: routes.holidays,
      },
      {
        label: "Attendance",
        icon: "ti ti-calendar-check",
        submenu: true,
        submenuItems: [
          {
            label: "Student Attendance",
            submenu: false,
            link: routes.studentAttendance,
          },
          {
            label: "Teacher Attendance",
            submenu: false,
            link: routes.teacherAttendance,
          },
          {
            label: "Staff Attendance",
            submenu: false,
            link: routes.staffAttendance,
          },
          {
            label: "Leave List",
            submenu: false,
            link: routes.listLeaves,
          },
        ],
      },
    ],
  },
  {
    label: "Finance & Accounts",
    submenuHdr: "Finance & Accounts",
    submenuItems: [
      {
        label: "Fees",
        icon: "ti ti-report-money",
        submenu: true,
        submenuItems: [
          {
            label: "Fee Structure",
            submenu: false,
            link: routes.feesMaster,
          },
          {
            label: "Fees Assign",
            submenu: false,
            link: routes.feesAssign,
          },
          {
            label: "Fee Collection",
            submenu: false,
            link: routes.collectFees,
          },
          {
            label: "Fees Type (Fee Categories)",
            submenu: false,
            link: routes.feesType,
          },
          {
            label: "Fee Groups",
            submenu: false,
            link: routes.feesGroup,
          },
          {
            label: "Fine Management",
            submenu: false,
            link: routes.fineManagement,
          },
          {
            label: "Scholarships",
            submenu: false,
            link: routes.scholarships,
          },
          {
            label: "Due Reports",
            submenu: false,
            link: routes.dueReports,
          },
          {
            label: "Receipts",
            submenu: false,
            link: routes.receipts,
          },
        ],
      },
      {
        label: "Accounts",
        icon: "ti ti-receipt-2",
        submenu: true,
        submenuItems: [
          {
            label: "Expenses",
            submenu: false,
            link: routes.expense,
          },
          {
            label: "Expense Category",
            submenu: false,
            link: routes.expenseCategory,
          },
        ],
      },
    ],
  },
  {
    label: "Campus Operations",
    submenuHdr: "Campus Operations",
    submenuItems: [
      {
        label: "Transport",
        icon: "ti ti-bus",
        submenu: true,
        submenuItems: [
          {
            label: "Routes",
            submenu: false,
            link: routes.transportRoutes,
          },
          {
            label: "Pickup Points",
            submenu: false,
            link: routes.transportPickupPoints,
          },
          {
            label: "Vehicles",
            submenu: false,
            link: routes.transportVehicle,
          },
          {
            label: "Drivers",
            submenu: false,
            link: routes.transportVehicleDrivers,
          },
          {
            label: "Assign Vehicle",
            submenu: false,
            link: routes.transportAssignVehicle,
          },
          {
            label: "Assign Students",
            submenu: false,
            link: routes.transportAssignStudents,
          },
          {
            label: "GPS Tracking",
            submenu: false,
            link: routes.transportGpsTracking,
          },
          {
            label: "Route Scheduling",
            submenu: false,
            link: routes.transportRouteScheduling,
          },
        ],
      },
      {
        label: "Assets",
        icon: "ti ti-package",
        submenu: true,
        submenuItems: [
          {
            label: "Assets",
            submenu: false,
            link: routes.assets,
          },
          {
            label: "Asset Allocation",
            submenu: false,
            link: routes.assetAllocation,
          },
          {
            label: "Asset Maintenance",
            submenu: false,
            link: routes.assetMaintenance,
          },
          {
            label: "Stock Management",
            submenu: false,
            link: routes.stockManagement,
          },
        ],
      },
      {
        label: "Gate Pass",
        icon: "ti ti-shield-lock",
        submenu: false,
        link: routes.gatePass,
      },
    ],
  },
  {
    label: "Reports",
    submenuHdr: "Reports",
    submenuItems: [
      {
        label: "School Strength Report",
        icon: "ti ti-report-analytics",
        submenu: false,
        link: routes.schoolStrengthReport,
      },
    ],
  },
];