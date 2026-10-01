import { useEffect, useMemo, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
  attendanceHeatmapSeries,
  buildAttendanceHeatmapOptions,
} from '../data/adminDashboard.charts';

const FALLBACK_SURFACE = '#FFFFFF';

const AttendanceHeatmapChart = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [surfaceColor, setSurfaceColor] = useState(FALLBACK_SURFACE);

  useEffect(() => {
    const readSurface = () => {
      const host = hostRef.current;
      if (!host) return;
      const card = host.closest('.card') ?? host;
      const background = window.getComputedStyle(card).backgroundColor;
      if (background) setSurfaceColor(background);
    };

    readSurface();

    // The theme switcher toggles `data-theme` on <html>; re-read the surface
    // colour so the cell gaps keep matching the card.
    const observer = new MutationObserver(readSurface);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const options = useMemo(
    () => buildAttendanceHeatmapOptions(surfaceColor),
    [surfaceColor],
  );

  return (
    <div ref={hostRef} className="chart-fill mb-2">
      <ReactApexChart
        options={options}
        series={attendanceHeatmapSeries}
        type="heatmap"
        height={380}
      />
    </div>
  );
};

export default AttendanceHeatmapChart;
