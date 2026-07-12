export const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const API_URL = "/api/proxy";

export const AUTH_COOKIE = "accessToken";
