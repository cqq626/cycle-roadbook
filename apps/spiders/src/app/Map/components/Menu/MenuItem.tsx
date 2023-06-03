import { useContext, useRef, useEffect } from 'react';
import { MapContext, LatLngI } from '../Map';
import { MenuContext } from './index';

export interface MenuItemPropsI {
  text: string;
  callback: (latlng: LatLngI) => void;
}

export const MenuItem = ({ text, callback }: MenuItemPropsI) => {
  console.log(`[trigger]MenuItem`);
  const menuItemRef = useRef(null);
  const { BMapGL } = useContext(MapContext);
  const { menu } = useContext(MenuContext);

  useEffect(() => {
    if (menu === null) {
      return;
    }
    if (menuItemRef.current !== null) {
      console.log(`[reset]MenuItem`);
      menu.removeItem(menuItemRef.current);
    }
    menuItemRef.current = new BMapGL.MenuItem(text, callback);
    menu.addItem(menuItemRef.current);
    return () => {
      console.log(`[release]MenuItem`);
      if (menu === null) {
        return;
      }
      if (menuItemRef.current !== null) {
        menu.removeItem(menuItemRef.current);
      }
    };
  }, [menu, text, callback]);

  return null;
};
