import type { EntryStatus, NameDateEntry } from '../../../shared/NameDateStatusPage';
import { slugify } from '../../../shared/NameDateStatusPage';

export type BlogTag = NameDateEntry;

const tag = (name: string, addedOn: string, status: EntryStatus = 'Active'): BlogTag => ({
  id: slugify(name),
  name,
  addedOn,
  status,
});

export const TAGS: BlogTag[] = [
  tag('Guide', '25 May 2024'),
  tag('Development', '24 May 2024'),
  tag('Education', '15 Mar 2024'),
  tag('Chances', '21 Feb 2024'),
  tag('Management', '15 Feb 2024', 'Inactive'),
  tag('Sports', '12 Feb 2024'),
  tag('Guidance', '14 Jan 2024'),
  tag('Location', '12 Jan 2024'),
  tag('Hostel', '16 Dec 2023', 'Inactive'),
  tag('Academic', '12 Dec 2023'),
];
