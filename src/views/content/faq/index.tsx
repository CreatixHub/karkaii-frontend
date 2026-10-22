import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../shared/ContentPageHeader';
import DeleteModal from '../shared/DeleteModal';
import { RowMenu, SelectBox } from '../shared/ListBits';
import ListToolbar from '../shared/ListToolbar';
import { useList } from '../shared/useList';
import type { FaqEntry } from './data/faq.data';
import { categoryOptions, FAQS, questionOptions, refOf } from './data/faq.data';

const routes = all_routes;

const Faq = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<FaqEntry[]>(FAQS);
  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<FaqEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  const [category, setCategory] = useState(categoryOptions[0]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (!dialog) return;
    const source = dialog === 'edit' ? editing : null;
    setCategory(source?.category ?? categoryOptions[0]);
    setQuestion(source?.question ?? '');
    setAnswer(source?.answer ?? '');
  }, [dialog, editing]);

  const matches = useCallback((row: FaqEntry, filters: Record<string, string>) => {
    if (filters.question && row.question !== filters.question) return false;
    if (filters.category && row.category !== filters.category) return false;
    return true;
  }, []);

  const sortKey = useCallback((row: FaqEntry) => row.question, []);
  const list = useList<FaqEntry>({ rows, getId: (row) => row.id, matches, sortKey });

  const deleteCount =
    pendingDelete === 'selected' ? list.selected.length : pendingDelete === null ? 0 : 1;

  const confirmDelete = () => {
    const going =
      pendingDelete === 'selected' ? list.selected : pendingDelete === null ? [] : [pendingDelete];
    setRows((current) => current.filter((row) => !going.includes(row.id)));
    list.clearSelection();
    setPendingDelete(null);
    push(going.length > 1 ? `${going.length} questions deleted` : 'Question deleted');
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const draft = { question: question.trim(), answer: answer.trim(), category };
    if (dialog === 'edit' && editing) {
      setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...draft } : row)));
      push('Question saved');
    } else {
      setRows((current) => [
        {
          id:
            draft.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) ||
            `faq-${current.length}`,
          ...draft,
        },
        ...current,
      ]);
      push('Question added');
    }
    setDialog(null);
    setEditing(null);
  };

  const body = (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="faq-category">
            Category
          </label>
          <select
            className="form-select"
            id="faq-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="faq-question">
            Question
          </label>
          <input
            type="text"
            className="form-control"
            id="faq-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="faq-answer">
            Answer
          </label>
          <textarea
            className="form-control"
            rows={3}
            id="faq-answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const footer = (label: string) => (
    <>
      <ActionLink
        className="btn btn-light me-2"
        onClick={() => {
          setDialog(null);
          setEditing(null);
        }}
      >
        Cancel
      </ActionLink>
      <button type="submit" className="btn btn-primary">
        {label}
      </button>
    </>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ContentPageHeader
            title="FAQ"
            section="Content"
            dashboardTo={routes.adminDashboard}
            addLabel="Add FAQ"
            onAdd={() => {
              setEditing(null);
              setDialog('add');
            }}
            onRefresh={() => {
              setRows(FAQS);
              list.resetFilters();
              list.clearSelection();
              push('FAQ refreshed');
            }}
            onExport={(format) => push(`FAQ exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)}
            extra={
              list.selected.length === 0 ? null : (
                <div className="pe-1 mb-2">
                  <button
                    type="button"
                    className="btn btn-danger d-inline-flex align-items-center me-1"
                    onClick={() => setPendingDelete('selected')}
                  >
                    <i className="ti ti-trash-x me-1" />
                    Delete {list.selected.length}
                  </button>
                </div>
              )
            }
          />

          <div className="card">
            <ListToolbar
              title="FAQ List"
              fields={[
                { id: 'question', label: 'Questions', options: questionOptions },
                { id: 'category', label: 'Category', options: categoryOptions },
              ]}
              filters={list.filters}
              onApply={list.applyFilters}
              onReset={list.resetFilters}
              sort={list.sort}
              onSort={list.setSort}
            />
            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th className="no-sort">
                        <SelectBox
                          id="faq-select-all"
                          checked={list.allSelected}
                          onChange={list.toggleAll}
                          label="Select all rows"
                        />
                      </th>
                      <th>ID</th>
                      <th>Questions</th>
                      <th>Answers</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.visible.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <SelectBox
                            id={`faq-select-${row.id}`}
                            checked={list.isSelected(row.id)}
                            onChange={(checked) => list.toggleRow(row.id, checked)}
                            label={`Select ${row.question}`}
                          />
                        </td>
                        <td>
                          <ActionLink
                            className="link-primary"
                            onClick={() => {
                              setEditing(row);
                              setDialog('edit');
                            }}
                          >
                            {refOf(index)}
                          </ActionLink>
                        </td>
                        <td>{row.question}</td>
                        <td>{row.answer}</td>
                        <td>{row.category}</td>
                        <td>
                          <RowMenu
                            label={`Actions for ${row.question}`}
                            items={[
                              {
                                id: 'edit',
                                label: 'Edit',
                                icon: 'ti ti-edit-circle',
                                onSelect: () => {
                                  setEditing(row);
                                  setDialog('edit');
                                },
                              },
                              {
                                id: 'delete',
                                label: 'Delete',
                                icon: 'ti ti-trash-x',
                                onSelect: () => setPendingDelete(row.id),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                    {list.visible.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted fs-13">
                          No questions match this filter.
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
        open={dialog === 'add'}
        onClose={() => setDialog(null)}
        title="Add FAQ"
        onSubmit={save}
        footer={footer('Add FAQ')}
      >
        {body}
      </Modal>

      <Modal
        open={dialog === 'edit'}
        onClose={() => {
          setDialog(null);
          setEditing(null);
        }}
        title="Edit FAQ"
        onSubmit={save}
        footer={footer('Save Changes')}
      >
        {body}
      </Modal>

      <DeleteModal
        open={pendingDelete !== null}
        count={deleteCount}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="faqToasts" />
    </>
  );
};

export default Faq;
