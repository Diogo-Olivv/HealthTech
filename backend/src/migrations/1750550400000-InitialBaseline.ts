import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialBaseline1750550400000 implements MigrationInterface {
  name = 'InitialBaseline1750550400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "users_tipo_enum" AS ENUM ('PACIENTE', 'MEDICO');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "name" character varying NOT NULL,
        "tipo" "users_tipo_enum" NOT NULL DEFAULT 'PACIENTE',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medicos" (
        "userId" uuid NOT NULL,
        "crm" character varying NOT NULL,
        "especialidade" character varying NOT NULL,
        CONSTRAINT "UQ_medicos_crm" UNIQUE ("crm"),
        CONSTRAINT "PK_medicos" PRIMARY KEY ("userId"),
        CONSTRAINT "FK_medicos_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pacientes" (
        "userId" uuid NOT NULL,
        "cpf" character varying NOT NULL,
        "dataNascimento" date NOT NULL,
        CONSTRAINT "UQ_pacientes_cpf" UNIQUE ("cpf"),
        CONSTRAINT "PK_pacientes" PRIMARY KEY ("userId"),
        CONSTRAINT "FK_pacientes_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medico_paciente" (
        "medicoId" uuid NOT NULL,
        "pacienteId" uuid NOT NULL,
        "vinculadoEm" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_medico_paciente" PRIMARY KEY ("medicoId", "pacienteId"),
        CONSTRAINT "FK_medico_paciente_medico" FOREIGN KEY ("medicoId")
          REFERENCES "medicos"("userId") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_medico_paciente_paciente" FOREIGN KEY ("pacienteId")
          REFERENCES "pacientes"("userId") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "arquivos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nomeOriginal" character varying NOT NULL,
        "nomeUnico" character varying NOT NULL,
        "tipo" character varying NOT NULL,
        "tamanho" integer NOT NULL,
        "caminhoStorage" character varying NOT NULL,
        "dataUpload" TIMESTAMP NOT NULL DEFAULT now(),
        "pacienteId" uuid NOT NULL,
        "medicoUploadId" uuid NOT NULL,
        CONSTRAINT "PK_arquivos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_arquivos_paciente" FOREIGN KEY ("pacienteId")
          REFERENCES "pacientes"("userId") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_arquivos_medico_upload" FOREIGN KEY ("medicoUploadId")
          REFERENCES "medicos"("userId") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "arquivos"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medico_paciente"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pacientes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medicos"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_tipo_enum"`);
  }
}
