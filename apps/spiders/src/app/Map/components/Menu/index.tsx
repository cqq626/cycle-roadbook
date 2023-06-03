import { createContext, useContext, useState, useEffect } from 'react';
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
  const { map, BMapGL } = useContext(MapContext);

  const [contextState, setContextState] = useState({ menu: null });

  const initOrModify = () => {
    console.log(`[initOrModify]Menu`);
    if (map === null) {
      return;
    }
    let menu: any = contextState.menu;
    if (!menu) {
      menu = new BMapGL.ContextMenu();
      map.addContextMenu(menu);
      setContextState({ menu });
    }
  };

  const remove = () => {
    console.log(`[remove]Menu`);
    if (map === null) {
      return;
    }
    const menu: any = contextState.menu;
    if (menu !== null) {
      map.removeContextMenu(menu);
    }
  };

  useEffect(() => {
    initOrModify();
    return remove;
  }, [map]);

  return (
    <MenuContext.Provider value={contextState}>{children}</MenuContext.Provider>
  );
};

export * from './MenuItem';
