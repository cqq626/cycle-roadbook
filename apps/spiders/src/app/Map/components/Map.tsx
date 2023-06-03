import {
  createContext,
  useRef,
  useEffect,
  CSSProperties,
  useState,
} from 'react';

export interface LatLngI {
  lat: number;
  lng: number;
}

export interface MapPropsI {
  center: LatLngI;
  zoom: number;
  children?: any;
  style?: CSSProperties;
}

export interface MapContextPropsI {
  map: any | null;
  BMapGL: any | null;
}

export const MapContext = createContext<MapContextPropsI>({
  map: null,
  BMapGL: null,
});

export const Map = (props: MapPropsI) => {
  console.log(`[trigger]Map`);
  const { style, children, center, zoom } = props;
  const domRef = useRef(null);

  // FIXME: 这里如果不用state用ref的话,Menu监听不到Map的初始化,能不用state么
  const [contextState, setContextState] = useState({ map: null, BMapGL: null });

  const initOrModifyMap = () => {
    console.log(`[initOrModify]Map`);
    const BMapGL = (window as any).BMapGL;
    let map: any = contextState.map;
    if (!map) {
      map = new BMapGL.Map(domRef.current);
      setContextState({ map, BMapGL });
    }
    map.centerAndZoom(new BMapGL.Point(center.lng, center.lat), zoom);
  };

  const remove = () => {
    console.log(`[remove]Map`);
  };

  useEffect(() => {
    initOrModifyMap();
    return remove;
  }, [center, zoom]);

  return (
    <div style={style} ref={domRef}>
      <MapContext.Provider value={contextState}>{children}</MapContext.Provider>
    </div>
  );
};
