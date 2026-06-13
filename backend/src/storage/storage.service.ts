import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storage = new Storage();
  private readonly bucketName: string;

  constructor(private config: ConfigService) {
    this.bucketName = this.config.get<string>('GCS_BUCKET_NAME', '');
  }

  generateUniqueName(originalName: string): string {
    const ext = extname(originalName);
    return `${randomUUID()}${ext}`;
  }

  async upload(buffer: Buffer, uniqueName: string, contentType = 'application/octet-stream'): Promise<string> {
    this.assertBucketConfigured();
    try {
      const file = this.storage.bucket(this.bucketName).file(uniqueName);
      await file.save(buffer, { contentType });
      return `https://storage.googleapis.com/${this.bucketName}/${uniqueName}`;
    } catch (err) {
      this.logger.error('GCS upload falhou', { uniqueName, message: (err as Error).message });
      throw new InternalServerErrorException('Falha ao enviar arquivo para o armazenamento');
    }
  }

  async download(uniqueName: string): Promise<Buffer> {
    this.assertBucketConfigured();
    try {
      const [contents] = await this.storage.bucket(this.bucketName).file(uniqueName).download();
      return contents;
    } catch (err) {
      this.logger.error('GCS download falhou', { uniqueName, message: (err as Error).message });
      throw new InternalServerErrorException('Falha ao baixar arquivo do armazenamento');
    }
  }

  async delete(uniqueName: string): Promise<void> {
    this.assertBucketConfigured();
    try {
      await this.storage.bucket(this.bucketName).file(uniqueName).delete();
    } catch (err) {
      this.logger.error('GCS delete falhou', { uniqueName, message: (err as Error).message });
      throw new InternalServerErrorException('Falha ao excluir arquivo do armazenamento');
    }
  }

  async isConnected(): Promise<boolean> {
    if (!this.bucketName) return false;
    try {
      const [exists] = await this.storage.bucket(this.bucketName).exists();
      return exists;
    } catch {
      this.logger.warn('GCS bucket check falhou');
      return false;
    }
  }

  private assertBucketConfigured(): void {
    if (!this.bucketName) {
      throw new InternalServerErrorException('GCS_BUCKET_NAME não configurado');
    }
  }
}
