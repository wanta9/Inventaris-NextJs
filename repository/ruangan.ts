import { http } from '#/utils/http';
import useSWR from 'swr';

export interface Ruangan {
  id: string;
  Letak_Barang: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListRuangan extends Ruangan {
  data: Ruangan[];
  count: number;
}

const url = {
  getRuagan() {
    return `/ruangan`;
  },
  getRuaganById(id: string) {
    return `/ruangan/${id}`;
  },
};

const hooks = {
  useRuangan() {
    return useSWR<ListRuangan>(url.getRuagan(), http.fetcher);
  },
  useRuanganById(id: string) {
    return useSWR(url.getRuaganById(id), http.fetcher);
  },
};

const api = {
  ruangan(data: any) {
    return http.post(url.getRuagan()).send(data);
  },
};

export const ruanganRepository = {
  url,
  hooks,
  api,
};
