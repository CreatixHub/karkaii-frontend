/* ------------------------------------------------------------------ *
 * The file                                                           *
 * ------------------------------------------------------------------ */

export type DocStatus = 'Verified' | 'Under Review' | 'Uploaded' | 'Rejected';

export interface Version {
  id: string;
  /** 1-based; the list prints `v${number}`. */
  number: number;
  by: string;
  on: string;
}

export interface TrailEntry {
  id: string;
  status: DocStatus;
  by: string | null;
  at: string;
}

/** Newest first, the way the template prints them. */
export const VERSIONS: Version[] = [
  { id: 'v3', number: 3, by: 'Teena Mathew', on: '02 Jul 2026' },
  { id: 'v2', number: 2, by: 'Parent', on: '15 May 2026' },
  { id: 'v1', number: 1, by: 'Parent', on: '02 Jan 2026' },
];

/** Newest first, the way the timeline reads. */
export const TRAIL: TrailEntry[] = [
  { id: 'verified', status: 'Verified', by: 'Teena Mathew', at: '02 Jul 2026, 02:10 PM' },
  { id: 'review', status: 'Under Review', by: null, at: '02 Jul 2026, 11:30 AM' },
  { id: 'uploaded', status: 'Uploaded', by: 'Teena Mathew', at: '02 Jul 2026, 10:24 AM' },
];

export const DOCUMENT = {
  fileName: 'birth-certificate.pdf',
  category: 'Birth Certificate',
  student: 'Janet Daniel',
  className: 'III - A',
  fileType: 'PDF',
  size: '1.2 MB',
  /** Nothing runs out on this one; the ribbon and the Details row both say so. */
  expiry: null as string | null,
  pages: 2,
  tags: ['official', '2026'],
};

/* ------------------------------------------------------------------ *
 * What follows from it                                               *
 * ------------------------------------------------------------------ */

/** The version on screen — the newest one. */
export const CURRENT = VERSIONS[0];

/** "PDF · 1.2 MB · v3". */
export const CAPTION = `${DOCUMENT.fileType} · ${DOCUMENT.size} · v${CURRENT.number}`;

/** Where the document stands is the last thing that happened to it. */
export const STATUS: DocStatus = TRAIL[0].status;

export const statusTint = (status: DocStatus) =>
  ({ Verified: 'success', 'Under Review': 'info', Uploaded: 'primary', Rejected: 'danger' })[status];

/** The trail's dots take the same tint as the status they mark. */
export const trailIcon = (status: DocStatus) =>
  ({
    Verified: 'ti ti-check',
    'Under Review': 'ti ti-eye',
    Uploaded: 'ti ti-upload',
    Rejected: 'ti ti-x',
  })[status];

/** A tint stem for the file's own type, used on the header tile and preview. */
export const FILE_ICON = DOCUMENT.fileType === 'PDF' ? 'ti ti-file-type-pdf' : 'ti ti-file';

export const EXPIRY_NOTE =
  DOCUMENT.expiry === null
    ? 'No expiry set for this document.'
    : `This document expires on ${DOCUMENT.expiry}.`;

/** The Details tab prints an em dash where there is no expiry. */
export const EXPIRY_VALUE = DOCUMENT.expiry ?? '—';

export const UPLOADED_BY = CURRENT.by;
export const UPLOADED_ON = CURRENT.on;

export const DETAILS: { label: string; value: string }[] = [
  { label: 'Category', value: DOCUMENT.category },
  { label: 'Student', value: DOCUMENT.student },
  { label: 'Class', value: DOCUMENT.className },
  { label: 'Uploaded By', value: UPLOADED_BY },
  { label: 'Upload Date', value: UPLOADED_ON },
  { label: 'Expiry', value: EXPIRY_VALUE },
  { label: 'File Type', value: DOCUMENT.fileType },
  { label: 'Size', value: DOCUMENT.size },
];

/* ------------------------------------------------------------------ *
 * The tabs                                                           *
 * ------------------------------------------------------------------ */

export type TabId = 'details' | 'versions' | 'verify';

export const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'versions', label: 'Versions' },
  { id: 'verify', label: 'Verification' },
];

/* ------------------------------------------------------------------ *
 * The zoom control                                                   *
 * ------------------------------------------------------------------ */

export const ZOOM_STEP = 10;
export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;

export const clampZoom = (zoom: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));
