import { http } from '#/utils/http';
import useSWR from 'swr';

const url = {
  getDashboard() {
    return `/dashboard`;
  },
};

const hooks = {
  useDashboard() {
    return useSWR(url.getDashboard(), http.fetcher);
  },
};

export const dashboardRepository = {
  url,
  hooks,
};
