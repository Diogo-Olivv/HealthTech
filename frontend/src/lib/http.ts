import { getToken } from "./auth-token";

export async function throwFromResponse(res: Response, fallback: string): Promise<never> {
  const data = await res.json().catch(() => ({}));
  const message = typeof data?.message === "string" ? data.message : fallback;
  throw new Error(message);
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");
  return { Authorization: `Bearer ${token}` };
}
