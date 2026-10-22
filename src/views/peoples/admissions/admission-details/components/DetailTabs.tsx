import { detailTabs } from '../data/admissionDetails.data';

export interface DetailTabsProps {
  active: string;
  onChange: (id: string) => void;
}

const DetailTabs = ({ active, onChange }: DetailTabsProps) => (
  <div className="card-header detail-tab-strip">
    <ul className="nav nav-pills detail-tabs" role="tablist">
      {detailTabs.map((tab) => (
        <li className="nav-item" role="presentation" key={tab.id}>
          <a
            className={`nav-link${active === tab.id ? ' active' : ''}`}
            href={`#${tab.id}`}
            role="tab"
            id={`${tab.id}-tab`}
            aria-controls={tab.id}
            aria-selected={active === tab.id}
            onClick={(event) => {
              event.preventDefault();
              onChange(tab.id);
            }}
          >
            <i className={`${tab.icon} me-2`} />
            {tab.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default DetailTabs;
