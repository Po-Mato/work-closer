import type { IsochroneRequest, IsochroneResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchIsochrone(params: IsochroneRequest): Promise<IsochroneResponse> {
  const { startLongitude, startLatitude, travelTimeMinutes, travelMode } = params;

  const queryParams = new URLSearchParams({
    start_longitude: String(startLongitude),
    start_latitude: String(startLatitude),
    travel_time_minutes: String(travelTimeMinutes),
    travel_mode: travelMode,
  });

  const response = await fetch(`${API_BASE_URL}/isochrone?${queryParams}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch isochrone: ${response.status} ${errorBody}`);
  }

  return response.json() as Promise<IsochroneResponse>;
}
