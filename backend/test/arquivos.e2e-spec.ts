import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  ExecutionContext,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArquivosModule } from '../src/arquivos/arquivos.module';
import { StorageService } from '../src/storage/storage.service';
import { Arquivo } from '../src/entities/arquivo.entity';
import { MedicoPaciente } from '../src/entities/medico-paciente.entity';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { RolesGuard } from '../src/auth/roles.guard';
import { UserType } from '../src/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../src/auth/roles.decorator';

const MEDICO_ID = 'e2e-medico-uuid';
const PACIENTE_ID = 'e2e-paciente-uuid';
const MEDICO_SEM_VINCULO_ID = 'e2e-medico-sem-vinculo-uuid';

const makeJwtGuardAsUser = (id: string, tipo: UserType): CanActivate => ({
  canActivate: (ctx: ExecutionContext) => {
    ctx.switchToHttp().getRequest().user = { id, tipo };
    return true;
  },
});

// O RolesGuard usa o Reflector real para que @Roles() seja genuinamente avaliado nos testes.
const makeRolesGuard = (reflector: Reflector): CanActivate => ({
  canActivate: (ctx: ExecutionContext) => {
    const rolesExigidas = reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!rolesExigidas || rolesExigidas.length === 0) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!rolesExigidas.includes(user?.tipo)) {
      throw new ForbiddenException('Acesso negado para este tipo de usuário');
    }
    return true;
  },
});

const mockArquivosRepo = {
  create: jest.fn((dto: Partial<Arquivo>) => ({ ...dto, id: 'arquivo-criado-uuid' }) as Arquivo),
  save: jest.fn(async (entity: Arquivo) => entity),
};

const mockMedicoPacienteRepo = { findOne: jest.fn() };

const mockStorageService = {
  generateUniqueName: jest.fn((originalName: string) => `gerado-${originalName}`),
  upload: jest.fn().mockResolvedValue(undefined),
  getPublicUrl: jest.fn((nomeUnico: string) => `https://storage.googleapis.com/bucket/${nomeUnico}`),
};

async function buildApp(userId: string, userTipo: UserType): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ArquivosModule],
  })
    .overrideProvider(StorageService)
    .useValue(mockStorageService)
    .overrideProvider(getRepositoryToken(Arquivo))
    .useValue(mockArquivosRepo)
    .overrideProvider(getRepositoryToken(MedicoPaciente))
    .useValue(mockMedicoPacienteRepo)
    .overrideGuard(JwtAuthGuard)
    .useValue(makeJwtGuardAsUser(userId, userTipo))
    .overrideGuard(RolesGuard)
    .useFactory({
      factory: (reflector: Reflector) => makeRolesGuard(reflector),
      inject: [Reflector],
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  await app.init();
  return app;
}

describe('POST /arquivos/upload (E2E)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Médico vinculado ao paciente', () => {
    let app: INestApplication;

    beforeAll(async () => { app = await buildApp(MEDICO_ID, UserType.MEDICO); });
    afterAll(() => app.close());

    it('deve retornar 201 com os dados públicos do arquivo (sem caminhoStorage)', async () => {
      mockMedicoPacienteRepo.findOne.mockResolvedValue({ medicoId: MEDICO_ID, pacienteId: PACIENTE_ID });

      const res = await request(app.getHttpServer())
        .post('/arquivos/upload')
        .field('pacienteId', PACIENTE_ID)
        .attach('arquivo', Buffer.from('%PDF-1.4 fake content'), {
          filename: 'exame.pdf',
          contentType: 'application/pdf',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('nomeOriginal', 'exame.pdf');
      expect(res.body).toHaveProperty('tipo', 'application/pdf');
      expect(res.body).toHaveProperty('tamanho');
      expect(res.body).toHaveProperty('pacienteId', PACIENTE_ID);
      expect(res.body).not.toHaveProperty('caminhoStorage');
      expect(mockStorageService.upload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Usuário do tipo PACIENTE tenta fazer upload', () => {
    let app: INestApplication;

    beforeAll(async () => { app = await buildApp(PACIENTE_ID, UserType.PACIENTE); });
    afterAll(() => app.close());

    it('deve retornar 403', async () => {
      await request(app.getHttpServer())
        .post('/arquivos/upload')
        .field('pacienteId', PACIENTE_ID)
        .attach('arquivo', Buffer.from('fake'), { filename: 'exame.pdf', contentType: 'application/pdf' })
        .expect(403);

      expect(mockStorageService.upload).not.toHaveBeenCalled();
    });
  });

  describe('Médico SEM vínculo com o paciente', () => {
    let app: INestApplication;

    beforeAll(async () => { app = await buildApp(MEDICO_SEM_VINCULO_ID, UserType.MEDICO); });
    afterAll(() => app.close());

    it('deve retornar 403', async () => {
      mockMedicoPacienteRepo.findOne.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/arquivos/upload')
        .field('pacienteId', PACIENTE_ID)
        .attach('arquivo', Buffer.from('%PDF-1.4 fake content'), {
          filename: 'exame.pdf',
          contentType: 'application/pdf',
        })
        .expect(403);

      expect(mockStorageService.upload).not.toHaveBeenCalled();
    });
  });
});
