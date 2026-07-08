import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLoginFalhaEnum1783000000000 implements MigrationInterface {
  name = 'RemoveLoginFalhaEnum1783000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "audit_logs"
      SET "tipoEvento" = 'LOGIN'
      WHERE "tipoEvento" = 'LOGIN_FALHA'
    `);

    await queryRunner.query(`
      CREATE TYPE "audit_logs_tipoevento_enum_new" AS ENUM (
        'LOGIN',
        'LOGOUT',
        'CRIACAO_USUARIO',
        'ATUALIZACAO_USUARIO',
        'EXCLUSAO_USUARIO',
        'UPLOAD_ARQUIVO',
        'DOWNLOAD_ARQUIVO',
        'VISUALIZACAO_ARQUIVO',
        'EXCLUSAO_ARQUIVO',
        'VINCULO_MEDICO_PACIENTE',
        'DESVINCULO_MEDICO_PACIENTE',
        'ACESSO_NEGADO',
        'TENTATIVA_ESCALONAMENTO_PRIVILEGIO'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "audit_logs"
      ALTER COLUMN "tipoEvento" TYPE "audit_logs_tipoevento_enum_new"
      USING "tipoEvento"::text::"audit_logs_tipoevento_enum_new"
    `);

    await queryRunner.query(`DROP TYPE "audit_logs_tipoevento_enum"`);
    await queryRunner.query(`
      ALTER TYPE "audit_logs_tipoevento_enum_new"
      RENAME TO "audit_logs_tipoevento_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "audit_logs_tipoevento_enum_old" AS ENUM (
        'LOGIN',
        'LOGOUT',
        'LOGIN_FALHA',
        'CRIACAO_USUARIO',
        'ATUALIZACAO_USUARIO',
        'EXCLUSAO_USUARIO',
        'UPLOAD_ARQUIVO',
        'DOWNLOAD_ARQUIVO',
        'VISUALIZACAO_ARQUIVO',
        'EXCLUSAO_ARQUIVO',
        'VINCULO_MEDICO_PACIENTE',
        'DESVINCULO_MEDICO_PACIENTE',
        'ACESSO_NEGADO',
        'TENTATIVA_ESCALONAMENTO_PRIVILEGIO'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "audit_logs"
      ALTER COLUMN "tipoEvento" TYPE "audit_logs_tipoevento_enum_old"
      USING "tipoEvento"::text::"audit_logs_tipoevento_enum_old"
    `);

    await queryRunner.query(`DROP TYPE "audit_logs_tipoevento_enum"`);
    await queryRunner.query(`
      ALTER TYPE "audit_logs_tipoevento_enum_old"
      RENAME TO "audit_logs_tipoevento_enum"
    `);
  }
}
