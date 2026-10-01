import type { CurriculumCategory, NavFilter } from '../data/curriculum.data';
import { favouriteNav, navFilters, navGroups, recentlyUpdated } from '../data/curriculum.data';

export interface CurriculumSidebarProps {
  category: 'all' | CurriculumCategory;
  onCategory: (id: NavFilter['id']) => void;
  activeNavItem: string;
  onNavItem: (label: string) => void;
  onJump: (id: string) => void;
}

const CurriculumSidebar = ({
  category,
  onCategory,
  activeNavItem,
  onNavItem,
  onJump,
}: CurriculumSidebarProps) => (
  <div className="col-xxl-3 col-lg-3">
    <nav className="curriculum-nav" aria-label="Curriculum navigation">
      <div>
        <h4 className="curriculum-nav-title text-muted mb-2 fs-15 fw-medium">Curriculum Categories</h4>
        <ul className="list-group curriculum-nav-filter">
          {navFilters.map((item) => (
            <li
              key={item.id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                category === item.id ? ' active' : ''
              }`}
              onClick={() => onCategory(item.id)}
            >
              <span>
                <i className={`${item.icon} curriculum-nav-icon me-2`} />
                {item.label}
              </span>
              <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
            </li>
          ))}
        </ul>
      </div>

      {navGroups.map((group) => (
        <div key={group.title}>
          <h6 className="curriculum-nav-title text-muted mb-2">{group.title}</h6>
          <ul className="list-group">
            {group.items.map((item) => (
              <li
                key={item.label}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                  activeNavItem === item.label ? ' active' : ''
                }`}
                onClick={() => onNavItem(item.label)}
              >
                <span>
                  <i className={`${item.icon} curriculum-nav-icon me-2`} />
                  {item.label}
                </span>
                {item.badge ? <span className="badge badge-soft-secondary">{item.badge}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {[recentlyUpdated, favouriteNav].map((group) => (
        <div key={group.title} className={group.title === 'Favorites' ? 'mb-0' : undefined}>
          <h6 className="curriculum-nav-title text-muted mb-2">{group.title}</h6>
          <ul className="list-group">
            {group.items.map((item) => (
              <li
                key={`${group.title}-${item.label}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => item.jumpTo && onJump(item.jumpTo)}
              >
                <span className="text-truncate">
                  <i className={`${item.icon} curriculum-nav-icon me-2`} />
                  {item.label}
                </span>
                {item.meta ? <span className="fs-11 text-muted">{item.meta}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  </div>
);

export default CurriculumSidebar;
