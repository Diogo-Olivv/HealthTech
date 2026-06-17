import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { promises as fs } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { extname, join, resolve } from 'node:path';

type StorageDriver = 'gcs' | 'local';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly driver: StorageDriver;

  // GCS state
  private readonly storage = new Storage();
  private readonly bucketName: string;
  private bucket?: Bucket;

  // Local state
  private localDir?: string;

  constructor(private config: ConfigService) {
    const driver = (
      this.config.get<string>('STORAGE_DRIVER') ?? 'gcs'
    ).toLowerCase();
    this.driver = driver === 'local' ? 'local' : 'gcs';
    this.bucketName = this.config.get<string>('GCS_BUCKET_NAME', '');
  }

  async onModuleInit(): Promise<void> {
    if (this.driver === 'local') {
      this.localDir = resolve(
        this.config.get<string>('LOCAL_STORAGE_DIR') ?? 'uploads',
      );
      await fs.mkdir(this.localDir, { recursive: true });
      this.logger.log(`Storage driver: local (${this.localDir})`);
      return;
    }

    if (!this.bucketName) {
      throw new Error('GCS_BUCKET_NAME não configurado');
    }
    this.bucket = this.storage.bucket(this.bucketName);
    this.logger.log(`Storage driver: gcs (${this.bucketName})`);
  }

  generateUniqueName(originalName: string): string {
    const ext = extname(originalName);
    return `${randomUUID()}${ext}`;
  }

  async upload(
    buffer: Buffer,
    uniqueName: string,
    contentType: string,
  ): Promise<void> {
    if (this.driver === 'local') {
      try {
        await fs.writeFile(join(this.localDir!, uniqueName), buffer);
      } catch (err) {
        const e = err as Error;
        this.logger.error(
          `Local upload falhou (${uniqueName}): ${e.message}`,
          e.stack,
        );
        throw new InternalServerErrorException(
          'Falha ao enviar arquivo para o armazenamento',
        );
      }
      return;
    }

    try {
      await this.bucket!.file(uniqueName).save(buffer, { contentType });
    } catch (err) {
      const e = err as Error;
      this.logger.error(
        `GCS upload falhou (${uniqueName}): ${e.message}`,
        e.stack,
      );
      throw new InternalServerErrorException(
        'Falha ao enviar arquivo para o armazenamento',
      );
    }
  }

  async download(uniqueName: string): Promise<Buffer> {
    if (this.driver === 'local') {
      try {
        return await fs.readFile(join(this.localDir!, uniqueName));
      } catch (err) {
        const e = err as Error;
        this.logger.error(
          `Local download falhou (${uniqueName}): ${e.message}`,
          e.stack,
        );
        throw new InternalServerErrorException(
          'Falha ao baixar arquivo do armazenamento',
        );
      }
    }

    try {
      const [contents] = await this.bucket!.file(uniqueName).download();
      return contents;
    } catch (err) {
      const e = err as Error;
      this.logger.error(
        `GCS download falhou (${uniqueName}): ${e.message}`,
        e.stack,
      );
      throw new InternalServerErrorException(
        'Falha ao baixar arquivo do armazenamento',
      );
    }
  }

  async delete(uniqueName: string): Promise<void> {
    if (this.driver === 'local') {
      try {
        await fs.unlink(join(this.localDir!, uniqueName));
      } catch (err) {
        const e = err as Error;
        this.logger.error(
          `Local delete falhou (${uniqueName}): ${e.message}`,
          e.stack,
        );
        throw new InternalServerErrorException(
          'Falha ao excluir arquivo do armazenamento',
        );
      }
      return;
    }

    try {
      await this.bucket!.file(uniqueName).delete();
    } catch (err) {
      const e = err as Error;
      this.logger.error(
        `GCS delete falhou (${uniqueName}): ${e.message}`,
        e.stack,
      );
      throw new InternalServerErrorException(
        'Falha ao excluir arquivo do armazenamento',
      );
    }
  }

  async getSignedUrl(uniqueName: string, ttlSeconds = 900): Promise<string> {
    if (this.driver === 'local') {
      // Driver local não tem URL assinada — devolve o caminho local.
      return join(this.localDir!, uniqueName);
    }

    try {
      const [url] = await this.bucket!.file(uniqueName).getSignedUrl({
        action: 'read',
        expires: Date.now() + ttlSeconds * 1000,
      });
      return url;
    } catch (err) {
      const e = err as Error;
      this.logger.error(
        `GCS signed URL falhou (${uniqueName}): ${e.message}`,
        e.stack,
      );
      throw new InternalServerErrorException(
        'Falha ao gerar URL de acesso ao arquivo',
      );
    }
  }

  getPublicUrl(uniqueName: string): string {
    if (this.driver === 'local') {
      return `local://${uniqueName}`;
    }
    return `https://storage.googleapis.com/${this.bucketName}/${uniqueName}`;
  }

  async isConnected(): Promise<boolean> {
    if (this.driver === 'local') {
      try {
        await fs.access(this.localDir!);
        return true;
      } catch {
        return false;
      }
    }

    if (!this.bucket) return false;
    try {
      const [exists] = await this.bucket.exists();
      return exists;
    } catch (err) {
      const e = err as Error;
      this.logger.warn(`GCS bucket check falhou: ${e.message}`);
      return false;
    }
  }
}
