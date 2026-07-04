import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of, throwError } from 'rxjs';
import { AuditInterceptor } from './audit.interceptor';
import { AuditLogService } from './audit-log.service';
import {
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../entities/audit-log/audit-log.entity';

const makeRequest = (user?: { id: string }) =>
  ({
    ip: '127.0.0.1',
    headers: { 'user-agent': 'Jest/1.0' },
    user: user ?? undefined,
  }) as any;

const makeExecutionContext = (request: any): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as unknown as ExecutionContext;

const makeCallHandler = (result: any, shouldThrow = false): CallHandler => ({
  handle: () =>
    shouldThrow ? throwError(() => result) : of(result),
});

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let reflector: Reflector;
  let auditLogService: jest.Mocked<AuditLogService>;

  beforeEach(() => {
    reflector = new Reflector();

    auditLogService = {
      registrar: jest.fn().mockResolvedValue(undefined),
    } as any;

    interceptor = new AuditInterceptor(reflector, auditLogService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('deve prosseguir sem auditar quando @Audit não está presente', (done) => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const ctx = makeExecutionContext(makeRequest());
    const handler = makeCallHandler({ ok: true });

    interceptor.intercept(ctx, handler).subscribe({
      next: (val) => {
        expect(val).toEqual({ ok: true });
      },
      complete: () => {
        expect(auditLogService.registrar).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('deve registrar SUCCESS com tipo simples (string) quando handler resolve', (done) => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(TipoEventoAuditoria.LOGIN);

    const request = makeRequest({ id: 'user-123' });
    const ctx = makeExecutionContext(request);
    const handler = makeCallHandler({ id: 'recurso-abc' });

    interceptor.intercept(ctx, handler).subscribe({
      complete: () => {
        expect(auditLogService.registrar).toHaveBeenCalledWith(
          TipoEventoAuditoria.LOGIN,
          'user-123',
          'recurso-abc',
          StatusAuditoria.SUCCESS,
          request,
        );
        done();
      },
    });
  });

  it('deve registrar FAILURE com o mesmo tipo quando handler rejeita e não há onFailure', (done) => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(TipoEventoAuditoria.LOGIN);

    const request = makeRequest();
    const ctx = makeExecutionContext(request);
    const error = new Error('Credenciais inválidas');
    const handler = makeCallHandler(error, true);

    interceptor.intercept(ctx, handler).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(auditLogService.registrar).toHaveBeenCalledWith(
          TipoEventoAuditoria.LOGIN,
          null,
          null,
          StatusAuditoria.FAILURE,
          request,
        );
        done();
      },
    });
  });

  it('deve usar onFailure distinto quando configurado via AuditConfig', (done) => {
    jest.spyOn(reflector, 'get').mockReturnValue({
      onSuccess: TipoEventoAuditoria.LOGIN,
      onFailure: TipoEventoAuditoria.LOGIN_FALHA,
    });

    const request = makeRequest({ id: 'user-456' });
    const ctx = makeExecutionContext(request);
    const error = new Error('Senha errada');
    const handler = makeCallHandler(error, true);

    interceptor.intercept(ctx, handler).subscribe({
      error: () => {
        expect(auditLogService.registrar).toHaveBeenCalledWith(
          TipoEventoAuditoria.LOGIN_FALHA,
          'user-456',
          null,
          StatusAuditoria.FAILURE,
          request,
        );
        done();
      },
    });
  });

  it('deve usar onSuccess do AuditConfig quando handler resolve', (done) => {
    jest.spyOn(reflector, 'get').mockReturnValue({
      onSuccess: TipoEventoAuditoria.LOGIN,
      onFailure: TipoEventoAuditoria.LOGIN_FALHA,
    });

    const request = makeRequest({ id: 'user-789' });
    const ctx = makeExecutionContext(request);
    const handler = makeCallHandler({ id: 'user-789', token: 'jwt...' });

    interceptor.intercept(ctx, handler).subscribe({
      complete: () => {
        expect(auditLogService.registrar).toHaveBeenCalledWith(
          TipoEventoAuditoria.LOGIN,
          'user-789',
          'user-789',
          StatusAuditoria.SUCCESS,
          request,
        );
        done();
      },
    });
  });

  it('deve passar userId null quando request.user não está presente', (done) => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(TipoEventoAuditoria.CRIACAO_USUARIO);

    const request = makeRequest();
    const ctx = makeExecutionContext(request);
    const handler = makeCallHandler({ id: 'novo-user-id' });

    interceptor.intercept(ctx, handler).subscribe({
      complete: () => {
        expect(auditLogService.registrar).toHaveBeenCalledWith(
          TipoEventoAuditoria.CRIACAO_USUARIO,
          null,
          'novo-user-id',
          StatusAuditoria.SUCCESS,
          request,
        );
        done();
      },
    });
  });

  it('deve re-lançar o erro original após registrar auditoria', (done) => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(TipoEventoAuditoria.ACESSO_NEGADO);

    const originalError = new Error('Forbidden');
    const request = makeRequest({ id: 'user-bad' });
    const ctx = makeExecutionContext(request);
    const handler = makeCallHandler(originalError, true);

    interceptor.intercept(ctx, handler).subscribe({
      error: (err) => {
        expect(err).toBe(originalError);
        expect(err.message).toBe('Forbidden');
        done();
      },
    });
  });

  it('deve passar recursoId null quando resposta não contém campo de id', (done) => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue(TipoEventoAuditoria.LOGIN);

    const request = makeRequest({ id: 'user-x' });
    const ctx = makeExecutionContext(request);
    const handler = makeCallHandler({ message: 'ok' });

    interceptor.intercept(ctx, handler).subscribe({
      complete: () => {
        expect(auditLogService.registrar).toHaveBeenCalledWith(
          TipoEventoAuditoria.LOGIN,
          'user-x',
          null,
          StatusAuditoria.SUCCESS,
          request,
        );
        done();
      },
    });
  });
});
