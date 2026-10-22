import { useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import AnalyticsSkeleton from './components/AnalyticsSkeleton';
import AnalyticsStatCards from './components/AnalyticsStatCards';
import AnalyticsToolbar from './components/AnalyticsToolbar';
import ChartPanel from './components/ChartPanel';
import ClassRankingTable from './components/ClassRankingTable';
import type { ClassFilterValue } from './data/performanceAnalytics.data';
import {
  actionToasts,
  buildStatCards,
  chartOffsetsFor,
  classFilterOptions,
  cohortsFor,
  labelForFilter,
  rankingViewFor,
  scopeToast,
} from './data/performanceAnalytics.data';
import {
  attendanceScatterOptions,
  buildAttendanceScatterSeries,
  buildSubjectRadarSeries,
  buildSubjectTrendSeries,
  subjectRadarOptions,
  subjectTrendOptions,
} from './data/performanceAnalytics.charts';

const REVEAL_MS = 650;

const PerformanceAnalytics = () => {
  /* ---------------------------------- State --------------------------------- */
  const [classFilter, setClassFilter] = useState<ClassFilterValue>('all');

  const { toasts, push, dismiss } = useToasts();
  const { loading, revealed } = useReveal(REVEAL_MS);

  /* --------------------------------- Derived -------------------------------- */
  const scopeLabel = labelForFilter(classFilter);
  /** Null while every class is in scope, so no ranking row reads as selected. */
  const activeClassId = classFilter === 'all' ? null : classFilter;

  const statCards = useMemo(() => buildStatCards(cohortsFor(classFilter)), [classFilter]);
  const rankingRows = useMemo(() => rankingViewFor(classFilter), [classFilter]);
  const offsets = useMemo(() => chartOffsetsFor(classFilter), [classFilter]);

  const trendSeries = useMemo(() => buildSubjectTrendSeries(offsets.marks), [offsets]);
  const radarSeries = useMemo(() => buildSubjectRadarSeries(offsets.marks), [offsets]);
  const scatterSeries = useMemo(
    () => buildAttendanceScatterSeries(offsets.attendance, offsets.marks),
    [offsets],
  );

  /* -------------------------------- Handlers -------------------------------- */
  const applyFilter = (value: ClassFilterValue) => {
    if (value === classFilter) return;
    setClassFilter(value);
    push(scopeToast(labelForFilter(value)), 'info');
  };

  const handlePrint = () => {
    // The template's own `onclick="window.print()"` on the Print button.
    window.print();
    push(actionToasts.print, 'info');
  };

  const handleExport = () => push(actionToasts.export);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <AnalyticsToolbar
            options={classFilterOptions}
            value={classFilter}
            activeLabel={scopeLabel}
            onChange={applyFilter}
            onPrint={handlePrint}
            onExport={handleExport}
          />

          {loading ? (
            <AnalyticsSkeleton />
          ) : (
            <>
              <AnalyticsStatCards cards={statCards} />

              <div className="row">
                <ChartPanel
                  columnClassName="col-12 col-xl-8"
                  chartId="pa_trend"
                  title="Subject Performance Trend"
                  emphasis
                  scope={scopeLabel}
                  options={subjectTrendOptions}
                  series={trendSeries}
                  type="line"
                  height={300}
                  ready={revealed}
                />
                <ChartPanel
                  columnClassName="col-12 col-xl-4"
                  chartId="pa_radar"
                  title="Subject Radar"
                  scope={scopeLabel}
                  options={subjectRadarOptions}
                  series={radarSeries}
                  type="radar"
                  height={280}
                  ready={revealed}
                />
              </div>

              <div className="row">
                <ChartPanel
                  columnClassName="col-12 col-xl-6"
                  chartId="pa_scatter"
                  title="Attendance vs Marks"
                  scope={scopeLabel}
                  options={attendanceScatterOptions}
                  series={scatterSeries}
                  type="scatter"
                  height={280}
                  ready={revealed}
                />
                <ClassRankingTable
                  rows={rankingRows}
                  activeClassId={activeClassId}
                  onSelectClass={applyFilter}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default PerformanceAnalytics;
