import type { InsightSegment } from '../data/attendanceAnalytics.data';
import { activityLines, leaveRequestLines, leaveTabs, notificationGroups } from '../data/attendanceAnalytics.data';

const renderSegments = (segments: InsightSegment[]) =>
  segments.map((segment, index) =>
    typeof segment === 'string' ? (
      <span key={index}>{segment}</span>
    ) : (
      <b key={index}>{segment.bold}</b>
    ),
  );

export interface AttendanceOperationsPanelProps {
  leaveTab: 'pending' | 'approved' | 'rejected';
  onLeaveTab: (tab: 'pending' | 'approved' | 'rejected') => void;
  onOpenLeaveModal: () => void;
  onApprove: (name: string) => void;
  onReject: (name: string) => void;
  onFullLog: () => void;
  onMarkAllRead: () => void;
}

const AttendanceOperationsPanel = ({
  leaveTab,
  onLeaveTab,
  onOpenLeaveModal,
  onApprove,
  onReject,
  onFullLog,
  onMarkAllRead,
}: AttendanceOperationsPanelProps) => (
  <>
    <div className="section-bar">
      <div>
        <span className="eyebrow-text">
          <i className="ti ti-inbox" />
          Operations
        </span>
        <h3 className="section-bar-title">Leave &amp; Activity</h3>
      </div>
      <span className="sub-text">Updated a moment ago</span>
    </div>

    <div className="row g-3">
      <div className="col-12 col-xl-4">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-calendar-off" />
              Leave Management
            </b>
            <button type="button" className="toolbar-button toolbar-button-xs" onClick={onOpenLeaveModal}>
              Open
            </button>
          </div>
          <div className="view-toggle-group view-toggle-group-sm mb-3" role="group" aria-label="Leave status">
            {leaveTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`view-toggle${leaveTab === tab.id ? ' is-on' : ''}`}
                aria-pressed={leaveTab === tab.id}
                onClick={() => onLeaveTab(tab.id)}
              >
                {tab.label}
                <span>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="detail-drawer-list">
            {leaveRequestLines.map((line) => (
              <div className="detail-drawer-line" key={line.name}>
                <img src={line.img} alt="" />
                <span>
                  <b>{line.name}</b>
                  <em>{line.when}</em>
                </span>
                <span className="d-flex gap-1">
                  <button
                    type="button"
                    className="toolbar-icon-button is-ok"
                    aria-label="Approve leave"
                    onClick={() => onApprove(line.name)}
                  >
                    <i className="ti ti-check" />
                  </button>
                  <button
                    type="button"
                    className="toolbar-icon-button is-no"
                    aria-label="Reject leave"
                    onClick={() => onReject(line.name)}
                  >
                    <i className="ti ti-x" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-history" />
              Recent Activity
            </b>
            <button type="button" className="toolbar-button toolbar-button-xs" onClick={onFullLog}>
              Full log
            </button>
          </div>
          <div className="action-group">
            {activityLines.map((line) => (
              <div className="action-link" key={line.when + line.badge}>
                <img src={line.img} alt="" />
                <div className="bd">
                  {renderSegments(line.segments)}
                  <em>{line.when}</em>
                </div>
                <span className={`status-chip is-${line.badgeVariant}`}>{line.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="side-panel h-100">
          <div className="side-panel-head">
            <b>
              <i className="ti ti-bell" />
              Smart Notifications
            </b>
            <button type="button" className="toolbar-button toolbar-button-xs" onClick={onMarkAllRead}>
              Mark all read
            </button>
          </div>
          <div className="notification-row">
            {notificationGroups.map((group) => (
              <div className="notification-group" key={group.label}>
                <span className="lbl">{group.label}</span>
                {group.items.map((item) => (
                  <div className={`note-tag is-${item.variant}`} key={item.title}>
                    <span className="ic">
                      <i className={item.icon} />
                    </span>
                    <div className="bd">
                      <b>{item.title}</b>
                      <p>{item.subtitle}</p>
                    </div>
                    <span className={`status-chip is-${item.badgeVariant}`}>{item.badge}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AttendanceOperationsPanel;
