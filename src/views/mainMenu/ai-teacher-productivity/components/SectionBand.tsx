import type { ReactNode } from 'react';

export interface SectionBandProps {
  /** The oversized `.tch-band-n` numeral. */
  n: string;
  title: string;
  sub: string;
  /** Band 02 carries a "Compare teachers" button on the right. */
  children?: ReactNode;
}

const SectionBand = ({ n, title, sub, children }: SectionBandProps) => (
  <div className="tch-band">
    <span className="tch-band-n">{n}</span>
    <div>
      <h2 className="tch-band-title">{title}</h2>
      <p className="tch-band-sub">{sub}</p>
    </div>
    {children ? (
      <div className="ms-auto d-flex align-items-center gap-2 flex-wrap">{children}</div>
    ) : null}
  </div>
);

export default SectionBand;
