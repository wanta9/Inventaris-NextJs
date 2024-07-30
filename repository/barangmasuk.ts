import { http } from '#/utils/http';
import useSWR from 'swr';

export interface barangMasuk {
  id: string;
  kode: string;
  jumlah: number;
  harga: string;
  keterangan: string;
  tanggalMasuk: Date;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListBarangMasuk extends barangMasuk {
  data: barangMasuk[];
  count: number;
}

const url = {
  getBarangMasuk() {
    return `/barangMasuk`;
  },
  getBarangMasukById(id: string) {
    return `/barangMasuk/${id}`;
  },
  
  updatebarangMasuk(id: string) {
    return `/barangMasuk/${id}`;
  },
  
  getBarangMasukByName(nama: string) {
    return `/barangMasuk/search/by-name?nama=${nama}`;
  }
};

const hooks = {
  useBarangMasuk() {
    return useSWR(url.getBarangMasuk(), http.fetcher);
  },
  useBarangMasukById(id: string) {
    return useSWR(url.getBarangMasukById(id), http.fetcher);
  },
  useBarangMasukByName(nama: string) {
    return useSWR(url.getBarangMasukByName(nama), http.fetcher);
  }
};

const api = {
  barangMasuk(data: any) {
    return http.post(url.getBarangMasuk()).send(data);
  },
  updatebarangMasuk(id: string, data: any) {
    return http.put(url.updatebarangMasuk(id)).send(data);
  },
    getBarangMasukByName(nama: string) {
    return `/akun/search/by-name?nama=${nama}`;
  }
};

export const barangMasukRepository = {
  url,
  hooks,
  api,
};
