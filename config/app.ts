export const config = {
  baseUrl:
    (typeof window !== 'undefined' ? (window as any).serverEnv?.DYNAMIC_ENV_BASE_URL : '') ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://192.168.209.136:3222',
};
