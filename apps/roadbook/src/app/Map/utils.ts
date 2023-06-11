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

// export function genGpxContent(latlngs: LatLngI[]): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const BMapGL = (window as any).BMapGL;
//     const convertor = new BMapGL.Convertor();
//     const oriPoints = latlngs.map(
//       (latlng) => new BMapGL.Point(latlng.lng, latlng.lat)
//     );
//     // const oriPoints = [
//     //   new BMapGL.Point(116.3786889372559, 39.90762965106183),
//     //   new BMapGL.Point(116.38632786853032, 39.90795884517671),
//     //   new BMapGL.Point(116.39534009082035, 39.907432133833574),
//     //   new BMapGL.Point(116.40624058825688, 39.90789300648029),
//     //   new BMapGL.Point(116.41413701159672, 39.90795884517671),
//     // ];
//     // https://lbsyun.baidu.com/jsdemo.htm#TranslateggTobd
//     convertor.translate(
//       oriPoints.slice(0, 10),
//       (window as any).COORDINATES_BD09,
//       (window as any).COORDINATES_WGS84,
//       (data: any) => {
//         if (data.status !== 0) {
//           console.error(`translate error:`, data);
//           reject(new Error('解析失败!'));
//         }
//         const latlngInfos = data.points.map((point: any) => {
//           return `
//       <trkpt lat="${point.lat}" lon="${point.lng}">
//         <Speed></Speed>
//       </trkpt>`;
//         });
//         const content = `<?xml version="1.0" encoding="UTF-8"?>
// <gpx xmlns="http://www.topografix.com/GPX/1/0" version="1.0" creator="https://github.com/cqq626/cycle-roadbook">
//   <name>cycle-roadbook</name>
//   <author>cqq626</author>
//   <url>https://www.imxingzhe.com</url>
//   <trk>
//     <trkseg>${latlngInfos.join('')}</trkseg>
//   </trk>
// </gpx>`;
//         resolve(content);
//       }
//     );
//   });
// }

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
