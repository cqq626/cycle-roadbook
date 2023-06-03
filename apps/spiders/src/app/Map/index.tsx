import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

import { LatLngI, Map as MapInner } from './components/Map';
import { Menu, MenuItem, MenuItemPropsI } from './components/Menu';
import { Marker, MarkerPropsI } from './components/Marker';

export function Map() {
  console.log(`[trigger]MapWrapper`);
  const [wayPoints, setWayPoints] = useState<LatLngI[]>([]);
  const setStartPoint = (latlng: LatLngI) => {
    setWayPoints([latlng]);
  };
  const clearMap = () => {
    setWayPoints([]);
  };

  const [menuItems, setMenuItems] = useState<MenuItemPropsI[]>([
    { text: '新建起点', callback: setStartPoint },
    { text: '清除地图', callback: clearMap },
  ]);

  return (
    <MapInner
      center={{ lat: 39.915, lng: 116.404 }}
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
      {wayPoints.map((wayPoint) => (
        <Marker latlng={wayPoint} enableDragging={true} />
      ))}
    </MapInner>
  );
}

export default Map;
