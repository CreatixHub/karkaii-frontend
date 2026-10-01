import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { PromotionRowState } from '../data/studentPromotion.data';
import { tableHeaders } from '../data/studentPromotion.data';

const routes = all_routes;

export interface EligibleStudentsTableProps {
  rows: PromotionRowState[];
  visibleCount: number;
  search: string;
  onSearch: (value: string) => void;
  allChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  onToggleRow: (id: string) => void;
  onTargetChange: (id: string, value: string) => void;
  onRemarkChange: (id: string, value: string) => void;
  onExport: () => void;
}

const EligibleStudentsTable = ({
  rows,
  visibleCount,
  search,
  onSearch,
  allChecked,
  onToggleAll,
  onToggleRow,
  onTargetChange,
  onRemarkChange,
  onExport,
}: EligibleStudentsTableProps) => (
  <div className="panel-block-body" style={{ paddingTop: 0 }}>
    <div className="tile-head mb-3">
      <h6 className="heading-row mb-0">
        <i className="ti ti-list-check" />
        Eligible Students <span className="sub-label">{visibleCount} students</span>
      </h6>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <div className="form-field" style={{ minWidth: 200 }}>
          <input
            type="text"
            className="text-input"
            id="pwSearch"
            placeholder="Search name or admission no…"
            aria-label="Search name or admission no…"
            style={{ height: 36 }}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
        <button type="button" className="promotion-button promotion-button-sm" onClick={onExport}>
          <i className="ti ti-file-export" />
          Export
        </button>
      </div>
    </div>

    <div className="table-wrap">
      <table className="promotion-table" id="pwTable">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="check-box"
                id="pwSelectAll"
                aria-label="Select all rows"
                checked={allChecked}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody id="pwTbody">
          {rows.map((row) => (
            <tr
              key={row.id}
              className={row.selected ? 'sel' : undefined}
              data-name={row.name}
              data-adm={row.id}
              data-att={row.dataAtt}
              data-perf={row.dataPerf}
              data-fee={row.dataFee}
              data-status={row.dataStatus}
            >
              <td>
                <input
                  type="checkbox"
                  className="check-box record-row-check-promotion"
                  aria-label="Select row"
                  checked={row.selected}
                  onChange={() => onToggleRow(row.id)}
                />
              </td>
              <td>
                <div className="student-cell">
                  <img src={row.img} alt="" />
                  <div>
                    <b>{row.name}</b>
                    <span>
                      Roll {row.roll} &middot; {row.house}
                    </span>
                  </div>
                </div>
              </td>
              <td>{row.id}</td>
              <td>{row.roll}</td>
              <td>{row.currentClass}</td>
              <td>
                <div className="metric-row">
                  <span className="mv">{row.attendancePct}%</span>
                  <div className={`meter-bar-promotion ${row.attendanceTone}`}>
                    <span style={{ width: `${row.attendancePct}%` }} />
                  </div>
                </div>
              </td>
              <td>
                <div className="metric-row">
                  <span className="mv">{row.academicLabel}</span>
                  <div className={`meter-bar-promotion ${row.academicTone}`}>
                    <span style={{ width: `${row.academicPct}%` }} />
                  </div>
                </div>
              </td>
              <td>
                <div className="metric-row">
                  <span className="mv">{row.behaviorLabel}</span>
                  <div className={`meter-bar-promotion ${row.behaviorTone}`}>
                    <span style={{ width: `${row.behaviorPct}%` }} />
                  </div>
                </div>
              </td>
              <td>
                <span className={`pill-tag ${row.feeTone}`}>
                  <i className={row.feeIcon} />
                  {row.feeLabel}
                </span>
              </td>
              <td>
                <span className={`pill-tag ${row.recommendationTone}`}>
                  <i className={row.recommendationIcon} />
                  {row.recommendationLabel}
                </span>
              </td>
              <td>
                <select
                  className="table-select"
                  aria-label={row.targetOptions[row.defaultTargetIndex]}
                  value={row.target}
                  onChange={(event) => onTargetChange(row.id, event.target.value)}
                >
                  {row.targetOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="remark-note"
                  placeholder="Add remark"
                  aria-label="Add remark"
                  value={row.remark}
                  onChange={(event) => onRemarkChange(row.id, event.target.value)}
                />
              </td>
              <td>
                <Link to={routes.studentDetail} className="icon-button-promotion" title="View">
                  <i className="ti ti-eye" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="promotion-cards" id="pwCards">
      {rows.map((row) => (
        <div className="promotion-card" data-adm={row.id} key={row.id}>
          <div className="promotion-card-top">
            <div className="student-cell">
              <img src={row.img} alt="" />
              <div>
                <b>{row.name}</b>
                <span>
                  Roll {row.roll} &middot; {row.house}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              className="check-box pw-rowcheck"
              data-adm={row.id}
              checked={row.selected}
              onChange={() => onToggleRow(row.id)}
              aria-label={`Select ${row.name}`}
            />
          </div>
          <div className="promotion-card-grid">
            <div>
              <div className="k">Current Class</div>
              <div className="v">{row.currentClass}</div>
            </div>
            <div>
              <div className="k">Attendance</div>
              <div className="v">{row.attendancePct}%</div>
            </div>
            <div>
              <div className="k">Academic</div>
              <div className="v">{row.academicLabel}</div>
            </div>
            <div>
              <div className="k">Fee</div>
              <div className="v">
                <span className={`pill-tag ${row.feeTone}`}>
                  <i className={row.feeIcon} />
                  {row.feeLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span className={`pill-tag ${row.recommendationTone}`}>
              <i className={row.recommendationIcon} />
              {row.recommendationLabel}
            </span>
            <Link to={routes.studentDetail} className="promotion-button pw-btn-sm">
              <i className="ti ti-eye" />
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EligibleStudentsTable;
