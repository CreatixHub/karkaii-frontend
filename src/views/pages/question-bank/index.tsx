import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StatStrip from '../shared/StatStrip';
import ChartCard from '../shared/ChartCard';
import type { Difficulty } from './data/questions.data';
import {
  DIFFICULTIES,
  difficultyOptions,
  difficultySeries,
  difficultyTint,
  QUESTIONS,
  STATS,
  SUBJECTS,
  subjectOptions,
  subjectSeries,
  TYPES,
} from './data/questions.data';

const routes = all_routes;

const QuestionBank = () => {
  const { toasts, push, dismiss } = useToasts();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    subject: SUBJECTS[0],
    type: TYPES[0],
    difficulty: DIFFICULTIES[0] as string,
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    answer: '',
    tags: '',
  });

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return QUESTIONS.filter((row) => {
      if (term && !row.text.toLowerCase().includes(term)) return false;
      if (difficulty !== 'All' && row.difficulty !== difficulty) return false;
      return true;
    });
  }, [search, difficulty]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Question Bank</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Examinations</li>
                  <li className="breadcrumb-item active">Question Bank</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <ActionLink
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => push('Import a question set from a spreadsheet')}
              >
                <i className="ti ti-upload me-1" />
                Import
              </ActionLink>
              <ActionLink className="btn btn-primary mb-2" onClick={() => setOpen(true)}>
                <i className="ti ti-square-rounded-plus me-1" />
                Add Question
              </ActionLink>
            </div>
          </div>

          <StatStrip stats={STATS} />

          <div className="row">
            <ChartCard
              title="Difficulty Mix"
              options={difficultyOptions}
              series={difficultySeries}
              type="donut"
              height={280}
              span="col-12 col-xl-4"
            />
            <ChartCard
              title="Questions by Subject"
              options={subjectOptions}
              series={subjectSeries}
              type="bar"
              height={290}
            />
          </div>

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Questions</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search question..."
                    aria-label="Search question"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className={`dropdown mb-3${menuOpen ? ' show' : ''}`}>
                  <ActionLink
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <i className="ti ti-filter me-2" />
                    {difficulty === 'All' ? 'Difficulty' : difficulty}
                  </ActionLink>
                  <ul className={`dropdown-menu p-3${menuOpen ? ' show' : ''}`}>
                    {(['All', ...DIFFICULTIES] as (Difficulty | 'All')[]).map((option) => (
                      <li key={option}>
                        <ActionLink
                          className={`dropdown-item rounded-1${difficulty === option ? ' active' : ''}`}
                          onClick={() => {
                            setDifficulty(option);
                            setMenuOpen(false);
                          }}
                        >
                          {option}
                        </ActionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Question</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Difficulty</th>
                      <th>Tags</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <tr key={row.id}>
                        <td>{row.text}</td>
                        <td>{row.subject}</td>
                        <td>{row.type}</td>
                        <td>
                          <span className={`badge badge-soft-${difficultyTint(row.difficulty)}`}>
                            {row.difficulty}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-light text-dark">{row.tag}</span>
                        </td>
                        <td>
                          <ActionLink
                            className="btn btn-icon btn-sm btn-outline-light bg-white"
                            ariaLabel={`Edit ${row.text}`}
                            onClick={() => push(`Editing: ${row.text}`)}
                          >
                            <i className="ti ti-edit" />
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted fs-13">
                          No questions match this search.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Question"
        onSubmit={(event) => {
          event.preventDefault();
          push('Question added to the bank');
          setOpen(false);
        }}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={() => setOpen(false)}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Add Question
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label" htmlFor="qb-subject">
              Subject
            </label>
            <select
              className="form-select"
              id="qb-subject"
              value={form.subject}
              onChange={(event) => setForm((state) => ({ ...state, subject: event.target.value }))}
            >
              {SUBJECTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="qb-type">
              Type
            </label>
            <select
              className="form-select"
              id="qb-type"
              value={form.type}
              onChange={(event) => setForm((state) => ({ ...state, type: event.target.value }))}
            >
              {TYPES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="qb-difficulty">
              Difficulty
            </label>
            <select
              className="form-select"
              id="qb-difficulty"
              value={form.difficulty}
              onChange={(event) =>
                setForm((state) => ({ ...state, difficulty: event.target.value }))
              }
            >
              {DIFFICULTIES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="qb-question">
              Question
            </label>
            <textarea
              className="form-control"
              rows={2}
              id="qb-question"
              value={form.question}
              onChange={(event) => setForm((state) => ({ ...state, question: event.target.value }))}
            />
          </div>
          {(['optionA', 'optionB', 'optionC'] as const).map((key, index) => (
            <div className="col-md-4" key={key}>
              <label className="form-label" htmlFor={`qb-${key}`}>
                Option {String.fromCharCode(65 + index)}
              </label>
              <input
                type="text"
                className="form-control"
                id={`qb-${key}`}
                value={form[key]}
                onChange={(event) => setForm((state) => ({ ...state, [key]: event.target.value }))}
              />
            </div>
          ))}
          <div className="col-md-6">
            <label className="form-label" htmlFor="qb-answer">
              Correct Answer
            </label>
            <input
              type="text"
              className="form-control"
              id="qb-answer"
              value={form.answer}
              onChange={(event) => setForm((state) => ({ ...state, answer: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="qb-tags">
              Tags
            </label>
            <input
              type="text"
              className="form-control"
              id="qb-tags"
              value={form.tags}
              onChange={(event) => setForm((state) => ({ ...state, tags: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="questionBankToasts" />
    </>
  );
};

export default QuestionBank;
