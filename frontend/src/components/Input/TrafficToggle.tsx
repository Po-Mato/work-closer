import { useAppStore } from '../../store/useAppStore';

export function TrafficToggle() {
  const considerTraffic = useAppStore((state) => state.considerTraffic);
  const setConsiderTraffic = useAppStore((state) => state.setConsiderTraffic);
  const travelMode = useAppStore((state) => state.travelMode);

  if (travelMode !== 'car') {
    return null;
  }

  return (
    <div className="input-group traffic-toggle">
      <label htmlFor="traffic-toggle">
        <input
          id="traffic-toggle"
          type="checkbox"
          checked={considerTraffic}
          onChange={(e) => setConsiderTraffic(e.target.checked)}
        />
        <span>출퇴근 시간대 교통량 반영</span>
      </label>
    </div>
  );
}
