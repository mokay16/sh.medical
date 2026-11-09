import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments_conditions_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "departments_conditions_items" ADD COLUMN "image_position" varchar DEFAULT 'center';
  ALTER TABLE "departments_conditions_items" ADD CONSTRAINT "departments_conditions_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "departments_conditions_items_image_idx" ON "departments_conditions_items" USING btree ("image_id");`)

  // Give the live Facial Plastics surgical services page its new banner and a photo on each procedure
  // (a fresh site gets them from the seed).
  const { docs } = await payload.find({ collection: 'departments', where: { slug: { equals: 'facial-plastics' } }, depth: 0, limit: 1, req })
  const fp = docs[0]
  if (!fp?.conditions) return
  const content = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/seed/content.json'), 'utf8'))
  const c = content.departments.find((d: { slug: string }) => d.slug === 'facial-plastics')?.conditions
  if (!c) return
  const uploads = path.resolve(process.cwd(), 'public/uploads')
  const files = fs.readdirSync(uploads)
  const upload = async (name: string, alt: string) => {
    const file = files.find((f) => f.startsWith(name + '.'))
    return file ? (await payload.create({ collection: 'media', data: { alt }, filePath: path.join(uploads, file), req })).id : undefined
  }
  const photos = new Map<string, [string, string, string]>(c.items.map((it: string[]) => [it[0], [it[2], it[3], it[4]]]))
  const items = []
  for (const it of fp.conditions.items || []) {
    const photo = photos.get(it.title)
    items.push(photo ? { ...it, image: await upload(photo[0], photo[2]), imagePosition: photo[1] } : it)
  }
  const image = (await upload(c.image, c.imageAlt)) ?? fp.conditions.image
  await payload.update({
    collection: 'departments',
    id: fp.id,
    data: { conditions: { ...fp.conditions, image, imagePosition: c.imagePosition, items } },
    req,
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments_conditions_items" DROP CONSTRAINT "departments_conditions_items_image_id_media_id_fk";
  
  DROP INDEX "departments_conditions_items_image_idx";
  ALTER TABLE "departments_conditions_items" DROP COLUMN "image_id";
  ALTER TABLE "departments_conditions_items" DROP COLUMN "image_position";`)
}
