import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';
import type { CmsPage } from '../data/pages.data';
import { slugOf } from '../data/pages.data';

export type PagesDialog = 'add' | 'edit' | null;

export interface PagesModalsProps {
  open: PagesDialog;
  /** The row being edited, when the dialog is the edit one. */
  page: CmsPage | null;
  onClose: () => void;
  onSave: (draft: { title: string; slug: string; published: boolean }) => void;
}

const PagesModals = ({ open, page, onClose, onSave }: PagesModalsProps) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(open === 'edit' && page ? page.title : '');
    setSlug(open === 'edit' && page ? page.slug : '');
    setSlugTouched(open === 'edit');
    setPublished(open === 'edit' && page ? page.published : false);
  }, [open, page]);

  const changeTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugOf(value));
  };

  const fields = (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="page-title">
            Page
          </label>
          <input
            type="text"
            className="form-control"
            id="page-title"
            value={title}
            onChange={(event) => changeTitle(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="page-slug">
            Page Slug
          </label>
          <input
            type="text"
            className="form-control"
            id="page-slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="col-md-12">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fs-15">Published</h5>
            <p className="fs-12 mb-0">A draft page is not reachable from the site</p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox"
              id="page-published"
              className="check"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            <label htmlFor="page-published" className="checktoggle">
              {' '}
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const footer = (submit: string) => (
    <>
      <ActionLink className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </ActionLink>
      <button type="submit" className="btn btn-primary">
        {submit}
      </button>
    </>
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ title: title.trim(), slug: slug.trim() || slugOf(title), published });
  };

  return (
    <>
      <Modal
        open={open === 'add'}
        onClose={onClose}
        title="Add Page"
        onSubmit={submit}
        footer={footer('Add Page')}
      >
        {fields}
      </Modal>

      <Modal
        open={open === 'edit'}
        onClose={onClose}
        title="Edit Page"
        onSubmit={submit}
        footer={footer('Save Changes')}
      >
        {fields}
      </Modal>
    </>
  );
};

export default PagesModals;
