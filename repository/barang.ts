import { http } from '#/utils/http';
import useSWR from 'swr';

export interface Barang {
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

export interface ListBarang extends Barang {
  data: Barang[];
  count: number;
}

const url = {
  getBarang(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return `/barang?${queryString}`;
  },
  getBarangById(id: string) {
    return `/barang/${id}`;
  },
  uploadBarang() {
    return `/upload/barang`;
  },

  updateBarang(id: string) {
    return `/barang/${id}`;
  },

  getBarangByName(nama: string) {
    return `/barang/search/by-name?nama=${nama}`;
  },
};

const hooks = {
  useBarang() {
    return useSWR(url.getBarang(), http.fetcher);
  },
  useBarangById(id: string) {
    return useSWR(url.getBarangById(id), http.fetcher);
  },
  useBarangByName(nama: string) {
    return useSWR(url.getBarangByName(nama), http.fetcher);
  },
};

const api = {
  barang(data: any) {
    return http.post(url.getBarang()).send(data);
  },
  uploadBarang(data: any) {
    const formData = new FormData();
    formData.append('foto', data);
    return http.post(url.uploadBarang()).send(formData);
  },
  updateFotoBarang(id: string, data: any) {
    return http.put(url.updateBarang(id)).send(data);
  },
  updateBarang(id: string, data: any) {
    return http.put(url.updateBarang(id)).send(data);
  },
  getBarangByName(nama: string) {
    return `/barang/search/by-name?nama=${nama}`;
  },

};

export const barangRepository = {
  url,
  hooks,
  api,
};
