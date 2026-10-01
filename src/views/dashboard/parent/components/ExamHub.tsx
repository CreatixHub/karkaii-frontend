import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { examCountdown, examReadiness } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

const routes = all_routes;
const PIP_COUNT = 5;

export interface ExamHubProps {
  revealed: boolean;
}

const ExamHub = ({ revealed }: ExamHubProps) => (
  <>
    <PortalSection icon="ti ti-hexagonal-prism-plus" eyebrow="Exams" title="Exam Hub">
      <Link
        to={routes.examSchedule}
        className="portal-button portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
      >
        <i className="ti ti-calendar" />
        Schedule
      </Link>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="exam-hero d-flex align-items-center overflow-hidden">
          <div className="portal-count position-relative">
            {examCountdown.map((unit) => (
              <div key={unit.id}>
                <b>{revealed ? <CountUp end={unit.count} duration={1} /> : 0}</b>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
          <div className="exam-hero-body">
            <b>Science — Term Test</b>
            <p>Fri, 25 Jul · Lab 01 · 09:00 AM</p>
          </div>
        </div>

        <div className="mb-2 d-flex align-items-center justify-content-between">
          <span className="portal-heading d-flex align-items-center">
            <i className="ti ti-checklist" />
            Subject Readiness
          </span>
          <span className="badge badge-tag accent-primary d-inline-flex align-items-center text-nowrap">72% ready</span>
        </div>

        <div className="parent-readiness mb-3 d-flex flex-column">
          {examReadiness.map((row) => (
            <div className={`readiness-row ${row.accent} align-items-center`} key={row.id}>
              <span className="readiness-subject">{row.subject}</span>
              <span className="progress-pips d-flex">
                {Array.from({ length: PIP_COUNT }, (_, index) => (
                  <i
                    key={index}
                    className={`progress-pip${index < row.filled ? ' progress-pip-filled' : ''}`}
                  />
                ))}
              </span>
              <span className="readiness-percent">{row.percent}</span>
            </div>
          ))}
        </div>

        <div className="feedback-note feedback-note-accent accent-purple">
          <b>AI revision:</b> Prioritise English essays &amp; Science chapter 4. Previous score
          91% — aim for 94%.
        </div>
      </div>
    </div>
  </>
);

export default ExamHub;
