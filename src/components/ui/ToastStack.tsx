import type { Toast } from '@hooks/useToasts';

export interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
  /** Matches the container id used by the source template. */
  id?: string;
}

const ToastStack = ({ toasts, onDismiss, id }: ToastStackProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" id={id} style={{ zIndex: 1090 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-bg-${toast.variant} border-0 mb-2`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => onDismiss(toast.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
