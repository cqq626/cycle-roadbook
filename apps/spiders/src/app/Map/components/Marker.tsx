import { useContext, useRef, useEffect } from 'react';
import { MapContext, LatLngI } from './Map';

export interface MarkerPropsI {
  latlng: LatLngI;
  enableDragging: boolean;
}

export const Marker = ({ latlng, enableDragging = false }: MarkerPropsI) => {
  console.log(`[trigger]Marker`);
  const compRef = useRef(null);
  const { map, BMapGL } = useContext(MapContext);

  const initOrModify = () => {
    console.log(`[initOrModify]Marker`);
    if (map === null) {
      return;
    }
    let comp = compRef.current;
    if (comp !== null) {
      map.removeOverlay(comp);
    }
    const point = new BMapGL.Point(latlng.lng, latlng.lat);
    comp = new BMapGL.Marker(point, { enableDragging });
    map.addOverlay(comp);
    compRef.current = comp;
  };

  const remove = () => {
    console.log(`[remove]Marker`);
    if (map === null) {
      return;
    }
    if (compRef.current !== null) {
      map.removeOverlay(compRef.current);
    }
  };

  useEffect(() => {
    initOrModify();
    return remove;
  }, [map]);

  return null;
};
