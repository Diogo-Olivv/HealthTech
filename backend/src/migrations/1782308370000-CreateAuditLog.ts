import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLog1782308370000 implements MigrationInterface {
  name = 'CreateAuditLog1782308370000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "audit_logs_tipoevento_enum" AS ENUM (
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
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "audit_logs_status_enum" AS ENUM ('SUCCESS', 'FAILURE');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "tipoEvento" "audit_logs_tipoevento_enum" NOT NULL,
        "recursoId" character varying,
        "status" "audit_logs_status_enum" NOT NULL,
        "ipOrigem" character varying NOT NULL,
        "userAgent" character varying,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "audit_logs_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "audit_logs_tipoevento_enum"`);
  }
}
