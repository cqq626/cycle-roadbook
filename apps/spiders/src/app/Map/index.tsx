import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

import { Map as MapInner } from './components/Map';
import { Menu, MenuItem, MenuItemPropsI } from './components/Menu';

export function Map() {
  const [menuItems, setMenuItems] = useState<MenuItemPropsI[]>([
    { text: '新建起点', callback: console.log },
    // { text: '清除地图', callback: console.log },
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
    </MapInner>
  );
}

export default Map;
