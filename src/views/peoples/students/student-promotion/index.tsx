import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import AiInsights from './components/AiInsights';
import ClassOverview from './components/ClassOverview';
import EligibleStudentsTable from './components/EligibleStudentsTable';
import KpiSummary from './components/KpiSummary';
import PromotionAnalytics from './components/PromotionAnalytics';
import PromotionBulkBar from './components/PromotionBulkBar';
import RecentPromotions from './components/RecentPromotions';
import StepAcademicYear from './components/StepAcademicYear';
import StepConfirm from './components/StepConfirm';
import StepMapClass from './components/StepMapClass';
import StudentFilters from './components/StudentFilters';
import WizardSteps from './components/WizardSteps';
import PromotionModals from './modals/PromotionModals';
import type { PromotionRowState, TimelineCategory, WiredFilter } from './data/studentPromotion.data';
import {
  aiActions,
  aiInsightCards,
  actionToasts,
  bulkActions,
  classWiseBars,
  donutDetainedPct,
  donutPromotionPct,
  filterFields,
  fromClassOptions,
  fromSectionOptions,
  genderDistribution,
  kpiTiles,
  overviewBlocks,
  performanceDistribution,
  readinessScore,
  readinessText,
  step4Checklist,
  studentRows,
  timelineEntries,
  toClassOptions,
  toPromotionRowState,
  toSectionOptions,
  wizardSteps,
  yearCards,
} from './data/studentPromotion.data';

const routes = all_routes;

const StudentPromotion = () => {
  const { loading: booting, revealed } = useReveal(850);
  const [refreshing, setRefreshing] = useState(false);
  const loading = booting || refreshing;

  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [selectedYear, setSelectedYear] = useState(yearCards.find((year) => year.current)?.id ?? yearCards[0].id);
  const [fromClass, setFromClass] = useState(fromClassOptions[0]);
  const [fromSection, setFromSection] = useState(fromSectionOptions[0]);
  const [toClass, setToClass] = useState(toClassOptions[0]);
  const [toSection, setToSection] = useState(toSectionOptions[0]);

  const [rows, setRows] = useState<PromotionRowState[]>(() => studentRows.map(toPromotionRowState));
  const [search, setSearch] = useState('');
  const [wiredFilters, setWiredFilters] = useState<Record<WiredFilter, string>>({
    att: 'all',
    perf: 'all',
    fee: 'all',
    status: 'all',
  });
  const [rpFilter, setRpFilter] = useState<'all' | TimelineCategory>('all');
  const [exportOpen, setExportOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const goStep = useCallback((next: number) => {
    const clamped = Math.max(1, Math.min(4, next));
    setStep(clamped);
    setMaxReached((current) => Math.max(current, clamped));
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (q && !row.name.toLowerCase().includes(q) && !row.id.toLowerCase().includes(q)) return false;
      if (wiredFilters.att !== 'all' && row.dataAtt !== wiredFilters.att) return false;
      if (wiredFilters.perf !== 'all' && row.dataPerf !== wiredFilters.perf) return false;
      if (wiredFilters.fee !== 'all' && row.dataFee !== wiredFilters.fee) return false;
      if (wiredFilters.status !== 'all' && row.dataStatus !== wiredFilters.status) return false;
      return true;
    });
  }, [rows, search, wiredFilters]);

  const selectedCount = rows.filter((row) => row.selected).length;
  const visibleIds = useMemo(() => new Set(filteredRows.map((row) => row.id)), [filteredRows]);
  const allChecked = filteredRows.length > 0 && filteredRows.every((row) => row.selected);

  const toggleRow = useCallback((id: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, selected: !row.selected } : row)));
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setRows((current) => current.map((row) => (visibleIds.has(row.id) ? { ...row, selected: checked } : row)));
    },
    [visibleIds],
  );

  const setTarget = useCallback((id: string, value: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, target: value } : row)));
  }, []);

  const setRemark = useCallback((id: string, value: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, remark: value } : row)));
  }, []);

  const downloadList = useCallback(
    (prefix: string) => {
      const lines = [
        `PRESKOOL ACADEMY - ${prefix.toUpperCase()}`,
        'Academic Year 2024-2025 -> 2025-2026',
        'Class Grade III-A -> Grade IV',
        '',
        'Student, Admission No, Attendance, Academic, Fee, Recommendation',
        ...filteredRows.map((row) =>
          [row.name, row.id, `${row.attendancePct}%`, row.academicLabel, row.feeLabel, row.recommendationLabel].join(
            ', ',
          ),
        ),
      ];
      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prefix}-GradeIII-A.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    },
    [filteredRows],
  );

  const runAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'ai_autoselect':
          setRows((current) =>
            current.map((row) =>
              visibleIds.has(row.id) ? { ...row, selected: row.dataStatus === 'eligible' || row.dataStatus === 'graduated' } : row,
            ),
          );
          push(actionToasts.ai_autoselect.message(0), actionToasts.ai_autoselect.tone);
          return;
        case 'clear_sel':
          setRows((current) => current.map((row) => ({ ...row, selected: false })));
          return;
        case 'print':
          window.print();
          return;
        case 'reset_filters':
          setSearch('');
          setWiredFilters({ att: 'all', perf: 'all', fee: 'all', status: 'all' });
          push(actionToasts.reset_filters.message(0), actionToasts.reset_filters.tone);
          return;
        case 'export':
          downloadList('Promotion-List');
          push(actionToasts.export.message(0), actionToasts.export.tone);
          return;
        case 'report':
          downloadList('Promotion-Report');
          push(actionToasts.report.message(0), actionToasts.report.tone);
          return;
        case 'finalize':
          setConfirmOpen(false);
          push(actionToasts.finalize.message(0), actionToasts.finalize.tone);
          goStep(1);
          setRows((current) => current.map((row) => ({ ...row, selected: false })));
          return;
        default: {
          const entry = actionToasts[action];
          if (entry) push(entry.message(selectedCount), entry.tone);
        }
      }
    },
    [visibleIds, selectedCount, push, downloadList, goStep],
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push('Promotion workspace refreshed');
    }, 700);
  }, [push]);

  useEffect(() => {
    if (!exportOpen) return;
    const close = () => setExportOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [exportOpen]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Student Promotion</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="#">Students</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Student Promotion
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <div className="pe-1 mb-2">
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-icon me-1"
                      title="Refresh"
                      aria-label="Refresh"
                      onClick={refresh}
                    >
                      <i className="ti ti-refresh" />
                    </button>
                  </div>
                  <div className="pe-1 mb-2">
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-icon me-1"
                      title="Print"
                      aria-label="Print"
                      onClick={() => window.print()}
                    >
                      <i className="ti ti-printer" />
                    </button>
                  </div>
                  <div className="dropdown me-2 mb-2">
                    <button
                      type="button"
                      className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                      aria-expanded={exportOpen}
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={() => setExportOpen((open) => !open)}
                    >
                      <i className="ti ti-file-export me-2" />
                      Export
                    </button>
                    <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item rounded-1"
                          onClick={() => {
                            setExportOpen(false);
                            push('Export as PDF started');
                          }}
                        >
                          <i className="ti ti-file-type-pdf me-1" />
                          Export as PDF
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item rounded-1"
                          onClick={() => {
                            setExportOpen(false);
                            push('Export as Excel started');
                          }}
                        >
                          <i className="ti ti-file-type-xls me-1" />
                          Export as Excel{' '}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              {/* ===== Premium Promotion Workspace ===== */}
              <div className={`student-promotion${loading ? ' loading' : ''}`} id="promoWorkspace">
                {loading ? (
                  <div className="skeleton-loader">
                    <div className="skeleton-kpis">
                      <div className="skeleton skeleton-card" />
                      <div className="skeleton skeleton-card" />
                      <div className="skeleton skeleton-card" />
                      <div className="skeleton skeleton-card" />
                    </div>
                    <div className="skeleton skeleton-block" />
                    <div className="skeleton skeleton-row" />
                    <div className="skeleton skeleton-row" />
                    <div className="skeleton skeleton-row" />
                    <div className="skeleton skeleton-row" />
                    <div className="skeleton skeleton-block" />
                  </div>
                ) : (
                  <div className="live-flag-promotion">
                    <KpiSummary tiles={kpiTiles} revealed={revealed} />

                    <div className="alert alert-outline-primary bg-primary-transparent p-2 d-flex align-items-center flex-wrap row-gap-2 mb-3">
                      <i className="ti ti-info-circle me-1" />
                      <strong>Note :</strong>&nbsp;Promoting students moves them to the next class and enrolls them
                      into the 2025 - 2026 academic session. Review AI recommendations before confirming.
                    </div>

                    <WizardSteps steps={wizardSteps} current={step} maxReached={maxReached} onGoTo={goStep} />

                    <div className="wizard-step-wrap">
                      <StepAcademicYear
                        active={step === 1}
                        years={yearCards}
                        selected={selectedYear}
                        onSelect={setSelectedYear}
                        onNext={() => goStep(2)}
                      />

                      <StepMapClass
                        active={step === 2}
                        fromClass={fromClass}
                        fromSection={fromSection}
                        toClass={toClass}
                        toSection={toSection}
                        onFromClass={setFromClass}
                        onFromSection={setFromSection}
                        onToClass={setToClass}
                        onToSection={setToSection}
                        onBack={() => goStep(1)}
                        onNext={() => goStep(3)}
                      />

                      <div className={`wizard-step-panel${step === 3 ? ' active' : ''}`} data-panel="3">
                        <ClassOverview
                          blocks={overviewBlocks}
                          readinessScore={readinessScore}
                          readinessText={readinessText}
                          revealed={revealed}
                        />

                        <AiInsights cards={aiInsightCards} actions={aiActions} onAction={runAction} />

                        <div className="panel-block mb-3">
                          <StudentFilters
                            fields={filterFields}
                            wiredValues={wiredFilters}
                            onWiredChange={(key, value) =>
                              setWiredFilters((current) => ({ ...current, [key]: value }))
                            }
                            onReset={() => runAction('reset_filters')}
                          />
                          <EligibleStudentsTable
                            rows={filteredRows}
                            visibleCount={filteredRows.length}
                            search={search}
                            onSearch={setSearch}
                            allChecked={allChecked}
                            onToggleAll={toggleAll}
                            onToggleRow={toggleRow}
                            onTargetChange={setTarget}
                            onRemarkChange={setRemark}
                            onExport={() => runAction('export')}
                          />
                        </div>

                        <PromotionAnalytics
                          donutPromotionPct={donutPromotionPct}
                          donutDetainedPct={donutDetainedPct}
                          classWiseBars={classWiseBars}
                          genderDistribution={genderDistribution}
                          performanceDistribution={performanceDistribution}
                          revealed={revealed}
                        />

                        <div className="wizard-navbar" style={{ border: 0, paddingTop: 0 }}>
                          <button type="button" className="promotion-button" onClick={() => goStep(2)}>
                            <i className="ti ti-arrow-left" />
                            Back
                          </button>
                          <button
                            type="button"
                            className="promotion-button promotion-button-primary"
                            onClick={() => goStep(4)}
                          >
                            Review &amp; Confirm
                            <i className="ti ti-arrow-right" />
                          </button>
                        </div>

                        <PromotionBulkBar
                          count={selectedCount}
                          actions={bulkActions}
                          onAction={runAction}
                          onClear={() => runAction('clear_sel')}
                        />
                      </div>

                      <StepConfirm
                        active={step === 4}
                        promoteCount={selectedCount || 37}
                        checklist={step4Checklist}
                        onBack={() => goStep(3)}
                        onOpenConfirm={() => setConfirmOpen(true)}
                      />
                    </div>

                    <RecentPromotions
                      entries={timelineEntries}
                      filter={rpFilter}
                      onFilter={setRpFilter}
                      revealed={revealed}
                    />
                  </div>
                )}
              </div>
              {/* /Premium Promotion Workspace */}
            </div>
          </div>
        </div>
      </div>

      <PromotionModals
        open={confirmOpen}
        promoteCount={selectedCount || 37}
        onClose={() => setConfirmOpen(false)}
        onFinalize={() => runAction('finalize')}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="pwToasts" />
    </>
  );
};

export default StudentPromotion;
