import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "departments_results_pairs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before_id" integer NOT NULL,
  	"after_id" integer NOT NULL,
  	"caption" varchar
  );
  
  ALTER TABLE "departments_treatments_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "departments_treatments_items" ADD COLUMN "image_position" varchar DEFAULT 'center';
  ALTER TABLE "departments" ADD COLUMN "team_on_overview" boolean DEFAULT false;
  ALTER TABLE "departments" ADD COLUMN "results_eyebrow" varchar;
  ALTER TABLE "departments" ADD COLUMN "results_heading" varchar;
  ALTER TABLE "departments" ADD COLUMN "results_intro" varchar;
  ALTER TABLE "departments" ADD COLUMN "results_pending_note" varchar;
  ALTER TABLE "departments_results_pairs" ADD CONSTRAINT "departments_results_pairs_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_results_pairs" ADD CONSTRAINT "departments_results_pairs_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_results_pairs" ADD CONSTRAINT "departments_results_pairs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "departments_results_pairs_order_idx" ON "departments_results_pairs" USING btree ("_order");
  CREATE INDEX "departments_results_pairs_parent_id_idx" ON "departments_results_pairs" USING btree ("_parent_id");
  CREATE INDEX "departments_results_pairs_before_idx" ON "departments_results_pairs" USING btree ("before_id");
  CREATE INDEX "departments_results_pairs_after_idx" ON "departments_results_pairs" USING btree ("after_id");
  ALTER TABLE "departments_treatments_items" ADD CONSTRAINT "departments_treatments_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "departments_treatments_items_image_idx" ON "departments_treatments_items" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments_results_pairs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "departments_results_pairs" CASCADE;
  ALTER TABLE "departments_treatments_items" DROP CONSTRAINT "departments_treatments_items_image_id_media_id_fk";
  
  DROP INDEX "departments_treatments_items_image_idx";
  ALTER TABLE "departments_treatments_items" DROP COLUMN "image_id";
  ALTER TABLE "departments_treatments_items" DROP COLUMN "image_position";
  ALTER TABLE "departments" DROP COLUMN "team_on_overview";
  ALTER TABLE "departments" DROP COLUMN "results_eyebrow";
  ALTER TABLE "departments" DROP COLUMN "results_heading";
  ALTER TABLE "departments" DROP COLUMN "results_intro";
  ALTER TABLE "departments" DROP COLUMN "results_pending_note";`)
}
