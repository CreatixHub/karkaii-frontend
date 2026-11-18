import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { getSchoolStrength } from '@services/reports/reports.api';
import type { SchoolStrength } from '@services/reports/reports.api';
import { DEFAULT_OPTIONS, buildCsv, buildReportHtml } from './reportHtml';
import type { ReportOptions } from './reportHtml';

const routes = all_routes;

type SectionKey = 'summary' | 'faculty' | 'facultyList' | 'studentsGender' | 'classWise' | 'studentList';

const SECTIONS: [SectionKey, string][] = [
  ['summary', 'Summary (key figures)'],
  ['faculty', 'Faculty — counts by gender, type, status'],
  ['facultyList', 'Faculty list — names'],
  ['studentsGender', 'Students — gender-wise'],
  ['classWise', 'Students — class-wise & gender-wise'],
  ['studentList', 'Student list — names, class-wise'],
];

const SchoolStrengthReport = () => {
  const [data, setData] = useState<SchoolStrength | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [opts, setOpts] = useState<ReportOptions>(DEFAULT_OPTIONS);
  const [generated, setGenerated] = useState<{ data: SchoolStrength; opts: ReportOptions } | null>(null);

  // loaded once so the class dropdown has real classes to offer
  useEffect(() => {
    let cancelled = false;
    getSchoolStrength()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load the report data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = (change: Partial<ReportOptions>) => setOpts((current) => ({ ...current, ...change }));

  const generate = async () => {
    if (!SECTIONS.some(([key]) => opts[key])) {
      setError('Tick at least one section to include in the report.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const fresh = await getSchoolStrength(); // always the latest numbers
      setData(fresh);
      setGenerated({ data: fresh, opts: { ...opts } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate the report.');
    } finally {
      setBusy(false);
    }
  };

  const previewHtml = useMemo(
    () => (generated ? buildReportHtml(generated.data, generated.opts) : ''),
    [generated],
  );

  const downloadPdf = () => {
    if (!generated) return;
    const win = window.open('', '_blank');
    if (!win) {
      setError('Allow pop-ups for this site, then click Download PDF again.');
      return;
    }
    win.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>School Strength Report</title>
       <style>body{margin:24px;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4;margin:14mm}thead{display:table-header-group}</style>
       </head><body>${previewHtml}</body></html>`,
    );
    win.document.close();
    win.focus();
    window.setTimeout(() => win.print(), 400); // choose "Save as PDF" in the print window
  };

  const downloadExcel = () => {
    if (!generated) return;
    const blob = new Blob(['\uFEFF' + buildCsv(generated.data, generated.opts)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `school-strength-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const classes = data?.students.classes ?? [];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">School Strength Report</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Reports</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  School Strength
                </li>
              </ol>
            </nav>
          </div>
          {generated ? (
            <div className="d-flex align-items-center flex-wrap mb-2 gap-2">
              <button type="button" className="btn btn-outline-light bg-white" onClick={downloadExcel}>
                <i className="ti ti-file-type-xls me-1" />
                Download Excel
              </button>
              <button type="button" className="btn btn-primary" onClick={downloadPdf}>
                <i className="ti ti-file-type-pdf me-1" />
                Download PDF
              </button>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
            <span>{error}</span>
            <button type="button" className="btn-close" aria-label="Dismiss" onClick={() => setError('')} />
          </div>
        ) : null}

        <div className="row g-3">
          {/* Choose what to include */}
          <div className="col-xl-4">
            <div className="card">
              <div className="card-header border-bottom">
                <h5 className="mb-0">Choose report contents</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label" htmlFor="rp-school">
                    School name
                  </label>
                  <input
                    id="rp-school"
                    className="form-control"
                    value={opts.schoolName}
                    onChange={(event) => patch({ schoolName: event.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="rp-by">
                    Prepared by (optional)
                  </label>
                  <input
                    id="rp-by"
                    className="form-control"
                    placeholder="e.g. Principal / Admin office"
                    value={opts.preparedBy}
                    onChange={(event) => patch({ preparedBy: event.target.value })}
                  />
                </div>

                <div className="form-label mb-2">Sections to include</div>
                {SECTIONS.map(([key, label]) => (
                  <div className="form-check mb-2" key={key}>
                    <input
                      id={`rp-${key}`}
                      type="checkbox"
                      className="form-check-input"
                      checked={opts[key]}
                      onChange={(event) => patch({ [key]: event.target.checked } as Partial<ReportOptions>)}
                    />
                    <label className="form-check-label" htmlFor={`rp-${key}`}>
                      {label}
                    </label>
                  </div>
                ))}

                <div className="mt-3 mb-4">
                  <label className="form-label" htmlFor="rp-class">
                    Class (for the student sections)
                  </label>
                  <select
                    id="rp-class"
                    className="form-select"
                    value={opts.classId}
                    onChange={(event) => patch({ classId: event.target.value })}
                  >
                    <option value="all">All classes</option>
                    {classes.map((c) => (
                      <option key={c.classId} value={c.classId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={busy || loading}
                  onClick={generate}
                >
                  {busy ? 'Generating…' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                {generated ? (
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                  <div className="text-center text-muted py-5">
                    {loading
                      ? 'Loading…'
                      : 'Choose what to include, then click Generate Report. The preview appears here.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolStrengthReport;