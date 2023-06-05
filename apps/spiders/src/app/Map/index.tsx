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
  const [wayPoints, setWayPoints] = useState<WayPointI[]>([]);
  const [routePoints, setRoutePoints] = useState<LatLngI[]>([]);

  // FIXME:让callback回调里能拿到最新的wayPoints,而不是频繁的setMenuItems
  const wayPointsRef = useRef<WayPointI[]>([]);
  const routeSegsRef = useRef<RouteSegI[]>([]);
  const mapCompRef = useRef<MapHandleI>(null);

  const setStartPoint = (latlng: LatLngI) => {
    const newWayPoints = [genWayPoint(latlng)];
    setWayPoints(newWayPoints);
    wayPointsRef.current = newWayPoints;

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
    const lastPoint = curWayPoints[curWayPoints.length - 1];
    const newWayPoints = [...curWayPoints, midPoint];
    setWayPoints(newWayPoints);
    wayPointsRef.current = newWayPoints;

    const mapComp = mapCompRef.current;
    if (mapComp) {
      const routeSeg = await mapComp.getRoute(
        lastPoint.latlng,
        midPoint.latlng
      );
      const newRouteSegs = [...routeSegsRef.current, routeSeg];
      routeSegsRef.current = newRouteSegs;

      const routeInfo = genRouteInfo(newRouteSegs);
      setRoutePoints(routeInfo.routePoints);
    }
  };
  const clearMap = () => {
    setWayPoints([]);
    wayPointsRef.current = [];
  };

  const [menuItems, setMenuItems] = useState<MenuItemI[]>(
    [
      { text: '新建起点', callback: setStartPoint },
      { text: '清除地图', callback: clearMap },
    ].map(genMenuItem)
  );

  return (
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
      {wayPoints.map(({ latlng, pid }) => (
        <Marker
          key={pid}
          latlng={latlng}
          enableDragging={true}
          popupComp={
            <div>
              fuck it <Button>lalal</Button>
            </div>
          }
        />
      ))}
      {routePoints.length > 0 && <PolyLine latlngs={routePoints} />}
    </MapInner>
  );
}

export default Map;
