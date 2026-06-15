import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly storage = new Storage();
  private readonly bucketName: string;
  private bucket!: Bucket;

  constructor(private config: ConfigService) {
    this.bucketName = this.config.get<string>('GCS_BUCKET_NAME', '');
  }

  onModuleInit(): void {
    if (!this.bucketName) {
      throw new Error('GCS_BUCKET_NAME não configurado');
    }
    this.bucket = this.storage.bucket(this.bucketName);
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
    try {
      await this.bucket.file(uniqueName).save(buffer, { contentType });
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
    try {
      const [contents] = await this.bucket.file(uniqueName).download();
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
    try {
      await this.bucket.file(uniqueName).delete();
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
    try {
      const [url] = await this.bucket.file(uniqueName).getSignedUrl({
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
    return `https://storage.googleapis.com/${this.bucketName}/${uniqueName}`;
  }

  async isConnected(): Promise<boolean> {
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
