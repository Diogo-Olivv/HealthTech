import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { StorageService } from '../src/storage/storage.service';

/**
 * E2E CRUD dos arquivos:
 *   POST /arquivos/upload   (com descrição opcional)
 *   GET  /arquivos/:id/raw  (paciente dono e médico com vínculo)
 *   PATCH /arquivos/:id     (só médico dono do upload)
 *   DELETE /arquivos/:id    (só médico dono do upload; remove no storage antes do banco)
 *
 * O StorageService é mockado para não depender de GCS/disco.
 */

const mockStorageService = {
  generateUniqueName: jest.fn((name: string) => `mock-${Date.now()}-${name}`),
  upload: jest.fn().mockResolvedValue(undefined),
  download: jest.fn().mockResolvedValue(Buffer.from('binario')),
  delete: jest.fn().mockResolvedValue(undefined),
  getPublicUrl: jest.fn((name: string) => `https://mock-bucket/${name}`),
  isConnected: jest.fn().mockResolvedValue(true),
};

const pacienteAPayload = {
  name: 'Paciente CRUD A',
  email: 'crud-pacientea@test.com',
  password: 'senha1234',
  cpf: '111.111.111-11',
  dataNascimento: '1990-01-01',
};

const pacienteBPayload = {
  name: 'Paciente CRUD B',
  email: 'crud-pacienteb@test.com',
  password: 'senha1234',
  cpf: '222.222.222-22',
  dataNascimento: '1991-02-02',
};

type MedicoPayload = {
  name: string;
  email: string;
  password: string;
  crm: string;
  especialidadeIds: string[];
};

const medicoDonoPayload: MedicoPayload = {
  name: 'Medico Dono CRUD',
  email: 'crud-medico-dono@test.com',
  password: 'senha1234',
  crm: 'CRM/RJ 333333',
  especialidadeIds: [],
};

const medicoOutroPayload: MedicoPayload = {
  name: 'Medico Outro CRUD',
  email: 'crud-medico-outro@test.com',
  password: 'senha1234',
  crm: 'CRM/SP 444444',
  especialidadeIds: [],
};

describe('CRUD /arquivos (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let pacienteAId: string;
  let pacienteBId: string;
  let medicoDonoId: string;
  let medicoOutroId: string;

  let tokenPacienteA: string;
  let tokenPacienteB: string;
  let tokenMedicoDono: string;
  let tokenMedicoOutro: string;

  let arquivoId: string;

  beforeAll(async () => {
    jest.clearAllMocks();

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
    await limparDados(dataSource);

    const especialidades = await dataSource.query<{ id: string }[]>(
      `SELECT id FROM especialidades WHERE ativa = true ORDER BY nome ASC LIMIT 1`,
    );
    medicoDonoPayload.especialidadeIds = [especialidades[0].id];
    medicoOutroPayload.especialidadeIds = [especialidades[0].id];

    // Setup de usuários
    const resPacA = await request(app.getHttpServer())
      .post('/users/pacientes')
      .send(pacienteAPayload)
      .expect(201);
    pacienteAId = resPacA.body.id;

    const resPacB = await request(app.getHttpServer())
      .post('/users/pacientes')
      .send(pacienteBPayload)
      .expect(201);
    pacienteBId = resPacB.body.id;

    const resMedDono = await request(app.getHttpServer())
      .post('/users/medicos')
      .send(medicoDonoPayload)
      .expect(201);
    medicoDonoId = resMedDono.body.id;

    const resMedOutro = await request(app.getHttpServer())
      .post('/users/medicos')
      .send(medicoOutroPayload)
      .expect(201);
    medicoOutroId = resMedOutro.body.id;

    tokenPacienteA = (
      await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: pacienteAPayload.email, password: pacienteAPayload.password })
    ).body.accessToken;

    tokenPacienteB = (
      await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: pacienteBPayload.email, password: pacienteBPayload.password })
    ).body.accessToken;

    tokenMedicoDono = (
      await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: medicoDonoPayload.email, password: medicoDonoPayload.password })
    ).body.accessToken;

    tokenMedicoOutro = (
      await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: medicoOutroPayload.email, password: medicoOutroPayload.password })
    ).body.accessToken;

    // Vínculo: medicoDono ↔ pacienteA (pacienteB fica sem vínculo)
    await request(app.getHttpServer())
      .post('/medico-paciente/vincular')
      .set('Authorization', `Bearer ${tokenMedicoDono}`)
      .send({ pacienteId: pacienteAId })
      .expect(201);

    // Upload inicial pelo medicoDono, ao pacienteA, COM descrição
    const upload = await request(app.getHttpServer())
      .post('/arquivos/upload')
      .set('Authorization', `Bearer ${tokenMedicoDono}`)
      .field('pacienteId', pacienteAId)
      .field('descricao', '  Hemograma completo  ')
      .attach('arquivo', Buffer.from('%PDF-1.4 fake pdf'), {
        filename: 'exame.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    arquivoId = upload.body.id;
    expect(upload.body.descricao).toBe('Hemograma completo');
    expect(upload.body).not.toHaveProperty('caminhoStorage');
  });

  afterAll(async () => {
    await limparDados(dataSource);
    await app.close();
  });

  describe('GET /arquivos/:id/raw (stream)', () => {
    it('paciente dono recebe o buffer com o Content-Type do arquivo', async () => {
      const res = await request(app.getHttpServer())
        .get(`/arquivos/${arquivoId}/raw`)
        .set('Authorization', `Bearer ${tokenPacienteA}`)
        .expect(200);

      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('exame.pdf');
    });

    it('paciente de outro cadastro recebe 403', async () => {
      await request(app.getHttpServer())
        .get(`/arquivos/${arquivoId}/raw`)
        .set('Authorization', `Bearer ${tokenPacienteB}`)
        .expect(403);
    });
  });

  describe('PATCH /arquivos/:id (atualizar descrição)', () => {
    it('médico dono atualiza descrição com trim', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenMedicoDono}`)
        .send({ descricao: '  Raio-X tórax PA  ' })
        .expect(200);

      expect(res.body.descricao).toBe('Raio-X tórax PA');
    });

    it('outro médico (mesmo com vínculo posterior) recebe 403', async () => {
      // Cria vínculo do médico "outro" com pacienteA — ainda assim não é dono do upload
      await request(app.getHttpServer())
        .post('/medico-paciente/vincular')
        .set('Authorization', `Bearer ${tokenMedicoOutro}`)
        .send({ pacienteId: pacienteAId })
        .expect(201);

      await request(app.getHttpServer())
        .patch(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenMedicoOutro}`)
        .send({ descricao: 'tentativa de alteração' })
        .expect(403);
    });

    it('paciente recebe 403 (rota exclusiva de MEDICO)', async () => {
      await request(app.getHttpServer())
        .patch(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenPacienteA}`)
        .send({ descricao: 'x' })
        .expect(403);
    });

    it('descrição > 200 chars é rejeitada com 400', async () => {
      const longa = 'a'.repeat(201);
      await request(app.getHttpServer())
        .patch(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenMedicoDono}`)
        .send({ descricao: longa })
        .expect(400);
    });
  });

  describe('DELETE /arquivos/:id', () => {
    it('outro médico não-dono recebe 403', async () => {
      await request(app.getHttpServer())
        .delete(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenMedicoOutro}`)
        .expect(403);

      // O registro precisa continuar no banco após a tentativa negada
      const rows = await dataSource.query(
        `SELECT id FROM arquivos WHERE id = $1`,
        [arquivoId],
      );
      expect(rows).toHaveLength(1);
    });

    it('paciente recebe 403 (rota exclusiva de MEDICO)', async () => {
      await request(app.getHttpServer())
        .delete(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenPacienteA}`)
        .expect(403);
    });

    it('médico dono remove: chama storage.delete e apaga do banco', async () => {
      mockStorageService.delete.mockClear();

      await request(app.getHttpServer())
        .delete(`/arquivos/${arquivoId}`)
        .set('Authorization', `Bearer ${tokenMedicoDono}`)
        .expect(204);

      expect(mockStorageService.delete).toHaveBeenCalledTimes(1);

      const rows = await dataSource.query(
        `SELECT id FROM arquivos WHERE id = $1`,
        [arquivoId],
      );
      expect(rows).toHaveLength(0);
    });

    it('id inexistente retorna 404', async () => {
      await request(app.getHttpServer())
        .delete(`/arquivos/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${tokenMedicoDono}`)
        .expect(404);
    });
  });
});

async function limparDados(dataSource: DataSource): Promise<void> {
  const emails = [
    pacienteAPayload.email,
    pacienteBPayload.email,
    medicoDonoPayload.email,
    medicoOutroPayload.email,
  ]
    .map((e) => `'${e}'`)
    .join(', ');

  await dataSource.query(`
    DELETE FROM arquivos
    WHERE "medicoUploadId" IN (
      SELECT m."userId" FROM medicos m
      JOIN users u ON u.id = m."userId"
      WHERE u.email IN (${emails})
    )
  `);
  await dataSource.query(`
    DELETE FROM medico_paciente
    WHERE "medicoId" IN (
      SELECT m."userId" FROM medicos m
      JOIN users u ON u.id = m."userId"
      WHERE u.email IN (${emails})
    )
  `);
  await dataSource.query(
    `DELETE FROM pacientes WHERE cpf IN ('111.111.111-11', '222.222.222-22')`,
  );
  await dataSource.query(
    `DELETE FROM medicos WHERE crm IN ('CRM/RJ 333333', 'CRM/SP 444444')`,
  );
  await dataSource.query(`DELETE FROM users WHERE email IN (${emails})`);
}
