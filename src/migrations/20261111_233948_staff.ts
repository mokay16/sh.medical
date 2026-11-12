import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "staff_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"job_title" varchar,
  	"photo_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "staff_id" integer;
  ALTER TABLE "staff_bio" ADD CONSTRAINT "staff_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "staff_bio_order_idx" ON "staff_bio" USING btree ("_order");
  CREATE INDEX "staff_bio_parent_id_idx" ON "staff_bio" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "staff_slug_idx" ON "staff" USING btree ("slug");
  CREATE INDEX "staff_photo_idx" ON "staff" USING btree ("photo_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "staff_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "staff" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "staff_bio" CASCADE;
  DROP TABLE "staff" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staff_fk";
  
  DROP INDEX "payload_locked_documents_rels_staff_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "staff_id";`)
}
