import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import {
  CHANNELS,
  draftFor,
  INTENT_PLACEHOLDER,
  SAMPLE_DRAFT,
  STATS,
  trendOptions,
  trendSeries,
} from './data/assistant.data';

const routes = all_routes;

const AiNotificationAssistant = () => {
  const { toasts, push, dismiss } = useToasts();

  const [intent, setIntent] = useState('');
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [draft, setDraft] = useState(SAMPLE_DRAFT);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Notification Assistant
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.aiCommandCenter}>AI</Link>
                  </li>
                  <li className="breadcrumb-item active">Notification Assistant</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push('Delivery read re-running')}
              >
                <i className="ti ti-refresh me-1" />
                Re-run
              </button>
              <ActionLink
                className="btn btn-primary mb-2"
                onClick={() => push('Delivery read exported')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <div className="col-12 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0 fs-16 fw-medium">Draft with AI</h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="na-intent">
                      Intent
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={INTENT_PLACEHOLDER}
                      id="na-intent"
                      value={intent}
                      onChange={(event) => setIntent(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="na-channel">
                      Channel
                    </label>
                    <select
                      className="form-select"
                      id="na-channel"
                      value={channel}
                      onChange={(event) => setChannel(event.target.value)}
                    >
                      {CHANNELS.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() => setDraft(draftFor(intent, channel))}
                  >
                    <i className="ti ti-sparkles me-1" />
                    Draft Message
                  </button>
                  <div className="bg-light-300 rounded p-2 mt-3 fs-13">{draft}</div>
                </div>
              </div>
            </div>

            <ChartCard
              title="Delivery Trend"
              options={trendOptions}
              series={trendSeries}
              type="line"
              height={300}
              span="col-12 col-xl-7"
            />
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="aiNotificationToasts" />
    </>
  );
};

export default AiNotificationAssistant;
