import { http } from '#/utils/http';
import useSWR from 'swr';

const url = {
  getAkun() {
    return `/akun`;
  },
  loginAkun() {
    return `/akun/login`;
  },
};

const hooks = {
  useAkun() {
    return useSWR(url.getAkun(), http.fetcher);
  },
};

const api = {
  login(data: any) {
    return http.post(url.loginAkun()).send(data);
  },
};

export const akunRepository = {
  url,
  hooks,
  api,
};
