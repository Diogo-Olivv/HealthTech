import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Zera todos os médicos existentes (arquivos, vínculos, especialidades) e os
 * usuários do tipo MEDICO. Justifica-se porque a base ainda não tem médicos
 * reais e a transição para o novo modelo de especialidades exige que cada
 * médico se recadastre selecionando ao menos uma especialidade normalizada.
 */
export class ZerarMedicos1783400000000 implements MigrationInterface {
  name = 'ZerarMedicos1783400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "arquivos" WHERE "medicoUploadId" IN (SELECT "userId" FROM "medicos")`);
    await queryRunner.query(`DELETE FROM "medico_paciente" WHERE "medicoId" IN (SELECT "userId" FROM "medicos")`);
    await queryRunner.query(`DELETE FROM "medico_especialidades"`);
    await queryRunner.query(`DELETE FROM "medicos"`);
    await queryRunner.query(`DELETE FROM "users" WHERE "tipo" = 'MEDICO'`);
  }

  public async down(): Promise<void> {
    // Sem rollback: dados apagados não podem ser recriados.
  }
}
