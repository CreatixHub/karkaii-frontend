import {
  LABEL_BAND_AT,
  PARTITIONS,
  partitionPercent,
  STORAGE_ADVICE,
} from '../data/systemSettings.data';

export interface DiskBarProps {
  /** The paragraph under the key; the Storage card prints it, the panel does not. */
  advice?: boolean;
  className?: string;
}

const DiskBar = ({ advice = false, className = '' }: DiskBarProps) => (
  <>
    <div className={`sys-disk${className ? ` ${className}` : ''}`}>
      {PARTITIONS.map((part) => {
        const width = partitionPercent(part);

        return (
          <span className={`sys-part ${part.tone} sys-p-${width}`} key={part.id}>
            {width >= LABEL_BAND_AT ? `${part.size} GB` : ''}
          </span>
        );
      })}
    </div>
    <div className="sys-disk-key">
      {PARTITIONS.map((part) => (
        <span key={part.id}>
          <i className={part.tone} />
          {part.label} <b>{part.size} GB</b>
        </span>
      ))}
    </div>
    {advice ? <p className="fs-12 text-muted mb-0 mt-3">{STORAGE_ADVICE}</p> : null}
  </>
);

export default DiskBar;
