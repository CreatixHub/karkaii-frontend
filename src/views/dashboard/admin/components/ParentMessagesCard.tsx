import { useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { parentMessages } from '../data/adminDashboard.data';

const ParentMessagesCard = () => {
  const [quickReply, setQuickReply] = useState('');

  const handleQuickReply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!quickReply.trim()) return;
    // Wire to a messaging service when the API is connected.
    setQuickReply('');
  };

  const unreadCount = parentMessages.filter((message) => message.unread).length;

  return (
    <div className="card flex-fill mb-4">
      <div className="card-header">
        <span className="stat-caption">Inbox</span>
        <h4 className="card-title mb-0">Recent Parent Messages</h4>
      </div>
      <div className="card-body p-0 d-flex flex-column data-list data-list-inset data-list-hover">
        <div className="data-list-header">
          <span className="fs-13 fw-semibold text-dark">
            Inbox <span className="badge badge-soft-danger ms-1">{unreadCount} unread</span>
          </span>
          <span className="stat-label">
            <i className="ti ti-mail me-1" />
            24 today
          </span>
        </div>

        {parentMessages.map((message) => (
          <div
            className={`data-list-item data-list-item-top${message.unread ? ' is-unread' : ''}`}
            key={message.id}
          >
            <span className="avatar avatar-md flex-shrink-0">
              <ImageWithBasePath
                src={message.avatar}
                className="rounded-circle flex-shrink-0"
                alt={message.name}
              />
              <span
                className={`avatar-status avatar-status-sm avatar-status-inset ${message.presence}`}
              />
            </span>

            <div className="flex-fill overflow-hidden">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="data-list-title text-truncate">
                  {message.name}
                  {message.unread ? <span className="status-dot status-dot-primary ms-1" /> : null}
                </span>
                <span className="stat-label flex-shrink-0 ms-2">
                  <i className="ti ti-clock me-1" />
                  {message.time}
                </span>
              </div>

              <p className="mb-1 fs-13 fw-medium">
                {message.subject}
                <span className={`badge ${message.subjectBadge.className} ms-1`}>
                  {message.subjectBadge.label}
                </span>
              </p>
              <p className="stat-label mb-2 text-truncate">{message.preview}</p>

              <div className="data-list-meta">
                {message.meta.map((meta) => (
                  <span className={`chip ${meta.className}`} key={meta.label}>
                    <i className={meta.icon} />
                    {meta.label}
                  </span>
                ))}
              </div>

              {message.quickReply ? (
                <form className="input-group input-group-sm mt-2" onSubmit={handleQuickReply}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a quick reply…"
                    aria-label="Quick reply"
                    value={quickReply}
                    onChange={(event) => setQuickReply(event.target.value)}
                  />
                  <button type="submit" className="btn btn-primary px-2" aria-label="Send reply">
                    <i className="ti ti-send" />
                  </button>
                </form>
              ) : (
                <div className="hover-actions d-flex gap-2 mt-2">
                  <button type="button" className="btn btn-primary btn-sm">
                    <i className="ti ti-arrow-back-up me-1" />
                    Reply
                  </button>
                  <button type="button" className="btn btn-light btn-sm">
                    <i className="ti ti-eye me-1" />
                    View
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="data-list-footer mt-auto flex-wrap">
          <span className="stat-label">
            <i className="ti ti-clock-hour-4 me-1" />
            Avg. reply 42m
          </span>
          <button type="button" className="btn btn-link link-primary fw-medium fs-13 p-0">
            View all messages <i className="ti ti-arrow-right ms-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentMessagesCard;
