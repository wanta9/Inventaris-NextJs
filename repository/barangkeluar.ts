import { http } from '#/utils/http';
import useSWR from 'swr';

export interface barangKeluar {
  id: string;
  kode: string;
  jumlah: number;
  keterangan: string;
  tanggalKeluar: Date;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ListBarangKeluar extends barangKeluar {
  data: barangKeluar[];
  count: number;
}

const url = {
  getBarangKeluar() {
    return `/barangKeluar`;
  },
  getBarangKeluarById(id: string) {
    return `/barangKeluar/${id}`;
  },

  updatebarangKeluar(id: string) {
    return `/barangKeluar/${id}`;
  },
  getBarangKeluarByName(nama: string) {
    return `/barangKeluar/search/by-name?nama=${nama}`;
  }
};

const hooks = {
  useBarangKeluar() {
    return useSWR(url.getBarangKeluar(), http.fetcher);
  },
  useBarangKeluarById(id: string) {
    return useSWR(url.getBarangKeluarById(id), http.fetcher);
  },
  useBarangdKeluarByName(nama: string) {
    return useSWR(url.getBarangKeluarByName(nama), http.fetcher);
  }
};

const api = {
  barangKeluar(data: any) {
    return http.post(url.getBarangKeluar()).send(data);
  },
  updatebarangKeluar(id: string, data: any) {
    return http.put(url.updatebarangKeluar(id)).send(data);
  },
};

export const barangKeluarRepository = {
  url,
  hooks,
  api,
};
