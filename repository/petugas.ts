import { http } from '#/utils/http';
import useSWR from 'swr';

export interface petugas {
  id: string;
  NIP: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListPetugas extends petugas {
  data: petugas[];
  count: number;
}

const url = {
  getPetugas() {
    return `/petugas`;
  },
  getPetugasById(id: string) {
    return `/petugas/${id}`;
  },
};

const hooks = {
  usePetugas() {
    return useSWR(url.getPetugas(), http.fetcher);
  },
  usePetugasById(id: string) {
    return useSWR(url.getPetugasById(id), http.fetcher);
  },
};

const api = {
  petugas(data: any) {
    return http.post(url.getPetugas()).send(data);
  },
};

export const petugasRepository = {
  url,
  hooks,
  api,
};
