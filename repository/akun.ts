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
};

export const akunRepository = {
  url,
  hooks,
  api,
};
