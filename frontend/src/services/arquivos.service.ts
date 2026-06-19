import type { ArquivoDto } from "@/dto/arquivo.dto";
import { getToken } from "./users.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getArquivos(): Promise<ArquivoDto[]> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_URL}/arquivos`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? "Erro ao buscar arquivos.");
  }

  return res.json();
}
