import { Fragment } from 'react';
import RoutineCard from './RoutineCard';
import type { DayId, RoutinePeriod, RowMenuItem } from '../data/classRoutine.data';
import { breakRows, routineDays, timeSlots } from '../data/classRoutine.data';

export interface RoutineGridProps {
  periods: RoutinePeriod[];
  columns: Record<DayId, boolean>;
  blank: boolean;
  selected: string[];
  onToggleSelect: (id: string) => void;
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onAction: (item: RowMenuItem, period: RoutinePeriod) => void;
}

const RoutineGrid = ({
  periods,
  columns,
  blank,
  selected,
  onToggleSelect,
  allChecked,
  someChecked,
  onToggleAll,
  expanded,
  onToggleExpand,
  openMenu,
  onOpenMenu,
  onAction,
}: RoutineGridProps) => {
  const visibleDays = routineDays.filter((day) => columns[day.id]);
  const find = (dayId: DayId, time: string) =>
    periods.find((item) => item.dayId === dayId && item.time === time);

  return (
    <div className={`data-table rt-grid d-none d-lg-block${blank ? ' rt-blank' : ''}`}>
      <table className="table">
        <caption className="visually-hidden">Weekly class routine grid for Class III Section A</caption>
        <thead>
          <tr>
            <th className="rt-time">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all periods"
                checked={allChecked}
                ref={(node) => {
                  if (node) node.indeterminate = someChecked && !allChecked;
                }}
                onChange={(event) => onToggleAll(event.target.checked)}
              />{' '}
              Time
            </th>
            {visibleDays.map((day) => (
              <th key={day.id}>
                <span className="rt-day-h">
                  <i className="ti ti-calendar-event" />
                  <b>{day.label}</b>
                </span>
                <small className="d-block text-normal">
                  {day.date} · {day.periods}
                </small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => {
            const gap = breakRows[slot.pnum];
            return (
              <Fragment key={slot.pnum}>
                {gap ? (
                  <tr>
                    <td className="rt-break" colSpan={visibleDays.length + 1}>
                      <i className={`${gap.icon} me-1`} />
                      {gap.label}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td className="rt-time">
                    <span className="rt-pnum">{slot.pnum}</span> {slot.start.replace(/\s?[AP]M$/, '')}
                    <small>{slot.end}</small>
                  </td>
                  {visibleDays.map((day) => {
                    const item = find(day.id, slot.time);
                    return (
                      <td key={day.id}>
                        {item ? (
                          <RoutineCard
                            period={item}
                            slot={slot}
                            selected={selected.includes(item.id)}
                            onToggleSelect={onToggleSelect}
                            open={expanded.includes(item.id)}
                            onToggleOpen={onToggleExpand}
                            menuOpen={openMenu === item.id}
                            onOpenMenu={onOpenMenu}
                            onAction={onAction}
                          />
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoutineGrid;
