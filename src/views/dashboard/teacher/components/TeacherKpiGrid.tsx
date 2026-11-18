import { useEffect, useState } from 'react';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import { kpiStats } from '../data/teacherDashboard.data';
import { pendingAssignments, todayTotals } from '../data/summaryCalc';
import { useTeacherSummary } from '../hooks/useTeacherSummary';

export interface TeacherKpiGridProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const DASH = '—';

const TeacherKpiGrid = ({ onOpenModal }: TeacherKpiGridProps) => {
  const { timetable, homework } = useTeacherSummary();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const totals = timetable ? todayTotals(timetable, now) : null;

  // Cards with a real source show real numbers; the rest show a dash (no invented figures or trends).
  const valueFor = (label: string): { value: string; real: boolean } => {
    const l = label.toLowerCase();
    if (l.includes('today') && l.includes('class')) {
      return totals ? { value: String(totals.periods), real: true } : { value: DASH, real: false };
    }
    if (l.includes('assignment')) {
      return homework ? { value: String(pendingAssignments(homework, now)), real: true } : { value: DASH, real: false };
    }
    if (l.includes('hour')) {
      return totals && totals.minutes !== null
        ? { value: (totals.minutes / 60).toFixed(1), real: true }
        : { value: DASH, real: false };
    }
    return { value: DASH, real: false };
  };

  return (
    <div className="stats-grid mb-3">
      {kpiStats.map((stat) => {
        const { value, real } = valueFor(stat.label);
        return (
          <button
            type="button"
            key={stat.id}
            className="card-stat position-relative overflow-hidden text-start"
            aria-label={stat.label}
            onClick={() => onOpenModal(stat.modal)}
          >
            <div className="card-stat-header d-flex align-items-center">
              <span className={`avatar avatar-icon ${stat.iconClass}`}>
                <i className={stat.icon} />
              </span>
            </div>
            <div className="card-stat-value">
              {value}
              {real && stat.valueSuffix ? <small>{stat.valueSuffix}</small> : null}
            </div>
            <div className="card-stat-label">{stat.label}</div>
          </button>
        );
      })}
    </div>
  );
};

export default TeacherKpiGrid;