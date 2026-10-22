import type { RoleItem } from '../../data/alumniProfile.data';

export interface RolePaneProps {
  title: string;
  items: RoleItem[];
}

const RolePane = ({ title, items }: RolePaneProps) => (
  <div>
    <h5 className="mb-3">{title}</h5>
    {items.map((item, index) => (
      <div className={`border rounded p-3${index < items.length - 1 ? ' mb-3' : ' mb-0'}`} key={item.title}>
        <div className="d-flex align-items-center">
          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
            <i className={item.icon} />
          </span>
          <div>
            <h6 className="mb-0">{item.title}</h6>
            <span className="fs-12 text-muted">{item.org}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default RolePane;
