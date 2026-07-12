import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePacienteDto } from './create-paciente.dto';
import { CreateMedicoDto } from './create-medico.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const pacienteMetadata: ArgumentMetadata = {
  type: 'body',
  metatype: CreatePacienteDto,
  data: '',
};
const medicoMetadata: ArgumentMetadata = {
  type: 'body',
  metatype: CreateMedicoDto,
  data: '',
};

const pacientePayload = {
  name: 'João Paciente',
  email: 'joao@email.com',
  password: 'senha1234',
  cpf: '529.982.247-25',
  dataNascimento: '1995-08-20',
};

const medicoPayload = {
  name: 'Dra. Ana Médica',
  email: 'ana@email.com',
  password: 'senha1234',
  crm: 'CRM/SP 123456',
  especialidadeIds: ['3f8e1c2d-1234-4a5b-9c8d-1a2b3c4d5e6f'],
};

describe('Rotas públicas de cadastro rejeitam tipo: ADMIN', () => {
  it('POST /users/pacientes rejeita payload com tipo: ADMIN', async () => {
    await expect(
      pipe.transform({ ...pacientePayload, tipo: 'ADMIN' }, pacienteMetadata),
    ).rejects.toThrow(BadRequestException);
  });

  it('POST /users/medicos rejeita payload com tipo: ADMIN', async () => {
    await expect(
      pipe.transform({ ...medicoPayload, tipo: 'ADMIN' }, medicoMetadata),
    ).rejects.toThrow(BadRequestException);
  });

  it('payload válido de paciente (sem tipo) continua sendo aceito', async () => {
    await expect(
      pipe.transform(pacientePayload, pacienteMetadata),
    ).resolves.toBeDefined();
  });

  it('payload válido de médico (sem tipo) continua sendo aceito', async () => {
    await expect(
      pipe.transform(medicoPayload, medicoMetadata),
    ).resolves.toBeDefined();
  });
});
