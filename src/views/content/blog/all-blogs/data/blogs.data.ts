export type BlogStatus = 'Active' | 'Inactive';

export interface BlogPost {
  id: string;
  cover: string;
  date: string;
  author: string;
  authorPhoto: string;
  title: string;
  category: string;
  likes: number;
  comments: number;
  shares: number;
  reviews: number;
  status: BlogStatus;
}

export const POSTS: BlogPost[] = [
  {
    id: 'personal-development',
    cover: 'assets/img/blogs/blog-01.jpg',
    date: 'July 2024',
    author: 'Jordan',
    authorPhoto: 'assets/img/profiles/avatar-27.jpg',
    title: 'Personal development and self-improvement',
    category: 'Education',
    likes: 3000,
    comments: 454,
    shares: 102,
    reviews: 350,
    status: 'Active',
  },
  {
    id: 'five-strategies',
    cover: 'assets/img/blogs/blog-02.jpg',
    date: '12 July 2024',
    author: 'Rubiaana',
    authorPhoto: 'assets/img/profiles/avatar-24.jpg',
    title: '5 Effective Strategies to Boost Your Productivity',
    category: 'Clear Goals',
    likes: 1200,
    comments: 12,
    shares: 89,
    reviews: 56,
    status: 'Active',
  },
  {
    id: 'prioritize',
    cover: 'assets/img/blogs/blog-03.jpg',
    date: '10 July 2024',
    author: 'Daniel',
    authorPhoto: 'assets/img/profiles/avatar-15.jpg',
    title: 'Prioritize Your Tasks',
    category: 'Education',
    likes: 5000,
    comments: 535,
    shares: 24,
    reviews: 78,
    status: 'Inactive',
  },
  {
    id: 'distractions',
    cover: 'assets/img/blogs/blog-04.jpg',
    date: '10 July 2024',
    author: 'Daniel',
    authorPhoto: 'assets/img/profiles/avatar-15.jpg',
    title: 'How to eliminate Eliminate Distractions',
    category: 'Advice',
    likes: 2345,
    comments: 135,
    shares: 32,
    reviews: 154,
    status: 'Inactive',
  },
  {
    id: 'regular-breaks',
    cover: 'assets/img/blogs/blog-05.jpg',
    date: '18 July 2024',
    author: 'Henrita',
    authorPhoto: 'assets/img/profiles/avatar-01.jpg',
    title: 'Steps to Take Regular Breaks before learning',
    category: 'Advice',
    likes: 2454,
    comments: 165,
    shares: 22,
    reviews: 164,
    status: 'Active',
  },
  {
    id: 'time-management',
    cover: 'assets/img/blogs/blog-06.jpg',
    date: '18 July 2024',
    author: 'Zlatan',
    authorPhoto: 'assets/img/profiles/avatar-02.jpg',
    title: 'Using Time Management Techniques',
    category: 'Clear Goals',
    likes: 4343,
    comments: 233,
    shares: 11,
    reviews: 454,
    status: 'Active',
  },
];

/** The four figures a card shows, in the order the template lays them out. */
export const engagementOf = (post: BlogPost) => [
  { id: 'likes', label: 'Likes', value: post.likes },
  { id: 'comments', label: 'Comments', value: post.comments },
  { id: 'shares', label: 'Share', value: post.shares },
  { id: 'reviews', label: 'Reviews', value: post.reviews },
];

export const statusTint = (status: BlogStatus) => (status === 'Active' ? 'success' : 'danger');

/** Each facet offers what the register holds. */
export const categoryOptions = [...new Set(POSTS.map((row) => row.category))];
export const authorOptions = [...new Set(POSTS.map((row) => row.author))];
export const statusOptions: BlogStatus[] = ['Active', 'Inactive'];
export const dateOptions = [...new Set(POSTS.map((row) => row.date))];
