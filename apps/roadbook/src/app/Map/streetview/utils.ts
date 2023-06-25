import { request } from './request';
import { LatLngI } from '../components/Map';

function getUrl() {
  return `https://mapsv${Math.round(Math.random())}.bdimg.com`;
}

interface SidResultI {
  RoadId: string;
  RoadName: string;
  id: string;
  x: number;
  y: number;
}
export type MCLatLngI = LatLngI;
export async function getSid(
  mcLatlng: MCLatLngI
): Promise<SidResultI | undefined> {
  const { lat, lng } = mcLatlng;

  const sidResult: any = await request({
    url: getUrl(),
    params: {
      qt: 'qsdata',
      x: lng,
      y: lat,
    },
  });

  return sidResult.data.content;
}

function genPicUrl(sid: string, pos1: number, pos2: number) {
  return `${getUrl()}?qt=pdata&sid=${sid}&pos=${pos1}_${pos2}&z=4`;
}
export async function getPics(sid: string): Promise<string[][]> {
  const res: any[] = [];
  for (let i = 1; i <= 2; i++) {
    res[i] = [];
    for (let j = 0; j <= 7; j++) {
      res[i][j] = genPicUrl(sid, i, j);
    }
  }
  return res;
}
