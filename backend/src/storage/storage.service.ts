import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storage = new Storage();
  private readonly bucketName: string;

  constructor(private config: ConfigService) {
    this.bucketName = this.config.get<string>('GCS_BUCKET_NAME', '');
  }

  async uploadFile(buffer: Buffer, destination: string, contentType: string): Promise<string> {
    if (!this.bucketName) throw new Error('GCS_BUCKET_NAME is not configured');
    const file = this.storage.bucket(this.bucketName).file(destination);
    await file.save(buffer, { contentType });
    return `https://storage.googleapis.com/${this.bucketName}/${destination}`;
  }

  async isConnected(): Promise<boolean> {
    if (!this.bucketName) return false;
    try {
      const [exists] = await this.storage.bucket(this.bucketName).exists();
      return exists;
    } catch {
      this.logger.warn('GCS bucket check failed');
      return false;
    }
  }
}
