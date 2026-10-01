export type Role = 'Parent' | 'Teacher' | 'Student' | 'Admin';

export interface Testimonial {
  id: string;
  author: string;
  role: Role;
  content: string;
  addedOn: string;
}

/** The template's first reference; every row below counts down from it. */
export const REF_TOP = 346285;

export const refOf = (index: number) => `T${REF_TOP - index}`;

const say = (author: string, role: Role, content: string, addedOn: string): Testimonial => ({
  id: author.toLowerCase(),
  author,
  role,
  content,
  addedOn,
});

export const TESTIMONIALS: Testimonial[] = [
  say(
    'Thomas',
    'Parent',
    '"I\'m impressed with how easy it is to track my child\'s progress using this system."',
    '25 Apr 2024',
  ),
  say(
    'Teresa',
    'Teacher',
    '"The gradebook feature has streamlined my grading process”',
    '28 Apr 2024',
  ),
  say(
    'Veronica',
    'Student',
    '"I find the timetable feature very helpful in keeping track of my classes and assignments."',
    '02 May 2024',
  ),
  say(
    'Kevin',
    'Admin',
    '"Our school has seen a significant improvement in efficiency since implementing this system."',
    '14 May 2024',
  ),
  say(
    'Claudia',
    'Parent',
    '"The communication tools have made it much easier to stay informed about school events”',
    '20 May 2024',
  ),
  say(
    'Hellana',
    'Teacher',
    '"I appreciate the support provided by the technical team in customizing the system”',
    '05 Jun 2024',
  ),
  say(
    'Robert',
    'Parent',
    '"The online payment system has made fee payments hassle-free. Great addition to the system!"',
    '16 Jun 2024',
  ),
  say(
    'Daniel',
    'Admin',
    '"The system\'s user interface is intuitive and easy to navigate, even for non-technical users."',
    '21 Jun 2024',
  ),
  say(
    'Michael',
    'Parent',
    '"The parent-teacher communication portal has facilitated open dialogue and collaboration”',
    '10 Jul 2024',
  ),
  say(
    'Aaron',
    'Teacher',
    '"The system\'s lesson planning tools have helped me organize and deliver more effective lessons."',
    '12 Jul 2024',
  ),
];

/** Each facet offers what the register holds. */
export const authorOptions = TESTIMONIALS.map((row) => row.author);
export const roleOptions = [...new Set(TESTIMONIALS.map((row) => row.role))];
