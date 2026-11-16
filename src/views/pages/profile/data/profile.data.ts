/* ------------------------------------------------------------------ *
 * The account: built from the signed-in login (+ student record)    *
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

/** Empty account: nothing is invented while the real data loads. */
export const ACCOUNT: Account = {
  photo: '',
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  phone: '',
  address: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
};

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/**
 * Builds the account from the login user and (for students) the student record.
 * Reads fields defensively so a missing field simply stays empty.
 */
export const accountFrom = (user: unknown, student: unknown): Account => {
  const u = (user ?? {}) as Record<string, unknown>;
  const s = (student ?? {}) as Record<string, unknown>;

  let firstName = str(s.firstName);
  let lastName = str(s.lastName);
  if (!firstName) {
    const full = str(u.fullName) || str(u.name) || str(s.fullName);
    const [first = '', ...rest] = full.split(/\s+/).filter(Boolean);
    firstName = first;
    lastName = rest.join(' ');
  }

  return {
    photo: '',
    firstName,
    lastName,
    email: str(u.email),
    userName: str(u.username) || str(u.userName),
    phone: str(u.phone),
    address: [str(s.addressLine1), str(s.addressLine2)].filter(Boolean).join(', '),
    country: '',
    state: '',
    city: str(s.cityName) || str(s.city),
    postalCode: str(s.postalCode),
  };
};

/* ------------------------------------------------------------------ *
 * What the tiles read                                                *
 * ------------------------------------------------------------------ */

/** Only the identity fields count towards completeness. */
const FIELDS: (keyof Account)[] = ['firstName', 'lastName', 'email', 'userName', 'phone'];

export const completenessOf = (account: Account) => {
  const filled = FIELDS.filter((field) => account[field].trim() !== '').length;
  return Math.round((filled / FIELDS.length) * 100);
};

export const completenessNote = (percent: number) => {
  if (percent === 100) return 'Nothing left to fill';
  if (percent >= 80) return 'Almost done';
  if (percent >= 50) return 'Getting there';
  return 'Just started';
};

export const securityOf = (mustChangePassword: boolean) =>
  mustChangePassword
    ? { value: 'Action needed', note: 'Temporary password', tint: 'danger' }
    : { value: 'Good', note: 'Password set by you', tint: 'success' };

export interface ProfileStat {
  id: string;
  tint: string;
  icon: string;
  value: string;
  label: string;
  note: string;
}

export const statsFor = (account: Account, mustChangePassword: boolean): ProfileStat[] => {
  const complete = completenessOf(account);
  const security = securityOf(mustChangePassword);

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
      value: '-',
      label: 'Unread',
      note: 'Not available yet',
    },
    {
      id: 'login',
      tint: 'info',
      icon: 'ti ti-clock-hour-4',
      value: '-',
      label: 'Last Login',
      note: 'Not available yet',
    },
  ];
};