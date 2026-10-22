import type { ElementType } from 'react';
import type {
  DetailStat,
  PerformanceDetail,
  PerformanceModalId,
} from '../data/studentPerformance.data';

export interface PerformanceRowDetailProps {
  detail: PerformanceDetail;
  /** True for the first row, which uses the descending heading order. */
  leadingHeadings: boolean;
  onOpenModal: (modal: PerformanceModalId) => void;
  onOpenPanel: () => void;
}

const LEADING_TAGS: ElementType[] = ['h3', 'h4', 'h5', 'h6', 'h6', 'h6', 'h6', 'h6'];
const LEADING_CLASSES = [
  'fs-14 mb-3 fw-medium',
  'fs-14 mb-3 fw-medium',
  'fs-14 mb-3',
  'fs-14 mb-3',
  'fs-14 mb-3',
  'fs-14 mb-3',
  'fs-14 mb-3',
  'fs-14 mb-3',
];

const Stat = ({ stat, last }: { stat: DetailStat; last: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{stat.label}</span>
    <span className="fs-13 fw-medium text-end">
      {stat.badge ? (
        <span className={stat.badge}>
          {stat.badgeIcon ? <i className={`${stat.badgeIcon} me-1`} /> : null}
          {stat.value}
        </span>
      ) : (
        stat.value
      )}
    </span>
  </div>
);

const StatList = ({ stats }: { stats: DetailStat[] }) => (
  <>
    {stats.map((stat, index) => (
      <Stat key={stat.label} stat={stat} last={index === stats.length - 1} />
    ))}
  </>
);

const PerformanceRowDetail = ({
  detail,
  leadingHeadings,
  onOpenModal,
  onOpenPanel,
}: PerformanceRowDetailProps) => {
  const heading = (index: number) => {
    const Tag: ElementType = leadingHeadings ? LEADING_TAGS[index] : 'h6';
    const className = leadingHeadings ? LEADING_CLASSES[index] : 'fs-14 mb-3';
    return { Tag, className };
  };

  const Profile = heading(0);
  const Subjects = heading(1);
  const Grades = heading(2);
  const Attendance = heading(3);
  const Remarks = heading(4);
  const Focus = heading(5);
  const Meetings = heading(6);
  const Notes = heading(7);

  return (
    <div className="p-4">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <Profile.Tag className={Profile.className}>
            <i className="ti ti-user text-primary me-1" />
            Student Profile
          </Profile.Tag>
          <StatList stats={detail.profile} />
        </div>

        <div className="col-xl-3 col-md-6">
          <Subjects.Tag className={Subjects.className}>
            <i className="ti ti-book text-info me-1" />
            Subject-wise Performance
          </Subjects.Tag>
          {detail.subjects.map((subject) => (
            <div
              className="d-flex align-items-center justify-content-between mb-2"
              key={subject.subject}
            >
              <span className="fs-13 text-muted">{subject.subject}</span>
              <span className="fs-13 fw-medium text-end">
                {subject.missingBadge ? (
                  <span className={subject.missingBadge}>{subject.missingLabel}</span>
                ) : (
                  <>
                    {subject.marks} <span className="text-muted">{subject.max}</span>{' '}
                    <span className={subject.gradeBadge}>{subject.grade}</span>
                  </>
                )}
              </span>
            </div>
          ))}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top mb-0">
            <span className="fs-13 text-muted">Best / Weakest</span>
            <span className="fs-13 fw-medium text-end">{detail.bestWeakest}</span>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <Grades.Tag className={Grades.className}>
            <i className="ti ti-badge text-warning me-1" />
            Grade Breakdown
          </Grades.Tag>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            {detail.gradeChips.map((chip) => (
              <span className={chip.badge} key={chip.label}>
                {chip.label}
              </span>
            ))}
          </div>
          <StatList stats={detail.gradeStats} />
        </div>

        <div className="col-xl-3 col-md-6">
          <Attendance.Tag className={Attendance.className}>
            <i className="ti ti-calendar-event text-success me-1" />
            Attendance Summary
          </Attendance.Tag>
          <StatList stats={detail.attendanceStats} />
        </div>

        <div className="col-xl-3 col-md-6">
          <Remarks.Tag className={Remarks.className}>
            <i className="ti ti-writing text-purple me-1" />
            Teacher Remarks
          </Remarks.Tag>
          {detail.remarks.map((remark) => (
            <div className="border rounded p-2 mb-2" key={remark.id}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className={`avatar avatar-sm ${remark.tint} rounded flex-shrink-0`}>
                  <i className="ti ti-message-2" />
                </span>
                <div className="overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{remark.teacher}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{remark.meta}</span>
                </div>
              </div>
              <p className="fs-12 text-muted mb-0">{remark.text}</p>
            </div>
          ))}
        </div>

        <div className="col-xl-3 col-md-6">
          <Focus.Tag className={Focus.className}>
            <i className="ti ti-target text-danger me-1" />
            Strengths &amp; Areas for Improvement
          </Focus.Tag>
          <span className="fs-12 text-muted d-block mb-2">Strengths</span>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            {detail.strengths.map((item) => (
              <span className="badge badge-soft-success" key={item}>
                {item}
              </span>
            ))}
          </div>
          <span className="fs-12 text-muted d-block mb-2">Areas for improvement</span>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            {detail.improvements.map((item) => (
              <span className="badge badge-soft-warning" key={item}>
                {item}
              </span>
            ))}
          </div>
          <StatList stats={detail.focusStats} />
        </div>

        <div className="col-xl-3 col-md-6">
          <Meetings.Tag className={Meetings.className}>
            <i className="ti ti-users-group text-info me-1" />
            Parent Meeting History
          </Meetings.Tag>
          {detail.meetings.map((meeting) => (
            <div className="border rounded p-2 mb-2" key={meeting.id}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className={`avatar avatar-sm ${meeting.tint} rounded flex-shrink-0`}>
                  <i className={meeting.icon} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{meeting.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{meeting.meta}</span>
                </div>
                <span className={meeting.statusBadge}>{meeting.status}</span>
              </div>
              <p className="fs-12 text-muted mb-0">{meeting.text}</p>
            </div>
          ))}
          <div className="d-flex align-items-center justify-content-between mb-0">
            <span className="fs-13 text-muted">Meetings This Term</span>
            <span className="fs-13 fw-medium text-end">{detail.meetingsHeld}</span>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <Notes.Tag className={Notes.className}>
            <i className="ti ti-note text-secondary me-1" />
            Internal Notes
          </Notes.Tag>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            {detail.noteChips.map((chip) => (
              <span className="badge badge-soft-secondary" key={chip}>
                {chip}
              </span>
            ))}
          </div>
          <p className="fs-13 text-muted mb-3">{detail.note}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {detail.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={action.className}
                onClick={() => (action.panel ? onOpenPanel() : action.modal && onOpenModal(action.modal))}
              >
                <i className={`${action.icon} me-1`} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRowDetail;
