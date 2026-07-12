import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { seedAdmin } from '../src/users/seeds/admin.seed';

const adminEmail = 'admin-e2e@test.com';
const adminPassword = 'senha-admin-1234';

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
}

describe('Login de ADMIN (E2E)', () => {
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

    await dataSource.query(`DELETE FROM users WHERE email = '${adminEmail}'`);
    await seedAdmin(dataSource, adminEmail, adminPassword);
  });

  afterAll(async () => {
    await dataSource.query(`DELETE FROM users WHERE email = '${adminEmail}'`);
    await app.close();
  });

  it('login com admin retorna accessToken cujo payload traz tipo: ADMIN', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('tipo', 'ADMIN');

    const payload = decodeJwtPayload(res.body.accessToken);
    expect(payload).toHaveProperty('tipo', 'ADMIN');
  });

  it('rotas públicas de cadastro não aceitam tipo: ADMIN no corpo da requisição', async () => {
    await request(app.getHttpServer())
      .post('/users/pacientes')
      .send({
        name: 'Invasor',
        email: 'invasor@test.com',
        password: 'senha1234',
        cpf: '111.444.777-35',
        dataNascimento: '1990-01-01',
        tipo: 'ADMIN',
      })
      .expect(400);
  });
});
