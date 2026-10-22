export type DesignationStatus = 'Active' | 'Inactive';

export interface DesignationRow {
  id: string;
  name: string;
  status: DesignationStatus;
  /** `.dt-pill` modifier that pairs with `status`. */
  pillClass: string;
}

const row = (id: string, name: string, status: DesignationStatus): DesignationRow => ({
  id,
  name,
  status,
  pillClass: status === 'Active' ? 'is-active' : 'is-inactive',
});

export const designationRows: DesignationRow[] = [
  row('DS748294', 'Technical Head', 'Active'),
  row('DS748293', 'Accountant', 'Active'),
  row('DS748292', 'Teacher', 'Active'),
  row('DS748291', 'Librarian', 'Active'),
  row('DS748290', 'Doctor', 'Inactive'),
  row('DS748289', 'Driver', 'Active'),
  row('DS748288', 'Warden', 'Active'),
  row('DS748287', 'Receptionist', 'Active'),
  row('DS748286', 'Therapist', 'Inactive'),
  row('DS748285', 'Coach', 'Active'),
];

/* -------------------------------------------------------------------------- */
/*                             Header and dialogs                             */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
];

export type DesignationModalId = 'add' | 'edit' | 'delete';
