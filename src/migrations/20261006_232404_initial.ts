import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_offices_region" AS ENUM('San Francisco', 'Peninsula', 'South Bay', 'East Bay', 'North Bay');
  CREATE TABLE "departments_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"big" varchar NOT NULL,
  	"small" varchar NOT NULL
  );
  
  CREATE TABLE "departments_overview_paras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "departments_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar
  );
  
  CREATE TABLE "departments_conditions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "departments_conditions_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"proc_label" varchar DEFAULT 'Treatments and procedures',
  	"more" varchar
  );
  
  CREATE TABLE "departments_treatments_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "departments_feature_paras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "departments_feature_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "departments_visit_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "departments_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "departments_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"tag" varchar NOT NULL,
  	"brand" varchar NOT NULL,
  	"short_brand" varchar NOT NULL,
  	"logo_id" integer,
  	"phone" varchar NOT NULL,
  	"phone_label" varchar NOT NULL,
  	"book_label" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"photo_position" varchar DEFAULT 'center',
  	"hero_secondary_label" varchar,
  	"hero_secondary_href" varchar,
  	"home_short" varchar NOT NULL,
  	"home_summary" varchar NOT NULL,
  	"home_photo_id" integer,
  	"home_photo_position" varchar DEFAULT 'center',
  	"overview_eyebrow" varchar,
  	"overview_heading" varchar NOT NULL,
  	"overview_glance_title" varchar,
  	"overview_note" varchar,
  	"conditions_nav_label" varchar DEFAULT 'Conditions',
  	"conditions_eyebrow" varchar,
  	"conditions_heading" varchar NOT NULL,
  	"conditions_lede" varchar,
  	"treatments_enabled" boolean DEFAULT false,
  	"treatments_nav_label" varchar DEFAULT 'Treatments',
  	"treatments_eyebrow" varchar,
  	"treatments_heading" varchar,
  	"treatments_lede" varchar,
  	"feature_enabled" boolean DEFAULT false,
  	"feature_on_patients_page" boolean DEFAULT false,
  	"feature_nav_label" varchar DEFAULT '',
  	"feature_eyebrow" varchar,
  	"feature_heading" varchar,
  	"feature_image_id" integer,
  	"visit_eyebrow" varchar DEFAULT 'Your care, step by step',
  	"visit_heading" varchar NOT NULL,
  	"visit_note" varchar,
  	"visit_link_label" varchar,
  	"faq_open" numeric DEFAULT 2,
  	"team_eyebrow" varchar DEFAULT 'Your care team',
  	"team_heading" varchar DEFAULT 'Meet the team',
  	"team_empty_note" varchar,
  	"office_phone" varchar,
  	"where_heading" varchar NOT NULL,
  	"where_note" varchar,
  	"cta_heading" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "departments_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "departments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"specialists_id" integer,
  	"offices_id" integer
  );
  
  CREATE TABLE "specialists_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "specialists_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "specialists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"title" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "specialists_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "specialists_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"offices_id" integer
  );
  
  CREATE TABLE "offices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"region" "enum_offices_region" NOT NULL,
  	"street" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"phone" varchar,
  	"hours" varchar DEFAULT 'Monday to Friday, 8am to 5pm',
  	"note" varchar,
  	"photo_id" integer,
  	"lat" numeric,
  	"lng" numeric,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"departments_id" integer,
  	"specialists_id" integer,
  	"offices_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "departments_facts" ADD CONSTRAINT "departments_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_overview_paras" ADD CONSTRAINT "departments_overview_paras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_reviews" ADD CONSTRAINT "departments_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_conditions_items" ADD CONSTRAINT "departments_conditions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_conditions_programs" ADD CONSTRAINT "departments_conditions_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_treatments_items" ADD CONSTRAINT "departments_treatments_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_feature_paras" ADD CONSTRAINT "departments_feature_paras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_feature_bullets" ADD CONSTRAINT "departments_feature_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_visit_steps" ADD CONSTRAINT "departments_visit_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_resources" ADD CONSTRAINT "departments_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_faq" ADD CONSTRAINT "departments_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_home_photo_id_media_id_fk" FOREIGN KEY ("home_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_feature_image_id_media_id_fk" FOREIGN KEY ("feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_texts" ADD CONSTRAINT "departments_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_rels" ADD CONSTRAINT "departments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_rels" ADD CONSTRAINT "departments_rels_specialists_fk" FOREIGN KEY ("specialists_id") REFERENCES "public"."specialists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_rels" ADD CONSTRAINT "departments_rels_offices_fk" FOREIGN KEY ("offices_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialists_bio" ADD CONSTRAINT "specialists_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specialists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialists_sections" ADD CONSTRAINT "specialists_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specialists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialists" ADD CONSTRAINT "specialists_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "specialists_texts" ADD CONSTRAINT "specialists_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."specialists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialists_rels" ADD CONSTRAINT "specialists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."specialists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specialists_rels" ADD CONSTRAINT "specialists_rels_offices_fk" FOREIGN KEY ("offices_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offices" ADD CONSTRAINT "offices_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specialists_fk" FOREIGN KEY ("specialists_id") REFERENCES "public"."specialists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offices_fk" FOREIGN KEY ("offices_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "departments_facts_order_idx" ON "departments_facts" USING btree ("_order");
  CREATE INDEX "departments_facts_parent_id_idx" ON "departments_facts" USING btree ("_parent_id");
  CREATE INDEX "departments_overview_paras_order_idx" ON "departments_overview_paras" USING btree ("_order");
  CREATE INDEX "departments_overview_paras_parent_id_idx" ON "departments_overview_paras" USING btree ("_parent_id");
  CREATE INDEX "departments_reviews_order_idx" ON "departments_reviews" USING btree ("_order");
  CREATE INDEX "departments_reviews_parent_id_idx" ON "departments_reviews" USING btree ("_parent_id");
  CREATE INDEX "departments_conditions_items_order_idx" ON "departments_conditions_items" USING btree ("_order");
  CREATE INDEX "departments_conditions_items_parent_id_idx" ON "departments_conditions_items" USING btree ("_parent_id");
  CREATE INDEX "departments_conditions_programs_order_idx" ON "departments_conditions_programs" USING btree ("_order");
  CREATE INDEX "departments_conditions_programs_parent_id_idx" ON "departments_conditions_programs" USING btree ("_parent_id");
  CREATE INDEX "departments_treatments_items_order_idx" ON "departments_treatments_items" USING btree ("_order");
  CREATE INDEX "departments_treatments_items_parent_id_idx" ON "departments_treatments_items" USING btree ("_parent_id");
  CREATE INDEX "departments_feature_paras_order_idx" ON "departments_feature_paras" USING btree ("_order");
  CREATE INDEX "departments_feature_paras_parent_id_idx" ON "departments_feature_paras" USING btree ("_parent_id");
  CREATE INDEX "departments_feature_bullets_order_idx" ON "departments_feature_bullets" USING btree ("_order");
  CREATE INDEX "departments_feature_bullets_parent_id_idx" ON "departments_feature_bullets" USING btree ("_parent_id");
  CREATE INDEX "departments_visit_steps_order_idx" ON "departments_visit_steps" USING btree ("_order");
  CREATE INDEX "departments_visit_steps_parent_id_idx" ON "departments_visit_steps" USING btree ("_parent_id");
  CREATE INDEX "departments_resources_order_idx" ON "departments_resources" USING btree ("_order");
  CREATE INDEX "departments_resources_parent_id_idx" ON "departments_resources" USING btree ("_parent_id");
  CREATE INDEX "departments_faq_order_idx" ON "departments_faq" USING btree ("_order");
  CREATE INDEX "departments_faq_parent_id_idx" ON "departments_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "departments_slug_idx" ON "departments" USING btree ("slug");
  CREATE INDEX "departments_logo_idx" ON "departments" USING btree ("logo_id");
  CREATE INDEX "departments_photo_idx" ON "departments" USING btree ("photo_id");
  CREATE INDEX "departments_home_home_photo_idx" ON "departments" USING btree ("home_photo_id");
  CREATE INDEX "departments_feature_feature_image_idx" ON "departments" USING btree ("feature_image_id");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE INDEX "departments_texts_order_parent" ON "departments_texts" USING btree ("order","parent_id");
  CREATE INDEX "departments_rels_order_idx" ON "departments_rels" USING btree ("order");
  CREATE INDEX "departments_rels_parent_idx" ON "departments_rels" USING btree ("parent_id");
  CREATE INDEX "departments_rels_path_idx" ON "departments_rels" USING btree ("path");
  CREATE INDEX "departments_rels_specialists_id_idx" ON "departments_rels" USING btree ("specialists_id");
  CREATE INDEX "departments_rels_offices_id_idx" ON "departments_rels" USING btree ("offices_id");
  CREATE INDEX "specialists_bio_order_idx" ON "specialists_bio" USING btree ("_order");
  CREATE INDEX "specialists_bio_parent_id_idx" ON "specialists_bio" USING btree ("_parent_id");
  CREATE INDEX "specialists_sections_order_idx" ON "specialists_sections" USING btree ("_order");
  CREATE INDEX "specialists_sections_parent_id_idx" ON "specialists_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "specialists_slug_idx" ON "specialists" USING btree ("slug");
  CREATE INDEX "specialists_photo_idx" ON "specialists" USING btree ("photo_id");
  CREATE INDEX "specialists_updated_at_idx" ON "specialists" USING btree ("updated_at");
  CREATE INDEX "specialists_created_at_idx" ON "specialists" USING btree ("created_at");
  CREATE INDEX "specialists_texts_order_parent" ON "specialists_texts" USING btree ("order","parent_id");
  CREATE INDEX "specialists_rels_order_idx" ON "specialists_rels" USING btree ("order");
  CREATE INDEX "specialists_rels_parent_idx" ON "specialists_rels" USING btree ("parent_id");
  CREATE INDEX "specialists_rels_path_idx" ON "specialists_rels" USING btree ("path");
  CREATE INDEX "specialists_rels_offices_id_idx" ON "specialists_rels" USING btree ("offices_id");
  CREATE UNIQUE INDEX "offices_slug_idx" ON "offices" USING btree ("slug");
  CREATE INDEX "offices_photo_idx" ON "offices" USING btree ("photo_id");
  CREATE INDEX "offices_updated_at_idx" ON "offices" USING btree ("updated_at");
  CREATE INDEX "offices_created_at_idx" ON "offices" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_specialists_id_idx" ON "payload_locked_documents_rels" USING btree ("specialists_id");
  CREATE INDEX "payload_locked_documents_rels_offices_id_idx" ON "payload_locked_documents_rels" USING btree ("offices_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "departments_facts" CASCADE;
  DROP TABLE "departments_overview_paras" CASCADE;
  DROP TABLE "departments_reviews" CASCADE;
  DROP TABLE "departments_conditions_items" CASCADE;
  DROP TABLE "departments_conditions_programs" CASCADE;
  DROP TABLE "departments_treatments_items" CASCADE;
  DROP TABLE "departments_feature_paras" CASCADE;
  DROP TABLE "departments_feature_bullets" CASCADE;
  DROP TABLE "departments_visit_steps" CASCADE;
  DROP TABLE "departments_resources" CASCADE;
  DROP TABLE "departments_faq" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "departments_texts" CASCADE;
  DROP TABLE "departments_rels" CASCADE;
  DROP TABLE "specialists_bio" CASCADE;
  DROP TABLE "specialists_sections" CASCADE;
  DROP TABLE "specialists" CASCADE;
  DROP TABLE "specialists_texts" CASCADE;
  DROP TABLE "specialists_rels" CASCADE;
  DROP TABLE "offices" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_offices_region";`)
}
