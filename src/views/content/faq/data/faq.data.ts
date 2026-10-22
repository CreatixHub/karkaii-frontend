export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/** The template's first reference; every row below counts down from it. */
export const REF_TOP = 354869;

export const refOf = (index: number) => `Q${REF_TOP - index}`;

const ask = (question: string, answer: string, category: string): FaqEntry => ({
  id: question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40),
  question,
  answer,
  category,
});

export const FAQS: FaqEntry[] = [
  ask('How do I reset my password?', 'How do I reset my password?', 'Account'),
  ask(
    'How do I update my contact information?',
    'You can update your contact information in the "My Account"',
    'Account',
  ),
  ask(
    'How can I contact the IT support team?',
    'Contact support via email at support@example.com',
    'Support',
  ),
  ask(
    'Where can I find information about school events?',
    "Information is available on the website's Events page",
    'Events',
  ),
  ask(
    'How do I access online learning resources?',
    "Access resources through the school's LMS",
    'Academic',
  ),
  ask(
    'Where can I find information about school fees?',
    'Information is available on the Fees & Payments page',
    'Finance',
  ),
  ask(
    'How do I register for extracurricular activities?',
    "Register through the school portal's Extracurriculars section.",
    'Academic',
  ),
  ask(
    'Can I volunteer at the school?',
    'Yes, volunteering opportunities are available at the school.',
    'General',
  ),
  ask(
    "What are the school's hours of operation?",
    'School hours vary by department and are typically posted',
    'Academic',
  ),
  ask(
    'How can I request a tour of the school campus?',
    'Contact the admissions office to schedule a tour with a staff',
    'General',
  ),
];

/** Each facet offers what the register holds. */
export const questionOptions = FAQS.map((row) => row.question);
export const categoryOptions = [...new Set(FAQS.map((row) => row.category))];
