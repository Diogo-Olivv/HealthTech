import { AuditLog, TipoEventoAuditoria, StatusAuditoria } from './audit-log.entity';

describe('AuditLog entity', () => {
  it('deve aceitar todos os campos e ser serializável para JSON', () => {
    const log = new AuditLog();
    log.id = 'b1e2c3d4-0000-0000-0000-000000000001';
    log.userId = 'a1b2c3d4-0000-0000-0000-000000000002';
    log.tipoEvento = TipoEventoAuditoria.LOGIN;
    log.recursoId = 'resource-abc';
    log.status = StatusAuditoria.SUCCESS;
    log.ipOrigem = '192.168.0.1';
    log.userAgent = 'Mozilla/5.0';
    log.timestamp = new Date('2026-01-01T00:00:00.000Z');

    const serialized = JSON.stringify(log);
    const parsed = JSON.parse(serialized) as AuditLog;

    expect(parsed.id).toBe(log.id);
    expect(parsed.userId).toBe(log.userId);
    expect(parsed.tipoEvento).toBe(TipoEventoAuditoria.LOGIN);
    expect(parsed.recursoId).toBe(log.recursoId);
    expect(parsed.status).toBe(StatusAuditoria.SUCCESS);
    expect(parsed.ipOrigem).toBe(log.ipOrigem);
    expect(parsed.userAgent).toBe(log.userAgent);
  });

  it('deve aceitar userId e recursoId nulos', () => {
    const log = new AuditLog();
    log.userId = null;
    log.tipoEvento = TipoEventoAuditoria.ACESSO_NEGADO;
    log.recursoId = null;
    log.status = StatusAuditoria.FAILURE;
    log.ipOrigem = '10.0.0.1';
    log.userAgent = null;

    const serialized = JSON.stringify(log);
    const parsed = JSON.parse(serialized) as AuditLog;

    expect(parsed.userId).toBeNull();
    expect(parsed.recursoId).toBeNull();
    expect(parsed.userAgent).toBeNull();
  });

  it('deve conter todos os valores do enum TipoEventoAuditoria', () => {
    const valores = Object.values(TipoEventoAuditoria);
    expect(valores).toContain('LOGIN');
    expect(valores).toContain('LOGOUT');
    expect(valores).toContain('LOGIN_FALHA');
    expect(valores).toContain('UPLOAD_ARQUIVO');
    expect(valores).toContain('DOWNLOAD_ARQUIVO');
    expect(valores).toContain('ACESSO_NEGADO');
    expect(valores).toContain('TENTATIVA_ESCALONAMENTO_PRIVILEGIO');
  });

  it('deve conter os valores SUCCESS e FAILURE no enum StatusAuditoria', () => {
    expect(Object.values(StatusAuditoria)).toEqual(
      expect.arrayContaining(['SUCCESS', 'FAILURE']),
    );
  });
});
