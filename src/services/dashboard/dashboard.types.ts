/**
 * Dashboard domain contract.
 *
 * Modelled on what the admin dashboard actually renders (student/teacher/staff/
 * subject counts, attendance, finance), expressed as a single aggregate the
 * backend can return from one endpoint — which is how dashboards are normally
 * served, rather than as a dozen separate calls.
 */

/** A headline metric card. */
export interface DashboardStat {
  id: string;
  label: string;
  total: number;
  /** Sub-counts shown under the total, e.g. active/inactive. */
  active?: number;
  inactive?: number;
  /** Percentage change against the previous period; negative means down. */
  changePercent?: number;
}

/** One day's attendance breakdown. */
export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  total: number;
  /** 0..100, precomputed so every consumer shows the same number. */
  presentPercent: number;
}

/** A point in the earnings/expenses series. */
export interface FinancePoint {
  period: string;
  earnings: number;
  expenses: number;
}

export interface FinanceSummary {
  currency: string;
  totalEarnings: number;
  totalExpenses: number;
  series: FinancePoint[];
}

/** An entry in the "recent activity" feed. */
export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 timestamp. */
  occurredAt: string;
  type: 'admission' | 'payment' | 'event' | 'notice';
}

/** The full payload of `GET /dashboard/admin`. */
export interface AdminDashboard {
  stats: DashboardStat[];
  attendance: AttendanceSummary;
  finance: FinanceSummary;
  recentActivity: DashboardActivity[];
}
