import { http } from '#/utils/http';
import useSWR from 'swr';

export interface peminjaman {
  id: string;
  kode: string;
  tanggalPinjam: Date;
  tanggalPengembalian: Date;
  tanggalDikembalikan: Date;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListPeminjaman extends peminjaman {
  data: peminjaman[];
  count: number;
}

const url = {
  getPeminjaman() {
    return `/peminjaman`;
  },
};

const hooks = {
  usePeminjaman() {
    return useSWR(url.getPeminjaman(), http.fetcher);
  },
};

const api = {
  peminjaman(data: any) {
    return http.post(url.getPeminjaman()).send(data);
  },
};

export const peminjamanRepository = {
  url,
  hooks,
  api,
};