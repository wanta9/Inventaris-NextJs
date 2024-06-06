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
};

const hooks = {
  useBarangMasuk() {
    return useSWR(url.getBarangMasuk(), http.fetcher);
  },
};

const api = {
  barangMasuk(data: any) {
    return http.post(url.getBarangMasuk()).send(data);
  },
};

export const barangMasukRepository = {
  url,
  hooks,
  api,
};
