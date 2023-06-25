import {
  createContext,
  useRef,
  useEffect,
  CSSProperties,
  useState,
  forwardRef,
  useImperativeHandle,
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

export interface RouteResI {
  latlngs: LatLngI[];
  dis: number;
}

export interface MapHandleI {
  getRoute: (startLatlng: LatLngI, endLatlng: LatLngI) => Promise<RouteResI>;
  getMapInstance: () => any;
}

export const Map = forwardRef<MapHandleI, MapPropsI>((props, ref) => {
  console.log(`[trigger]Map`);
  const { style, children, center, zoom } = props;
  const domRef = useRef(null);
  const compRef = useRef<any | null>(null);
  // FIXME: 这里如果不用state用ref的话,Menu监听不到Map的初始化,能不用state么
  const [contextState, setContextState] = useState<ContextI>({
    map: null,
    BMapGL: null,
  });
  const ridingRouteRef = useRef<any | null>(null);

  useEffect(() => {
    console.log(`[Map]useEffect`);
    const BMapGL = (window as any).BMapGL;
    let map: any = compRef.current;
    if (!map) {
      map = new BMapGL.Map(domRef.current);
      map.enableScrollWheelZoom();
      const scaleCtrl = new BMapGL.ScaleControl();
      map.addControl(scaleCtrl);
      const zoomCtrl = new BMapGL.ZoomControl();
      map.addControl(zoomCtrl);

      compRef.current = map;
      setContextState({ map, BMapGL });
      ridingRouteRef.current = new BMapGL.RidingRoute(map);
    }
    map.centerAndZoom(new BMapGL.Point(center.lng, center.lat), zoom);

    return () => {
      console.log(`[Map]useEffect clear`);
    };
  }, [center, zoom]);

  useImperativeHandle(ref, () => ({
    getRoute: (startLatlng: LatLngI, endLatlng: LatLngI) => {
      return new Promise((resolve, reject) => {
        const BMapGL = (window as any).BMapGL;
        const ridingRoute = ridingRouteRef.current;
        if (ridingRoute === null) {
          resolve({ dis: 0, latlngs: [] });
          return;
        }
        const startPoint = new BMapGL.Point(startLatlng.lng, startLatlng.lat);
        const endPoint = new BMapGL.Point(endLatlng.lng, endLatlng.lat);
        ridingRoute.setSearchCompleteCallback((res: any) => {
          const plan = res.getPlan(0);
          const route = plan?.getRoute(0);
          if (!route) {
            resolve({ dis: 0, latlngs: [] });
            return;
          }
          const { _distance: dis, _points: latlngs } = route;
          resolve({ dis, latlngs });
          ridingRoute.clearResults();
        });
        ridingRoute.search(startPoint, endPoint);
      });
    },
    getMapInstance: () => {
      return compRef.current;
    },
  }));

  return (
    <div style={style} ref={domRef}>
      <MapContext.Provider value={contextState}>{children}</MapContext.Provider>
    </div>
  );
});
