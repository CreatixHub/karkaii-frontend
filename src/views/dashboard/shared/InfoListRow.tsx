import type { ReactNode } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { InfoRow } from './types';

export interface InfoListRowProps {
  row: InfoRow;
  /** Compact variant used by summary tiles. */
  small?: boolean;
  /** Rendered in the trailing slot, replacing the badge (e.g. action buttons). */
  endSlot?: ReactNode;
}

const InfoListRow = ({ row, small = false, endSlot }: InfoListRowProps) => (
  <div
    className={[
      'info-list-item d-flex align-items-center',
      small ? 'info-list-item-sm' : '',
      row.itemClass ?? '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {row.avatar ? (
      row.avatarDot ? (
        <span className="info-list-avatar-wrap position-relative flex-shrink-0">
          <ImageWithBasePath
            className="info-list-avatar object-fit-cover"
            src={row.avatar}
            alt={row.title}
          />
          <span className={row.avatarDot === 'offline' ? 'dot off' : 'dot'} />
        </span>
      ) : (
        <ImageWithBasePath
          className="info-list-avatar object-fit-cover flex-shrink-0"
          src={row.avatar}
          alt={row.title}
        />
      )
    ) : row.icon ? (
      <span
        className={`${row.iconWrapClass ?? 'avatar'} ${row.iconClass ?? ''} flex-shrink-0`}
      >
        <i className={row.icon} />
      </span>
    ) : null}

    <div className="info-list-body">
      <b>
        {row.title}
        {row.titleBadge ? (
          <span className={`badge ${row.titleBadge.className} ms-1`}>
            {row.titleBadge.label}
          </span>
        ) : null}
      </b>
      {row.subtitle ? (
        <span className={row.subtitleUnread ? 'un' : undefined}>{row.subtitle}</span>
      ) : null}
    </div>

    {endSlot || row.endBadge || row.endNote ? (
      <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end">
        {endSlot ?? (
          <>
            {row.endBadge ? (
              <span className={`badge ${row.endBadge.className}`}>{row.endBadge.label}</span>
            ) : null}
            {row.endNote ? <span>{row.endNote}</span> : null}
          </>
        )}
      </div>
    ) : null}
  </div>
);

export default InfoListRow;
