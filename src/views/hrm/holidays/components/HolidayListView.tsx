import type { Holiday } from '../data/holidays.data';
import { ACADEMIC_YEAR, categoryMeta, dateRangeLabel, weekdayOf } from '../data/holidays.data';

export interface HolidayListViewProps {
  holidays: Holiday[];
  onOpen: (holiday: Holiday) => void;
  onEdit: (holiday: Holiday) => void;
}

const HolidayListView = ({ holidays, onOpen, onEdit }: HolidayListViewProps) => (
  <div className="card mb-xl-0 hol-list-view">
    <div className="card-header">
      <h5 className="mb-0">
        <i className="ti ti-list me-2 text-primary" />
        Holiday List — {ACADEMIC_YEAR}
      </h5>
    </div>
    <div className="card-body pb-0">
      <div className="table-responsive">
        <table className="table table-nowrap">
          <thead>
            <tr>
              <th>Holiday Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Day</th>
              <th>Duration</th>
              <th>Applicable Branch</th>
              <th>Academic Year</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => {
              const meta = categoryMeta[holiday.category];
              return (
                <tr className="hol-list-row" key={holiday.id}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link p-0 border-0 d-inline-flex align-items-center fw-medium"
                      onClick={() => onOpen(holiday)}
                    >
                      <span
                        className={`avatar avatar-sm bg-${meta.tone}-transparent text-${meta.tone} rounded me-2 d-inline-flex align-items-center justify-content-center`}
                      >
                        <i className={meta.icon} />
                      </span>
                      {holiday.name}
                    </button>
                  </td>
                  <td>
                    <span className={`badge badge-soft-${meta.tone}`}>{holiday.category}</span>
                  </td>
                  <td>{dateRangeLabel(holiday)}</td>
                  <td>{weekdayOf(holiday.start)}</td>
                  <td>{holiday.duration}</td>
                  <td>{holiday.branch}</td>
                  <td>{ACADEMIC_YEAR.replace(/\s/g, '')}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white me-1"
                      aria-label={`View ${holiday.name}`}
                      onClick={() => onOpen(holiday)}
                    >
                      <i className="ti ti-eye" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label={`Edit ${holiday.name}`}
                      onClick={() => onEdit(holiday)}
                    >
                      <i className="ti ti-edit" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default HolidayListView;
