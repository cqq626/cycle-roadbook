import { useContext, useEffect, useRef } from 'react';
import { MapContext, LatLngI } from '../Map';
import { injectFn, watchToRun } from '../../utils';
import CircleHandPng from '../../../../assets/circle-hand.png';

interface CirclePropsI {
  center: LatLngI;
  radius: number;
  enableEditing?: boolean;
}

export const Circle = ({
  center,
  radius,
  enableEditing = false,
}: CirclePropsI) => {
  console.log(`[Circle]trigger`);
  const { map, BMapGL } = useContext(MapContext);

  const compRef = useRef<any | null>(null);

  useEffect(() => {
    console.log(`[Circle]useEffect`);
    if (map === null) {
      return;
    }
    let circle: any = compRef.current;
    const point = new BMapGL.Point(center.lng, center.lat);
    let centerMCPoint: any = null;
    const convertor = new BMapGL.Convertor();

    let injectFnTimeout: any = null,
      watchToRunTimeout: any = null;

    // FIXME: 鼠标离开marker还能拖
    const onMarkerDrag = (e: any) => {
      const fixedMCPointLat = centerMCPoint.lat;
      const fixedMCPointLng = e.point.lng;
      // FIXME: 这里不知道为啥只能用百度墨卡托
      circle.vertexMarkers[1].setPoint(
        new BMapGL.Point(fixedMCPointLng, fixedMCPointLat)
      );
      const label = circle.vertexMarkers[1].getLabel();
      label.setContent(`${(circle.getRadius() / 1000).toFixed(1)}km`);
      // circle.setRadius(map.getDistance(center, e.latLng), true);
    };

    if (circle === null) {
      circle = new BMapGL.Circle(point, radius, {
        enableEditing,
        strokeColor: 'blue',
        strokeWeight: 2,
        strokeOpacity: 0.5,
      });
      (window as any).cqC = circle;
      const modifyVertexMarkers = () => {
        circle.vertexMarkers[0].hide();
        circle.vertexMarkers[1].addEventListener('dragging', onMarkerDrag);
        const radius = circle.getRadius();
        // 可能还不在地图上
        if (circle.vertexMarkers[1].getPoint()) {
          circle.vertexMarkers[1].setIcon(
            new BMapGL.Icon(CircleHandPng, new BMapGL.Size(30, 18))
          );
          circle.vertexMarkers[1].setLabel(
            new BMapGL.Label(`${(radius / 1000).toFixed(1)}km`, {
              offset: new BMapGL.Size(18, -9),
            })
          );
        }
      };
      // FIXME: 删除的时候是否需要删除dragging事件监听
      injectFnTimeout = injectFn(circle, 'addVertexs', (oldRes: any) => {
        modifyVertexMarkers();
        return oldRes;
      });
      watchToRunTimeout = watchToRun(
        circle,
        () => {
          return circle.vertexMarkers && circle.vertexMarkers[0];
        },
        () => {
          modifyVertexMarkers();
        }
      );
      // https://lbsyun.baidu.com/jsdemo.htm#TranslateggTobd
      convertor.translate(
        [center],
        (window as any).COORDINATES_BD09,
        (window as any).COORDINATES_BD09_MC,
        (data: any) => {
          if (data.status !== 0) {
            console.error(`translate error:`, data);
            return;
          }
          centerMCPoint = data.points[0];
          // FIXME: 保存代码页面重新执行时疑似是这里报错了,暂时不知道原因
          map.addOverlay(circle);
        }
      );
      compRef.current = circle;
    } else {
      circle.setCenter(point);
      circle.setRadius(radius);
      if (enableEditing) {
        circle.enableEditing();
      } else {
        circle.disableEditing();
      }
    }

    return () => {
      console.log(`[Circle]useEffect clear`);
      clearTimeout(injectFnTimeout);
      clearTimeout(watchToRunTimeout);
      const circle = compRef.current;
      if (circle) {
        if (circle.vertexMarkers && circle.vertexMarkers[1]) {
          circle.vertexMarkers[1].removeEventListener('dragging', onMarkerDrag);
        }
        map.removeOverlay(circle);
        compRef.current = null;
      }
    };
  }, [map, BMapGL, center, radius, enableEditing]);

  return null;
};
