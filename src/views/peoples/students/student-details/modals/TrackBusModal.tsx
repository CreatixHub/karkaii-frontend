import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ProfileAction } from '../data/studentProfileActions';

const ROUTE_PATH =
  'M36,172 C92,172 98,132 152,132 C198,132 202,94 252,94 C302,94 300,58 366,42';

const BLOCKS = [
  { x: 18, y: 20, w: 60, h: 40 },
  { x: 92, y: 14, w: 48, h: 34 },
  { x: 150, y: 24, w: 70, h: 30 },
  { x: 300, y: 90, w: 70, h: 46 },
  { x: 24, y: 96, w: 70, h: 52 },
  { x: 120, y: 150, w: 80, h: 44 },
  { x: 236, y: 150, w: 70, h: 44 },
  { x: 248, y: 18, w: 44, h: 40 },
];

const STOPS = [
  { id: 'maple', state: 'done', name: 'Maple Street', sub: 'Pickup', time: '07:32 AM', chip: { cls: 'ok', label: 'Boarded' } },
  { id: 'oak', state: 'now', name: 'Oak Avenue', sub: 'En route now', time: '07:38 AM', chip: { cls: 'info', label: 'Approaching' } },
  { id: 'downtown', state: '', name: 'Downtown Cross', sub: 'Upcoming', time: '07:41 AM' },
  { id: 'school', state: '', flag: true, name: 'Karkaii Academy', sub: 'Drop-off', time: '07:45 AM' },
];

const STATS = [
  { id: 'speed', icon: 'ti ti-gauge', value: '32', unit: 'km/h', label: 'Speed' },
  { id: 'onboard', icon: 'ti ti-users', value: '28', unit: '/40', label: 'On board' },
  { id: 'left', icon: 'ti ti-route', value: '3', unit: 'km', label: 'Distance left' },
  { id: 'gps', icon: 'ti ti-satellite', value: 'Strong', label: 'GPS signal', ok: true },
];

export interface TrackBusModalProps {
  open: boolean;
  onClose: () => void;
  onAction: (action: ProfileAction) => void;
}

const TrackBusModal = ({ open, onClose, onAction }: TrackBusModalProps) => {
  if (!open) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-label="Track Bus Live"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content livemap-content">
            <button type="button" className="livemap-close" aria-label="Close" onClick={onClose}>
              <i className="ti ti-x" />
            </button>

            <div className="livemap-map">
              <svg
                className="livemap-svg"
                viewBox="0 0 400 210"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="lmProgGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#4f46e5" />
                    <stop offset="1" stopColor="#7b61ff" />
                  </linearGradient>
                  <radialGradient id="lmVignette" cx="50%" cy="42%" r="75%">
                    <stop offset="55%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#0b1020" stopOpacity="0.22" />
                  </radialGradient>
                  <filter id="lmShadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#4f46e5" floodOpacity="0.5" />
                  </filter>
                </defs>

                <g className="livemap-blocks">
                  {BLOCKS.map((block) => (
                    <rect
                      key={`${block.x}-${block.y}`}
                      x={block.x}
                      y={block.y}
                      width={block.w}
                      height={block.h}
                      rx="7"
                    />
                  ))}
                </g>

                <g className="livemap-grid-lines">
                  <path d="M0,70 H400 M0,140 H400 M100,0 V210 M200,0 V210 M300,0 V210" />
                </g>

                <path className="livemap-road" d={ROUTE_PATH} />
                <path className="livemap-route" d={ROUTE_PATH} />
                <path
                  id="lmProg"
                  className="livemap-prog"
                  d={ROUTE_PATH}
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="100"
                    to="0"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                </path>

                <g className="livemap-node done">
                  <circle cx="36" cy="172" r="5.5" />
                </g>
                <g className="livemap-node done">
                  <circle cx="152" cy="132" r="5.5" />
                </g>
                <g className="livemap-node">
                  <circle cx="252" cy="94" r="5.5" />
                </g>

                <g className="livemap-school">
                  <circle cx="366" cy="42" r="13" />
                  <path
                    transform="translate(357.5,33.5) scale(0.7)"
                    d="M22 9l-10 -4l-10 4l10 4l10 -4v6"
                  />
                  <path
                    transform="translate(357.5,33.5) scale(0.7)"
                    d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"
                  />
                </g>

                <g className="livemap-vehicle" filter="url(#lmShadow)">
                  <circle className="livemap-pulse" r="9" />
                  <circle className="livemap-disc" r="11.5" />
                  <g className="livemap-glyph" transform="translate(-7.9,-7.9) scale(0.66)">
                    <path d="M6 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
                    <path d="M16 5l1.5 7l4.5 0" />
                    <path d="M2 10l15 0" />
                  </g>
                  <animateMotion dur="9s" repeatCount="indefinite" rotate="0">
                    <mpath href="#lmProg" />
                  </animateMotion>
                </g>

                <rect x="0" y="0" width="400" height="210" fill="url(#lmVignette)" />
              </svg>

              <div className="livemap-topbar">
                <span className="livemap-live">
                  <span className="d" />
                  LIVE TRACKING
                </span>
                <span className="livemap-route-tag">
                  <i className="ti ti-bus" />
                  Route 12 · Bus 04
                </span>
              </div>

              <button
                type="button"
                className="livemap-recenter"
                title="Recenter map"
                aria-label="Recenter map"
                onClick={() => onAction('track_bus')}
              >
                <i className="ti ti-focus-2" />
              </button>

              <div className="livemap-driver">
                <span className="avatar avatar-42 avatar-r-11">
                  <ImageWithBasePath src="assets/img/profiles/avatar-12.jpg" alt="Michael Doe" />
                  <i className="avatar-status" />
                </span>
                <div className="livemap-driver-info">
                  <b>Michael Doe</b>
                  <span>
                    <i className="ti ti-star-filled" />
                    4.9 <em>· KA-01-1234</em>
                  </span>
                </div>
                <button
                  type="button"
                  className="livemap-driver-call"
                  aria-label="Call driver"
                  onClick={() => onAction('call')}
                >
                  <i className="ti ti-phone" />
                </button>
              </div>
            </div>

            <div className="livemap-sheet">
              <div className="livemap-hero">
                <div className="livemap-hero-eta">
                  <span className="l">Arriving in</span>
                  <b>
                    4<em>min</em>
                  </b>
                </div>
                <div className="livemap-hero-meta">
                  <span className="livemap-chip ok">
                    <i className="ti ti-clock-check" />
                    On time
                  </span>
                  <span className="livemap-hero-sub">
                    <i className="ti ti-map-pin" />
                    1.2 km away · next stop <strong>Oak Avenue</strong>
                  </span>
                </div>
              </div>

              <div className="livemap-pbar">
                <span style={{ width: '62%' }} />
              </div>
              <div className="livemap-pbar-x">
                <span>
                  <i className="ti ti-current-location" />
                  Maple Street
                </span>
                <span>
                  Karkaii Academy
                  <i className="ti ti-flag-3" />
                </span>
              </div>

              <div className="livemap-stops">
                {STOPS.map((stop) => (
                  <div className={`livemap-stop ${stop.state}`.trim()} key={stop.id}>
                    <span className={`dot${stop.flag ? ' flag' : ''}`}>
                      {stop.state === 'done' ? <i className="ti ti-check" /> : null}
                      {stop.flag ? <i className="ti ti-flag-3" /> : null}
                    </span>
                    <div className="tx">
                      <b>{stop.name}</b>
                      <span>{stop.sub}</span>
                    </div>
                    <span className="tm">{stop.time}</span>
                    {stop.chip ? (
                      <em className={`livemap-chip ${stop.chip.cls}`}>{stop.chip.label}</em>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="livemap-grid">
                {STATS.map((stat) => (
                  <div className="livemap-stat" key={stat.id}>
                    <span className={`ic${stat.ok ? ' ok' : ''}`}>
                      <i className={stat.icon} />
                    </span>
                    <div className="tx">
                      <b>
                        {stat.value}
                        {stat.unit ? <em>{stat.unit}</em> : null}
                      </b>
                      <span>{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer livemap-foot">
              <span className="livemap-updated">
                <i className="ti ti-refresh" />
                Updated just now
              </span>
              <button type="button" className="btn btn-primary" onClick={() => onAction('call')}>
                <i className="ti ti-phone me-1" />
                Call Driver
              </button>
              <button type="button" className="btn btn-light" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default TrackBusModal;
