import type { BehaviorEntry } from '../data/student360.data';

export interface BehaviorPaneProps {
  entries: BehaviorEntry[];
}

const BehaviorPane = ({ entries }: BehaviorPaneProps) => (
  <div className="tab-pane fade show active" id="s360-behavior">
    <h5 className="mb-3">Behavior &amp; Merits</h5>
    <ul className="list-unstyled mb-0">
      {entries.map((entry) => (
        <li className={`d-flex ${entry.last ? 'mb-0' : 'mb-3'}`} key={entry.id}>
          <span
            className={`avatar avatar-sm ${entry.tint} rounded-circle flex-shrink-0 me-2`}
          >
            <i className={entry.icon} />
          </span>
          <div>
            <p className="mb-0 text-dark">{entry.text}</p>
            <small className="text-muted">{entry.meta}</small>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default BehaviorPane;
