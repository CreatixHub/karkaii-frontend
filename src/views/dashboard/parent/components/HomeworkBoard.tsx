import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { taskBoard } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

const routes = all_routes;

export interface HomeworkBoardProps {
  childName: string;
}

const HomeworkBoard = ({ childName }: HomeworkBoardProps) => (
  <>
    <PortalSection
      icon="ti ti-layout-kanban"
      eyebrow={`${childName} · Homework`}
      title="Assignment Board"
    >
      <Link
        to={routes.classHomeWork}
        className="portal-button portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
      >
        <i className="ti ti-external-link" />
        Open board
      </Link>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="task-board">
          {taskBoard.map((column) => (
            <div className={`portal-column ${column.accent}`} key={column.id}>
              <div className="portal-column-head d-flex align-items-center">
                <span className="portal-column-dot" />
                <b>{column.title}</b>
                <span className="portal-column-count">{column.count}</span>
              </div>

              {column.cards.map((card) => (
                <div className={`task-card ${card.accent}`} key={card.id}>
                  <span className="badge badge-tag badge-tag-sm d-inline-flex align-items-center">
                    <i className={card.subjectIcon} />
                    {card.subject}
                  </span>
                  <b>{card.title}</b>
                  <div className="task-card-meta justify-content-between">
                    {card.meta.map((meta) => (
                      <span
                        key={meta.label}
                        className={meta.grade ? 'task-card-grade' : undefined}
                      >
                        {meta.icon ? <i className={meta.icon} /> : null}
                        {meta.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default HomeworkBoard;
