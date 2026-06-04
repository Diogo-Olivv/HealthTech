import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

const pacientePayload = {
  name: 'Paciente E2E',
  email: 'paciente-e2e@test.com',
  password: 'senha1234',
  tipo: 'PACIENTE',
  paciente: {
    cpf: '111.222.333-44',
    dataNascimento: '1995-08-20',
  },
};

const medicoPayload = {
  name: 'Medico E2E',
  email: 'medico-e2e@test.com',
  password: 'senha1234',
  tipo: 'MEDICO',
  medico: {
    crm: 'CRM/RJ 999999',
    especialidade: 'Neurologia',
  },
};

describe('Registro de usuários (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query(`DELETE FROM pacientes WHERE cpf = '${pacientePayload.paciente.cpf}'`);
    await dataSource.query(`DELETE FROM medicos WHERE crm = '${medicoPayload.medico.crm}'`);
    await dataSource.query(
      `DELETE FROM users WHERE email IN ('${pacientePayload.email}', '${medicoPayload.email}')`,
    );
  });

  describe('POST /users/register — Paciente', () => {
    it('deve retornar 201 com dados do paciente sem passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send(pacientePayload)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', pacientePayload.email);
      expect(res.body).toHaveProperty('name', pacientePayload.name);
      expect(res.body).toHaveProperty('tipo', 'PACIENTE');
      expect(res.body).not.toHaveProperty('passwordHash');
      expect(res.body).not.toHaveProperty('password');
    });

    it('deve retornar 409 ao tentar cadastrar e-mail duplicado', async () => {
      await request(app.getHttpServer()).post('/users/register').send(pacientePayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/register')
        .send({ ...pacientePayload, paciente: { ...pacientePayload.paciente, cpf: '999.888.777-66' } })
        .expect(409);
    });

    it('deve retornar 409 ao tentar cadastrar CPF duplicado', async () => {
      await request(app.getHttpServer()).post('/users/register').send(pacientePayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/register')
        .send({ ...pacientePayload, email: 'outro-paciente@test.com' })
        .expect(409);
    });

    it('deve retornar 400 quando campos obrigatórios do paciente estiverem ausentes', async () => {
      const { paciente: _, ...semPerfil } = pacientePayload;
      await request(app.getHttpServer()).post('/users/register').send(semPerfil).expect(400);
    });
  });

  describe('POST /users/register — Médico', () => {
    it('deve retornar 201 com dados do médico sem passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send(medicoPayload)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', medicoPayload.email);
      expect(res.body).toHaveProperty('name', medicoPayload.name);
      expect(res.body).toHaveProperty('tipo', 'MEDICO');
      expect(res.body).not.toHaveProperty('passwordHash');
      expect(res.body).not.toHaveProperty('password');
    });

    it('deve retornar 409 ao tentar cadastrar e-mail duplicado', async () => {
      await request(app.getHttpServer()).post('/users/register').send(medicoPayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/register')
        .send({ ...medicoPayload, medico: { ...medicoPayload.medico, crm: 'CRM/SP 000001' } })
        .expect(409);
    });

    it('deve retornar 409 ao tentar cadastrar CRM duplicado', async () => {
      await request(app.getHttpServer()).post('/users/register').send(medicoPayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/register')
        .send({ ...medicoPayload, email: 'outro-medico@test.com' })
        .expect(409);
    });

    it('deve retornar 400 quando campos obrigatórios do médico estiverem ausentes', async () => {
      const { medico: _, ...semPerfil } = medicoPayload;
      await request(app.getHttpServer()).post('/users/register').send(semPerfil).expect(400);
    });
  });
});
