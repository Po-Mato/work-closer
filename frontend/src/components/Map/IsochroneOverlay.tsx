import { useEffect } from 'react';
import { Polygon } from 'react-naver-maps';
import { useAppStore } from '../../store/useAppStore';
import { useIsochrone } from '../../hooks/useIsochrone';
import type { GeoJSONFeatureCollection } from '../../types';

export function IsochroneOverlay() {
  const setIsochroneData = useAppStore((state) => state.setIsochroneData);
  const { data, isLoading, isError } = useIsochrone();

  useEffect(() => {
    if (data) {
      setIsochroneData(data);
    }
  }, [data, setIsochroneData]);

  if (isLoading || isError || !data) {
    return null;
  }

  const polygonFeatures = (data as GeoJSONFeatureCollection).features.filter(
    (f) => f.geometry.type === 'Polygon'
  );

  if (polygonFeatures.length === 0) {
    return null;
  }

  return (
    <>
      {polygonFeatures.map((feature, index) => {
        const coords = feature.geometry.coordinates[0] as number[][];
        const paths = coords as unknown as naver.maps.ArrayOfCoordsLiteral[];

        return (
          <Polygon
            key={index}
            paths={paths}
            fillColor="#3b5998"
            fillOpacity={0.4}
            strokeColor="#1a3a6e"
            strokeWeight={2}
            zIndex={1}
          />
        );
      })}
    </>
  );
}
