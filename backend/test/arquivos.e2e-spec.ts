/**
 * Testes de integração (E2E) — GET /arquivos
 *
 * Cobre:
 *  - 401 sem autenticação
 *  - 403 para usuário com role inexistente (token manipulado)
 *  - Paciente vê apenas seus próprios arquivos
 *  - Médico vê apenas arquivos de pacientes vinculados
 *  - Médico NÃO vê arquivos de pacientes não vinculados
 *  - Médico sem pacientes vinculados recebe [] com 200 (edge case array vazio)
 *  - `caminhoStorage` NUNCA está presente na resposta
 *
 * Estratégia de fixtures: dados são inseridos via DataSource.query() direto
 * no banco, pois o endpoint de upload ainda não existe (issue futura).
 * Os dados são limpos no afterAll para isolar o suite.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';

// ---------------------------------------------------------------------------
// Payloads de criação de usuários
// ---------------------------------------------------------------------------
const paciente1Payload = {
  name: 'Paciente Um',
  email: 'paciente1-arquivos@test.com',
  password: 'senha1234',
  cpf: '111.111.111-11',
  dataNascimento: '1990-01-01',
};

const paciente2Payload = {
  name: 'Paciente Dois',
  email: 'paciente2-arquivos@test.com',
  password: 'senha1234',
  cpf: '222.222.222-22',
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

// ---------------------------------------------------------------------------
// Suite principal
// ---------------------------------------------------------------------------
describe('GET /arquivos (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;

  // IDs dos usuários criados para os testes
  let paciente1Id: string;
  let paciente2Id: string;
  let medicoVinculadoId: string;
  let medicoSemVinculoId: string;

  // Tokens de acesso
  let tokenPaciente1: string;
  let tokenPaciente2: string;
  let tokenMedicoVinculado: string;
  let tokenMedicoSemVinculo: string;

  // IDs dos arquivos de fixture
  let arquivoPaciente1Id: string;
  let arquivoPaciente2Id: string;

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
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // --- Limpar dados de execuções anteriores ---
    await limparDados(dataSource);

    // --- Criar usuários ---
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

    // --- Obter tokens via login ---
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

    // --- Vincular médico ao paciente1 (apenas) ---
    await request(app.getHttpServer())
      .post('/medico-paciente/vincular')
      .set('Authorization', `Bearer ${tokenMedicoVinculado}`)
      .send({ pacienteId: paciente1Id })
      .expect(201);

    // --- Inserir arquivos de fixture diretamente no banco ---
    // Arquivo pertencente ao Paciente 1
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

    // Arquivo pertencente ao Paciente 2
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

  // -------------------------------------------------------------------------
  // Autenticação — 401
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Autorização — 403 para role inválida
  // -------------------------------------------------------------------------
  describe('Autorização RBAC', () => {
    it('deve retornar 403 quando o token contém um tipo de usuário inválido', async () => {
      // Cria um JWT assinado com a mesma secret, mas com tipo desconhecido
      const tokenRoleInvalida = jwtService.sign({
        sub: paciente1Id,
        email: 'fake@test.com',
        tipo: 'ADMIN', // tipo que não existe no sistema
      });

      await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenRoleInvalida}`)
        .expect(403);
    });
  });

  // -------------------------------------------------------------------------
  // Paciente — isolamento de dados
  // -------------------------------------------------------------------------
  describe('Paciente autenticado', () => {
    it('deve retornar 200 com apenas os próprios arquivos', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenPaciente1}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
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
        expect(item.caminhoStorage).toBeUndefined();
        expect(item).not.toHaveProperty('caminhoStorage');
        // Garantia adicional: o campo não aparece serializado em nenhuma forma
        expect(JSON.stringify(item)).not.toContain('caminhoStorage');
        expect(JSON.stringify(item)).not.toContain('bucket-secreto');
      });
    });

    it('deve retornar 200 com array vazio se o paciente não tiver arquivos', async () => {
      // Paciente 2 não está vinculado e não tem arquivos associados ao próprio ID
      // Para este cenário, criamos um terceiro paciente sem arquivos
      const pac3 = await request(app.getHttpServer())
        .post('/users/pacientes')
        .send({
          name: 'Paciente Sem Arquivos',
          email: 'paciente3-semArquivos@test.com',
          password: 'senha1234',
          cpf: '333.333.333-33',
          dataNascimento: '2000-03-03',
        })
        .expect(201);

      const loginPac3 = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: 'paciente3-semArquivos@test.com', password: 'senha1234' });
      const tokenPaciente3 = loginPac3.body.accessToken;

      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenPaciente3}`)
        .expect(200);

      expect(res.body).toEqual([]);

      // Limpar paciente 3
      await dataSource.query(`DELETE FROM pacientes WHERE cpf = '333.333.333-33'`);
      await dataSource.query(`DELETE FROM users WHERE id = '${pac3.body.id}'`);
    });
  });

  // -------------------------------------------------------------------------
  // Médico — isolamento por vínculos
  // -------------------------------------------------------------------------
  describe('Médico autenticado', () => {
    it('deve retornar 200 apenas com arquivos dos pacientes vinculados', async () => {
      const res = await request(app.getHttpServer())
        .get('/arquivos')
        .set('Authorization', `Bearer ${tokenMedicoVinculado}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);

      const ids = res.body.map((a: { id: string }) => a.id);
      // Médico está vinculado ao paciente1 → deve ver o arquivo do paciente1
      expect(ids).toContain(arquivoPaciente1Id);
      // Médico NÃO está vinculado ao paciente2 → NÃO deve ver o arquivo do paciente2
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
        expect(item.caminhoStorage).toBeUndefined();
        expect(item).not.toHaveProperty('caminhoStorage');
        expect(JSON.stringify(item)).not.toContain('caminhoStorage');
        expect(JSON.stringify(item)).not.toContain('bucket-secreto');
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Helper: limpar todos os dados de fixture criados por este suite
// ---------------------------------------------------------------------------
async function limparDados(dataSource: DataSource): Promise<void> {
  const emails = [
    paciente1Payload.email,
    paciente2Payload.email,
    medicoVinculadoPayload.email,
    medicoSemVinculoPayload.email,
    'paciente3-semArquivos@test.com',
  ].map((e) => `'${e}'`)
    .join(', ');

  // Ordem de deleção respeitando FK constraints
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
  await dataSource.query(`DELETE FROM pacientes WHERE cpf IN ('111.111.111-11', '222.222.222-22', '333.333.333-33')`);
  await dataSource.query(`DELETE FROM medicos WHERE crm IN ('CRM/RJ 111111', 'CRM/SP 222222')`);
  await dataSource.query(`DELETE FROM users WHERE email IN (${emails})`);
}
