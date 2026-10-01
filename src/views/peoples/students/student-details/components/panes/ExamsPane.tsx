import { useState } from 'react';
import {
  BarGroup,
  BlockHeading,
  Counter,
  ExamTable,
  ProfileEvent,
  ProfileRemark,
  SubjectBars,
} from '../primitives';
import type { ExamRow, SubjectMark } from '../primitives';
import type { ProfileAction } from '../../data/studentProfileActions';

const RESULT_STATS = [
  { id: 'rank', accent: 'accent-info', icon: 'ti ti-medal', value: '3', sup: 'rd', label: 'Class Rank · of 42' },
  { id: 'pass', accent: 'accent-success', icon: 'ti ti-checks', value: '100%', label: 'Pass Rate' },
  { id: 'taken', accent: 'accent-warning', icon: 'ti ti-clipboard-list', value: '8', label: 'Exams Taken' },
];

const UPCOMING = [
  { id: 'math', tone: 'sub-teal', date: { day: '18', month: 'Mar' }, title: 'Mathematics — Final Exam', detail: '09:00 AM · Hall B · 3 hrs · 100 marks', pill: 'info', icon: 'ti ti-hourglass', status: 'In 12 days' },
  { id: 'sci', tone: 'sub-green', date: { day: '21', month: 'Mar' }, title: 'Science — Final Exam', detail: '09:00 AM · Hall B · 3 hrs · 100 marks', pill: 'ok', icon: 'ti ti-ticket', status: 'Hall Ticket' },
  { id: 'eng', tone: 'sub-amber', date: { day: '24', month: 'Mar' }, title: 'English — Final Exam', detail: '09:00 AM · Hall A · 3 hrs · 100 marks', pill: 'warn', icon: 'ti ti-ticket', status: 'Hall Ticket' },
];

const TERM_FILTERS = ['All Terms', 'Term I', 'Term II'];

const EXAM_ROWS: ExamRow[] = [
  { name: 'Unit Test III', date: '05 Dec 2024', score: '460', outOf: '500', percent: 92, grade: 'A+', gradeClass: 'a', result: 'Pass' },
  { name: 'Mid Term', date: '18 Oct 2024', score: '428', outOf: '500', percent: 86, grade: 'A', gradeClass: 'a', result: 'Pass' },
  { name: 'Unit Test II', date: '12 Sep 2024', score: '441', outOf: '500', percent: 88, grade: 'A', gradeClass: 'a', result: 'Pass' },
  { name: 'Unit Test I', date: '02 Aug 2024', score: '399', outOf: '500', percent: 80, grade: 'B+', gradeClass: 'b', result: 'Pass' },
];

const TERM_SUBJECTS: SubjectMark[] = [
  { name: 'Mathematics', icon: 'ti ti-calculator', iconClass: 's-sci', grade: 'A+', gradeClass: 'a', percent: 94 },
  { name: 'Science', icon: 'ti ti-flask', iconClass: 's-math', grade: 'A', gradeClass: 'a', percent: 91 },
  { name: 'Geography', icon: 'ti ti-map-2', iconClass: 's-geo', grade: 'B+', gradeClass: 'b', percent: 85 },
  { name: 'English', icon: 'ti ti-book', iconClass: 's-eng', grade: 'C', gradeClass: 'c', percent: 68 },
];

const TERM_BARS = [
  { label: 'UT-1', value: 74 },
  { label: 'Mid', value: 80 },
  { label: 'UT-2', value: 86, alt: true },
  { label: 'UT-3', value: 89, alt: true },
];

const REPORTS = [
  { id: 'term2', tone: 'sub-teal', title: 'Term II Progress Report — 2024–25', detail: 'Issued 10 Dec 2024 · PDF · 240 KB' },
  { id: 'term1', tone: 'sub-green', title: 'Term I Progress Report — 2024–25', detail: 'Issued 22 Oct 2024 · PDF · 232 KB' },
];

export interface ExamsPaneProps {
  revealed: boolean;
  onAction: (action: ProfileAction) => void;
  onDownloadDoc: (name: string) => void;
}

const ExamsPane = ({ revealed, onAction, onDownloadDoc }: ExamsPaneProps) => {
  // The term chips carry no script in the template; they are real state here.
  const [term, setTerm] = useState(TERM_FILTERS[0]);

  return (
    <div id="profile-pane-exams" className="tab-pane-block active" data-pane="exams" role="tabpanel">
      <div className="profile-tile-head mb-3">
        <BlockHeading icon="ti ti-clipboard-check" className="mb-0" sub="2024–25 · Term II">
          Exams &amp; Results{' '}
        </BlockHeading>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="profile-button profile-button-sm"
            onClick={() => onAction('download_report')}
          >
            <i className="ti ti-download" />
            Report Card
          </button>
          <button
            type="button"
            className="profile-button profile-button-sm"
            onClick={() => onAction('print')}
          >
            <i className="ti ti-printer" />
            Print
          </button>
        </div>
      </div>

      <div className="exam-result mb-4">
        <div className="exam-result-grade">
          <span className="exam-result-letter">A</span>
          <span className="exam-result-band">
            <i className="ti ti-rosette" />
            Distinction
          </span>
        </div>

        <div className="exam-result-mid">
          <div className="exam-result-scoreline">
            <div className="exam-result-pct">
              <span>
                <Counter value={89} revealed={revealed} />
              </span>
              <i>%</i>
            </div>
            <div className="exam-result-cap">
              <b>Overall Score</b>
              <span>Term II · 2024–25 · aggregate of 8 exams</span>
            </div>
            <span className="exam-result-trend">
              <i className="ti ti-trending-up" />
              +6% vs Term I
            </span>
          </div>

          <div className="exam-result-meter" aria-hidden="true">
            <span className="seg f" />
            <span className="seg p" />
            <span className="seg m" />
            <span className="seg d" />
            <i className="exam-result-needle" style={{ left: revealed ? '89%' : 0 }} />
          </div>

          <div className="exam-result-scale">
            <span>Fail</span>
            <span>Pass 40</span>
            <span>Merit 60</span>
            <span>Distinction 85+</span>
          </div>
        </div>

        <div className="exam-result-side">
          {RESULT_STATS.map((stat) => (
            <div className={`exam-result-stat ${stat.accent}`} key={stat.id}>
              <span className="ic">
                <i className={stat.icon} />
              </span>
              <div className="tx">
                <b>
                  {stat.value}
                  {stat.sup ? <sup>{stat.sup}</sup> : null}
                </b>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BlockHeading icon="ti ti-calendar-event" sub="Final Term">
        Upcoming Exams{' '}
      </BlockHeading>
      <div className="mb-4">
        {UPCOMING.map((exam, index) => (
          <ProfileEvent
            key={exam.id}
            tone={exam.tone}
            className={index < UPCOMING.length - 1 ? 'mb-2' : ''}
            date={exam.date}
            title={exam.title}
            detail={exam.detail}
            end={
              <span className={`profile-pill ${exam.pill} ms-auto`}>
                <i className={exam.icon} />
                {exam.status}
              </span>
            }
          />
        ))}
      </div>

      <div className="profile-tile-head mb-2">
        <BlockHeading icon="ti ti-list-numbers" className="mb-0">
          Recent Exam Results
        </BlockHeading>
        <div className="profile-chip-set">
          {TERM_FILTERS.map((option) => (
            <button
              type="button"
              key={option}
              className={`profile-chip${term === option ? ' solid' : ''}`}
              onClick={() => setTerm(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <ExamTable rows={EXAM_ROWS} className="mb-4" />

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-12">
          <BlockHeading icon="ti ti-list-numbers">Subject Grades — Term II</BlockHeading>
          <SubjectBars subjects={TERM_SUBJECTS} revealed={revealed} />
        </div>
        <div className="col-12 col-xl-12">
          <BlockHeading icon="ti ti-chart-histogram">Term-wise Performance</BlockHeading>
          <BarGroup bars={TERM_BARS} revealed={revealed} />
        </div>
      </div>

      <BlockHeading icon="ti ti-file-certificate">Report Cards &amp; Marksheets</BlockHeading>
      <div className="mb-4">
        {REPORTS.map((report, index) => (
          <ProfileEvent
            key={report.id}
            tone={report.tone}
            className={index < REPORTS.length - 1 ? 'mb-2' : ''}
            icon="ti ti-file-text"
            title={report.title}
            detail={report.detail}
            end={
              <button
                type="button"
                className="profile-button profile-button-sm ms-auto"
                onClick={() => onDownloadDoc(report.title)}
              >
                <i className="ti ti-download" />
                Download
              </button>
            }
          />
        ))}
      </div>

      <ProfileRemark
        className="remark-teal"
        text="Consistent upward trend across all four assessments this year. Strong command of Mathematics and Science; a steady focus on reading will lift the language grades further."
        author={{
          photo: 'assets/img/teachers/teacher-01.jpg',
          name: 'Mr. Teresa Susan',
          role: 'Examination In-charge · III-A',
        }}
        end={
          <span className="profile-pill ok ms-auto">
            <i className="ti ti-calendar-check" />
            Reviewed 11 Dec
          </span>
        }
      />
    </div>
  );
};

export default ExamsPane;
