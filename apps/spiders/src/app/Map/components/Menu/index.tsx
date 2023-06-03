import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
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

  const [contextState, setContextState] = useState({ menu: null });

  const initMenu = useCallback(() => {
    const { map, BMapGL } = mapContext;
    if (map === null) {
      return;
    }
    let menu: any = contextState.menu;
    if (!menu) {
      menu = new BMapGL.ContextMenu();
      map.addContextMenu(menu);
      setContextState({ menu });
    }
  }, [mapContext, contextState]);

  const removeMenu = useCallback(() => {
    const { map } = mapContext;
    if (map === null) {
      return;
    }
    const menu: any = contextState.menu;
    if (menu !== null) {
      map.removeContextMenu(menu);
    }
  }, [mapContext, contextState]);

  useEffect(() => {
    console.log(`[useEffect]Menu`);
    initMenu();
    return removeMenu;
  }, [mapContext]);

  return (
    <MenuContext.Provider value={contextState}>{children}</MenuContext.Provider>
  );
};

export * from './MenuItem';
