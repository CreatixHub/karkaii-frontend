import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import React from "react";

// Lazily loaded page components.
const Accordion = React.lazy(() => import("../views/uiInterface/base-ui/accordion"));
const AccountsIncome = React.lazy(() => import("../views/finance-accounts/accounts/accounts-income"));
const AccountsInvoices = React.lazy(() => import("../views/finance-accounts/billings/invoices"));
const AccountsTransactions = React.lazy(() => import("../views/accounts/accounts-transactions"));
const AddAdmission = React.lazy(() => import("../views/peoples/admissions/add-admission"));
const AddAlumni = React.lazy(() => import("../views/peoples/alumni/add-alumni"));
const AddInvoice = React.lazy(() => import("../views/accounts/add-invoice"));
const AddStaff = React.lazy(() => import("../views/hrm/staff-list/add-staff"));
const AddStudent = React.lazy(() => import("../views/peoples/students/add-student"));
const AdminDashboard = React.lazy(() => import("../views/dashboard/admin/AdminDashboard"));
const AdmissionDetails = React.lazy(() => import("../views/peoples/admissions/admission-details"));
const AdmissionGrid = React.lazy(() => import("../views/peoples/admissions/admission-grid"));
const AdmitCard = React.lazy(() => import("../views/academic/admit-card"));
const AlertUi = React.lazy(() => import("../views/uiInterface/base-ui/alert-ui"));
const AllBlogs = React.lazy(() => import("../views/content/blog/all-blogs"));
const AlumniGrid = React.lazy(() => import("../views/peoples/alumni/alumni-grid"));
const AlumniProfile = React.lazy(() => import("../views/peoples/alumni/alumni-profile"));
const Apexchart = React.lazy(() => import("../views/uiInterface/charts/apexcharts"));
const DragDrop = React.lazy(() => import("../views/uiInterface/advanced-ui/drag-drop"));
const FlagIcons = React.lazy(() => import("../views/uiInterface/icons/flagicons"));
const FeatherIcons = React.lazy(() => import("../views/uiInterface/icons/feathericon"));
const FormFloatingLabels = React.lazy(() => import("../views/uiInterface/forms/formelements/layouts/form-floating-labels"));
const UiGrid = React.lazy(() => import("../views/uiInterface/base-ui/grid"));
const SimpleLineIcon = React.lazy(() => import("../views/uiInterface/icons/simpleline"));
const SweetAlert = React.lazy(() => import("../views/uiInterface/base-ui/sweetalert"));
const UiAttendance = React.lazy(() => import("../views/uiInterface/showcase/uiAttendance"));
const UiWorkspace = React.lazy(() => import("../views/uiInterface/showcase/uiWorkspace"));
const AcademicReports = React.lazy(() => import("../views/report/reports-analytics/academic-reports"));
const ClassAnalytics = React.lazy(() => import("../views/report/reports-analytics/class-analytics"));
const FeeCollectionReport = React.lazy(() => import("../views/report/reports-analytics/fee-collection"));
const TeacherPerformancePage = React.lazy(() => import("../views/report/reports-analytics/teacher-performance"));
const CustomReports = React.lazy(() => import("../views/report/reports-analytics/custom-reports"));
const Competitions = React.lazy(() => import("../views/report/achievements/competitions"));
const CertificateRecords = React.lazy(() => import("../views/report/achievements/certificate-records"));
const BonafideCertificate = React.lazy(() => import("../views/report/certificates/bonafide-certificate"));
const GenerateCertificates = React.lazy(() => import("../views/report/certificates/generate-certificates"));
const TransferCertificate = React.lazy(() => import("../views/report/certificates/transfer-certificate"));
const IdCardTemplates = React.lazy(() => import("../views/report/certificates/id-card-templates"));
const TenantSettings = React.lazy(() => import("../views/administration/multischool/tenant-settings"));
const UsageLimits = React.lazy(() => import("../views/administration/multischool/usage-limits"));
const SubscriptionPlans = React.lazy(() => import("../views/administration/multischool/subscription-plans"));
const PlanFeatures = React.lazy(() => import("../views/administration/multischool/plan-features"));
const BranchManagement = React.lazy(() => import("../views/administration/multischool/branch-management"));
const FranchiseSetup = React.lazy(() => import("../views/administration/multischool/franchise-setup"));
const AppSettings = React.lazy(() => import("../views/administration/mobile-app/app-settings"));
const PushConfigurations = React.lazy(() => import("../views/administration/mobile-app/push-configurations"));
const ApiKeys = React.lazy(() => import("../views/administration/mobile-app/api-keys"));
const ClassSettings = React.lazy(() => import("../views/settings/academicSettings/class-settings"));
const ExamSettings = React.lazy(() => import("../views/settings/academicSettings/exam-settings"));
const GradingRules = React.lazy(() => import("../views/settings/academicSettings/grading-rules"));
const SectionSettings = React.lazy(() => import("../views/settings/academicSettings/section-settings"));
const SubjectSettings = React.lazy(() => import("../views/settings/academicSettings/subject-settings"));
const TimetableSettings = React.lazy(() => import("../views/settings/academicSettings/timetable-settings"));
const AcademicYear = React.lazy(() => import("../views/settings/generalSettings/academic-year"));
const FeeRules = React.lazy(() => import("../views/settings/financialSettings/fee-rules"));
const DiscountRules = React.lazy(() => import("../views/settings/financialSettings/discount-rules"));
const ThemeSettings = React.lazy(() => import("../views/settings/apperance/theme-settings"));
const SessionManagement = React.lazy(() => import("../views/settings/account-security/session-management"));
const BackupRestore = React.lazy(() => import("../views/settings/systemSettings/backup-restore"));
const Cache = React.lazy(() => import("../views/settings/systemSettings/cache"));
const Gdpr = React.lazy(() => import("../views/settings/systemSettings/gdpr"));
const MaintenanceMode = React.lazy(() => import("../views/settings/systemSettings/maintenance-mode"));
const ActivityLogs = React.lazy(() => import("../views/settings/account-security/activity-logs"));
const LoginActivity = React.lazy(() => import("../views/settings/account-security/login-activity"));
const SystemLogs = React.lazy(() => import("../views/settings/systemSettings/system-logs"));
const PaymentSettings = React.lazy(() => import("../views/settings/financialSettings/payment-settings"));
const SchoolProfile = React.lazy(() => import("../views/settings/generalSettings/school-profile"));
const AcademicSettings = React.lazy(() => import("../views/settings/academicSettings/academic-settings"));
const UiActions = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiActions"));
const UiActivity = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiActivity"));
const UiAnalytics = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiAnalytics"));
const UiDashboardCards = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiDashboardCards"));
const UiInsights = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiInsights"));
const UiLists = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiLists"));
const UiStatistics = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiStatistics"));
const UiWidgets = React.lazy(() => import("../views/uiInterface/dashboard-ui/uiWidgets"));
const UiBorders = React.lazy(() => import("../views/uiInterface/showcase/uiBorders"));
const UiCounter = React.lazy(() => import("../views/uiInterface/showcase/uiCounter"));
const UiMedia = React.lazy(() => import("../views/uiInterface/showcase/uiMedia"));
const UiRangeslider = React.lazy(() => import("../views/uiInterface/showcase/uiRangeslider"));
const UiRating = React.lazy(() => import("../views/uiInterface/showcase/uiRating"));
const UiRibbon = React.lazy(() => import("../views/uiInterface/showcase/uiRibbon"));
const UiTextEditor = React.lazy(() => import("../views/uiInterface/showcase/uiTextEditor"));
const UiTimeline = React.lazy(() => import("../views/uiInterface/showcase/uiTimeline"));
const UiToasts = React.lazy(() => import("../views/uiInterface/showcase/uiToasts"));
const UiVideo = React.lazy(() => import("../views/uiInterface/showcase/uiVideo"));
const StatusCardsShowcase = React.lazy(() => import("../views/uiInterface/showcase/statusCardsShowcase"));
const Plugins = React.lazy(() => import("../views/uiInterface/showcase/plugins"));
const FormElements = React.lazy(() => import("../views/uiInterface/showcase/formElements"));
const BehaviorDiscipline = React.lazy(() => import("../views/pages/behavior-discipline"));
const AuditLog = React.lazy(() => import("../views/pages/audit-log"));
const FeeInstallments = React.lazy(() => import("../views/pages/fee-installments"));
const OnlinePaymentReceipts = React.lazy(() => import("../views/pages/online-payment-receipts"));
const OnlineExamination = React.lazy(() => import("../views/pages/online-examination"));
const QuestionBank = React.lazy(() => import("../views/pages/question-bank"));
const SystemSettingsPage = React.lazy(() => import("../views/settings/systemSettings/system-settings"));
const AiSettings = React.lazy(() => import("../views/settings/aiSettings/ai-settings"));
const DocumentViewer = React.lazy(() => import("../views/pages/document-viewer"));
const DigitalIdCard = React.lazy(() => import("../views/pages/digital-id-card"));
const RewardsGamification = React.lazy(() => import("../views/pages/rewards-gamification"));
const ScholarshipManagement = React.lazy(() => import("../views/pages/scholarship-management"));
const AttendanceReport = React.lazy(() => import("../views/report/reports-analytics/attendance-reports"));
const Avatar = React.lazy(() => import("../views/uiInterface/base-ui/avatar"));
const Badges = React.lazy(() => import("../views/uiInterface/base-ui/badges"));
const BanIpAddress = React.lazy(() => import("../views/settings/otherSettings/banIpaddress"));
const BasicInputs = React.lazy(() => import("../views/uiInterface/forms/formelements/basic-inputs"));
const BlankPage = React.lazy(() => import("../views/pages/blankPage"));
const BlogCategories = React.lazy(() => import("../views/content/blog/blog-categories"));
const BlogComments = React.lazy(() => import("../views/content/blog/blog-comments"));
const BlogTags = React.lazy(() => import("../views/content/blog/blog-tags"));
const LibraryBooks = React.lazy(() => import("../views/campus-operations/library/books"));
const LibraryCategories = React.lazy(() => import("../views/campus-operations/library/categories"));
const LibraryReports = React.lazy(() => import("../views/campus-operations/library/reports"));
const LibraryReservations = React.lazy(() => import("../views/campus-operations/library/reservations"));
const TransportGpsTracking = React.lazy(() => import("../views/campus-operations/transport/gps-tracking"));
const TransportAssignStudents = React.lazy(() => import("../views/campus-operations/transport/assign-students"));
const TransportRouteScheduling = React.lazy(() => import("../views/campus-operations/transport/route-scheduling"));
const Breadcrumb = React.lazy(() => import("../views/uiInterface/base-ui/breadcrumb"));
const Buttons = React.lazy(() => import("../views/uiInterface/base-ui/buttons"));
const ButtonsGroup = React.lazy(() => import("../views/uiInterface/base-ui/buttonsgroup"));
const Calendar = React.lazy(() => import("../views/mainMenu/apps/calendar"));
const Cards = React.lazy(() => import("../views/uiInterface/base-ui/cards"));
const Carousel = React.lazy(() => import("../views/uiInterface/base-ui/carousel"));
const CheckboxRadios = React.lazy(() => import("../views/uiInterface/forms/formelements/checkbox-radios"));
const AcademicCalendar = React.lazy(() => import("../views/academic/academic-calendar"));
const Cities = React.lazy(() => import("../views/content/location/cities"));
const ClassHomeWork = React.lazy(() => import("../views/academic/homework"));
const ClassRoom = React.lazy(() => import("../views/academic/class-room"));
const ClassRoutine = React.lazy(() => import("../views/academic/class-routine"));
const ClassSection = React.lazy(() => import("../views/academic/class-section"));
const ClassSubject = React.lazy(() => import("../views/academic/class-subject"));
const ClassSyllabus = React.lazy(() => import("../views/academic/class-syllabus"));
const ClassTimetable = React.lazy(() => import("../views/academic/class-timetable"));
const Classes = React.lazy(() => import("../views/academic/classes"));
const ClipBoard = React.lazy(() => import("../views/uiInterface/advanced-ui/clipboard"));
const Collapse = React.lazy(() => import("../views/uiInterface/base-ui/collapse.tsx"));
const CollectFees = React.lazy(() => import("../views/finance-accounts/fees/collect-fees"));
const ComingSoon = React.lazy(() => import("../views/pages/comingSoon"));
const CompanySettings = React.lazy(() => import("../views/settings/websiteSettings/companySettings"));
const ContactMessages = React.lazy(() => import("../views/support/contact-messages"));
const Countries = React.lazy(() => import("../views/content/location/countries"));
const Curriculum = React.lazy(() => import("../views/academic/curriculum"));
const CustomFields = React.lazy(() => import("../views/settings/appSettings/customFields"));
const DailyAttendance = React.lazy(() => import("../views/report/attendance-report/dailyAttendance"));
const DataTables = React.lazy(() => import("../views/uiInterface/table/data-tables"));
const DeleteRequest = React.lazy(() => import("../views/userManagement/deleteRequest"));
const Departments = React.lazy(() => import("../views/hrm/departments"));
const Designation = React.lazy(() => import("../views/hrm/designation"));
const Dropdowns = React.lazy(() => import("../views/uiInterface/base-ui/dropdowns"));
const EditInvoice = React.lazy(() => import("../views/accounts/edit-invoice"));
const EditStaff = React.lazy(() => import("../views/hrm/staff-list/edit-staff"));
const Email = React.lazy(() => import("../views/application/email"));
const EmailSettings = React.lazy(() => import("../views/settings/systemSettings/emailSettings"));
const EmailVerification = React.lazy(() => import("../views/auth/emailVerification/emailVerification"));
const EmailVerification2 = React.lazy(() => import("../views/auth/emailVerification/emailVerification-2"));
const EmailVerification3 = React.lazy(() => import("../views/auth/emailVerification/emailVerification-3"));
const Emailtemplates = React.lazy(() => import("../views/settings/systemSettings/email-templates"));
const Error404 = React.lazy(() => import("../views/pages/error/error-404"));
const Error500 = React.lazy(() => import("../views/pages/error/error-500"));
const Events = React.lazy(() => import("../views/administration/events"));
const Exam = React.lazy(() => import("../views/academic/exams"));
const ExamAttendance = React.lazy(() => import("../views/academic/exam-attendance"));
const ExamResult = React.lazy(() => import("../views/academic/exam-results"));
const ExamSchedule = React.lazy(() => import("../views/academic/schedule-exam"));
const ExamTypes = React.lazy(() => import("../views/academic/exam-types"));
const Expense = React.lazy(() => import("../views/finance-accounts/accounts/expenses"));
const ExpensesCategory = React.lazy(() => import("../views/finance-accounts/accounts/expenses-category"));
const Faq = React.lazy(() => import("../views/content/faq"));
const FeesAssign = React.lazy(() => import("../views/finance-accounts/fees/fees-assign"));
const FeesGroup = React.lazy(() => import("../views/finance-accounts/fees/fees-group"));
const FeesMaster = React.lazy(() => import("../views/finance-accounts/fees/fees-master"));
const FeesTypes = React.lazy(() => import("../views/finance-accounts/fees/fees-type"));
const FileManager = React.lazy(() => import("../views/application/fileManager"));
const FileUpload = React.lazy(() => import("../views/uiInterface/forms/formelements/fileupload"));
const FontawesomeIcons = React.lazy(() => import("../views/uiInterface/icons/fontawesome"));
const ForgotPassword = React.lazy(() => import("../views/auth/forgotPassword/forgotPassword"));
const ForgotPassword2 = React.lazy(() => import("../views/auth/forgotPassword/forgotPassword-2"));
const ForgotPassword3 = React.lazy(() => import("../views/auth/forgotPassword/forgotPassword-3"));
const FormHorizontal = React.lazy(() => import("../views/uiInterface/forms/formelements/layouts/form-horizontal"));
const FormMask = React.lazy(() => import("../views/uiInterface/forms/formelements/form-mask"));
const FormSelect = React.lazy(() => import("../views/uiInterface/forms/formelements/form-select"));
const FormSelect2 = React.lazy(() => import("../views/uiInterface/forms/formelements/layouts/form-select2"));
const FormValidation = React.lazy(() => import("../views/uiInterface/forms/formelements/layouts/form-validation"));
const FormVertical = React.lazy(() => import("../views/uiInterface/forms/formelements/layouts/form-vertical"));
const FormWizard = React.lazy(() => import("../views/uiInterface/forms/formelements/form-wizard"));
const GdprCookies = React.lazy(() => import("../views/settings/systemSettings/gdprCookies"));
const Grade = React.lazy(() => import("../views/academic/grade-setup"));
const GradeReport = React.lazy(() => import("../views/report/reports-analytics/grade-reports"));
const GridGutters = React.lazy(() => import("../views/uiInterface/forms/formelements/grid-gutters"));
const GuardianGrid = React.lazy(() => import("../views/peoples/guardian/guardian-grid"));
const GuardianList = React.lazy(() => import("../views/peoples/guardian/guardian-list"));
const Holiday = React.lazy(() => import("../views/hrm/holidays"));
const HostelList = React.lazy(() => import("../views/campus-operations/hostel/list"));
const HostelRooms = React.lazy(() => import("../views/campus-operations/hostel/rooms"));
const RoomAllocation = React.lazy(() => import("../views/campus-operations/hostel/allocation"));
const HostelFees = React.lazy(() => import("../views/campus-operations/hostel/fees"));
const HostelWardens = React.lazy(() => import("../views/campus-operations/hostel/wardens"));
const HostelVisitorLog = React.lazy(() => import("../views/campus-operations/hostel/visitor-log"));
const GateEntryPage = React.lazy(() => import("../views/campus-operations/security/gate-entry"));
const ExitPassPage = React.lazy(() => import("../views/campus-operations/security/exit-pass"));
const StaffEntryPage = React.lazy(() => import("../views/campus-operations/security/staff-entry"));
const VisitorVerificationPage = React.lazy(() => import("../views/campus-operations/security/visitor-verification"));
const VisitorLogPage = React.lazy(() => import("../views/campus-operations/security/visitor-log"));
const GatePassPage = React.lazy(() => import("../views/campus-operations/security/gate-pass"));
const AppointmentRequestsPage = React.lazy(() => import("../views/campus-operations/security/appointments"));
const AnnouncementsPage = React.lazy(() => import("../views/communication/broadcast/announcements"));
const BroadcastSchedulerPage = React.lazy(() => import("../views/communication/broadcast/scheduler"));
const SendSmsPage = React.lazy(() => import("../views/communication/sms/send"));
const BulkSmsPage = React.lazy(() => import("../views/communication/sms/bulk"));
const ChatInboxPage = React.lazy(() => import("../views/communication/whatsapp/inbox"));
const NotificationCenterPage = React.lazy(() => import("../views/communication/notification/center"));
const BulkWhatsappPage = React.lazy(() => import("../views/communication/whatsapp/bulk"));
const ParentCommunicationPage = React.lazy(() => import("../views/communication/notification/parent"));
const PushNotificationsPage = React.lazy(() => import("../views/communication/notification/push"));
const SendWhatsappPage = React.lazy(() => import("../views/communication/whatsapp/send"));
// const SmsLogsPage = React.lazy(() => import("../views/communication/sms/logs"));
const WhatsappTemplatesPage = React.lazy(() => import("../views/communication/whatsapp/templates"));
const ScheduledTasksPage = React.lazy(() => import("../views/communication/automation/scheduled-tasks"));
const TriggerActionsPage = React.lazy(() => import("../views/communication/automation/trigger-actions"));
const WorkflowRulesPage = React.lazy(() => import("../views/communication/automation/workflow-rules"));
const SmsTemplatesPage = React.lazy(() => import("../views/communication/sms/templates"));
const HealthAlertsPage = React.lazy(() => import("../views/campus-operations/medical/health-alerts"));
const MedicalVisitsPage = React.lazy(() => import("../views/campus-operations/medical/visits"));
const SickRoomLogPage = React.lazy(() => import("../views/campus-operations/medical/sick-room"));
const AssetAllocation = React.lazy(() => import("../views/campus-operations/assets/allocation"));
const AssetMaintenance = React.lazy(() => import("../views/campus-operations/assets/maintenance"));
const StockManagement = React.lazy(() => import("../views/campus-operations/assets/stock"));
const AssetRegister = React.lazy(() => import("../views/campus-operations/assets/register"));
const CafeteriaBilling = React.lazy(() => import("../views/campus-operations/cafeteria/billing"));
const CafeteriaMenu = React.lazy(() => import("../views/campus-operations/cafeteria/menu"));
const MealPlans = React.lazy(() => import("../views/campus-operations/cafeteria/meal-plans"));
const CafeteriaOrders = React.lazy(() => import("../views/campus-operations/cafeteria/orders"));
const HostelType = React.lazy(() => import("../views/campus-operations/hostel/room-types"));
const Images = React.lazy(() => import("../views/uiInterface/base-ui/images"));
const InputGroup = React.lazy(() => import("../views/uiInterface/forms/formelements/input-group"));
const Invoice = React.lazy(() => import("../views/finance-accounts/billings/invoice-details"));
const InvoiceSettings = React.lazy(() => import("../views/settings/appSettings/invoiceSettings"));
const IonicIcons = React.lazy(() => import("../views/uiInterface/icons/ionicicons"));
const LibraryIssueBook = React.lazy(() => import("../views/campus-operations/library/issue-book"));
const Languagesettings = React.lazy(() => import("../views/settings/websiteSettings/language"));
const AttendanceRules = React.lazy(() => import("../views/hrm/hr-payroll/attendance-rules"));
const BiometricRfid = React.lazy(() => import("../views/hrm/attendance/biometric-rfid"));
const BankTransactions = React.lazy(() => import("../views/finance-accounts/billings/bank-transactions"));
const DueReports = React.lazy(() => import("../views/finance-accounts/fees/due-reports"));
const OnlinePayments = React.lazy(() => import("../views/finance-accounts/billings/online-payments"));
const PaymentHistory = React.lazy(() => import("../views/finance-accounts/billings/payment-history"));
const Refunds = React.lazy(() => import("../views/finance-accounts/billings/refunds"));
const Scholarships = React.lazy(() => import("../views/finance-accounts/fees/scholarships"));
const FineManagement = React.lazy(() => import("../views/finance-accounts/fees/fine-management"));
const Receipts = React.lazy(() => import("../views/finance-accounts/fees/receipts"));
const EmployeePayroll = React.lazy(() => import("../views/hrm/hr-payroll/employee-payroll"));
const Payslips = React.lazy(() => import("../views/hrm/hr-payroll/payslips"));
const SalaryStructure = React.lazy(() => import("../views/hrm/hr-payroll/salary-structure"));
const FinancialReports = React.lazy(() => import("../views/finance-accounts/accounts/financial-reports"));
const TaxReports = React.lazy(() => import("../views/finance-accounts/accounts/tax-reports"));
const Ledger = React.lazy(() => import("../views/finance-accounts/accounts/ledger"));
const LeavePolicies = React.lazy(() => import("../views/hrm/hr-payroll/leave-policies"));
const LeaveReport = React.lazy(() => import("../views/report/leave-report/leaveReport"));
const LessonPlanning = React.lazy(() => import("../views/academic/lesson-planning"));
const LibraryMembers = React.lazy(() => import("../views/campus-operations/library/members"));
const Lightboxes = React.lazy(() => import("../views/uiInterface/base-ui/lightbox"));
const Links = React.lazy(() => import("../views/uiInterface/base-ui/links.tsx"));
const ListGroup = React.lazy(() => import("../views/uiInterface/base-ui/listGroup.tsx"));
const ListLeaves = React.lazy(() => import("../views/hrm/leaves/list-leaves"));
const Localization = React.lazy(() => import("../views/settings/websiteSettings/localization"));
const LockScreen = React.lazy(() => import("../views/auth/lockScreen"));
const Login = React.lazy(() => import("../views/auth/login/login"));
const Login2 = React.lazy(() => import("../views/auth/login/login-2"));
const Login3 = React.lazy(() => import("../views/auth/login/login-3"));
const Manageusers = React.lazy(() => import("../views/userManagement/manage-users"));
const MarksEntry = React.lazy(() => import("../views/academic/marks-entry"));
const MaterialIcons = React.lazy(() => import("../views/uiInterface/icons/materialicon"));
const MembershipAddon = React.lazy(() => import("../views/membership/membershipaddon"));
const MembershipTransaction = React.lazy(() => import("../views/membership/membershiptrasaction"));
const Membershipplan = React.lazy(() => import("../views/membership/membershipplan"));
const Modals = React.lazy(() => import("../views/uiInterface/base-ui/modals"));
const NavTabs = React.lazy(() => import("../views/uiInterface/base-ui/navtabs"));
const Notes = React.lazy(() => import("../views/application/notes"));
const NoticeBoard = React.lazy(() => import("../views/communication/broadcast/notice-board"));
const NotificationActivities = React.lazy(() => import("../views/administration/events/activities"));
const Notificationssettings = React.lazy(() => import("../views/settings/generalSettings/notifications"));
const Offcanvas = React.lazy(() => import("../views/uiInterface/base-ui/offcanvas"));
const OtpSettings = React.lazy(() => import("../views/settings/systemSettings/otp-settings"));
const PE7Icons = React.lazy(() => import("../views/uiInterface/icons/pe7icons"));
const Pages = React.lazy(() => import("../views/content/pages"));
const Pagination = React.lazy(() => import("../views/uiInterface/base-ui/pagination"));
const ParentDashboard = React.lazy(() => import("../views/dashboard/parent/ParentDashboard"));
const CentralDashboard = React.lazy(() => import("../views/dashboard/central/CentralDashboard"));
const ParentGrid = React.lazy(() => import("../views/peoples/parent/parent-grid"));
const ParentList = React.lazy(() => import("../views/peoples/parent/parent-list"));
const PaymentGateways = React.lazy(() => import("../views/settings/financialSettings/paymentGateways"));
const Payroll = React.lazy(() => import("../views/hrm/payroll"));
const PerformanceAnalytics = React.lazy(() => import("../views/academic/performance-analytics"));
const Permission = React.lazy(() => import("../views/userManagement/permission"));
const Placeholder = React.lazy(() => import("../views/uiInterface/base-ui/placeholder"));
const PlayersList = React.lazy(() => import("../views/campus-operations/sports/players"));
const Popovers = React.lazy(() => import("../views/uiInterface/base-ui/popover"));
const Preference = React.lazy(() => import("../views/settings/websiteSettings/preference"));
const Prefixes = React.lazy(() => import("../views/settings/websiteSettings/prefixes"));
const Profile = React.lazy(() => import("../views/pages/profile"));
const Profilesettings = React.lazy(() => import("../views/settings/generalSettings/profile"));
const Progress = React.lazy(() => import("../views/uiInterface/base-ui/progress"));
const ProgressReports = React.lazy(() => import("../views/academic/progress-reports"));
const RankingSystem = React.lazy(() => import("../views/academic/ranking-system"));
const Register = React.lazy(() => import("../views/auth/register/register"));
const Register2 = React.lazy(() => import("../views/auth/register/register-2"));
const Register3 = React.lazy(() => import("../views/auth/register/register-3"));
const Religion = React.lazy(() => import("../views/settings/academicSettings/religion"));
const ReportCards = React.lazy(() => import("../views/academic/report-cards"));
const ResetPassword = React.lazy(() => import("../views/auth/resetPassword/resetPassword"));
const ResetPassword2 = React.lazy(() => import("../views/auth/resetPassword/resetPassword-2"));
const ResetPassword3 = React.lazy(() => import("../views/auth/resetPassword/resetPassword-3"));
const ResetPasswordSuccess = React.lazy(() => import("../views/auth/resetPasswordSuccess/resetPasswordSuccess"));
const ResetPasswordSuccess2 = React.lazy(() => import("../views/auth/resetPasswordSuccess/resetPasswordSuccess-2"));
const ResetPasswordSuccess3 = React.lazy(() => import("../views/auth/resetPasswordSuccess/resetPasswordSuccess-3"));
const LibraryReturnBook = React.lazy(() => import("../views/campus-operations/library/return-book"));
const RolesPermissions = React.lazy(() => import("../views/userManagement/roles-permissions"));
const ScheduleClasses = React.lazy(() => import("../views/academic/schedule-classes"));
const SchoolSettings = React.lazy(() => import("../views/settings/academicSettings/schoolSettings"));
const Scrollbar = React.lazy(() => import("../views/uiInterface/advanced-ui/uiscrollbar"));
const Securitysettings = React.lazy(() => import("../views/settings/generalSettings/security"));
const SmsSettings = React.lazy(() => import("../views/settings/systemSettings/smsSettings"));
const Socialauthentication = React.lazy(() => import("../views/settings/websiteSettings/socialAuthentication"));
const Spinner = React.lazy(() => import("../views/uiInterface/base-ui/spinner"));
const SportsList = React.lazy(() => import("../views/campus-operations/sports/sports"));
const Staff = React.lazy(() => import("../views/peoples/staff/staff-list"));
const StaffAttendance = React.lazy(() => import("../views/hrm/attendance/staff-attendance"));
const StaffDayWise = React.lazy(() => import("../views/report/attendance-report/staffDayWise"));
const StaffDetails = React.lazy(() => import("../views/hrm/staff-list/staff-details.tsx"));
const StaffLeave = React.lazy(() => import("../views/hrm/staff-list/staff-leave"));
const StaffPayRoll = React.lazy(() => import("../views/hrm/staff-list/staff-payroll.tsx"));
const StaffReport = React.lazy(() => import("../views/report/attendance-report/staffReport"));
const StaffsAttendance = React.lazy(() => import("../views/hrm/staff-list/staffs-attendance"));
const States = React.lazy(() => import("../views/content/location/states"));
const Storage = React.lazy(() => import("../views/settings/otherSettings/storage.tsx"));
const StudyMaterials = React.lazy(() => import("../views/academic/study-materials"));
const SubjectPerformance = React.lazy(() => import("../views/academic/subject-performance"));
const StudentAttendance = React.lazy(() => import("../views/hrm/attendance/student-attendance"));
const StudentAttendanceType = React.lazy(() => import("../views/report/attendance-report/studentAttendanceType"));
const StudentDasboard = React.lazy(() => import("../views/dashboard/student/StudentDashboard"));
const StudentDayWise = React.lazy(() => import("../views/report/attendance-report/studentDayWise"));
const StudentAttendanceHistory = React.lazy(() => import("../views/peoples/students/student-attendance-history"));
const StudentWallet = React.lazy(() => import("../views/peoples/students/student-wallet"));
const StudentDocumentsPage = React.lazy(() => import("../views/peoples/students/student-documents"));
const StudentDetails = React.lazy(() => import("../views/peoples/students/student-details"));
const StudentFees = React.lazy(() => import("../views/peoples/students/student-details/studentFees"));
const StudentGrid = React.lazy(() => import("../views/peoples/students/student-grid/index.tsx"));
const StudentIdCards = React.lazy(() => import("../views/peoples/students/student-id-cards"));
const StudentAwards = React.lazy(() => import("../views/peoples/students/student-awards"));
const Student360 = React.lazy(() => import("../views/peoples/students/student-360"));
const StudentPerformance = React.lazy(() => import("../views/report/reports-analytics/student-performance"));
const StudentLeaves = React.lazy(() => import("../views/peoples/students/student-details/studentLeaves"));
const StudentLibrary = React.lazy(() => import("../views/peoples/students/student-details/studentLibrary"));
const StudentList = React.lazy(() => import("../views/peoples/students/student-list"));
const StudentPromotion = React.lazy(() => import("../views/peoples/students/student-promotion"));
const StudentResult = React.lazy(() => import("../views/peoples/students/student-details/studentResult"));
const StudentTimeTable = React.lazy(() => import("../views/peoples/students/student-details/studentTimeTable"));
const TablesBasic = React.lazy(() => import("../views/uiInterface/table/tables-basic"));
const TaxRates = React.lazy(() => import("../views/settings/financialSettings/taxRates"));
const TeacherAttendance = React.lazy(() => import("../views/hrm/attendance/teacher-attendance.tsx"));
const TeacherDashboard = React.lazy(() => import("../views/dashboard/teacher/TeacherDashboard"));
const TeacherDayWise = React.lazy(() => import("../views/report/attendance-report/teacherDayWise"));
const TeacherDetails = React.lazy(() => import("../views/peoples/teacher/teacher-details"));
const TeacherForm = React.lazy(() => import("../views/peoples/teacher/teacherForm"));
const TeacherGrid = React.lazy(() => import("../views/peoples/teacher/teacher-grid"));
const TeacherLeave = React.lazy(() => import("../views/peoples/teacher/teacher-details/teacherLeave"));
const TeacherLibrary = React.lazy(() => import("../views/peoples/teacher/teacher-details/teacherLibrary"));
const TeacherList = React.lazy(() => import("../views/peoples/teacher/teacher-list"));
const TeacherTimeTable = React.lazy(() => import("../views/academic/teacher-time-table"));
const TeacherReport = React.lazy(() => import("../views/report/attendance-report/teacherReport"));
const TeacherSalary = React.lazy(() => import("../views/peoples/teacher/teacher-details/teacherSalary"));
const TeachersRoutine = React.lazy(() => import("../views/peoples/teacher/teacher-details/teachersRoutine"));
const Testimonials = React.lazy(() => import("../views/content/testimonials"));
const ThemifyIcons = React.lazy(() => import("../views/uiInterface/icons/themify"));
const TicketDetails = React.lazy(() => import("../views/support/ticket-details"));
const TicketGrid = React.lazy(() => import("../views/support/ticket-grid"));
const Tickets = React.lazy(() => import("../views/support/tickets"));
const Todo = React.lazy(() => import("../views/application/todo"));
const Tooltips = React.lazy(() => import("../views/uiInterface/base-ui/tooltips"));
const TransportAssignVehicle = React.lazy(() => import("../views/campus-operations/transport/assign-vehicle"));
const TransportPickupPoints = React.lazy(() => import("../views/campus-operations/transport/pickup-points"));
const TransportRoutes = React.lazy(() => import("../views/campus-operations/transport/routes"));
const TransportVehicle = React.lazy(() => import("../views/campus-operations/transport/vehicles"));
const TransportVehicleDrivers = React.lazy(() => import("../views/campus-operations/transport/drivers"));
const TwoStepVerification = React.lazy(() => import("../views/auth/twoStepVerification/twoStepVerification"));
const TwoStepVerification2 = React.lazy(() => import("../views/auth/twoStepVerification/twoStepVerification-2"));
const TwoStepVerification3 = React.lazy(() => import("../views/auth/twoStepVerification/twoStepVerification-3"));
const TypiconIcons = React.lazy(() => import("../views/uiInterface/icons/typicons"));
const Typography = React.lazy(() => import("../views/uiInterface/base-ui/typography"));
const UnderMaintenance = React.lazy(() => import("../views/pages/underMaintenance"));
const WeatherIcons = React.lazy(() => import("../views/uiInterface/icons/weathericons"));

const routes = all_routes;

/**
 * Pages that exist in the HTML template but have no React implementation yet
 * render the shared blank page, so every route in the sidebar resolves.
 */
const placeholder = (title: string, parent: string) => (
  <BlankPage title={title} parent={parent} />
);

export const publicRoutes = [
  {
    path: "/",
    name: "Root",
    element: <Navigate to="/login" />,
    route: Route,
  },
  {
    path: routes.academicCalendar,
    element: <AcademicCalendar />,
    route: Route,
  },
  {
    path: routes.academicReports,
    element: <AcademicReports />,
    route: Route,
  },
  {
    path: routes.academicSettings,
    element: <AcademicSettings />,
    route: Route,
  },
  {
    path: routes.academicYear,
    element: <AcademicYear />,
    route: Route,
  },
  {
    path: routes.accountsIncome,
    element: <AccountsIncome />,
    route: Route,
  },
  {
    path: routes.accountsTransactions,
    element: <AccountsTransactions />,
    route: Route,
  },
  {
    path: routes.activity,
    element: <NotificationActivities />,
    route: Route,
  },
  {
    path: routes.activityLogs,
    element: <ActivityLogs />,
    route: Route,
  },
  {
    path: routes.addAdmission,
    element: <AddAdmission />,
    route: Route,
  },
  {
    path: routes.addAlumni,
    element: <AddAlumni />,
    route: Route,
  },
  {
    path: routes.addInvoice,
    element: <AddInvoice />,
    route: Route,
  },
  {
    path: routes.addStaff,
    element: <AddStaff />,
    route: Route,
  },
  {
    path: routes.addStudent,
    element: <AddStudent mode="add" />,
    route: Route,
  },
  {
    path: routes.addTeacher,
    element: <TeacherForm mode="add" />,
    route: Route,
  },
  {
    path: routes.admissionDetails,
    element: <AdmissionDetails />,
    route: Route,
  },
  {
    path: routes.admissions,
    element: <AdmissionGrid />,
    route: Route,
  },
  {
    path: routes.admitCard,
    element: <AdmitCard />,
    route: Route,
  },
  {
    path: routes.aiSettings,
    element: <AiSettings />,
    route: Route,
  },
  {
    path: routes.alumni,
    element: <AlumniGrid />,
    route: Route,
  },
  {
    path: routes.alumniProfile,
    element: <AlumniProfile />,
    route: Route,
  },
  {
    path: routes.announcements,
    element: <AnnouncementsPage />,
    route: Route,
  },
  {
    path: routes.apiKeys,
    element: <ApiKeys />,
    route: Route,
  },
  {
    path: routes.appSettings,
    element: <AppSettings />,
    route: Route,
  },
  {
    path: routes.appointmentRequests,
    element: <AppointmentRequestsPage />,
    route: Route,
  },
  {
    path: routes.assetAllocation,
    element: <AssetAllocation />,
    route: Route,
  },
  {
    path: routes.assetMaintenance,
    element: <AssetMaintenance />,
    route: Route,
  },
  {
    path: routes.assets,
    element: <AssetRegister />,
    route: Route,
  },
  {
    path: routes.attendanceReport,
    element: <AttendanceReport />,
    route: Route,
  },
  {
    path: routes.attendanceRules,
    element: <AttendanceRules />,
    route: Route,
  },
  {
    path: routes.auditLog,
    element: <AuditLog />,
    route: Route,
  },
  {
    path: routes.backupRestore,
    element: <BackupRestore />,
    route: Route,
  },
  {
    path: routes.banIpAddress,
    element: <BanIpAddress />,
    route: Route,
  },
  {
    path: routes.bankTransactions,
    element: <BankTransactions />,
    route: Route,
  },
  {
    path: routes.behaviorDiscipline,
    element: <BehaviorDiscipline />,
    route: Route,
  },
  {
    path: routes.biometricRfid,
    element: <BiometricRfid />,
    route: Route,
  },
  {
    path: routes.blankPage,
    element: <BlankPage />,
    route: Route,
  },
  {
    path: routes.allBlogs,
    element: <AllBlogs />,
    route: Route,
  },
  {
    path: routes.blogCategories,
    element: <BlogCategories />,
    route: Route,
  },
  {
    path: routes.blogComments,
    element: <BlogComments />,
    route: Route,
  },
  {
    path: routes.blogTags,
    element: <BlogTags />,
    route: Route,
  },
  {
    path: routes.bonafideCertificate,
    element: <BonafideCertificate />,
    route: Route,
  },
  {
    path: routes.branchManagement,
    element: <BranchManagement />,
    route: Route,
  },
  {
    path: routes.broadcastScheduler,
    element: <BroadcastSchedulerPage />,
    route: Route,
  },
  {
    path: routes.bulkSms,
    element: <BulkSmsPage />,
    route: Route,
  },
  {
    path: routes.bulkWhatsapp,
    element: <BulkWhatsappPage />,
    route: Route,
  },
  {
    path: routes.cache,
    element: <Cache />,
    route: Route,
  },
  {
    path: routes.cafeteriaBilling,
    element: <CafeteriaBilling />,
    route: Route,
  },
  {
    path: routes.cafeteriaMenu,
    element: <CafeteriaMenu />,
    route: Route,
  },
  {
    path: routes.cafeteriaOrders,
    element: <CafeteriaOrders />,
    route: Route,
  },
  {
    path: routes.calendar,
    element: <Calendar />,
    route: Route,
  },
  {
    path: routes.centralDashboard,
    element: <CentralDashboard />,
    route: Route,
  },
  {
    path: routes.certificateRecords,
    element: <CertificateRecords />,
    route: Route,
  },
  {
    path: routes.apexChat,
    element: <Apexchart />,
    route: Route,
  },
  {
    path: routes.dragandDrop,
    element: <DragDrop />,
    route: Route,
  },
  {
    path: routes.falgIcons,
    element: <FlagIcons />,
    route: Route,
  },
  {
    path: routes.featherIcons,
    element: <FeatherIcons />,
    route: Route,
  },
  {
    path: routes.floatingLable,
    element: <FormFloatingLabels />,
    route: Route,
  },
  {
    path: routes.grid,
    element: <UiGrid />,
    route: Route,
  },
  {
    path: routes.simpleLineIcon,
    element: <SimpleLineIcon />,
    route: Route,
  },
  {
    path: routes.sweetalert,
    element: <SweetAlert />,
    route: Route,
  },
  {
    path: routes.uiAttendance,
    element: <UiAttendance />,
    route: Route,
  },
  {
    path: routes.uiWorkspace,
    element: <UiWorkspace />,
    route: Route,
  },
  {
    path: routes.chartC3,
    element: placeholder("Chart C3", "Charts"),
    route: Route,
  },
  {
    path: routes.chartFlot,
    element: placeholder("Flot Charts", "Charts"),
    route: Route,
  },
  {
    path: routes.chart,
    element: placeholder("Chart Js", "Charts"),
    route: Route,
  },
  {
    path: routes.chartMorris,
    element: placeholder("Morris Charts", "Charts"),
    route: Route,
  },
  {
    path: routes.chartPeity,
    element: placeholder("Peity Charts", "Charts"),
    route: Route,
  },
  {
    path: routes.chatInbox,
    element: <ChatInboxPage />,
    route: Route,
  },
  {
    path: routes.cities,
    element: <Cities />,
    route: Route,
  },
  {
    path: routes.classAnalytics,
    element: <ClassAnalytics />,
    route: Route,
  },
  {
    path: routes.classRoutine,
    element: <ClassRoutine />,
    route: Route,
  },
  {
    path: routes.sheduleClasses,
    element: <ScheduleClasses />,
    route: Route,
  },
  {
    path: routes.classSection,
    element: <ClassSection />,
    route: Route,
  },
  {
    path: routes.classSettings,
    element: <ClassSettings />,
    route: Route,
  },
  {
    path: routes.classSubject,
    element: <ClassSubject />,
    route: Route,
  },
  {
    path: routes.classSyllabus,
    element: <ClassSyllabus />,
    route: Route,
  },
  {
    path: routes.classTimetable,
    element: <ClassTimetable />,
    route: Route,
  },
  {
    path: routes.classes,
    element: <Classes />,
    route: Route,
  },
  {
    path: routes.classRoom,
    element: <ClassRoom />,
    route: Route,
  },
  {
    path: routes.collectFees,
    element: <CollectFees />,
    route: Route,
  },
  {
    path: routes.companySettings,
    element: <CompanySettings />,
    route: Route,
  },
  {
    path: routes.competitions,
    element: <Competitions />,
    route: Route,
  },
  {
    path: routes.contactMessages,
    element: <ContactMessages />,
    route: Route,
  },
  {
    path: routes.countries,
    element: <Countries />,
    route: Route,
  },
  {
    path: routes.curriculum,
    element: <Curriculum />,
    route: Route,
  },
  {
    path: routes.customFields,
    element: <CustomFields />,
    route: Route,
  },
  {
    path: routes.customReports,
    element: <CustomReports />,
    route: Route,
  },
  {
    path: routes.dailyAttendance,
    element: <DailyAttendance />,
    route: Route,
  },
  {
    path: routes.dataTables,
    element: <DataTables />,
    route: Route,
  },
  {
    path: routes.deleteRequest,
    element: <DeleteRequest />,
    route: Route,
  },
  {
    path: routes.departments,
    element: <Departments />,
    route: Route,
  },
  {
    path: routes.designation,
    element: <Designation />,
    route: Route,
  },
  {
    path: routes.digitalIdCard,
    element: <DigitalIdCard />,
    route: Route,
  },
  {
    path: routes.discountRules,
    element: <DiscountRules />,
    route: Route,
  },
  {
    path: routes.documentViewer,
    element: <DocumentViewer />,
    route: Route,
  },
  {
    path: routes.dueReports,
    element: <DueReports />,
    route: Route,
  },
  {
    path: routes.editInvoice,
    element: <EditInvoice />,
    route: Route,
  },
  {
    path: routes.editStaff,
    element: <EditStaff />,
    route: Route,
  },
  {
    path: routes.editStudent,
    element: <AddStudent mode="edit" />,
    route: Route,
  },
  {
    path: routes.editTeacher,
    element: <TeacherForm mode="edit" />,
    route: Route,
  },
  {
    path: routes.email,
    element: <Email />,
    route: Route,
  },
  {
    path: routes.emailNotifications,
    element: <NotificationCenterPage />,
    route: Route,
  },
  {
    path: routes.emailSettings,
    element: <EmailSettings />,
    route: Route,
  },
  {
    path: routes.emailTemplates,
    element: <Emailtemplates />,
    route: Route,
  },
  {
    path: routes.employeePayroll,
    element: <EmployeePayroll />,
    route: Route,
  },
  {
    path: routes.events,
    element: <Events />,
    route: Route,
  },
  {
    path: routes.examAttendance,
    element: <ExamAttendance />,
    route: Route,
  },
  {
    path: routes.examResult,
    element: <ExamResult />,
    route: Route,
  },
  {
    path: routes.examSettings,
    element: <ExamSettings />,
    route: Route,
  },
  {
    path: routes.examTypes,
    element: <ExamTypes />,
    route: Route,
  },
  {
    path: routes.exam,
    element: <Exam />,
    route: Route,
  },
  {
    path: routes.exitPass,
    element: <ExitPassPage />,
    route: Route,
  },
  {
    path: routes.expense,
    element: <Expense />,
    route: Route,
  },
  {
    path: routes.expenseCategory,
    element: <ExpensesCategory />,
    route: Route,
  },
  {
    path: routes.faq,
    element: <Faq />,
    route: Route,
  },
  {
    path: routes.feeCollectionReport,
    element: <FeeCollectionReport />,
    route: Route,
  },
  {
    path: routes.feeInstallments,
    element: <FeeInstallments />,
    route: Route,
  },
  {
    path: routes.feeRules,
    element: <FeeRules />,
    route: Route,
  },
  {
    path: routes.feesAssign,
    element: <FeesAssign />,
    route: Route,
  },
  {
    path: routes.feesGroup,
    element: <FeesGroup />,
    route: Route,
  },
  {
    path: routes.feesMaster,
    element: <FeesMaster />,
    route: Route,
  },
  {
    path: routes.feesType,
    element: <FeesTypes />,
    route: Route,
  },
  {
    path: routes.fileManager,
    element: <FileManager />,
    route: Route,
  },
  {
    path: routes.financialReports,
    element: <FinancialReports />,
    route: Route,
  },
  {
    path: routes.fineManagement,
    element: <FineManagement />,
    route: Route,
  },
  {
    path: routes.basicInput,
    element: <BasicInputs />,
    route: Route,
  },
  {
    path: routes.checkboxandRadion,
    element: <CheckboxRadios />,
    route: Route,
  },
  {
    path: routes.formElements,
    element: <FormElements />,
    route: Route,
  },
  {
    path: routes.fileUpload,
    element: <FileUpload />,
    route: Route,
  },
  {
    path: routes.floatingLable,
    element: placeholder("Floating Labels", "Layouts"),
    route: Route,
  },
  {
    path: routes.gridandGutters,
    element: <GridGutters />,
    route: Route,
  },
  {
    path: routes.horizontalForm,
    element: <FormHorizontal />,
    route: Route,
  },
  {
    path: routes.inputGroup,
    element: <InputGroup />,
    route: Route,
  },
  {
    path: routes.formMask,
    element: <FormMask />,
    route: Route,
  },
  {
    path: routes.formSelect,
    element: <FormSelect />,
    route: Route,
  },
  {
    path: routes.reactSelect,
    element: <FormSelect2 />,
    route: Route,
  },
  {
    path: routes.formValidation,
    element: <FormValidation />,
    route: Route,
  },
  {
    path: routes.verticalForm,
    element: <FormVertical />,
    route: Route,
  },
  {
    path: routes.formWizard,
    element: <FormWizard />,
    route: Route,
  },
  {
    path: routes.franchiseSetup,
    element: <FranchiseSetup />,
    route: Route,
  },
  {
    path: routes.gateEntry,
    element: <GateEntryPage />,
    route: Route,
  },
  {
    path: routes.gatePass,
    element: <GatePassPage />,
    route: Route,
  },
  {
    path: routes.gdpr,
    element: <Gdpr />,
    route: Route,
  },
  {
    path: routes.gdprCookies,
    element: <GdprCookies />,
    route: Route,
  },
  {
    path: routes.generateCertificates,
    element: <GenerateCertificates />,
    route: Route,
  },
  {
    path: routes.gradeReport,
    element: <GradeReport />,
    route: Route,
  },
  {
    path: routes.grade,
    element: <Grade />,
    route: Route,
  },
  {
    path: routes.gradingRules,
    element: <GradingRules />,
    route: Route,
  },
  {
    path: routes.guardiansGrid,
    element: <GuardianGrid />,
    route: Route,
  },
  {
    path: routes.guardiansList,
    element: <GuardianList />,
    route: Route,
  },
  {
    path: routes.healthAlerts,
    element: <HealthAlertsPage />,
    route: Route,
  },
  {
    path: routes.holidays,
    element: <Holiday />,
    route: Route,
  },
  {
    path: routes.classHomeWork,
    element: <ClassHomeWork />,
    route: Route,
  },
  {
    path: routes.hostelFees,
    element: <HostelFees />,
    route: Route,
  },
  {
    path: routes.hostelList,
    element: <HostelList />,
    route: Route,
  },
  {
    path: routes.hostelType,
    element: <HostelType />,
    route: Route,
  },
  {
    path: routes.hostelRoom,
    element: <HostelRooms />,
    route: Route,
  },
  {
    path: routes.hostelVisitorLog,
    element: <HostelVisitorLog />,
    route: Route,
  },
  {
    path: routes.featherIcons,
    element: placeholder("Feather Icons", "Icons"),
    route: Route,
  },
  {
    path: routes.falgIcons,
    element: placeholder("Flag Icons", "Icons"),
    route: Route,
  },
  {
    path: routes.fantawesome,
    element: <FontawesomeIcons />,
    route: Route,
  },
  {
    path: routes.iconicIcon,
    element: <IonicIcons />,
    route: Route,
  },
  {
    path: routes.materialIcon,
    element: <MaterialIcons />,
    route: Route,
  },
  {
    path: routes.pe7icon,
    element: <PE7Icons />,
    route: Route,
  },
  {
    path: routes.simpleLineIcon,
    element: placeholder("Simpleline Icons", "Icons"),
    route: Route,
  },
  {
    path: routes.themifyIcon,
    element: <ThemifyIcons />,
    route: Route,
  },
  {
    path: routes.typicon,
    element: <TypiconIcons />,
    route: Route,
  },
  {
    path: routes.weatherIcon,
    element: <WeatherIcons />,
    route: Route,
  },
  {
    path: routes.idCardTemplates,
    element: <IdCardTemplates />,
    route: Route,
  },
  {
    path: routes.adminDashboard,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.invoice,
    element: <Invoice />,
    route: Route,
  },
  {
    path: routes.invoiceSettings,
    element: <InvoiceSettings />,
    route: Route,
  },
  {
    path: routes.accountsInvoices,
    element: <AccountsInvoices />,
    route: Route,
  },
  {
    path: routes.language,
    element: <Languagesettings />,
    route: Route,
  },
  {
    path: routes.layoutBox,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutDark,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutDefault,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutMini,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutRtl,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.listLeaves,
    element: <ListLeaves />,
    route: Route,
  },
  {
    path: routes.leavePolicies,
    element: <LeavePolicies />,
    route: Route,
  },
  {
    path: routes.leaveReport,
    element: <LeaveReport />,
    route: Route,
  },
  {
    path: routes.ledger,
    element: <Ledger />,
    route: Route,
  },
  {
    path: routes.lessonPlanning,
    element: <LessonPlanning />,
    route: Route,
  },
  {
    path: routes.libraryBooks,
    element: <LibraryBooks />,
    route: Route,
  },
  {
    path: routes.libraryCategories,
    element: <LibraryCategories />,
    route: Route,
  },
  {
    path: routes.libraryIssueBook,
    element: <LibraryIssueBook />,
    route: Route,
  },
  {
    path: routes.libraryMembers,
    element: <LibraryMembers />,
    route: Route,
  },
  {
    path: routes.libraryReports,
    element: <LibraryReports />,
    route: Route,
  },
  {
    path: routes.libraryReservations,
    element: <LibraryReservations />,
    route: Route,
  },
  {
    path: routes.libraryReturn,
    element: <LibraryReturnBook />,
    route: Route,
  },
  {
    path: routes.localization,
    element: <Localization />,
    route: Route,
  },
  {
    path: routes.loginActivity,
    element: <LoginActivity />,
    route: Route,
  },
  {
    path: routes.maintenanceMode,
    element: <MaintenanceMode />,
    route: Route,
  },
  {
    path: routes.marksEntry,
    element: <MarksEntry />,
    route: Route,
  },
  {
    path: routes.mealPlans,
    element: <MealPlans />,
    route: Route,
  },
  {
    path: routes.medicalVisits,
    element: <MedicalVisitsPage />,
    route: Route,
  },
  {
    path: routes.membershipAddon,
    element: <MembershipAddon />,
    route: Route,
  },
  {
    path: routes.membershipplan,
    element: <Membershipplan />,
    route: Route,
  },
  {
    path: routes.membershipTransaction,
    element: <MembershipTransaction />,
    route: Route,
  },
  {
    path: routes.notes,
    element: <Notes />,
    route: Route,
  },
  {
    path: routes.noticeBoard,
    element: <NoticeBoard />,
    route: Route,
  },
  {
    path: routes.notificationssettings,
    element: <Notificationssettings />,
    route: Route,
  },
  {
    path: routes.onlineExamination,
    element: <OnlineExamination />,
    route: Route,
  },
  {
    path: routes.onlinePaymentReceipts,
    element: <OnlinePaymentReceipts />,
    route: Route,
  },
  {
    path: routes.onlinePayments,
    element: <OnlinePayments />,
    route: Route,
  },
  {
    path: routes.optSettings,
    element: <OtpSettings />,
    route: Route,
  },
  {
    path: routes.pages,
    element: <Pages />,
    route: Route,
  },
  {
    path: routes.parentCommunication,
    element: <ParentCommunicationPage />,
    route: Route,
  },
  {
    path: routes.parentDashboard,
    element: <ParentDashboard />,
    route: Route,
  },
  {
    path: routes.parentGrid,
    element: <ParentGrid />,
    route: Route,
  },
  {
    path: routes.parentList,
    element: <ParentList />,
    route: Route,
  },
  {
    path: routes.paymentGateways,
    element: <PaymentGateways />,
    route: Route,
  },
  {
    path: routes.paymentHistory,
    element: <PaymentHistory />,
    route: Route,
  },
  {
    path: routes.paymentSettings,
    element: <PaymentSettings />,
    route: Route,
  },
  {
    path: routes.payroll,
    element: <Payroll />,
    route: Route,
  },
  {
    path: routes.payslips,
    element: <Payslips />,
    route: Route,
  },
  {
    path: routes.performanceAnalytics,
    element: <PerformanceAnalytics />,
    route: Route,
  },
  {
    path: routes.permissions,
    element: <Permission />,
    route: Route,
  },
  {
    path: routes.planFeatures,
    element: <PlanFeatures />,
    route: Route,
  },
  {
    path: routes.playerList,
    element: <PlayersList />,
    route: Route,
  },
  {
    path: routes.plugins,
    element: <Plugins />,
    route: Route,
  },
  {
    path: routes.preference,
    element: <Preference />,
    route: Route,
  },
  {
    path: routes.prefixes,
    element: <Prefixes />,
    route: Route,
  },
  {
    path: routes.profile,
    element: <Profile />,
    route: Route,
  },
  {
    path: routes.profilesettings,
    element: <Profilesettings />,
    route: Route,
  },
  {
    path: routes.progressReports,
    element: <ProgressReports />,
    route: Route,
  },
  {
    path: routes.pushConfigurations,
    element: <PushConfigurations />,
    route: Route,
  },
  {
    path: routes.pushNotifications,
    element: <PushNotificationsPage />,
    route: Route,
  },
  {
    path: routes.questionBank,
    element: <QuestionBank />,
    route: Route,
  },
  {
    path: routes.rankingSystem,
    element: <RankingSystem />,
    route: Route,
  },
  {
    path: routes.receipts,
    element: <Receipts />,
    route: Route,
  },
  {
    path: routes.refunds,
    element: <Refunds />,
    route: Route,
  },
  {
    path: routes.religion,
    element: <Religion />,
    route: Route,
  },
  {
    path: routes.reportCards,
    element: <ReportCards />,
    route: Route,
  },
  {
    path: routes.rewardsGamification,
    element: <RewardsGamification />,
    route: Route,
  },
  {
    path: routes.rolesPermissions,
    element: <RolesPermissions />,
    route: Route,
  },
  {
    path: routes.roomAllocation,
    element: <RoomAllocation />,
    route: Route,
  },
  {
    path: routes.teachersRoutine,
    element: <TeachersRoutine />,
    route: Route,
  },
  {
    path: routes.salaryStructure,
    element: <SalaryStructure />,
    route: Route,
  },
  {
    path: routes.examSchedule,
    element: <ExamSchedule />,
    route: Route,
  },
  {
    path: routes.scheduledTasks,
    element: <ScheduledTasksPage />,
    route: Route,
  },
  {
    path: routes.scholarshipManagement,
    element: <ScholarshipManagement />,
    route: Route,
  },
  {
    path: routes.scholarships,
    element: <Scholarships />,
    route: Route,
  },
  {
    path: routes.schoolProfile,
    element: <SchoolProfile />,
    route: Route,
  },
  {
    path: routes.schoolSettings,
    element: <SchoolSettings />,
    route: Route,
  },
  {
    path: routes.sectionSettings,
    element: <SectionSettings />,
    route: Route,
  },
  {
    path: routes.securitysettings,
    element: <Securitysettings />,
    route: Route,
  },
  {
    path: routes.sendSms,
    element: <SendSmsPage />,
    route: Route,
  },
  {
    path: routes.sendWhatsapp,
    element: <SendWhatsappPage />,
    route: Route,
  },
  {
    path: routes.sessionManagement,
    element: <SessionManagement />,
    route: Route,
  },
  {
    path: routes.sickRoomLog,
    element: <SickRoomLogPage />,
    route: Route,
  },
  {
    path: routes.smsLogs,
    element: <SickRoomLogPage/>,
    route: Route,
  },
  {
    path: routes.smsSettings,
    element: <SmsSettings />,
    route: Route,
  },
  {
    path: routes.smsTemplates,
    element: <SmsTemplatesPage />,
    route: Route,
  },
  {
    path: routes.socialAuthentication,
    element: <Socialauthentication />,
    route: Route,
  },
  {
    path: routes.sportsList,
    element: <SportsList />,
    route: Route,
  },
  {
    path: routes.staffAttendance,
    element: <StaffAttendance />,
    route: Route,
  },
  {
    path: routes.staffDayWise,
    element: <StaffDayWise />,
    route: Route,
  },
  {
    path: routes.staffDetails,
    element: <StaffDetails />,
    route: Route,
  },
  {
    path: routes.staffEntry,
    element: <StaffEntryPage />,
    route: Route,
  },
  {
    path: routes.staffLeave,
    element: <StaffLeave />,
    route: Route,
  },
  {
    path: routes.staffPayroll,
    element: <StaffPayRoll />,
    route: Route,
  },
  {
    path: routes.staffReport,
    element: <StaffReport />,
    route: Route,
  },
  {
    path: routes.staff,
    element: <Staff />,
    route: Route,
  },
  {
    path: routes.staffsAttendance,
    element: <StaffsAttendance />,
    route: Route,
  },
  {
    path: routes.states,
    element: <States />,
    route: Route,
  },
  {
    path: routes.statusCardsShowcase,
    element: <StatusCardsShowcase />,
    route: Route,
  },
  {
    path: routes.stockManagement,
    element: <StockManagement />,
    route: Route,
  },
  {
    path: routes.storage,
    element: <Storage />,
    route: Route,
  },
  {
    path: routes.student360,
    element: <Student360 />,
    route: Route,
  },
  {
    path: routes.studentAttendance,
    element: <StudentAttendance />,
    route: Route,
  },
  {
    path: routes.studentAttendanceHistory,
    element: <StudentAttendanceHistory />,
    route: Route,
  },
  {
    path: routes.studentAttendanceType,
    element: <StudentAttendanceType />,
    route: Route,
  },
  {
    path: routes.studentAwards,
    element: <StudentAwards />,
    route: Route,
  },
  {
    path: routes.studentDashboard,
    element: <StudentDasboard />,
    route: Route,
  },
  {
    path: routes.studentDayWise,
    element: <StudentDayWise />,
    route: Route,
  },
  {
    path: routes.studentDetail,
    element: <StudentDetails />,
    route: Route,
  },
  {
    path: routes.studentDocuments,
    element: <StudentDocumentsPage />,
    route: Route,
  },
  {
    path: routes.studentFees,
    element: <StudentFees />,
    route: Route,
  },
  {
    path: routes.studentIdCards,
    element: <StudentIdCards />,
    route: Route,
  },
  {
    path: routes.studentLeaves,
    element: <StudentLeaves />,
    route: Route,
  },
  {
    path: routes.studentLibrary,
    element: <StudentLibrary />,
    route: Route,
  },
  {
    path: routes.studentList,
    element: <StudentList />,
    route: Route,
  },
  {
    path: routes.studentPerformance,
    element: <StudentPerformance />,
    route: Route,
  },
  {
    path: routes.studentPromotion,
    element: <StudentPromotion />,
    route: Route,
  },
  {
    path: routes.studentResult,
    element: <StudentResult />,
    route: Route,
  },
  {
    path: routes.studentTimeTable,
    element: <StudentTimeTable />,
    route: Route,
  },
  {
    path: routes.studentWallet,
    element: <StudentWallet />,
    route: Route,
  },
  {
    path: routes.studentGrid,
    element: <StudentGrid />,
    route: Route,
  },
  {
    path: routes.studyMaterials,
    element: <StudyMaterials />,
    route: Route,
  },
  {
    path: routes.subjectPerformance,
    element: <SubjectPerformance />,
    route: Route,
  },
  {
    path: routes.subjectSettings,
    element: <SubjectSettings />,
    route: Route,
  },
  {
    path: routes.subscriptionPlans,
    element: <SubscriptionPlans />,
    route: Route,
  },
  {
    path: routes.systemLogs,
    element: <SystemLogs />,
    route: Route,
  },
  {
    path: routes.systemSettings,
    element: <SystemSettingsPage />,
    route: Route,
  },
  {
    path: routes.tablesBasic,
    element: <TablesBasic />,
    route: Route,
  },
  {
    path: routes.taxRates,
    element: <TaxRates />,
    route: Route,
  },
  {
    path: routes.taxReports,
    element: <TaxReports />,
    route: Route,
  },
  {
    path: routes.teacherAttendance,
    element: <TeacherAttendance />,
    route: Route,
  },
  {
    path: routes.teacherDashboard,
    element: <TeacherDashboard />,
    route: Route,
  },
  {
    path: routes.teacherDayWise,
    element: <TeacherDayWise />,
    route: Route,
  },
  {
    path: routes.teacherDetails,
    element: <TeacherDetails />,
    route: Route,
  },
  {
    path: routes.teacherLeaves,
    element: <TeacherLeave />,
    route: Route,
  },
  {
    path: routes.teacherLibrary,
    element: <TeacherLibrary />,
    route: Route,
  },
  {
    path: routes.teacherList,
    element: <TeacherList />,
    route: Route,
  },
  {
    path: routes.teacherPerformance,
    element: <TeacherPerformancePage />,
    route: Route,
  },
  {
    path: routes.teacherReport,
    element: <TeacherReport />,
    route: Route,
  },
  {
    path: routes.teacherSalary,
    element: <TeacherSalary />,
    route: Route,
  },
  {
    path: routes.teacherTimeTable,
    element: <TeacherTimeTable />,
    route: Route,
  },
  {
    path: routes.teacherGrid,
    element: <TeacherGrid />,
    route: Route,
  },
  {
    path: routes.tenantSettings,
    element: <TenantSettings />,
    route: Route,
  },
  {
    path: routes.testimonials,
    element: <Testimonials />,
    route: Route,
  },
  {
    path: routes.themeSettings,
    element: <ThemeSettings />,
    route: Route,
  },
  {
    path: routes.ticketDetails,
    element: <TicketDetails />,
    route: Route,
  },
  {
    path: routes.ticketGrid,
    element: <TicketGrid />,
    route: Route,
  },
  {
    path: routes.tickets,
    element: <Tickets />,
    route: Route,
  },
  {
    path: routes.timetableSettings,
    element: <TimetableSettings />,
    route: Route,
  },
  {
    path: routes.todo,
    element: <Todo />,
    route: Route,
  },
  {
    path: routes.transferCertificate,
    element: <TransferCertificate />,
    route: Route,
  },
  {
    path: routes.transportAssignStudents,
    element: <TransportAssignStudents />,
    route: Route,
  },
  {
    path: routes.transportAssignVehicle,
    element: <TransportAssignVehicle />,
    route: Route,
  },
  {
    path: routes.transportVehicleDrivers,
    element: <TransportVehicleDrivers />,
    route: Route,
  },
  {
    path: routes.transportGpsTracking,
    element: <TransportGpsTracking />,
    route: Route,
  },
  {
    path: routes.transportPickupPoints,
    element: <TransportPickupPoints />,
    route: Route,
  },
  {
    path: routes.transportRouteScheduling,
    element: <TransportRouteScheduling />,
    route: Route,
  },
  {
    path: routes.transportRoutes,
    element: <TransportRoutes />,
    route: Route,
  },
  {
    path: routes.transportVehicle,
    element: <TransportVehicle />,
    route: Route,
  },
  {
    path: routes.triggerActions,
    element: <TriggerActionsPage />,
    route: Route,
  },
  {
    path: routes.accordion,
    element: <Accordion />,
    route: Route,
  },
  {
    path: routes.uiActions,
    element: <UiActions />,
    route: Route,
  },
  {
    path: routes.uiActivity,
    element: <UiActivity />,
    route: Route,
  },
  {
    path: routes.alert,
    element: <AlertUi />,
    route: Route,
  },
  {
    path: routes.uiAnalytics,
    element: <UiAnalytics />,
    route: Route,
  },
  {
    path: routes.uiAttendance,
    element: placeholder("Attendance", "Base UI"),
    route: Route,
  },
  {
    path: routes.avatar,
    element: <Avatar />,
    route: Route,
  },
  {
    path: routes.badges,
    element: <Badges />,
    route: Route,
  },
  {
    path: routes.border,
    element: <UiBorders />,
    route: Route,
  },
  {
    path: routes.breadcrums,
    element: <Breadcrumb />,
    route: Route,
  },
  {
    path: routes.button,
    element: <Buttons />,
    route: Route,
  },
  {
    path: routes.buttonGroup,
    element: <ButtonsGroup />,
    route: Route,
  },
  {
    path: routes.cards,
    element: <Cards />,
    route: Route,
  },
  {
    path: routes.carousel,
    element: <Carousel />,
    route: Route,
  },
  {
    path: routes.clipboard,
    element: <ClipBoard />,
    route: Route,
  },
  {
    path: routes.uiCollapse,
    element: <Collapse />,
    route: Route,
  },
  {
    path: routes.uiCounter,
    element: <UiCounter />,
    route: Route,
  },
  {
    path: routes.uiDashboardCards,
    element: <UiDashboardCards />,
    route: Route,
  },
  {
    path: routes.dragandDrop,
    element: placeholder("Drag & Drop", "Advanced UI"),
    route: Route,
  },
  {
    path: routes.dropdowns,
    element: <Dropdowns />,
    route: Route,
  },
  {
    path: routes.grid,
    element: placeholder("Grid", "Base UI"),
    route: Route,
  },
  {
    path: routes.images,
    element: <Images />,
    route: Route,
  },
  {
    path: routes.uiInsights,
    element: <UiInsights />,
    route: Route,
  },
  {
    path: routes.lightbox,
    element: <Lightboxes />,
    route: Route,
  },
  {
    path: routes.uiLinks,
    element: <Links />,
    route: Route,
  },
  {
    path: routes.uiListGroup,
    element: <ListGroup />,
    route: Route,
  },
  {
    path: routes.uiLists,
    element: <UiLists />,
    route: Route,
  },
  {
    path: routes.uiMedia,
    element: <UiMedia />,
    route: Route,
  },
  {
    path: routes.modals,
    element: <Modals />,
    route: Route,
  },
  {
    path: routes.navTabs,
    element: <NavTabs />,
    route: Route,
  },
  {
    path: routes.offcanvas,
    element: <Offcanvas />,
    route: Route,
  },
  {
    path: routes.pagination,
    element: <Pagination />,
    route: Route,
  },
  {
    path: routes.placeholder,
    element: <Placeholder />,
    route: Route,
  },
  {
    path: routes.popover,
    element: <Popovers />,
    route: Route,
  },
  {
    path: routes.progress,
    element: <Progress />,
    route: Route,
  },
  {
    path: routes.uiRangeslider,
    element: <UiRangeslider />,
    route: Route,
  },
  {
    path: routes.rating,
    element: <UiRating />,
    route: Route,
  },
  {
    path: routes.uiRibbon,
    element: <UiRibbon />,
    route: Route,
  },
  {
    path: routes.scrollBar,
    element: <Scrollbar />,
    route: Route,
  },
  {
    path: routes.spinner,
    element: <Spinner />,
    route: Route,
  },
  {
    path: routes.uiStatistics,
    element: <UiStatistics />,
    route: Route,
  },
  {
    path: routes.sweetalert,
    element: placeholder("Sweet Alerts", "Advanced UI"),
    route: Route,
  },
  {
    path: routes.uiTextEditor,
    element: <UiTextEditor />,
    route: Route,
  },
  {
    path: routes.uiTimeline,
    element: <UiTimeline />,
    route: Route,
  },
  {
    path: routes.uiToasts,
    element: <UiToasts />,
    route: Route,
  },
  {
    path: routes.tooltip,
    element: <Tooltips />,
    route: Route,
  },
  {
    path: routes.typography,
    element: <Typography />,
    route: Route,
  },
  {
    path: routes.uiVideo,
    element: <UiVideo />,
    route: Route,
  },
  {
    path: routes.uiWidgets,
    element: <UiWidgets />,
    route: Route,
  },
  {
    path: routes.uiWorkspace,
    element: placeholder("Workspace", "Base UI"),
    route: Route,
  },
  {
    path: routes.usageLimits,
    element: <UsageLimits />,
    route: Route,
  },
  {
    path: routes.manageusers,
    element: <Manageusers />,
    route: Route,
  },
  {
    path: routes.visitorLog,
    element: <VisitorLogPage />,
    route: Route,
  },
  {
    path: routes.visitorVerification,
    element: <VisitorVerificationPage />,
    route: Route,
  },
  {
    path: routes.wardens,
    element: <HostelWardens />,
    route: Route,
  },
  {
    path: routes.whatsappTemplates,
    element: <WhatsappTemplatesPage />,
    route: Route,
  },
  {
    path: routes.workflowRules,
    element: <WorkflowRulesPage />,
    route: Route,
  },
  {
    path: "*",
    element: <Navigate to={routes.error404} replace />,
    route: Route,
  },
];

export const authRoutes = [
  {
    path: routes.error404,
    element: <Error404 />,
    route: Route,
  },
  {
    path: routes.error500,
    element: <Error500 />,
    route: Route,
  },
  {
    path: routes.comingSoon,
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: routes.emailVerification,
    element: <EmailVerification />,
    route: Route,
  },
  {
    path: routes.emailVerification2,
    element: <EmailVerification2 />,
    route: Route,
  },
  {
    path: routes.emailVerification3,
    element: <EmailVerification3 />,
    route: Route,
  },
  {
    path: routes.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
  },
  {
    path: routes.forgotPassword2,
    element: <ForgotPassword2 />,
    route: Route,
  },
  {
    path: routes.forgotPassword3,
    element: <ForgotPassword3 />,
    route: Route,
  },
  {
    path: routes.lockScreen,
    element: <LockScreen />,
    route: Route,
  },
  {
    path: routes.login,
    element: <Login />,
    route: Route,
  },
  {
    path: routes.login2,
    element: <Login2 />,
    route: Route,
  },
  {
    path: routes.login3,
    element: <Login3 />,
    route: Route,
  },
  {
    path: routes.register,
    element: <Register />,
    route: Route,
  },
  {
    path: routes.register2,
    element: <Register2 />,
    route: Route,
  },
  {
    path: routes.register3,
    element: <Register3 />,
    route: Route,
  },
  {
    path: routes.resetPassword,
    element: <ResetPassword />,
    route: Route,
  },
  {
    path: routes.resetPassword2,
    element: <ResetPassword2 />,
    route: Route,
  },
  {
    path: routes.resetPassword3,
    element: <ResetPassword3 />,
    route: Route,
  },
  {
    path: routes.resetPasswordSuccess,
    element: <ResetPasswordSuccess />,
    route: Route,
  },
  {
    path: routes.resetPasswordSuccess2,
    element: <ResetPasswordSuccess2 />,
    route: Route,
  },
  {
    path: routes.resetPasswordSuccess3,
    element: <ResetPasswordSuccess3 />,
    route: Route,
  },
  {
    path: routes.twoStepVerification,
    element: <TwoStepVerification />,
    route: Route,
  },
  {
    path: routes.twoStepVerification2,
    element: <TwoStepVerification2 />,
    route: Route,
  },
  {
    path: routes.twoStepVerification3,
    element: <TwoStepVerification3 />,
    route: Route,
  },
  {
    path: routes.underMaintenance,
    element: <UnderMaintenance />,
    route: Route,
  },
];
