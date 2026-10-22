export interface BlogComment {
  id: string;
  comment: string;
  date: string;
  /** Out of five; the star row is drawn from it. */
  rating: number;
  post: string;
  by: string;
  published: boolean;
}

export const MAX_STARS = 5;

/** How many stars are filled, and how many are left empty. */
export const starsOf = (rating: number) => {
  const filled = Math.round(rating);
  return Array.from({ length: MAX_STARS }, (_, index) => index < filled);
};

const said = (
  comment: string,
  date: string,
  rating: number,
  post: string,
  by: string,
): BlogComment => ({
  id: `${by.toLowerCase()}-${date.replace(/\s+/g, '-').toLowerCase()}`,
  comment,
  date,
  rating,
  post,
  by,
  published: false,
});

export const COMMENTS: BlogComment[] = [
  said('I absolutely loved this article!... The insights', '25 May 2024', 5, '5 Effective Strategies to Boost Your Productivity', 'Rubiaana'),
  said('Self-improvement is a continuous journey', '15 May 2024', 5, 'Personal development and self-improvement', 'Jordan'),
  said('Prioritizing tasks makes a huge difference.', '12 May 2024', 5, 'Prioritize Your Tasks', 'Daniel'),
  said('Turning off notifications helped me focus', '27 Apr 2024', 5, 'How to eliminate Eliminate Distractions', 'Letitia'),
  said('Regular breaks improve my retention.', '16 Apr 2024', 5, 'Steps to Take Regular Breaks before learning', 'Henrita'),
  said('Using a planner keeps me on track', '10 Apr 2024', 5, 'Using Time Management Techniques', 'Ziatan'),
  said('Great strategies for schools!', '24 Mar 2024', 5, 'Effective Strategies for School Administration', 'Jason'),
  said('Excited to learn about tech in schools!', '18 Mar 2024', 5, 'Implementing Technology in School Management', 'Gloria'),
  said('Communication is key in any organization', '11 Mar 2024', 5, 'Building Strong Communication Channels in Schools', 'Elizabeth'),
  said('Improving staff training sounds promising!', '20 Feb 2024', 5, 'Effective Staff Training and Development in Schools', 'Michael'),
  said('Safety is paramount in schools', '19 Feb 2024', 5, 'Ensuring Safety and Security Measures in Schools', 'Richard'),
];

/** Each facet offers what the register holds. */
export const dateOptions = [...new Set(COMMENTS.map((row) => row.date))];
export const postOptions = [...new Set(COMMENTS.map((row) => row.post))];
export const byOptions = [...new Set(COMMENTS.map((row) => row.by))];
