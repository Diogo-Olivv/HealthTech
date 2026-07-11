import { MigrationInterface, QueryRunner } from 'typeorm';

// transaction = false: ALTER TYPE ... ADD VALUE não roda em bloco transacional.
export class AddStatusVinculoMedicoPaciente1783500000000 implements MigrationInterface {
  name = 'AddStatusVinculoMedicoPaciente1783500000000';
  transaction = false as const;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "medico_paciente_status_enum" AS ENUM (
          'PENDENTE',
          'APROVADO',
          'REJEITADO',
          'REVOGADO'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ADD COLUMN IF NOT EXISTS "status" "medico_paciente_status_enum"`,
    );
    await queryRunner.query(
      `UPDATE "medico_paciente" SET "status" = 'APROVADO' WHERE "status" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ALTER COLUMN "status" SET DEFAULT 'PENDENTE'`,
    );

    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ADD COLUMN IF NOT EXISTS "solicitadoPor" uuid`,
    );
    await queryRunner.query(
      `UPDATE "medico_paciente" SET "solicitadoPor" = "medicoId" WHERE "solicitadoPor" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ALTER COLUMN "solicitadoPor" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ADD COLUMN IF NOT EXISTS "solicitadoEm" TIMESTAMP`,
    );
    await queryRunner.query(
      `UPDATE "medico_paciente" SET "solicitadoEm" = "vinculadoEm" WHERE "solicitadoEm" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ALTER COLUMN "solicitadoEm" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ALTER COLUMN "solicitadoEm" SET DEFAULT now()`,
    );

    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ADD COLUMN IF NOT EXISTS "respondidoEm" TIMESTAMP`,
    );
    await queryRunner.query(
      `UPDATE "medico_paciente" SET "respondidoEm" = "vinculadoEm" WHERE "respondidoEm" IS NULL AND "status" = 'APROVADO'`,
    );

    await queryRunner.query(
      `ALTER TABLE "medico_paciente" ADD COLUMN IF NOT EXISTS "termoVersao" varchar`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_medico_paciente_pendentes" ON "medico_paciente" ("pacienteId") WHERE "status" = 'PENDENTE'`,
    );

    await queryRunner.query(
      `ALTER TYPE "audit_logs_tipoevento_enum" ADD VALUE IF NOT EXISTS 'SOLICITACAO_VINCULO'`,
    );
    await queryRunner.query(
      `ALTER TYPE "audit_logs_tipoevento_enum" ADD VALUE IF NOT EXISTS 'APROVACAO_VINCULO'`,
    );
    await queryRunner.query(
      `ALTER TYPE "audit_logs_tipoevento_enum" ADD VALUE IF NOT EXISTS 'REJEICAO_VINCULO'`,
    );
    await queryRunner.query(
      `ALTER TYPE "audit_logs_tipoevento_enum" ADD VALUE IF NOT EXISTS 'REVOGACAO_VINCULO'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_medico_paciente_pendentes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" DROP COLUMN IF EXISTS "termoVersao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" DROP COLUMN IF EXISTS "respondidoEm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" DROP COLUMN IF EXISTS "solicitadoEm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" DROP COLUMN IF EXISTS "solicitadoPor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medico_paciente" DROP COLUMN IF EXISTS "status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "medico_paciente_status_enum"`,
    );
    // Postgres não permite remover valores de enum: SOLICITACAO_/APROVACAO_/
    // REJEICAO_/REVOGACAO_VINCULO ficam em audit_logs_tipoevento_enum.
  }
}
