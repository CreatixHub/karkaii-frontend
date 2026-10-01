import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import {
  CARDS,
  ISSUABLE,
  monthLabel,
  PREVIEW,
  SCHOOL_NAME,
  STATS,
  statusOf,
  statusTint,
  TEMPLATES,
} from './data/cards.data';

const routes = all_routes;

/** The card sits in a fixed frame, the way a printed badge does. */
const CARD_FRAME: CSSProperties = { maxWidth: '340px' };
const LOGO_HEIGHT = 28;
const QR: CSSProperties = { fontSize: '44px' };

const DigitalIdCard = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    student: ISSUABLE[0],
    template: TEMPLATES[0],
    validTill: '',
  });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? CARDS.filter(
          (card) =>
            card.student.toLowerCase().includes(term) ||
            card.admissionNo.toLowerCase().includes(term) ||
            card.className.toLowerCase().includes(term),
        )
      : CARDS;
  }, [search]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Digital ID Card</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active">Digital ID Card</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push(`${CARDS.length} cards queued for printing`)}
              >
                <i className="ti ti-printer me-1" />
                Bulk Print
              </ActionLink>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setOpen(true)}>
                <i className="ti ti-id me-1" />
                Issue Card
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <div className="col-12 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0 fs-16 fw-medium">Card Preview</h4>
                </div>
                <div className="card-body">
                  <div className="border rounded overflow-hidden mx-auto" style={CARD_FRAME}>
                    <div className="bg-primary text-white p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/logo-small.svg"
                          alt={SCHOOL_NAME}
                          height={LOGO_HEIGHT}
                        />
                        <span className="fw-semibold ms-2">{SCHOOL_NAME}</span>
                      </div>
                      <i className="ti ti-school fs-20" />
                    </div>
                    <div className="p-3 text-center">
                      <span className="avatar avatar-xxl mb-2">
                        <ImageWithBasePath
                          src={PREVIEW.photo}
                          className="rounded"
                          alt={PREVIEW.student}
                        />
                      </span>
                      <h5 className="mb-0">{PREVIEW.student}</h5>
                      <p className="text-muted fs-13 mb-2">Student · Class {PREVIEW.className}</p>
                      <dl className="row text-start mb-2">
                        <dt className="col-5 fs-12 text-muted">Adm No</dt>
                        <dd className="col-7 fs-12">{PREVIEW.admissionNo}</dd>
                        <dt className="col-5 fs-12 text-muted">Blood</dt>
                        <dd className="col-7 fs-12">{PREVIEW.bloodGroup}</dd>
                        <dt className="col-5 fs-12 text-muted">Valid Till</dt>
                        <dd className="col-7 fs-12">{monthLabel(PREVIEW.validTill)}</dd>
                      </dl>
                      <div className="d-flex align-items-center justify-content-between border-top pt-2">
                        <span className="fs-11 text-muted">Scan to verify</span>
                        <i className="ti ti-qrcode" style={QR} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white me-2"
                      onClick={() => window.print()}
                    >
                      <i className="ti ti-printer me-1" />
                      Print
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => push(`${PREVIEW.student}'s card downloaded`)}
                    >
                      <i className="ti ti-download me-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                  <h4 className="mb-3">Issued Cards</h4>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="input-icon-start mb-3 me-2 position-relative">
                      <span className="icon-addon">
                        <i className="ti ti-search" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        aria-label="Search issued cards"
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
                          <th>Student</th>
                          <th>Adm No</th>
                          <th>Class</th>
                          <th>Valid Till</th>
                          <th>Status</th>
                          <th className="no-sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((card) => {
                          const status = statusOf(card);

                          return (
                            <tr key={card.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Link to={routes.studentDetail} className="avatar avatar-sm me-2">
                                    <ImageWithBasePath
                                      src={card.photo}
                                      className="rounded-circle flex-shrink-0"
                                      alt={card.student}
                                    />
                                  </Link>
                                  {card.student}
                                </div>
                              </td>
                              <td>{card.admissionNo}</td>
                              <td>{card.className}</td>
                              <td>{monthLabel(card.validTill)}</td>
                              <td>
                                <span
                                  className={`badge badge-soft-${statusTint(status)} d-inline-flex align-items-center`}
                                >
                                  <i className="ti ti-circle-filled fs-5 me-1" />
                                  {status}
                                </span>
                              </td>
                              <td>
                                <ActionLink
                                  className="btn btn-icon btn-sm btn-outline-light bg-white"
                                  ariaLabel={`Print ${card.student}'s card`}
                                  onClick={() => push(`${card.student}'s card sent to the printer`)}
                                >
                                  <i className="ti ti-printer" />
                                </ActionLink>
                              </td>
                            </tr>
                          );
                        })}
                        {visible.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-muted fs-13">
                              No cards match this search.
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
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Issue ID Card"
        onSubmit={(event) => {
          event.preventDefault();
          push(`Card issued to ${form.student}`);
          setOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Issue
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="id-student">
            Student
          </label>
          <select
            className="form-select"
            id="id-student"
            value={form.student}
            onChange={(event) => setForm((state) => ({ ...state, student: event.target.value }))}
          >
            {ISSUABLE.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="id-template">
            Template
          </label>
          <select
            className="form-select"
            id="id-template"
            value={form.template}
            onChange={(event) => setForm((state) => ({ ...state, template: event.target.value }))}
          >
            {TEMPLATES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="id-valid-till">
            Valid Till
          </label>
          <div className="date-pic">
            <input
              type="date"
              className="form-control"
              id="id-valid-till"
              value={form.validTill}
              onChange={(event) => setForm((state) => ({ ...state, validTill: event.target.value }))}
            />
            <span className="cal-icon">
              <i className="ti ti-calendar" />
            </span>
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="digitalIdToasts" />
    </>
  );
};

export default DigitalIdCard;
