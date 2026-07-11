import { MigrationInterface, QueryRunner } from 'typeorm';

const ESPECIALIDADES_CFM: Array<[string, string]> = [
  ['Acupuntura', 'acupuntura'],
  ['Alergia e imunologia', 'alergia-e-imunologia'],
  ['Anestesiologia', 'anestesiologia'],
  ['Angiologia', 'angiologia'],
  ['Cardiologia', 'cardiologia'],
  ['Cirurgia cardiovascular', 'cirurgia-cardiovascular'],
  ['Cirurgia da mão', 'cirurgia-da-mao'],
  ['Cirurgia de cabeça e pescoço', 'cirurgia-de-cabeca-e-pescoco'],
  ['Cirurgia do aparelho digestivo', 'cirurgia-do-aparelho-digestivo'],
  ['Cirurgia geral', 'cirurgia-geral'],
  ['Cirurgia oncológica', 'cirurgia-oncologica'],
  ['Cirurgia pediátrica', 'cirurgia-pediatrica'],
  ['Cirurgia plástica', 'cirurgia-plastica'],
  ['Cirurgia torácica', 'cirurgia-toracica'],
  ['Cirurgia vascular', 'cirurgia-vascular'],
  ['Clínica médica', 'clinica-medica'],
  ['Coloproctologia', 'coloproctologia'],
  ['Dermatologia', 'dermatologia'],
  ['Endocrinologia e metabologia', 'endocrinologia-e-metabologia'],
  ['Endoscopia', 'endoscopia'],
  ['Gastroenterologia', 'gastroenterologia'],
  ['Genética médica', 'genetica-medica'],
  ['Geriatria', 'geriatria'],
  ['Ginecologia e obstetrícia', 'ginecologia-e-obstetricia'],
  ['Hematologia e hemoterapia', 'hematologia-e-hemoterapia'],
  ['Homeopatia', 'homeopatia'],
  ['Infectologia', 'infectologia'],
  ['Mastologia', 'mastologia'],
  ['Medicina de emergência', 'medicina-de-emergencia'],
  ['Medicina de família e comunidade', 'medicina-de-familia-e-comunidade'],
  ['Medicina do trabalho', 'medicina-do-trabalho'],
  ['Medicina do tráfego', 'medicina-do-trafego'],
  ['Medicina esportiva', 'medicina-esportiva'],
  ['Medicina física e reabilitação', 'medicina-fisica-e-reabilitacao'],
  ['Medicina intensiva', 'medicina-intensiva'],
  ['Medicina legal e perícia médica', 'medicina-legal-e-pericia-medica'],
  ['Medicina nuclear', 'medicina-nuclear'],
  ['Medicina preventiva e social', 'medicina-preventiva-e-social'],
  ['Nefrologia', 'nefrologia'],
  ['Neurocirurgia', 'neurocirurgia'],
  ['Neurologia', 'neurologia'],
  ['Nutrologia', 'nutrologia'],
  ['Oftalmologia', 'oftalmologia'],
  ['Oncologia clínica', 'oncologia-clinica'],
  ['Ortopedia e traumatologia', 'ortopedia-e-traumatologia'],
  ['Otorrinolaringologia', 'otorrinolaringologia'],
  ['Patologia', 'patologia'],
  ['Patologia clínica/medicina laboratorial', 'patologia-clinica-medicina-laboratorial'],
  ['Pediatria', 'pediatria'],
  ['Pneumologia', 'pneumologia'],
  ['Psiquiatria', 'psiquiatria'],
  ['Radiologia e diagnóstico por imagem', 'radiologia-e-diagnostico-por-imagem'],
  ['Radioterapia', 'radioterapia'],
  ['Reumatologia', 'reumatologia'],
  ['Urologia', 'urologia'],
];

const SENTINELA_SLUG = 'a-definir';

export class CreateEspecialidades1783300000000 implements MigrationInterface {
  name = 'CreateEspecialidades1783300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "unaccent"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "especialidades" (
        "id"    uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nome"  varchar(80) NOT NULL,
        "slug"  varchar(80) NOT NULL,
        "ativa" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_especialidades_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_especialidades" PRIMARY KEY ("id")
      )
    `);

    for (const [nome, slug] of ESPECIALIDADES_CFM) {
      await queryRunner.query(
        `INSERT INTO especialidades (nome, slug) VALUES ($1, $2)
         ON CONFLICT (slug) DO NOTHING`,
        [nome, slug],
      );
    }

    await queryRunner.query(
      `INSERT INTO especialidades (nome, slug, ativa)
       VALUES ($1, $2, false)
       ON CONFLICT (slug) DO NOTHING`,
      ['A definir', SENTINELA_SLUG],
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medico_especialidades" (
        "medicoId"        uuid NOT NULL,
        "especialidadeId" uuid NOT NULL,
        CONSTRAINT "PK_medico_especialidades" PRIMARY KEY ("medicoId", "especialidadeId"),
        CONSTRAINT "FK_medesp_medico" FOREIGN KEY ("medicoId")
          REFERENCES "medicos"("userId") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_medesp_especialidade" FOREIGN KEY ("especialidadeId")
          REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_medesp_especialidade"
       ON "medico_especialidades" ("especialidadeId")`,
    );

    // Renomeia a coluna atual para preservar rollback do Deploy 2.
    // O código novo passa a ler da tabela medico_especialidades.
    const colunas = await queryRunner.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'medicos' AND column_name = 'especialidade'`,
    );
    if (colunas.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "medicos" RENAME COLUMN "especialidade" TO "especialidade_legado"`,
      );
      await queryRunner.query(
        `ALTER TABLE "medicos" ALTER COLUMN "especialidade_legado" DROP NOT NULL`,
      );
    } else {
      await queryRunner.query(
        `ALTER TABLE "medicos" ADD COLUMN IF NOT EXISTS "especialidade_legado" varchar NULL`,
      );
    }

    // Backfill: casa strings antigas (unaccent + lower) contra o slug canônico.
    // O que não bater cai na sentinela "A definir" — nenhum médico fica sem vínculo.
    await queryRunner.query(`
      INSERT INTO medico_especialidades ("medicoId", "especialidadeId")
      SELECT
        m."userId",
        COALESCE(
          (SELECT e.id FROM especialidades e
           WHERE e.slug = regexp_replace(
             lower(unaccent(m.especialidade_legado)),
             '[^a-z0-9]+', '-', 'g'
           )
           LIMIT 1),
          (SELECT e.id FROM especialidades e WHERE e.slug = '${SENTINELA_SLUG}' LIMIT 1)
        )
      FROM medicos m
      WHERE m.especialidade_legado IS NOT NULL
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "medico_especialidades"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "especialidades"`);

    const colunas = await queryRunner.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'medicos' AND column_name = 'especialidade_legado'`,
    );
    if (colunas.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "medicos" RENAME COLUMN "especialidade_legado" TO "especialidade"`,
      );
      await queryRunner.query(
        `UPDATE "medicos" SET "especialidade" = COALESCE("especialidade", 'A definir')`,
      );
      await queryRunner.query(
        `ALTER TABLE "medicos" ALTER COLUMN "especialidade" SET NOT NULL`,
      );
    }
  }
}
