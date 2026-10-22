import { useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import type { ChannelConfig } from './channels.data';
import {
  balanceAfterOf,
  countOf,
  creditsOf,
  isFree,
  recentStateBadge,
  recentStateIcon,
  recipientGroups,
  templateBodies,
  templateOptions,
  unitsOf,
} from './channels.data';

export interface MessageComposerProps {
  config: ChannelConfig;
}

const MessageComposer = ({ config }: MessageComposerProps) => {
  const [group, setGroup] = useState(recipientGroups[0].label);
  const [template, setTemplate] = useState(templateOptions[0]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [scheduleLater, setScheduleLater] = useState(false);
  const [sendDate, setSendDate] = useState('05/08/2026');
  const [sendTime, setSendTime] = useState('07:30');

  const { toasts, push, dismiss } = useToasts();

  const recipients = countOf(group);
  const units = unitsOf(body, config);
  const credits = creditsOf(body, group, config);
  const balanceAfter = balanceAfterOf(body, group, config);

  const summary = useMemo(
    () => [
      { label: 'Recipients', value: recipients.toLocaleString(), note: group },
      {
        label: 'Estimated Credits',
        value: isFree(config) ? 'None' : credits.toLocaleString(),
        note: isFree(config)
          ? 'This channel is not billed'
          : `${units} ${config.unitName}${units === 1 ? '' : 's'} each`,
      },
      {
        label: isFree(config) ? 'Delivery' : 'Balance After Send',
        value: isFree(config) ? 'Immediate' : balanceAfter.toLocaleString(),
        note: isFree(config)
          ? 'No wallet to draw on'
          : `of ${config.balance.toLocaleString()} available`,
      },
      { label: 'Channel', value: config.channel, note: `${config.unitSize} characters a ${config.unitName}` },
    ],
    [balanceAfter, config, credits, group, recipients, units],
  );

  const applyTemplate = (name: string) => {
    setTemplate(name);
    const found = templateBodies[name];
    if (!found) return;
    setSubject(found.subject);
    setBody(found.body);
  };

  const discard = () => {
    setSubject('');
    setBody('');
    setTemplate(templateOptions[0]);
    setScheduleLater(false);
    push('Draft discarded');
  };

  const send = () => {
    if (!body.trim()) {
      push('Write a message before sending', 'warning');
      return;
    }
    push(
      scheduleLater
        ? `Queued for ${recipients.toLocaleString()} recipients on ${sendDate} at ${sendTime}`
        : isFree(config)
          ? `Sent to ${recipients.toLocaleString()} recipients`
          : `Sent to ${recipients.toLocaleString()} recipients · ${credits.toLocaleString()} credits used`,
    );
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title={config.title}
            section="Communication"
            dashboardTo={all_routes.adminDashboard}
            actions={
              <div className="mb-2">
                <ActionLink
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={discard}
                >
                  <i className="ti ti-refresh me-1" />Refresh
                </ActionLink>
              </div>
            }
          />

          <div className="row g-4">
            <div className="col-12 col-xl-8">
              <div className="card mb-0">
                <div className="card-header d-flex align-items-center gap-2">
                  <span className={`avatar avatar-sm bg-${config.tint}-transparent text-${config.tint} rounded flex-shrink-0`}>
                    <i className={config.icon} />
                  </span>
                  <div>
                    <h5 className="fs-14 mb-0">Compose {config.title}</h5>
                    <span className="fs-12 text-muted">{config.note}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor={`cmp-group-${config.id}`}>
                        Recipient Group
                      </label>
                      <select
                        className="form-select" id={`cmp-group-${config.id}`}
                        value={group} onChange={(event) => setGroup(event.target.value)}
                      >
                        {recipientGroups.map((entry) => (
                          <option key={entry.label} value={entry.label}>
                            {entry.label} · {entry.count.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor={`cmp-tpl-${config.id}`}>Template</label>
                      <select
                        className="form-select" id={`cmp-tpl-${config.id}`}
                        value={template} onChange={(event) => applyTemplate(event.target.value)}
                      >
                        {templateOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </div>

                    {config.hasSubject ? (
                      <div className="col-12">
                        <label className="form-label" htmlFor={`cmp-subject-${config.id}`}>
                          {config.subjectLabel}
                        </label>
                        <input
                          type="text" className="form-control" id={`cmp-subject-${config.id}`}
                          placeholder="Enter a subject"
                          value={subject} onChange={(event) => setSubject(event.target.value)}
                        />
                      </div>
                    ) : null}

                    <div className="col-12">
                      <label className="form-label" htmlFor={`cmp-body-${config.id}`}>Message</label>
                      <textarea
                        className="form-control" id={`cmp-body-${config.id}`} rows={6}
                        placeholder="Type your message..."
                        value={body} onChange={(event) => setBody(event.target.value)}
                      />
                      {/* Counted against this channel's own unit size. */}
                      <span className="fs-12 text-muted">
                        {body.length} characters · {units} {config.unitName}
                        {units === 1 ? '' : 's'}
                        {isFree(config)
                          ? ''
                          : ` · ${credits.toLocaleString()} credits for ${recipients.toLocaleString()} recipients`}
                      </span>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-center justify-content-between border rounded p-2">
                        <div>
                          <h6 className="fs-13 mb-0">Schedule for later</h6>
                          <span className="fs-12 text-muted">
                            Send this message at a specific date and time
                          </span>
                        </div>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input" type="checkbox" role="switch"
                            id={`cmp-schedule-${config.id}`}
                            checked={scheduleLater}
                            onChange={(event) => setScheduleLater(event.target.checked)}
                          />
                          <label
                            className="form-check-label visually-hidden"
                            htmlFor={`cmp-schedule-${config.id}`}
                          >
                            Schedule for later
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* The date and time only matter once it is being scheduled. */}
                    {scheduleLater ? (
                      <>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor={`cmp-date-${config.id}`}>
                            Send date
                          </label>
                          <input
                            type="text" className="form-control" id={`cmp-date-${config.id}`}
                            value={sendDate} onChange={(event) => setSendDate(event.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor={`cmp-time-${config.id}`}>
                            Send time
                          </label>
                          <input
                            type="time" className="form-control" id={`cmp-time-${config.id}`}
                            value={sendTime} onChange={(event) => setSendTime(event.target.value)}
                          />
                        </div>
                      </>
                    ) : null}

                    <div className="col-12 d-flex align-items-center justify-content-end gap-2">
                      <button type="button" className="btn btn-light" onClick={discard}>Discard</button>
                      <button type="button" className="btn btn-primary" onClick={send}>
                        <i className={`${scheduleLater ? 'ti ti-clock-play' : 'ti ti-send'} me-1`} />
                        {scheduleLater ? 'Schedule' : 'Send Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="fs-14 mb-0">Delivery Summary</h5>
                </div>
                <div className="card-body">
                  {summary.map((entry, index) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === summary.length - 1 ? 'mb-0' : 'mb-3'}`}
                      key={entry.label}
                    >
                      <span className="fs-13 text-muted">
                        {entry.label}
                        <span className="d-block fs-12">{entry.note}</span>
                      </span>
                      <span className="fs-15 fw-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card mb-0">
                <div className="card-header">
                  <h5 className="fs-14 mb-0">Recent Sends</h5>
                </div>
                <div className="card-body">
                  {config.recentSends.map((entry, index, all) => (
                    <div
                      className={`d-flex align-items-center gap-2 ${index === all.length - 1 ? 'mb-0' : 'mb-3'}`}
                      key={entry.title}
                    >
                      <span className={`avatar avatar-sm bg-${entry.state === 'Sent' ? 'success' : 'warning'}-transparent text-${entry.state === 'Sent' ? 'success' : 'warning'} rounded-circle flex-shrink-0`}>
                        <i className={recentStateIcon[entry.state]} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">{entry.note}</span>
                      </div>
                      <span className={recentStateBadge[entry.state]}>{entry.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id={`${config.id}Toasts`} />
    </>
  );
};

export default MessageComposer;
