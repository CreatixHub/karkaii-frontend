import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ParentModalId } from '../data/parentDashboard.data';
import { mailRows } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface CommunicationHubProps {
  onOpenModal: (modal: ParentModalId) => void;
}

const CommunicationHub = ({ onOpenModal }: CommunicationHubProps) => (
  <>
    <PortalSection icon="ti ti-inbox" eyebrow="Inbox" title="Communication Hub">
      <span className="badge badge-tag accent-danger d-inline-flex align-items-center text-nowrap">
        <i className="ti ti-mail" />2 unread
      </span>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="mail-list d-flex flex-column">
          {mailRows.map((mail) => (
            <div
              key={mail.id}
              className={`mail-row ${mail.accent} d-flex align-items-center`}
              role="button"
              tabIndex={0}
              onClick={() => onOpenModal(mail.modal)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenModal(mail.modal);
                }
              }}
            >
              {mail.avatar ? (
                <span className="mail-avatar position-relative flex-shrink-0">
                  <ImageWithBasePath src={mail.avatar} alt={mail.sender} />
                </span>
              ) : (
                <span
                  className={`avatar avatar-icon avatar-38 avatar-r-11 avatar-glyph-17 avatar-accent-soft ${mail.accent}`}
                >
                  <i className={mail.icon} />
                </span>
              )}

              <div className="mail-row-main">
                <div className="mail-row-top d-flex align-items-center">
                  <b>{mail.sender}</b>
                  {mail.tag ? (
                    <span className={`badge badge-tag ${mail.tag.className} d-inline-flex align-items-center text-nowrap badge-tag-xs`}>
                      {mail.tag.label}
                    </span>
                  ) : null}
                  {mail.attachment ? <i className="ti ti-paperclip mail-attachment" /> : null}
                </div>
                <div className="mail-preview text-nowrap overflow-hidden">{mail.preview}</div>
              </div>

              <div className="mail-row-end text-end flex-shrink-0">
                {mail.unread ? <span className="notification-dot d-inline-block" /> : null}
                <div className="mail-time">{mail.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default CommunicationHub;
