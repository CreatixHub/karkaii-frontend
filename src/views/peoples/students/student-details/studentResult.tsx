
import { Link } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";

interface ResultStatCard {
  id: string;
  variant: string;
  icon: string;
  value: string;
  label: string;
  subtitle: string;
  badge: string;
}

const resultStatCards: ResultStatCard[] = [
  {
    id: "total-exams",
    variant: "stats-primary",
    icon: "ti ti-clipboard-list",
    value: "6",
    label: "Total Exams",
    subtitle: "This term",
    badge: "+5%",
  },
  {
    id: "completed",
    variant: "stats-success",
    icon: "ti ti-checks",
    value: "5",
    label: "Completed",
    subtitle: "Results published",
    badge: "+8%",
  },
  {
    id: "average-score",
    variant: "stats-warning",
    icon: "ti ti-percentage",
    value: "88%",
    label: "Average Score",
    subtitle: "Across subjects",
    badge: "+0.0%",
  },
  {
    id: "class-rank",
    variant: "stats-info",
    icon: "ti ti-award",
    value: "1st",
    label: "Class Rank",
    subtitle: "Overall standing",
    badge: "+2%",
  },
];

interface ResultRow {
  subject: string;
  max: number;
  min: number;
  obtained: number;
  status: "Pass" | "Fail";
}

interface ExamResult {
  collapseId: string;
  label: string;
  expanded: boolean;
  rows: ResultRow[];
  rank: number;
  total: number;
  marksObtained: number;
  percentage: string;
  result: "Pass" | "Fail";
  resultHeadingClass: string;
}

const examResults: ExamResult[] = [
  {
    collapseId: "collapseOne",
    label: "Monthly Test (May)",
    expanded: true,
    rows: [
      { subject: "English (150)", max: 100, min: 35, obtained: 65, status: "Pass" },
      { subject: "Mathematics (214)", max: 100, min: 35, obtained: 73, status: "Pass" },
      { subject: "Physics (120)", max: 100, min: 35, obtained: 55, status: "Pass" },
      { subject: "Chemistry (110)", max: 100, min: 35, obtained: 90, status: "Pass" },
      { subject: "Spanish (140)", max: 100, min: 35, obtained: 88, status: "Pass" },
    ],
    rank: 30,
    total: 500,
    marksObtained: 395,
    percentage: "79.50",
    result: "Pass",
    resultHeadingClass: "fw-normal text-white fs-15",
  },
  {
    collapseId: "collapseTwo",
    label: "Monthly Test (Apr)",
    expanded: false,
    rows: [
      { subject: "English (150)", max: 100, min: 35, obtained: 59, status: "Pass" },
      { subject: "Mathematics (214)", max: 100, min: 35, obtained: 69, status: "Pass" },
      { subject: "Physics (120)", max: 100, min: 35, obtained: 79, status: "Pass" },
      { subject: "Chemistry (110)", max: 100, min: 35, obtained: 89, status: "Pass" },
      { subject: "Spanish (140)", max: 100, min: 35, obtained: 99, status: "Pass" },
    ],
    rank: 30,
    total: 500,
    marksObtained: 400,
    percentage: "80.50",
    result: "Pass",
    resultHeadingClass: "fw-normal text-white fs-15",
  },
  {
    collapseId: "collapseThree",
    label: "Monthly Test (Mar)",
    expanded: false,
    rows: [
      { subject: "English (150)", max: 100, min: 35, obtained: 40, status: "Pass" },
      { subject: "Mathematics (214)", max: 100, min: 35, obtained: 45, status: "Pass" },
      { subject: "Physics (120)", max: 100, min: 35, obtained: 30, status: "Pass" },
      { subject: "Chemistry (110)", max: 100, min: 35, obtained: 28, status: "Pass" },
      { subject: "Spanish (140)", max: 100, min: 35, obtained: 50, status: "Pass" },
    ],
    rank: 30,
    total: 500,
    marksObtained: 250,
    percentage: "50",
    result: "Fail",
    resultHeadingClass: "text-white fw-normal fs-15",
  },
  {
    collapseId: "collapseFour",
    label: "Monthly Test (Feb)",
    expanded: false,
    rows: [
      { subject: "English (150)", max: 100, min: 35, obtained: 40, status: "Pass" },
      { subject: "Mathematics (214)", max: 100, min: 35, obtained: 45, status: "Pass" },
      { subject: "Physics (120)", max: 100, min: 35, obtained: 30, status: "Fail" },
      { subject: "Chemistry (110)", max: 100, min: 35, obtained: 28, status: "Fail" },
      { subject: "Spanish (140)", max: 100, min: 35, obtained: 50, status: "Pass" },
    ],
    rank: 30,
    total: 500,
    marksObtained: 250,
    percentage: "50",
    result: "Fail",
    resultHeadingClass: "text-white fs-15 fw-medium",
  },
  {
    collapseId: "collapseFive",
    label: "Monthly Test (Jan)",
    expanded: false,
    rows: [
      { subject: "English (150)", max: 100, min: 35, obtained: 59, status: "Pass" },
      { subject: "Mathematics (214)", max: 100, min: 35, obtained: 69, status: "Pass" },
      { subject: "Physics (120)", max: 100, min: 35, obtained: 79, status: "Pass" },
      { subject: "Chemistry (110)", max: 100, min: 35, obtained: 89, status: "Pass" },
      { subject: "Spanish (140)", max: 100, min: 35, obtained: 99, status: "Pass" },
    ],
    rank: 30,
    total: 500,
    marksObtained: 400,
    percentage: "80.50",
    result: "Pass",
    resultHeadingClass: "fw-normal text-white fs-15",
  },
];

const StudentResult = () => {
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
            {resultStatCards.map((card) => (
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
                      <Link to={routes.studentLeaves} className="nav-link ">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.studentFees} className="nav-link ">
                        <i className="ti ti-report-money me-2" />
                        Fees
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={routes.studentResult}
                        className="nav-link active"
                      >
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
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3">Exams &amp; Results</h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3 me-2">
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
                    <div className="card-body">
                      <div
                        className="accordions-items-seperate"
                        id="accordionExample"
                      >
                        {examResults.map((exam) => (
                          <div className="accordion-item" key={exam.collapseId}>
                            <h2 className="accordion-header">
                              <button
                                className={`accordion-button${exam.expanded ? "" : " collapsed"}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${exam.collapseId}`}
                                aria-expanded={exam.expanded}
                                aria-controls={exam.collapseId}
                              >
                                <span className="avatar avatar-sm bg-success me-2">
                                  <i className="ti ti-checks" />
                                </span>
                                {exam.label}
                              </button>
                            </h2>
                            <div
                              id={exam.collapseId}
                              className={`accordion-collapse collapse${exam.expanded ? " show" : ""}`}
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                {/* Exam Result List */}
                                <div className="table-responsive">
                                  <table className="table">
                                    <thead className="thead-light">
                                      <tr>
                                        <th>Subject</th>
                                        <th>Max Marks</th>
                                        <th>Min Marks</th>
                                        <th>Marks Obtained</th>
                                        <th className="text-end">Result</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {exam.rows.map((row) => (
                                        <tr key={row.subject}>
                                          <td>{row.subject}</td>
                                          <td>{row.max}</td>
                                          <td>{row.min}</td>
                                          <td>{row.obtained}</td>
                                          <td className="text-end">
                                            <span
                                              className={`badge badge-soft-${
                                                row.status === "Pass" ? "success" : "danger"
                                              } d-inline-flex align-items-center`}
                                            >
                                              <i className="ti ti-circle-filled fs-5 me-1" />
                                              {row.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                      <tr>
                                        <td className="bg-dark text-white">
                                          Rank : {exam.rank}
                                        </td>
                                        <td className="bg-dark text-white">
                                          Total : {exam.total}
                                        </td>
                                        <td
                                          className="bg-dark text-white"
                                          colSpan={2}
                                        >
                                          Marks Obtained : {exam.marksObtained}
                                        </td>
                                        <td className="bg-dark text-white text-end">
                                          <div className="d-flex align-items-center justify-content-end">
                                            <span className="me-2">
                                              Percentage : {exam.percentage}
                                            </span>
                                            <h3 className={exam.resultHeadingClass}>
                                              Result :{" "}
                                              <span
                                                className={
                                                  exam.result === "Pass"
                                                    ? "text-success"
                                                    : "text-danger"
                                                }
                                              >
                                                {" "}
                                                {exam.result}
                                              </span>
                                            </h3>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                {/* /Exam Resul List */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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

export default StudentResult;
