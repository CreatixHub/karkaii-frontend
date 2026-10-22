import CountUp from 'react-countup';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type {
  ChildContext,
  ParentActionId,
  ParentModalId,
} from '../data/parentDashboard.data';
import {
  glanceStats,
  parentIdentity,
  quickBarActions,
} from '../data/parentDashboard.data';

export interface CommandBarProps {
  child: ChildContext;
  revealed: boolean;
  onOpenModal: (modal: ParentModalId) => void;
  onAction: (action: ParentActionId) => void;
}

const CommandBar = ({ child, revealed, onOpenModal, onAction }: CommandBarProps) => (
  <div className="portal-command-bar">
    <div className="portal-command-bar-left position-relative overflow-hidden">
      <div className="parent-identity d-flex align-items-center flex-wrap gap-2">
        <div className="parent-identity-avatar flex-shrink-0">
          <ImageWithBasePath src={parentIdentity.avatar} alt="Parent" />
          <span className="parent-identity-verified" title="Verified">
            <i className="ti ti-check" />
          </span>
        </div>
        <div>
          <div className="parent-identity-head">{parentIdentity.head}</div>
          <div className="parent-identity-name">{parentIdentity.name}</div>
          <div className="parent-identity-meta d-flex flex-wrap">
            {parentIdentity.chips.map((chip) => (
              <span className="meta-chip d-inline-flex align-items-center" key={chip.label}>
                <i className={chip.icon} />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="child-context d-flex align-items-center justify-content-between flex-wrap">
        <div className="child-context-name d-flex align-items-center">
          <span className="child-context-avatar flex-shrink-0">
            <ImageWithBasePath src={child.img} alt={child.name} />
            <i className="child-context-status-dot" />
          </span>
          <span className="child-context-id d-flex flex-column">
            <span className="child-context-title">
              Viewing <b>{child.name}</b>
            </span>
            <span className="child-context-subtitle">{child.sub}</span>
          </span>
        </div>

        <div className="child-context-facts d-flex align-items-center flex-wrap">
          {[
            { icon: 'ti ti-user-check', value: child.teacher, label: 'Class Teacher' },
            { icon: 'ti ti-login-2', value: child.checkin, label: 'Gate check-in' },
            { icon: 'ti ti-bus', value: child.bus, label: 'Transport' },
          ].map((fact) => (
            <span className="child-context-fact align-items-center" key={fact.label}>
              <i className={fact.icon} />
              <span>
                <span className="child-context-fact-value">{fact.value}</span>
                <span className="child-context-fact-label">{fact.label}</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="quick-bar d-flex align-items-center flex-wrap">
        {quickBarActions.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`portal-button d-inline-flex align-items-center text-nowrap text-decoration-none${
              item.primary ? ' portal-button-primary' : ''
            }`}
            onClick={() => {
              if (item.modal) onOpenModal(item.modal);
              else if (item.action) onAction(item.action);
            }}
          >
            <i className={item.icon} />
            {item.label}
          </button>
        ))}
      </div>
    </div>

    <div className="glance-strip">
      <div className="portal-status">
        {glanceStats.map((stat) => (
          <div className={`parent-portal-stat ${stat.accent} position-relative overflow-hidden`} key={stat.id}>
            <span className="avatar avatar-icon avatar-28 avatar-r-8 avatar-glyph-15 avatar-accent-soft d-flex mb-2">
              <i className={stat.icon} />
            </span>
            <div className="parent-portal-stat-label">{stat.label}</div>
            <div className="parent-portal-stat-value">
              {stat.count !== undefined ? (
                <span>
                  {revealed ? <CountUp end={stat.count} duration={1} /> : 0}
                </span>
              ) : (
                stat.value
              )}
              {stat.suffix ? <small> {stat.suffix}</small> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="parent-insight-panel position-relative">
        <div className="insight-panel-top d-flex align-items-center">
          <span className="avatar avatar-icon avatar-26 avatar-r-8 avatar-glyph-15 avatar-ai">
            <i className="ti ti-sparkles" />
          </span>
          <b>AI Daily Summary</b>
          <span className="parent-live-flag ms-auto d-inline-flex align-items-center">LIVE</span>
        </div>
        <p>
          <mark>{child.name.split(' ')[0]}</mark> attended all classes today. Math homework is
          due tomorrow. Science exam starts in <mark>3 days</mark>. No pending fee. You have{' '}
          <mark>2 unread</mark> teacher messages.
        </p>
      </div>
    </div>
  </div>
);

export default CommandBar;
