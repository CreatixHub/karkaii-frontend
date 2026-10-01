/**
 * API-shaped dashboard fixture.
 *
 * Numbers mirror what the current admin dashboard displays, so switching a
 * rebuilt dashboard onto this hook produces the same figures on screen.
 */

import type { AdminDashboard } from '@services/dashboard/dashboard.types';

export const adminDashboardMockData: AdminDashboard = {
  stats: [
    {
      id: 'students',
      label: 'Total Students',
      total: 3654,
      active: 3643,
      inactive: 11,
      changePercent: 1.2,
    },
    {
      id: 'teachers',
      label: 'Total Teachers',
      total: 284,
      active: 254,
      inactive: 30,
      changePercent: 0.8,
    },
    {
      id: 'staff',
      label: 'Total Staff',
      total: 162,
      active: 161,
      inactive: 2,
      changePercent: -0.4,
    },
    {
      id: 'subjects',
      label: 'Total Subjects',
      total: 82,
      changePercent: 0,
    },
  ],

  attendance: {
    date: '2024-03-25',
    present: 3391,
    absent: 263,
    total: 3654,
    presentPercent: 92.8,
  },

  finance: {
    currency: 'USD',
    totalEarnings: 245800,
    totalExpenses: 158200,
    series: [
      { period: '2024-01', earnings: 38000, expenses: 24500 },
      { period: '2024-02', earnings: 41200, expenses: 26100 },
      { period: '2024-03', earnings: 39800, expenses: 25400 },
      { period: '2024-04', earnings: 44100, expenses: 27300 },
      { period: '2024-05', earnings: 40500, expenses: 26900 },
      { period: '2024-06', earnings: 42200, expenses: 28000 },
    ],
  },

  recentActivity: [
    {
      id: '1',
      title: 'New admission approved',
      description: 'Janet Daniel was admitted to Class III-A.',
      occurredAt: '2024-03-25T09:30:00.000Z',
      type: 'admission',
    },
    {
      id: '2',
      title: 'Fee payment received',
      description: 'Term 2 fees collected for 42 students.',
      occurredAt: '2024-03-24T14:05:00.000Z',
      type: 'payment',
    },
    {
      id: '3',
      title: 'Annual sports day scheduled',
      description: 'Event set for 12 April at the main ground.',
      occurredAt: '2024-03-23T11:15:00.000Z',
      type: 'event',
    },
    {
      id: '4',
      title: 'Exam timetable published',
      description: 'Final term timetable is now available to all classes.',
      occurredAt: '2024-03-22T08:45:00.000Z',
      type: 'notice',
    },
  ],
};
