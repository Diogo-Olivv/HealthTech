import type { CreateMedicoDto } from "@/dto/create-medico.dto";
import type { CreatePacienteDto } from "@/dto/create-paciente.dto";
import type { LoginUserDto } from "@/dto/login-user.dto";
import type { LoginResponse } from "@/dto/login-response";
import type { PublicUser } from "@/dto/public-user";
import type { PacienteDisponivelDto } from "@/dto/paciente-disponivel.dto";
import type { PacienteVinculadoDto } from "@/dto/paciente-vinculado.dto";
import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";
import { API_URL } from "@/lib/api-config";
import { authHeaders, throwFromResponse } from "@/lib/http";

export { saveToken, getToken, clearToken } from "@/lib/auth-token";

export async function registerPaciente(dto: CreatePacienteDto): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao cadastrar. Tente novamente.");
  return res.json();
}

export async function registerMedico(dto: CreateMedicoDto): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/medicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao cadastrar. Tente novamente.");
  return res.json();
}

export async function loginUser(dto: LoginUserDto): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, "Erro ao entrar. Tente novamente.");
  return res.json();
}

export async function getProfile(): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/me`, { headers: authHeaders() });
  if (!res.ok) await throwFromResponse(res, "Sessão inválida ou expirada.");
  return res.json();
}

export async function getMyPatients(): Promise<PacienteVinculadoDto[]> {
  const res = await fetch(`${API_URL}/medico-paciente/meus-pacientes`, {
    headers: authHeaders(),
  });
  if (!res.ok) await throwFromResponse(res, "Erro ao buscar seus pacientes.");
  return res.json();
}

export async function getMyMedicos(): Promise<MedicoVinculadoDto[]> {
  const res = await fetch(`${API_URL}/medico-paciente/meus-medicos`, {
    headers: authHeaders(),
  });
  if (!res.ok) await throwFromResponse(res, "Erro ao buscar seus médicos.");
  return res.json();
}

export async function getAvailablePatients(): Promise<PacienteDisponivelDto[]> {
  const res = await fetch(`${API_URL}/medico-paciente/pacientes-disponiveis`, {
    headers: authHeaders(),
  });
  if (!res.ok) await throwFromResponse(res, "Erro ao buscar pacientes disponíveis.");
  return res.json();
}

export async function linkPatient(pacienteId: string): Promise<void> {
  const res = await fetch(`${API_URL}/medico-paciente/vincular`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ pacienteId }),
  });
  if (!res.ok) await throwFromResponse(res, "Erro ao vincular paciente.");
}
