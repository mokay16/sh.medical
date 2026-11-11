import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_specialists_new_patients" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__specialists_v_version_new_patients" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__offices_v_version_region" AS ENUM('San Francisco', 'Peninsula', 'South Bay', 'East Bay', 'North Bay');
  CREATE TYPE "public"."enum__reviews_v_version_status" AS ENUM('pending', 'published', 'rejected');
  CREATE TABLE "_specialists_v_version_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_specialists_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_specialists_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_role" varchar NOT NULL,
  	"version_title" varchar,
  	"version_photo_id" integer,
  	"version_new_patients" "enum__specialists_v_version_new_patients",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_specialists_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_specialists_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"offices_id" integer
  );
  
  CREATE TABLE "_offices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_region" "enum__offices_v_version_region" NOT NULL,
  	"version_street" varchar NOT NULL,
  	"version_city" varchar NOT NULL,
  	"version_phone" varchar,
  	"version_fax" varchar,
  	"version_parking" varchar,
  	"version_hours" varchar DEFAULT 'Monday to Friday, 8am to 5pm',
  	"version_note" varchar,
  	"version_photo_id" integer,
  	"version_lat" numeric,
  	"version_lng" numeric,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_reviews_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_status" "enum__reviews_v_version_status" DEFAULT 'pending' NOT NULL,
  	"version_department_id" integer NOT NULL,
  	"version_rating" numeric DEFAULT 5 NOT NULL,
  	"version_quote" varchar NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_location" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_email" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "specialists" ADD COLUMN "new_patients" "enum_specialists_new_patients";
  ALTER TABLE "offices" ADD COLUMN "fax" varchar;
  ALTER TABLE "offices" ADD COLUMN "parking" varchar;
  ALTER TABLE "_specialists_v_version_bio" ADD CONSTRAINT "_specialists_v_version_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_specialists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_specialists_v_version_sections" ADD CONSTRAINT "_specialists_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_specialists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_specialists_v" ADD CONSTRAINT "_specialists_v_parent_id_specialists_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."specialists"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialists_v" ADD CONSTRAINT "_specialists_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialists_v_texts" ADD CONSTRAINT "_specialists_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_specialists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_specialists_v_rels" ADD CONSTRAINT "_specialists_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_specialists_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_specialists_v_rels" ADD CONSTRAINT "_specialists_v_rels_offices_fk" FOREIGN KEY ("offices_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offices_v" ADD CONSTRAINT "_offices_v_parent_id_offices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offices_v" ADD CONSTRAINT "_offices_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_department_id_departments_id_fk" FOREIGN KEY ("version_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_specialists_v_version_bio_order_idx" ON "_specialists_v_version_bio" USING btree ("_order");
  CREATE INDEX "_specialists_v_version_bio_parent_id_idx" ON "_specialists_v_version_bio" USING btree ("_parent_id");
  CREATE INDEX "_specialists_v_version_sections_order_idx" ON "_specialists_v_version_sections" USING btree ("_order");
  CREATE INDEX "_specialists_v_version_sections_parent_id_idx" ON "_specialists_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_specialists_v_parent_idx" ON "_specialists_v" USING btree ("parent_id");
  CREATE INDEX "_specialists_v_version_version_slug_idx" ON "_specialists_v" USING btree ("version_slug");
  CREATE INDEX "_specialists_v_version_version_photo_idx" ON "_specialists_v" USING btree ("version_photo_id");
  CREATE INDEX "_specialists_v_version_version_updated_at_idx" ON "_specialists_v" USING btree ("version_updated_at");
  CREATE INDEX "_specialists_v_version_version_created_at_idx" ON "_specialists_v" USING btree ("version_created_at");
  CREATE INDEX "_specialists_v_created_at_idx" ON "_specialists_v" USING btree ("created_at");
  CREATE INDEX "_specialists_v_updated_at_idx" ON "_specialists_v" USING btree ("updated_at");
  CREATE INDEX "_specialists_v_texts_order_parent" ON "_specialists_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_specialists_v_rels_order_idx" ON "_specialists_v_rels" USING btree ("order");
  CREATE INDEX "_specialists_v_rels_parent_idx" ON "_specialists_v_rels" USING btree ("parent_id");
  CREATE INDEX "_specialists_v_rels_path_idx" ON "_specialists_v_rels" USING btree ("path");
  CREATE INDEX "_specialists_v_rels_offices_id_idx" ON "_specialists_v_rels" USING btree ("offices_id");
  CREATE INDEX "_offices_v_parent_idx" ON "_offices_v" USING btree ("parent_id");
  CREATE INDEX "_offices_v_version_version_slug_idx" ON "_offices_v" USING btree ("version_slug");
  CREATE INDEX "_offices_v_version_version_photo_idx" ON "_offices_v" USING btree ("version_photo_id");
  CREATE INDEX "_offices_v_version_version_updated_at_idx" ON "_offices_v" USING btree ("version_updated_at");
  CREATE INDEX "_offices_v_version_version_created_at_idx" ON "_offices_v" USING btree ("version_created_at");
  CREATE INDEX "_offices_v_created_at_idx" ON "_offices_v" USING btree ("created_at");
  CREATE INDEX "_offices_v_updated_at_idx" ON "_offices_v" USING btree ("updated_at");
  CREATE INDEX "_reviews_v_parent_idx" ON "_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_reviews_v_version_version_department_idx" ON "_reviews_v" USING btree ("version_department_id");
  CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON "_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_reviews_v_version_version_created_at_idx" ON "_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_reviews_v_created_at_idx" ON "_reviews_v" USING btree ("created_at");
  CREATE INDEX "_reviews_v_updated_at_idx" ON "_reviews_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "_specialists_v_version_bio" CASCADE;
  DROP TABLE "_specialists_v_version_sections" CASCADE;
  DROP TABLE "_specialists_v" CASCADE;
  DROP TABLE "_specialists_v_texts" CASCADE;
  DROP TABLE "_specialists_v_rels" CASCADE;
  DROP TABLE "_offices_v" CASCADE;
  DROP TABLE "_reviews_v" CASCADE;
  ALTER TABLE "specialists" DROP COLUMN "new_patients";
  ALTER TABLE "offices" DROP COLUMN "fax";
  ALTER TABLE "offices" DROP COLUMN "parking";
  DROP TYPE "public"."enum_specialists_new_patients";
  DROP TYPE "public"."enum__specialists_v_version_new_patients";
  DROP TYPE "public"."enum__offices_v_version_region";
  DROP TYPE "public"."enum__reviews_v_version_status";`)
}
