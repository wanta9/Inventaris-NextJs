import { http } from '#/utils/http';
import useSWR from 'swr';

export interface koleksi {
  id: string;
  idruangan: string;
  idkoleksi: string;
  idpeminjam: string;
  tglpinjam: string;
  tglkembali: string;
  status: string; 
}
export interface Listkoleksi extends koleksi {
  data: koleksi[];
  count: number;
}

const url = {
  getkoleksi() {
      return `/koleksi`;
    },

  getkoleksiById(id: string) {  
      return `/koleksi/${id}`;
    },

  updatekoleksi(id: string) { 
      return `/koleksi/${id}`;
    },

    deletekoleksi(id: string) { 
      return `/koleksi/${id}`;
    },
}
const hooks = {
  useGetkoleksi() {
      return useSWR(url.getkoleksi(), http.fetcher);
    },

  useGetkoleksiById(id: string) {
      return useSWR(url.getkoleksiById(id), http.fetcher);
    },
}
const api = {
  getkoleksi(data: any) {
      return http.get(url.getkoleksi());
    },    
    koleksi(data: any) {
      return http.post(url.getkoleksi()).send(data);
    },
    updatekoleksi(id: string, data: any) {
      return http.put(url.updatekoleksi(id)).send(data);
    },
    
    deletekoleksi(id: string) {
      return http.del(url.deletekoleksi(id));
    },
         
}

export const koleksiRepository = {
url,
hooks,
api,
}