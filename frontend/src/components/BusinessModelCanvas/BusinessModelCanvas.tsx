import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BMCGrid } from './BMCGrid';
import type { BMCBlockData, BusinessModelCanvas } from '../../types';

export function BusinessModelCanvas() {
  const canvas = useAppStore((state) => state.businessModelCanvas);
  const updateBusinessModelCanvas = useAppStore((state) => state.updateBusinessModelCanvas);
  const initBMC = useAppStore((state) => state.initBMC);

  useEffect(() => {
    if (!canvas) {
      initBMC();
    }
  }, [canvas, initBMC]);

  const handleBlockChange = (key: BMCBlockData['key'], value: string) => {
    updateBusinessModelCanvas({ [key]: value } as Partial<BusinessModelCanvas>);
  };

  if (!canvas) return null;

  return (
    <div className="business-model-canvas">
      <div className="bmc-header">
        <h2>Business Model Canvas</h2>
        <p className="bmc-subtitle">Define your business model in 9 blocks</p>
      </div>
      <BMCGrid canvas={canvas} onBlockChange={handleBlockChange} />
    </div>
  );
}