import { http } from '#/utils/http';
import useSWR from 'swr';

const url = {
  getAkun() {
    return `/akun`;
  },
  loginAkun() {
    return `/akun/login`;
  },
  authorize() {
    return `/akun/authorize`;
  },
  uploadAkun() {
    return `/upload/akun`;
  },

  updateAkun(id: string) {
    return `/akun/${id}`;
  }
};

const hooks = {
  useAkun() {
    return useSWR(url.getAkun(), http.fetcher);
  },
  useAuth() {
    return useSWR(url.authorize(), http.fetcher);
  },
};

const api = {
  login(data: any) {
    return http.post(url.loginAkun()).send(data);
  },

  akun(data: any) {
    return http.post(url.getAkun()).send(data);
  },
  
  uploadAkun(data: any) {
    const formData = new FormData();
    formData.append('foto', data);
    return http.post(url.uploadAkun()).send(formData);
  },
<<<<<<< HEAD
=======

  updateAkun(id: string, data: any) { 
    return http.put(url.updateAkun(id)).send(data);
  },

>>>>>>> 1405f685a3117d3371fc2a48ee344df87bac3158
};

export const akunRepository = {
  url,
  hooks,
  api,
};
