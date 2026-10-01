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
import type { Role, Testimonial } from './data/testimonials.data';
import { authorOptions, refOf, roleOptions, TESTIMONIALS } from './data/testimonials.data';

const routes = all_routes;

const Testimonials = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<Testimonial[]>(TESTIMONIALS);
  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState<Role>('Parent');
  const [addedOn, setAddedOn] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!dialog) return;
    const source = dialog === 'edit' ? editing : null;
    setAuthor(source?.author ?? '');
    setRole(source?.role ?? 'Parent');
    setAddedOn(source?.addedOn ?? '');
    setContent(source?.content ?? '');
  }, [dialog, editing]);

  const matches = useCallback((row: Testimonial, filters: Record<string, string>) => {
    if (filters.author && row.author !== filters.author) return false;
    if (filters.role && row.role !== filters.role) return false;
    return true;
  }, []);

  const sortKey = useCallback((row: Testimonial) => row.author, []);
  const list = useList<Testimonial>({ rows, getId: (row) => row.id, matches, sortKey });

  const deleteCount =
    pendingDelete === 'selected' ? list.selected.length : pendingDelete === null ? 0 : 1;

  const confirmDelete = () => {
    const going =
      pendingDelete === 'selected' ? list.selected : pendingDelete === null ? [] : [pendingDelete];
    setRows((current) => current.filter((row) => !going.includes(row.id)));
    list.clearSelection();
    setPendingDelete(null);
    push(going.length > 1 ? `${going.length} testimonials deleted` : 'Testimonial deleted');
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const draft = { author: author.trim(), role, addedOn, content: content.trim() };
    if (dialog === 'edit' && editing) {
      setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...draft } : row)));
      push(`${draft.author} saved`);
    } else {
      setRows((current) => [
        { id: draft.author.toLowerCase() || `author-${current.length}`, ...draft },
        ...current,
      ]);
      push(`${draft.author} added`);
    }
    setDialog(null);
    setEditing(null);
  };

  const body = (
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="t-author">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="t-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="t-role">
            Role
          </label>
          <select
            className="form-select"
            id="t-role"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            {roleOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="t-date">
            Date Added
          </label>
          <input
            type="text"
            className="form-control"
            id="t-date"
            placeholder="25 Apr 2024"
            value={addedOn}
            onChange={(event) => setAddedOn(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-12">
        <div className="mb-0">
          <label className="form-label" htmlFor="t-content">
            Content
          </label>
          <textarea
            className="form-control"
            rows={3}
            id="t-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
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
            title="Testimonials"
            section="Content"
            dashboardTo={routes.adminDashboard}
            addLabel="Add Testimonial"
            onAdd={() => {
              setEditing(null);
              setDialog('add');
            }}
            onRefresh={() => {
              setRows(TESTIMONIALS);
              list.resetFilters();
              list.clearSelection();
              push('Testimonials refreshed');
            }}
            onExport={(format) =>
              push(`Testimonials exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
            }
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
              title="Testimonials List"
              fields={[
                { id: 'author', label: 'Author', options: authorOptions },
                { id: 'role', label: 'Role', options: roleOptions },
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
                          id="testimonials-select-all"
                          checked={list.allSelected}
                          onChange={list.toggleAll}
                          label="Select all rows"
                        />
                      </th>
                      <th>ID</th>
                      <th>Author</th>
                      <th>Role</th>
                      <th>Content</th>
                      <th>Date Added</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.visible.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <SelectBox
                            id={`testimonials-select-${row.id}`}
                            checked={list.isSelected(row.id)}
                            onChange={(checked) => list.toggleRow(row.id, checked)}
                            label={`Select ${row.author}`}
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
                        <td>{row.author}</td>
                        <td>{row.role}</td>
                        <td>{row.content}</td>
                        <td>{row.addedOn}</td>
                        <td>
                          <RowMenu
                            label={`Actions for ${row.author}`}
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
                        <td colSpan={7} className="text-center py-4 text-muted fs-13">
                          No testimonials match this filter.
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
        title="Add Testimonial"
        onSubmit={save}
        footer={footer('Add Testimonial')}
      >
        {body}
      </Modal>

      <Modal
        open={dialog === 'edit'}
        onClose={() => {
          setDialog(null);
          setEditing(null);
        }}
        title="Edit Testimonial"
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

      <ToastStack toasts={toasts} onDismiss={dismiss} id="testimonialsToasts" />
    </>
  );
};

export default Testimonials;
