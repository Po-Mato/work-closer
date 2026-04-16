import { useQuery } from '@tanstack/react-query';
import { fetchIsochrone } from '../api/isochrone';
import { useAppStore } from '../store/useAppStore';
import type { IsochroneRequest } from '../types';

export function useIsochrone() {
  const destination = useAppStore((state) => state.destination);
  const travelTimeMinutes = useAppStore((state) => state.travelTimeMinutes);
  const travelMode = useAppStore((state) => state.travelMode);
  const considerTraffic = useAppStore((state) => state.considerTraffic);

  const request: IsochroneRequest | null = destination
    ? {
        startLongitude: destination.longitude,
        startLatitude: destination.latitude,
        travelTimeMinutes,
        travelMode,
        considerTraffic,
      }
    : null;

  return useQuery({
    queryKey: ['isochrone', request],
    queryFn: () => (request ? fetchIsochrone(request) : Promise.resolve(null)),
    enabled: request !== null,
    staleTime: 5 * 60 * 1000,
  });
}
