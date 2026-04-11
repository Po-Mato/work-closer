import { useState } from 'react';
import type { BMCBlockData } from '../../types';

interface BMCBlockProps {
  block: BMCBlockData;
  value: string;
  onChange: (key: BMCBlockData['key'], value: string) => void;
}

export function BMCBlock({ block, value, onChange }: BMCBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bmc-block ${expanded ? 'bmc-block--expanded' : ''}`}>
      <div className="bmc-block__header" onClick={() => setExpanded(!expanded)}>
        <span className="bmc-block__title">{block.label}</span>
        <button
          type="button"
          className="bmc-block__toggle"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      <textarea
        className="bmc-block__textarea"
        value={value}
        onChange={(e) => onChange(block.key, e.target.value)}
        placeholder={block.label}
        rows={expanded ? 4 : 2}
      />
    </div>
  );
}