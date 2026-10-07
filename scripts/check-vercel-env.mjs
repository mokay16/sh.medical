// Run first in `npm run vercel-build`: stop the deploy with a clear message if Vercel is missing a setting,
// rather than building a site whose images or content silently go missing.
const missing = []
const db = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
if (!/^postgres(ql)?:\/\//.test(db)) missing.push('DATABASE_URL (a postgres:// URL; connect a Neon database under Storage)')
if (!process.env.BLOB_READ_WRITE_TOKEN) missing.push('BLOB_READ_WRITE_TOKEN (connect a Blob store under Storage, with the default BLOB prefix)')
if (!process.env.PAYLOAD_SECRET) missing.push('PAYLOAD_SECRET (add under Settings > Environment Variables)')

if (missing.length) {
  console.error('\nMissing Vercel environment variables:\n  - ' + missing.join('\n  - ') + '\n')
  process.exit(1)
}
console.log('Vercel environment OK: Postgres, Blob and Payload secret are set')
if (process.env.RESEED === 'true') console.log('RESEED=true: content and images will be wiped and reloaded. Remove RESEED after this deploy.')
else if (process.env.RESEED !== undefined) console.log(`RESEED is set to "${process.env.RESEED}", not "true": content will not be reloaded`)
else console.log('RESEED not set: existing content is kept')
