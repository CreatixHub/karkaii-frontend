export interface CopyrightLineProps {
  /** The template varies the paragraph's classes between layouts. */
  className?: string;
}

export const PRODUCT = 'Karkaii';

const CopyrightLine = ({ className }: CopyrightLineProps) => (
  <p className={className}>
    Copyright © {new Date().getFullYear()} - {PRODUCT}
  </p>
);

export default CopyrightLine;
