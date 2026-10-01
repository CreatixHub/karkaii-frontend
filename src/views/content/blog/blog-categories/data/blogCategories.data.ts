/* ------------------------------------------------------------------ *
 * The register                                                       *
 * ------------------------------------------------------------------ */

import type { EntryStatus, NameDateEntry } from '../../../shared/NameDateStatusPage';
import { slugify } from '../../../shared/NameDateStatusPage';

export type BlogCategory = NameDateEntry;

const category = (name: string, addedOn: string, status: EntryStatus = 'Active'): BlogCategory => ({
  id: slugify(name),
  name,
  addedOn,
  status,
});

export const CATEGORIES: BlogCategory[] = [
  category('Education', '25 May 2024'),
  category('Advice', '24 May 2024'),
  category('Academic', '15 Mar 2024'),
  category('Clear Goals', '21 Feb 2024'),
  category('Healthy Education', '15 Feb 2024'),
  category('Transport', '12 Feb 2024'),
  category('Hostel', '14 Jan 2024'),
  category('Management', '12 Jan 2024'),
  category('Guidance', '16 Dec 2023', 'Inactive'),
  category('Sports', '12 Dec 2023'),
];
