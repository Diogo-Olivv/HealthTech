import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { seedAdmin } from '../src/users/seeds/admin.seed';

const adminEmail = 'admin-audit-e2e@test.com';
const adminPassword = 'senha-admin-1234';

const medicoPayload = {
  name: 'Medico Audit E2E',
  email: 'medico-audit-e2e@test.com',
  password: 'senha1234',
  crm: 'CRM/RJ 555555',
  especialidade: 'Dermatologia',
};

describe('GET /audit/logs (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let tokenAdmin: string;
  let tokenMedico: string;
  let adminUserId: string;

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

    await dataSource.query(`DELETE FROM medicos WHERE crm = '${medicoPayload.crm}'`);
    await dataSource.query(
      `DELETE FROM users WHERE email IN ('${adminEmail}', '${medicoPayload.email}')`,
    );

    await seedAdmin(dataSource, adminEmail, adminPassword);

    const resAdminLogin = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: adminEmail, password: adminPassword });
    tokenAdmin = resAdminLogin.body.accessToken;
    adminUserId = resAdminLogin.body.user.id;

    await request(app.getHttpServer()).post('/users/medicos').send(medicoPayload);
    const resMedicoLogin = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: medicoPayload.email, password: medicoPayload.password });
    tokenMedico = resMedicoLogin.body.accessToken;
  });

  afterAll(async () => {
    await dataSource.query(`DELETE FROM medicos WHERE crm = '${medicoPayload.crm}'`);
    await dataSource.query(
      `DELETE FROM users WHERE email IN ('${adminEmail}', '${medicoPayload.email}')`,
    );
    await app.close();
  });

  it('médico recebe 403 ao tentar consultar os logs', async () => {
    await request(app.getHttpServer())
      .get('/audit/logs')
      .set('Authorization', `Bearer ${tokenMedico}`)
      .expect(403);
  });

  it('admin sem filtros recebe a página mais recente, ordenada por timestamp DESC', async () => {
    const res = await request(app.getHttpServer())
      .get('/audit/logs')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);

    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 50);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(50);

    const timestamps = res.body.items.map((item: { timestamp: string }) =>
      new Date(item.timestamp).getTime(),
    );
    const timestampsOrdenados = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(timestampsOrdenados);
  });

  it('admin filtrando por tipoEvento só recebe logs daquele tipo', async () => {
    const res = await request(app.getHttpServer())
      .get('/audit/logs')
      .query({ tipoEvento: 'LOGIN', limit: 200 })
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);

    expect(res.body.items.length).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.tipoEvento).toBe('LOGIN');
    }

    const contemLoginDoAdmin = res.body.items.some(
      (item: { recursoId: string; tipoEvento: string }) =>
        item.recursoId === adminUserId && item.tipoEvento === 'LOGIN',
    );
    expect(contemLoginDoAdmin).toBe(true);
  });
});
