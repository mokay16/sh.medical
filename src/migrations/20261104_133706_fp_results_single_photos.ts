import fs from 'fs'
import path from 'path'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments_results_pairs" ALTER COLUMN "before_id" DROP NOT NULL;
  ALTER TABLE "departments_results_pairs" ALTER COLUMN "after_id" DROP NOT NULL;
  ALTER TABLE "departments_results_pairs" ADD COLUMN "image_id" integer;
  ALTER TABLE "departments_results_pairs" ADD CONSTRAINT "departments_results_pairs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "departments_results_pairs_image_idx" ON "departments_results_pairs" USING btree ("image_id");`)

  // Add the Facial Plastics before-and-after photos to a site that's already loaded (a fresh one gets them from the seed).
  const { docs } = await payload.find({ collection: 'departments', where: { slug: { equals: 'facial-plastics' } }, depth: 0, limit: 1, req })
  const fp = docs[0]
  if (!fp || fp.results?.pairs?.length) return
  const content = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/seed/content.json'), 'utf8'))
  const pairs: { image: string; caption: string; alt: string }[] = content.departments.find((d: { slug: string }) => d.slug === 'facial-plastics')?.results?.pairs || []
  const uploads = path.resolve(process.cwd(), 'public/uploads')
  const files = fs.readdirSync(uploads)
  const results = []
  for (const p of pairs) {
    const file = files.find((f) => f.startsWith(p.image))
    if (!file) continue
    const doc = await payload.create({ collection: 'media', data: { alt: p.alt }, filePath: path.join(uploads, file), req })
    results.push({ image: doc.id, caption: p.caption })
  }
  await payload.update({ collection: 'departments', id: fp.id, data: { results: { ...fp.results, pairs: results } }, req })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments_results_pairs" DROP CONSTRAINT "departments_results_pairs_image_id_media_id_fk";
  
  DROP INDEX "departments_results_pairs_image_idx";
  ALTER TABLE "departments_results_pairs" ALTER COLUMN "before_id" SET NOT NULL;
  ALTER TABLE "departments_results_pairs" ALTER COLUMN "after_id" SET NOT NULL;
  ALTER TABLE "departments_results_pairs" DROP COLUMN "image_id";`)
}
