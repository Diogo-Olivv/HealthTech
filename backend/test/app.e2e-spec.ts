import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

const pacientePayload = {
  name: 'Paciente E2E',
  email: 'paciente-e2e@test.com',
  password: 'senha1234',
  cpf: '529.982.247-25',
  dataNascimento: '1995-08-20',
};

const medicoPayload = {
  name: 'Medico E2E',
  email: 'medico-e2e@test.com',
  password: 'senha1234',
  crm: 'CRM/RJ 999999',
  especialidade: 'Neurologia',
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
    await dataSource.query(`DELETE FROM pacientes WHERE cpf = '${pacientePayload.cpf}'`);
    await dataSource.query(`DELETE FROM medicos WHERE crm = '${medicoPayload.crm}'`);
    await dataSource.query(
      `DELETE FROM users WHERE email IN ('${pacientePayload.email}', '${medicoPayload.email}')`,
    );
  });

  describe('POST /users/pacientes', () => {
    it('deve retornar 201 com dados do paciente sem passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/pacientes')
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
      await request(app.getHttpServer()).post('/users/pacientes').send(pacientePayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/pacientes')
        .send({ ...pacientePayload, cpf: '111.444.777-35' })
        .expect(409);
    });

    it('deve retornar 409 ao tentar cadastrar CPF duplicado', async () => {
      await request(app.getHttpServer()).post('/users/pacientes').send(pacientePayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/pacientes')
        .send({ ...pacientePayload, email: 'outro-paciente@test.com' })
        .expect(409);
    });

    it('deve retornar 400 quando campos obrigatórios do paciente estiverem ausentes', async () => {
      const { cpf, ...semCpf } = pacientePayload;
      await request(app.getHttpServer()).post('/users/pacientes').send(semCpf).expect(400);
    });

    it('deve ignorar campos de outros perfis e criar usuário com sucesso (whitelist)', async () => {
      // Tenta enviar CRM para a rota de paciente
      const payloadInvalido = { ...pacientePayload, crm: 'CRM FALSO 123' };
      
      // Como forbidNonWhitelisted = true, isso vai retornar erro 400,
      // provando que a rota recusa dados intrusos
      await request(app.getHttpServer())
        .post('/users/pacientes')
        .send(payloadInvalido)
        .expect(400);
    });
  });

  describe('POST /users/medicos', () => {
    it('deve retornar 201 com dados do médico sem passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/medicos')
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
      await request(app.getHttpServer()).post('/users/medicos').send(medicoPayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/medicos')
        .send({ ...medicoPayload, crm: 'CRM/SP 000001' })
        .expect(409);
    });

    it('deve retornar 409 ao tentar cadastrar CRM duplicado', async () => {
      await request(app.getHttpServer()).post('/users/medicos').send(medicoPayload).expect(201);

      await request(app.getHttpServer())
        .post('/users/medicos')
        .send({ ...medicoPayload, email: 'outro-medico@test.com' })
        .expect(409);
    });

    it('deve retornar 400 quando campos obrigatórios do médico estiverem ausentes', async () => {
      const { crm, ...semCrm } = medicoPayload;
      await request(app.getHttpServer()).post('/users/medicos').send(semCrm).expect(400);
    });
  });
});
describe('Autorização por tipo de usuário (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let tokenMedico: string;
  let tokenPaciente: string;

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

    await dataSource.query(`DELETE FROM pacientes WHERE cpf = '${pacientePayload.cpf}'`);
    await dataSource.query(`DELETE FROM medicos WHERE crm = '${medicoPayload.crm}'`);
    await dataSource.query(
      `DELETE FROM users WHERE email IN ('${pacientePayload.email}', '${medicoPayload.email}')`,
    );

    await request(app.getHttpServer()).post('/users/pacientes').send(pacientePayload);
    await request(app.getHttpServer()).post('/users/medicos').send(medicoPayload);

    const resPaciente = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: pacientePayload.email, password: pacientePayload.password });
    tokenPaciente = resPaciente.body.accessToken;

    const resMedico = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: medicoPayload.email, password: medicoPayload.password });
    tokenMedico = resMedico.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('paciente não pode acessar rota restrita a médico (403)', async () => {
    await request(app.getHttpServer())
      .get('/users/medico/area')
      .set('Authorization', `Bearer ${tokenPaciente}`)
      .expect(403);
  });

  it('médico não pode acessar rota restrita a paciente (403)', async () => {
    await request(app.getHttpServer())
      .get('/users/paciente/area')
      .set('Authorization', `Bearer ${tokenMedico}`)
      .expect(403);
  });

  it('médico acessa rota de médico com sucesso (200)', async () => {
    await request(app.getHttpServer())
      .get('/users/medico/area')
      .set('Authorization', `Bearer ${tokenMedico}`)
      .expect(200);
  });

  it('paciente acessa rota de paciente com sucesso (200)', async () => {
    await request(app.getHttpServer())
      .get('/users/paciente/area')
      .set('Authorization', `Bearer ${tokenPaciente}`)
      .expect(200);
  });
});