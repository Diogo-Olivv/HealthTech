import type { ArquivoDto } from "@/dto/arquivo.dto";
import type { AtualizarArquivoDto } from "@/dto/atualizar-arquivo.dto";
import type { DownloadArquivoResponseDto } from "@/dto/download-arquivo-response.dto";
import type { UploadArquivoDto } from "@/dto/upload-arquivo.dto";
import { API_URL } from "@/lib/api-config";
import { authHeaders, throwFromResponse } from "@/lib/http";

export async function getArquivos(): Promise<ArquivoDto[]> {
  const res = await fetch(`${API_URL}/arquivos`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao buscar arquivos.");
  return res.json();
}

export async function uploadArquivo(dto: UploadArquivoDto): Promise<ArquivoDto> {
  const formData = new FormData();
  formData.append("arquivo", dto.file);
  formData.append("pacienteId", dto.pacienteId);
  if (dto.descricao?.trim()) {
    formData.append("descricao", dto.descricao.trim());
  }

  const res = await fetch(`${API_URL}/arquivos/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao enviar o arquivo.");
  return res.json();
}

export async function getProntuarioPaciente(
  pacienteId: string,
  signal?: AbortSignal,
): Promise<ArquivoDto[]> {
  const res = await fetch(`${API_URL}/arquivos/paciente/${pacienteId}`, {
    method: "GET",
    headers: authHeaders(),
    signal,
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao buscar prontuário do paciente.");
  return res.json();
}

export async function getDownloadUrl(id: string): Promise<DownloadArquivoResponseDto> {
  const res = await fetch(`${API_URL}/arquivos/${id}/download`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao gerar link de download.");
  return res.json();
}

export function getRawUrl(id: string): string {
  return `${API_URL}/arquivos/${id}/raw`;
}

export async function getArquivoBlob(id: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/arquivos/${id}/raw`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao carregar o arquivo.");
  return res.blob();
}

export async function atualizarArquivo(
  id: string,
  dto: AtualizarArquivoDto,
): Promise<ArquivoDto> {
  const res = await fetch(`${API_URL}/arquivos/${id}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao atualizar o arquivo.");
  return res.json();
}

export async function deleteArquivo(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/arquivos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok && res.status !== 204) {
    await throwFromResponse(res, "Erro ao excluir o arquivo.");
  }
}
