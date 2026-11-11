import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Accounts that already exist stay admins; new accounts start as editors.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'admin' NOT NULL;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "role";
  DROP TYPE "public"."enum_users_role";`)
}
