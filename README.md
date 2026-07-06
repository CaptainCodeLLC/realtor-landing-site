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

Listings are stored in `data/properties.json` and contact requests are stored in `data/leads.json`. This layer is isolated in `src/lib/cms.ts` so it can later be replaced by an external CMS or a full administration dashboard.

## Developer Notes

Developer-facing route folders use English names, such as `src/app/admin` and `src/app/properties`. Next rewrites preserve the Spanish public URLs `/administracion` and `/propiedades/:id`.
