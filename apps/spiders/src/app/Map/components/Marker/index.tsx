import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MapContext, LatLngI } from '../Map';

interface MarkerPropsI {
  latlng: LatLngI;
  enableDragging: boolean;
  children?: any;
}

interface ContextI {
  marker: any | null;
}
export const MarkerContext = createContext<ContextI>({
  marker: null,
});

export const Marker = ({
  latlng,
  enableDragging = false,
  children,
}: MarkerPropsI) => {
  console.log(`[Marker]trigger`);
  const { map, BMapGL } = useContext(MapContext);

  const compRef = useRef<any | null>(null);
  const [contextState, setContextState] = useState<ContextI>({ marker: null });

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
      setContextState({ marker });
    } else {
      marker.setPosition(point);
      if (enableDragging) {
        marker.enableDragging();
      } else {
        marker.disableDragging();
      }
    }

    return () => {
      console.log(`[Marker]useEffect clear`);
      if (compRef.current) {
        map.removeOverlay(compRef.current);
        compRef.current = null;
      }
    };
  }, [map, BMapGL, latlng, enableDragging]);

  return (
    <MarkerContext.Provider value={contextState}>
      {children}
    </MarkerContext.Provider>
  );
};
