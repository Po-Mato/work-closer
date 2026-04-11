import { useState } from 'react';

interface SWOTQuadrantProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  color: string;
}

export function SWOTQuadrant({ title, value, onChange, color }: SWOTQuadrantProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`swot-quadrant ${expanded ? 'swot-quadrant--expanded' : ''}`}>
      <div className="swot-quadrant__header" onClick={() => setExpanded(!expanded)} style={{ background: color }}>
        <span className="swot-quadrant__title">{title}</span>
        <button
          type="button"
          className="swot-quadrant__toggle"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      <textarea
        className="swot-quadrant__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={title}
        rows={expanded ? 5 : 2}
      />
    </div>
  );
}