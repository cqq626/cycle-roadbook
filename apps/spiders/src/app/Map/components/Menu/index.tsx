import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MapContext } from '../Map';

export interface MenuPropsI {
  children?: any;
}
export interface MapContextPropsI {
  menu: any | null;
}
export const MenuContext = createContext<MapContextPropsI>({
  menu: null,
});

export const Menu = (props: MenuPropsI) => {
  console.log(`[trigger]Menu`);
  const { children } = props;
  const mapContext = useContext(MapContext);

  const menuRef = useRef<any>(null);
  const [contextState, setContextState] = useState({ menu: null });

  useEffect(() => {
    const { map, BMapGL } = mapContext;

    if (map === null) {
      return;
    }
    if (menuRef.current !== null) {
      return;
    }

    const menu = new BMapGL.ContextMenu();
    map.addContextMenu(menu);
    setContextState({ menu });
    menuRef.current = menu;

    return () => {
      console.log(`[release]Menu`);
      if (map === null) {
        return;
      }
      if (menuRef.current !== null) {
        map.removeContextMenu(menuRef.current);
      }
    };
  }, [mapContext]);

  return (
    <MenuContext.Provider value={contextState}>{children}</MenuContext.Provider>
  );
};

export * from './MenuItem';
