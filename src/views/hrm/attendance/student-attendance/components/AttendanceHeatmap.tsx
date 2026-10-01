import { ABSENT, HEAT } from '../data/attendanceRegister.data';

export interface AttendanceHeatmapProps {
  heatKey: string;
  large?: boolean;
  ariaLabel: string;
}

const AttendanceHeatmap = ({ heatKey, large, ariaLabel }: AttendanceHeatmapProps) => {
  const levels = HEAT[heatKey] ?? HEAT['1'];
  const absentDays = ABSENT[heatKey] ?? [];

  return (
    <div
      className={`attendance-heatmap${large ? ' attendance-heatmap-lg' : ''}`}
      aria-label={ariaLabel}
      role="img"
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className={absentDays.includes(index) ? 'is-absent' : level > 0 ? `l${level}` : undefined}
          title={`Day ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default AttendanceHeatmap;
