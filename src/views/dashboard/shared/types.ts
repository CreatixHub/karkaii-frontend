/** The `info-list-item` row — the template's most repeated structure. */
export interface InfoRow {
  id: string;
  /** Leading icon avatar. Mutually exclusive with `avatar`. */
  icon?: string;
  iconClass?: string;
  /**
   * Wrapper class for the icon. The teacher dashboard uses `avatar` (the
   * default); the student dashboard uses `info-list-icon`.
   */
  iconWrapClass?: string;
  /** Leading photo. Mutually exclusive with `icon`. */
  avatar?: string;
  /** Online/offline dot on the photo, as in the student "My Teachers" list. */
  avatarDot?: 'online' | 'offline';
  /** Extra classes on the row itself, e.g. `bg-body-tertiary border-danger`. */
  itemClass?: string;
  title: string;
  titleBadge?: { label: string; className: string };
  subtitle?: string;
  /** Renders the subtitle with the template's `un` (unread) class. */
  subtitleUnread?: boolean;
  endBadge?: { label: string; className: string };
  endNote?: string;
}
