import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import type { Request } from 'express';
import { AuditLogService } from './audit-log.service';
import {
  AuditLog,
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../entities/audit-log/audit-log.entity';

const makeRequest = (overrides: Partial<{ ip: string; userAgent: string }> = {}): Request =>
  ({
    ip: overrides.ip ?? '192.168.0.1',
    headers: { 'user-agent': overrides.userAgent ?? 'TestAgent/1.0' },
  }) as unknown as Request;

const mockRepo = {
  create: jest.fn((data: Partial<AuditLog>) => ({ ...data })),
  save: jest.fn(),
};

describe('AuditLogService', () => {
  let service: AuditLogService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        { provide: getRepositoryToken(AuditLog), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  describe('registrar() — caminho feliz', () => {
    it('deve persistir o log e chamar logger.log em evento SUCCESS', async () => {
      mockRepo.save.mockResolvedValueOnce({});
      const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

      await service.registrar(
        TipoEventoAuditoria.LOGIN,
        'user-uuid-1',
        null,
        StatusAuditoria.SUCCESS,
        makeRequest(),
      );

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-uuid-1',
          tipoEvento: TipoEventoAuditoria.LOGIN,
          recursoId: null,
          status: StatusAuditoria.SUCCESS,
          ipOrigem: '192.168.0.1',
          userAgent: 'TestAgent/1.0',
        }),
      );
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy.mock.calls[0][0]).toContain('LOGIN');

      logSpy.mockRestore();
    });

    it('deve chamar logger.warn em evento FAILURE', async () => {
      mockRepo.save.mockResolvedValueOnce({});
      const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();

      await service.registrar(
        TipoEventoAuditoria.ACESSO_NEGADO,
        null,
        'recurso-abc',
        StatusAuditoria.FAILURE,
        makeRequest(),
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('ACESSO_NEGADO');

      warnSpy.mockRestore();
    });

    it('deve extrair ipOrigem e userAgent diretamente do request', async () => {
      mockRepo.save.mockResolvedValueOnce({});
      jest.spyOn(Logger.prototype, 'log').mockImplementation();

      await service.registrar(
        TipoEventoAuditoria.UPLOAD_ARQUIVO,
        'user-2',
        'arquivo-id',
        StatusAuditoria.SUCCESS,
        makeRequest({ ip: '10.0.0.5', userAgent: 'Mozilla/5.0' }),
      );

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ ipOrigem: '10.0.0.5', userAgent: 'Mozilla/5.0' }),
      );
    });
  });

  describe('registrar() — falha no repositório', () => {
    it('não deve propagar a exceção quando o save lança erro', async () => {
      mockRepo.save.mockRejectedValueOnce(new Error('DB connection lost'));
      jest.spyOn(Logger.prototype, 'log').mockImplementation();
      const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

      await expect(
        service.registrar(
          TipoEventoAuditoria.LOGIN,
          'user-3',
          null,
          StatusAuditoria.SUCCESS,
          makeRequest(),
        ),
      ).resolves.toBeUndefined();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls[0][0]).toContain('LOGIN');

      errorSpy.mockRestore();
    });
  });
});
