import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import {
  AWARDABLE,
  BADGE_ICONS,
  BADGES,
  DEFAULT_AWARD,
  LEADERBOARD,
  levelOf,
  levelTint,
  points,
  rankTintOf,
  STATS,
} from './data/rewards.data';

const routes = all_routes;

const RewardsGamification = () => {
  const { toasts, push, dismiss } = useToasts();

  const [awardOpen, setAwardOpen] = useState(false);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [award, setAward] = useState({
    student: AWARDABLE[0],
    reason: '',
    points: String(DEFAULT_AWARD),
  });
  const [badge, setBadge] = useState({ name: '', icon: BADGE_ICONS[0], criteria: '' });

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Rewards &amp; Gamification</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active">Rewards</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => setBadgeOpen(true)}
              >
                <i className="ti ti-medal me-1" />
                New Badge
              </ActionLink>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setAwardOpen(true)}>
                <i className="ti ti-plus me-1" />
                Award Points
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <div className="col-12 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0">Leaderboard</h4>
                </div>
                <div className="card-body p-0 py-2">
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th>Rank</th>
                          <th>Student</th>
                          <th>Class</th>
                          <th>Points</th>
                          <th>Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LEADERBOARD.map((student, index) => {
                          const rank = index + 1;
                          const rankTint = rankTintOf(rank);
                          const level = levelOf(student);

                          return (
                            <tr key={student.id}>
                              <td>
                                {rankTint ? (
                                  <span className={`badge ${rankTint}`}>{rank}</span>
                                ) : (
                                  rank
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Link to={routes.studentDetail} className="avatar avatar-sm me-2">
                                    <ImageWithBasePath
                                      src={student.photo}
                                      className="rounded-circle flex-shrink-0"
                                      alt={student.name}
                                    />
                                  </Link>
                                  {student.name}
                                </div>
                              </td>
                              <td>{student.className}</td>
                              <td>{points(student.points)}</td>
                              <td>
                                <span className={`badge badge-soft-${levelTint(level)}`}>
                                  {level}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="mb-0">Badges</h4>
                </div>
                <div className="card-body">
                  <div className="row g-3 text-center">
                    {BADGES.map((entry) => (
                      <div className="col-4" key={entry.id}>
                        <span
                          className={`avatar avatar-lg bg-${entry.tint}-transparent text-${entry.tint} rounded-circle flex-shrink-0 mx-auto mb-1`}
                        >
                          <i className={`${entry.icon} fs-22`} />
                        </span>
                        <p className="fs-12 mb-0">{entry.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={awardOpen}
        onClose={() => setAwardOpen(false)}
        title="Award Points"
        onSubmit={(event) => {
          event.preventDefault();
          push(`${award.points} points awarded to ${award.student}`);
          setAwardOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setAwardOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Award
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="rw-student">
            Student
          </label>
          <select
            className="form-select"
            id="rw-student"
            value={award.student}
            onChange={(event) => setAward((state) => ({ ...state, student: event.target.value }))}
          >
            {AWARDABLE.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rw-reason">
            Reason
          </label>
          <input
            type="text"
            className="form-control"
            id="rw-reason"
            value={award.reason}
            onChange={(event) => setAward((state) => ({ ...state, reason: event.target.value }))}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="rw-points">
            Points
          </label>
          <input
            type="number"
            className="form-control"
            id="rw-points"
            value={award.points}
            onChange={(event) => setAward((state) => ({ ...state, points: event.target.value }))}
          />
        </div>
      </Modal>

      <Modal
        open={badgeOpen}
        onClose={() => setBadgeOpen(false)}
        title="New Badge"
        onSubmit={(event) => {
          event.preventDefault();
          push(`Badge "${badge.name || 'Untitled'}" saved`);
          setBadgeOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setBadgeOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="rw-badge-name">
            Badge Name
          </label>
          <input
            type="text"
            className="form-control"
            id="rw-badge-name"
            value={badge.name}
            onChange={(event) => setBadge((state) => ({ ...state, name: event.target.value }))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rw-badge-icon">
            Icon
          </label>
          <select
            className="form-select"
            id="rw-badge-icon"
            value={badge.icon}
            onChange={(event) => setBadge((state) => ({ ...state, icon: event.target.value }))}
          >
            {BADGE_ICONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="rw-badge-criteria">
            Criteria
          </label>
          <input
            type="text"
            className="form-control"
            id="rw-badge-criteria"
            value={badge.criteria}
            onChange={(event) => setBadge((state) => ({ ...state, criteria: event.target.value }))}
          />
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="rewardsToasts" />
    </>
  );
};

export default RewardsGamification;
