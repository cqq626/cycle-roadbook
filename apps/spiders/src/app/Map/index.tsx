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

interface WayPointI {
  latlng: LatLngI;
  pid: string;
}

export function Map() {
  console.log(`[trigger]MapWrapper`);
  const [center, setCenter] = useState<LatLngI>({ lat: 39.915, lng: 116.404 });
  const [wayPoints, setWayPoints] = useState<WayPointI[]>([]);
  const setStartPoint = (latlng: LatLngI) => {
    setWayPoints([genWayPoint(latlng)]);
  };
  const clearMap = () => {
    setWayPoints([]);
  };

  const [menuItems, setMenuItems] = useState<MenuItemOptionI[]>([
    { text: '新建起点', callback: setStartPoint },
    { text: '清除地图', callback: clearMap },
  ]);

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
          <MenuItem key={item.text} {...item} />
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
