import { Link } from 'react-router-dom';
import type { RailGroupKey } from '../data/lessonPlanning.data';
import { railGroups } from '../data/lessonPlanning.data';

export interface LessonSidebarProps {
  rail: Partial<Record<RailGroupKey, string>>;
  onSelect: (group: RailGroupKey, item: string, required: boolean) => void;
  /** Keyed `"<group>:<item>"` — only the groups whose entries show a badge are present. */
  counts: Record<string, number>;
}

const LessonSidebar = ({ rail, onSelect, counts }: LessonSidebarProps) => (
  <nav aria-label="Lesson plan navigation">
    {railGroups.map((group) => {
      const Heading = group.headingTag;

      return (
        <div className="mb-3" key={group.key}>
          <Heading className="fs-12 fw-semibold text-uppercase text-muted mb-2">
            {group.title}
          </Heading>
          <div className="list-group">
            {group.items.map((item) => {
              const active = rail[group.key] === item.id;
              const count = counts[`${group.key}:${item.id}`];

              return (
                <Link
                  key={item.id}
                  to="#"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                    active ? ' active' : ''
                  }`}
                  aria-current={active}
                  onClick={() => onSelect(group.key, item.id, group.required)}
                >
                  <span className="text-truncate">
                    <i className={`${item.icon} me-2`} />
                    {item.label}
                  </span>
                  {item.badgeClass ? (
                    <span className={`badge ${item.badgeClass}`}>{count ?? 0}</span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      );
    })}
  </nav>
);

export default LessonSidebar;
