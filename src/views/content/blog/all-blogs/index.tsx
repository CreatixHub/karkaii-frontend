import { useEffect, useMemo, useState, type FormEvent } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../../shared/ContentPageHeader';
import DeleteModal from '../../shared/DeleteModal';
import { RowMenu } from '../../shared/ListBits';
import ListToolbar from '../../shared/ListToolbar';
import { useList } from '../../shared/useList';
import type { BlogPost } from './data/blogs.data';
import {
  authorOptions,
  categoryOptions,
  dateOptions,
  engagementOf,
  POSTS,
  statusOptions,
  statusTint,
} from './data/blogs.data';

const routes = all_routes;

const AllBlogs = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<BlogPost[]>(POSTS);
  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: categoryOptions[0],
    tags: '',
    status: 'Active',
    description: '',
  });

  useEffect(() => {
    if (!dialog) return;
    const source = dialog === 'edit' ? editing : null;
    setForm({
      title: source?.title ?? '',
      category: source?.category ?? categoryOptions[0],
      tags: '',
      status: source?.status ?? 'Active',
      description: '',
    });
  }, [dialog, editing]);

  const matches = useMemo(
    () => (row: BlogPost, filters: Record<string, string>) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.author && row.author !== filters.author) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters.added && row.date !== filters.added) return false;
      return true;
    },
    [],
  );

  const sortKey = useMemo(() => (row: BlogPost) => row.title, []);
  const list = useList<BlogPost>({ rows, getId: (row) => row.id, matches, sortKey });

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (dialog === 'edit' && editing) {
      setRows((current) =>
        current.map((row) =>
          row.id === editing.id
            ? { ...row, title: form.title, category: form.category, status: form.status as BlogPost['status'] }
            : row,
        ),
      );
      push(`${form.title} saved`);
    } else {
      push(`${form.title || 'Post'} drafted`);
    }
    setDialog(null);
    setEditing(null);
  };

  const body = (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="blog-title">
            Blog Title
          </label>
          <input
            type="text"
            className="form-control"
            id="blog-title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />
        </div>
        <label className="form-label">Featured Image</label>
        <div className="d-flex align-items-center upload-pic flex-wrap row-gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
            <i className="ti ti-photo-plus fs-16" />
          </div>
          <div className="profile-upload">
            <div className="profile-uploader d-flex align-items-center">
              <div className="drag-upload-btn mb-3">
                Upload
                <input type="file" className="form-control image-sign" multiple aria-label="Upload" />
              </div>
              <ActionLink
                className="btn btn-primary mb-3"
                onClick={() => push('Featured image removed')}
              >
                Remove
              </ActionLink>
            </div>
            <p>Upload image size 4MB, Format JPG, PNG, SVG</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="blog-category">
            Category
          </label>
          <select
            className="form-select"
            id="blog-category"
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          >
            {categoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-lg-4 col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="blog-tags">
            Tags
          </label>
          <input
            type="text"
            className="form-control"
            id="blog-tags"
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
          />
        </div>
      </div>
      <div className="col-lg-4 col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="blog-status">
            Status
          </label>
          <select
            className="form-select"
            id="blog-status"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-12">
        <div className="mb-0">
          <label className="form-label" htmlFor="blog-description">
            Description
          </label>
          <textarea
            className="form-control"
            rows={4}
            id="blog-description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
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
            title="Blogs"
            section="Pages"
            dashboardTo={routes.adminDashboard}
            addLabel="Add Blog"
            onAdd={() => {
              setEditing(null);
              setDialog('add');
            }}
            onRefresh={() => {
              setRows(POSTS);
              list.resetFilters();
              push('Blogs refreshed');
            }}
            onExport={(format) => push(`Blogs exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)}
          />

          <div className="card">
            <ListToolbar
              title="Blogs List"
              fields={[
                { id: 'category', label: 'Category', options: categoryOptions },
                { id: 'author', label: 'Author', options: authorOptions },
                { id: 'status', label: 'Status', options: statusOptions },
                { id: 'added', label: 'Added Date', options: dateOptions },
              ]}
              filters={list.filters}
              onApply={list.applyFilters}
              onReset={list.resetFilters}
              sort={list.sort}
              onSort={list.setSort}
            />
            <div className="card-body p-3 pb-0">
              {list.visible.map((post) => (
                <div className="card mb-3" key={post.id}>
                  <div className="card-body p-3 pb-0">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="blog-content d-flex align-items-center mb-3 me-3 w-40">
                        <ActionLink
                          className="avatar avatar-xxl rounded flex-shrink-0 me-3"
                          ariaLabel={post.title}
                          onClick={() => {
                            setEditing(post);
                            setDialog('edit');
                          }}
                        >
                          <ImageWithBasePath src={post.cover} alt={post.title} />
                        </ActionLink>
                        <div className="overflow-hidden">
                          <ul className="d-flex align-items-center flex-wrap row-gap-2">
                            <li className="pe-2 me-2 border-end">
                              <i className="ti ti-calendar me-1" />
                              {post.date}
                            </li>
                            <li className="d-flex align-items-center">
                              <span className="avatar avatar-xs me-1">
                                <ImageWithBasePath src={post.authorPhoto} alt={post.author} />
                              </span>
                              {post.author}
                            </li>
                          </ul>
                          <h5 className="text-truncate my-2">
                            <ActionLink
                              className=""
                              onClick={() => {
                                setEditing(post);
                                setDialog('edit');
                              }}
                            >
                              {post.title}
                            </ActionLink>
                          </h5>
                          <span className="badge badge-soft-primary fs-12">{post.category}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center flex-wrap">
                        {engagementOf(post).map((figure, index, all) => (
                          <div
                            className={
                              index === all.length - 1
                                ? 'p-0 mb-3 text-center'
                                : 'pe-4 me-4 mb-3 border-end text-center'
                            }
                            key={figure.id}
                          >
                            <h6>{figure.value}</h6>
                            <p className="fs-12">{figure.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <span
                          className={`badge badge-soft-${statusTint(post.status)} d-inline-flex align-items-center me-2`}
                        >
                          <i className="ti ti-circle-filled fs-6 me-1" />
                          {post.status}
                        </span>
                        <RowMenu
                          label={`Actions for ${post.title}`}
                          items={[
                            {
                              id: 'edit',
                              label: 'Edit',
                              icon: 'ti ti-edit-circle',
                              onSelect: () => {
                                setEditing(post);
                                setDialog('edit');
                              },
                            },
                            {
                              id: 'delete',
                              label: 'Delete',
                              icon: 'ti ti-trash-x',
                              onSelect: () => setPendingDelete(post.id),
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {list.visible.length === 0 ? (
                <p className="text-center py-4 text-muted fs-13">No blogs match this filter.</p>
              ) : (
                <div className="text-center mb-3">
                  <ActionLink
                    className="btn btn-outline-light bg-white"
                    onClick={() => push('That is every post in the register')}
                  >
                    Load More
                  </ActionLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={dialog === 'add'}
        onClose={() => setDialog(null)}
        title="New Blogs"
        dialogClassName="modal-lg"
        onSubmit={save}
        footer={footer('Add Blog')}
      >
        {body}
      </Modal>

      <Modal
        open={dialog === 'edit'}
        onClose={() => {
          setDialog(null);
          setEditing(null);
        }}
        title="Edit Blog"
        dialogClassName="modal-lg"
        onSubmit={save}
        footer={footer('Save Changes')}
      >
        {body}
      </Modal>

      <DeleteModal
        open={pendingDelete !== null}
        count={1}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          setRows((current) => current.filter((row) => row.id !== pendingDelete));
          setPendingDelete(null);
          push('Post deleted');
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="allBlogsToasts" />
    </>
  );
};

export default AllBlogs;
