/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

/** The `bg-transparent-*` / `text-*` colour family a slot is painted with. */
export type SlotTone = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light';

/** Which dialog the slot menu's "View Details" item opens. */
export type SlotDetailsModal = 'scheduleDetails' | 'meetingDetails';

export interface SlotMeta {
  icon: string;
  label: string;
}

export interface SlotBadge {
  className: string;
  /** Bare status badges ("Free", "Break", …) carry no icon in the template. */
  icon?: string;
  label: string;
}

export interface TimetableSlot {
  id: string;
  tone: SlotTone;
  icon: string;
  iconTone: string;
  /** The week's opening card is an `h5`; every other card is an `h6`. */
  heading: 'h5' | 'h6';
  headingClass: string;
  subject: string;
  time: string;
  metas: SlotMeta[];
  badges: SlotBadge[];
  /** Non-teaching slots carry one bare badge instead of the badge row. */
  soloBadge?: SlotBadge;
  detailsModal: SlotDetailsModal;
  /** Teaching periods carry the eight-item menu; the rest carry two. */
  fullMenu: boolean;
}

export interface TimetableDay {
  id: string;
  name: string;
  slots: TimetableSlot[];
}

/* -------------------------------------------------------------------------- */
/*                              Teacher profile                               */
/* -------------------------------------------------------------------------- */

export interface ProfileFact {
  icon: string;
  label: string;
  value: string;
}

export interface StatFact {
  id: string;
  icon: string;
  iconClass: string;
  value: string;
  label: string;
}

export const teacherProfile = {
  name: 'Teresa',
  code: 'T849126',
  status: 'On Duty',
  avatar: 'assets/img/teachers/teacher-01.jpg',
  phone: '+14654884498',
  facts: [
    { icon: 'ti ti-building-community me-1', label: 'Department', value: 'Science' },
    { icon: 'ti ti-briefcase me-1', label: 'Designation', value: 'Senior Teacher' },
    { icon: 'ti ti-book me-1', label: 'Subjects', value: 'Physics, Science, Maths' },
    { icon: 'ti ti-home me-1', label: 'Homeroom', value: 'III - A' },
    { icon: 'ti ti-map-pin me-1', label: 'Office', value: 'Staff Room 2' },
  ] as ProfileFact[],
};

export const statFacts: StatFact[] = [
  {
    id: 'teaching',
    icon: 'ti ti-clock-hour-9',
    iconClass: 'bg-primary-transparent text-primary',
    value: '36 hrs',
    label: 'Weekly Teaching',
  },
  {
    id: 'available',
    icon: 'ti ti-coffee',
    iconClass: 'bg-success-transparent text-success',
    value: '8 hrs',
    label: 'Available Hours',
  },
  {
    id: 'classes',
    icon: 'ti ti-users',
    iconClass: 'bg-info-transparent text-info',
    value: '6',
    label: 'Classes Assigned',
  },
];

/* -------------------------------------------------------------------------- */
/*                              The schedule grid                             */
/* -------------------------------------------------------------------------- */

export const timetableWeek: TimetableDay[] = [
  {
    id: 'monday',
    name: 'Monday',
    slots: [
      {
        id: 'monday-1',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h5',
        headingClass: 'timetable-slot-sub mb-0 text-truncate fs-15',
        subject: 'Physics',
        time: '09:00 - 09:45 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class III - A' },
          { icon: 'ti ti-door me-1', label: 'Room 104' },
          { icon: 'ti ti-user me-1', label: '32 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'monday-2',
        tone: 'info',
        icon: 'ti ti-atom-2',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Science',
        time: '09:45 - 10:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class IV - B' },
          { icon: 'ti ti-door me-1', label: 'Lab 2' },
          { icon: 'ti ti-user me-1', label: '30 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-flask-2 me-1', label: 'Lab' },
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'monday-3',
        tone: 'light',
        icon: 'ti ti-coffee',
        iconTone: 'text-secondary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Free Period',
        time: '10:45 - 11:30 AM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-secondary', label: 'Free' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'monday-4',
        tone: 'danger',
        icon: 'ti ti-math-symbols',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Maths',
        time: '11:30 - 12:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class V - A' },
          { icon: 'ti ti-door me-1', label: 'Room 101' },
          { icon: 'ti ti-user me-1', label: '34 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-primary', icon: 'ti ti-video me-1', label: 'Online' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'monday-5',
        tone: 'warning',
        icon: 'ti ti-tools-kitchen-2',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Lunch Break',
        time: '12:15 - 01:30 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-warning', label: 'Break' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'monday-6',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '01:30 - 02:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class VI - A' },
          { icon: 'ti ti-door me-1', label: 'Room 105' },
          { icon: 'ti ti-user me-1', label: '31 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'monday-7',
        tone: 'primary',
        icon: 'ti ti-users-group',
        iconTone: 'text-primary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Staff Meeting',
        time: '02:15 - 03:00 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-primary', label: 'Meeting' },
        detailsModal: 'meetingDetails',
        fullMenu: false,
      },
    ],
  },
  {
    id: 'tuesday',
    name: 'Tuesday',
    slots: [
      {
        id: 'tuesday-1',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '09:00 - 09:45 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class III - B' },
          { icon: 'ti ti-door me-1', label: 'Room 104' },
          { icon: 'ti ti-user me-1', label: '33 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'tuesday-2',
        tone: 'info',
        icon: 'ti ti-atom-2',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Science',
        time: '09:45 - 10:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class V - B' },
          { icon: 'ti ti-door me-1', label: 'Lab 2' },
          { icon: 'ti ti-user me-1', label: '29 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-flask-2 me-1', label: 'Lab' },
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'tuesday-3',
        tone: 'danger',
        icon: 'ti ti-math-symbols',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Maths',
        time: '10:45 - 11:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class IV - A' },
          { icon: 'ti ti-door me-1', label: 'Room 101' },
          { icon: 'ti ti-user me-1', label: '35 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-versions me-1', label: 'Hybrid' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'tuesday-4',
        tone: 'danger',
        icon: 'ti ti-clipboard-check',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Examination Duty',
        time: '11:30 - 12:15 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-danger', label: 'Exam Duty' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'tuesday-5',
        tone: 'warning',
        icon: 'ti ti-tools-kitchen-2',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Lunch Break',
        time: '12:15 - 01:30 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-warning', label: 'Break' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'tuesday-6',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '01:30 - 02:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class VI - B' },
          { icon: 'ti ti-door me-1', label: 'Room 105' },
          { icon: 'ti ti-user me-1', label: '30 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'tuesday-7',
        tone: 'secondary',
        icon: 'ti ti-books',
        iconTone: 'text-secondary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Library Duty',
        time: '02:15 - 03:00 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-secondary', label: 'Duty' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
    ],
  },
  {
    id: 'wednesday',
    name: 'Wednesday',
    slots: [
      {
        id: 'wednesday-1',
        tone: 'light',
        icon: 'ti ti-coffee',
        iconTone: 'text-secondary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Free Period',
        time: '09:00 - 09:45 AM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-secondary', label: 'Free' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'wednesday-2',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '09:45 - 10:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class III - A' },
          { icon: 'ti ti-door me-1', label: 'Room 104' },
          { icon: 'ti ti-user me-1', label: '32 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'wednesday-3',
        tone: 'info',
        icon: 'ti ti-atom-2',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Science',
        time: '10:45 - 11:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class IV - B' },
          { icon: 'ti ti-door me-1', label: 'Lab 2' },
          { icon: 'ti ti-user me-1', label: '30 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-flask-2 me-1', label: 'Lab' },
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'wednesday-4',
        tone: 'danger',
        icon: 'ti ti-math-symbols',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Maths',
        time: '11:30 - 12:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class V - A' },
          { icon: 'ti ti-door me-1', label: 'Room 101' },
          { icon: 'ti ti-user me-1', label: '34 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-warning', icon: 'ti ti-user-check me-1', label: 'Substitute' },
          { className: 'badge-soft-primary', icon: 'ti ti-video me-1', label: 'Online' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'wednesday-5',
        tone: 'warning',
        icon: 'ti ti-tools-kitchen-2',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Lunch Break',
        time: '12:15 - 01:30 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-warning', label: 'Break' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'wednesday-6',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '01:30 - 02:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class VI - A' },
          { icon: 'ti ti-door me-1', label: 'Room 105' },
          { icon: 'ti ti-user me-1', label: '31 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'wednesday-7',
        tone: 'success',
        icon: 'ti ti-ball-football',
        iconTone: 'text-success',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Sports Duty',
        time: '02:15 - 03:00 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-success', label: 'Duty' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
    ],
  },
  {
    id: 'thursday',
    name: 'Thursday',
    slots: [
      {
        id: 'thursday-1',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '09:00 - 09:45 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class III - B' },
          { icon: 'ti ti-door me-1', label: 'Room 104' },
          { icon: 'ti ti-user me-1', label: '33 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'thursday-2',
        tone: 'danger',
        icon: 'ti ti-math-symbols',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Maths',
        time: '09:45 - 10:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class IV - A' },
          { icon: 'ti ti-door me-1', label: 'Room 101' },
          { icon: 'ti ti-user me-1', label: '35 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'thursday-3',
        tone: 'info',
        icon: 'ti ti-user-heart',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Parent Meeting',
        time: '10:45 - 11:30 AM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-info', label: 'Meeting' },
        detailsModal: 'meetingDetails',
        fullMenu: false,
      },
      {
        id: 'thursday-4',
        tone: 'info',
        icon: 'ti ti-atom-2',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Science',
        time: '11:30 - 12:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class V - B' },
          { icon: 'ti ti-door me-1', label: 'Lab 2' },
          { icon: 'ti ti-user me-1', label: '29 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-flask-2 me-1', label: 'Lab' },
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'thursday-5',
        tone: 'warning',
        icon: 'ti ti-tools-kitchen-2',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Lunch Break',
        time: '12:15 - 01:30 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-warning', label: 'Break' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'thursday-6',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '01:30 - 02:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class VI - B' },
          { icon: 'ti ti-door me-1', label: 'Room 105' },
          { icon: 'ti ti-user me-1', label: '30 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-primary', icon: 'ti ti-video me-1', label: 'Online' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'thursday-7',
        tone: 'danger',
        icon: 'ti ti-eye-check',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Invigilation',
        time: '02:15 - 03:00 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-danger', label: 'Exam Duty' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
    ],
  },
  {
    id: 'friday',
    name: 'Friday',
    slots: [
      {
        id: 'friday-1',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '09:00 - 09:45 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class III - A' },
          { icon: 'ti ti-door me-1', label: 'Room 104' },
          { icon: 'ti ti-user me-1', label: '32 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'friday-2',
        tone: 'info',
        icon: 'ti ti-atom-2',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Science',
        time: '09:45 - 10:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class IV - B' },
          { icon: 'ti ti-door me-1', label: 'Lab 2' },
          { icon: 'ti ti-user me-1', label: '30 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-flask-2 me-1', label: 'Lab' },
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'friday-3',
        tone: 'danger',
        icon: 'ti ti-math-symbols',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Maths',
        time: '10:45 - 11:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class V - A' },
          { icon: 'ti ti-door me-1', label: 'Room 101' },
          { icon: 'ti ti-user me-1', label: '34 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'friday-4',
        tone: 'danger',
        icon: 'ti ti-ban',
        iconTone: 'text-danger',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Cancelled Class',
        time: '11:30 - 12:15 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-danger', label: 'Cancelled' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'friday-5',
        tone: 'warning',
        icon: 'ti ti-tools-kitchen-2',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Lunch Break',
        time: '12:15 - 01:30 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-warning', label: 'Break' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'friday-6',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '01:30 - 02:15 PM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class VI - A' },
          { icon: 'ti ti-door me-1', label: 'Room 105' },
          { icon: 'ti ti-user me-1', label: '31 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-versions me-1', label: 'Hybrid' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'friday-7',
        tone: 'primary',
        icon: 'ti ti-school',
        iconTone: 'text-primary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Training Session',
        time: '02:15 - 03:00 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-primary', label: 'Training' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
    ],
  },
  {
    id: 'saturday',
    name: 'Saturday',
    slots: [
      {
        id: 'saturday-1',
        tone: 'warning',
        icon: 'ti ti-atom',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Physics',
        time: '09:00 - 09:45 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class III - B' },
          { icon: 'ti ti-door me-1', label: 'Room 104' },
          { icon: 'ti ti-user me-1', label: '33 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'saturday-2',
        tone: 'light',
        icon: 'ti ti-coffee',
        iconTone: 'text-secondary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Free Period',
        time: '09:45 - 10:30 AM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-secondary', label: 'Free' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
      {
        id: 'saturday-3',
        tone: 'info',
        icon: 'ti ti-atom-2',
        iconTone: 'text-info',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Science',
        time: '10:45 - 11:30 AM',
        metas: [
          { icon: 'ti ti-users me-1', label: 'Class V - B' },
          { icon: 'ti ti-door me-1', label: 'Lab 2' },
          { icon: 'ti ti-user me-1', label: '29 students' },
          { icon: 'ti ti-hourglass me-1', label: '45 min' },
        ],
        badges: [
          { className: 'badge-soft-info', icon: 'ti ti-flask-2 me-1', label: 'Lab' },
          { className: 'badge-soft-secondary', icon: 'ti ti-building me-1', label: 'Offline' },
        ],
        detailsModal: 'scheduleDetails',
        fullMenu: true,
      },
      {
        id: 'saturday-4',
        tone: 'primary',
        icon: 'ti ti-users-group',
        iconTone: 'text-primary',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Staff Meeting',
        time: '11:30 - 12:15 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-primary', label: 'Meeting' },
        detailsModal: 'meetingDetails',
        fullMenu: false,
      },
      {
        id: 'saturday-5',
        tone: 'warning',
        icon: 'ti ti-tools-kitchen-2',
        iconTone: 'text-warning',
        heading: 'h6',
        headingClass: 'timetable-slot-sub mb-0 text-truncate',
        subject: 'Lunch Break',
        time: '12:15 - 01:00 PM',
        metas: [],
        badges: [],
        soloBadge: { className: 'badge-soft-warning', label: 'Break' },
        detailsModal: 'scheduleDetails',
        fullMenu: false,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

/** Fields in the toolbar's Filters panel, in template order. */
export interface AdvancedFilter {
  id: string;
  label: string;
  options: string[];
  /** Fields whose template markup opens with an empty "All" option. */
  allOption: boolean;
}

export const advancedFilters: AdvancedFilter[] = [
  {
    id: 'academic-year',
    label: 'Academic Year',
    options: ['2024 / 2025', '2023 / 2024'],
    allOption: false,
  },
  {
    id: 'department',
    label: 'Department',
    options: ['Science', 'Mathematics', 'Languages'],
    allOption: true,
  },
  { id: 'subject', label: 'Subject', options: ['Physics', 'Science', 'Maths'], allOption: true },
  { id: 'campus', label: 'Campus', options: ['Main Campus', 'North Campus'], allOption: false },
  { id: 'week', label: 'Week', options: ['This Week', 'Next Week', 'Last Week'], allOption: false },
];

/** The Week View menu; each mode shows a different slice of the week. */
export type CalendarViewId = 'day' | 'week' | 'workWeek' | 'month';

export interface CalendarView {
  id: CalendarViewId;
  label: string;
  icon: string;
}

export const calendarViews: CalendarView[] = [
  { id: 'day', label: 'Day', icon: 'ti ti-calendar-event me-2' },
  { id: 'week', label: 'Week', icon: 'ti ti-calendar-week me-2' },
  { id: 'workWeek', label: 'Work Week', icon: 'ti ti-calendar-stats me-2' },
  { id: 'month', label: 'Month', icon: 'ti ti-calendar-month me-2' },
];

/** Saved views. `badge` is the solo-badge label the view narrows down to. */
export type SavedViewId = 'full' | 'free' | 'exam';

export interface SavedView {
  id: SavedViewId;
  label: string;
  icon: string;
  badge?: string;
}

export const savedViews: SavedView[] = [
  { id: 'full', label: 'Teresa · Full Week', icon: 'ti ti-user me-2' },
  { id: 'free', label: 'Free Periods Only', icon: 'ti ti-coffee me-2', badge: 'Free' },
  { id: 'exam', label: 'Exam Duties', icon: 'ti ti-clipboard-check me-2', badge: 'Exam Duty' },
];

export const exportOptions = [
  { id: 'pdf', label: 'Export PDF', icon: 'ti ti-file-type-pdf me-2' },
  { id: 'excel', label: 'Export Excel', icon: 'ti ti-file-type-xls me-2' },
];

/* -------------------------------------------------------------------------- */
/*                            Info Panel offcanvas                            */
/* -------------------------------------------------------------------------- */

export interface PanelSession {
  icon: string;
  iconClass: string;
  title: string;
  subtitle: string;
}

export const todaySchedule: PanelSession[] = [
  {
    icon: 'ti ti-atom',
    iconClass: 'bg-warning-transparent text-warning',
    title: 'Physics · III - A',
    subtitle: '09:00 - 09:45 AM · Room 104',
  },
  {
    icon: 'ti ti-atom-2',
    iconClass: 'bg-info-transparent text-info',
    title: 'Science · IV - B',
    subtitle: '09:45 - 10:30 AM · Lab 2',
  },
];

export interface PanelUpcoming {
  icon: string;
  iconClass: string;
  label: string;
  time: string;
}

export const upcomingClasses: PanelUpcoming[] = [
  {
    icon: 'ti ti-math-symbols',
    iconClass: 'bg-danger-transparent text-danger',
    label: 'Maths · V - A',
    time: '11:30 AM',
  },
  {
    icon: 'ti ti-atom',
    iconClass: 'bg-warning-transparent text-warning',
    label: 'Physics · VI - A',
    time: '01:30 PM',
  },
];

export const panelFreePeriods = [
  'Mon · 10:45 AM',
  'Wed · 09:00 AM',
  'Sat · 09:45 AM',
];

export interface RoomAssignment {
  icon: string;
  room: string;
  badgeClass: string;
  subject: string;
}

export const roomAssignments: RoomAssignment[] = [
  { icon: 'ti ti-door me-2', room: 'Room 104', badgeClass: 'badge-soft-primary', subject: 'Physics' },
  { icon: 'ti ti-flask me-2', room: 'Lab 2', badgeClass: 'badge-soft-info', subject: 'Science' },
  { icon: 'ti ti-door me-2', room: 'Room 101', badgeClass: 'badge-soft-danger', subject: 'Maths' },
];

export const meetingReminders: PanelSession[] = [
  {
    icon: 'ti ti-users-group',
    iconClass: 'bg-primary-transparent text-primary',
    title: 'Staff Meeting',
    subtitle: 'Mon · 02:15 PM · Conference Hall',
  },
  {
    icon: 'ti ti-user-heart',
    iconClass: 'bg-info-transparent text-info',
    title: 'Parent Meeting',
    subtitle: 'Thu · 10:45 AM · Room 104',
  },
];

export interface PendingTask {
  id: string;
  label: string;
  done: boolean;
}

export const pendingTasks: PendingTask[] = [
  { id: 'ttt_task1', label: 'Submit Physics lesson plan', done: false },
  { id: 'ttt_task2', label: 'Upload IV-B lab marks', done: true },
];

/* -------------------------------------------------------------------------- */
/*                                  Dialogs                                   */
/* -------------------------------------------------------------------------- */

export interface DetailRow {
  label: string;
  value: string;
  /** Rows whose value renders as a badge rather than plain text. */
  badgeClass?: string;
}

export const scheduleDetailRows: DetailRow[] = [
  { label: 'Classroom', value: 'Room 104' },
  { label: 'Time', value: '09:00 - 09:45 AM' },
  { label: 'Duration', value: '45 min' },
  { label: 'Students', value: '32' },
  { label: 'Mode', value: 'Offline', badgeClass: 'badge-soft-secondary' },
];

export const meetingDetailRows: DetailRow[] = [
  { label: 'Location', value: 'Conference Hall' },
  { label: 'Chaired By', value: 'Principal' },
  { label: 'Agenda', value: 'Term planning' },
];

export const classInformationRows: DetailRow[] = [
  { label: 'Class Teacher', value: 'Teresa' },
  { label: 'Boys / Girls', value: '17 / 15' },
  { label: 'Room', value: 'Room 104' },
  { label: 'Average Attendance', value: '96%' },
];

/** Edit Session selects. */
export const editSessionSubjects = ['Physics', 'Science', 'Maths'];
export const editSessionClasses = ['III - A', 'IV - B', 'V - A'];
export const editSessionRooms = ['Room 104', 'Lab 2', 'Room 101'];
export const editSessionModes = ['Offline', 'Online', 'Hybrid'];

/** Assign Substitute. */
export const substituteTeachers = ['Daniel', 'Morgan', 'Aaron'];

/** Swap Class. */
export const swapDays = ['Monday', 'Tuesday', 'Wednesday'];
export const swapPeriods = [
  'Period 1 · 09:00 - 09:45 AM',
  'Period 2 · 09:45 - 10:30 AM',
];

/** Change Classroom. */
export const classroomOptions = ['Room 104', 'Room 101', 'Room 105', 'Lab 2', 'Lab 3'];

/* --------------------------- Add Class Time Table -------------------------- */

export const addSections = ['A', 'B', 'C', 'D'];
export const addSubjectGroups = ['Class I', 'Class II', 'Class III', 'Class IV'];
export const addPeriodStartTimes = ['Select', '09:00 AM', '09:45 AM', '10:45 AM'];
export const addDurations = ['Select', '45 Mins', '1 Hour'];

export const addRowSubjects = ['Select', 'English', 'Spanish', 'Physics', 'Maths'];
export const addRowTeachers = ['Select', 'Hellana', 'Erickson', 'Teresa', 'Aaron'];
export const addRowTimeFrom = ['Select', '09:00', '09:45', '10:45', '11:30'];
export const addRowTimeTo = ['Select', '09:45', '10:45', '11:30', '12:15'];

/** The five day tabs the Add Time Table dialog carries. */
export interface AddTimetableTab {
  id: string;
  label: string;
}

export const addTimetableTabs: AddTimetableTab[] = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
];