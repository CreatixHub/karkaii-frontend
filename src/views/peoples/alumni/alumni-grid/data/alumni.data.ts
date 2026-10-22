export type AlumniModalId =
  | 'register'
  | 'edit'
  | 'chapter'
  | 'event'
  | 'opportunity'
  | 'invite'
  | 'mentor'
  | 'story';

export interface MemberIntents {
  mentor: boolean;
  recruit: boolean;
  speak: boolean;
}

export interface MemberProfile {
  graduationYear: number;
  department: string;
  profession: string;
  industry: string;
  country: string;
  chapter: string;
  email: string;
  memberSince: string;
  bio: string;
  educationJourney: { icon: string; title: string; org: string; span: string }[];
  professionalJourney: { icon: string; title: string; org: string; span: string; current?: boolean }[];
  achievements: { icon: string; title: string; detail: string }[];
  eventsSummary: string;
  eventHistory: { icon: string; title: string; detail: string; statusLabel: string; statusClass: string }[];
  gallery: { src: string; alt: string }[];
  notes: { text: string; by: string }[];
  skills: string[];
  mentorship: {
    slotsLabel: string;
    format: string;
    focus: string;
    mentees: string;
    grades: string;
  };
  participation: {
    connections: string;
    events: string;
    mentees: string;
    opportunities: string;
    chapterRole: string;
    lastActive: string;
  };
  related: { avatar: string; name: string; meta: string }[];
}

export interface MemberTile {
  id: string;
  name: string;
  avatar: string;
  batchLabel: string;
  batchRange: '2020-2024' | '2015-2019' | '2010-2014' | '2000-2009';
  graduationYear: number;
  role: string;
  department: string;
  company: string;
  industry: string;
  country: string;
  profession: string;
  chapter: string;
  showActiveDot?: boolean;
  intents: MemberIntents;
  tags: string[];
  note: string;
  connectionAvatars: string[];
  extraConnections: number;
  connections: number;
  profile: MemberProfile;
}

const arunProfile: MemberProfile = {
  graduationYear: 2011,
  department: 'Computer Science',
  profession: 'Engineering',
  industry: 'Software & IT',
  country: 'India',
  chapter: 'Bangalore Chapter',
  email: 'arun.k@example.com',
  memberSince: '14 Mar 2012',
  bio: 'Platform engineer with thirteen years building large-scale distributed systems. Returns to campus every August for the hiring drive and keeps two mentoring slots open through the school year.',
  educationJourney: [
    { icon: 'ti ti-building-arch', title: 'B.E. Computer Science', org: 'Anna University, Chennai · First class with distinction', span: '2011 – 2015' },
    { icon: 'ti ti-book', title: 'Higher Secondary — Science Stream', org: 'Karkaii · School topper, Computer Science', span: '2009 – 2011' },
  ],
  professionalJourney: [
    { icon: 'ti ti-brand-google', title: 'Principal Engineer', org: 'Google · Bengaluru, India', span: '2021 – Present', current: true },
    { icon: 'ti ti-cloud', title: 'Staff Software Engineer', org: 'Flipkart · Bengaluru, India', span: '2018 – 2021' },
    { icon: 'ti ti-code', title: 'Software Engineer', org: 'Zoho · Chennai, India', span: '2015 – 2018' },
  ],
  achievements: [
    { icon: 'ti ti-trophy', title: 'Distinguished Alumnus 2026', detail: 'Awarded by the school for sustained contribution to campus placements.' },
    { icon: 'ti ti-certificate', title: 'Google Tech Impact Award', detail: 'For the storage migration that cut regional latency by 40%.' },
    { icon: 'ti ti-users-group', title: '34 students placed since 2022', detail: 'Through the annual alumni-led campus hiring drive.' },
  ],
  eventsSummary: 'Attended 14 · Speaking at 2',
  eventHistory: [
    { icon: 'ti ti-briefcase', title: 'Alumni Career Fair 2026', detail: '14 Oct 2026 · Speaking · Main Sports Complex', statusLabel: 'Speaker', statusClass: 'is-accent' },
    { icon: 'ti ti-glass-full', title: 'Bangalore Networking Meetup', detail: '02 Oct 2026 · Registered · Church Street Social', statusLabel: 'Going', statusClass: 'is-open' },
    { icon: 'ti ti-confetti', title: 'Annual Alumni Reunion 2025', detail: '19 Aug 2025 · Attended · Taj Coromandel', statusLabel: 'Past', statusClass: '' },
  ],
  gallery: [
    { src: 'assets/img/events/event-01.jpg', alt: 'Campus hiring drive 2024' },
    { src: 'assets/img/events/event-02.jpg', alt: 'Reunion dinner' },
    { src: 'assets/img/events/event-03.jpg', alt: 'Mentoring session' },
    { src: 'assets/img/events/event-04.jpg', alt: 'Chapter meetup' },
    { src: 'assets/img/events/event-05.jpg', alt: 'Guest lecture' },
    { src: 'assets/img/blogs/blog-04.jpg', alt: 'Award ceremony' },
  ],
  notes: [
    { text: 'Confirmed as panel lead for the September hiring drive. Prefers sessions after 4 PM IST.', by: 'Kevin Larry · 12 Jul 2026' },
    { text: 'Offered to sponsor the robotics club’s equipment refresh — awaiting a quote from the vendor.', by: 'Alumni Office · 28 May 2026' },
  ],
  skills: ['Distributed Systems', 'Go', 'Kubernetes', 'Site Reliability', 'System Design', 'Mentoring', 'Technical Hiring'],
  mentorship: { slotsLabel: '2 slots open', format: '1:1 video, monthly', focus: 'Engineering careers', mentees: '11 students', grades: 'Grade 11 & 12' },
  participation: {
    connections: '312',
    events: '14',
    mentees: '11',
    opportunities: '6',
    chapterRole: 'Corporate Leaders lead',
    lastActive: '2 days ago',
  },
  related: [
    { avatar: 'assets/img/profiles/avatar-09.jpg', name: 'Vikram Anand', meta: 'Zoho · Batch 2011' },
    { avatar: 'assets/img/profiles/avatar-03.jpg', name: 'Nithya Prakash', meta: 'Freshworks · Batch 2012' },
    { avatar: 'assets/img/profiles/avatar-10.jpg', name: 'Sanjay Pillai', meta: 'Infosys · Batch 2010' },
    { avatar: 'assets/img/profiles/avatar-16.jpg', name: 'Imran Qureshi', meta: 'Siemens · Batch 2011' },
  ],
};

export const memberTiles: MemberTile[] = [
  {
    id: 'arun-krishnan',
    name: 'Arun Krishnan',
    avatar: 'assets/img/profiles/avatar-01.jpg',
    batchLabel: 'Batch 2011',
    batchRange: '2010-2014',
    graduationYear: 2011,
    role: 'Principal Engineer · Computer Science',
    department: 'Computer Science',
    company: 'Google',
    industry: 'Software & IT',
    country: 'India',
    profession: 'Engineering',
    chapter: 'Bangalore Chapter',
    showActiveDot: true,
    intents: { mentor: true, recruit: true, speak: false },
    tags: ['Distributed Systems', 'Go', 'Kubernetes', '+4'],
    note: 'Led the 2024 campus hiring drive — 18 offers made.',
    connectionAvatars: ['assets/img/profiles/avatar-02.jpg', 'assets/img/profiles/avatar-03.jpg', 'assets/img/profiles/avatar-04.jpg'],
    extraConnections: 9,
    connections: 312,
    profile: arunProfile,
  },
  {
    id: 'divya-menon',
    name: 'Divya Menon',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    batchLabel: 'Batch 2016',
    batchRange: '2015-2019',
    graduationYear: 2016,
    role: 'Consultant Cardiologist · Biology',
    department: 'Biology',
    company: 'Apollo Hospitals',
    industry: 'Healthcare',
    country: 'India',
    profession: 'Medicine',
    chapter: 'Chennai Chapter',
    intents: { mentor: true, recruit: false, speak: true },
    tags: ['Cardiology', 'Research', 'Public Health'],
    note: 'Keynote speaker at the 2024 Science Day assembly.',
    connectionAvatars: ['assets/img/profiles/avatar-06.jpg', 'assets/img/profiles/avatar-07.jpg'],
    extraConnections: 5,
    connections: 184,
    profile: arunProfile,
  },
  {
    id: 'rahul-sharma',
    name: 'Rahul Sharma',
    avatar: 'assets/img/profiles/avatar-08.jpg',
    batchLabel: 'Batch 2008',
    batchRange: '2000-2009',
    graduationYear: 2008,
    role: 'Founder & CEO · Commerce',
    department: 'Commerce',
    company: 'Nexlab Ventures',
    industry: 'Fintech',
    country: 'Singapore',
    profession: 'Entrepreneurship',
    chapter: 'Singapore Chapter',
    intents: { mentor: true, recruit: true, speak: true },
    tags: ['Fundraising', 'Product', 'Fintech', '+6'],
    note: 'Funds two full scholarships each academic year.',
    connectionAvatars: ['assets/img/profiles/avatar-09.jpg', 'assets/img/profiles/avatar-10.jpg', 'assets/img/profiles/avatar-11.jpg'],
    extraConnections: 22,
    connections: 640,
    profile: arunProfile,
  },
  {
    id: 'sneha-iyer',
    name: 'Sneha Iyer',
    avatar: 'assets/img/profiles/avatar-12.jpg',
    batchLabel: 'Batch 2019',
    batchRange: '2015-2019',
    graduationYear: 2019,
    role: 'Product Designer · Arts & Humanities',
    department: 'Arts & Humanities',
    company: 'Figma',
    industry: 'Design',
    country: 'United States',
    profession: 'Design',
    chapter: 'USA Chapter',
    intents: { mentor: true, recruit: false, speak: false },
    tags: ['Design Systems', 'Prototyping', 'Accessibility'],
    note: 'Mentors 6 students through the design portfolio programme.',
    connectionAvatars: ['assets/img/profiles/avatar-13.jpg', 'assets/img/profiles/avatar-14.jpg'],
    extraConnections: 3,
    connections: 96,
    profile: arunProfile,
  },
  {
    id: 'mohammed-faisal',
    name: 'Mohammed Faisal',
    avatar: 'assets/img/profiles/avatar-15.jpg',
    batchLabel: 'Batch 2013',
    batchRange: '2010-2014',
    graduationYear: 2013,
    role: 'Investment Director · Commerce',
    department: 'Commerce',
    company: 'Emirates NBD',
    industry: 'Banking',
    country: 'UAE',
    profession: 'Finance',
    chapter: 'Dubai Chapter',
    intents: { mentor: false, recruit: true, speak: true },
    tags: ['Corporate Finance', 'Risk', 'M&A'],
    note: 'Coordinator of the Dubai Chapter since 2021.',
    connectionAvatars: ['assets/img/profiles/avatar-16.jpg', 'assets/img/profiles/avatar-17.jpg'],
    extraConnections: 14,
    connections: 428,
    profile: arunProfile,
  },
  {
    id: 'priya-raghavan',
    name: 'Priya Raghavan',
    avatar: 'assets/img/profiles/avatar-18.jpg',
    batchLabel: 'Batch 2004',
    batchRange: '2000-2009',
    graduationYear: 2004,
    role: 'Professor of Mathematics · Mathematics',
    department: 'Mathematics',
    company: 'Univ. of Edinburgh',
    industry: 'Education',
    country: 'United Kingdom',
    profession: 'Academia',
    chapter: 'UK Chapter',
    intents: { mentor: true, recruit: false, speak: true },
    tags: ['Number Theory', 'Olympiad Coaching', '+2'],
    note: 'Runs the annual Olympiad masterclass for Grades 11 and 12.',
    connectionAvatars: ['assets/img/profiles/avatar-19.jpg', 'assets/img/profiles/avatar-20.jpg'],
    extraConnections: 8,
    connections: 221,
    profile: arunProfile,
  },
];

export const batchOptions: { id: string; label: string }[] = [
  { id: 'all', label: 'All batches' },
  { id: '2020-2024', label: 'Batch of 2020–2024' },
  { id: '2015-2019', label: 'Batch of 2015–2019' },
  { id: '2010-2014', label: 'Batch of 2010–2014' },
  { id: '2000-2009', label: 'Batch of 2000–2009' },
];

export const yearOptions: { id: string; label: string }[] = [
  { id: 'any', label: 'Any year' },
  { id: '2024', label: '2024' },
  { id: '2022', label: '2022' },
  { id: '2019', label: '2019' },
  { id: '2016', label: '2016' },
  { id: '2011', label: '2011' },
];

export const sortMenuOptions: { id: 'recent' | 'name' | 'year' | 'connections'; label: string; icon: string }[] = [
  { id: 'recent', label: 'Recently active', icon: 'ti ti-activity' },
  { id: 'name', label: 'Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'year', label: 'Graduation year', icon: 'ti ti-calendar' },
  { id: 'connections', label: 'Most connected', icon: 'ti ti-users' },
];

export interface AlumniFilterState {
  department: string;
  profession: string;
  country: string;
  chapter: string;
  industry: string;
  openTo: string;
}

export const emptyFilters: AlumniFilterState = {
  department: '',
  profession: '',
  country: '',
  chapter: '',
  industry: '',
  openTo: '',
};

export const departmentOptions = ['Computer Science', 'Commerce', 'Biology', 'Mathematics', 'Arts & Humanities'];
export const professionOptions = ['Engineering', 'Medicine', 'Finance', 'Design', 'Academia', 'Entrepreneurship'];
export const countryOptions = ['India', 'United Arab Emirates', 'Singapore', 'United States', 'United Kingdom', 'Australia'];
export const chapterOptions = ['Chennai Chapter', 'Bangalore Chapter', 'Dubai Chapter', 'Singapore Chapter', 'USA Chapter', 'UK Chapter'];
export const industryOptions = ['Software & IT', 'Healthcare', 'Banking', 'Manufacturing', 'Media', 'Education'];
export const openToOptions: { id: 'mentor' | 'recruit' | 'speak'; label: string }[] = [
  { id: 'mentor', label: 'Mentoring' },
  { id: 'recruit', label: 'Recruitment' },
  { id: 'speak', label: 'Speaking' },
];

export interface ChapterCardData {
  id: string;
  name: string;
  location: string;
  hue: string;
  crestIcon: string;
  statusLabel: string;
  statusClass: 'is-open' | 'is-soon';
  meetupTitle: string;
  meetupWhen: string;
  latest: string;
  coordinatorAvatar: string;
  coordinatorName: string;
  members: string;
}

export const chapterCards: ChapterCardData[] = [
  {
    id: 'chennai',
    name: 'Chennai Chapter',
    location: 'Tamil Nadu, India · Founded 2016',
    hue: 'hue-info',
    crestIcon: 'ti ti-building-arch',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Quarterly Meetup & Dinner',
    meetupWhen: '18 Aug 2026 · Taj Coromandel',
    latest: 'Latest: 24 members confirmed for the mentoring drive.',
    coordinatorAvatar: 'assets/img/profiles/avatar-02.jpg',
    coordinatorName: 'Karthik Vel',
    members: '412',
  },
  {
    id: 'bangalore',
    name: 'Bangalore Chapter',
    location: 'Karnataka, India · Founded 2018',
    hue: 'hue-teal',
    crestIcon: 'ti ti-building-skyscraper',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Tech Alumni Mixer',
    meetupWhen: '02 Sep 2026 · Church Street Social',
    latest: 'Latest: 9 job openings shared by chapter members.',
    coordinatorAvatar: 'assets/img/profiles/avatar-03.jpg',
    coordinatorName: 'Nithya Prakash',
    members: '538',
  },
  {
    id: 'dubai',
    name: 'Dubai Chapter',
    location: 'United Arab Emirates · Founded 2019',
    hue: 'hue-warning',
    crestIcon: 'ti ti-building-mosque',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Gulf Alumni Networking Dinner',
    meetupWhen: '21 Sep 2026 · Jumeirah Beach Hotel',
    latest: 'Latest: Raised ₹4.2L towards the scholarship fund.',
    coordinatorAvatar: 'assets/img/profiles/avatar-15.jpg',
    coordinatorName: 'Mohammed Faisal',
    members: '186',
  },
  {
    id: 'singapore',
    name: 'Singapore Chapter',
    location: 'Singapore · Founded 2020',
    hue: 'hue-success',
    crestIcon: 'ti ti-plant-2',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Founders’ Breakfast',
    meetupWhen: '05 Oct 2026 · Marina Bay Sands',
    latest: 'Latest: 3 internships offered to Grade 12 students.',
    coordinatorAvatar: 'assets/img/profiles/avatar-08.jpg',
    coordinatorName: 'Rahul Sharma',
    members: '124',
  },
  {
    id: 'usa',
    name: 'USA Chapter',
    location: 'North America · Founded 2015',
    hue: 'hue-purple',
    crestIcon: 'ti ti-flag-3',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Virtual Career Roundtable',
    meetupWhen: '12 Oct 2026 · Online',
    latest: 'Latest: New mentor cohort opened for 20 students.',
    coordinatorAvatar: 'assets/img/profiles/avatar-12.jpg',
    coordinatorName: 'Sneha Iyer',
    members: '297',
  },
  {
    id: 'uk',
    name: 'UK Chapter',
    location: 'United Kingdom · Founded 2017',
    hue: 'hue-danger',
    crestIcon: 'ti ti-crown',
    statusLabel: 'Recruiting',
    statusClass: 'is-soon',
    meetupTitle: 'London Reunion Walk',
    meetupWhen: '26 Oct 2026 · South Bank',
    latest: 'Latest: Looking for a co-coordinator for 2026–27.',
    coordinatorAvatar: 'assets/img/profiles/avatar-18.jpg',
    coordinatorName: 'Priya Raghavan',
    members: '143',
  },
  {
    id: 'entrepreneurs',
    name: 'Entrepreneurs Circle',
    location: 'Interest group · Founded 2021',
    hue: 'hue-warning',
    crestIcon: 'ti ti-rocket',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Pitch Clinic for Student Startups',
    meetupWhen: '09 Nov 2026 · Online',
    latest: 'Latest: 5 student ventures reviewed last quarter.',
    coordinatorAvatar: 'assets/img/profiles/avatar-09.jpg',
    coordinatorName: 'Vikram Anand',
    members: '88',
  },
  {
    id: 'corporate-leaders',
    name: 'Corporate Leaders',
    location: 'Interest group · Founded 2019',
    hue: 'hue-info',
    crestIcon: 'ti ti-briefcase',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Leadership Fireside',
    meetupWhen: '23 Nov 2026 · School Auditorium',
    latest: 'Latest: 12 members joined the campus hiring panel.',
    coordinatorAvatar: 'assets/img/profiles/avatar-01.jpg',
    coordinatorName: 'Arun Krishnan',
    members: '156',
  },
  {
    id: 'faculty-alumni',
    name: 'Faculty Alumni',
    location: 'Interest group · Founded 2014',
    hue: 'hue-teal',
    crestIcon: 'ti ti-chalkboard',
    statusLabel: 'Active',
    statusClass: 'is-open',
    meetupTitle: 'Retired Faculty Tea',
    meetupWhen: '07 Dec 2026 · Staff Common Room',
    latest: 'Latest: Yearbook archive project reached 1998.',
    coordinatorAvatar: 'assets/img/profiles/avatar-20.jpg',
    coordinatorName: 'Lakshmi Nair',
    members: '64',
  },
];

export interface RosterPerson {
  avatar: string;
  name: string;
  org: string;
  availabilityLabel: string;
  availabilityClass: 'is-free' | 'is-limited' | 'is-busy';
  metaValue: string;
  metaUnit: string;
}

export interface RosterGroupData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  people: RosterPerson[];
  footerLabel: string;
  footerOpensMentor?: boolean;
}

export const rosterGroups: RosterGroupData[] = [
  {
    id: 'mentors',
    icon: 'ti ti-compass',
    title: 'Mentors',
    subtitle: '48 alumni · 1:1 guidance',
    people: [
      { avatar: 'assets/img/profiles/avatar-01.jpg', name: 'Arun Krishnan', org: 'Google · Systems', availabilityLabel: '2 slots open', availabilityClass: 'is-free', metaValue: '13y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-05.jpg', name: 'Divya Menon', org: 'Apollo · Medicine', availabilityLabel: '1 slot left', availabilityClass: 'is-limited', metaValue: '9y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-18.jpg', name: 'Priya Raghavan', org: 'Edinburgh · Maths', availabilityLabel: 'Waitlist', availabilityClass: 'is-busy', metaValue: '18y', metaUnit: 'exp' },
    ],
    footerLabel: 'View all 48 mentors',
  },
  {
    id: 'experts',
    icon: 'ti ti-bulb',
    title: 'Industry Experts',
    subtitle: '26 alumni · Domain deep-dives',
    people: [
      { avatar: 'assets/img/profiles/avatar-15.jpg', name: 'Mohammed Faisal', org: 'Emirates NBD · Banking', availabilityLabel: 'Available', availabilityClass: 'is-free', metaValue: '11y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-12.jpg', name: 'Sneha Iyer', org: 'Figma · Product Design', availabilityLabel: 'Limited', availabilityClass: 'is-limited', metaValue: '6y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-09.jpg', name: 'Vikram Anand', org: 'Zoho · Cloud', availabilityLabel: 'Available', availabilityClass: 'is-free', metaValue: '10y', metaUnit: 'exp' },
    ],
    footerLabel: 'View all 26 experts',
  },
  {
    id: 'recruiters',
    icon: 'ti ti-briefcase',
    title: 'Recruiters',
    subtitle: '19 alumni · Hiring for their teams',
    people: [
      { avatar: 'assets/img/profiles/avatar-03.jpg', name: 'Nithya Prakash', org: 'Freshworks · Talent', availabilityLabel: '4 roles open', availabilityClass: 'is-free', metaValue: '8y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-08.jpg', name: 'Rahul Sharma', org: 'Nexlab · Founding team', availabilityLabel: '3 roles open', availabilityClass: 'is-free', metaValue: '16y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-11.jpg', name: 'Aisha Banu', org: 'TCS · Campus Hiring', availabilityLabel: 'Season closing', availabilityClass: 'is-limited', metaValue: '12y', metaUnit: 'exp' },
    ],
    footerLabel: 'View all 19 recruiters',
  },
  {
    id: 'founders',
    icon: 'ti ti-rocket',
    title: 'Startup Founders',
    subtitle: '14 alumni · Building ventures',
    people: [
      { avatar: 'assets/img/profiles/avatar-08.jpg', name: 'Rahul Sharma', org: 'Nexlab Ventures', availabilityLabel: 'Open to pitches', availabilityClass: 'is-free', metaValue: '16y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-14.jpg', name: 'Tanvi Deshmukh', org: 'Loopcart', availabilityLabel: 'By referral', availabilityClass: 'is-limited', metaValue: '7y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-17.jpg', name: 'Joseph Mathew', org: 'Aeroflux Labs', availabilityLabel: 'Not available', availabilityClass: 'is-busy', metaValue: '9y', metaUnit: 'exp' },
    ],
    footerLabel: 'View all 14 founders',
  },
  {
    id: 'coaches',
    icon: 'ti ti-target-arrow',
    title: 'Career Coaches',
    subtitle: '11 alumni · Interview & CV help',
    people: [
      { avatar: 'assets/img/profiles/avatar-06.jpg', name: 'Meera Suresh', org: 'Independent · Coaching', availabilityLabel: 'Weekly slots', availabilityClass: 'is-free', metaValue: '14y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-19.jpg', name: 'Daniel George', org: 'LinkedIn · Careers', availabilityLabel: 'Monthly', availabilityClass: 'is-limited', metaValue: '10y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-07.jpg', name: 'Fatima Rizvi', org: 'Deloitte · People', availabilityLabel: 'Available', availabilityClass: 'is-free', metaValue: '12y', metaUnit: 'exp' },
    ],
    footerLabel: 'View all 11 coaches',
  },
  {
    id: 'internships',
    icon: 'ti ti-id-badge-2',
    title: 'Internship Providers',
    subtitle: '22 alumni · Summer placements',
    people: [
      { avatar: 'assets/img/profiles/avatar-10.jpg', name: 'Sanjay Pillai', org: 'Infosys · Engineering', availabilityLabel: '6 seats', availabilityClass: 'is-free', metaValue: '15y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-13.jpg', name: 'Ritika Bose', org: 'Adobe · Design', availabilityLabel: '2 seats', availabilityClass: 'is-limited', metaValue: '8y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-16.jpg', name: 'Imran Qureshi', org: 'Siemens · R&D', availabilityLabel: '4 seats', availabilityClass: 'is-free', metaValue: '13y', metaUnit: 'exp' },
    ],
    footerLabel: 'View all 22 providers',
  },
  {
    id: 'campus-hiring',
    icon: 'ti ti-building-bank',
    title: 'Campus Hiring',
    subtitle: '9 organisations · 2026 season',
    people: [
      { avatar: 'assets/img/profiles/avatar-11.jpg', name: 'TCS', org: 'Represented by Aisha Banu', availabilityLabel: 'Drive on 14 Sep', availabilityClass: 'is-free', metaValue: '40', metaUnit: 'seats' },
      { avatar: 'assets/img/profiles/avatar-03.jpg', name: 'Freshworks', org: 'Represented by Nithya Prakash', availabilityLabel: 'Drive on 28 Sep', availabilityClass: 'is-limited', metaValue: '18', metaUnit: 'seats' },
      { avatar: 'assets/img/profiles/avatar-16.jpg', name: 'Siemens', org: 'Represented by Imran Qureshi', availabilityLabel: 'Dates pending', availabilityClass: 'is-busy', metaValue: '12', metaUnit: 'seats' },
    ],
    footerLabel: 'View hiring calendar',
  },
  {
    id: 'lecturers',
    icon: 'ti ti-microphone-2',
    title: 'Guest Lecturers',
    subtitle: '17 alumni · Classroom sessions',
    people: [
      { avatar: 'assets/img/profiles/avatar-18.jpg', name: 'Priya Raghavan', org: 'Mathematics · Grade 11–12', availabilityLabel: 'Term 2', availabilityClass: 'is-free', metaValue: '18y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-05.jpg', name: 'Divya Menon', org: 'Biology · Grade 10–12', availabilityLabel: 'One session', availabilityClass: 'is-limited', metaValue: '9y', metaUnit: 'exp' },
      { avatar: 'assets/img/profiles/avatar-15.jpg', name: 'Mohammed Faisal', org: 'Commerce · Grade 12', availabilityLabel: 'Remote only', availabilityClass: 'is-free', metaValue: '11y', metaUnit: 'exp' },
    ],
    footerLabel: 'Invite a speaker',
    footerOpensMentor: true,
  },
];

export interface OpportunityData {
  id: string;
  title: string;
  orgAvatar: string;
  orgName: string;
  categoryLabel: string;
  metaLocationIcon: string;
  metaLocation: string;
  metaSecondIcon: string;
  metaSecond: string;
  deadlineText: string;
  statusLabel: string;
  statusClass: 'is-open' | 'is-soon' | 'is-closed';
}

export const opportunities: OpportunityData[] = [
  { id: 'op1', title: 'Graduate Software Engineer', orgAvatar: 'assets/img/profiles/avatar-01.jpg', orgName: 'Google', categoryLabel: 'Job', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Bengaluru, India', metaSecondIcon: 'ti ti-clock', metaSecond: 'Full time', deadlineText: 'Closes 30 Aug 2026', statusLabel: '14 days left', statusClass: 'is-open' },
  { id: 'op2', title: 'Summer Design Internship', orgAvatar: 'assets/img/profiles/avatar-13.jpg', orgName: 'Adobe', categoryLabel: 'Internship', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Remote', metaSecondIcon: 'ti ti-clock', metaSecond: '8 weeks', deadlineText: 'Closes 12 Aug 2026', statusLabel: '9 days left', statusClass: 'is-soon' },
  { id: 'op3', title: 'Alumni Merit Scholarship', orgAvatar: 'assets/img/profiles/avatar-08.jpg', orgName: 'Nexlab Ventures', categoryLabel: 'Scholarship', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Open to all campuses', metaSecondIcon: 'ti ti-coin', metaSecond: '₹1.5L / year', deadlineText: 'Closes 20 Sep 2026', statusLabel: 'Open', statusClass: 'is-open' },
  { id: 'op4', title: 'Mentorship Cohort — Autumn', orgAvatar: 'assets/img/profiles/avatar-12.jpg', orgName: 'USA Chapter', categoryLabel: 'Mentorship', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Online', metaSecondIcon: 'ti ti-users', metaSecond: '20 places', deadlineText: 'Closes 05 Sep 2026', statusLabel: 'Open', statusClass: 'is-open' },
  { id: 'op5', title: 'Supplier Partnership Programme', orgAvatar: 'assets/img/profiles/avatar-16.jpg', orgName: 'Siemens', categoryLabel: 'Collaboration', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Chennai, India', metaSecondIcon: 'ti ti-building', metaSecond: 'B2B', deadlineText: 'Closes 18 Oct 2026', statusLabel: 'Open', statusClass: 'is-open' },
  { id: 'op6', title: 'Seed Investment — EdTech', orgAvatar: 'assets/img/profiles/avatar-14.jpg', orgName: 'Loopcart', categoryLabel: 'Investment', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Singapore', metaSecondIcon: 'ti ti-coin', metaSecond: 'Up to $50k', deadlineText: 'Closes 02 Aug 2026', statusLabel: 'Closing', statusClass: 'is-closed' },
  { id: 'op7', title: 'Weekend Literacy Volunteers', orgAvatar: 'assets/img/profiles/avatar-02.jpg', orgName: 'Chennai Chapter', categoryLabel: 'Volunteer', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'Chennai, India', metaSecondIcon: 'ti ti-clock', metaSecond: '4 hrs / week', deadlineText: 'Rolling intake', statusLabel: 'Open', statusClass: 'is-open' },
  { id: 'op8', title: 'Careers in Medicine — Campus Talk', orgAvatar: 'assets/img/profiles/avatar-05.jpg', orgName: 'Apollo Hospitals', categoryLabel: 'Campus Talk', metaLocationIcon: 'ti ti-map-pin', metaLocation: 'School Auditorium', metaSecondIcon: 'ti ti-users', metaSecond: 'Grade 11–12', deadlineText: 'Confirm by 25 Aug 2026', statusLabel: 'Awaiting', statusClass: 'is-soon' },
];

export interface EventData {
  id: string;
  day: string;
  month: string;
  time: string;
  title: string;
  location: string;
  organizer: string;
  registered: number;
  capacity: number;
  progressWidthClass: string;
  progressModifier?: 'is-warm' | 'is-full';
  statusIcon: string;
  statusLabel: string;
  statusClass: 'is-open' | 'is-soon' | 'is-closed';
}

export const events: EventData[] = [
  { id: 'ev1', day: '18', month: 'Aug', time: '6:30 PM', title: 'Annual Alumni Reunion 2026', location: 'Taj Coromandel, Chennai', organizer: 'Chennai Chapter', registered: 386, capacity: 500, progressWidthClass: 'width-78', statusIcon: 'ti ti-circle-check', statusLabel: 'RSVP open', statusClass: 'is-open' },
  { id: 'ev2', day: '06', month: 'Sep', time: '10:00 AM', title: 'Silver Jubilee — Batch of 2001', location: 'School Campus', organizer: 'Alumni Office', registered: 142, capacity: 180, progressWidthClass: 'width-78', progressModifier: 'is-warm', statusIcon: 'ti ti-clock', statusLabel: 'Filling fast', statusClass: 'is-soon' },
  { id: 'ev3', day: '27', month: 'Sep', time: '11:00 AM', title: 'Golden Jubilee — Batch of 1976', location: 'Heritage Hall', organizer: 'Faculty Alumni', registered: 58, capacity: 120, progressWidthClass: 'width-44', statusIcon: 'ti ti-circle-check', statusLabel: 'RSVP open', statusClass: 'is-open' },
  { id: 'ev4', day: '02', month: 'Oct', time: '7:00 PM', title: 'Bangalore Networking Meetup', location: 'Church Street Social', organizer: 'Bangalore Chapter', registered: 94, capacity: 100, progressWidthClass: 'width-92', progressModifier: 'is-full', statusIcon: 'ti ti-alert-circle', statusLabel: '6 seats left', statusClass: 'is-closed' },
  { id: 'ev5', day: '14', month: 'Oct', time: '9:00 AM', title: 'Alumni Career Fair 2026', location: 'Main Sports Complex', organizer: 'Corporate Leaders', registered: 412, capacity: 800, progressWidthClass: 'width-52', statusIcon: 'ti ti-circle-check', statusLabel: 'RSVP open', statusClass: 'is-open' },
  { id: 'ev6', day: '09', month: 'Nov', time: '4:00 PM', title: 'Alumni Startup Summit', location: 'Online · Zoom', organizer: 'Entrepreneurs Circle', registered: 231, capacity: 400, progressWidthClass: 'width-58', statusIcon: 'ti ti-circle-check', statusLabel: 'RSVP open', statusClass: 'is-open' },
  { id: 'ev7', day: '23', month: 'Nov', time: '6:00 PM', title: 'Webinar: Studying Abroad in 2027', location: 'Online · Teams', organizer: 'UK Chapter', registered: 168, capacity: 600, progressWidthClass: 'width-30', statusIcon: 'ti ti-circle-check', statusLabel: 'RSVP open', statusClass: 'is-open' },
  { id: 'ev8', day: '13', month: 'Dec', time: '8:00 AM', title: 'Alumni vs Students Sports Meet', location: 'School Grounds', organizer: 'Sports Committee', registered: 76, capacity: 250, progressWidthClass: 'width-30', statusIcon: 'ti ti-circle-check', statusLabel: 'RSVP open', statusClass: 'is-open' },
];

export interface SpotlightData {
  id: string;
  photo: string;
  alt: string;
  awardIcon: string;
  awardLabel: string;
  headline: string;
  body: string;
  personAvatar: string;
  personName: string;
  personMeta: string;
}

export const spotlights: SpotlightData[] = [
  {
    id: 'spot-arun',
    photo: 'assets/img/blogs/blog-01.jpg',
    alt: 'Arun Krishnan at the campus hiring drive',
    awardIcon: 'ti ti-trophy',
    awardLabel: 'Distinguished Alumnus 2026',
    headline: 'From the school computer lab to leading a platform team at Google',
    body: 'Arun credits the school’s robotics club for his first line of code. Fifteen years on, he runs the campus hiring drive that has placed 34 students since 2022.',
    personAvatar: 'assets/img/profiles/avatar-01.jpg',
    personName: 'Arun Krishnan',
    personMeta: 'Google · Batch 2011',
  },
  {
    id: 'spot-divya',
    photo: 'assets/img/blogs/blog-02.jpg',
    alt: 'Divya Menon in the cardiology unit',
    awardIcon: 'ti ti-medal',
    awardLabel: 'State Healthcare Excellence Award',
    headline: 'Building a rural cardiac screening programme across three districts',
    body: 'Divya’s mobile screening units have examined more than 11,000 patients. She returns each Science Day to talk to Grade 12 about medicine as a public service.',
    personAvatar: 'assets/img/profiles/avatar-05.jpg',
    personName: 'Divya Menon',
    personMeta: 'Apollo Hospitals · Batch 2016',
  },
  {
    id: 'spot-rahul',
    photo: 'assets/img/blogs/blog-03.jpg',
    alt: 'Rahul Sharma presenting at a summit',
    awardIcon: 'ti ti-award',
    awardLabel: 'Young Entrepreneur of the Year',
    headline: 'Two scholarships a year, funded by the company he started in a hostel room',
    body: 'Nexlab now employs 240 people across three countries. Rahul endows two full scholarships every year and mentors the Entrepreneurs Circle pitch clinic.',
    personAvatar: 'assets/img/profiles/avatar-08.jpg',
    personName: 'Rahul Sharma',
    personMeta: 'Nexlab Ventures · Batch 2008',
  },
];

export interface ResourceData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export const resources: ResourceData[] = [
  { id: 'directory', icon: 'ti ti-address-book', title: 'Alumni Directory', subtitle: '4,120 verified members' },
  { id: 'gallery', icon: 'ti ti-photo', title: 'Photo Gallery', subtitle: '62 albums · 1998 to date' },
  { id: 'yearbook', icon: 'ti ti-book-2', title: 'Yearbook', subtitle: 'Digitised, 1976 onwards' },
  { id: 'magazine', icon: 'ti ti-news', title: 'Digital Magazine', subtitle: 'Quarterly · Issue 42' },
  { id: 'news', icon: 'ti ti-speakerphone', title: 'Community News', subtitle: '18 updates this month' },
  { id: 'career', icon: 'ti ti-briefcase-2', title: 'Career Resources', subtitle: 'CV guides & interview kits' },
  { id: 'business', icon: 'ti ti-building-store', title: 'Business Directory', subtitle: '217 alumni-run businesses' },
  { id: 'mentor-library', icon: 'ti ti-library', title: 'Mentor Library', subtitle: 'Recorded sessions & notes' },
];

export interface ActionTileData {
  id: string;
  icon: string;
  title: string;
  desc: string;
  modal: AlumniModalId;
}

export const actionTiles: ActionTileData[] = [
  { id: 'register', icon: 'ti ti-user-plus', title: 'Register Alumni', desc: 'Add a former student and verify their batch.', modal: 'register' },
  { id: 'opportunity', icon: 'ti ti-briefcase', title: 'Post Opportunity', desc: 'Publish a job, internship or scholarship.', modal: 'opportunity' },
  { id: 'event', icon: 'ti ti-calendar-plus', title: 'Create Event', desc: 'Schedule a reunion, meetup or webinar.', modal: 'event' },
  { id: 'newsletter', icon: 'ti ti-mail-star', title: 'Launch Newsletter', desc: 'Send the quarterly digest to a segment.', modal: 'invite' },
  { id: 'chapter', icon: 'ti ti-flag-3', title: 'Create Chapter', desc: 'Open a new regional or interest group.', modal: 'chapter' },
  { id: 'mentor', icon: 'ti ti-compass', title: 'Request Mentor', desc: 'Match a student with an alumni mentor.', modal: 'mentor' },
  { id: 'recruit', icon: 'ti ti-user-search', title: 'Recruit Alumni', desc: 'Invite members onto a hiring panel.', modal: 'invite' },
  { id: 'speaker', icon: 'ti ti-microphone-2', title: 'Invite Speaker', desc: 'Book an alumnus for a classroom session.', modal: 'mentor' },
];

export const graduationYearModalOptions = ['2024', '2022', '2019', '2016', '2011'];
export const registerIndustryOptions = ['Software & IT', 'Healthcare', 'Banking', 'Education', 'Media'];
export const registerCountryOptions = ['India', 'United Arab Emirates', 'Singapore', 'United States', 'United Kingdom'];
export const editChapterOptions = ['Bangalore Chapter', 'Chennai Chapter', 'USA Chapter'];
export const editCountryOptions = ['India', 'Singapore', 'United States'];
export const chapterModalOptions = ['Unassigned', 'Chennai Chapter', 'Bangalore Chapter', 'Dubai Chapter', 'USA Chapter'];
export const coordinatorOptions = ['Select alumnus', 'Arun Krishnan', 'Divya Menon', 'Mohammed Faisal'];
export const chapterTypeOptions = ['Regional', 'Interest group', 'Batch group'];
export const eventTypeOptions = ['Reunion', 'Networking Meetup', 'Career Fair', 'Startup Summit', 'Webinar', 'Sports Meet'];
export const organiserOptions = ['Alumni Office', 'Chennai Chapter', 'Bangalore Chapter', 'Entrepreneurs Circle'];
export const opportunityCategoryOptions = ['Job', 'Internship', 'Scholarship', 'Mentorship', 'Business Collaboration', 'Investment', 'Volunteer Programme', 'Campus Talk'];
export const postedByOptions = ['Arun Krishnan', 'Rahul Sharma', 'Nithya Prakash'];
export const openToAudienceOptions = ['Students', 'Alumni', 'Students & alumni'];
export const inviteToOptions = ['Alumni Network', 'A chapter', 'An event', 'Hiring panel'];
export const templateOptions = ['Standard welcome', 'Reunion invitation', 'Mentor recruitment', 'Newsletter opt-in'];
export const studentOptions = ['Select student', 'Janet Daniel · Grade 12 A', 'Joann Michael · Grade 11 B', 'Kathleen Rice · Grade 12 C'];
export const preferredMentorOptions = ['Any available mentor', 'Arun Krishnan · Engineering', 'Divya Menon · Medicine', 'Sneha Iyer · Design'];
export const focusAreaOptions = ['Career guidance', 'Higher studies', 'Interview preparation', 'Entrepreneurship'];
export const mentorFormatOptions = ['1:1 video', 'In person', 'Email only'];
export const durationOptions = ['One session', '3 months', '6 months', 'Full academic year'];
export const alumnusOptions = ['Select alumnus', 'Arun Krishnan', 'Divya Menon', 'Rahul Sharma', 'Sneha Iyer'];
