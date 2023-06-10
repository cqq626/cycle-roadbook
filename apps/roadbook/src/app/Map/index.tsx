import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';

import { LatLngI, Map as MapInner, MapHandleI } from './components/Map';
import { Menu, MenuItem, MenuItemOptionI } from './components/Menu';
import { Marker } from './components/Marker';
import { PolyLine } from './components/PolyLine';

function genWayPoint(latlng: LatLngI): WayPointI {
  return {
    latlng,
    pid: Math.random().toString(32).slice(2),
  };
}

function genMenuItem(option: MenuItemOptionI): MenuItemI {
  return {
    option,
    mid: Math.random().toString(32).slice(2),
  };
}

interface WayPointI {
  latlng: LatLngI;
  pid: string;
}

interface RouteSegI {
  latlngs: LatLngI[];
  dis: number;
}

interface MenuItemI {
  mid: string;
  option: MenuItemOptionI;
}

function genRouteInfo(routeSegs: RouteSegI[]) {
  let routePoints: LatLngI[] = [];
  let routeDis = 0;
  for (const { dis, latlngs } of routeSegs) {
    routeDis += dis;
    routePoints = routePoints.concat(latlngs);
  }
  return { routeDis, routePoints };
}

function genNewLatlng({ lat, lng }: LatLngI) {
  return {
    lat: lat + 0.0005,
    lng: lng + 0.0005,
  };
}

export function Map() {
  console.log(`[trigger]MapWrapper`);
  const [center, setCenter] = useState<LatLngI>({ lat: 39.915, lng: 116.404 });
  const [wayPoints, setWayPointsForState] = useState<WayPointI[]>([]);
  const [routePoints, setRoutePoints] = useState<LatLngI[]>([]);
  const [routeDis, setRouteDis] = useState(0);

  // FIXME:让callback回调里能拿到最新的wayPoints,而不是频繁的setMenuItems
  const wayPointsRef = useRef<WayPointI[]>([]);
  const routeSegsRef = useRef<RouteSegI[]>([]);
  const mapCompRef = useRef<MapHandleI>(null);

  const setWayPoints = (newWayPoints: WayPointI[]) => {
    setWayPointsForState(newWayPoints);
    wayPointsRef.current = newWayPoints;
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
      return addOrModifyRouteSegs(delWayPointIdx - 1, 1);
    }
    const { routeDis, routePoints } = genRouteInfo(routeSegsRef.current);
    setRoutePoints(routePoints);
    setRouteDis(routeDis);
  };

  // endWayPointIdx - 1 对应该 routeSeg 的 idx
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

  const setStartPoint = (latlng: LatLngI) => {
    const newWayPoints = [genWayPoint(latlng)];
    setWayPoints(newWayPoints);

    setMenuItems(
      [
        { text: '创建途经点', callback: addMidPoint },
        { text: '清除地图', callback: clearMap },
      ].map(genMenuItem)
    );
  };
  const addMidPoint = async (latlng: LatLngI, targetIdx?: number) => {
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
    if (targetIdx + 1 === newWayPoints.length) {
      // 插在尾部
      if (targetIdx > 0) {
        addOrModifyRouteSegs(targetIdx - 1, targetIdx);
      }
    } else if (targetIdx === 0) {
      // 插在头部
      if (newWayPoints.length > 1) {
        addOrModifyRouteSegs(targetIdx, targetIdx + 1);
      }
    } else {
      // 插在中间
      addOrModifyRouteSegs(targetIdx - 1, targetIdx);
      addOrModifyRouteSegs(targetIdx, targetIdx + 1);
    }
  };
  const delMidPoint = async (idx: number) => {
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
    setMenuItems(
      [
        { text: '新建起点', callback: setStartPoint },
        { text: '清除地图', callback: clearMap },
      ].map(genMenuItem)
    );
  };

  const [menuItems, setMenuItems] = useState<MenuItemI[]>(
    [
      { text: '新建起点', callback: setStartPoint },
      { text: '清除地图', callback: clearMap },
    ].map(genMenuItem)
  );

  return (
    <>
      <MapInner
        ref={mapCompRef}
        center={center}
        zoom={15}
        style={{
          width: '600px',
          height: '600px',
        }}
      >
        <Menu>
          {menuItems.map((item) => (
            <MenuItem key={item.mid} {...item.option} />
          ))}
        </Menu>
        {wayPoints.map(({ latlng, pid }, idx) => (
          <Marker
            key={pid}
            latlng={latlng}
            enableDragging={true}
            onChange={async (newLatLng) => {
              const newWayPoints = [...wayPoints];
              const targetWayPoint = { ...wayPoints[idx], latlng: newLatLng };
              newWayPoints.splice(idx, 1, targetWayPoint);
              setWayPoints(newWayPoints);
              await addOrModifyRouteSegs(idx, idx + 1, true);
              await addOrModifyRouteSegs(idx - 1, idx, true);
            }}
            popupComp={
              <StyledMarkerPopup>
                <StyledMarkerName
                  onClick={() => {
                    console.log('fuck');
                  }}
                >
                  {idx === 0 ? '起点' : `途经点${idx + 1}`}
                </StyledMarkerName>
                <StyledMarkerButtons>
                  <Button
                    onClick={() => {
                      addMidPoint(latlng, idx);
                    }}
                  >
                    前+1
                  </Button>
                  <Button
                    onClick={() => {
                      addMidPoint(latlng, idx + 1);
                    }}
                  >
                    后+1
                  </Button>
                  <Button danger onClick={() => delMidPoint(idx)}>
                    删除
                  </Button>
                </StyledMarkerButtons>
              </StyledMarkerPopup>
            }
          />
        ))}
        {routePoints.length > 0 && <PolyLine latlngs={routePoints} />}
      </MapInner>
      <div>总距离: {(routeDis / 1000).toFixed(2)}km</div>
    </>
  );
}

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

export default Map;
