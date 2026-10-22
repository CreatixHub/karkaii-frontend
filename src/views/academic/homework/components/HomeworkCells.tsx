import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { ActionLink } from '@components/workspace';
import type {
  HomeworkModalId,
  HomeworkRow,
  LateRow,
  RowMenuItem,
  SubmissionRow,
  TabRow,
  TrackingRow,
} from '../data/homework.data';
import {
  gradingCriteria,
  homeworkAttachments,
  homeworkDescription,
  homeworkInstructions,
  learningObjectives,
  referenceMaterials,
  rowMenuItems,
  submissionSummary,
} from '../data/homework.data';

const routes = all_routes as Record<string, string>;

export interface CellContext {
  /** True when the column is still switched on in the Columns menu. */
  visible: (id: string) => boolean;
  onOpenModal: (modal: HomeworkModalId, row: TabRow) => void;
  onInspect: (row: TrackingRow) => void;
  onAction: (id: string, row: TabRow) => void;
  onMenuAction: (item: RowMenuItem, row: HomeworkRow) => void;
  rowMenuOpen: string | null;
  onRowMenu: (id: string | null) => void;
}

/* -------------------------------------------------------------------------- */
/*                            Tab 1 — Homework cells                          */
/* -------------------------------------------------------------------------- */

export const HomeworkCells = ({ row, ctx }: { row: HomeworkRow; ctx: CellContext }) => (
  <>
    {ctx.visible('homework') ? (
      <td>
        <div className="dt-user">
          <Link
            to="#"
            className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-${row.tone}`}
            onClick={() => ctx.onOpenModal('view', row)}
          >
            <i className={`${row.icon} fs-20`} />
          </Link>
          <div>
            <Link to="#" className="dt-name" onClick={() => ctx.onOpenModal('view', row)}>
              {row.name}
            </Link>
            <div className="dt-sub">
              <span className="link-primary dt-code">{row.id}</span>
              <span className="dt-dot">·</span>
              <span className="dt-subject">{row.subject}</span>
            </div>
            <div className="d-flex flex-wrap gap-1 mt-1">
              <span className={`badge ${row.typeBadge} dt-type`}>
                <i className="ti ti-file-text me-1" />
                {row.type}
              </span>
              <span className={`badge ${row.priorityBadge}`}>
                <i className="ti ti-flag-3 me-1" />
                {row.priority}
              </span>
            </div>
          </div>
        </div>
      </td>
    ) : null}

    {ctx.visible('details') ? (
      <td>
        <ul className="list-unstyled mb-0 fs-12">
          <li className="d-flex align-items-center gap-1 py-1">
            <span className="avatar avatar-xs">
              <ImageWithBasePath
                src={row.avatar}
                className="rounded-circle flex-shrink-0"
                alt={row.teacher}
              />
            </span>
            <Link to={routes.teacherDetails} className="dt-teacher fw-medium text-dark">
              {row.teacher}
            </Link>
          </li>
          <li className="py-1 text-muted">
            <i className="ti ti-school me-1" />
            Class <span className="dt-acls">{row.className}</span>, {row.section}
          </li>
          <li className="py-1 text-muted">
            <i className="ti ti-calendar-plus me-1" />
            Assigned <span className="dt-assigned">{row.assigned}</span>
          </li>
          <li className="py-1">
            <span className="badge badge-soft-danger">
              <i className="ti ti-calendar-due me-1" />
              Due <span className="dt-due">{row.due}</span>
            </span>{' '}
            <span className="badge badge-soft-secondary">
              <i className="ti ti-hourglass me-1" />
              {row.duration}
            </span>
          </li>
        </ul>
      </td>
    ) : null}

    {ctx.visible('submission') ? (
      <td>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fw-semibold fs-13">
            <span className="dt-sub-val">{row.submitted}</span> / {row.total}
          </span>
          <span className="fs-12 text-muted">{row.percent}% submitted</span>
        </div>
        <div className={`meter ${row.meter}`}>
          <span style={{ width: `${row.percent}%` }} />
        </div>
        <div className="d-flex flex-wrap gap-1 mt-2">
          <span className="badge badge-soft-warning">
            <i className="ti ti-hourglass me-1" />
            <span className="dt-pend-val">{row.pending}</span> Pending
          </span>
          <span className="badge badge-soft-danger">
            <i className="ti ti-clock-exclamation me-1" />
            {row.late} Late
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-2 fs-12 text-muted">
          <span>
            <i className="ti ti-paperclip me-1" />
            {row.files} files
          </span>
          <span>
            <i className="ti ti-clock me-1" />
            {row.updated}
          </span>
        </div>
      </td>
    ) : null}

    {ctx.visible('status') ? (
      <td>
        <span className={`dt-pill ${row.pillClass}`}>
          {row.pillIcon ? <i className={row.pillIcon} /> : <span className="dt-pill-dot" />}
          {row.status}
        </span>
      </td>
    ) : null}

    <td>
      <div className="dt-actions">
        <Link
          to="#"
          className="dt-ib"
          title="View Homework"
          aria-label="View Homework"
          onClick={() => ctx.onOpenModal('view', row)}
        >
          <i className="ti ti-eye" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Edit"
          aria-label="Edit"
          onClick={() => ctx.onOpenModal('edit', row)}
        >
          <i className="ti ti-edit" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Submissions"
          aria-label="Submissions"
          onClick={() => ctx.onAction('submissions', row)}
        >
          <i className="ti ti-checklist" />
        </Link>
        <Link to={routes.marksEntry} className="dt-ib" title="Grade" aria-label="Grade">
          <i className="ti ti-writing" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Download"
          aria-label="Download"
          onClick={() => ctx.onAction('download', row)}
        >
          <i className="ti ti-download" />
        </Link>
        <div className="dropdown">
          <ActionLink
            className="dt-ib"
            title="More"
            ariaLabel="More actions"
            ariaExpanded={ctx.rowMenuOpen === row.id}
            onClick={() => ctx.onRowMenu(ctx.rowMenuOpen === row.id ? null : row.id)}
          >
            <i className="ti ti-dots-vertical" />
          </ActionLink>
          <div className={`dropdown-menu dropdown-menu-end${ctx.rowMenuOpen === row.id ? ' show' : ''}`}>
            {rowMenuItems.map((item) => (
              <div key={item.id}>
                {item.divider ? <hr className="dropdown-divider" /> : null}
                {item.route ? (
                  <Link className="dropdown-item" to={routes[item.route]}>
                    <i className={item.icon} />
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
                    to="#"
                    onClick={() => {
                      ctx.onRowMenu(null);
                      ctx.onMenuAction(item, row);
                    }}
                  >
                    <i className={item.icon} />
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </td>
  </>
);

/** The `dt-detail` panel below every Homework row — `homework.html` L1716–1756. */
export const HomeworkDetail = ({ row, ctx }: { row: HomeworkRow; ctx: CellContext }) => (
  <div className="dt-detail-inner">
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h4 className="details-heading fs-15 fw-medium">
          <i className="ti ti-file-description" />
          Homework Description
        </h4>
        <p className="fs-12 text-muted mb-3">{homeworkDescription(row)}</p>
        <h5 className="details-heading fs-15">
          <i className="ti ti-target" />
          Learning Objectives
        </h5>
        <ul className="fs-12 text-muted mb-0 ps-3">
          {learningObjectives(row.subject).map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-list-check" />
          Instructions
        </h6>
        <p className="fs-12 text-muted mb-3">{homeworkInstructions}</p>
        <h6 className="details-heading">
          <i className="ti ti-paperclip" />
          Attached Files
        </h6>
        <div className="d-flex flex-wrap gap-1 mb-3">
          {homeworkAttachments.map((file) => (
            <span className={`badge ${file.badge}`} key={file.label}>
              {file.icon ? <i className={`${file.icon} me-1`} /> : null}
              {file.label}
            </span>
          ))}
        </div>
        <h6 className="details-heading">
          <i className="ti ti-book" />
          Reference Materials
        </h6>
        <p className="fs-12 text-muted mb-0">{referenceMaterials(row)}</p>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-checklist" />
          Submission Summary
        </h6>
        <div className={`meter ${row.meter} mb-1`}>
          <span style={{ width: `${row.percent}%` }} />
        </div>
        <p className="fs-12 text-muted mb-3">{submissionSummary(row)}</p>
        <h6 className="details-heading">
          <i className="ti ti-award" />
          Grading Criteria
        </h6>
        <ul className="list-unstyled fs-12 mb-0">
          {gradingCriteria.map((criterion) => (
            <li
              className="d-flex align-items-center justify-content-between py-1"
              key={criterion.label}
            >
              <span className="text-muted">{criterion.label}</span>
              <span className="fw-medium">{criterion.weight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-notes" />
          Teacher Notes
        </h6>
        <p className="fs-12 text-muted mb-2">{row.notes}</p>
        <div className="d-flex gap-2">
          <Link
            to="#"
            className="btn btn-outline-light bg-white btn-sm flex-fill"
            onClick={() => ctx.onOpenModal('view', row)}
          >
            <i className="ti ti-eye me-1" />
            View
          </Link>
          <Link to={routes.marksEntry} className="btn btn-primary btn-sm flex-fill">
            <i className="ti ti-writing me-1" />
            Grade
          </Link>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                            Tab 2 — Tracking cells                          */
/* -------------------------------------------------------------------------- */

export const TrackingCells = ({ row, ctx }: { row: TrackingRow; ctx: CellContext }) => (
  <>
    {ctx.visible('homework') ? (
      <td>
        <div className="dt-user">
          <span
            className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-${row.tone}`}
          >
            <i className={`${row.icon} fs-20`} />
          </span>
          <div>
            <Link to="#" className="dt-name" onClick={() => ctx.onInspect(row)}>
              {row.name}
            </Link>
            <div className="dt-sub">
              <span className="dt-subject">{row.subject}</span>
              <span className="dt-dot">·</span>
              {row.classLabel}
            </div>
          </div>
        </div>
      </td>
    ) : null}

    {ctx.visible('completion') ? (
      <td>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fw-semibold fs-13">{row.completion}%</span>
        </div>
        <div className={`meter ${row.meter}`}>
          <span style={{ width: `${row.completion}%` }} />
        </div>
      </td>
    ) : null}

    {ctx.visible('submitted') ? (
      <td>
        <span className="fw-semibold">{row.submitted}</span>{' '}
        <span className="fs-12 text-muted">/ {row.total}</span>
      </td>
    ) : null}

    {ctx.visible('pending') ? (
      <td>
        <span className={`badge ${row.pendingBadge}`}>{row.pending}</span>
      </td>
    ) : null}

    {ctx.visible('reviewed') ? (
      <td>
        <span className="badge badge-soft-info">{row.reviewed}</span>
      </td>
    ) : null}

    {ctx.visible('returned') ? (
      <td>
        <span className="badge badge-soft-secondary">{row.returned}</span>
      </td>
    ) : null}

    {ctx.visible('score') ? (
      <td>
        <span className="fw-semibold">{row.score}%</span>
      </td>
    ) : null}

    {ctx.visible('activity') ? (
      <td className="fs-12 text-muted">
        <i className="ti ti-clock me-1" />
        {row.activity}
      </td>
    ) : null}

    <td>
      <div className="dt-actions">
        <Link
          to="#"
          className="dt-ib"
          title="Inspector"
          aria-label="Inspector"
          onClick={() => ctx.onInspect(row)}
        >
          <i className="ti ti-layout-sidebar-right-expand" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Analytics"
          aria-label="Analytics"
          onClick={() => ctx.onOpenModal('analytics', row)}
        >
          <i className="ti ti-chart-histogram" />
        </Link>
        <Link to={routes.marksEntry} className="dt-ib" title="Grade" aria-label="Grade">
          <i className="ti ti-writing" />
        </Link>
      </div>
    </td>
  </>
);

/* -------------------------------------------------------------------------- */
/*                           Tab 3 — Submission cells                         */
/* -------------------------------------------------------------------------- */

export const SubmissionCells = ({ row, ctx }: { row: SubmissionRow; ctx: CellContext }) => (
  <>
    {ctx.visible('student') ? (
      <td>
        <div className="dt-user">
          <Link to={routes.studentDetail} className="dt-avatar">
            <ImageWithBasePath
              src={row.studentAvatar}
              className="rounded-circle flex-shrink-0"
              alt={row.student}
            />
          </Link>
          <div>
            <Link to={routes.studentDetail} className="dt-name">
              {row.student}
            </Link>
            <div className="dt-sub">
              <span className="link-primary">{row.admission}</span>
              <span className="dt-dot">·</span>
              {row.classLabel}
            </div>
          </div>
        </div>
      </td>
    ) : null}

    {ctx.visible('homework') ? <td className="fs-13">{row.homework}</td> : null}

    {ctx.visible('subject') ? (
      <td>
        <span className={`badge ${row.subjectBadge}`}>{row.subject}</span>
      </td>
    ) : null}

    {ctx.visible('submitted') ? (
      <td className="fs-12 text-muted">
        {row.date}
        <span className="d-block">{row.time}</span>
      </td>
    ) : null}

    {ctx.visible('type') ? (
      <td>
        <span className={`badge ${row.typeBadge}`}>
          <i className={`${row.typeIcon} me-1`} />
          {row.type}
        </span>
      </td>
    ) : null}

    {ctx.visible('grade') ? (
      <td>
        <span className={`badge ${row.gradeBadge}`}>{row.grade}</span>
      </td>
    ) : null}

    {ctx.visible('feedback') ? (
      <td>
        <span className={`badge ${row.feedbackBadge}`}>
          {row.feedbackIcon ? <i className={`${row.feedbackIcon} me-1`} /> : null}
          {row.feedback}
        </span>
      </td>
    ) : null}

    {ctx.visible('review') ? (
      <td>
        <span className={`dt-pill ${row.reviewPill}`}>
          <i className={row.reviewIcon} />
          {row.review}
        </span>
      </td>
    ) : null}

    {ctx.visible('teacher') ? (
      <td>
        <div className="d-flex align-items-center gap-2">
          <span className="avatar avatar-xs">
            <ImageWithBasePath
              src={row.teacherAvatar}
              className="rounded-circle flex-shrink-0"
              alt={row.teacher}
            />
          </span>
          <span className="fs-13 fw-medium">{row.teacher}</span>
        </div>
      </td>
    ) : null}

    <td>
      <div className="dt-actions">
        <Link
          to="#"
          className="dt-ib"
          title="View Submission"
          aria-label="View Submission"
          onClick={() => ctx.onOpenModal('submission', row)}
        >
          <i className="ti ti-eye" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Grade"
          aria-label="Grade"
          onClick={() => ctx.onOpenModal('grade', row)}
        >
          <i className="ti ti-writing" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Feedback"
          aria-label="Feedback"
          onClick={() => ctx.onOpenModal('feedback', row)}
        >
          <i className="ti ti-message-dots" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Download"
          aria-label="Download"
          onClick={() => ctx.onAction('download', row)}
        >
          <i className="ti ti-download" />
        </Link>
      </div>
    </td>
  </>
);

/** The collapse panel below each submission — `homework.html` L2935–2940. */
export const SubmissionDetail = ({ row }: { row: SubmissionRow }) => (
  <div className="p-3 bg-light border-top">
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-file-description" />
          Submission Details
        </h6>
        <ul className="list-unstyled fs-12 text-muted mb-0">
          {row.details.map((line) => (
            <li className="py-1" key={line}>
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-message-dots" />
          Teacher Comments
        </h6>
        <p className="fs-12 text-muted mb-0">{row.comments}</p>
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-paperclip" />
          Attachments
        </h6>
        <div className="d-flex flex-wrap gap-1">
          {row.attachments.map((file) => (
            <span className={`badge ${file.badge}`} key={file.label}>
              {file.icon ? <i className={`${file.icon} me-1`} /> : null}
              {file.label}
            </span>
          ))}
        </div>
      </div>
      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-history" />
          Revision History
        </h6>
        <ul className="list-unstyled fs-12 text-muted mb-0">
          {row.history.map((entry) => (
            <li className="py-1" key={entry.text}>
              <i className={`${entry.icon} me-1`} />
              {entry.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                       Tab 4 — Late submission cells                        */
/* -------------------------------------------------------------------------- */

export const LateCells = ({ row, ctx }: { row: LateRow; ctx: CellContext }) => (
  <>
    {ctx.visible('student') ? (
      <td>
        <div className="dt-user">
          <Link to={routes.studentDetail} className="dt-avatar">
            <ImageWithBasePath
              src={row.studentAvatar}
              className="rounded-circle flex-shrink-0"
              alt={row.student}
            />
          </Link>
          <div>
            <Link to={routes.studentDetail} className="dt-name">
              {row.student}
            </Link>
            <div className="dt-sub">{row.classLabel}</div>
          </div>
        </div>
      </td>
    ) : null}

    {ctx.visible('homework') ? (
      <td className="fs-13">
        {row.homework}
        <span className="d-block fs-12 text-muted">{row.subject}</span>
      </td>
    ) : null}

    {ctx.visible('due') ? <td className="fs-12">{row.due}</td> : null}

    {ctx.visible('submitted') ? <td className="fs-12">{row.submittedOn}</td> : null}

    {ctx.visible('delay') ? (
      <td>
        <span className={`badge ${row.delayBadge}`}>
          <i className="ti ti-clock-exclamation me-1" />
          {row.delay}
        </span>
      </td>
    ) : null}

    {ctx.visible('reason') ? <td className="fs-12 text-muted">{row.reason}</td> : null}

    {ctx.visible('approval') ? (
      <td>
        <span className={`dt-pill ${row.approvalPill}`}>
          <i className={row.approvalIcon} />
          {row.approval}
        </span>
      </td>
    ) : null}

    {ctx.visible('deducted') ? (
      <td>
        <span className={`badge ${row.deductedBadge}`}>{row.deducted}</span>
      </td>
    ) : null}

    {ctx.visible('final') ? (
      <td>
        <span className={`badge ${row.finalBadge}`}>{row.final}</span>
      </td>
    ) : null}

    <td>
      <div className="dt-actions">
        <Link
          to="#"
          className="dt-ib"
          title="View Submission"
          aria-label="View Submission"
          onClick={() => ctx.onOpenModal('submission', row)}
        >
          <i className="ti ti-eye" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Grade"
          aria-label="Grade"
          onClick={() => ctx.onOpenModal('grade', row)}
        >
          <i className="ti ti-writing" />
        </Link>
        <Link
          to="#"
          className="dt-ib"
          title="Feedback"
          aria-label="Feedback"
          onClick={() => ctx.onOpenModal('feedback', row)}
        >
          <i className="ti ti-message-dots" />
        </Link>
      </div>
    </td>
  </>
);
