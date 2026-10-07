# SH Medical website

Next.js 16 (App Router) with Payload CMS 3, built from the designs on the [SH Medical Redesign canvas](https://claude.ai/artifact/KXJvxM5mLaQi6UPSwwngGo). See `../PLAN.md` for the project plan.

## Run it

```
npm install
npm run seed      # loads departments, specialists, offices and images into the local database
npm run dev       # http://localhost:3000 · CMS at /admin (create the first admin user there)
```

Requires Node 20.18+. The local database is SQLite (`sh-medical.db`, set in `.env`); production should use Postgres (`@payloadcms/db-postgres`).

## What's here

| Route | Page |
| --- | --- |
| `/` | Home: hero and care finder, who we are, how we care, all departments, specialists, locations |
| `/care` | All departments |
| `/care/<dept>` | A department's own mini-site, with its own header and footer. Overview, then `/conditions`, `/treatments` (or its own label), a feature page such as `/shot-clinic`, `/patients`, `/team`, `/locations` |
| `/specialists` | Directory, filterable by care, region and name (`?care=allergy&region=San Francisco&q=`) |
| `/specialists/<slug>` | Profile with bio, training and offices |
| `/locations` | Offices by region, with the care offered at each |
| `/patients` | New patients, insurance, forms and records (PDFs in `public/forms`), video visits, MyChart |
| `/about` | Story, mission, history, reviews |
| `/book` | 4-step appointment request (see below) |

CMS collections (`src/collections`): **Departments** (everything on a department's pages, in tabs), **Specialists**, **Offices**, **Media**, **Users**. A department's menu labels and page addresses come from its content (`sitePages()` in `src/lib/content.ts`). Text fields accept `*italic*` and `**bold**`; FAQ answers accept `- ` bullet lines.

Seed content comes from the design work: `../design/export_content.py` writes `src/seed/content.json`; images are in `src/seed/media`. Re-running `npm run seed` replaces departments, specialists, offices and media.

## Deploying to Vercel

Locally the site uses the SQLite file `sh-medical.db`. On Vercel it uses Neon Postgres and Vercel Blob, chosen automatically from the environment variables.

1. In the Vercel project, open **Storage** and connect a **Neon Postgres** database and a **Blob** store. They add `DATABASE_URL` (a `postgres://` URL) and `BLOB_READ_WRITE_TOKEN`.
2. In **Settings → Environment Variables**, add `PAYLOAD_SECRET`: a long random string, different from the local one. One way to make it: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Redeploy. Vercel runs `npm run vercel-build`, which:
   - applies database migrations (`payload migrate`)
   - loads the content and images, only if the database has no departments yet, so edits made in /admin are never overwritten
   - builds the site
4. Open `/admin` on the live site straight away and create the first user.

Changing a collection's fields? Run `npm run payload migrate:create <name>` with `DATABASE_URL` set to any `postgres://` URL, and commit the new file in `src/migrations`.

## The booking form doesn't send anything yet

Appointment requests contain health information, so they must only go to a HIPAA-compliant form service covered by a BAA. Until one is chosen, `/book` walks through all four steps but sends nothing, and the last step says so and gives the department's phone number. To switch it on, send the data to that service where `next()` in `src/app/(frontend)/book/BookingForm.tsx` has its TODO, and set `NEXT_PUBLIC_BOOKING_ENABLED=true`.

## Before launch

- Postgres and hosting covered by a BAA; real admin users; email adapter for Payload.
- Replace stand-in photos (see `../design/stock/SOURCES.md`); department logos for Dermatology, Surgery and Wellness; Dermatology and Wellness content (bracketed placeholders on their pages).
- Bios for 12 specialists, and the facts marked "[to confirm]" (listed in `../PLAN.md`).
- 301 redirects from the old specialty domains and sh.health URLs.
