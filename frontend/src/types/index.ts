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

export interface IsochroneResponse extends GeoJSONFeatureCollection {}

export interface CommuteCondition {
  destination: Coordinates | null;
  travelTimeMinutes: number;
  travelMode: TravelMode;
  considerTraffic: boolean;
}
