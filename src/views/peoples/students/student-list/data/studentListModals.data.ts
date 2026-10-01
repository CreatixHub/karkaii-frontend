export const importModes = [
  'Create new students',
  'Update existing by admission no',
  'Create and update',
];

export const feesGroups = [
  'Select',
  'Class 1 General',
  'Monthly Fees',
  'Admission-Fees',
  'Class 1- I Installment',
];

export const feesTypes = ['Select', 'Tuition Fees', 'Monthly Fees', 'Admission Fees', 'Bus Fees'];

export const paymentTypes = ['Select', 'Paytm', 'Cash On Delivery'];

export interface LoginDetailRow {
  userType: string;
  userName: string;
  password: string;
}

export const loginDetailRows: LoginDetailRow[] = [
  { userType: 'Parent', userName: 'parent53', password: 'parent@53' },
  { userType: 'Student', userName: 'student20', password: 'stdt@53' },
];

/** The `Collect Fees` dialog's summary strip, hardcoded in the template. */
export const collectFeesSummary = {
  admissionNo: 'AD124556',
  outstanding: '2000',
  lastDate: '25 May 2024',
  statusLabel: 'Unpaid',
};
