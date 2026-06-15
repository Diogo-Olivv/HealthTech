import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arquivo } from '../entities/arquivo.entity';
import { ArquivosController } from './arquivos.controller';
import { ArquivosService } from './arquivos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Arquivo])],
  controllers: [ArquivosController],
  providers: [ArquivosService],
  exports: [ArquivosService],
})
export class ArquivosModule {}
