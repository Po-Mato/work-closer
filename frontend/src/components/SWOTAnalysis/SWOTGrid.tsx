import { SWOTQuadrant } from './SWOTQuadrant';
import type { SWOTData } from '../../types';

interface SWOTGridProps {
  data: SWOTData;
  onChange: (key: keyof SWOTData, value: string) => void;
}

export function SWOTGrid({ data, onChange }: SWOTGridProps) {
  return (
    <div className="swot-grid">
      <SWOTQuadrant title="Strengths" value={data.strengths} onChange={(v) => onChange('strengths', v)} color="#22c55e" />
      <SWOTQuadrant title="Weaknesses" value={data.weaknesses} onChange={(v) => onChange('weaknesses', v)} color="#ef4444" />
      <SWOTQuadrant title="Opportunities" value={data.opportunities} onChange={(v) => onChange('opportunities', v)} color="#3b82f6" />
      <SWOTQuadrant title="Threats" value={data.threats} onChange={(v) => onChange('threats', v)} color="#f59e0b" />
    </div>
  );
}