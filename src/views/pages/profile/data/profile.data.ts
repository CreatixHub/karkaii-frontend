/* ------------------------------------------------------------------ *
 * The account                                                        *
 * ------------------------------------------------------------------ */

export interface Account {
  photo: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
}

export const ACCOUNT: Account = {
  photo: 'assets/img/profiles/avatar-27.jpg',
  firstName: 'Kevin',
  lastName: 'Larry',
  email: 'kevin@example.com',
  userName: 'kevin.larry',
  phone: '+1 82392 37359',
  address: '3495 Red Hawk Road',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  postalCode: '90017',
};

/* ------------------------------------------------------------------ *
 * What the tiles read                                                *
 * ------------------------------------------------------------------ */

/** Two-factor is on, which is what makes the security tile read Strong. */
export const TWO_FACTOR = true;
export const UNREAD = 2;
export const LAST_LOGIN = '1 Day Ago';

/** Every field the completeness tile counts. */
const FIELDS: (keyof Account)[] = [
  'firstName',
  'lastName',
  'email',
  'userName',
  'phone',
  'address',
  'country',
  'state',
  'city',
  'postalCode',
];

export const completenessOf = (account: Account) => {
  const filled = FIELDS.filter((field) => account[field].trim() !== '').length;
  return Math.round((filled / FIELDS.length) * 100);
};

/** What the caption under the figure says about it. */
export const completenessNote = (percent: number) => {
  if (percent === 100) return 'Nothing left to fill';
  if (percent >= 90) return 'Almost done';
  if (percent >= 50) return 'Getting there';
  return 'Just started';
};

export const securityOf = (twoFactor: boolean) =>
  twoFactor
    ? { value: 'Strong', note: '2FA Enabled', tint: 'success' }
    : { value: 'Weak', note: '2FA Off', tint: 'danger' };

export interface ProfileStat {
  id: string;
  tint: string;
  icon: string;
  value: string;
  label: string;
  note: string;
}

export const statsFor = (account: Account): ProfileStat[] => {
  const complete = completenessOf(account);
  const security = securityOf(TWO_FACTOR);

  return [
    {
      id: 'complete',
      tint: 'primary',
      icon: 'ti ti-user-circle',
      value: `${complete}%`,
      label: 'Profile Complete',
      note: completenessNote(complete),
    },
    {
      id: 'security',
      tint: security.tint,
      icon: 'ti ti-shield-check',
      value: security.value,
      label: 'Account Security',
      note: security.note,
    },
    {
      id: 'inbox',
      tint: 'warning',
      icon: 'ti ti-bell',
      value: String(UNREAD),
      label: 'Unread',
      note: 'Inbox',
    },
    {
      id: 'login',
      tint: 'info',
      icon: 'ti ti-clock-hour-4',
      value: LAST_LOGIN,
      label: 'Last Login',
      note: 'Active Session',
    },
  ];
};
