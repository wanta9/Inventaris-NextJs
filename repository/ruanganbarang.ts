import { http } from '#/utils/http';
import useSWR from 'swr';

export interface ruanganBarang {
  id: string;
  jumlah: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListRuanganBarang extends ruanganBarang {
  data: ruanganBarang[];
  count: number;
}

const url = {
  getRuaganBarang() {
    return `/ruanganBarang`;
  },
  getRuanganBarangById(id: string) {
    return `/ruanganBarang/${id}`;
  },
};

const hooks = {
  useRuanganBarang() {
    return useSWR(url.getRuaganBarang(), http.fetcher);
  },
  useRuanganBarangById(id: string) {
    return useSWR(url.getRuanganBarangById(id), http.fetcher);
  },
};

const api = {
  ruangan(data: any) {
    return http.post(url.getRuaganBarang()).send(data);
  },
};

export const ruanganBarangRepository = {
  url,
  hooks,
  api,
};
