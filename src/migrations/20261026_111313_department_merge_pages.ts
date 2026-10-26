import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments" ADD COLUMN "treatments_on_conditions_page" boolean DEFAULT false;
  ALTER TABLE "departments" ADD COLUMN "locations_on_team_page" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments" DROP COLUMN "treatments_on_conditions_page";
  ALTER TABLE "departments" DROP COLUMN "locations_on_team_page";`)
}
