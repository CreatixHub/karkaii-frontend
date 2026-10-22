export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
}

/** The template's first reference; every row below counts down from it. */
export const REF_TOP = 482902;

export const refOf = (index: number) => `CM${REF_TOP - index}`;

const from = (
  name: string,
  phone: string,
  email: string,
  message: string,
  date: string,
): ContactMessage => ({ id: email, name, phone, email, message, date });

export const MESSAGES: ContactMessage[] = [
  from('teressa', '+1 82392 37359', 'teresa@example.com', 'Reminder: Staff meeting tomorrow.', '25 Mar 2024'),
  from('Hellana', '+1 23566 52683', 'hellena@example.com', "Sure, let's discuss it in class.", '14 Apr 2024'),
  from('William', '+1 63792 50310', 'william@example.com', 'Requesting a meeting for next week.', '28 Apr 2024'),
  from('Daniel', '+1 56752 86742', 'daniel@example.com', 'Meeting scheduled for June 10th.', '04 May 2024'),
  from('Galina', '+1 91304 34834', 'galina@example.com', 'Reminder: Staff meeting tomorrow.', '17 May 2024'),
  from('Edward', '+1 56187 87489', 'edward@example.com', "Don't forget to submit the slip.", '20 May 2024'),
  from('Galina', '+1 77502 54845', 'jacquelin@example.com', 'Can we review the test tomorrow?', '03 Jun 2024'),
  from('Garly', '+1 82239 42492', 'gary@example.com', 'Is there a summer camp program?', '15 Jun 2024'),
  from('Morgan', '+1 63204 35730', 'morgan@example.com', 'Yes, registration starts next week.', '27 Jun 2024'),
  from('AAron', '+1 26267 80542', 'aaron@example.com', 'You have a missing assignment.', '10 Jul 2024'),
];

/** Each facet offers what the register holds. */
export const nameOptions = [...new Set(MESSAGES.map((row) => row.name))];
export const dateOptions = [...new Set(MESSAGES.map((row) => row.date))];
