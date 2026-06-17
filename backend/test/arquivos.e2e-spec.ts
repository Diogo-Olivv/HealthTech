import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';
import { StorageService } from '../src/storage/storage.service';

// Mock do StorageService: os testes de GET /arquivos não fazem upload,
// portanto não precisamos do GCS real. Isso evita o crash por GCS_BUCKET_NAME.
const mockStorageService = {
  generateUniqueName: jest.fn((name: string) => `mock-uuid-${name}`),
  upload: jest.fn().mockResolvedValue(undefined),
  download: jest.fn().mockResolvedValue(Buffer.from('')),
  delete: jest.fn().mockResolvedValue(undefined),
  getSignedUrl: jest.fn().mockResolvedValue('https://mock-signed-url'),
  getPublicUrl: jest.fn((name: string) => `https://mock-bucket/${name}`),
  isConnected: jest.fn().mockResolvedValue(true),
};

const paciente1Payload = {
  name: 'Paciente Um',
  email: 'paciente1-arquivos@test.com',
  password: 'senha1234',
  cpf: '123.456.789-09',
  dataNascimento: '1990-01-01',
};

const paciente2Payload = {
  name: 'Paciente Dois',
  email: 'paciente2-arquivos@test.com',
  password: 'senha1234',
  cpf: '987.654.321-00',
  dataNascimento: '1985-05-15',
};

const medicoVinculadoPayload = {
  name: 'Medico Vinculado',
  email: 'medico-vinculado-arquivos@test.com',
  password: 'senha1234',
  crm: 'CRM/RJ 111111',
  especialidade: 'Cardiologia',
};

const medicoSemVinculoPayload = {
  name: 'Medico Sem Vinculo',
  email: 'medico-semvinculo-arquivos@test.com',
  password: 'senha1234',
  crm: 'CRM/SP 222222',
  especialidade: 'Neurologia',
};

describe('GET /arquivos (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;

  let paciente1Id: string;
  let paciente2Id: string;
  let medicoVinculadoId: string;
  let medicoSemVinculoId: string;

  let tokenPaciente1: string;
  let tokenPaciente2: string;
  let tokenMedicoVinculado: string;
  let tokenMedicoSemVinculo: string;

  let arquivoPaciente1Id: string;
  let arquivoPaciente2Id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await limparDados(dataSource);

    const resPac1 = await request(app.getHttpServer())
      .post('/users/pacientes')
      .send(paciente1Payload)
      .expect(201);
    paciente1Id = resPac1.body.id;

    const resPac2 = await request(app.getHttpServer())
      .post('/users/pacientes')
      .send(paciente2Payload)
      .expect(201);
    paciente2Id = resPac2.body.id;

    const resMedVinc = await request(app.getHttpServer())
      .post('/users/medicos')
      .send(medicoVinculadoPayload)
      .expect(201);
    medicoVinculadoId = resMedVinc.body.id;

    const resMedSem = await request(app.getHttpServer())
      .post('/users/medicos')
      .send(medicoSemVinculoPayload)
      .expect(201);
    medicoSemVinculoId = resMedSem.body.id;

    const loginPac1 = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: paciente1Payload.email, password: paciente1Payload.password });
    tokenPaciente1 = loginPac1.body.accessToken;

    const loginPac2 = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: paciente2Payload.email, password: paciente2Payload.password });
    tokenPaciente2 = loginPac2.body.accessToken;

    const loginMedVinc = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: medicoVinculadoPayload.email, password: medicoVinculadoPayload.password });
    tokenMedicoVinculado = loginMedVinc.body.accessToken;

    const loginMedSem = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: medicoSemVinculoPayload.email, password: medicoSemVinculoPayload.password });
    tokenMedicoSemVinculo = loginMedSem.body.accessToken;

    await request(app.getHttpServer())
      .post('/medico-paciente/vincular')
      .set('Authorization', `Bearer ${tokenMedicoVinculado}`)
      .send({ pacienteId: paciente1Id })
      .expect(201);

    // Arquivos inseridos diretamente no banco pois o endpoint de upload é uma issue separada
    const [arq1] = await dataSource.query<{ id: string }[]>(`
      INSERT INTO arquivos ("nomeOriginal", "nomeUnico", tipo, tamanho, "caminhoStorage", "pacienteId", "medicoUploadId")
      VALUES (
        'exame_paciente1.pdf',
        'unique-exame-pac1.pdf',
        'application/pdf',
        102400,
        'https://storage.googleapis.com/bucket-secreto/exame_paciente1.pdf',
        '${paciente1Id}',
        '${medicoVinculadoId}'
      )
      RETURNING id
    `);
    arquivoPaciente1Id = arq1.id;

    const [arq2] = await dataSource.query<{ id: string }[]>(`
      INSERT INTO arquivos ("nomeOriginal", "nomeUnico", tipo, tamanho, "caminhoStorage", "pacienteId", "medicoUploadId")
      VALUES (
        'exame_paciente2.pdf',
        'unique-exame-pac2.pdf',
        'application/pdf',
        204800,
        'https://storage.googleapis.com/bucket-secreto/exame_paciente2.pdf',
        '${paciente2Id}',
        '${medicoVinculadoId}'
      )
      RETURNING id
    `);
    arquivoPaciente2Id = arq2.id;
  });

  afterAll(async () => {
    await limparDados(dataSource);
    await app.close();
  });

  describe('Autenticação', () => {
    it('deve retornar 401 quando a requisição não possui token JWT', async () => {
      await request(app.getHttpServer()).get('/arquivos').expect(401);
    });

    it('deve retornar 401 quando o token JWT é inválido', async () => {
      await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', 'Bearer token.invalido.aqui')
        .expect(401);
    });
  });

  describe('Autorização RBAC', () => {
    it('deve retornar 403 quando o token contém um tipo de usuário inválido', async () => {
      const tokenRoleInvalida = jwtService.sign({
        sub: paciente1Id,
        email: 'fake@test.com',
        tipo: 'ADMIN',
      });

      await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenRoleInvalida}`)
        .expect(403);
    });
  });

  describe('Paciente autenticado', () => {
    it('deve retornar 200 com apenas os próprios arquivos', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenPaciente1}`)
        .expect(200);

      const ids = res.body.map((a: { id: string }) => a.id);
      expect(ids).toContain(arquivoPaciente1Id);
      expect(ids).not.toContain(arquivoPaciente2Id);
    });

    it('não deve incluir o campo caminhoStorage na resposta (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenPaciente1}`)
        .expect(200);

      res.body.forEach((item: Record<string, unknown>) => {
        expect(item).not.toHaveProperty('caminhoStorage');
        expect(JSON.stringify(item)).not.toContain('bucket-secreto');
      });
    });

    it('deve retornar 200 com array vazio se o paciente não tiver arquivos', async () => {
      const pac3 = await request(app.getHttpServer())
        .post('/users/pacientes')
        .send({
          name: 'Paciente Sem Arquivos',
          email: 'paciente3-semArquivos@test.com',
          password: 'senha1234',
          cpf: '111.222.333-96',
          dataNascimento: '2000-03-03',
        })
        .expect(201);

      const loginPac3 = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: 'paciente3-semArquivos@test.com', password: 'senha1234' });

      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${loginPac3.body.accessToken}`)
        .expect(200);

      expect(res.body).toEqual([]);

      await dataSource.query(`DELETE FROM pacientes WHERE cpf = '111.222.333-96'`);
      await dataSource.query(`DELETE FROM users WHERE id = '${pac3.body.id}'`);
    });
  });

  describe('Médico autenticado', () => {
    it('deve retornar 200 apenas com arquivos dos pacientes vinculados', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenMedicoVinculado}`)
        .expect(200);

      const ids = res.body.map((a: { id: string }) => a.id);
      expect(ids).toContain(arquivoPaciente1Id);
      expect(ids).not.toContain(arquivoPaciente2Id);
    });

    it('NÃO deve retornar arquivos de pacientes não vinculados', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenMedicoVinculado}`)
        .expect(200);

      const pacienteIdsNaResposta = res.body.map((a: { pacienteId: string }) => a.pacienteId);
      expect(pacienteIdsNaResposta).not.toContain(paciente2Id);
    });

    it('deve retornar 200 com array vazio para médico sem pacientes vinculados (edge case)', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenMedicoSemVinculo}`)
        .expect(200);

      expect(res.body).toEqual([]);
    });

    it('não deve incluir o campo caminhoStorage na resposta (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenMedicoVinculado}`)
        .expect(200);

      res.body.forEach((item: Record<string, unknown>) => {
        expect(item).not.toHaveProperty('caminhoStorage');
        expect(JSON.stringify(item)).not.toContain('bucket-secreto');
      });
    });
  });
});

async function limparDados(dataSource: DataSource): Promise<void> {
  const emails = [
    paciente1Payload.email,
    paciente2Payload.email,
    medicoVinculadoPayload.email,
    medicoSemVinculoPayload.email,
    'paciente3-semArquivos@test.com',
  ].map((e) => `'${e}'`).join(', ');

  await dataSource.query(`
    DELETE FROM arquivos
    WHERE "nomeUnico" IN ('unique-exame-pac1.pdf', 'unique-exame-pac2.pdf')
  `);
  await dataSource.query(`
    DELETE FROM medico_paciente
    WHERE "medicoId" IN (
      SELECT m."userId" FROM medicos m
      JOIN users u ON u.id = m."userId"
      WHERE u.email IN (${emails})
    )
  `);
  await dataSource.query(`DELETE FROM pacientes WHERE cpf IN ('123.456.789-09', '987.654.321-00', '111.222.333-96')`);
  await dataSource.query(`DELETE FROM medicos WHERE crm IN ('CRM/RJ 111111', 'CRM/SP 222222')`);
  await dataSource.query(`DELETE FROM users WHERE email IN (${emails})`);
}
