export const config = {
  baseUrl:
    (typeof window !== 'undefined' ? (window as any).serverEnv?.DYNAMIC_ENV_BASE_URL : '') ||
    process.env.NEXT_PUBLIC_BASE_URL ||
<<<<<<< HEAD
    'http://localhost:3222',
=======
    'http://192.168.163.136:3222',
>>>>>>> 87c8b176a99e99e26401cfed4367316ce746614a
};
