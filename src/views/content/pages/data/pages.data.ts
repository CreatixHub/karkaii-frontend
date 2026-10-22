/* ------------------------------------------------------------------ *
 * The register                                                       *
 * ------------------------------------------------------------------ */

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  published: boolean;
}

/** A title becomes a slug the way the template's second column reads. */
export const slugOf = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const page = (title: string, published = false): CmsPage => ({
  id: slugOf(title),
  title,
  slug: slugOf(title),
  published,
});

export const PAGES: CmsPage[] = [
  page('Students'),
  page('Teachers'),
  page('Parents'),
  page('Guardians'),
  page('Classes'),
  page('Hostel'),
];

export const publishedCount = (rows: CmsPage[]) => rows.filter((row) => row.published).length;

export const statusOf = (row: CmsPage) => (row.published ? 'Published' : 'Draft');

/* ------------------------------------------------------------------ *
 * The filters                                                        *
 * ------------------------------------------------------------------ */

/** The filter offers the pages that exist rather than a list typed beside them. */
export const titleOptions = PAGES.map((row) => row.title);
export const slugOptions = PAGES.map((row) => row.slug);
export const statusOptions = ['Published', 'Draft'];

/** What the search box looks at. */
export const searchIndexOf = (row: CmsPage) =>
  `${row.title} ${row.slug} ${statusOf(row)}`.toLowerCase();
