# Mara Barquet Real Estate

Next landing site for a realtor with editable content, dynamic property search, WhatsApp lead capture, and an initial private administration route for publishing listings.

## Run

```bash
pnpm install
pnpm run dev
```

The public site runs at `http://localhost:3000` and the private CMS route is `http://localhost:3000/administracion`.

The administration area is not linked from public navigation. For local access, use the password `mara-demo` or define your own values in `.env.local`:

```bash
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=another-long-secret
```

## Content

Listings, leads, and uploaded property images use Supabase when the Supabase environment variables are configured. Without those variables, the app falls back to `data/properties.json`, `data/leads.json`, and `public/uploads` for local development.

### Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create a public Storage bucket named `property-images`.
4. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=property-images
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. It is used by the Next.js API routes and migration script, never by browser code.

To migrate the current JSON seed data after the schema exists:

```bash
pnpm supabase:migrate-json
```

## Developer Notes

Developer-facing route folders use English names, such as `src/app/admin` and `src/app/properties`. Next rewrites preserve the Spanish public URLs `/administracion` and `/propiedades/:id`.
