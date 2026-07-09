import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { ArquivosService } from './arquivos.service';
import { toArquivoResponse } from './dto/arquivo-response.dto';
import { Arquivo } from '../entities/arquivo.entity';
import {
  MedicoPaciente,
  StatusVinculo,
} from '../entities/medico-paciente.entity';
import { UserType } from '../entities/user.entity';

const makeArquivoEntity = (overrides: Partial<Arquivo> = {}): Arquivo => ({
  id: 'uuid-arquivo-1',
  nomeOriginal: 'exame_sangue.pdf',
  nomeUnico: 'uuid-gerado-exame_sangue.pdf',
  tipo: 'application/pdf',
  tamanho: 204800,
  descricao: null,
  caminhoStorage: 'https://storage.googleapis.com/bucket/uuid-gerado-exame_sangue.pdf',
  dataUpload: new Date('2026-06-12T00:00:00Z'),
  pacienteId: 'uuid-paciente-1',
  paciente: { user: { name: 'Paciente Teste' } } as any,
  medicoUploadId: 'uuid-medico-1',
  medicoUpload: { user: { name: 'Dr. Teste' } } as any,
  ...overrides,
});

const makeMulterFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File =>
  ({
    fieldname: 'arquivo',
    originalname: 'exame_sangue.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('conteudo fake do pdf'),
    size: 204800,
    ...overrides,
  }) as Express.Multer.File;

const mockRepo = <T extends ObjectLiteral>(
  overrides: Partial<Repository<T>> = {},
): Repository<T> =>
  ({
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    ...overrides,
  }) as unknown as Repository<T>;

const mockStorage = () => ({
  generateUniqueName: jest.fn(),
  upload: jest.fn(),
  download: jest.fn(),
  delete: jest.fn(),
  getSignedUrl: jest.fn(),
  getPublicUrl: jest.fn(),
});

describe('ArquivosService — segurança do caminhoStorage', () => {
  let service: ArquivosService;

  beforeEach(() => {
    const mockRepository = {} as any;
    service = new ArquivosService(mockRepository, mockRepository, mockStorage() as any);
  });

  it('toPublicArquivo deve omitir o caminhoStorage e nomeUnico', () => {
    const result = service.toPublicArquivo(makeArquivoEntity());
    expect(result).not.toHaveProperty('caminhoStorage');
    expect(result).not.toHaveProperty('nomeUnico');
  });

  it('toPublicArquivo deve preservar os demais campos públicos', () => {
    const result = service.toPublicArquivo(makeArquivoEntity());
    expect(result).toMatchObject({
      id: 'uuid-arquivo-1',
      nomeOriginal: 'exame_sangue.pdf',
      tipo: 'application/pdf',
      tamanho: 204800,
      pacienteId: 'uuid-paciente-1',
      medicoUploadId: 'uuid-medico-1',
    });
  });
});

describe('toArquivoResponse() — mapper puro', () => {
  it('nunca vaza o valor do caminho de storage no JSON', () => {
    const result = toArquivoResponse(
      makeArquivoEntity({
        caminhoStorage: 'https://storage.googleapis.com/bucket-secreto/arquivo-privado.pdf',
      }),
    );
    expect(JSON.stringify(result)).not.toContain('bucket-secreto');
    expect(JSON.stringify(result)).not.toContain('arquivo-privado');
  });
});

describe('ArquivosService.uploadArquivo()', () => {
  let service: ArquivosService;
  let arquivosRepo: ReturnType<typeof mockRepo<Arquivo>>;
  let medicoPacienteRepo: ReturnType<typeof mockRepo<MedicoPaciente>>;
  let storage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>();
    medicoPacienteRepo = mockRepo<MedicoPaciente>();
    storage = mockStorage();
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo, storage as any);
  });

  it('deve fazer upload com sucesso e omitir campos sensíveis no retorno', async () => {
    const file = makeMulterFile();
    const pacienteId = 'uuid-paciente-1';
    const medicoId = 'uuid-medico-1';
    const nomeUnico = 'uuid-gerado-exame.pdf';
    const urlGcs = 'https://storage.googleapis.com/bucket/uuid-gerado-exame.pdf';
    const arquivoSalvo = makeArquivoEntity({ nomeUnico, caminhoStorage: urlGcs });

    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({ medicoId, pacienteId });
    storage.generateUniqueName.mockReturnValue(nomeUnico);
    storage.upload.mockResolvedValue(undefined);
    storage.getPublicUrl.mockReturnValue(urlGcs);
    (arquivosRepo.create as jest.Mock).mockReturnValue(arquivoSalvo);
    (arquivosRepo.save as jest.Mock).mockResolvedValue(arquivoSalvo);

    const result = await service.uploadArquivo(file, pacienteId, medicoId);

    expect(medicoPacienteRepo.findOne).toHaveBeenCalledWith({
      where: { medicoId, pacienteId, status: StatusVinculo.APROVADO },
    });
    expect(storage.upload).toHaveBeenCalledWith(file.buffer, nomeUnico, file.mimetype);
    expect(arquivosRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nomeOriginal: file.originalname,
        nomeUnico,
        descricao: null,
        pacienteId,
        medicoUploadId: medicoId,
      }),
    );
    expect(result).not.toHaveProperty('caminhoStorage');
  });

  it('deve persistir a descrição trimada quando informada', async () => {
    const file = makeMulterFile();
    const arquivoSalvo = makeArquivoEntity({ descricao: 'Hemograma completo' });

    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    storage.generateUniqueName.mockReturnValue('uuid.pdf');
    storage.getPublicUrl.mockReturnValue('url');
    (arquivosRepo.create as jest.Mock).mockReturnValue(arquivoSalvo);
    (arquivosRepo.save as jest.Mock).mockResolvedValue(arquivoSalvo);

    await service.uploadArquivo(file, 'uuid-p', 'uuid-m', '  Hemograma completo  ');

    expect(arquivosRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ descricao: 'Hemograma completo' }),
    );
  });

  it('deve gravar null quando descrição vier apenas com espaços', async () => {
    const arquivoSalvo = makeArquivoEntity();
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    storage.generateUniqueName.mockReturnValue('uuid.pdf');
    storage.getPublicUrl.mockReturnValue('url');
    (arquivosRepo.create as jest.Mock).mockReturnValue(arquivoSalvo);
    (arquivosRepo.save as jest.Mock).mockResolvedValue(arquivoSalvo);

    await service.uploadArquivo(makeMulterFile(), 'uuid-p', 'uuid-m', '     ');

    expect(arquivosRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ descricao: null }),
    );
  });

  it('deve lançar ForbiddenException quando médico não tem vínculo aprovado', async () => {
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.uploadArquivo(makeMulterFile(), 'uuid-p', 'uuid-m'),
    ).rejects.toThrow(ForbiddenException);

    expect(storage.upload).not.toHaveBeenCalled();
    expect(arquivosRepo.save).not.toHaveBeenCalled();
  });

  it('vínculo PENDENTE também bloqueia upload (findOne com status APROVADO retorna null)', async () => {
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.uploadArquivo(makeMulterFile(), 'uuid-p', 'uuid-m'),
    ).rejects.toThrow(ForbiddenException);
  });
});

describe('ArquivosService — listagens', () => {
  let service: ArquivosService;
  let arquivosRepo: ReturnType<typeof mockRepo<Arquivo>>;
  let medicoPacienteRepo: ReturnType<typeof mockRepo<MedicoPaciente>>;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>();
    medicoPacienteRepo = mockRepo<MedicoPaciente>();
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo, mockStorage() as any);
  });

  it('listarParaPaciente retorna apenas os arquivos do paciente informado', async () => {
    (arquivosRepo.find as jest.Mock).mockResolvedValueOnce([
      makeArquivoEntity({ pacienteId: 'uuid-paciente-1' }),
    ]);

    const result = await service.listarParaPaciente('uuid-paciente-1');

    expect(arquivosRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { pacienteId: 'uuid-paciente-1' } }),
    );
    expect(result).toHaveLength(1);
    expect(result[0].pacienteNome).toBe('Paciente Teste');
    expect(result[0]).not.toHaveProperty('caminhoStorage');
  });

  it('listarParaMedico ignora arquivos de pacientes não vinculados', async () => {
    (medicoPacienteRepo.find as jest.Mock).mockResolvedValueOnce([
      { pacienteId: 'uuid-paciente-vinculado' },
    ]);
    (arquivosRepo.find as jest.Mock).mockResolvedValueOnce([
      makeArquivoEntity({ pacienteId: 'uuid-paciente-vinculado' }),
    ]);

    const result = await service.listarParaMedico('uuid-medico-1');

    expect(result.every((a) => a.pacienteId === 'uuid-paciente-vinculado')).toBe(true);
    expect(medicoPacienteRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { medicoId: 'uuid-medico-1', status: StatusVinculo.APROVADO },
      }),
    );
    expect(arquivosRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [{ pacienteId: 'uuid-paciente-vinculado', medicoUploadId: 'uuid-medico-1' }],
      }),
    );
  });

  it('listarParaMedico retorna [] se o médico não tem vínculos (early return)', async () => {
    (medicoPacienteRepo.find as jest.Mock).mockResolvedValueOnce([]);

    const result = await service.listarParaMedico('uuid-medico-sem-vinculos');

    expect(result).toEqual([]);
    expect(arquivosRepo.find).not.toHaveBeenCalled();
  });

  it('listarProntuarioPaciente exige vínculo com o paciente', async () => {
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.listarProntuarioPaciente('uuid-m', 'uuid-p'),
    ).rejects.toThrow(ForbiddenException);
  });
});

describe('ArquivosService.gerarUrlDownload()', () => {
  let service: ArquivosService;
  let arquivosRepo: ReturnType<typeof mockRepo<Arquivo>>;
  let medicoPacienteRepo: ReturnType<typeof mockRepo<MedicoPaciente>>;
  let storage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>();
    medicoPacienteRepo = mockRepo<MedicoPaciente>();
    storage = mockStorage();
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo, storage as any);
  });

  it('paciente dono do arquivo recebe URL assinada', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ pacienteId: 'uuid-p-1', nomeUnico: 'gcs.pdf' }),
    );
    storage.getSignedUrl.mockResolvedValue('https://signed.url');

    const result = await service.gerarUrlDownload('uuid-a', 'uuid-p-1', UserType.PACIENTE);

    expect(storage.getSignedUrl).toHaveBeenCalledWith('gcs.pdf', 15 * 60);
    expect(result.url).toBe('https://signed.url');
    expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('paciente de outro cadastro é bloqueado com 403', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ pacienteId: 'uuid-p-1' }),
    );

    await expect(
      service.gerarUrlDownload('uuid-a', 'uuid-p-2', UserType.PACIENTE),
    ).rejects.toThrow(ForbiddenException);

    expect(storage.getSignedUrl).not.toHaveBeenCalled();
  });

  it('médico com vínculo consegue baixar (mesmo sem ser dono do upload)', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ pacienteId: 'uuid-p-1', medicoUploadId: 'outro-medico' }),
    );
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    storage.getSignedUrl.mockResolvedValue('https://signed.url');

    const result = await service.gerarUrlDownload('uuid-a', 'uuid-m-1', UserType.MEDICO);

    expect(result.url).toBe('https://signed.url');
  });

  it('médico sem vínculo é bloqueado com 403', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(makeArquivoEntity());
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.gerarUrlDownload('uuid-a', 'uuid-m-2', UserType.MEDICO),
    ).rejects.toThrow(ForbiddenException);
  });

  it('id inexistente lança 404', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.gerarUrlDownload('uuid-inexistente', 'uuid-p', UserType.PACIENTE),
    ).rejects.toThrow(NotFoundException);
  });
});

describe('ArquivosService.atualizarDescricao()', () => {
  let service: ArquivosService;
  let arquivosRepo: ReturnType<typeof mockRepo<Arquivo>>;
  let medicoPacienteRepo: ReturnType<typeof mockRepo<MedicoPaciente>>;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>();
    medicoPacienteRepo = mockRepo<MedicoPaciente>();
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo, mockStorage() as any);
  });

  it('médico dono do upload atualiza descrição com sucesso', async () => {
    const arquivo = makeArquivoEntity({ medicoUploadId: 'uuid-m-1', descricao: 'antiga' });
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(arquivo);
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    (arquivosRepo.save as jest.Mock).mockImplementation((a) => Promise.resolve(a));

    const result = await service.atualizarDescricao('uuid-a', 'uuid-m-1', {
      descricao: '  Nova descrição  ',
    });

    expect(arquivosRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ descricao: 'Nova descrição' }),
    );
    expect(result.descricao).toBe('Nova descrição');
  });

  it('médico que não subiu o arquivo recebe 403', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ medicoUploadId: 'uuid-outro-medico' }),
    );

    await expect(
      service.atualizarDescricao('uuid-a', 'uuid-m-1', { descricao: 'x' }),
    ).rejects.toThrow(ForbiddenException);

    expect(arquivosRepo.save).not.toHaveBeenCalled();
  });

  it('descrição vazia é gravada como null', async () => {
    const arquivo = makeArquivoEntity({ medicoUploadId: 'uuid-m-1', descricao: 'antes' });
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(arquivo);
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    (arquivosRepo.save as jest.Mock).mockImplementation((a) => Promise.resolve(a));

    const result = await service.atualizarDescricao('uuid-a', 'uuid-m-1', { descricao: '   ' });

    expect(result.descricao).toBeNull();
  });

  it('médico revogado (sem vínculo aprovado) não pode editar descrição do próprio upload', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ medicoUploadId: 'uuid-m-1' }),
    );
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.atualizarDescricao('uuid-a', 'uuid-m-1', { descricao: 'x' }),
    ).rejects.toThrow(ForbiddenException);

    expect(arquivosRepo.save).not.toHaveBeenCalled();
  });
});

describe('ArquivosService.excluirArquivo()', () => {
  let service: ArquivosService;
  let arquivosRepo: ReturnType<typeof mockRepo<Arquivo>>;
  let medicoPacienteRepo: ReturnType<typeof mockRepo<MedicoPaciente>>;
  let storage: ReturnType<typeof mockStorage>;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>();
    medicoPacienteRepo = mockRepo<MedicoPaciente>();
    storage = mockStorage();
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo, storage as any);
  });

  it('médico dono remove: chama storage.delete antes do repo.delete', async () => {
    const arquivo = makeArquivoEntity({ medicoUploadId: 'uuid-m-1', nomeUnico: 'stored.pdf' });
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(arquivo);
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    storage.delete.mockResolvedValue(undefined);
    (arquivosRepo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

    const chamadas: string[] = [];
    storage.delete.mockImplementation(() => {
      chamadas.push('storage');
      return Promise.resolve();
    });
    (arquivosRepo.delete as jest.Mock).mockImplementation(() => {
      chamadas.push('repo');
      return Promise.resolve({ affected: 1 });
    });

    await service.excluirArquivo('uuid-a', 'uuid-m-1');

    expect(chamadas).toEqual(['storage', 'repo']);
    expect(storage.delete).toHaveBeenCalledWith('stored.pdf');
    expect(arquivosRepo.delete).toHaveBeenCalledWith({ id: arquivo.id });
  });

  it('médico não-dono recebe 403 e nada é apagado', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ medicoUploadId: 'uuid-outro' }),
    );

    await expect(
      service.excluirArquivo('uuid-a', 'uuid-m-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(storage.delete).not.toHaveBeenCalled();
    expect(arquivosRepo.delete).not.toHaveBeenCalled();
  });

  it('se storage.delete falhar, o registro não é removido do banco (rollback lógico)', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ medicoUploadId: 'uuid-m-1' }),
    );
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue({});
    storage.delete.mockRejectedValue(new Error('S3 timeout'));

    await expect(
      service.excluirArquivo('uuid-a', 'uuid-m-1'),
    ).rejects.toThrow('S3 timeout');

    expect(arquivosRepo.delete).not.toHaveBeenCalled();
  });

  it('id inexistente lança 404', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.excluirArquivo('uuid-inexistente', 'uuid-m-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('médico revogado não pode excluir seu próprio upload', async () => {
    (arquivosRepo.findOne as jest.Mock).mockResolvedValue(
      makeArquivoEntity({ medicoUploadId: 'uuid-m-1' }),
    );
    (medicoPacienteRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.excluirArquivo('uuid-a', 'uuid-m-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(storage.delete).not.toHaveBeenCalled();
    expect(arquivosRepo.delete).not.toHaveBeenCalled();
  });
});
