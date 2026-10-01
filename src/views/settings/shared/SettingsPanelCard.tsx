import { useState, type ReactNode } from 'react';
import { ActionLink } from '@components/workspace';

export type Control =
  | { kind: 'switch'; on: boolean }
  | { kind: 'select'; options: string[]; value: string }
  | { kind: 'input'; value: string }
  | { kind: 'button'; label: string }
  /** A figure the row shows rather than a control it offers. */
  | { kind: 'reading'; value: string }
  /** A word or a link standing where a control would be. */
  | { kind: 'tag'; value: string }
  | { kind: 'none' };

export interface Row {
  id: string;
  label: string;
  note?: string;
  control: Control;
}

export interface PanelCard {
  id: string;
  title: string;
  note: string;
  icon: string;
  /** `is-warn` / `is-model`, or nothing for the plain tile. */
  iconTone?: string;
  badge?: { tone: string; label: string };
  rows: Row[];
  /** Overrides the derived "N settings" line. */
  foot?: string;
  /** The column span the template gives the card. */
  span?: string;
}

/** What a card's foot says when it is not saying something more specific. */
export const footOf = (card: PanelCard) => card.foot ?? `${card.rows.length} settings`;

export interface SettingsPanelCardProps {
  card: PanelCard;
  /** The template's class family: `aig` on AI Settings, `sys` on System. */
  prefix: 'aig' | 'sys';
  /** Overrides the derived foot line for this one rendering. */
  foot?: string;
  /** The workspace opener; the templates point every card at the same panel. */
  onOpen: (title: string) => void;
  /** Rendered in place of the rows, for the cards that hold something else. */
  children?: ReactNode;
  /** Rendered after the rows, for the cards that hold both. */
  extra?: ReactNode;
}

const RowControl = ({
  id,
  control,
  prefix,
}: {
  id: string;
  control: Control;
  prefix: string;
}) => {
  const [value, setValue] = useState(
    control.kind === 'switch'
      ? String(control.on)
      : control.kind === 'select' || control.kind === 'input'
        ? control.value
        : '',
  );

  if (control.kind === 'switch') {
    return (
      <div className="form-check form-switch mb-0">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={id}
          checked={value === 'true'}
          onChange={(event) => setValue(String(event.target.checked))}
        />
        <label className="form-check-label visually-hidden" htmlFor={id}>
          Enable
        </label>
      </div>
    );
  }

  if (control.kind === 'select') {
    return (
      <select
        className={`${prefix}-select`}
        aria-label="Setting value"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        {control.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (control.kind === 'input') {
    return (
      <input
        type="text"
        className={`${prefix}-input`}
        aria-label="Setting value"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }

  if (control.kind === 'reading') {
    return <b className={`${prefix}-mono`}>{control.value}</b>;
  }

  if (control.kind === 'tag') {
    return <span className={`${prefix}-tag`}>{control.value}</span>;
  }

  return null;
};

const SettingsPanelCard = ({
  card,
  prefix,
  foot,
  onOpen,
  children,
  extra,
}: SettingsPanelCardProps) => (
  <div className={card.span ?? 'col-12 col-xl-6'}>
    <div className={`${prefix}-card`}>
      <div className={`${prefix}-card-head`}>
        <span className={`${prefix}-card-ic ${card.iconTone ?? ''}`}>
          <i className={card.icon} />
        </span>
        <div className="flex-fill overflow-hidden">
          <p className={`${prefix}-card-title`}>{card.title}</p>
          <p>{card.note}</p>
        </div>
        {card.badge ? (
          <span className={`${prefix}-badge ${card.badge.tone}`}>{card.badge.label}</span>
        ) : null}
      </div>
      <div className={`${prefix}-card-body`}>
        {children ??
          card.rows.map((row) => (
            <div className={`${prefix}-row`} key={row.id}>
              <div className={`${prefix}-row-key`}>
                {row.label}
                {row.note ? <small>{row.note}</small> : null}
              </div>
              <div className={`${prefix}-row-val`}>
                {row.control.kind === 'button' ? (
                  <ActionLink
                    className="btn btn-sm btn-outline-light bg-white"
                    onClick={() => onOpen(row.label)}
                  >
                    {row.control.label}
                  </ActionLink>
                ) : (
                  <RowControl id={`${card.id}-${row.id}`} control={row.control} prefix={prefix} />
                )}
              </div>
            </div>
          ))}
        {extra}
      </div>
      <div className={`${prefix}-card-foot`}>
        <span className="fs-12 text-muted">{foot ?? footOf(card)}</span>
        <ActionLink
          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
          ariaLabel={`Open configuration workspace for ${card.title}`}
          onClick={() => onOpen(card.title)}
        >
          <i className="ti ti-arrow-right me-1" />
          Open
        </ActionLink>
      </div>
    </div>
  </div>
);

export default SettingsPanelCard;
