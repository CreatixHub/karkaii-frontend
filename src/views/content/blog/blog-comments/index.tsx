import { useCallback, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../../shared/ContentPageHeader';
import DeleteModal from '../../shared/DeleteModal';
import { SelectBox } from '../../shared/ListBits';
import ListToolbar from '../../shared/ListToolbar';
import { useList } from '../../shared/useList';
import type { BlogComment } from './data/blogComments.data';
import {
  byOptions,
  COMMENTS,
  dateOptions,
  postOptions,
  starsOf,
} from './data/blogComments.data';

const routes = all_routes;

const BlogComments = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<BlogComment[]>(COMMENTS);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  const matches = useCallback((row: BlogComment, filters: Record<string, string>) => {
    if (filters.date && row.date !== filters.date) return false;
    if (filters.post && row.post !== filters.post) return false;
    if (filters.by && row.by !== filters.by) return false;
    return true;
  }, []);

  const sortKey = useCallback((row: BlogComment) => row.by, []);
  const list = useList<BlogComment>({ rows, getId: (row) => row.id, matches, sortKey });

  const deleteCount =
    pendingDelete === 'selected' ? list.selected.length : pendingDelete === null ? 0 : 1;

  const confirmDelete = () => {
    const going =
      pendingDelete === 'selected' ? list.selected : pendingDelete === null ? [] : [pendingDelete];
    setRows((current) => current.filter((row) => !going.includes(row.id)));
    list.clearSelection();
    setPendingDelete(null);
    push(going.length > 1 ? `${going.length} comments deleted` : 'Comment deleted');
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ContentPageHeader
            title="Blog Comments"
            section="Content"
            dashboardTo={routes.adminDashboard}
            addLabel="Add Comment"
            onAdd={() => push('Comments arrive from readers; there is nothing to add here')}
            onRefresh={() => {
              setRows(COMMENTS);
              list.resetFilters();
              list.clearSelection();
              push('Comments refreshed');
            }}
            onExport={(format) =>
              push(`Comments exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
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
              title="Comments List"
              fields={[
                { id: 'date', label: 'Date', options: dateOptions },
                { id: 'post', label: 'Blog', options: postOptions },
                { id: 'by', label: 'By', options: byOptions },
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
                          id="comments-select-all"
                          checked={list.allSelected}
                          onChange={list.toggleAll}
                          label="Select all rows"
                        />
                      </th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Review</th>
                      <th>Blog</th>
                      <th>By</th>
                      <th>Action</th>
                      <th className="no-sort" aria-label="Delete" />
                    </tr>
                  </thead>
                  <tbody>
                    {list.visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <SelectBox
                            id={`comments-select-${row.id}`}
                            checked={list.isSelected(row.id)}
                            onChange={(checked) => list.toggleRow(row.id, checked)}
                            label={`Select ${row.by}'s comment`}
                          />
                        </td>
                        <td className="text-content">{row.comment}</td>
                        <td className="text-gray-9">{row.date}</td>
                        <td>
                          <div className="rating">
                            {starsOf(row.rating).map((filled, index) => (
                              <i
                                className={`ti ti-star-filled${filled ? ' filled' : ''}`}
                                key={`${row.id}-star-${index}`}
                              />
                            ))}
                            <span className="rating-rate">{row.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="text-gray-9 text-content">{row.post}</td>
                        <td>{row.by}</td>
                        <td>
                          <select
                            className="form-select"
                            aria-label={`Publish state for ${row.by}'s comment`}
                            value={row.published ? 'Publish' : 'Unpublish'}
                            onChange={(event) => {
                              const published = event.target.value === 'Publish';
                              setRows((current) =>
                                current.map((entry) =>
                                  entry.id === row.id ? { ...entry, published } : entry,
                                ),
                              );
                              push(
                                published
                                  ? `${row.by}'s comment published`
                                  : `${row.by}'s comment unpublished`,
                              );
                            }}
                          >
                            <option>Unpublish</option>
                            <option>Publish</option>
                          </select>
                        </td>
                        <td>
                          <ActionLink
                            className="delete-icon"
                            ariaLabel={`Delete ${row.by}'s comment`}
                            onClick={() => setPendingDelete(row.id)}
                          >
                            <i className="ti ti-trash-x" />
                          </ActionLink>
                        </td>
                      </tr>
                    ))}
                    {list.visible.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted fs-13">
                          No comments match this filter.
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

      <DeleteModal
        open={pendingDelete !== null}
        count={deleteCount}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="blogCommentsToasts" />
    </>
  );
};

export default BlogComments;
