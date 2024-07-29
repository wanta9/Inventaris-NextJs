export const config = {
  baseUrl:
    (typeof window !== 'undefined' ? (window as any).serverEnv?.DYNAMIC_ENV_BASE_URL : '') ||
    process.env.NEXT_PUBLIC_BASE_URL ||
<<<<<<< HEAD
    'http://localhost:3222',
=======
    'http://172.17.2.91:3222',
>>>>>>> bbe908c97f7acc8d1549c0862e429af18339d770
};
