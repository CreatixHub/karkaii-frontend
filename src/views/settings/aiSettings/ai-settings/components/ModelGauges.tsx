import type { Model } from '../data/aiSettings.data';
import { maxTokensPercent, rulerOf, temperaturePercent, tokens } from '../data/aiSettings.data';

export interface RulerProps {
  model: Model;
  /** The sentence under the ruler; the workspace adds a clause to it. */
  tail?: string;
  className?: string;
}

export const Ruler = ({ model, tail = '', className = '' }: RulerProps) => {
  const { p, q } = rulerOf(model);

  return (
    <div className={`aig-ruler${className ? ` ${className}` : ''}`}>
      <div className={`aig-ruler-track aig-p-${p} aig-q-${q}`}>
        <span />
        <em />
      </div>
      <div className="aig-ruler-scale">
        <span>0</span>
        <span>{model.window}k tokens</span>
      </div>
      <p className="aig-ruler-meta mb-0">
        A typical request uses about <b>{model.typical}k</b>, with <b>{model.reserve}k</b> held back
        for the reply.
        {tail ? ` ${tail}` : ''}
      </p>
    </div>
  );
};

export interface DialProps {
  label: string;
  value: string;
  percent: number;
  from: string;
  to: string;
}

export const Dial = ({ label, value, percent, from, to }: DialProps) => (
  <div className="aig-dial">
    <div className="aig-dial-top">
      <span>{label}</span>
      <b>{value}</b>
    </div>
    <div className={`aig-dial-track aig-p-${percent}`}>
      <i />
    </div>
    <div className="aig-dial-ends">
      <span>{from}</span>
      <span>{to}</span>
    </div>
  </div>
);

/** The temperature and output dials every model card shows, in that order. */
export const ModelDials = ({ model }: { model: Model }) => (
  <>
    <Dial
      label="Temperature"
      value={model.temperature.toFixed(1)}
      percent={temperaturePercent(model.temperature)}
      from="0.0"
      to="2.0"
    />
    <Dial
      label="Maximum output tokens"
      value={tokens(model.maxTokens)}
      percent={maxTokensPercent(model.maxTokens)}
      from="256"
      to="16,384"
    />
  </>
);
