import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "departments_gallery_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"position" varchar DEFAULT 'center'
  );
  
  ALTER TABLE "departments" ADD COLUMN "gallery_eyebrow" varchar;
  ALTER TABLE "departments" ADD COLUMN "gallery_heading" varchar;
  ALTER TABLE "departments" ADD COLUMN "conditions_image_id" integer;
  ALTER TABLE "departments" ADD COLUMN "conditions_image_position" varchar DEFAULT 'center';
  ALTER TABLE "departments" ADD COLUMN "treatments_image_id" integer;
  ALTER TABLE "departments" ADD COLUMN "treatments_image_position" varchar DEFAULT 'center';
  ALTER TABLE "departments_gallery_photos" ADD CONSTRAINT "departments_gallery_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_gallery_photos" ADD CONSTRAINT "departments_gallery_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "departments_gallery_photos_order_idx" ON "departments_gallery_photos" USING btree ("_order");
  CREATE INDEX "departments_gallery_photos_parent_id_idx" ON "departments_gallery_photos" USING btree ("_parent_id");
  CREATE INDEX "departments_gallery_photos_image_idx" ON "departments_gallery_photos" USING btree ("image_id");
  ALTER TABLE "departments" ADD CONSTRAINT "departments_conditions_image_id_media_id_fk" FOREIGN KEY ("conditions_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_treatments_image_id_media_id_fk" FOREIGN KEY ("treatments_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "departments_conditions_conditions_image_idx" ON "departments" USING btree ("conditions_image_id");
  CREATE INDEX "departments_treatments_treatments_image_idx" ON "departments" USING btree ("treatments_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments_gallery_photos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "departments_gallery_photos" CASCADE;
  ALTER TABLE "departments" DROP CONSTRAINT "departments_conditions_image_id_media_id_fk";
  
  ALTER TABLE "departments" DROP CONSTRAINT "departments_treatments_image_id_media_id_fk";
  
  DROP INDEX "departments_conditions_conditions_image_idx";
  DROP INDEX "departments_treatments_treatments_image_idx";
  ALTER TABLE "departments" DROP COLUMN "gallery_eyebrow";
  ALTER TABLE "departments" DROP COLUMN "gallery_heading";
  ALTER TABLE "departments" DROP COLUMN "conditions_image_id";
  ALTER TABLE "departments" DROP COLUMN "conditions_image_position";
  ALTER TABLE "departments" DROP COLUMN "treatments_image_id";
  ALTER TABLE "departments" DROP COLUMN "treatments_image_position";`)
}
