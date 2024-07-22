export const config = {
  baseUrl:
    (typeof window !== 'undefined' ? (window as any).serverEnv?.DYNAMIC_ENV_BASE_URL : '') ||
    process.env.NEXT_PUBLIC_BASE_URL ||
<<<<<<< HEAD
    'http://172.17.0.148:3222',
=======
    'http://localhost:3222',
>>>>>>> 01ff579f1d3cb742983b810135a2ecf1eb79639f
};
