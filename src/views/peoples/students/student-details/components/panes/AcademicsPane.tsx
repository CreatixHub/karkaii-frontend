import {
  BlockHeading,
  ChipSet,
  Counter,
  ExamTable,
  ProfileRemark,
  SubjectBars,
} from '../primitives';
import type { ExamRow, SubjectMark } from '../primitives';

/** Icon classes follow the template, including its `s-sci`/`s-math` pairing. */
export const SUBJECT_MARKS: SubjectMark[] = [
  { name: 'Mathematics', icon: 'ti ti-calculator', iconClass: 's-sci', grade: 'A+', gradeClass: 'a', percent: 94 },
  { name: 'Science', icon: 'ti ti-flask', iconClass: 's-math', grade: 'A', gradeClass: 'a', percent: 91 },
  { name: 'Geography', icon: 'ti ti-map-2', iconClass: 's-geo', grade: 'B+', gradeClass: 'b', percent: 85 },
  { name: 'History', icon: 'ti ti-building-monument', iconClass: 's-his', grade: 'C+', gradeClass: 'c', percent: 72 },
  { name: 'English', icon: 'ti ti-book', iconClass: 's-eng', grade: 'C', gradeClass: 'c', percent: 68 },
];

export const RECENT_EXAMS: ExamRow[] = [
  { name: 'Unit Test III', date: '05 Dec 2024', score: '460', outOf: '500', percent: 92, grade: 'A+', gradeClass: 'a', result: 'Pass' },
  { name: 'Mid Term', date: '18 Oct 2024', score: '428', outOf: '500', percent: 86, grade: 'A', gradeClass: 'a', result: 'Pass' },
  { name: 'Unit Test II', date: '12 Sep 2024', score: '441', outOf: '500', percent: 88, grade: 'A', gradeClass: 'a', result: 'Pass' },
];

const AcademicsPane = ({ revealed }: { revealed: boolean }) => (
  <div id="profile-pane-academics" className="tab-pane-block active" data-pane="academics" role="tabpanel">
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="profile-kpi grad-primary">
          <span className="kpi-bg">
            <i className="ti ti-award" />
          </span>
          <div className="kpi-top">
            <span className="avatar avatar-icon avatar-md avatar-accent-soft">
              <i className="ti ti-award" />
            </span>
            <span className="kpi-tag">Grade A+</span>
          </div>
          <div className="kpi-val">
            <span>
              <Counter value={8.8} revealed={revealed} />
            </span>
            <small>/10</small>
          </div>
          <div className="kpi-lbl">Current GPA</div>
          <div className="kpi-bar">
            <span style={{ width: revealed ? '88%' : 0 }} />
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="profile-kpi grad-gold">
          <span className="kpi-bg">
            <i className="ti ti-trophy" />
          </span>
          <div className="kpi-top">
            <span className="avatar avatar-icon avatar-md avatar-accent-soft">
              <i className="ti ti-medal" />
            </span>
            <span className="kpi-tag">Top 8%</span>
          </div>
          <div className="kpi-val">
            3<small>rd</small>
          </div>
          <div className="kpi-lbl">Class Rank · out of 42 students</div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="profile-kpi">
          <div className="profile-tile-head mb-2">
            <BlockHeading icon="ti ti-trending-up" className="mb-0">
              Performance Trend
            </BlockHeading>
            <span className="attendance-avg">
              <i className="ti ti-arrow-up-right" />
              +6%
            </span>
          </div>
          <div className="profile-trend">
            <svg viewBox="0 0 300 90" preserveAspectRatio="none">
              <path
                className="area"
                d="M0,65 L50,58 L100,60 L150,42 L200,38 L250,26 L300,20 L300,90 L0,90 Z"
              />
              <path className="line" d="M0,65 L50,58 L100,60 L150,42 L200,38 L250,26 L300,20" />
            </svg>
          </div>
          <div className="trend-x">
            {['T1', 'T2', 'T3', 'T4', 'T5', 'Now'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>

    <BlockHeading icon="ti ti-list-numbers">Subject-wise Marks</BlockHeading>
    <SubjectBars subjects={SUBJECT_MARKS} revealed={revealed} className="mb-4" />

    <div className="row g-3 mb-4">
      <div className="col-md-6">
        <div className="profile-tile">
          <BlockHeading icon="ti ti-arrow-up-circle text-success">Top Subjects</BlockHeading>
          <ChipSet
            chips={[
              { label: 'Mathematics', solid: true, icon: 'ti ti-star' },
              { label: 'Science', solid: true, icon: 'ti ti-star' },
            ]}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="profile-tile">
          <BlockHeading icon="ti ti-arrow-down-circle text-danger">Needs Focus</BlockHeading>
          <ChipSet chips={[{ label: 'English' }, { label: 'History' }]} />
        </div>
      </div>
    </div>

    <BlockHeading icon="ti ti-clipboard-check">Recent Exam Results</BlockHeading>
    <ExamTable rows={RECENT_EXAMS} className="mb-4" />

    <ProfileRemark
      text="Janet is a diligent and focused learner with excellent analytical skills. Encouraging more reading will strengthen her language subjects."
      author={{
        photo: 'assets/img/teachers/teacher-01.jpg',
        name: 'Mr. Teresa Susan',
        role: 'Class Teacher · III-A',
      }}
    />
  </div>
);

export default AcademicsPane;
