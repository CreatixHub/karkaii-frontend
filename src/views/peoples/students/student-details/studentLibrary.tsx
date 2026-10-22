
import { Link } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

interface LibraryStatCard {
  id: string;
  variant: string;
  icon: string;
  value: string;
  label: string;
  subtitle: string;
  badge: string;
}

const libraryStatCards: LibraryStatCard[] = [
  {
    id: "total-books-issued",
    variant: "stats-primary",
    icon: "ti ti-books",
    value: "12",
    label: "Total Books Issued",
    subtitle: "This term",
    badge: "+5%",
  },
  {
    id: "books-returned",
    variant: "stats-success",
    icon: "ti ti-checks",
    value: "8",
    label: "Books Returned",
    subtitle: "On time",
    badge: "+8%",
  },
  {
    id: "currently-held",
    variant: "stats-warning",
    icon: "ti ti-clock-hour-4",
    value: "3",
    label: "Currently Held",
    subtitle: "Active loans",
    badge: "+0%",
  },
  {
    id: "overdue-books",
    variant: "stats-info",
    icon: "ti ti-alert-triangle",
    value: "1",
    label: "Overdue Books",
    subtitle: "Needs follow-up",
    badge: "-2%",
  },
];

interface LibraryBook {
  id: string;
  image: string;
  title: string;
  takenOn: string;
  lastDate: string;
}

const libraryBooks: LibraryBook[] = [
  {
    id: "small-town-library",
    image: "assets/img/books/book-01.jpg",
    title: "The Small-Town Library",
    takenOn: "25 Jan 2024",
    lastDate: "25 Jan 2024",
  },
  {
    id: "apex-time",
    image: "assets/img/books/book-02.jpg",
    title: "Apex Time",
    takenOn: "22 Jan 2024",
    lastDate: "25 Jan 2024",
  },
  {
    id: "cobalt-guitar",
    image: "assets/img/books/book-03.jpg",
    title: "The Cobalt Guitar",
    takenOn: "30 Jan 2024",
    lastDate: "10 Feb 2024",
  },
  {
    id: "shard-and-the-tomb",
    image: "assets/img/books/book-04.jpg",
    title: "Shard and the Tomb",
    takenOn: "10 Feb 2024",
    lastDate: "20 Feb 2024",
  },
  {
    id: "shard-and-the-tomb-2",
    image: "assets/img/books/book-05.jpg",
    title: "Shard and the Tomb 2",
    takenOn: "12 Feb 2024",
    lastDate: "22 Feb 2024",
  },
  {
    id: "plague-of-fear",
    image: "assets/img/books/book-06.jpg",
    title: "Plague of Fear",
    takenOn: "15 Feb 2024",
    lastDate: "25 Feb 2024",
  },
];

const StudentLibrary = () => {
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
            {libraryStatCards.map((card) => (
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
                        className="nav-link "
                      >
                        <i className="ti ti-bookmark-edit me-2" />
                        Exam &amp; Results
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.studentLibrary} className="nav-link active">
                        <i className="ti ti-books me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5>Library</h5>
                      <div className="dropdown">
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
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        {libraryBooks.map((book) => (
                          <div className="col-xxl-4 col-md-6 d-flex" key={book.id}>
                            {/* Book List */}
                            <div className="card mb-3 flex-fill">
                              <div className="card-body pb-1">
                                <span className="avatar avatar-xl mb-3">
                                  <ImageWithBasePath
                                    src={book.image}
                                    className="img-fluid rounded"
                                    alt="img"
                                  />
                                </span>
                                <h6 className="mb-3">{book.title}</h6>
                                <div className="row">
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <span className="fs-12 mb-1">
                                        Book taken on{" "}
                                      </span>
                                      <p className="text-dark">{book.takenOn}</p>
                                    </div>
                                  </div>
                                  <div className="col-sm-6">
                                    <div className="mb-3">
                                      <span className="fs-12 mb-1">
                                        Last Date
                                      </span>
                                      <p className="text-dark">{book.lastDate}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* /Book List */}
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

export default StudentLibrary;
