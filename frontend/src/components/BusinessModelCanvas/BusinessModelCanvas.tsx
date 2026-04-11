import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BMCGrid } from './BMCGrid';
import type { BMCBlockData, BusinessModelCanvas } from '../../types';

export function BusinessModelCanvas() {
  const canvas = useAppStore((state) => state.businessModelCanvas);
  const setBusinessModelCanvas = useAppStore((state) => state.setBusinessModelCanvas);
  const updateBusinessModelCanvas = useAppStore((state) => state.updateBusinessModelCanvas);

  useEffect(() => {
    if (!canvas) {
      setBusinessModelCanvas({
        id: 'bmc-1',
        keyPartners: '',
        keyActivities: '',
        keyResources: '',
        valuePropositions: '',
        customerRelationships: '',
        channels: '',
        customerSegments: '',
        costStructure: '',
        revenueStreams: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [canvas, setBusinessModelCanvas]);

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