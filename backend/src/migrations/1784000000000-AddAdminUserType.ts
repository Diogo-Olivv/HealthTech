import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminUserType1784000000000 implements MigrationInterface {
  name = 'AddAdminUserType1784000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "users_tipo_enum" ADD VALUE IF NOT EXISTS 'ADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "users" SET "tipo" = 'PACIENTE' WHERE "tipo" = 'ADMIN'
    `);

    await queryRunner.query(`
      CREATE TYPE "users_tipo_enum_old" AS ENUM ('PACIENTE', 'MEDICO')
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "tipo" TYPE "users_tipo_enum_old"
      USING "tipo"::text::"users_tipo_enum_old"
    `);

    await queryRunner.query(`DROP TYPE "users_tipo_enum"`);
    await queryRunner.query(`
      ALTER TYPE "users_tipo_enum_old" RENAME TO "users_tipo_enum"
    `);
  }
}
