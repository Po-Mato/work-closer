import { useAppStore } from '../../store/useAppStore';

const COMMUTE_TIMES = [15, 30, 45, 60];

export function CommuteTimeSelector() {
  const travelTimeMinutes = useAppStore((state) => state.travelTimeMinutes);
  const setTravelTimeMinutes = useAppStore((state) => state.setTravelTimeMinutes);

  return (
    <div className="input-group">
      <label htmlFor="commute-time">최대 출퇴근 시간</label>
      <div className="time-options">
        {COMMUTE_TIMES.map((minutes) => (
          <button
            key={minutes}
            id="commute-time"
            type="button"
            className={`time-option ${travelTimeMinutes === minutes ? 'selected' : ''}`}
            onClick={() => setTravelTimeMinutes(minutes)}
          >
            {minutes}분
          </button>
        ))}
      </div>
    </div>
  );
}
