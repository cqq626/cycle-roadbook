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

  // endWayPointIdx - 1 对应该 routeSeg 的 idx
  const addOrModifyRouteSegs = async (
    startWayPointIdx: number,
    endWayPointIdx: number
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
    routeSegsRef.current.splice(routeSegIdx, 1, newRouteSeg);

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
  const addMidPoint = async (latlng: LatLngI) => {
    const midPoint = genWayPoint(latlng);
    const curWayPoints = wayPointsRef.current;
    const newWayPoints = [...curWayPoints, midPoint];
    setWayPoints(newWayPoints);
    addOrModifyRouteSegs(curWayPoints.length - 1, curWayPoints.length);
  };
  const clearMap = () => {
    setWayPoints([]);
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
              await addOrModifyRouteSegs(idx, idx + 1);
              await addOrModifyRouteSegs(idx - 1, idx);
            }}
            popupComp={
              <div>
                <div>{idx === 0 ? '起点' : `途经点${idx + 1}`}</div>
                <div>
                  <Button>删除</Button>
                </div>
              </div>
            }
          />
        ))}
        {routePoints.length > 0 && <PolyLine latlngs={routePoints} />}
      </MapInner>
      <div>总距离: {(routeDis / 1000).toFixed(2)}km</div>
    </>
  );
}

export default Map;
