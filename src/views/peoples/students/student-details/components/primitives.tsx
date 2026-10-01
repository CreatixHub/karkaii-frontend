import CountUp from 'react-countup';
import type { ReactNode } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { MetaRow } from '../data/studentProfile.data';

/* -------------------------------- Counter --------------------------------- */

export interface CounterProps {
  value: number;
  revealed: boolean;
  prefix?: string;
  suffix?: string;
}

/** Replaces the template's hand-rolled rAF count-up. */
export const Counter = ({ value, revealed, prefix = '', suffix = '' }: CounterProps) => {
  const decimals = String(value).split('.')[1]?.length ?? 0;

  if (!revealed) {
    return (
      <>
        {prefix}
        {value.toFixed(decimals) === String(value) ? (0).toFixed(decimals) : '0'}
        {suffix}
      </>
    );
  }

  return <CountUp end={value} decimals={decimals} duration={1} prefix={prefix} suffix={suffix} />;
};

/* ------------------------------ Block heading ------------------------------ */

export interface BlockHeadingProps {
  icon: string;
  children: ReactNode;
  className?: string;
  sub?: string;
}

export const BlockHeading = ({ icon, children, className = '', sub }: BlockHeadingProps) => (
  <h6 className={`block-heading ${className}`.trim()}>
    <i className={icon} />
    {children}
    {sub ? <span className="attendance-sub">{sub}</span> : null}
  </h6>
);

/* ------------------------------- Definition -------------------------------- */

export interface MetaListProps {
  rows: MetaRow[];
  /** The template uses `one-col` for the narrow sidebar cards. */
  oneCol?: boolean;
  className?: string;
  children?: ReactNode;
}

export const MetaList = ({ rows, oneCol = false, className = '', children }: MetaListProps) => (
  <div className={`definition-list${oneCol ? ' one-col' : ''} ${className}`.trim()}>
    {rows.map((row) => (
      <div key={row.key}>
        <span className="meta-key">{row.key}</span>
        <span className={`value ${row.valueClass ?? ''}`.trim()}>{row.value}</span>
      </div>
    ))}
    {children}
  </div>
);

/* -------------------------------- Bar group -------------------------------- */

export interface BarGroupItem {
  label: string;
  value: number;
  /** The template alternates `alt` colouring on some columns. */
  alt?: boolean;
}

export interface BarGroupProps {
  bars: BarGroupItem[];
  revealed: boolean;
  className?: string;
}

export const BarGroup = ({ bars, revealed, className = '' }: BarGroupProps) => (
  <div className={`bar-group ${className}`.trim()}>
    {bars.map((bar) => (
      <div className={`b${bar.alt ? ' alt' : ''}`} key={bar.label}>
        <span className="val">{bar.value}%</span>
        <div className="col" style={{ height: revealed ? `${bar.value}%` : 0 }} />
        <span className="cap">{bar.label}</span>
      </div>
    ))}
  </div>
);

/* ------------------------------- Subject bars ------------------------------ */

export interface SubjectMark {
  name: string;
  icon: string;
  iconClass: string;
  grade: string;
  gradeClass: string;
  percent: number;
}

export interface SubjectBarsProps {
  subjects: SubjectMark[];
  revealed: boolean;
  className?: string;
}

export const SubjectBars = ({ subjects, revealed, className = '' }: SubjectBarsProps) => (
  <div className={`subjmarks ${className}`.trim()}>
    {subjects.map((subject) => (
      <div className="profile-subject" key={subject.name}>
        <span className={`avatar avatar-icon avatar-accent-soft ${subject.iconClass}`}>
          <i className={subject.icon} />
        </span>
        <div className="subject-main">
          <div className="subject-top">
            <span className="name">{subject.name}</span>
            <span className={`grade ${subject.gradeClass}`}>{subject.grade}</span>
          </div>
          <div className="histogram-bar-track">
            <div
              className="histogram-bar-fill"
              style={{ width: revealed ? `${subject.percent}%` : 0 }}
            />
          </div>
        </div>
        <div className="subject-pct">{subject.percent}%</div>
      </div>
    ))}
  </div>
);

/* ------------------------------- Profile bar ------------------------------- */

export const ProfileBar = ({ value, revealed }: { value: number; revealed: boolean }) => (
  <div className="profile-bar">
    <span style={{ width: revealed ? `${value}%` : 0 }} />
  </div>
);

/* ------------------------------- Exam table -------------------------------- */

export interface ExamRow {
  name: string;
  date: string;
  score: string;
  outOf: string;
  percent: number;
  grade: string;
  gradeClass: string;
  result: string;
}

export const ExamTable = ({ rows, className = '' }: { rows: ExamRow[]; className?: string }) => (
  <div className={`exam-table ${className}`.trim()}>
    <div className="exam-row head">
      <span>Exam</span>
      <span>Date</span>
      <span>Score</span>
      <span>Grade</span>
      <span>Result</span>
    </div>
    {rows.map((row) => (
      <div className="exam-row" key={`${row.name}-${row.date}`}>
        <span className="ex-name">{row.name}</span>
        <span className="ex-date">{row.date}</span>
        <span className="ex-score">
          {row.score}
          <small>/{row.outOf}</small>
          <i className="score-bar">
            <b style={{ width: `${row.percent}%` }} />
          </i>
        </span>
        <span>
          <em className={`grade ${row.gradeClass}`}>{row.grade}</em>
        </span>
        <span>
          <span className="profile-pill ok">{row.result}</span>
        </span>
      </div>
    ))}
  </div>
);

/* ------------------------------ Profile event ------------------------------ */

export interface ProfileEventProps {
  /** Day/month stamp, or an icon when the template uses an avatar instead. */
  date?: { day: string; month: string };
  icon?: string;
  title: string;
  detail: string;
  tone: string;
  className?: string;
  end?: ReactNode;
}

export const ProfileEvent = ({
  date,
  icon,
  title,
  detail,
  tone,
  className = '',
  end,
}: ProfileEventProps) => (
  <div className={`profile-event ${tone} ${className}`.trim()}>
    {date ? (
      <span className="profile-event-date">
        <b>{date.day}</b>
        <span>{date.month}</span>
      </span>
    ) : (
      <span className="avatar avatar-icon avatar-accent-soft">
        <i className={icon} />
      </span>
    )}
    <div className="profile-event-body">
      <div className="event-title">{title}</div>
      <div className="profile-timeline-time">{detail}</div>
    </div>
    {end}
  </div>
);

/* --------------------------------- Remark ---------------------------------- */

export interface ProfileRemarkProps {
  text: string;
  author: { photo: string; name: string; role: string };
  className?: string;
  end?: ReactNode;
}

export const ProfileRemark = ({ text, author, className = '', end }: ProfileRemarkProps) => (
  <div className={`profile-remark ${className}`.trim()}>
    <span className="remark-quote">
      <i className="ti ti-quote" />
    </span>
    <div className="remark-body">
      <p>{text}</p>
      <div className="remark-by">
        <ImageWithBasePath src={author.photo} alt={author.name} />
        <div>
          <b>{author.name}</b>
          <span>{author.role}</span>
        </div>
        {end}
      </div>
    </div>
  </div>
);

/* --------------------------------- Chips ----------------------------------- */

export interface ChipSetProps {
  chips: { label: string; solid?: boolean; icon?: string }[];
  className?: string;
}

export const ChipSet = ({ chips, className = '' }: ChipSetProps) => (
  <div className={`profile-chip-set ${className}`.trim()}>
    {chips.map((chip) => (
      <span className={`profile-chip${chip.solid ? ' solid' : ''}`} key={chip.label}>
        {chip.icon ? <i className={`${chip.icon} me-1`} /> : null}
        {chip.label}
      </span>
    ))}
  </div>
);
