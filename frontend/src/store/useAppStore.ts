import { create } from 'zustand';
import type { Coordinates, TravelMode, GeoJSONFeatureCollection, BusinessModelCanvas, SWOTData } from '../types';
import { createBMC } from '../api/bmc';

interface AppState {
  destination: Coordinates | null;
  travelTimeMinutes: number;
  travelMode: TravelMode;
  considerTraffic: boolean;
  mapCenter: Coordinates;
  isochroneData: GeoJSONFeatureCollection | null;
  clickedPoint: Coordinates | null;
  businessModelCanvas: BusinessModelCanvas | null;
  swotData: SWOTData | null;
  bmcSyncStatus: 'idle' | 'loading' | 'syncing' | 'error';

  setDestination: (destination: Coordinates | null) => void;
  setTravelTimeMinutes: (minutes: number) => void;
  setTravelMode: (mode: TravelMode) => void;
  setConsiderTraffic: (consider: boolean) => void;
  setMapCenter: (center: Coordinates) => void;
  setIsochroneData: (data: GeoJSONFeatureCollection | null) => void;
  setClickedPoint: (point: Coordinates | null) => void;
  setBusinessModelCanvas: (canvas: BusinessModelCanvas | null) => void;
  updateBusinessModelCanvas: (updates: Partial<BusinessModelCanvas>) => void;
  setSwotData: (data: SWOTData | null) => void;
  updateSwotData: (updates: Partial<SWOTData>) => void;
  initBMC: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  destination: null,
  travelTimeMinutes: 30,
  travelMode: 'car',
  considerTraffic: false,
  mapCenter: { longitude: 127.036, latitude: 37.566 },
  isochroneData: null,
  clickedPoint: null,
  businessModelCanvas: null,
  swotData: null,
  bmcSyncStatus: 'idle',

  setDestination: (destination) => set({ destination }),
  setTravelTimeMinutes: (travelTimeMinutes) => set({ travelTimeMinutes }),
  setTravelMode: (travelMode) => set({ travelMode }),
  setConsiderTraffic: (considerTraffic) => set({ considerTraffic }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setIsochroneData: (isochroneData) => set({ isochroneData }),
  setClickedPoint: (clickedPoint) => set({ clickedPoint }),
  setBusinessModelCanvas: (businessModelCanvas) => set({ businessModelCanvas }),
  updateBusinessModelCanvas: (updates) =>
    set((state) => ({
      businessModelCanvas: state.businessModelCanvas
        ? { ...state.businessModelCanvas, ...updates, updatedAt: new Date().toISOString() }
        : null,
    })),
  setSwotData: (swotData) => set({ swotData }),
  updateSwotData: (updates) =>
    set((state) => ({
      swotData: state.swotData ? { ...state.swotData, ...updates } : null,
    })),
  initBMC: async () => {
    set({ bmcSyncStatus: 'loading' });
    try {
      const bmc = await createBMC();
      set({
        businessModelCanvas: {
          id: bmc.id,
          keyPartners: bmc.keyPartners,
          keyActivities: bmc.keyActivities,
          keyResources: bmc.keyResources,
          valuePropositions: bmc.valuePropositions,
          customerRelationships: bmc.customerRelationships,
          channels: bmc.channels,
          customerSegments: bmc.customerSegments,
          costStructure: bmc.costStructure,
          revenueStreams: bmc.revenueStreams,
          createdAt: bmc.createdAt,
          updatedAt: bmc.updatedAt,
        },
        bmcSyncStatus: 'idle',
      });
    } catch {
      set({ bmcSyncStatus: 'error' });
    }
  },
}));
