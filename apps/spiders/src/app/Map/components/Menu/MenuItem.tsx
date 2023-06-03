import { useContext, useRef, useEffect } from 'react';
import { MapContext, LatLngI } from '../Map';
import { MenuContext } from './index';

export interface MenuItemPropsI {
  text: string;
  callback: (latlng: LatLngI) => void;
}

export const MenuItem = ({ text, callback }: MenuItemPropsI) => {
  console.log(`[trigger]MenuItem`);
  const compRef = useRef(null);
  const { BMapGL } = useContext(MapContext);
  const { menu } = useContext(MenuContext);

  const initOrModify = () => {
    console.log(`[initOrModify]MenuItem`);
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
  };

  const remove = () => {
    console.log(`[remove]MenuItem`);
    if (menu === null) {
      return;
    }
    if (compRef.current !== null) {
      menu.removeItem(compRef.current);
    }
  };

  useEffect(() => {
    initOrModify();
    return remove;
  }, [menu, text, callback]);

  return null;
};
