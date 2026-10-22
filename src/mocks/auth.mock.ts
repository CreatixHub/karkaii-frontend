/**
 * Demo authentication fixtures.
 *
 * IMPORTANT: these are placeholder demo accounts for a static template, not
 * credentials for any real system. The mock auth service never verifies the
 * password — it exists purely so a login screen can be exercised without a
 * backend. No real secret is stored here, and none should ever be.
 */

import { USER_ROLE } from '@constants/app.constants';
import type { AuthUser } from '@services/auth/auth.types';

export const demoUsers: AuthUser[] = [
  {
    id: '1',
    name: 'Kevin Larry',
    email: 'admin@example.com',
    role: USER_ROLE.ADMIN,
    permissions: ['*'],
    avatarUrl: 'assets/img/profiles/avatar-27.jpg',
  },
  {
    id: '2',
    name: 'Teresa Fischer',
    email: 'teacher@example.com',
    role: USER_ROLE.TEACHER,
    permissions: [
      'students.read',
      'attendance.read',
      'attendance.create',
      'exams.read',
    ],
    avatarUrl: 'assets/img/profiles/avatar-14.jpg',
  },
  {
    id: '3',
    name: 'Janet Daniel',
    email: 'student@example.com',
    role: USER_ROLE.STUDENT,
    permissions: ['profile.read', 'exams.read', 'fees.read'],
    avatarUrl: 'assets/img/students/student-01.jpg',
  },
  {
    id: '4',
    name: 'Thomas Daniel',
    email: 'parent@example.com',
    role: USER_ROLE.PARENT,
    permissions: ['profile.read', 'fees.read', 'attendance.read'],
    avatarUrl: 'assets/img/profiles/avatar-12.jpg',
  },
];

/** The account returned when an email does not match a demo user. */
export const defaultDemoUser: AuthUser = demoUsers[0];
