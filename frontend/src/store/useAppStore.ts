import { create } from 'zustand';
import type { Coordinates, TravelMode, GeoJSONFeatureCollection } from '../types';

interface AppState {
  destination: Coordinates | null;
  travelTimeMinutes: number;
  travelMode: TravelMode;
  considerTraffic: boolean;
  mapCenter: Coordinates;
  isochroneData: GeoJSONFeatureCollection | null;
  clickedPoint: Coordinates | null;

  setDestination: (destination: Coordinates | null) => void;
  setTravelTimeMinutes: (minutes: number) => void;
  setTravelMode: (mode: TravelMode) => void;
  setConsiderTraffic: (consider: boolean) => void;
  setMapCenter: (center: Coordinates) => void;
  setIsochroneData: (data: GeoJSONFeatureCollection | null) => void;
  setClickedPoint: (point: Coordinates | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  destination: null,
  travelTimeMinutes: 30,
  travelMode: 'car',
  considerTraffic: false,
  mapCenter: { longitude: 127.036, latitude: 37.566 }, // Seoul default
  isochroneData: null,
  clickedPoint: null,

  setDestination: (destination) => set({ destination }),
  setTravelTimeMinutes: (travelTimeMinutes) => set({ travelTimeMinutes }),
  setTravelMode: (travelMode) => set({ travelMode }),
  setConsiderTraffic: (considerTraffic) => set({ considerTraffic }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setIsochroneData: (isochroneData) => set({ isochroneData }),
  setClickedPoint: (clickedPoint) => set({ clickedPoint }),
}));
