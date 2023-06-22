import { RouteSegI, WayPointI, MenuItemI } from './index';
import { LatLngI } from './components/Map';
import { MenuItemOptionI } from './components/Menu';
import { coordConvert } from './coordConvert';

export function genRouteInfo(routeSegs: RouteSegI[]) {
  let routePoints: LatLngI[] = [];
  let routeDis = 0;
  for (const { dis, latlngs } of routeSegs) {
    routeDis += dis;
    routePoints = routePoints.concat(latlngs);
  }
  return { routeDis, routePoints };
}

export function genNewLatlng({ lat, lng }: LatLngI) {
  return {
    lat: lat + 0.001,
    lng: lng + 0.001,
  };
}

export function genWayPoint(latlng: LatLngI): WayPointI {
  return {
    latlng,
    pid: Math.random().toString(32).slice(2),
  };
}

export function genMenuItem(option: MenuItemOptionI): MenuItemI {
  return {
    option,
    mid: Math.random().toString(32).slice(2),
  };
}

export function genGpxContent(latlngs: LatLngI[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const newLatlngs = latlngs.map((latlng) =>
      coordConvert.baidu09ToWGS84(latlng)
    );
    const latlngInfos = newLatlngs.map((point: any) => {
      return `
      <trkpt lat="${point.lat}" lon="${point.lng}">
        <Speed></Speed>
      </trkpt>`;
    });
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/0" version="1.0" creator="https://github.com/cqq626/cycle-roadbook">
  <name>cycle-roadbook</name>
  <author>cqq626</author>
  <url>https://www.imxingzhe.com</url>
  <trk>
    <trkseg>${latlngInfos.join('')}</trkseg>
  </trk>
</gpx>`;
    resolve(content);
  });
}

export function injectFn(instance: any, funcName: string, newFunc: any): any {
  return setTimeout(() => {
    if (!instance[funcName]) {
      return injectFn(instance, funcName, newFunc);
    }
    const oldFn = instance[funcName].bind(instance);
    instance[funcName] = (...args: any) => {
      const oriRes = oldFn(...args);
      return newFunc(oriRes);
    };
  }, 100);
}

export function watchToRun(instance: any, watchFunc: any, func: any): any {
  return setTimeout(() => {
    if (!watchFunc(instance)) {
      return watchToRun(instance, watchFunc, func);
    }
    func();
  }, 100);
}
