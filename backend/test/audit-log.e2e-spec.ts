import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AuditLog } from '../src/entities/audit-log/audit-log.entity';
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
