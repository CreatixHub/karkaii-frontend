const FleetMap = () => (
  <svg
    viewBox="0 0 1000 620"
    className="w-100 d-block"
    role="img"
    aria-label="Live fleet tracking map with routes, school, bus and pickup markers"
    preserveAspectRatio="xMidYMid meet"
  >
        <g className="text-light"><rect x="0" y="0" width="1000" height="620" fill="currentColor"></rect></g>
        <g className="text-info"><rect x="620" y="360" width="380" height="260" rx="18" fill="currentColor" opacity="0.12"></rect></g>
        <g className="text-success"><rect x="60" y="70" width="230" height="150" rx="16" fill="currentColor" opacity="0.12"></rect></g>
        <g className="text-secondary" opacity="0.10"><path d="M0 160 H1000 M0 300 H1000 M0 460 H1000 M180 0 V620 M400 0 V620 M640 0 V620 M840 0 V620" stroke="currentColor" strokeWidth="2" fill="none"></path></g>
        <g className="text-white"><path d="M120 560 L300 500 L440 360 L640 300 L820 150 L960 90" stroke="currentColor" strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round"></path><path d="M60 300 H960 M440 620 V300" stroke="currentColor" strokeWidth="20" fill="none" strokeLinecap="round"></path></g>
        <g className="text-secondary" opacity="0.35"><path d="M60 300 H960 M440 620 V300" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2 10" strokeLinecap="round"></path></g>
        <g className="text-primary"><circle cx="892" cy="118" r="92" fill="currentColor" opacity="0.06"></circle><circle cx="892" cy="118" r="92" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" opacity="0.5"></circle></g>
        <g className="text-primary"><path d="M120 560 L300 500 L440 360 L640 300 L820 150 L892 118" stroke="currentColor" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></g>
        <g className="text-warning"><circle cx="300" cy="500" r="9" fill="currentColor" stroke="#fff" strokeWidth="3"></circle><circle cx="640" cy="300" r="9" fill="currentColor" stroke="#fff" strokeWidth="3"></circle></g>
        <g className="text-info"><circle cx="440" cy="360" r="9" fill="currentColor" stroke="#fff" strokeWidth="3"></circle><circle cx="820" cy="150" r="9" fill="currentColor" stroke="#fff" strokeWidth="3"></circle></g>
        <g className="text-primary"><rect x="856" y="82" width="72" height="72" rx="16" fill="currentColor"></rect></g>
        <g className="text-white"><path d="M872 132 V104 A20 20 0 0 1 912 104 V132 M868 132 H916 M880 112 H904" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></g>
        <g className="text-primary"><circle cx="300" cy="500" r="24" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7"></circle></g>
        <g className="text-primary"><circle cx="300" cy="500" r="16" fill="currentColor"></circle></g><g className="text-white"><path d="M290 505 V495 H310 V505 M293 505 H307 M294 498 H306" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"></path></g>
        <g className="text-success"><circle cx="640" cy="300" r="14" fill="currentColor" stroke="#fff" strokeWidth="3"></circle></g><g className="text-white"><path d="M632 304 V296 H648 V304 M635 304 H645" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"></path></g>
        <g className="text-success"><circle cx="820" cy="150" r="14" fill="currentColor" stroke="#fff" strokeWidth="3"></circle></g><g className="text-white"><path d="M812 154 V146 H828 V154 M815 154 H825" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"></path></g>
        <g className="text-danger"><circle cx="150" cy="250" r="13" fill="currentColor" stroke="#fff" strokeWidth="3"></circle></g><g className="text-white"><path d="M143 254 V246 H157 V254" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"></path></g>
        <g className="text-dark" opacity="0.75" fontFamily="inherit" fontSize="15" fontWeight="600"><text x="936" y="150" textAnchor="end">Global School</text><text x="300" y="474" textAnchor="middle">BUS-12</text><text x="662" y="292">BUS-14</text><text x="842" y="142">BUS-19</text></g>
  </svg>
);

export default FleetMap;
