import type { AwardModalId } from '../data/awardsWorkspace.data';
import type { AchievementDetail, DetailPair, DocEntry } from '../data/achievements.data';

export interface AwardDetailPanelProps {
  id: string;
  detail: AchievementDetail;
  onOpenModal: (modal: AwardModalId) => void;
  onOpenPanel: () => void;
}

const Pairs = ({ pairs }: { pairs: DetailPair[] }) => (
  <>
    {pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${
          index === pairs.length - 1 ? 'mb-0' : 'mb-2'
        }`}
        key={pair.label}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">
          {pair.badgeClass ? (
            <span className={`badge ${pair.badgeClass}`}>{pair.value}</span>
          ) : (
            pair.value
          )}
        </span>
      </div>
    ))}
  </>
);

const DocRow = ({ doc, download }: { doc: DocEntry; download?: boolean }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
    <span className={`avatar avatar-sm ${doc.tint} rounded flex-shrink-0`}>
      <i className={doc.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0 text-truncate">{doc.title}</h6>
      <span className="fs-12 text-muted text-truncate d-block">{doc.meta}</span>
    </div>
    {download ? (
      <a
        role="button"
        tabIndex={0}
        className="dt-ib"
        aria-label="Download document"
      >
        <i className="ti ti-download" />
      </a>
    ) : null}
  </div>
);

const AwardDetailPanel = ({ id, detail, onOpenModal, onOpenPanel }: AwardDetailPanelProps) => (
  <tr className="dt-detail">
    <td colSpan={13}>
      <div className="collapse show" id={id}>
        <div className="p-4">
          <div className="row g-4">
            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-user text-primary me-1" />
                Student Profile
              </h6>
              <Pairs pairs={detail.profile} />
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-award text-warning me-1" />
                Achievement Details
              </h6>
              <Pairs pairs={detail.achievement} />
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-calendar-event text-info me-1" />
                Competition &amp; Event
              </h6>
              <Pairs pairs={detail.event} />
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-certificate text-success me-1" />
                Certificates &amp; Attachments
              </h6>
              {detail.certificatesEmpty ? (
                <div className="border rounded p-3 text-center">
                  <span
                    className={`avatar avatar-md ${detail.certificatesEmpty.tint} rounded mb-2`}
                  >
                    <i className={detail.certificatesEmpty.icon} />
                  </span>
                  <p className="fs-13 text-muted mb-0">{detail.certificatesEmpty.title}</p>
                  <span className="fs-12 text-muted">{detail.certificatesEmpty.hint}</span>
                </div>
              ) : (
                detail.certificates.map((doc) => <DocRow doc={doc} key={doc.title} />)
              )}
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-users text-purple me-1" />
                Mentor &amp; Verification
              </h6>
              <Pairs pairs={detail.mentor} />
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-trophy text-danger me-1" />
                Recognition History
              </h6>
              {detail.recognition.map((doc) => (
                <DocRow doc={doc} key={doc.title} />
              ))}
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-message text-secondary me-1" />
                Remarks
              </h6>
              <div className="border rounded p-3">
                <p className="fs-13 text-muted mb-0">{detail.remarks}</p>
              </div>
              {detail.remarkDocs.map((doc) => (
                <DocRow doc={doc} download key={doc.title} />
              ))}
            </div>

            <div className="col-xl-3 col-md-6">
              <h6 className="fs-14 mb-3">
                <i className="ti ti-note text-secondary me-1" />
                Internal Notes
              </h6>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                {detail.noteBadges.map((badge, index) => (
                  <span className={`badge ${badge.className}`} key={`${badge.label}-${index}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
              <p className="fs-13 text-muted mb-3">{detail.noteText}</p>
              <div className="d-flex align-items-center flex-wrap gap-2">
                {detail.actions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className={
                      action.variant === 'primary'
                        ? 'btn btn-primary btn-sm'
                        : 'btn btn-outline-light bg-white btn-sm'
                    }
                    onClick={() =>
                      action.target === 'panel' ? onOpenPanel() : onOpenModal(action.target)
                    }
                  >
                    <i className={`${action.icon} me-1`} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
);

export default AwardDetailPanel;
