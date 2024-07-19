import { http } from '#/utils/http';
import useSWR from 'swr';

export interface peminjam {
  id: string;
  NIP: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListPeminjam extends peminjam {
  data: peminjam[];
  count: number;
}

const url = {
  getPeminjam() {
    return `/peminjam`;
  },
  getPeminjamById(id: string) {
    return `/peminjam/${id}`;
  },
  
};

const hooks = {
  usePeminjam() {
    return useSWR(url.getPeminjam(), http.fetcher);
  },
  usePeminjamById(id: string) {
    return useSWR(url.getPeminjamById(id), http.fetcher);
  },
};

const api = {
  peminjam(data: any) {
    return http.post(url.getPeminjam()).send(data);
  },
};

export const peminjamRepository = {
  url,
  hooks,
  api,
};
