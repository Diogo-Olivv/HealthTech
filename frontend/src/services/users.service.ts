import type { CreateMedicoDto } from '@/dto/create-medico.dto';
import type { CreatePacienteDto } from '@/dto/create-paciente.dto';
import type { LoginUserDto } from '@/dto/login-user.dto';
import type { LoginResponse } from '@/dto/login-response';
import type { PublicUser } from '@/dto/public-user';
import type { PacienteDisponivelDto } from '@/dto/paciente-disponivel.dto';
import type { PacienteVinculadoDto } from '@/dto/paciente-vinculado.dto';
import type { MedicoVinculadoDto } from '@/dto/medico-vinculado.dto';


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'accessToken';

async function throwFromResponse(res: Response, fallback: string): Promise<never> {
  const data = await res.json().catch(() => ({}));
  throw new Error(data?.message ?? fallback);
}

export async function registerPaciente(
  dto: CreatePacienteDto,
): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, 'Erro ao cadastrar. Tente novamente.');
  return res.json();
}

export async function registerMedico(
  dto: CreateMedicoDto,
): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/medicos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, 'Erro ao cadastrar. Tente novamente.');
  return res.json();
}

export async function loginUser(dto: LoginUserDto): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) await throwFromResponse(res, 'Erro ao entrar. Tente novamente.');
  return res.json();
}

export async function getProfile(): Promise<PublicUser> {
  const token = getToken();
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await throwFromResponse(res, 'Sessão inválida ou expirada.');
  return res.json();
}

export async function getMyPatients(): Promise<PacienteVinculadoDto[]> {
  const token = getToken();
  const res = await fetch(`${API_URL}/medico-paciente/meus-pacientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await throwFromResponse(res, 'Erro ao buscar seus pacientes.');
  return res.json();
}

export async function getMyMedicos(): Promise<MedicoVinculadoDto[]> {
  const token = getToken();
  const res = await fetch(`${API_URL}/medico-paciente/meus-medicos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await throwFromResponse(res, 'Erro ao buscar seus médicos.');
  return res.json();
}

export async function getAvailablePatients(): Promise<PacienteDisponivelDto[]> {
  const token = getToken();
  const res = await fetch(`${API_URL}/medico-paciente/pacientes-disponiveis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await throwFromResponse(res, 'Erro ao buscar pacientes disponíveis.');
  return res.json();
}

export async function linkPatient(pacienteId: string): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/medico-paciente/vincular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pacienteId }),
  });
  if (!res.ok) await throwFromResponse(res, 'Erro ao vincular paciente.');
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
