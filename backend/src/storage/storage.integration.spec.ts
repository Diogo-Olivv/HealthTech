/**
 * Teste de integração com GCS real.
 * Só executa se GCS_BUCKET_NAME estiver definido no ambiente.
 * Para rodar localmente: GCS_BUCKET_NAME=meu-bucket npm test
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

const RUN_INTEGRATION = !!process.env.GCS_BUCKET_NAME;

(RUN_INTEGRATION ? describe : describe.skip)(
  'StorageService - Integração (requer GCS real)',
  () => {
    let service: StorageService;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          StorageService,
          {
            provide: ConfigService,
            useValue: {
              get: (key: string, def = '') =>
                key === 'GCS_BUCKET_NAME' ? process.env.GCS_BUCKET_NAME : def,
            },
          },
        ],
      }).compile();

      service = module.get<StorageService>(StorageService);
    });

    it('deve fazer upload e download de um arquivo real no GCS', async () => {
      const conteudo = Buffer.from('conteudo de teste - integracao');
      const uniqueName = service.generateUniqueName('teste-integracao.txt');

      await service.upload(conteudo, uniqueName, 'text/plain');
      const baixado = await service.download(uniqueName);

      expect(baixado.toString()).toBe(conteudo.toString());

      await service.delete(uniqueName);
    });

    it('deve confirmar que o arquivo foi removido após delete', async () => {
      const uniqueName = service.generateUniqueName('delete-test.txt');
      await service.upload(Buffer.from('x'), uniqueName, 'text/plain');
      await service.delete(uniqueName);

      await expect(service.download(uniqueName)).rejects.toThrow();
    });

    it('deve gerar nomes únicos para cada arquivo', () => {
      const nomeA = service.generateUniqueName('arquivo.pdf');
      const nomeB = service.generateUniqueName('arquivo.pdf');
      expect(nomeA).not.toBe(nomeB);
    });

    it('deve reportar bucket como conectado', async () => {
      expect(await service.isConnected()).toBe(true);
    });
  },
);
