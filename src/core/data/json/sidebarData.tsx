import { all_routes } from "@/routes/all_routes";

const routes = all_routes;

// Mirrors the menu in html/sidebar.html — section order, labels, Tabler icons and
// nesting are taken verbatim from the template. Regenerate rather than hand-edit
// when the HTML sidebar changes.
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
      {
        label: "Application",
        icon: "ti ti-layout-list",
        submenu: true,
        submenuItems: [
          {
            label: "Chat",
            submenu: false,
            link: routes.chat,
          },
          {
            label: "Call",
            submenu: false,
            link: routes.audioCall,
          },
          {
            label: "Calendar",
            submenu: false,
            link: routes.calendar,
          },
          {
            label: "Email",
            submenu: false,
            link: routes.email,
          },
          {
            label: "To Do",
            submenu: false,
            link: routes.todo,
          },
          {
            label: "Notes",
            submenu: false,
            link: routes.notes,
          },
          {
            label: "File Manager",
            submenu: false,
            link: routes.fileManager,
          },
        ],
      },
      {
        label: "Layouts",
        icon: "ti ti-layout-dashboard",
        submenu: true,
        submenuItems: [
          {
            label: "Default",
            icon: "ti ti-layout-sidebar",
            submenu: false,
            link: routes.layoutDefault,
            themeSetting: true,
          },
          {
            label: "Mini",
            icon: "ti ti-layout-align-left",
            submenu: false,
            link: routes.layoutMini,
            themeSetting: true,
          },
          {
            label: "RTL",
            icon: "ti ti-text-direction-rtl",
            submenu: false,
            link: routes.layoutRtl,
            themeSetting: true,
          },
          {
            label: "Box",
            icon: "ti ti-layout-distribute-vertical",
            submenu: false,
            link: routes.layoutBox,
            themeSetting: true,
          },
          {
            label: "Dark",
            icon: "ti ti-moon",
            submenu: false,
            link: routes.layoutDark,
            themeSetting: true,
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
        label: "Parents",
        icon: "ti ti-users-group",
        submenu: false,
        link: routes.parentGrid,
      },
      {
        label: "Guardians",
        icon: "ti ti-user-heart",
        submenu: false,
        link: routes.guardiansGrid,
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
          {
            label: "Class Routine",
            submenu: false,
            link: routes.classRoutine,
          },
          {
            label: "Class Schedule",
            submenu: false,
            link: routes.sheduleClasses,
          },
          {
            label: "Academic Calendar",
            submenu: false,
            link: routes.academicCalendar,
          },
        ],
      },
      {
        label: "Subjects & Curriculum",
        icon: "ti ti-book",
        submenu: true,
        submenuItems: [
          {
            label: "Subjects",
            submenu: false,
            link: routes.classSubject,
          },
          {
            label: "Curriculum",
            submenu: false,
            link: routes.curriculum,
          },
          {
            label: "Syllabus Tracking",
            submenu: false,
            link: routes.classSyllabus,
          },
        ],
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
            label: "Lesson Planning",
            submenu: false,
            link: routes.lessonPlanning,
          },
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
      {
        label: "Examination",
        icon: "ti ti-certificate",
        submenu: true,
        submenuItems: [
          {
            label: "Exams",
            submenu: false,
            link: routes.exam,
          },
          {
            label: "Exam Types",
            submenu: false,
            link: routes.examTypes,
          },
          {
            label: "Schedule Exam",
            submenu: false,
            link: routes.examSchedule,
          },
          {
            label: "Admit Card",
            submenu: false,
            link: routes.admitCard,
          },
          {
            label: "Marks Entry",
            submenu: false,
            link: routes.marksEntry,
          },
          {
            label: "Grade Setup",
            submenu: false,
            link: routes.grade,
          },
          {
            label: "Exam Attendance",
            submenu: false,
            link: routes.examAttendance,
          },
          {
            label: "Exam Results",
            submenu: false,
            link: routes.examResult,
          },
          {
            label: "Report Cards",
            submenu: false,
            link: routes.reportCards,
          },
          {
            label: "Performance Analytics",
            submenu: false,
            link: routes.performanceAnalytics,
          },
          {
            label: "Subject Performance",
            submenu: false,
            link: routes.subjectPerformance,
          },
          {
            label: "Progress Reports",
            submenu: false,
            link: routes.progressReports,
          },
          {
            label: "Ranking System",
            submenu: false,
            link: routes.rankingSystem,
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
        label: "HR & Payroll",
        icon: "ti ti-briefcase",
        submenu: true,
        submenuItems: [
          {
            label: "Employee Payroll",
            submenu: false,
            link: routes.employeePayroll,
          },
          {
            label: "Salary Structure",
            submenu: false,
            link: routes.salaryStructure,
          },
          {
            label: "Payslips",
            submenu: false,
            link: routes.payslips,
          },
          {
            label: "Leave Policies",
            submenu: false,
            link: routes.leavePolicies,
          },
          {
            label: "Attendance Rules",
            submenu: false,
            link: routes.attendanceRules,
          },
        ],
      },
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
            label: "Biometric / RFID",
            submenu: false,
            link: routes.biometricRfid,
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
        label: "Billing",
        icon: "ti ti-file-invoice",
        submenu: true,
        submenuItems: [
          {
            label: "Invoices",
            submenu: false,
            link: routes.accountsInvoices,
          },
          {
            label: "Invoice Details",
            submenu: false,
            link: routes.invoice,
          },
          {
            label: "Bank Transactions",
            submenu: false,
            link: routes.bankTransactions,
          },
          {
            label: "Online Payments",
            submenu: false,
            link: routes.onlinePayments,
          },
          {
            label: "Payment History",
            submenu: false,
            link: routes.paymentHistory,
          },
          {
            label: "Refunds",
            submenu: false,
            link: routes.refunds,
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
          {
            label: "Income",
            submenu: false,
            link: routes.accountsIncome,
          },
          {
            label: "Ledger",
            submenu: false,
            link: routes.ledger,
          },
          {
            label: "Financial Reports",
            submenu: false,
            link: routes.financialReports,
          },
          {
            label: "Tax Reports",
            submenu: false,
            link: routes.taxReports,
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
        label: "Library",
        icon: "ti ti-books",
        submenu: true,
        submenuItems: [
          {
            label: "Books",
            submenu: false,
            link: routes.libraryBooks,
          },
          {
            label: "Categories",
            submenu: false,
            link: routes.libraryCategories,
          },
          {
            label: "Issue Books",
            submenu: false,
            link: routes.libraryIssueBook,
          },
          {
            label: "Return Books",
            submenu: false,
            link: routes.libraryReturn,
          },
          {
            label: "Members",
            submenu: false,
            link: routes.libraryMembers,
          },
          {
            label: "Reports",
            submenu: false,
            link: routes.libraryReports,
          },
          {
            label: "Reservations",
            submenu: false,
            link: routes.libraryReservations,
          },
        ],
      },
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
        label: "Sports",
        icon: "ti ti-run",
        submenu: true,
        submenuItems: [
          {
            label: "Sports",
            submenu: false,
            link: routes.sportsList,
          },
          {
            label: "Players",
            submenu: false,
            link: routes.playerList,
          },
        ],
      },
      {
        label: "Hostel",
        icon: "ti ti-building-fortress",
        submenu: true,
        submenuItems: [
          {
            label: "Hostel List",
            submenu: false,
            link: routes.hostelList,
          },
          {
            label: "Hostel Rooms",
            submenu: false,
            link: routes.hostelRoom,
          },
          {
            label: "Room Types",
            submenu: false,
            link: routes.hostelType,
          },
          {
            label: "Allocation",
            submenu: false,
            link: routes.roomAllocation,
          },
          {
            label: "Fees",
            submenu: false,
            link: routes.hostelFees,
          },
          {
            label: "Wardens",
            submenu: false,
            link: routes.wardens,
          },
          {
            label: "Visitor Log",
            submenu: false,
            link: routes.hostelVisitorLog,
          },
        ],
      },
      {
        label: "Cafeteria",
        icon: "ti ti-chef-hat",
        submenu: true,
        submenuItems: [
          {
            label: "Menu Management",
            submenu: false,
            link: routes.cafeteriaMenu,
          },
          {
            label: "Meal Plans",
            submenu: false,
            link: routes.mealPlans,
          },
          {
            label: "Orders",
            submenu: false,
            link: routes.cafeteriaOrders,
          },
          {
            label: "Billing",
            submenu: false,
            link: routes.cafeteriaBilling,
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
        label: "Security",
        icon: "ti ti-shield-lock",
        submenu: true,
        submenuItems: [
          {
            label: "Gate Entry",
            submenu: false,
            link: routes.gateEntry,
          },
          {
            label: "Exit Pass",
            submenu: false,
            link: routes.exitPass,
          },
          {
            label: "Staff Entry",
            submenu: false,
            link: routes.staffEntry,
          },
          {
            label: "Visitor Verification",
            submenu: false,
            link: routes.visitorVerification,
          },
          {
            label: "Visitor Log",
            submenu: false,
            link: routes.visitorLog,
          },
          {
            label: "Gate Pass",
            submenu: false,
            link: routes.gatePass,
          },
          {
            label: "Appointment Requests",
            submenu: false,
            link: routes.appointmentRequests,
          },
        ],
      },
      {
        label: "Medical",
        icon: "ti ti-first-aid-kit",
        submenu: true,
        submenuItems: [
          {
            label: "Sick Room Log",
            submenu: false,
            link: routes.sickRoomLog,
          },
          {
            label: "Medical Visits",
            submenu: false,
            link: routes.medicalVisits,
          },
          {
            label: "Health Alerts",
            submenu: false,
            link: routes.healthAlerts,
          },
        ],
      },
    ],
  },
  {
    label: "Communication",
    submenuHdr: "Communication",
    submenuItems: [
      {
        label: "Broadcast",
        icon: "ti ti-speakerphone",
        submenu: true,
        submenuItems: [
          {
            label: "Announcements",
            submenu: false,
            link: routes.announcements,
          },
          {
            label: "Notice Board",
            submenu: false,
            link: routes.noticeBoard,
          },
          {
            label: "Broadcast Scheduler",
            submenu: false,
            link: routes.broadcastScheduler,
          },
        ],
      },
      {
        label: "SMS",
        icon: "ti ti-message-2",
        submenu: true,
        submenuItems: [
          {
            label: "Send SMS",
            submenu: false,
            link: routes.sendSms,
          },
          {
            label: "Bulk SMS",
            submenu: false,
            link: routes.bulkSms,
          },
          {
            label: "Templates",
            submenu: false,
            link: routes.smsTemplates,
          },
          {
            label: "Logs",
            submenu: false,
            link: routes.smsLogs,
          },
        ],
      },
      {
        label: "WhatsApp",
        icon: "ti ti-brand-whatsapp",
        submenu: true,
        submenuItems: [
          {
            label: "Send Message",
            submenu: false,
            link: routes.sendWhatsapp,
          },
          {
            label: "Bulk Messaging",
            submenu: false,
            link: routes.bulkWhatsapp,
          },
          {
            label: "Templates",
            submenu: false,
            link: routes.whatsappTemplates,
          },
          {
            label: "Chat Inbox",
            submenu: false,
            link: routes.chatInbox,
          },
        ],
      },
      {
        label: "Notifications",
        icon: "ti ti-bell-ringing",
        submenu: true,
        submenuItems: [
          {
            label: "Email Notifications",
            submenu: false,
            link: routes.emailNotifications,
          },
          {
            label: "Push Notifications",
            submenu: false,
            link: routes.pushNotifications,
          },
          {
            label: "Parent Communication",
            submenu: false,
            link: routes.parentCommunication,
          },
        ],
      },
      {
        label: "Automation",
        icon: "ti ti-bolt",
        submenu: true,
        submenuItems: [
          {
            label: "Workflow Rules",
            submenu: false,
            link: routes.workflowRules,
          },
          {
            label: "Trigger Actions",
            submenu: false,
            link: routes.triggerActions,
          },
          {
            label: "Scheduled Tasks",
            submenu: false,
            link: routes.scheduledTasks,
          },
        ],
      },
    ],
  },
  {
    label: "Reports",
    submenuHdr: "Reports",
    submenuItems: [
      {
        label: "Reports & Analytics",
        icon: "ti ti-chart-infographic",
        submenu: true,
        submenuItems: [
          {
            label: "Attendance Reports",
            submenu: false,
            link: routes.attendanceReport,
          },
          {
            label: "Academic Reports",
            submenu: false,
            link: routes.academicReports,
          },
          {
            label: "Student Performance",
            submenu: false,
            link: routes.studentPerformance,
          },
          {
            label: "Class Analytics",
            submenu: false,
            link: routes.classAnalytics,
          },
          {
            label: "Grade Reports",
            submenu: false,
            link: routes.gradeReport,
          },
          {
            label: "Fee Collection",
            submenu: false,
            link: routes.feeCollectionReport,
          },
          {
            label: "Teacher Performance",
            submenu: false,
            link: routes.teacherPerformance,
          },
          {
            label: "Custom Reports",
            submenu: false,
            link: routes.customReports,
          },
        ],
      },
      {
        label: "AI Insights",
        icon: "ti ti-sparkles",
        submenu: true,
        submenuItems: [
          {
            label: "AI Command Center",
            submenu: false,
            link: routes.aiCommandCenter,
          },
          {
            label: "Attendance Predictor",
            submenu: false,
            link: routes.aiAttendancePredictor,
          },
          {
            label: "Risk Detection",
            submenu: false,
            link: routes.aiRiskDetection,
          },
          {
            label: "Student Intelligence",
            submenu: false,
            link: routes.aiStudentIntelligence,
          },
          {
            label: "Report Generator",
            submenu: false,
            link: routes.aiReportGenerator,
          },
          {
            label: "Timetable Optimizer",
            submenu: false,
            link: routes.aiTimetableOptimizer,
          },
          {
            label: "Homework Evaluation",
            submenu: false,
            link: routes.aiHomeworkEvaluation,
          },
          {
            label: "Teacher Productivity",
            submenu: false,
            link: routes.aiTeacherProductivity,
          },
          {
            label: "Parent Insights",
            submenu: false,
            link: routes.aiParentInsights,
          },
          {
            label: "Fee Forecast",
            submenu: false,
            link: routes.aiFeeForecast,
          },
          {
            label: "Student Assistant",
            submenu: false,
            link: routes.aiStudentAssistant,
          },
        ],
      },
      {
        label: "Achievements",
        icon: "ti ti-trophy",
        submenu: true,
        submenuItems: [
          {
            label: "Student Awards",
            submenu: false,
            link: routes.studentAwards,
          },
          {
            label: "Competitions",
            submenu: false,
            link: routes.competitions,
          },
          {
            label: "Certificate Records",
            submenu: false,
            link: routes.certificateRecords,
          },
        ],
      },
      {
        label: "Certificates",
        icon: "ti ti-certificate",
        submenu: true,
        submenuItems: [
          {
            label: "Generate Certificates",
            submenu: false,
            link: routes.generateCertificates,
          },
          {
            label: "Student ID Cards",
            submenu: false,
            link: routes.studentIdCards,
          },
          {
            label: "Bonafide Certificate",
            submenu: false,
            link: routes.bonafideCertificate,
          },
          {
            label: "Transfer Certificate",
            submenu: false,
            link: routes.transferCertificate,
          },
          {
            label: "ID Card Templates",
            submenu: false,
            link: routes.idCardTemplates,
          },
        ],
      },
    ],
  },
  {
    label: "Administration",
    submenuHdr: "Administration",
    submenuItems: [
      {
        label: "Events",
        icon: "ti ti-calendar-event",
        submenu: true,
        submenuItems: [
          {
            label: "Events",
            submenu: false,
            link: routes.events,
          },
          {
            label: "Activities",
            submenu: false,
            link: routes.activity,
          },
        ],
      },
      {
        label: "Multi School",
        icon: "ti ti-building-community",
        submenu: true,
        submenuItems: [
          {
            label: "Tenant Settings",
            submenu: false,
            link: routes.tenantSettings,
          },
          {
            label: "Subscription Plans",
            submenu: false,
            link: routes.subscriptionPlans,
          },
          {
            label: "Plan Features",
            submenu: false,
            link: routes.planFeatures,
          },
          {
            label: "Usage Limits",
            submenu: false,
            link: routes.usageLimits,
          },
          {
            label: "Branch Management",
            submenu: false,
            link: routes.branchManagement,
          },
          {
            label: "Franchise Setup",
            submenu: false,
            link: routes.franchiseSetup,
          },
          {
            label: "Central Dashboard",
            submenu: false,
            link: routes.centralDashboard,
          },
        ],
      },
      {
        label: "Mobile App",
        icon: "ti ti-device-mobile",
        submenu: true,
        submenuItems: [
          {
            label: "App Settings",
            submenu: false,
            link: routes.appSettings,
          },
          {
            label: "API Keys",
            submenu: false,
            link: routes.apiKeys,
          },
          {
            label: "Push Configurations",
            submenu: false,
            link: routes.pushConfigurations,
          },
        ],
      },
    ],
  },
  {
    label: "Settings",
    submenuHdr: "Settings",
    submenuItems: [
      {
        label: "General",
        icon: "ti ti-settings",
        submenu: true,
        submenuItems: [
          {
            label: "School Profile",
            submenu: false,
            link: routes.schoolProfile,
          },
          {
            label: "Academic Year",
            submenu: false,
            link: routes.academicYear,
          },
          {
            label: "Preferences",
            submenu: false,
            link: routes.preference,
          },
        ],
      },
      {
        label: "Account & Security",
        icon: "ti ti-shield-lock",
        submenu: true,
        submenuItems: [
          {
            label: "Profile",
            submenu: false,
            link: routes.profilesettings,
          },
          {
            label: "Security",
            submenu: false,
            link: routes.securitysettings,
          },
          {
            label: "OTP",
            submenu: false,
            link: routes.optSettings,
          },
          {
            label: "Social Authentication",
            submenu: false,
            link: routes.socialAuthentication,
          },
          {
            label: "Session Management",
            submenu: false,
            link: routes.sessionManagement,
          },
          {
            label: "Login Activity",
            submenu: false,
            link: routes.loginActivity,
          },
          {
            label: "Activity Logs",
            submenu: false,
            link: routes.activityLogs,
          },
        ],
      },
      {
        label: "Academic",
        icon: "ti ti-school",
        submenu: true,
        submenuItems: [
          {
            label: "School Settings",
            submenu: false,
            link: routes.schoolSettings,
          },
          {
            label: "Class Settings",
            submenu: false,
            link: routes.classSettings,
          },
          {
            label: "Subject Settings",
            submenu: false,
            link: routes.subjectSettings,
          },
          {
            label: "Grading Rules",
            submenu: false,
            link: routes.gradingRules,
          },
          {
            label: "Academic Settings",
            submenu: false,
            link: routes.academicSettings,
          },
          {
            label: "Religion",
            submenu: false,
            link: routes.religion,
          },
          {
            label: "Section Settings",
            submenu: false,
            link: routes.sectionSettings,
          },
          {
            label: "Timetable Settings",
            submenu: false,
            link: routes.timetableSettings,
          },
          {
            label: "Exam Settings",
            submenu: false,
            link: routes.examSettings,
          },
        ],
      },
      {
        label: "Financial Settings",
        icon: "ti ti-zoom-money",
        submenu: true,
        submenuItems: [
          {
            label: "Payment Settings",
            submenu: false,
            link: routes.paymentSettings,
          },
          {
            label: "Payment Gateways",
            submenu: false,
            link: routes.paymentGateways,
          },
          {
            label: "Tax Rates",
            submenu: false,
            link: routes.taxRates,
          },
          {
            label: "Invoice Settings",
            submenu: false,
            link: routes.invoiceSettings,
          },
          {
            label: "Fee Rules",
            submenu: false,
            link: routes.feeRules,
          },
          {
            label: "Discount Rules",
            submenu: false,
            link: routes.discountRules,
          },
        ],
      },
      {
        label: "Communication",
        icon: "ti ti-file-symlink",
        submenu: true,
        submenuItems: [
          {
            label: "Email Settings",
            submenu: false,
            link: routes.emailSettings,
          },
          {
            label: "Email Templates",
            submenu: false,
            link: routes.emailTemplates,
          },
          {
            label: "SMS Settings",
            submenu: false,
            link: routes.smsSettings,
          },
          {
            label: "OTP",
            submenu: false,
            link: routes.optSettings,
          },
          {
            label: "GDPR Cookies",
            submenu: false,
            link: routes.gdprCookies,
          },
        ],
      },
      {
        label: "Localization",
        icon: "ti ti-world",
        submenu: true,
        submenuItems: [
          {
            label: "Language",
            submenu: false,
            link: routes.language,
          },
          {
            label: "Localization",
            submenu: false,
            link: routes.localization,
          },
          {
            label: "Prefixes",
            submenu: false,
            link: routes.prefixes,
          },
        ],
      },
      {
        label: "Integrations",
        icon: "ti ti-plug-connected",
        submenu: true,
        submenuItems: [
          {
            label: "Connected Apps",
            submenu: false,
            link: routes.connectedApps,
          },
          {
            label: "API Keys",
            submenu: false,
            link: routes.apiKeys,
          },
          {
            label: "Webhooks",
            submenu: false,
            link: routes.webhooks,
          },
        ],
      },
      {
        label: "Appearance",
        icon: "ti ti-palette",
        submenu: true,
        submenuItems: [
          {
            label: "Theme Settings",
            submenu: false,
            link: routes.themeSettings,
          },
          {
            label: "Custom Fields",
            submenu: false,
            link: routes.customFields,
          },
        ],
      },
      {
        label: "System",
        icon: "ti ti-server-cog",
        submenu: true,
        submenuItems: [
          {
            label: "Backup & Restore",
            submenu: false,
            link: routes.backupRestore,
          },
          {
            label: "Storage",
            submenu: false,
            link: routes.storage,
          },
          {
            label: "Ban IP",
            submenu: false,
            link: routes.banIpAddress,
          },
          {
            label: "GDPR",
            submenu: false,
            link: routes.gdpr,
          },
          {
            label: "Logs",
            submenu: false,
            link: routes.systemLogs,
          },
          {
            label: "Cache",
            submenu: false,
            link: routes.cache,
          },
          {
            label: "Maintenance Mode",
            submenu: false,
            link: routes.maintenanceMode,
          },
        ],
      },
    ],
  },
  {
    label: "CMS & Pages",
    submenuHdr: "CMS & Pages",
    submenuItems: [
      {
        label: "Pages",
        icon: "ti ti-page-break",
        submenu: false,
        link: routes.pages,
      },
      {
        label: "Blog",
        icon: "ti ti-brand-blogger",
        submenu: true,
        submenuItems: [
          {
            label: "All Blogs",
            submenu: false,
            link: routes.allBlogs,
          },
          {
            label: "Categories",
            submenu: false,
            link: routes.blogCategories,
          },
          {
            label: "Comments",
            submenu: false,
            link: routes.blogComments,
          },
          {
            label: "Tags",
            submenu: false,
            link: routes.blogTags,
          },
        ],
      },
      {
        label: "Location",
        icon: "ti ti-map-pin-search",
        submenu: true,
        submenuItems: [
          {
            label: "Countries",
            submenu: false,
            link: routes.countries,
          },
          {
            label: "States",
            submenu: false,
            link: routes.states,
          },
          {
            label: "Cities",
            submenu: false,
            link: routes.cities,
          },
        ],
      },
      {
        label: "Testimonials",
        icon: "ti ti-quote",
        submenu: false,
        link: routes.testimonials,
      },
      {
        label: "FAQ",
        icon: "ti ti-help-circle",
        submenu: false,
        link: routes.faq,
      },
      {
        label: "Support",
        icon: "ti ti-lifebuoy",
        submenu: true,
        submenuItems: [
          {
            label: "Contact Messages",
            icon: "ti ti-message",
            submenu: false,
            link: routes.contactMessages,
          },
          {
            label: "Tickets",
            icon: "ti ti-ticket",
            submenu: false,
            link: routes.tickets,
          },
        ],
      },
      {
        label: "Profile",
        icon: "ti ti-user",
        submenu: true,
        submenuItems: [
          {
            label: "User Profile",
            submenu: false,
            link: routes.profile,
          },
          {
            label: "Blank Page",
            submenu: false,
            link: routes.blankPage,
          },
        ],
      },
      {
        label: "Authentication",
        icon: "ti ti-lock-open",
        submenu: true,
        submenuItems: [
          {
            label: "Login",
            submenu: true,
            submenuItems: [
              {
                label: "Cover",
                submenu: false,
                link: routes.login,
              },
              {
                label: "Illustration",
                submenu: false,
                link: routes.login2,
              },
              {
                label: "Basic",
                submenu: false,
                link: routes.login3,
              },
            ],
          },
          {
            label: "Register",
            submenu: true,
            submenuItems: [
              {
                label: "Cover",
                submenu: false,
                link: routes.register,
              },
              {
                label: "Illustration",
                submenu: false,
                link: routes.register2,
              },
              {
                label: "Basic",
                submenu: false,
                link: routes.register3,
              },
            ],
          },
          {
            label: "Forgot Password",
            submenu: true,
            submenuItems: [
              {
                label: "Cover",
                submenu: false,
                link: routes.forgotPassword,
              },
              {
                label: "Illustration",
                submenu: false,
                link: routes.forgotPassword2,
              },
              {
                label: "Basic",
                submenu: false,
                link: routes.forgotPassword3,
              },
            ],
          },
          {
            label: "Reset Password",
            submenu: true,
            submenuItems: [
              {
                label: "Cover",
                submenu: false,
                link: routes.resetPassword,
              },
              {
                label: "Illustration",
                submenu: false,
                link: routes.resetPassword2,
              },
              {
                label: "Basic",
                submenu: false,
                link: routes.resetPassword3,
              },
            ],
          },
          {
            label: "Email Verification",
            submenu: true,
            submenuItems: [
              {
                label: "Cover",
                submenu: false,
                link: routes.emailVerification,
              },
              {
                label: "Illustration",
                submenu: false,
                link: routes.emailVerification2,
              },
              {
                label: "Basic",
                submenu: false,
                link: routes.emailVerification3,
              },
            ],
          },
          {
            label: "2 Step Verification",
            submenu: true,
            submenuItems: [
              {
                label: "Cover",
                submenu: false,
                link: routes.twoStepVerification,
              },
              {
                label: "Illustration",
                submenu: false,
                link: routes.twoStepVerification2,
              },
              {
                label: "Basic",
                submenu: false,
                link: routes.twoStepVerification3,
              },
            ],
          },
          {
            label: "Lock Screen",
            submenu: false,
            link: routes.lockScreen,
          },
        ],
      },
      {
        label: "Error Pages",
        icon: "ti ti-error-404",
        submenu: true,
        submenuItems: [
          {
            label: "404 Error",
            submenu: false,
            link: routes.error404,
          },
          {
            label: "500 Error",
            submenu: false,
            link: routes.error500,
          },
          {
            label: "Coming Soon",
            submenu: false,
            link: routes.comingSoon,
          },
          {
            label: "Under Maintenance",
            submenu: false,
            link: routes.underMaintenance,
          },
        ],
      },
    ],
  },
  {
    label: "UI Interface",
    submenuHdr: "UI Interface",
    submenuItems: [
      {
        label: "Base UI",
        icon: "ti ti-hierarchy-2",
        submenu: true,
        submenuItems: [
          {
            label: "Alerts",
            submenu: false,
            link: routes.alert,
          },
          {
            label: "Accordion",
            submenu: false,
            link: routes.accordion,
          },
          {
            label: "Avatar",
            submenu: false,
            link: routes.avatar,
          },
          {
            label: "Badges",
            submenu: false,
            link: routes.badges,
          },
          {
            label: "Buttons",
            submenu: false,
            link: routes.button,
          },
          {
            label: "Button Group",
            submenu: false,
            link: routes.buttonGroup,
          },
          {
            label: "Breadcrumb",
            submenu: false,
            link: routes.breadcrums,
          },
          {
            label: "Card",
            submenu: false,
            link: routes.cards,
          },
          {
            label: "Carousel",
            submenu: false,
            link: routes.carousel,
          },
          {
            label: "Collapse",
            submenu: false,
            link: routes.uiCollapse,
          },
          {
            label: "Dropdowns",
            submenu: false,
            link: routes.dropdowns,
          },
          {
            label: "Grid",
            submenu: false,
            link: routes.grid,
          },
          {
            label: "Images",
            submenu: false,
            link: routes.images,
          },
          {
            label: "Links",
            submenu: false,
            link: routes.uiLinks,
          },
          {
            label: "List Group",
            submenu: false,
            link: routes.uiListGroup,
          },
          {
            label: "Modals",
            submenu: false,
            link: routes.modals,
          },
          {
            label: "Offcanvas",
            submenu: false,
            link: routes.offcanvas,
          },
          {
            label: "Pagination",
            submenu: false,
            link: routes.pagination,
          },
          {
            label: "Popovers",
            submenu: false,
            link: routes.popover,
          },
          {
            label: "Progress",
            submenu: false,
            link: routes.progress,
          },
          {
            label: "Placeholders",
            submenu: false,
            link: routes.placeholder,
          },
          {
            label: "Workspace",
            submenu: false,
            link: routes.uiWorkspace,
          },
          {
            label: "Attendance",
            submenu: false,
            link: routes.uiAttendance,
          },
          {
            label: "Spinner",
            submenu: false,
            link: routes.spinner,
          },
          {
            label: "Tabs",
            submenu: false,
            link: routes.navTabs,
          },
          {
            label: "Tooltips",
            submenu: false,
            link: routes.tooltip,
          },
          {
            label: "Typography",
            submenu: false,
            link: routes.typography,
          },
        ],
      },
      {
        label: "Dashboard UI",
        icon: "ti ti-layout-dashboard",
        submenu: true,
        submenuItems: [
          {
            label: "Statistics",
            submenu: false,
            link: routes.uiStatistics,
          },
          {
            label: "Widgets",
            submenu: false,
            link: routes.uiWidgets,
          },
          {
            label: "Lists",
            submenu: false,
            link: routes.uiLists,
          },
          {
            label: "Activity",
            submenu: false,
            link: routes.uiActivity,
          },
          {
            label: "Analytics",
            submenu: false,
            link: routes.uiAnalytics,
          },
          {
            label: "Insights",
            submenu: false,
            link: routes.uiInsights,
          },
          {
            label: "Actions",
            submenu: false,
            link: routes.uiActions,
          },
          {
            label: "Dashboard Cards",
            submenu: false,
            link: routes.uiDashboardCards,
          },
        ],
      },
      {
        label: "Advanced UI",
        icon: "ti ti-hierarchy-3",
        submenu: true,
        submenuItems: [
          {
            label: "Clipboard",
            submenu: false,
            link: routes.clipboard,
          },
          {
            label: "Drag & Drop",
            submenu: false,
            link: routes.dragandDrop,
          },
          {
            label: "Scrollbar",
            submenu: false,
            link: routes.scrollBar,
          },
          {
            label: "Sweet Alerts",
            submenu: false,
            link: routes.sweetalert,
          },
          {
            label: "Lightbox",
            submenu: false,
            link: routes.lightbox,
          },
        ],
      },
      {
        label: "Charts",
        icon: "ti ti-chart-line",
        submenu: true,
        submenuItems: [
          {
            label: "Apex Charts",
            submenu: false,
            link: routes.apexChat,
          },
        ],
      },
      {
        label: "Icons",
        icon: "ti ti-icons",
        submenu: true,
        submenuItems: [
          {
            label: "Fontawesome Icons",
            submenu: false,
            link: routes.fantawesome,
          },
          {
            label: "Feather Icons",
            submenu: false,
            link: routes.featherIcons,
          },
          {
            label: "Ionic Icons",
            submenu: false,
            link: routes.iconicIcon,
          },
          {
            label: "Material Icons",
            submenu: false,
            link: routes.materialIcon,
          },
          {
            label: "Pe7 Icons",
            submenu: false,
            link: routes.pe7icon,
          },
          {
            label: "Simpleline Icons",
            submenu: false,
            link: routes.simpleLineIcon,
          },
          {
            label: "Themify Icons",
            submenu: false,
            link: routes.themifyIcon,
          },
          {
            label: "Weather Icons",
            submenu: false,
            link: routes.weatherIcon,
          },
          {
            label: "Typicon Icons",
            submenu: false,
            link: routes.typicon,
          },
          {
            label: "Flag Icons",
            submenu: false,
            link: routes.falgIcons,
          },
        ],
      },
      {
        label: "Forms",
        icon: "ti ti-input-search",
        submenu: true,
        submenuItems: [
          {
            label: "Form Elements",
            submenu: true,
            submenuItems: [
              {
                label: "Basic Inputs",
                submenu: false,
                link: routes.basicInput,
              },
              {
                label: "Checkbox & Radios",
                submenu: false,
                link: routes.checkboxandRadion,
              },
              {
                label: "Input Groups",
                submenu: false,
                link: routes.inputGroup,
              },
              {
                label: "Grid & Gutters",
                submenu: false,
                link: routes.gridandGutters,
              },
              {
                label: "Form Select",
                submenu: false,
                link: routes.formSelect,
              },
              {
                label: "Input Masks",
                submenu: false,
                link: routes.formMask,
              },
              {
                label: "File Uploads",
                submenu: false,
                link: routes.fileUpload,
              },
            ],
          },
          {
            label: "Layouts",
            submenu: true,
            submenuItems: [
              {
                label: "Horizontal Form",
                submenu: false,
                link: routes.horizontalForm,
              },
              {
                label: "Vertical Form",
                submenu: false,
                link: routes.verticalForm,
              },
              {
                label: "Floating Labels",
                submenu: false,
                link: routes.floatingLable,
              },
            ],
          },
          {
            label: "Form Validation",
            submenu: false,
            link: routes.formValidation,
          },
          {
            label: "Select2",
            submenu: false,
            link: routes.reactSelect,
          },
          {
            label: "Form Wizard",
            submenu: false,
            link: routes.formWizard,
          },
        ],
      },
      {
        label: "Tables",
        icon: "ti ti-table-plus",
        submenu: true,
        submenuItems: [
          {
            label: "Basic Tables",
            submenu: false,
            link: routes.tablesBasic,
          },
          {
            label: "Data Table",
            submenu: false,
            link: routes.dataTables,
          },
        ],
      },
    ],
  },
  {
    label: "Help",
    submenuHdr: "Help",
    submenuItems: [
      {
        label: "Documentation",
        icon: "ti ti-file-text",
        submenu: false,
        external: true,
        link: "https://preschool.dreamstechnologies.com/documentation/index.html",
      },
      {
        label: "Changelog",
        icon: "ti ti-exchange",
        badge: "v2.0",
        submenu: false,
        external: true,
        link: "https://preschool.dreamstechnologies.com/documentation/changelog.html",
      },
      {
        label: "Multi Level",
        icon: "ti ti-menu-2",
        submenu: true,
        submenuItems: [
          {
            label: "Multilevel 1",
            submenu: false,
            link: "#",
          },
          {
            label: "Multilevel 2",
            submenu: true,
            submenuItems: [
              {
                label: "Multilevel 2.1",
                submenu: false,
                link: "#",
              },
              {
                label: "Multilevel 2.2",
                submenu: true,
                submenuItems: [
                  {
                    label: "Multilevel 2.2.1",
                    submenu: false,
                    link: "#",
                  },
                  {
                    label: "Multilevel 2.2.2",
                    submenu: false,
                    link: "#",
                  },
                ],
              },
            ],
          },
          {
            label: "Multilevel 3",
            submenu: false,
            link: "#",
          },
        ],
      },
    ],
  },
];
