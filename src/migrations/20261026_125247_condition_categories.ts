import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "departments_conditions_categories_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "departments_conditions_categories_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "departments_conditions_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"heading" varchar,
  	"intro" varchar
  );
  
  ALTER TABLE "departments_conditions_categories_groups_items" ADD CONSTRAINT "departments_conditions_categories_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_conditions_categories_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_conditions_categories_groups" ADD CONSTRAINT "departments_conditions_categories_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments_conditions_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_conditions_categories" ADD CONSTRAINT "departments_conditions_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_conditions_categories" ADD CONSTRAINT "departments_conditions_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "departments_conditions_categories_groups_items_order_idx" ON "departments_conditions_categories_groups_items" USING btree ("_order");
  CREATE INDEX "departments_conditions_categories_groups_items_parent_id_idx" ON "departments_conditions_categories_groups_items" USING btree ("_parent_id");
  CREATE INDEX "departments_conditions_categories_groups_order_idx" ON "departments_conditions_categories_groups" USING btree ("_order");
  CREATE INDEX "departments_conditions_categories_groups_parent_id_idx" ON "departments_conditions_categories_groups" USING btree ("_parent_id");
  CREATE INDEX "departments_conditions_categories_order_idx" ON "departments_conditions_categories" USING btree ("_order");
  CREATE INDEX "departments_conditions_categories_parent_id_idx" ON "departments_conditions_categories" USING btree ("_parent_id");
  CREATE INDEX "departments_conditions_categories_image_idx" ON "departments_conditions_categories" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "departments_conditions_categories_groups_items" CASCADE;
  DROP TABLE "departments_conditions_categories_groups" CASCADE;
  DROP TABLE "departments_conditions_categories" CASCADE;`)
}
