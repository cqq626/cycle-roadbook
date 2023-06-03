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

  // FIXME: 这里mapRef和contextState功能有些重
  // 只用mapRef的话,后续menu无法监听到mapRef的赋值进行初始化
  // 只用contextState时,useEffect里会执行多次
  const mapRef = useRef(null);
  const [contextState, setContextState] = useState({ map: null, BMapGL: null });

  useEffect(() => {
    const BMapGL = (window as any).BMapGL;

    if (!mapRef.current) {
      mapRef.current = new BMapGL.Map(domRef.current);
      setContextState({ map: mapRef.current, BMapGL });
    }
    (mapRef.current as any).centerAndZoom(
      new BMapGL.Point(center.lng, center.lat),
      zoom
    );
  }, [center, zoom]);

  return (
    <div style={style} ref={domRef}>
      <MapContext.Provider value={contextState}>{children}</MapContext.Provider>
    </div>
  );
};
