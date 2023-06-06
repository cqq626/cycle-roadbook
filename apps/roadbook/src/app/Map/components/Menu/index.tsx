import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MapContext } from '../Map';

interface MenuPropsI {
  children?: any;
}
interface ContextI {
  menu: any | null;
}
export const MenuContext = createContext<ContextI>({
  menu: null,
});

export const Menu = (props: MenuPropsI) => {
  console.log(`[trigger]Menu`);
  const { children } = props;
  const { map, BMapGL } = useContext(MapContext);

  const compRef = useRef<any | null>(null);
  const [contextState, setContextState] = useState<ContextI>({ menu: null });

  useEffect(() => {
    console.log(`[Menu]useEffect`);
    if (map === null) {
      return;
    }
    let menu: any = compRef.current;
    if (!menu) {
      menu = new BMapGL.ContextMenu();
      map.addContextMenu(menu);
      compRef.current = menu;
      setContextState({ menu });
    }

    return () => {
      console.log(`[Menu]useEffect clear`);
      if (compRef.current) {
        map.removeContextMenu(compRef.current);
        compRef.current = null;
      }
    };
  }, [map, BMapGL]);

  return (
    <MenuContext.Provider value={contextState}>{children}</MenuContext.Provider>
  );
};

export * from './MenuItem';
