import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import {
  CLASSES,
  durationOf,
  EXAMS,
  passOptions,
  passSeries,
  scoreOptions,
  scoreSeries,
  stateTint,
  STATS,
  SUBJECTS,
} from './data/exams.data';

const routes = all_routes;

const OnlineExamination = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    className: CLASSES[0],
    subject: SUBJECTS[0],
    minutes: '',
    marks: '',
    negative: 'No',
    start: '',
    picking: 'Auto-select 25 (Maths, Medium)',
  });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? EXAMS.filter((row) => row.title.toLowerCase().includes(term)) : EXAMS;
  }, [search]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Online Examination</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Examinations</li>
                  <li className="breadcrumb-item active">Online Exam</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer me-1" />
                Print
              </button>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setOpen(true)}>
                <i className="ti ti-square-rounded-plus me-1" />
                Create Exam
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Score Distribution"
              options={scoreOptions}
              series={scoreSeries}
              type="bar"
            />
            <ChartCard
              title="Pass / Fail"
              options={passOptions}
              series={passSeries}
              type="donut"
              height={290}
              span="col-12 col-xl-4"
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Exams</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search exam..."
                    aria-label="Search exam"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Exam</th>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Questions</th>
                      <th>Duration</th>
                      <th>Window</th>
                      <th>Status</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <ActionLink
                            className="link-primary"
                            onClick={() => push(`${row.title} · ${row.subject}`)}
                          >
                            {row.title}
                          </ActionLink>
                        </td>
                        <td>{row.className}</td>
                        <td>{row.subject}</td>
                        <td>{row.questions}</td>
                        <td>{durationOf(row)}</td>
                        <td>{row.window}</td>
                        <td>
                          <span
                            className={`badge badge-soft-${stateTint(row.state)} d-inline-flex align-items-center`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {row.state}
                          </span>
                        </td>
                        <td>
                          <ActionLink
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            ariaLabel={`View ${row.title}`}
                            onClick={() => push(`${row.title} · ${row.questions} questions`)}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted fs-13">
                          No exams match this search.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Online Exam"
        onSubmit={(event) => {
          event.preventDefault();
          push('Online exam created');
          setOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Create Exam
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="oe-title">
              Exam Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="oe-title"
              value={form.title}
              onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="oe-class">
              Class
            </label>
            <select
              className="form-select"
              id="oe-class"
              value={form.className}
              onChange={(event) => setForm((state) => ({ ...state, className: event.target.value }))}
            >
              {CLASSES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="oe-subject">
              Subject
            </label>
            <select
              className="form-select"
              id="oe-subject"
              value={form.subject}
              onChange={(event) => setForm((state) => ({ ...state, subject: event.target.value }))}
            >
              {SUBJECTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="oe-duration">
              Duration (min)
            </label>
            <input
              type="text"
              className="form-control"
              id="oe-duration"
              value={form.minutes}
              onChange={(event) => setForm((state) => ({ ...state, minutes: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="oe-marks">
              Total Marks
            </label>
            <input
              type="text"
              className="form-control"
              id="oe-marks"
              value={form.marks}
              onChange={(event) => setForm((state) => ({ ...state, marks: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="oe-negative">
              Negative Marking
            </label>
            <select
              className="form-select"
              id="oe-negative"
              value={form.negative}
              onChange={(event) => setForm((state) => ({ ...state, negative: event.target.value }))}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="oe-start">
              Start
            </label>
            <input
              type="text"
              className="form-control"
              id="oe-start"
              value={form.start}
              onChange={(event) => setForm((state) => ({ ...state, start: event.target.value }))}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="oe-questions">
              Add Questions from Question Bank
            </label>
            <select
              className="form-select"
              id="oe-questions"
              value={form.picking}
              onChange={(event) => setForm((state) => ({ ...state, picking: event.target.value }))}
            >
              <option>Auto-select 25 (Maths, Medium)</option>
              <option>Manual pick</option>
            </select>
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="onlineExamToasts" />
    </>
  );
};

export default OnlineExamination;
