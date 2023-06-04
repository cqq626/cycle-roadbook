import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';

import { LatLngI, Map as MapInner } from './components/Map';
import { Menu, MenuItem, MenuItemOptionI } from './components/Menu';
import { Marker } from './components/Marker';

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

interface MenuItemI {
  mid: string;
  option: MenuItemOptionI;
}

export function Map() {
  console.log(`[trigger]MapWrapper`);
  const [center, setCenter] = useState<LatLngI>({ lat: 39.915, lng: 116.404 });
  const [wayPoints, setWayPoints] = useState<WayPointI[]>([]);
  // FIXME:让callback回调里能拿到最新的wayPoints,而不是频繁的setMenuItems
  const wayPointsRef = useRef<WayPointI[]>([]);

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
  const addMidPoint = (latlng: LatLngI) => {
    const midPoint = genWayPoint(latlng);
    const newWayPoints = [...wayPointsRef.current, midPoint];
    setWayPoints(newWayPoints);
    wayPointsRef.current = newWayPoints;
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
    </MapInner>
  );
}

export default Map;
