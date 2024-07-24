import { http } from '#/utils/http';
import useSWR from 'swr';

export interface barangRusak {
  id: string;
  kode: string;
  jumlah: number;
  Status: string;
  keterangan: string;
  tanggalRusak: Date;
  tanggalPerbaikan: Date;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListBarangRusak extends barangRusak {
  data: barangRusak[];
  count: number;
}

const url = {
  getBarangRusak() {
    return `/barangRusak`;
  },
  getBarangRusakById(id: string) {
    return `/barangRusak/${id}`;
  },
  updateBarangrusak(id: string) {
    return `/barangRusak/${id}`;
  }
};

const hooks = {
  useBarangRusak() {
    return useSWR(url.getBarangRusak(), http.fetcher);
  },
  useBarangRusakById(id: string) {
    return useSWR(url.getBarangRusakById(id), http.fetcher);
  },
};

const api = {
  
  barangRusak(data: any) {
    return http.post(url.getBarangRusak()).send(data);
  },
  
  updateBarangrusak(id: string,data: any) {
    return http.put(url.updateBarangrusak(id)).send(data);
  },
};

export const barangRusakRepository = {
  url,
  hooks,
  api,
};
