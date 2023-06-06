import { useContext, useEffect, useRef, ReactNode, useState } from 'react';
import { MapContext, LatLngI } from './Map';

interface PolyLinePropsI {
  latlngs: LatLngI[];
}

export const PolyLine = ({ latlngs }: PolyLinePropsI) => {
  console.log(`[PolyLine]trigger`);
  const { map, BMapGL } = useContext(MapContext);

  const compRef = useRef<any | null>(null);

  useEffect(() => {
    console.log(`[PolyLine]useEffect`);
    if (map === null) {
      return;
    }
    const points = latlngs.map(
      (latlng) => new BMapGL.Point(latlng.lng, latlng.lat)
    );
    let PolyLine: any = compRef.current;
    if (PolyLine === null) {
      PolyLine = new BMapGL.Polyline(points, {
        strokeColor: 'blue',
        strokeWeight: 6,
        strokeOpacity: 0.5,
      });
      map.addOverlay(PolyLine);
      compRef.current = PolyLine;
    } else {
      PolyLine.setPath(points);
    }

    return () => {
      console.log(`[PolyLine]useEffect clear`);
      if (compRef.current) {
        map.removeOverlay(compRef.current);
        compRef.current = null;
      }
    };
  }, [map, BMapGL, latlngs]);

  return null;
};
