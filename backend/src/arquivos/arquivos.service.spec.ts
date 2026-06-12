import { ArquivosService } from './arquivos.service';
import { toArquivoResponse } from './dto/arquivo-response.dto';
import { Arquivo } from '../entities/arquivo.entity';

// ---------------------------------------------------------------------------
// Fábrica de entidade Arquivo com todos os campos preenchidos (incluindo o
// campo sensível caminhoStorage), para garantir que os testes validem a omissão.
// ---------------------------------------------------------------------------
const makeArquivoEntity = (overrides: Partial<Arquivo> = {}): Arquivo => ({
  id: 'uuid-arquivo-1',
  nomeOriginal: 'exame_sangue.pdf',
  nomeUnico: 'uuid-arquivo-1-exame_sangue.pdf',
  tipo: 'application/pdf',
  tamanho: 204800,
  caminhoStorage: 'https://storage.googleapis.com/bucket/uuid-arquivo-1-exame_sangue.pdf',
  dataUpload: new Date('2026-06-12T00:00:00Z'),
  pacienteId: 'uuid-paciente-1',
  paciente: {} as any,
  medicoUploadId: 'uuid-medico-1',
  medicoUpload: {} as any,
  ...overrides,
});

// ---------------------------------------------------------------------------
// Testes de segurança — critério exclusivo: caminhoStorage NUNCA na resposta
// ---------------------------------------------------------------------------
describe('ArquivosService — segurança do caminhoStorage', () => {
  let service: ArquivosService;

  beforeEach(() => {
    // Repositório não é necessário para testar o mapeamento; usamos um mock vazio.
    const mockRepository = {} as any;
    service = new ArquivosService(mockRepository);
  });

  describe('toPublicArquivo()', () => {
    it('deve omitir o campo caminhoStorage da resposta', () => {
      const arquivo = makeArquivoEntity();

      const result = service.toPublicArquivo(arquivo);

      expect(result).not.toHaveProperty('caminhoStorage');
    });

    it('deve preservar todos os demais campos públicos do arquivo', () => {
      const arquivo = makeArquivoEntity();

      const result = service.toPublicArquivo(arquivo);

      expect(result).toMatchObject({
        id: 'uuid-arquivo-1',
        nomeOriginal: 'exame_sangue.pdf',
        nomeUnico: 'uuid-arquivo-1-exame_sangue.pdf',
        tipo: 'application/pdf',
        tamanho: 204800,
        pacienteId: 'uuid-paciente-1',
        medicoUploadId: 'uuid-medico-1',
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Testes da função de mapeamento toArquivoResponse (mapper puro)
// ---------------------------------------------------------------------------
describe('toArquivoResponse() — mapper puro', () => {
  it('deve omitir o campo caminhoStorage', () => {
    const arquivo = makeArquivoEntity();

    const result = toArquivoResponse(arquivo);

    expect(result).not.toHaveProperty('caminhoStorage');
  });

  it('não deve vazar o valor do link de storage mesmo que populado', () => {
    const arquivo = makeArquivoEntity({
      caminhoStorage: 'https://storage.googleapis.com/bucket-secreto/arquivo-privado.pdf',
    });

    const result = toArquivoResponse(arquivo);

    expect(JSON.stringify(result)).not.toContain('bucket-secreto');
    expect(JSON.stringify(result)).not.toContain('arquivo-privado');
  });
});
