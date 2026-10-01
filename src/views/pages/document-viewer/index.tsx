import { Fragment, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { TabId } from './data/document.data';
import {
  CAPTION,
  clampZoom,
  CURRENT,
  DETAILS,
  DOCUMENT,
  EXPIRY_NOTE,
  FILE_ICON,
  STATUS,
  statusTint,
  TABS,
  TRAIL,
  trailIcon,
  VERSIONS,
  ZOOM_STEP,
} from './data/document.data';

const routes = all_routes;

/** The preview stands as tall as a page does, whatever it is showing. */
const PREVIEW_FRAME: CSSProperties = { minHeight: '480px' };

/** The zoom control moves the preview, so it does something visible. */
const BASE_ICON = 64;
const previewIcon = (zoom: number): CSSProperties => ({
  fontSize: `${Math.round((BASE_ICON * zoom) / 100)}px`,
});

const DocumentViewer = () => {
  const { toasts, push, dismiss } = useToasts();

  const [tab, setTab] = useState<TabId>('details');
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [notify, setNotify] = useState(true);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Document Viewer</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item">
                    <Link to={routes.studentDocuments}>Documents</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {DOCUMENT.fileName}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <Link to={routes.studentDocuments} className="btn btn-outline-light bg-white me-2 mb-2">
                <i className="ti ti-arrow-left me-1" />
                Back
              </Link>
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push(`${DOCUMENT.fileName} downloaded`)}
              >
                <i className="ti ti-download me-1" />
                Download
              </ActionLink>
              <ActionLink className="btn btn-danger me-2 mb-2" onClick={() => setRejectOpen(true)}>
                <i className="ti ti-x me-1" />
                Reject
              </ActionLink>
              <ActionLink
                className="btn btn-primary mb-2"
                onClick={() => push(`${DOCUMENT.fileName} marked verified`)}
              >
                <i className="ti ti-check me-1" />
                Verify
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            {/* Preview Pane */}
            <div className="col-12 col-xl-8">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-md bg-light-300 rounded me-2">
                      <i className={`${FILE_ICON} text-danger`} />
                    </span>
                    <div>
                      <h4 className="mb-0 fs-15 fw-medium">{DOCUMENT.fileName}</h4>
                      <span className="fs-12 text-muted">{CAPTION}</span>
                    </div>
                  </div>
                  <span
                    className={`badge badge-soft-${statusTint(STATUS)} d-inline-flex align-items-center`}
                  >
                    <i className="ti ti-circle-filled fs-5 me-1" />
                    {STATUS}
                  </span>
                </div>
                <div className="card-body">
                  {/* Expiry ribbon */}
                  <div className="alert alert-info d-flex align-items-center py-2" role="alert">
                    <i className="ti ti-calendar-check me-2" />
                    <span className="fs-13">{EXPIRY_NOTE}</span>
                  </div>

                  {/* PDF / Image preview area */}
                  <div
                    className="doc-preview d-flex flex-column align-items-center justify-content-center border rounded bg-light-300"
                    style={PREVIEW_FRAME}
                  >
                    <i className={`${FILE_ICON} text-danger`} style={previewIcon(zoom)} />
                    <p className="mt-2 mb-3 text-muted">
                      {DOCUMENT.fileType} preview renders here (embed via &lt;iframe&gt; / pdf.js)
                    </p>
                    <div className="d-flex align-items-center">
                      <ActionLink
                        className="btn btn-icon btn-sm btn-outline-light bg-white me-1"
                        ariaLabel="Previous page"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                      >
                        <i className="ti ti-chevron-left" />
                      </ActionLink>
                      <span className="fs-13">
                        Page {page} of {DOCUMENT.pages}
                      </span>
                      <ActionLink
                        className="btn btn-icon btn-sm btn-outline-light bg-white ms-1 me-3"
                        ariaLabel="Next page"
                        onClick={() => setPage((current) => Math.min(DOCUMENT.pages, current + 1))}
                      >
                        <i className="ti ti-chevron-right" />
                      </ActionLink>
                      <ActionLink
                        className="btn btn-icon btn-sm btn-outline-light bg-white me-1"
                        ariaLabel={`Zoom out, currently ${zoom} percent`}
                        onClick={() => setZoom((current) => clampZoom(current - ZOOM_STEP))}
                      >
                        <i className="ti ti-zoom-out" />
                      </ActionLink>
                      <ActionLink
                        className="btn btn-icon btn-sm btn-outline-light bg-white me-1"
                        ariaLabel={`Zoom in, currently ${zoom} percent`}
                        onClick={() => setZoom((current) => clampZoom(current + ZOOM_STEP))}
                      >
                        <i className="ti ti-zoom-in" />
                      </ActionLink>
                      <ActionLink
                        className="btn btn-icon btn-sm btn-outline-light bg-white"
                        ariaLabel="Full screen"
                        onClick={() => push('Full screen preview')}
                      >
                        <i className="ti ti-maximize" />
                      </ActionLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Preview Pane */}

            {/* Info Pane */}
            <div className="col-12 col-xl-4">
              <div className="card">
                <div className="card-body pb-1">
                  <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                    {TABS.map((entry) => (
                      <li className="nav-item" key={entry.id}>
                        <ActionLink
                          className={`nav-link${tab === entry.id ? ' active' : ''}`}
                          onClick={() => setTab(entry.id)}
                        >
                          {entry.label}
                        </ActionLink>
                      </li>
                    ))}
                  </ul>
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade${tab === 'details' ? ' show active' : ''}`}
                      id="doc-details"
                    >
                      <dl className="row mb-0">
                        {DETAILS.map((row, index) => {
                          const spacing = index === DETAILS.length - 1 ? 'mb-0' : 'mb-3';

                          return (
                            <Fragment key={row.label}>
                              <dt className={`col-5 fs-13 text-muted ${spacing}`}>{row.label}</dt>
                              <dd className={`col-7 fs-13 ${spacing}`}>{row.value}</dd>
                            </Fragment>
                          );
                        })}
                      </dl>
                      <hr />
                      <h5 className="mb-2 fs-15">Tags</h5>
                      {DOCUMENT.tags.map((tag) => (
                        <span className="badge badge-light text-dark me-1 mb-1" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className={`tab-pane fade${tab === 'versions' ? ' show active' : ''}`}
                      id="doc-versions"
                    >
                      <ul className="list-unstyled mb-0">
                        {VERSIONS.map((version, index) => {
                          const isCurrent = version.number === CURRENT.number;
                          const last = index === VERSIONS.length - 1;

                          return (
                            <li
                              className={`d-flex align-items-center justify-content-between${
                                last ? '' : ' border-bottom pb-2 mb-2'
                              }`}
                              key={version.id}
                            >
                              <div>
                                <p className="mb-0 text-dark">
                                  v{version.number}
                                  {isCurrent ? (
                                    <span className="badge badge-soft-success ms-1">Current</span>
                                  ) : null}
                                </p>
                                <small className="text-muted">
                                  {version.by} · {version.on}
                                </small>
                              </div>
                              {isCurrent ? (
                                <ActionLink
                                  className="btn btn-icon btn-sm btn-outline-light bg-white"
                                  ariaLabel={`Download v${version.number}`}
                                  onClick={() => push(`v${version.number} downloaded`)}
                                >
                                  <i className="ti ti-download" />
                                </ActionLink>
                              ) : (
                                <div>
                                  <ActionLink
                                    className="btn btn-sm btn-light"
                                    onClick={() => push(`v${version.number} restored`)}
                                  >
                                    Restore
                                  </ActionLink>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div
                      className={`tab-pane fade${tab === 'verify' ? ' show active' : ''}`}
                      id="doc-verify"
                    >
                      <div className="activity-timeline">
                        {TRAIL.map((entry, index) => {
                          const last = index === TRAIL.length - 1;

                          return (
                            <div className="d-flex align-items-start" key={entry.id}>
                              <span
                                className={`avatar avatar-sm bg-${statusTint(entry.status)} flex-shrink-0 rounded-circle me-2 text-white`}
                              >
                                <i className={trailIcon(entry.status)} />
                              </span>
                              <div className={last ? 'ps-3 ms-2' : 'pb-3 border-start ps-3 ms-2'}>
                                <h6 className="mb-1">{entry.status}</h6>
                                <p className="text-muted mb-0 fs-12">
                                  {entry.by ? `${entry.by} · ` : ''}
                                  {entry.at}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Info Pane */}
          </div>
        </div>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Document"
        onSubmit={(event) => {
          event.preventDefault();
          push(
            notify
              ? `${DOCUMENT.fileName} rejected — uploader notified`
              : `${DOCUMENT.fileName} rejected`,
          );
          setRejectOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setRejectOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-danger">
              Reject
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="dv-reason">
            Reason <span className="text-danger">*</span>
          </label>
          <textarea
            rows={4}
            className="form-control"
            placeholder="Enter reason"
            required
            id="dv-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fs-15">Notify Uploader</h5>
            <p className="fs-12 mb-0">Send rejection notice</p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox"
              id="v_reject_notify"
              className="check"
              checked={notify}
              onChange={(event) => setNotify(event.target.checked)}
            />
            <label htmlFor="v_reject_notify" className="checktoggle">
              {' '}
            </label>
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="documentViewerToasts" />
    </>
  );
};

export default DocumentViewer;
