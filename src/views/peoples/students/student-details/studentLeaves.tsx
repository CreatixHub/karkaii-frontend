
import { Link } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";

interface StatCard {
  id: string;
  variant: string;
  icon: string;
  value: string;
  label: string;
  subtitle: string;
  badge: string;
}

const leaveStatCards: StatCard[] = [
  {
    id: "total-requests",
    variant: "stats-primary",
    icon: "ti ti-calendar-stats",
    value: "32",
    label: "Total Leave Requests",
    subtitle: "This term",
    badge: "+8%",
  },
  {
    id: "approved",
    variant: "stats-success",
    icon: "ti ti-checks",
    value: "21",
    label: "Approved",
    subtitle: "By class teachers",
    badge: "+12%",
  },
  {
    id: "pending",
    variant: "stats-warning",
    icon: "ti ti-clock-hour-4",
    value: "8",
    label: "Pending",
    subtitle: "Awaiting review",
    badge: "+0%",
  },
  {
    id: "rejected",
    variant: "stats-info",
    icon: "ti ti-x",
    value: "3",
    label: "Rejected",
    subtitle: "Insufficient reason",
    badge: "-4%",
  },
];

interface LeaveBalance {
  id: string;
  title: string;
  used: string;
  available: string;
}

const leaveBalances: LeaveBalance[] = [
  { id: "medical", title: "Medical Leave (10)", used: "Used : 5", available: "Available : 5" },
  { id: "casual", title: "Casual Leave (12)", used: "Used : 1", available: "Available : 11" },
  { id: "maternity", title: "Maternity Leave (10)", used: "Used : 0", available: "Available : 10" },
  { id: "paternity", title: "Paternity Leave (0)", used: "Used : 0", available: "Available : 0" },
];

interface LeaveRequestRow {
  id: string;
  leaveType: string;
  leaveDate: string;
  noOfDays: string;
  appliedOn: string;
  status: "Approved" | "Pending";
}

const leaveRequests: LeaveRequestRow[] = [
  {
    id: "lv-1",
    leaveType: "Medical Leave",
    leaveDate: "05 May 2024 - 09 may 2024",
    noOfDays: "5",
    appliedOn: "05 May 2024",
    status: "Approved",
  },
  {
    id: "lv-2",
    leaveType: "Casual Leave",
    leaveDate: "07 May 2024 - 07 may 2024",
    noOfDays: "1",
    appliedOn: "07 May 2024",
    status: "Approved",
  },
  {
    id: "lv-3",
    leaveType: "Special Leave",
    leaveDate: "09 May 2024 - 09 may 2024",
    noOfDays: "1",
    appliedOn: "09 May 2024",
    status: "Pending",
  },
  {
    id: "lv-4",
    leaveType: "Casual Leave",
    leaveDate: "08 May 2024 - 08 may 2024",
    noOfDays: "1",
    appliedOn: "04 May 2024",
    status: "Approved",
  },
  {
    id: "lv-5",
    leaveType: "Medical Leave",
    leaveDate: "08 May 2024 - 11 may 2024",
    noOfDays: "4",
    appliedOn: "08 May 2024",
    status: "Pending",
  },
  {
    id: "lv-6",
    leaveType: "Casual Leave",
    leaveDate: "20 May 2024 - 20 may 2024",
    noOfDays: "1",
    appliedOn: "19 May 2024",
    status: "Pending",
  },
];

interface AttendanceOverviewCard {
  id: string;
  variant: string;
  icon: string;
  label: string;
  value: string;
}

const attendanceOverview: AttendanceOverviewCard[] = [
  { id: "present", variant: "bg-primary-transparent text-primary", icon: "ti ti-user-check", label: "Present", value: "265" },
  { id: "absent", variant: "bg-danger-transparent text-danger", icon: "ti ti-user-check", label: "Absent", value: "05" },
  { id: "halfday", variant: "bg-info-transparent text-info", icon: "ti ti-user-check", label: "Half Day", value: "01" },
  { id: "late", variant: "bg-warning-transparent text-warning", icon: "ti ti-user-check", label: "Late", value: "12" },
];

interface AttendanceLegendItem {
  id: string;
  bg: string;
  icon: string;
  label: string;
}

const attendanceLegend: AttendanceLegendItem[] = [
  { id: "present", bg: "bg-success", icon: "ti ti-checks", label: "Present" },
  { id: "absent", bg: "bg-danger", icon: "ti ti-x", label: "Absent" },
  { id: "late", bg: "bg-pending", icon: "ti ti-clock-x", label: "Late" },
  { id: "halfday", bg: "bg-dark", icon: "ti ti-calendar-event", label: "Halfday" },
  { id: "holiday", bg: "bg-info", icon: "ti ti-calendar-event", label: "Holiday" },
];

const attendanceMonths = [
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
];

type AttendanceCell = "" | "blank" | "success" | "danger" | "pending" | "dark";

interface AttendanceRow {
  day: string;
  cells: AttendanceCell[];
}

const attendanceRows: AttendanceRow[] = [
  { day: "01", cells: ["success", "success", "success", "success", "success", "success", "success", "success", "success", "blank", "blank"] },
  { day: "02", cells: ["success", "success", "success", "success", "success", "success", "success", "success", "success", "blank", "blank"] },
  { day: "03", cells: ["success", "danger", "success", "success", "success", "success", "success", "success", "danger", "blank", "blank"] },
  { day: "04", cells: ["success", "success", "success", "success", "success", "success", "success", "success", "success", "blank", "blank"] },
  { day: "05", cells: ["", "", "", "", "", "", "", "", "", "", ""] },
  { day: "06", cells: ["", "", "", "", "", "", "", "", "", "", ""] },
  { day: "07", cells: ["success", "success", "success", "success", "success", "success", "success", "success", "success", "blank", "blank"] },
  { day: "08", cells: ["success", "success", "success", "success", "success", "success", "success", "success", "success", "blank", "blank"] },
  { day: "09", cells: ["success", "success", "success", "danger", "success", "pending", "danger", "success", "dark", "blank", "blank"] },
  { day: "10", cells: ["", "", "", "", "", "", "", "", "", "", ""] },
  { day: "11", cells: ["", "", "", "", "", "", "", "", "", "", ""] },
  { day: "12", cells: ["success", "success", "success", "success", "success", "success", "success", "success", "success", "blank", "blank"] },
  { day: "13", cells: ["success", "success", "success", "pending", "success", "dark", "success", "success", "success", "blank", "blank"] },
];

const StudentLeaves = () => {
  const routes = all_routes;

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            <StudentBreadcrumb />
            {/* /Page Header */}
          </div>
          {/* Stats Cards */}
          <div className="row g-3 mb-3">
            {leaveStatCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-students ${card.variant}`}>
                  <div className="stats-head">
                    <span className="stats-avatar stats-icon">
                      <i className={card.icon} />
                    </span>
                    <div>
                      <h3 className="stats-value mb-0">{card.value}</h3>
                      <p className="stats-label">{card.label}</p>
                    </div>
                  </div>
                  <div className="stats-footer">
                    <span className="stats-subtitle">
                      <i className="ti ti-point" />
                      {card.subtitle}
                    </span>
                    <span className="stats-badge">{card.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}
          <div className="row">
            {/* Student Information */}
            <StudentSidebar />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link to={routes.studentDetail} className="nav-link">
                        <i className="ti ti-school me-2" />
                        Student Details
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.studentTimeTable} className="nav-link">
                        <i className="ti ti-table-options me-2" />
                        Time Table
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.studentLeaves}
                        className="nav-link active"
                      >
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.studentFees} className="nav-link">
                        <i className="ti ti-report-money me-2" />
                        Fees
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.studentResult} className="nav-link">
                        <i className="ti ti-bookmark-edit me-2" />
                        Exam &amp; Results
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.studentLibrary} className="nav-link">
                        <i className="ti ti-books me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  {/* Leave Nav*/}
                  <div className="card">
                    <div className="card-body pb-1">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded-fill">
                        <li className="me-3 mb-3">
                          <Link
                            to="#"
                            className="nav-link active rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#leave"
                          >
                            Leaves
                          </Link>
                        </li>
                        <li className="mb-3">
                          <Link
                            to="#"
                            className="nav-link rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#attendance"
                          >
                            Attendance
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Leave Nav*/}
                  <div className="tab-content">
                    {/* Leave */}
                    <div className="tab-pane fade show active" id="leave">
                      <div className="row gx-3">
                        {leaveBalances.map((balance) => (
                          <div className="col-12 col-lg-6 col-xxl-3 d-flex" key={balance.id}>
                            <div className="card flex-fill">
                              <div className="card-body">
                                <h5 className="mb-2">{balance.title}</h5>
                                <div className="d-flex align-items-center flex-wrap">
                                  <p className="border-end pe-2 me-2 mb-0">
                                    {balance.used}
                                  </p>
                                  <p className="mb-0">{balance.available}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                          <h4 className="mb-3">Leaves</h4>
                          <Link
                            to="#"
                            data-bs-target="#apply_leave"
                            data-bs-toggle="modal"
                            className="btn btn-primary d-inline-flex align-items-center mb-3"
                          >
                            <i className="ti ti-calendar-event me-2" />
                            Apply Leave
                          </Link>
                        </div>
                        {/* Leaves List */}
                        <div className="card-body p-0 py-3">
                          <div className="custom-datatable-filter table-responsive">
                            <table className="table datatable">
                              <thead className="thead-light">
                                <tr>
                                  <th className="no-sort">Leave Type</th>
                                  <th className="no-sort">Leave Date</th>
                                  <th className="no-sort">No of Days</th>
                                  <th className="no-sort">Applied On</th>
                                  <th className="no-sort">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaveRequests.map((leave) => (
                                  <tr key={leave.id}>
                                    <td className="text-dark">{leave.leaveType}</td>
                                    <td>{leave.leaveDate}</td>
                                    <td>{leave.noOfDays}</td>
                                    <td>{leave.appliedOn} </td>
                                    <td>
                                      {leave.status === "Approved" ? (
                                        <span className="badge badge-soft-success d-inline-flex align-items-center">
                                          <i className="ti ti-circle-filled fs-5 me-1" />
                                          Approved
                                        </span>
                                      ) : (
                                        <span className="badge badge-soft-pending d-inline-flex align-items-center">
                                          <i className="ti ti-circle-filled fs-5 me-1" />
                                          Pending
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* /Leaves List */}
                      </div>
                    </div>
                    {/* /Leave */}
                    {/* Attendance */}
                    <div className="tab-pane fade" id="attendance">
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
                          <h4 className="mb-3">Attendance</h4>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="d-flex align-items-center flex-wrap me-3">
                              <p className="text-dark mb-3 me-2">
                                Last Updated on : 25 May 2024
                              </p>
                              <Link
                                to="#"
                                className="btn btn-primary btn-icon btn-sm rounded-circle flex-shrink-0 d-inline-flex align-items-center justify-content-center p-0 mb-3"
                              >
                                <i className="ti ti-refresh-dot" />
                              </Link>
                            </div>
                            <div className="dropdown mb-3">
                              <Link
                                to="#"
                                className="btn btn-outline-light bg-white dropdown-toggle"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-calendar-due me-2" />
                                Year : 2024 / 2025
                              </Link>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    Year : 2024 / 2025
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    Year : 2023 / 2024
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    Year : 2022 / 2023
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body pb-1">
                          <div className="row">
                            {attendanceOverview.map((stat) => (
                              <div className="col-md-6 col-xxl-3 d-flex" key={stat.id}>
                                <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                  <span className={`avatar avatar-lg rounded me-2 flex-shrink-0 ${stat.variant}`}>
                                    <i className={`${stat.icon} fs-24`} />
                                  </span>
                                  <div className="ms-2">
                                    <p className="mb-1">{stat.label}</p>
                                    <h5>{stat.value}</h5>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
                          <h4 className="mb-3">Leave &amp; Attendance</h4>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="dropdown mb-3 me-3">
                              <Link
                                to="#"
                                className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-calendar-due me-2" />
                                This Year
                              </Link>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    This Year
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    This Month
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    This Week
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="dropdown mb-3">
                              <Link
                                to="#"
                                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-file-export me-2" />
                                Export
                              </Link>
                              <ul className="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    <i className="ti ti-file-type-pdf me-2" />
                                    Export as PDF
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#" className="dropdown-item rounded-1">
                                    <i className="ti ti-file-type-xls me-2" />
                                    Export as Excel{" "}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body p-0 py-3">
                          <div className="px-3">
                            <div className="d-flex align-items-center flex-wrap">
                              {attendanceLegend.map((legend) => (
                                <div
                                  className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3"
                                  key={legend.id}
                                >
                                  <span className={`avatar avatar-sm ${legend.bg} rounded me-2 flex-shrink-0 `}>
                                    <i className={legend.icon} />
                                  </span>
                                  <p className="text-dark">{legend.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Attendance List */}
                          <div className="custom-datatable-filter table-responsive">
                            <table className="table datatable">
                              <thead className="thead-light">
                                <tr>
                                  <th>
                                    Date <span className="divide-bar"> | </span> Month
                                  </th>
                                  {attendanceMonths.map((month) => (
                                    <th key={month}>{month}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {attendanceRows.map((row) => (
                                  <tr key={row.day}>
                                    <td>{row.day}</td>
                                    {row.cells.map((cell, index) => (
                                      <td key={index}>
                                        {cell === "" ? null : cell === "blank" ? (
                                          <span />
                                        ) : (
                                          <span className={`attendance-range bg-${cell}`} />
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* /Attendance List */}
                        </div>
                      </div>
                    </div>
                    {/* /Attendance */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
    </>
  );
};

export default StudentLeaves;
