import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StorageService } from '../storage/storage.service';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  async check() {
    const timeout = <T>(promise: Promise<T>, ms: number) =>
      Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

    const [db, gcs] = await Promise.allSettled([
      timeout(this.dataSource.query('SELECT 1'), 3000),
      timeout(this.storageService.isConnected(), 5000),
    ]);

    const dbOk = db.status === 'fulfilled';
    const gcsOk = gcs.status === 'fulfilled' && gcs.value === true;

    const body = {
      status: dbOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbOk ? 'ok' : 'error',
        storage: gcsOk ? 'ok' : 'unavailable',
      },
    };

    if (!dbOk) throw new HttpException(body, HttpStatus.SERVICE_UNAVAILABLE);
    return body;
  }
}
