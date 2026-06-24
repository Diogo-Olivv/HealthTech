import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { Request } from 'express';
import { AppModule } from '../src/app.module';
import {
  AuditLog,
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../src/entities/audit-log/audit-log.entity';
import { AuditLogService } from '../src/audit/audit-log.service';
import { StorageService } from '../src/storage/storage.service';

const mockStorageService = {
  generateUniqueName: jest.fn((name: string) => `mock-uuid-${name}`),
  upload: jest.fn().mockResolvedValue(undefined),
  download: jest.fn().mockResolvedValue(Buffer.from('')),
  delete: jest.fn().mockResolvedValue(undefined),
  getSignedUrl: jest.fn().mockResolvedValue('https://mock-signed-url'),
  getPublicUrl: jest.fn((name: string) => `https://mock-bucket/${name}`),
  isConnected: jest.fn().mockResolvedValue(true),
};

const fakeRequest = {
  ip: '127.0.0.1',
  headers: { 'user-agent': 'IntegrationTest/1.0' },
} as unknown as Request;

describe('AuditLog (integração TypeORM)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Metadados da entidade', () => {
    it('deve registrar a entidade AuditLog no DataSource', () => {
      const metadata = dataSource.getMetadata(AuditLog);
      expect(metadata).toBeDefined();
      expect(metadata.tableName).toBe('audit_logs');
    });

    it('deve expor todas as colunas esperadas na metadata', () => {
      const metadata = dataSource.getMetadata(AuditLog);
      const colunas = metadata.columns.map((c) => c.propertyName);

      expect(colunas).toContain('id');
      expect(colunas).toContain('userId');
      expect(colunas).toContain('tipoEvento');
      expect(colunas).toContain('recursoId');
      expect(colunas).toContain('status');
      expect(colunas).toContain('ipOrigem');
      expect(colunas).toContain('userAgent');
      expect(colunas).toContain('timestamp');
    });
  });

  describe('AuditLogService.registrar()', () => {
    it('deve persistir um registro em audit_logs com os campos corretos', async () => {
      const auditService = app.get(AuditLogService);
      const repo = dataSource.getRepository(AuditLog);

      const userId = 'e2e-test-user-' + Date.now();

      await auditService.registrar(
        TipoEventoAuditoria.LOGIN,
        userId,
        null,
        StatusAuditoria.SUCCESS,
        fakeRequest,
      );

      const registros = await repo.findBy({ userId });

      expect(registros).toHaveLength(1);
      expect(registros[0].tipoEvento).toBe(TipoEventoAuditoria.LOGIN);
      expect(registros[0].status).toBe(StatusAuditoria.SUCCESS);
      expect(registros[0].ipOrigem).toBe('127.0.0.1');
      expect(registros[0].userAgent).toBe('IntegrationTest/1.0');
      expect(registros[0].timestamp).toBeInstanceOf(Date);

      await repo.delete({ userId });
    });
  });
});
