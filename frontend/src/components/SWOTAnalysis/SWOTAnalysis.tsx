import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SWOTGrid } from './SWOTGrid';
import type { SWOTData } from '../../types';

export function SWOTAnalysis() {
  const swotData = useAppStore((state) => state.swotData);
  const setSwotData = useAppStore((state) => state.setSwotData);
  const updateSwotData = useAppStore((state) => state.updateSwotData);

  useEffect(() => {
    if (!swotData) {
      setSwotData({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
    }
  }, [swotData, setSwotData]);

  const handleChange = (key: keyof SWOTData, value: string) => {
    updateSwotData({ [key]: value });
  };

  if (!swotData) return null;

  return (
    <div className="swot-analysis">
      <div className="swot-header">
        <h2>SWOT Analysis</h2>
        <p className="swot-subtitle">Analyze your idea's strengths, weaknesses, opportunities, and threats</p>
      </div>
      <SWOTGrid data={swotData} onChange={handleChange} />
    </div>
  );
}