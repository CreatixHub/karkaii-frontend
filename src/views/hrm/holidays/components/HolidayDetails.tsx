import Offcanvas from '@components/ui/Offcanvas';
import type { Holiday } from '../data/holidays.data';
import { categoryMeta, noticeFile } from '../data/holidays.data';

export interface HolidayDetailsProps {
  holiday: Holiday | null;
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onNotice: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onShare: () => void;
  onArchive: () => void;
  onDownloadNotice: () => void;
}

const HolidayDetails = ({
  holiday,
  onClose,
  onEdit,
  onDuplicate,
  onNotice,
  onDelete,
  onPrint,
  onShare,
  onArchive,
  onDownloadNotice,
}: HolidayDetailsProps) => (
  <Offcanvas
    open={holiday !== null}
    onClose={onClose}
    title={holiday?.name ?? 'Holiday'}
    labelledById="ocName"
    titleAccessory={
      <span className={`badge badge-soft-${holiday ? categoryMeta[holiday.category].tone : 'primary'}`} id="ocBadge">
        {holiday?.type ?? 'Holiday'}
      </span>
    }
    footer={
      <div className="offcanvas-footer border-top p-3">
        <div className="d-flex flex-wrap gap-2 mb-2">
          <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={onEdit}>
            <i className="ti ti-edit me-1" />
            Edit
          </button>
          <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={onDuplicate}>
            <i className="ti ti-copy me-1" />
            Duplicate
          </button>
          <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={onNotice}>
            <i className="ti ti-download me-1" />
            Notice
          </button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={onPrint}>
            <i className="ti ti-printer me-1" />
            Print
          </button>
          <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={onShare}>
            <i className="ti ti-share me-1" />
            Share
          </button>
          <button type="button" className="btn btn-outline-light bg-white btn-sm flex-fill" onClick={onArchive}>
            <i className="ti ti-archive me-1" />
            Archive
          </button>
          <button type="button" className="btn btn-outline-danger btn-sm flex-fill" onClick={onDelete}>
            <i className="ti ti-trash me-1" />
            Delete
          </button>
        </div>
      </div>
    }
  >
    {holiday ? (
      <>
        <div className="row g-3 mb-3">
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-calendar-up me-1" />
              Start Date
            </span>
            <span className="fw-medium" id="ocStart">
              {holiday.start}
            </span>
          </div>
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-calendar-down me-1" />
              End Date
            </span>
            <span className="fw-medium" id="ocEnd">
              {holiday.end}
            </span>
          </div>
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-sum me-1" />
              Duration
            </span>
            <span className="fw-medium" id="ocDuration">
              {holiday.duration}
            </span>
          </div>
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-category me-1" />
              Type
            </span>
            <span className="fw-medium" id="ocType">
              {holiday.type}
            </span>
          </div>
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-school me-1" />
              Applicable Classes
            </span>
            <span className="fw-medium" id="ocClasses">
              {holiday.classes}
            </span>
          </div>
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-map-pin me-1" />
              Applicable Branches
            </span>
            <span className="fw-medium" id="ocBranch">
              {holiday.branch}
            </span>
          </div>
        </div>

        <h6 className="details-heading">
          <i className="ti ti-align-left" />
          Description
        </h6>
        <p className="fs-13 text-muted" id="ocDesc">
          {holiday.description}
        </p>

        <h6 className="details-heading">
          <i className="ti ti-paperclip" />
          Attachments
        </h6>
        <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="avatar avatar-sm bg-danger-transparent text-danger rounded d-inline-flex align-items-center justify-content-center">
              <i className="ti ti-file-type-pdf" />
            </span>
            <div>
              <span className="fw-medium d-block fs-13">{noticeFile.name}</span>
              <span className="fs-12 text-muted">{noticeFile.size}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-icon btn-sm btn-outline-light bg-white"
            aria-label="Download notice"
            onClick={onDownloadNotice}
          >
            <i className="ti ti-download" />
          </button>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-user me-1" />
              Created By
            </span>
            <span className="fw-medium" id="ocBy">
              {holiday.createdBy}
            </span>
          </div>
          <div className="col-6">
            <span className="fs-12 text-muted d-block">
              <i className="ti ti-clock me-1" />
              Created Date
            </span>
            <span className="fw-medium" id="ocCreated">
              {holiday.createdOn}
            </span>
          </div>
        </div>
      </>
    ) : null}
  </Offcanvas>
);

export default HolidayDetails;
