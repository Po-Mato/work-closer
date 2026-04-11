export interface Coordinates {
  longitude: number;
  latitude: number;
}

export type TravelMode = 'car' | 'transit' | 'walk' | 'bicycle';

export interface IsochroneRequest {
  startLongitude: number;
  startLatitude: number;
  travelTimeMinutes: number;
  travelMode: TravelMode;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'Point' | 'MultiPoint';
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export type IsochroneResponse = GeoJSONFeatureCollection;

export interface CommuteCondition {
  destination: Coordinates | null;
  travelTimeMinutes: number;
  travelMode: TravelMode;
  considerTraffic: boolean;
}

export interface ExperimentResponse {
  key: string;
  variants: Record<string, number>;
  active: boolean;
  assigned_variant: string;
}

export interface EventPayload {
  experiment_key: string;
  variant: string;
  event_type: string;
  user_id?: string;
}

export interface BusinessModelCanvas {
  id: string;
  ideaId?: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
  createdAt: string;
  updatedAt: string;
}

export interface BMCBlockData {
  key: keyof Pick<BusinessModelCanvas, 'keyPartners' | 'keyActivities' | 'keyResources' | 'valuePropositions' | 'customerRelationships' | 'channels' | 'customerSegments' | 'costStructure' | 'revenueStreams'>;
  label: string;
}

export interface SWOTData {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}
