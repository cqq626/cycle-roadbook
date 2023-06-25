import axios from 'axios';

export interface RequestI {
  url: string;
  params?: Record<string, any>;
}

export function request<T>(req: RequestI): Promise<T> {
  const { url, params } = req;

  return axios({
    url,
    params,
  });
}
