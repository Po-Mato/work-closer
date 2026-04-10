import type { IsochroneRequest, IsochroneResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchIsochrone(params: IsochroneRequest): Promise<IsochroneResponse> {
  const { startLongitude, startLatitude, travelTimeMinutes, travelMode } = params;

  const response = await fetch(`${API_BASE_URL}/isochrone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start_longitude: startLongitude,
      start_latitude: startLatitude,
      travel_time_minutes: travelTimeMinutes,
      travel_mode: travelMode,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch isochrone: ${response.status} ${errorBody}`);
  }

  return response.json() as Promise<IsochroneResponse>;
}
