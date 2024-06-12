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
};

const hooks = {
  useBarangKeluar() {
    return useSWR(url.getBarangKeluar(), http.fetcher);
  },
};

const api = {
  barangKeluar(data: any) {
    return http.post(url.getBarangKeluar()).send(data);
  },
};

export const barangKeluarRepository = {
  url,
  hooks,
  api,
};
