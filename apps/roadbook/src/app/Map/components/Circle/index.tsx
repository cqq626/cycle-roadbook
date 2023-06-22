import { useContext, useEffect, useRef } from 'react';
import { MapContext, LatLngI } from '../Map';
import CircleHandPng from '../../../../assets/circle-hand.png';

interface CirclePropsI {
  center: LatLngI;
  radius: number;
  enableEditing?: boolean;
}

// FIXME: 添加fitBounds功能
export const Circle = ({
  center,
  radius,
  enableEditing = false,
}: CirclePropsI) => {
  console.log(`[Circle]trigger`);
  const { map, BMapGL } = useContext(MapContext);

  const compRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);

  useEffect(() => {
    console.log(`[Circle]useEffect`);
    if (map === null) {
      return;
    }
    let circle: any = compRef.current;
    const centerPoint = new BMapGL.Point(center.lng, center.lat);

    if (circle === null) {
      circle = new BMapGL.Circle(centerPoint, radius, {
        strokeColor: 'blue',
        strokeWeight: 2,
        strokeOpacity: 0.5,
      });

      compRef.current = circle;
      map.addOverlay(circle);
    } else {
      circle.setCenter(centerPoint);
      circle.setRadius(radius);
    }

    let marker: any = markerRef.current;
    const onMarkerDrag = (e: any) => {
      const fixedLatlng = new BMapGL.Point(e.latLng.lng, center.lat);
      marker.setPosition(fixedLatlng);
      const newRadius = map.getDistance(centerPoint, fixedLatlng);
      circle.setRadius(newRadius);
      marker.getLabel().setContent(`${(newRadius / 1000).toFixed(1)}km`);
    };
    if (enableEditing && marker === null) {
      const markerLatLng =
        circle.points[Math.floor((circle.points.length * 3) / 4)].latLng;
      marker = new BMapGL.Marker(markerLatLng, { enableDragging: true });
      marker.setIcon(new BMapGL.Icon(CircleHandPng, new BMapGL.Size(30, 18)));
      marker.setLabel(
        new BMapGL.Label(`${(radius / 1000).toFixed(1)}km`, {
          offset: new BMapGL.Size(18, -9),
        })
      );
      marker.addEventListener('dragging', onMarkerDrag);
      map.addOverlay(marker);
      markerRef.current = marker;
    }

    return () => {
      console.log(`[Circle]useEffect clear`);
      const circle = compRef.current;
      if (circle) {
        map.removeOverlay(circle);
        compRef.current = null;
      }
      const marker = markerRef.current;
      if (marker) {
        marker.removeEventListener('dragging', onMarkerDrag);
        map.removeOverlay(marker);
        markerRef.current = null;
      }
    };
  }, [map, BMapGL, center, radius, enableEditing]);

  return null;
};
