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

interface MapPropsI {
  center: LatLngI;
  zoom: number;
  children?: any;
  style?: CSSProperties;
}

interface ContextI {
  map: any | null;
  BMapGL: any | null;
}

export const MapContext = createContext<ContextI>({
  map: null,
  BMapGL: null,
});

export const Map = (props: MapPropsI) => {
  console.log(`[trigger]Map`);
  const { style, children, center, zoom } = props;
  const domRef = useRef(null);

  const compRef = useRef<any | null>(null);
  // FIXME: 这里如果不用state用ref的话,Menu监听不到Map的初始化,能不用state么
  const [contextState, setContextState] = useState<ContextI>({
    map: null,
    BMapGL: null,
  });

  useEffect(() => {
    console.log(`[Map]useEffect`);
    const BMapGL = (window as any).BMapGL;
    let map: any = compRef.current;
    if (!map) {
      map = new BMapGL.Map(domRef.current);
      compRef.current = map;
      setContextState({ map, BMapGL });
    }
    map.centerAndZoom(new BMapGL.Point(center.lng, center.lat), zoom);

    return () => {
      console.log(`[Map]useEffect clear`);
    };
  }, [center, zoom]);

  return (
    <div style={style} ref={domRef}>
      <MapContext.Provider value={contextState}>{children}</MapContext.Provider>
    </div>
  );
};
