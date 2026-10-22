import { profileTabs } from '../data/alumniProfile.data';

export interface ProfileTabsProps {
  active: string;
  onChange: (id: string) => void;
}

const ProfileTabs = ({ active, onChange }: ProfileTabsProps) => (
  <ul className="nav nav-tabs nav-tabs-bottom mb-3 flex-nowrap overflow-x-auto">
    {profileTabs.map((tab) => (
      <li className="nav-item" key={tab.id}>
        <a
          className={`nav-link${tab.id === active ? ' active' : ''}`}
          href={`#${tab.id}`}
          aria-selected={tab.id === active}
          role="tab"
          onClick={(event) => {
            event.preventDefault();
            onChange(tab.id);
          }}
        >
          {tab.label}
        </a>
      </li>
    ))}
  </ul>
);

export default ProfileTabs;
