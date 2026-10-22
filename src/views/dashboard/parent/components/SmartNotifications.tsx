import type { ParentActionId } from '../data/parentDashboard.data';
import { notificationGroups } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface SmartNotificationsProps {
  onAction: (action: ParentActionId) => void;
  /** Dims the feed once the parent has marked everything read. */
  allRead: boolean;
}

const SmartNotifications = ({ onAction, allRead }: SmartNotificationsProps) => (
  <>
    <PortalSection icon="ti ti-bell" eyebrow="Feed" title="Smart Notifications">
      <button
        type="button"
        className="portal-button portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onAction('mark_read')}
      >
        <i className="ti ti-checks" />
        Mark all read
      </button>
    </PortalSection>

    <div className="card card-flush">
      <div className={`card-body${allRead ? ' opacity-75' : ''}`}>
        {notificationGroups.map((group) => (
          <div className="parent-notification-group" key={group.id}>
            <div className="notification-label">{group.label}</div>
            {group.items.map((item) => (
              <div className={`parent-notification-row ${item.accent}`} key={item.id}>
                <span className="avatar avatar-icon avatar-32 avatar-r-9 avatar-glyph-15 avatar-accent-soft">
                  <i className={item.icon} />
                </span>
                <div className="notification-body">
                  <b>{item.title}</b>
                  <p>{item.detail}</p>
                </div>
                <span className="notification-time">{item.time}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </>
);

export default SmartNotifications;
