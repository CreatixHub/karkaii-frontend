import { Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { ClassRow, RowMenuItem } from '../data/classes.data';
import { contextMenuItems } from '../data/classes.data';

const routes = all_routes as Record<string, string>;

/** Gap the template's clamp leaves between the menu and the viewport edge. */
const EDGE_GAP = 8;

export interface ClassesContextMenuProps {
  row: ClassRow | null;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (item: RowMenuItem, row: ClassRow) => void;
}

const ClassesContextMenu = ({ row, x, y, onClose, onAction }: ClassesContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!row) return;
    const handleClick = () => onClose();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [row, onClose]);

  // Clamp after layout so the menu's own size is known, as `classes.js` did.
  useEffect(() => {
    const node = menuRef.current;
    if (!row || !node) return;
    node.style.left = `${Math.min(x, window.innerWidth - node.offsetWidth - EDGE_GAP)}px`;
    node.style.top = `${Math.min(y, window.innerHeight - node.offsetHeight - EDGE_GAP)}px`;
  }, [row, x, y]);

  if (!row) return null;

  return (
    <div className="context-menu show" id="clsCtx" role="menu" ref={menuRef}>
      {contextMenuItems.map((item) => (
        <Fragment key={item.id}>
          {item.divider ? <div className="context-menu-divider" /> : null}
          {item.route ? (
            <Link to={routes[item.route]} role="menuitem">
              <i className={item.icon} />
              {item.label}
            </Link>
          ) : (
            <Link
              to="#"
              role="menuitem"
              className={item.danger ? 'text-danger' : undefined}
              onClick={() => {
                onClose();
                onAction(item, row);
              }}
            >
              <i className={item.icon} />
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default ClassesContextMenu;
