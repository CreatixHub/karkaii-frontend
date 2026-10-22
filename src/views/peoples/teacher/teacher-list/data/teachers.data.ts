export type TeacherStatus = 'Active' | 'Inactive';

/** `.meter` accent used by the "Class Load" bar in the detail panel. */
export type MeterVariant = 'meter-success' | 'meter-warning' | 'meter-danger';

/** The `tr.dt-detail` panel revealed by the row's `.dt-expand` chevron. */
export interface TeacherDetail {
  address: string;
  /** Badges under "Teaching". The template prints one per teacher. */
  subjects: string[];
  classesHandled: string;
  loadVariant: MeterVariant;
  /** Inline `style="width:78%"` on the meter's span. */
  loadWidth: string;
  loadLabel: string;
  qualification: string;
  experience: string;
  note: string;
}

export interface Teacher {
  /** Unique row key — `id` repeats in the template. */
  key: string;
  id: string;
  name: string;
  avatar: string;
  status: TeacherStatus;
  /** The "Class" column, e.g. `III A`, `IX (C) , X (C)`. */
  classes: string;
  subject: string;
  email: string;
  phone: string;
  dateOfJoin: string;
  /** The row's `data-search` haystack, unchanged. */
  search: string;
  detail: TeacherDetail;
}

export const teachers: Teacher[] = [
  {
    key: 'teresa-t849127',
    id: 'T849127',
    name: 'Teresa',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    status: 'Active',
    classes: 'III A',
    subject: 'Physics',
    email: 'teresa@example.com',
    phone: '+1 82392 37359',
    dateOfJoin: '25 Mar 2024',
    search: 'teresa t849127 iii a physics teresa@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Physics'],
      classesHandled: 'III A',
      loadVariant: 'meter-warning',
      loadWidth: '78%',
      loadLabel: '20 of 26 periods',
      qualification: 'M.Sc, B.Ed',
      experience: '8 yrs',
      note: 'Dedicated Physics faculty member.',
    },
  },
  {
    key: 'daniel-t849126',
    id: 'T849126',
    name: 'Daniel',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    status: 'Active',
    classes: 'II (A)',
    subject: 'Computer',
    email: 'daniel@example.com',
    phone: '+1 56752 86742',
    dateOfJoin: '28 Mar 2024',
    search: 'daniel t849126 ii a computer daniel@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Computer'],
      classesHandled: 'II (A)',
      loadVariant: 'meter-warning',
      loadWidth: '70%',
      loadLabel: '18 of 26 periods',
      qualification: 'MCA, B.Ed',
      experience: '6 yrs',
      note: 'Dedicated Computer faculty member.',
    },
  },
  {
    key: 'hellana-t849125',
    id: 'T849125',
    name: 'Hellana',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    status: 'Inactive',
    classes: 'VI (A)',
    subject: 'English',
    email: 'hellana@example.com',
    phone: '+1 23566 52683',
    dateOfJoin: '11 Apr 2024',
    search: 'hellana t849125 vi a english hellana@example.com inactive',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['English'],
      classesHandled: 'VI (A)',
      loadVariant: 'meter-success',
      loadWidth: '52%',
      loadLabel: '13 of 26 periods',
      qualification: 'M.A, B.Ed',
      experience: '5 yrs',
      note: 'Dedicated English faculty member.',
    },
  },
  {
    key: 'erickson-t849124',
    id: 'T849124',
    name: 'Erickson',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    status: 'Inactive',
    classes: 'I (A)',
    subject: 'Chemistry',
    email: 'aaron@example.com',
    phone: '+1 26267 80542',
    dateOfJoin: '12 May 2024',
    search: 'erickson t849124 i a chemistry aaron@example.com inactive',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Chemistry'],
      classesHandled: 'I (A)',
      loadVariant: 'meter-success',
      loadWidth: '48%',
      loadLabel: '12 of 26 periods',
      qualification: 'M.Sc, B.Ed',
      experience: '4 yrs',
      note: 'Dedicated Chemistry faculty member.',
    },
  },
  {
    key: 'morgan-t849121',
    id: 'T849121',
    name: 'Morgan',
    avatar: 'assets/img/teachers/teacher-07.jpg',
    status: 'Active',
    classes: 'IV',
    subject: 'Maths',
    email: 'jacquelin@example.com',
    phone: '+1 77502 54845',
    dateOfJoin: '20 May 2024',
    search: 'morgan t849121 iv maths jacquelin@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Maths'],
      classesHandled: 'IV',
      loadVariant: 'meter-danger',
      loadWidth: '82%',
      loadLabel: '21 of 26 periods',
      qualification: 'M.Sc, B.Ed',
      experience: '7 yrs',
      note: 'Dedicated Maths faculty member.',
    },
  },
  {
    key: 'aaron-t849122',
    id: 'T849122',
    name: 'Aaron',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    status: 'Active',
    classes: 'I (A)',
    subject: 'Chemistry',
    email: 'aaron@example.com',
    phone: '+1 26267 80542',
    dateOfJoin: '12 May 2024',
    search: 'aaron t849122 i a chemistry aaron@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Chemistry'],
      classesHandled: 'I (A)',
      loadVariant: 'meter-warning',
      loadWidth: '60%',
      loadLabel: '15 of 26 periods',
      qualification: 'M.Sc, B.Ed',
      experience: '4 yrs',
      note: 'Dedicated Chemistry faculty member.',
    },
  },
  {
    key: 'daniel-t849127',
    id: 'T849127',
    name: 'Daniel',
    avatar: 'assets/img/teachers/teacher-09.jpg',
    status: 'Active',
    classes: 'IV',
    subject: 'Maths',
    email: 'jacquelin@example.com',
    phone: '+1 77502 54845',
    dateOfJoin: '20 May 2024',
    search: 'daniel t849127 iv maths jacquelin@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Maths'],
      classesHandled: 'IV',
      loadVariant: 'meter-danger',
      loadWidth: '88%',
      loadLabel: '23 of 26 periods',
      qualification: 'M.Sc, B.Ed',
      experience: '9 yrs',
      note: 'Dedicated Maths faculty member.',
    },
  },
  {
    key: 'raul-t849120',
    id: 'T849120',
    name: 'Raul',
    avatar: 'assets/img/students/student-10.jpg',
    status: 'Inactive',
    classes: 'IX',
    subject: 'Biology',
    email: 'raul@example.com',
    phone: '+1 67845 78784',
    dateOfJoin: '27 May 2024',
    search: 'raul t849120 ix biology raul@example.com inactive',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Biology'],
      classesHandled: 'IX',
      loadVariant: 'meter-success',
      loadWidth: '55%',
      loadLabel: '14 of 26 periods',
      qualification: 'M.Sc, B.Ed',
      experience: '6 yrs',
      note: 'Dedicated Biology faculty member.',
    },
  },
  {
    key: 'elizabeth-t849119',
    id: 'T849119',
    name: 'Elizabeth',
    avatar: 'assets/img/students/student-11.jpg',
    status: 'Active',
    classes: 'VII',
    subject: 'Economics',
    email: 'elizabeth@example.com',
    phone: '+1 97846 84518',
    dateOfJoin: '10 Jun 2024',
    search: 'elizabeth t849119 vii economics elizabeth@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Economics'],
      classesHandled: 'VII',
      loadVariant: 'meter-warning',
      loadWidth: '75%',
      loadLabel: '19 of 26 periods',
      qualification: 'M.A, B.Ed',
      experience: '10 yrs',
      note: 'Dedicated Economics faculty member.',
    },
  },
  {
    key: 'edward-t849118',
    id: 'T849118',
    name: 'Edward',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    status: 'Active',
    classes: 'IX (C) , X (C)',
    subject: 'Finance',
    email: 'edward@example.com',
    phone: '+1 56187 87489',
    dateOfJoin: '18 Jun 2024',
    search: 'edward t849118 ix c x c finance edward@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['Finance'],
      classesHandled: 'IX (C) , X (C)',
      loadVariant: 'meter-danger',
      loadWidth: '90%',
      loadLabel: '24 of 26 periods',
      qualification: 'M.Com, B.Ed',
      experience: '11 yrs',
      note: 'Dedicated Finance faculty member.',
    },
  },
  {
    key: 'maria-t849117',
    id: 'T849117',
    name: 'Maria',
    avatar: 'assets/img/teachers/teacher-04.jpg',
    status: 'Active',
    classes: 'I (A)',
    subject: 'English',
    email: 'maria@example.com',
    phone: '+1 97846 84518',
    dateOfJoin: '22 Mar 2018',
    search: 'maria t849117 i a english maria@example.com active',
    detail: {
      address: '1247 Maple Avenue, USA',
      subjects: ['English'],
      classesHandled: 'I (A)',
      loadVariant: 'meter-warning',
      loadWidth: '68%',
      loadLabel: '17 of 26 periods',
      qualification: 'M.A, B.Ed',
      experience: '12 yrs',
      note: 'Dedicated English faculty member.',
    },
  },
];
