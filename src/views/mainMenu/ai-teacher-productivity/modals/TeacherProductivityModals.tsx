import AllTeachersModal from './AllTeachersModal';
import { AixFormDialog } from './AixModal';
import type { TeacherModalId } from '../data/modals.data';
import { formModals } from '../data/modals.data';
import type { ProductivityTeacher } from '../data/teachers.data';

export interface TeacherProductivityModalsProps {
  active: TeacherModalId | null;
  /** The card or section the dialog was opened from; defaults to the first teacher. */
  teacher: ProductivityTeacher;
  onClose: () => void;
  onToast: (message: string) => void;
  /** All Teachers → Export all hands over to the export dialog. */
  onOpenModal: (modal: TeacherModalId) => void;
  /** All Teachers → a row's "Open" closes the dialog and opens the workspace. */
  onOpenWorkspace: (teacher: ProductivityTeacher) => void;
}

const TeacherProductivityModals = ({
  active,
  teacher,
  onClose,
  onToast,
  onOpenModal,
  onOpenWorkspace,
}: TeacherProductivityModalsProps) => {
  if (!active) return null;

  if (active === 'all_teachers') {
    return (
      <AllTeachersModal
        onClose={onClose}
        onOpenWorkspace={onOpenWorkspace}
        onExportAll={() => onOpenModal('export_report')}
      />
    );
  }

  const modal = formModals.find((item) => item.id === active);
  if (!modal) return null;

  return (
    <AixFormDialog
      key={modal.id}
      modal={modal}
      teacher={teacher}
      onClose={onClose}
      onToast={onToast}
    />
  );
};

export default TeacherProductivityModals;
