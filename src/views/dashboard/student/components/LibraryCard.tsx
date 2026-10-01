import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import {
  libraryBooks,
  libraryTiles,
  readingChallenge,
  recommendedBook,
  renewableBookId,
} from '../data/studentDashboard.data';

const routes = all_routes;

export interface LibraryCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const LibraryCard = ({ onOpenModal }: LibraryCardProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-books" title="Library">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('library')}
      >
        <i className="ti ti-eye" />
        View
      </button>
    </WidgetHeader>

    <div className="row g-2 mb-3">
      {libraryTiles.map((tile) => (
        <div className="col-4" key={tile.id}>
          <div className={`metric-tile metric-tile-sm ${tile.borderClass}`}>
            <div className="metric-tile-value">{tile.value}</div>
            <div className="metric-tile-label">{tile.label}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="info-list d-flex flex-column">
      {libraryBooks.map((row) => (
        <InfoListRow
          row={row}
          key={row.id}
          endSlot={
            row.id === renewableBookId ? (
              <button
                type="button"
                className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                onClick={() => onOpenModal('renew')}
              >
                Renew
              </button>
            ) : undefined
          }
        />
      ))}
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-target-arrow me-1" />
      Reading Challenge
    </h6>
    <div className="progress-list d-flex flex-column">
      <div className="progress-list-item">
        <div className="top">
          <span>
            <span className={`ic ${readingChallenge.iconClass}`}>
              <i className={readingChallenge.icon} />
            </span>
            {readingChallenge.label}
          </span>
          <b>{readingChallenge.value}</b>
        </div>
        <div className="progress progress-sm">
          <div
            className={`progress-bar ${readingChallenge.barClass}`}
            style={{ width: readingChallenge.width }}
          />
        </div>
      </div>
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-bulb me-1" />
      Recommended for You
    </h6>
    <div className="info-list d-flex flex-column">
      <InfoListRow
        row={recommendedBook}
        small
        endSlot={
          <Link
            to={routes.libraryBooks}
            className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
          >
            Reserve
          </Link>
        }
      />
    </div>
  </div>
);

export default LibraryCard;
