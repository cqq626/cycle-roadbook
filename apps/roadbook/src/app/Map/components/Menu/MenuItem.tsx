import { useContext, useRef, useEffect } from 'react';
import { MapContext, LatLngI } from '../Map';
import { MenuContext } from './index';

export interface MenuItemOptionI {
  text: string;
  callback: (latlng: LatLngI) => void;
}
type MenuItemPropsI = MenuItemOptionI;

export const MenuItem = ({ text, callback }: MenuItemPropsI) => {
  console.log(`[trigger]MenuItem`);
  const compRef = useRef(null);
  const { BMapGL } = useContext(MapContext);
  const { menu } = useContext(MenuContext);

  useEffect(() => {
    console.log(`[MenuItem]useEffect`);
    if (menu === null) {
      return;
    }

    let comp = compRef.current;
    if (comp !== null) {
      menu.removeItem(comp);
    }
    comp = new BMapGL.MenuItem(text, callback);
    menu.addItem(comp);
    compRef.current = comp;

    return () => {
      console.log(`[MenuItem]useEffect clear`);
      if (compRef.current) {
        menu.removeItem(compRef.current);
        compRef.current = null;
      }
    };
  }, [BMapGL, menu, text, callback]);

  return null;
};
