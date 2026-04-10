import { useAppStore } from '../../store/useAppStore';
import type { TravelMode } from '../../types';

const TRAVEL_MODES: { value: TravelMode; label: string }[] = [
  { value: 'car', label: '자가용' },
  { value: 'transit', label: '대중교통' },
  { value: 'walk', label: '도보' },
];

export function TravelModeSelector() {
  const travelMode = useAppStore((state) => state.travelMode);
  const setTravelMode = useAppStore((state) => state.setTravelMode);

  return (
    <div className="input-group">
      <label htmlFor="travel-mode">이동 수단</label>
      <div className="mode-options">
        {TRAVEL_MODES.map(({ value, label }) => (
          <button
            key={value}
            id="travel-mode"
            type="button"
            className={`mode-option ${travelMode === value ? 'selected' : ''}`}
            onClick={() => setTravelMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
