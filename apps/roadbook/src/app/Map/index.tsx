import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Button, Input, message } from 'antd';
import { debounce } from 'lodash-es';

import { LatLngI, Map as MapInner, MapHandleI } from './components/Map';
import { Menu, MenuItem, MenuItemOptionI } from './components/Menu';
import { Marker } from './components/Marker';
import { PolyLine } from './components/PolyLine';
import { Circle } from './components/Circle';
import { getSid, getPics } from './streetview/utils';
import { Streetview } from './streetview';
import {
  genNewLatlng,
  genRouteInfo,
  genWayPoint,
  genMenuItem,
  genGpxContent,
} from './utils';

export interface WayPointI {
  latlng: LatLngI;
  pid: string;
}

export interface RouteSegI {
  latlngs: LatLngI[];
  dis: number;
}

export interface MenuItemI {
  mid: string;
  option: MenuItemOptionI;
}

export function Map() {
  console.log(`[trigger]MapWrapper`);
  const [center, setCenter] = useState<LatLngI>({ lat: 39.915, lng: 116.404 });
  const [wayPoints, setWayPointsForState] = useState<WayPointI[]>([]);
  const [routePoints, setRoutePointsForState] = useState<LatLngI[]>([]);
  const [routeDis, setRouteDis] = useState(0);
  const [circleCenter, setCircleCenter] = useState<LatLngI | null>(null);
  const [streetviewMcLatLng, setStreetviewMcLatLng] = useState<LatLngI | null>(
    null
  );
  // const [gpxContent, setGpxContent] = useState('');

  // FIXME:让callback回调里能拿到最新的wayPoints,而不是频繁的setMenuItems
  const wayPointsRef = useRef<WayPointI[]>([]);
  const routeSegsRef = useRef<RouteSegI[]>([]);
  const routePointsRef = useRef<LatLngI[]>([]);
  const mapCompRef = useRef<MapHandleI>(null);
  const searchRef = useRef<any>(null);

  const setWayPoints = (newWayPoints: WayPointI[]) => {
    setWayPointsForState(newWayPoints);
    wayPointsRef.current = newWayPoints;
  };

  const setRoutePoints = (newRoutePoints: LatLngI[]) => {
    setRoutePointsForState(newRoutePoints);
    routePointsRef.current = newRoutePoints;
  };

  const deleteRouteSegs = async (delWayPointIdx: number) => {
    const curWayPoints = wayPointsRef.current;
    if (delWayPointIdx === curWayPoints.length) {
      // 删除尾部
      routeSegsRef.current.splice(delWayPointIdx - 1, 1);
    } else if (delWayPointIdx === 0) {
      // 删除头部
      routeSegsRef.current.splice(0, 1);
    } else {
      // 删除中间
      routeSegsRef.current.splice(delWayPointIdx - 1, 2);
      return addOrModifyRouteSegs(delWayPointIdx - 1, delWayPointIdx);
    }
    const { routeDis, routePoints } = genRouteInfo(routeSegsRef.current);
    setRoutePoints(routePoints);
    setRouteDis(routeDis);
  };
  // startWayPointIdx 对应该 routeSeg 的 idx
  const addOrModifyRouteSegs = async (
    startWayPointIdx: number,
    endWayPointIdx: number,
    isModify = false
  ) => {
    const curWayPoints = wayPointsRef.current;
    const startPoint = curWayPoints[startWayPointIdx];
    const endPoint = curWayPoints[endWayPointIdx];
    const routeSegIdx = endWayPointIdx - 1;
    const mapComp = mapCompRef.current;
    if (mapComp === null) {
      return;
    }
    if (endWayPointIdx === 0) {
      return;
    }
    if (startWayPointIdx === curWayPoints.length - 1) {
      return;
    }
    const newRouteSeg = await mapComp.getRoute(
      startPoint.latlng,
      endPoint.latlng
    );
    routeSegsRef.current.splice(routeSegIdx, isModify ? 1 : 0, newRouteSeg);

    const { routeDis, routePoints } = genRouteInfo(routeSegsRef.current);
    setRoutePoints(routePoints);
    setRouteDis(routeDis);
  };

  const addPoint = async (latlng: LatLngI, targetIdx?: number) => {
    const midPoint = genWayPoint(latlng);
    if (typeof targetIdx !== 'number') {
      // 菜单栏添加途经点
      targetIdx = wayPointsRef.current.length;
    } else {
      // 向前/向后插入需要和基准点产生一部分偏移
      midPoint.latlng = genNewLatlng(latlng);
    }
    wayPointsRef.current.splice(targetIdx, 0, midPoint);
    const newWayPoints = wayPointsRef.current;
    setWayPoints(newWayPoints);
    if (targetIdx === 0) {
      // 插在头部
      addOrModifyRouteSegs(targetIdx, targetIdx + 1);
    } else if (targetIdx + 1 === newWayPoints.length) {
      // 插在尾部
      addOrModifyRouteSegs(targetIdx - 1, targetIdx);
    } else {
      // 插在中间
      addOrModifyRouteSegs(targetIdx - 1, targetIdx, true);
      addOrModifyRouteSegs(targetIdx, targetIdx + 1);
    }
  };
  const delPoint = async (idx: number) => {
    wayPointsRef.current.splice(idx, 1);
    setWayPoints(wayPointsRef.current);
    deleteRouteSegs(idx);
  };
  const clearMap = () => {
    wayPointsRef.current = [];
    setWayPoints([]);
    routeSegsRef.current = [];
    setRoutePoints([]);
    setRouteDis(0);
  };
  const genGpx = async () => {
    // setGpxContent(await genGpxContent(routePointsRef.current));
    const gpsContent = await genGpxContent(routePointsRef.current);
    navigator.clipboard.writeText(gpsContent).then(() => {
      message.success('已复制到粘贴板');
    });
  };
  const toggleCircle = async (latlng?: LatLngI) => {
    if (!latlng) {
      setCircleCenter(null);
    } else {
      setCircleCenter(latlng);
    }
  };
  const loadStreetview = async (latlng: LatLngI) => {
    if (!mapCompRef.current) {
      return;
    }
    const map = mapCompRef.current.getMapInstance();
    const [mcLng, mcLat] = map.lnglatToMercator(latlng.lng, latlng.lat);
    setStreetviewMcLatLng({ lat: mcLat, lng: mcLng });
  };

  const [menuItems, setMenuItems] = useState<MenuItemI[]>(
    [
      { text: '创建途经点', callback: addPoint },
      { text: '查看街景', callback: loadStreetview },
      { text: '清除地图', callback: clearMap },
      { text: '生成GPX', callback: genGpx },
    ].map(genMenuItem)
  );

  const onSearch = debounce((e: any) => {
    if (!mapCompRef.current) {
      return;
    }
    const map = mapCompRef.current.getMapInstance();
    const searchStr = e.target.value;
    // FIXME: 输入法编辑未完成也会触发,这里过滤一下
    if (searchStr.includes(`'`)) {
      return;
    }
    console.log(`searchStr: ${searchStr}`);
    if (!searchRef.current) {
      searchRef.current = new (window as any).BMapGL.LocalSearch(map, {
        renderOptions: { map: map },
      });
    }
    if (searchStr) {
      searchRef.current.search(searchStr);
    } else {
      searchRef.current.clearResults();
    }
  }, 500);

  return (
    <>
      <StyledMap
        ref={mapCompRef}
        center={center}
        zoom={15}
        style={{ width: '100%', height: '100%', zIndex: '1' }}
      >
        <Menu>
          {menuItems.map((item) => (
            <MenuItem key={item.mid} {...item.option} />
          ))}
        </Menu>
        {wayPoints.map(({ latlng, pid }, idx) => (
          // FIXME: Marker will re render every time
          <Marker
            key={pid}
            latlng={latlng}
            enableDragging={true}
            onChange={async (newLatLng) => {
              const newWayPoints = [...wayPoints];
              const targetWayPoint = {
                ...wayPoints[idx],
                latlng: newLatLng,
              };
              newWayPoints.splice(idx, 1, targetWayPoint);
              setWayPoints(newWayPoints);
              await addOrModifyRouteSegs(idx, idx + 1, true);
              await addOrModifyRouteSegs(idx - 1, idx, true);
            }}
            label={idx === 0 ? '起点' : `途经点${idx}`}
            popupComp={
              <StyledMarkerPopup>
                <StyledMarkerName>
                  {idx === 0 ? '起点' : `途经点${idx}`}
                </StyledMarkerName>
                <StyledMarkerButtons>
                  <Button
                    onClick={() => {
                      addPoint(latlng, idx);
                    }}
                  >
                    前+1
                  </Button>
                  <Button
                    onClick={() => {
                      addPoint(latlng, idx + 1);
                    }}
                  >
                    后+1
                  </Button>
                  <Button danger onClick={() => delPoint(idx)}>
                    删除
                  </Button>
                  {idx === 0 &&
                    (circleCenter ? (
                      <Button danger onClick={() => toggleCircle()}>
                        关闭测距圆
                      </Button>
                    ) : (
                      <Button onClick={() => toggleCircle(latlng)}>
                        打开测距圆
                      </Button>
                    ))}
                </StyledMarkerButtons>
              </StyledMarkerPopup>
            }
          />
        ))}
        {routePoints.length > 0 && <PolyLine latlngs={routePoints} />}
        {circleCenter && (
          <Circle center={circleCenter} radius={5000} enableEditing={true} />
        )}
      </StyledMap>
      <StyledSearchButton placeholder="搜索" allowClear onChange={onSearch} />
      <StyledOverview>总距离: {(routeDis / 1000).toFixed(2)}km</StyledOverview>
      <Streetview mcLatLng={streetviewMcLatLng} />
    </>
  );
}

// FIXME: StyledMap的样式没生效
const StyledMap = styled(MapInner)``;
const StyledMarkerPopup = styled.div`
  padding: 0 20px 20px 20px;
`;
const StyledMarkerName = styled.div`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;
const StyledMarkerButtons = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledOverview = styled.div`
  position: fixed;
  top: 5px;
  left: 300px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 2px;
  background: #2d3033;
  box-shadow: 0 1px 2.9px 0.1px rgba(0, 0, 0, 0.48);
  z-index: 9;
`;
const StyledSearchButton = styled(Input)`
  position: fixed;
  top: 5px;
  left: 10px;
  width: 200px;
  z-index: 9;
`;

export default Map;
