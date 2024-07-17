import { http } from '#/utils/http';
import useSWR from 'swr';

export interface Riwayat {
    id: string;
    kode: string;
    nama: string;
    gambar: string;
    kondisi: string;
    deskripsi: string;
    jumlah: number;
    harga: string;    
    created_at: string;
    updated_at: string;
    deleted_at: string;
  }

export interface listRiwayat extends Riwayat {
    data: Riwayat[];
    count: number;
} 

const url = {
  getRiwayat() {
    return `/riwayat`;
  },
};

const hooks = {
  useBarang() {
    return useSWR(url.getRiwayat(), http.fetcher);
  },
};

const api = {
  riwayat(data: any) {
    return http.post(url.getRiwayat()).send(data);
  },
};

export const riwayatRepository = {
  url,
  hooks,
  api,
};
