export type ProfileAction =
  | 'print'
  | 'upload'
  | 'message'
  | 'email'
  | 'call'
  | 'whatsapp'
  | 'meeting'
  | 'homework'
  | 'idcard'
  | 'download'
  | 'certificate'
  | 'download_report'
  | 'transfer'
  | 'suspend'
  | 'archive'
  | 'track_bus'
  | 'reset_password';

export type ProfileModalId =
  | 'message'
  | 'email'
  | 'call'
  | 'meeting'
  | 'homework'
  | 'idcard'
  | 'confirm'
  | 'pay'
  | 'track'
  | 'login'
  | 'collectFees';

/** The confirm dialog's shape, as `confirmDialog(opts)` defined it. */
export interface ConfirmOptions {
  title: string;
  text: string;
  variant: 'danger' | 'warning' | 'primary';
  icon: string;
  okLabel: string;
  /** Toast raised once the user confirms. */
  toast: { message: string; variant: 'success' | 'info' };
}

export const CONFIRMATIONS: Record<'transfer' | 'suspend' | 'archive' | 'reset_password', ConfirmOptions> = {
  transfer: {
    title: 'Transfer Janet Daniel?',
    text: 'This starts the transfer certificate workflow.',
    variant: 'primary',
    icon: 'ti ti-transfer',
    okLabel: 'Start Transfer',
    toast: { message: 'Transfer request initiated.', variant: 'success' },
  },
  suspend: {
    title: 'Suspend Janet Daniel?',
    text: "The student's status will be set to Suspended.",
    variant: 'warning',
    icon: 'ti ti-ban',
    okLabel: 'Suspend',
    toast: { message: 'Student suspended.', variant: 'info' },
  },
  archive: {
    title: 'Archive Janet Daniel?',
    text: 'The student will be moved to the archive.',
    variant: 'warning',
    icon: 'ti ti-archive',
    okLabel: 'Archive',
    toast: { message: 'Student archived.', variant: 'info' },
  },
  reset_password: {
    title: 'Reset login password?',
    text: 'A secure reset link will be emailed to the parent and student accounts.',
    variant: 'primary',
    icon: 'ti ti-lock-cog',
    okLabel: 'Send Reset Link',
    toast: { message: 'Password reset link sent.', variant: 'success' },
  },
};

/** Toasts the script raised before starting a download or opening a link. */
export const ACTION_TOASTS: Partial<Record<ProfileAction, { message: string; variant: 'info' | 'success' }>> = {
  upload: { message: 'Opening document upload…', variant: 'info' },
  whatsapp: { message: 'Opening WhatsApp…', variant: 'info' },
  download: { message: 'Preparing profile…', variant: 'info' },
  certificate: { message: 'Generating certificate…', variant: 'info' },
  download_report: { message: 'Preparing report card…', variant: 'info' },
};

export const WHATSAPP_URL = 'https://wa.me/18090955468';
