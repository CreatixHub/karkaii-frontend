import { useCallback, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../shared/ContentPageHeader';
import DeleteModal from '../shared/DeleteModal';
import { RowMenu, SelectBox, StatusToggle } from '../shared/ListBits';
import ListToolbar from '../shared/ListToolbar';
import type { FilterFieldDef } from '../shared/ListToolbar';
import { useList } from '../shared/useList';
import PagesModals from './modals/PagesModals';
import type { PagesDialog } from './modals/PagesModals';
import type { CmsPage } from './data/pages.data';
import {
  PAGES,
  slugOf,
  slugOptions,
  statusOf,
  statusOptions,
  titleOptions,
} from './data/pages.data';

const routes = all_routes;

/** The three facets the template's filter form offers, plus the status it shows. */
const FILTER_FIELDS: FilterFieldDef[] = [
  { id: 'page', label: 'Page', options: titleOptions },
  { id: 'slug', label: 'Page Slug', options: slugOptions },
  { id: 'status', label: 'Status', options: statusOptions },
];

const Pages = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<CmsPage[]>(PAGES);
  const [dialog, setDialog] = useState<PagesDialog>(null);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  const matches = useCallback((row: CmsPage, filters: Record<string, string>) => {
    if (filters.page && row.title !== filters.page) return false;
    if (filters.slug && row.slug !== filters.slug) return false;
    if (filters.status && statusOf(row) !== filters.status) return false;
    return true;
  }, []);

  const sortKey = useCallback((row: CmsPage) => row.title, []);

  const list = useList<CmsPage>({ rows, getId: (row) => row.id, matches, sortKey });

  const deleteCount =
    pendingDelete === 'selected' ? list.selected.length : pendingDelete === null ? 0 : 1;

  const confirmDelete = () => {
    const going =
      pendingDelete === 'selected' ? list.selected : pendingDelete === null ? [] : [pendingDelete];
    setRows((current) => current.filter((row) => !going.includes(row.id)));
    list.clearSelection();
    setPendingDelete(null);
    push(going.length > 1 ? `${going.length} pages deleted` : 'Page deleted');
  };

  const save = (draft: { title: string; slug: string; published: boolean }) => {
    if (dialog === 'edit' && editing) {
      setRows((current) =>
        current.map((row) => (row.id === editing.id ? { ...row, ...draft } : row)),
      );
      push(`${draft.title} saved`);
    } else {
      setRows((current) => [...current, { id: slugOf(draft.title) || `page-${current.length}`, ...draft }]);
      push(`${draft.title} added`);
    }
    setDialog(null);
    setEditing(null);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <ContentPageHeader
            title="Pages"
            section="Content"
            dashboardTo={routes.adminDashboard}
            addLabel="Add Page"
            onAdd={() => {
              setEditing(null);
              setDialog('add');
            }}
            onRefresh={() => {
              setRows(PAGES);
              list.resetFilters();
              list.clearSelection();
              push('Pages list refreshed');
            }}
            onExport={(format) =>
              push(`Pages exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
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
          {/* /Page Header */}

          <div className="card">
            <ListToolbar
              title="Pages List"
              fields={FILTER_FIELDS}
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
                          id="select-all"
                          checked={list.allSelected}
                          onChange={list.toggleAll}
                          label="Select all rows"
                        />
                      </th>
                      <th>Page</th>
                      <th>Page Slug</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <SelectBox
                            id={`select-${row.id}`}
                            checked={list.isSelected(row.id)}
                            onChange={(checked) => list.toggleRow(row.id, checked)}
                            label={`Select ${row.title}`}
                          />
                        </td>
                        <td>{row.title}</td>
                        <td>{row.slug}</td>
                        <td>
                          <StatusToggle
                            id={`status-${row.id}`}
                            checked={row.published}
                            label={`${row.title} published`}
                            onChange={(checked) => {
                              setRows((current) =>
                                current.map((entry) =>
                                  entry.id === row.id ? { ...entry, published: checked } : entry,
                                ),
                              );
                              push(`${row.title} ${checked ? 'published' : 'moved to draft'}`);
                            }}
                          />
                        </td>
                        <td>
                          <RowMenu
                            label={`Actions for ${row.title}`}
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
                        <td colSpan={5} className="text-center py-4 text-muted fs-13">
                          No pages match this filter.
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

      <PagesModals
        open={dialog}
        page={editing}
        onClose={() => {
          setDialog(null);
          setEditing(null);
        }}
        onSave={save}
      />

      <DeleteModal
        open={pendingDelete !== null}
        count={deleteCount}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="pagesToasts" />
    </>
  );
};

export default Pages;
