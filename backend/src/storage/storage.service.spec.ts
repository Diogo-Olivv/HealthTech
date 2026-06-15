import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

const mockSave = jest.fn();
const mockDownload = jest.fn();
const mockGcsDelete = jest.fn();
const mockExists = jest.fn();
const mockGetSignedUrl = jest.fn();
const mockFile = jest.fn(() => ({
  save: mockSave,
  download: mockDownload,
  delete: mockGcsDelete,
  getSignedUrl: mockGetSignedUrl,
}));
const mockBucket = jest.fn(() => ({ file: mockFile, exists: mockExists }));

jest.mock('@google-cloud/storage', () => ({
  Storage: jest.fn().mockImplementation(() => ({ bucket: mockBucket })),
}));

const makeService = async (
  bucketName = 'test-bucket',
): Promise<StorageService> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      StorageService,
      {
        provide: ConfigService,
        useValue: {
          get: (key: string, def = '') =>
            key === 'GCS_BUCKET_NAME' ? bucketName : def,
        },
      },
    ],
  }).compile();
  const service = module.get<StorageService>(StorageService);
  service.onModuleInit();
  return service;
};

describe('StorageService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('onModuleInit()', () => {
    it('deve lançar erro no boot se GCS_BUCKET_NAME não estiver configurado', async () => {
      await expect(makeService('')).rejects.toThrow(
        'GCS_BUCKET_NAME não configurado',
      );
    });
  });

  describe('generateUniqueName()', () => {
    it('deve gerar nomes únicos para cada chamada', async () => {
      const service = await makeService();
      const nomeA = service.generateUniqueName('foto.jpg');
      const nomeB = service.generateUniqueName('foto.jpg');
      expect(nomeA).not.toBe(nomeB);
    });

    it('deve preservar a extensão do arquivo original', async () => {
      const service = await makeService();
      expect(service.generateUniqueName('exame.pdf')).toMatch(/\.pdf$/);
      expect(service.generateUniqueName('imagem.png')).toMatch(/\.png$/);
    });

    it('deve lidar com arquivo sem extensão', async () => {
      const service = await makeService();
      const nome = service.generateUniqueName('arquivo');
      expect(nome).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });

  describe('upload()', () => {
    it('deve salvar o buffer no GCS com o contentType informado', async () => {
      const service = await makeService();
      mockSave.mockResolvedValue(undefined);

      await service.upload(Buffer.from('dados'), 'uuid-123.jpg', 'image/jpeg');

      expect(mockFile).toHaveBeenCalledWith('uuid-123.jpg');
      expect(mockSave).toHaveBeenCalledWith(Buffer.from('dados'), {
        contentType: 'image/jpeg',
      });
    });

    it('deve lançar InternalServerErrorException em falha de comunicação com GCS', async () => {
      const service = await makeService();
      mockSave.mockRejectedValue(new Error('network error'));

      await expect(
        service.upload(Buffer.from('x'), 'file.jpg', 'image/jpeg'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('download()', () => {
    it('deve retornar o buffer do arquivo baixado do GCS', async () => {
      const service = await makeService();
      const conteudo = Buffer.from('conteudo do arquivo');
      mockDownload.mockResolvedValue([conteudo]);

      const result = await service.download('uuid-123.jpg');

      expect(mockFile).toHaveBeenCalledWith('uuid-123.jpg');
      expect(result).toEqual(conteudo);
    });

    it('deve lançar InternalServerErrorException em falha de comunicação com GCS', async () => {
      const service = await makeService();
      mockDownload.mockRejectedValue(new Error('arquivo não encontrado'));

      await expect(service.download('uuid-123.jpg')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete()', () => {
    it('deve chamar GCS delete com o uniqueName correto', async () => {
      const service = await makeService();
      mockGcsDelete.mockResolvedValue(undefined);

      await service.delete('uuid-123.jpg');

      expect(mockFile).toHaveBeenCalledWith('uuid-123.jpg');
      expect(mockGcsDelete).toHaveBeenCalled();
    });

    it('deve lançar InternalServerErrorException em falha de comunicação com GCS', async () => {
      const service = await makeService();
      mockGcsDelete.mockRejectedValue(new Error('permission denied'));

      await expect(service.delete('uuid-123.jpg')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getSignedUrl()', () => {
    it('deve gerar URL assinada com TTL padrão de 900s', async () => {
      const service = await makeService();
      const fakeUrl = 'https://signed.example/uuid-123.jpg?sig=abc';
      mockGetSignedUrl.mockResolvedValue([fakeUrl]);
      const before = Date.now();

      const url = await service.getSignedUrl('uuid-123.jpg');

      expect(mockFile).toHaveBeenCalledWith('uuid-123.jpg');
      const args = mockGetSignedUrl.mock.calls[0][0];
      expect(args.action).toBe('read');
      expect(args.expires).toBeGreaterThanOrEqual(before + 900 * 1000);
      expect(args.expires).toBeLessThanOrEqual(Date.now() + 900 * 1000 + 50);
      expect(url).toBe(fakeUrl);
    });

    it('deve respeitar TTL customizado', async () => {
      const service = await makeService();
      mockGetSignedUrl.mockResolvedValue(['url']);
      const before = Date.now();

      await service.getSignedUrl('x.jpg', 60);

      const args = mockGetSignedUrl.mock.calls[0][0];
      expect(args.expires).toBeGreaterThanOrEqual(before + 60 * 1000);
      expect(args.expires).toBeLessThanOrEqual(Date.now() + 60 * 1000 + 50);
    });

    it('deve lançar InternalServerErrorException em falha do GCS', async () => {
      const service = await makeService();
      mockGetSignedUrl.mockRejectedValue(new Error('iam denied'));

      await expect(service.getSignedUrl('x.jpg')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getPublicUrl()', () => {
    it('deve montar a URL pública canônica do GCS', async () => {
      const service = await makeService();
      expect(service.getPublicUrl('uuid-123.jpg')).toBe(
        'https://storage.googleapis.com/test-bucket/uuid-123.jpg',
      );
    });
  });

  describe('isConnected()', () => {
    it('deve retornar true se o bucket existir no GCS', async () => {
      const service = await makeService();
      mockExists.mockResolvedValue([true]);
      expect(await service.isConnected()).toBe(true);
    });

    it('deve retornar false se o bucket não existir no GCS', async () => {
      const service = await makeService();
      mockExists.mockResolvedValue([false]);
      expect(await service.isConnected()).toBe(false);
    });

    it('deve retornar false em falha de comunicação (timeout, auth)', async () => {
      const service = await makeService();
      mockExists.mockRejectedValue(new Error('timeout'));
      expect(await service.isConnected()).toBe(false);
    });
  });
});
