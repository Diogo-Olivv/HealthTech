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

export async function uploadArquivo(file: File, pacienteId: string): Promise<ArquivoDto> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const formData = new FormData();
  formData.append("arquivo", file);
  formData.append("pacienteId", pacienteId);

  const res = await fetch(`${API_URL}/arquivos/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData, 
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? "Erro ao enviar o arquivo.");
  }

  return res.json();
}

export async function getProntuarioPaciente(pacienteId: string, signal?: AbortSignal): Promise<ArquivoDto[]> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_URL}/arquivos/paciente/${pacienteId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? "Erro ao buscar prontuário do paciente.");
  }

  return res.json();
}


