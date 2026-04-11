import { BMCBlock } from './BMCBlock';
import type { BMCBlockData, BusinessModelCanvas } from '../../types';

interface BMCGridProps {
  canvas: BusinessModelCanvas;
  onBlockChange: (key: BMCBlockData['key'], value: string) => void;
}

const BLOCKS: BMCBlockData[] = [
  { key: 'keyPartners', label: 'Key Partners' },
  { key: 'keyActivities', label: 'Key Activities' },
  { key: 'keyResources', label: 'Key Resources' },
  { key: 'valuePropositions', label: 'Value Propositions' },
  { key: 'customerRelationships', label: 'Customer Relationships' },
  { key: 'channels', label: 'Channels' },
  { key: 'customerSegments', label: 'Customer Segments' },
  { key: 'costStructure', label: 'Cost Structure' },
  { key: 'revenueStreams', label: 'Revenue Streams' },
];

export function BMCGrid({ canvas, onBlockChange }: BMCGridProps) {
  return (
    <div className="bmc-grid">
      {BLOCKS.map((block) => (
        <BMCBlock
          key={block.key}
          block={block}
          value={canvas[block.key] as string}
          onChange={onBlockChange}
        />
      ))}
    </div>
  );
}