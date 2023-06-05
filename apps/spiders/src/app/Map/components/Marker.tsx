import { useContext, useEffect, useRef, ReactNode, useState } from 'react';
import { MapContext, LatLngI } from './Map';

interface MarkerPropsI {
  latlng: LatLngI;
  enableDragging: boolean;
  popupComp?: ReactNode;
}

export const Marker = ({
  latlng,
  enableDragging = false,
  popupComp,
}: MarkerPropsI) => {
  console.log(`[Marker]trigger`);
  const { map, BMapGL } = useContext(MapContext);

  const compRef = useRef<any | null>(null);
  const popupDomRef = useRef<any | null>(null);

  useEffect(() => {
    console.log(`[Marker]useEffect`);
    if (map === null) {
      return;
    }
    const point = new BMapGL.Point(latlng.lng, latlng.lat);
    let marker: any = compRef.current;
    if (marker === null) {
      marker = new BMapGL.Marker(point, { enableDragging });
      map.addOverlay(marker);
      compRef.current = marker;
    } else {
      marker.setPosition(point);
      if (enableDragging) {
        marker.enableDragging();
      } else {
        marker.disableDragging();
      }
    }

    const popup = new BMapGL.InfoWindow(popupDomRef.current, {
      offset: new BMapGL.Size(0, -25),
      width: 0,
      height: 0,
    });
    const markerCb = () => {
      map.openInfoWindow(popup, point);
    };
    marker.addEventListener('click', markerCb);

    return () => {
      console.log(`[Marker]useEffect clear`);
      if (compRef.current) {
        map.removeOverlay(compRef.current);
        compRef.current.removeEventListener('click', markerCb);
        compRef.current = null;
      }
    };
  }, [map, BMapGL, latlng, enableDragging, popupComp]);

  return (
    <div style={{ display: 'none' }}>
      <div ref={popupDomRef}>{popupComp}</div>
    </div>
  );
};
