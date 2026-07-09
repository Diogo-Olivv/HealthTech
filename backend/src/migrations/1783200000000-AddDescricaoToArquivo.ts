import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescricaoToArquivo1783200000000 implements MigrationInterface {
  name = 'AddDescricaoToArquivo1783200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "arquivos"
      ADD COLUMN IF NOT EXISTS "descricao" varchar(200) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "arquivos"
      DROP COLUMN IF EXISTS "descricao"
    `);
  }
}
