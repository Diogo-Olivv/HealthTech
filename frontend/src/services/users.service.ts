import type { CreateMedicoDto } from '@/dto/create-medico.dto';
import type { CreatePacienteDto } from '@/dto/create-paciente.dto';
import type { LoginUserDto } from '@/dto/login-user.dto';
import type { LoginResponse } from '@/dto/login-response';
import type { PublicUser } from '@/dto/public-user';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'accessToken';

export async function registerPaciente(
  dto: CreatePacienteDto,
): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Erro ao cadastrar. Tente novamente.');
  }

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

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Erro ao cadastrar. Tente novamente.');
  }

  return res.json();
}

export async function loginUser(dto: LoginUserDto): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Erro ao entrar. Tente novamente.');
  }

  return res.json();
}

export async function getProfile(token: string): Promise<PublicUser> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Sessão inválida ou expirada.');
  }

  return res.json();
}

// Função para listar pacientes do médico

export async function getMyPatients(token: string): Promise<PublicUser[]> {
  const res = await fetch(`${API_URL}/medico-paciente/meus-pacientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Sessão inválida ou expirada.');
  }

  return res.json();
}

// funcionalidade de listar Pacientes Vinculados acima PAUSADA até finalização da Funcionalidade De Vincúlo de Médico com Paciente

// Busca a lista de pacientes disponíveis (que não são seus ainda)
export async function getAvailablePatients(token: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/medico-paciente/pacientes-disponiveis`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar pacientes disponíveis.');
  }

  return res.json();
}

// Envia o pedido para o backend criar o vínculo
export async function linkPatient(token: string, pacienteId: string): Promise<void> {
  const res = await fetch(`${API_URL}/medico-paciente/vincular`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ pacienteId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao vincular paciente.');
  }
}

//************************************** *//


export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
