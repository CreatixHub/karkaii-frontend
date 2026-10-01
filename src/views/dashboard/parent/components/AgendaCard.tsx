import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { agendaGroups } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

const routes = all_routes;

const AgendaCard = () => (
  <>
    <PortalSection icon="ti ti-calendar" eyebrow="Agenda" title="What's Coming Up">
      <Link
        to={routes.calendar}
        className="portal-button portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
      >
        <i className="ti ti-calendar" />
        Calendar
      </Link>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        {agendaGroups.map((group) => (
          <div className="agenda-group" key={group.id}>
            <div className="agenda-label">{group.label}</div>
            {group.items.map((item) => (
              <div className={`agenda-item ${item.accent}`} key={item.id}>
                <span className="agenda-item-time">{item.time}</span>
                <span className="agenda-item-bar" />
                <div className="agenda-item-body">
                  <b>{item.title}</b>
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </>
);

export default AgendaCard;
