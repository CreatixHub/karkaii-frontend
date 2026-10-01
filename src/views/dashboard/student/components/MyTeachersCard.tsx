import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import { myTeachers, officeHours } from '../data/studentDashboard.data';

export interface MyTeachersCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const MyTeachersCard = ({ onOpenModal }: MyTeachersCardProps) => (
  <div className="card-widget card-widget-body h-100 flow-list d-flex flex-column">
    <WidgetHeader icon="ti ti-users" title="My Teachers" />

    <div className="info-list d-flex flex-column">
      {myTeachers.map((row) => (
        <InfoListRow
          row={row}
          key={row.id}
          endSlot={
            <button
              type="button"
              className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
              title="Message"
              onClick={() => onOpenModal('message')}
            >
              <i className="ti ti-message" />
            </button>
          }
        />
      ))}
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-clock-hour-9 me-1" />
      Office Hours This Week
    </h6>
    <div className="info-list d-flex flex-column">
      {officeHours.map((row) => (
        <InfoListRow row={row} key={row.id} small />
      ))}
    </div>

    <button
      type="button"
      className="action-button action-button-sm mt-3 flow-end d-inline-flex align-items-center text-nowrap text-decoration-none"
      onClick={() => onOpenModal('meeting')}
    >
      <i className="ti ti-calendar-plus" />
      Schedule a Meeting
    </button>
  </div>
);

export default MyTeachersCard;
