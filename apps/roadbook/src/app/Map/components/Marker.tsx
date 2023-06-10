import { useContext, useEffect, useRef, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

import { MapContext, LatLngI } from './Map';

interface MarkerPropsI {
  latlng: LatLngI;
  enableDragging: boolean;
  popupComp?: ReactNode;
  onChange?: (latlng: LatLngI) => void;
  label?: string;
}

export const Marker = ({
  latlng,
  enableDragging = false,
  popupComp,
  onChange,
  label,
}: MarkerPropsI) => {
  console.log(`[Marker]trigger`);
  const { map, BMapGL } = useContext(MapContext);
  const [openPopup, setOpenPopup] = useState(false);

  const compRef = useRef<any | null>(null);
  const popupDomRef = useRef<any | null>(null);

  useEffect(() => {
    console.log(`[Marker]useEffect`);
    if (map === null) {
      return;
    }
    const point = new BMapGL.Point(latlng.lng, latlng.lat);
    let marker: any = compRef.current;
    let popup: any = null;
    const markerCb = () => {
      map.openInfoWindow(popup, point);
    };
    const dragCb = (e: any) => {
      onChange && onChange(e.latLng);
    };
    const openPopupCb = (e: any) => {
      setOpenPopup(true);
    };
    const closePopupCb = (e: any) => {
      setOpenPopup(false);
    };
    if (marker === null) {
      marker = new BMapGL.Marker(point, { enableDragging });
      map.addOverlay(marker);
      compRef.current = marker;
      marker.addEventListener('click', markerCb);
      marker.addEventListener('dragend', dragCb);
      if (popupDomRef.current === null) {
        const popupDom = document.createElement('div');
        popupDom.className = 'popup';
        popupDomRef.current = popupDom;
        popup = new BMapGL.InfoWindow(popupDomRef.current, {
          offset: new BMapGL.Size(0, -25),
          width: 220,
          height: 100,
        });
        popup.addEventListener('open', openPopupCb);
        popup.addEventListener('close', closePopupCb);
      }
      marker.setLabel(new BMapGL.Label(label));
    } else {
      marker.setPosition(point);
      if (enableDragging) {
        marker.enableDragging();
      } else {
        marker.disableDragging();
      }
      const labelComp = marker.getLabel();
      if (labelComp) {
        labelComp.setContent(label);
      }
    }

    return () => {
      console.log(`[Marker]useEffect clear`);
      if (compRef.current) {
        map.removeOverlay(compRef.current);
        compRef.current.removeEventListener('click', markerCb);
        compRef.current.removeEventListener('dragend', dragCb);
        compRef.current = null;
      }
      if (popupDomRef.current) {
        map.closeInfoWindow();
        popup.removeEventListener('open', openPopupCb);
        popup.removeEventListener('close', closePopupCb);
        popupDomRef.current = null;
      }
    };
  }, [map, BMapGL, latlng, enableDragging, popupComp, onChange, label]);

  return (
    openPopup &&
    popupDomRef.current &&
    createPortal(popupComp, popupDomRef.current)
  );
};
