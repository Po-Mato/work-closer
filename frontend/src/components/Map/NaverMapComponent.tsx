import { useCallback, useState } from 'react';
import { NaverMap, Marker, InfoWindow } from 'react-naver-maps';
import { Container } from 'react-naver-maps';
import { useAppStore } from '../../store/useAppStore';
import { IsochroneOverlay } from './IsochroneOverlay';

export function NaverMapComponent() {
  const mapCenter = useAppStore((state) => state.mapCenter);
  const destination = useAppStore((state) => state.destination);
  const clickedPoint = useAppStore((state) => state.clickedPoint);
  const setClickedPoint = useAppStore((state) => state.setClickedPoint);
  const [showInfo, setShowInfo] = useState(false);

  const handleMapClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const coord = e.coord;
      setClickedPoint({
        longitude: coord.lng(),
        latitude: coord.lat(),
      });
      setShowInfo(true);
    },
    [setClickedPoint]
  );

  return (
    <Container
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <NaverMap
        center={{ lat: mapCenter.latitude, lng: mapCenter.longitude }}
        defaultZoom={12}
        onClick={handleMapClick}
        draggable
        scrollWheel
        pinchZoom
        keyboardShortcuts
        disableDoubleClickZoom={false}
      >
        {destination && (
          <Marker
            position={{ lat: destination.latitude, lng: destination.longitude }}
            title="도착지"
          />
        )}

        {clickedPoint && showInfo && (
          <InfoWindow
            position={{ lat: clickedPoint.latitude, lng: clickedPoint.longitude }}
            content={`<div style="padding:8px;min-width:120px">
              <strong>선택한 위치</strong><br/>
              위도: ${clickedPoint.latitude.toFixed(6)}<br/>
              경도: ${clickedPoint.longitude.toFixed(6)}
            </div>`}
            open
            onClose={() => setShowInfo(false)}
          />
        )}

        <IsochroneOverlay />
      </NaverMap>
    </Container>
  );
}
