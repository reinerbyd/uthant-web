# Deploying U Thant

Production-ready Next.js 15 app. Content, uploads and the admin panel persist to a
writable **data directory** (`DATA_DIR`) — point it at a persistent disk in production.

## Environment variables

| Var | Required | Purpose |
|-----|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your domain — drives canonical, OpenGraph, sitemap, robots |
| `ADMIN_PASSWORD` | ✅ | Admin login password (change from the default!) |
| `ADMIN_SESSION_SECRET` | ✅ | Long random string for the session cookie |
| `DATA_DIR` | ✅ (prod) | Writable path for `content.json` + `uploads/` (e.g. `/data`) |

See `.env.example`.

## Render (recommended — Blueprint)

1. Push this folder to a GitHub repo (its root should be this `web/` app).
2. In Render → **New → Blueprint**, pick the repo. `render.yaml` provisions a
   Docker web service on the **Free** plan (no disk).
3. Set `NEXT_PUBLIC_SITE_URL` and `ADMIN_PASSWORD` in the dashboard
   (`ADMIN_SESSION_SECRET` is auto-generated).
4. Deploy. Admin panel: `https://your-domain/admin`.

> **Persistence:** the Free plan has no persistent disk, so admin content edits +
> uploads reset on each redeploy/restart (the site still works from baked-in
> defaults). To persist them, upgrade to a paid plan and re-add the `disk:` block
> shown at the bottom of `render.yaml`.

## Railway

1. New project → Deploy from GitHub repo.
2. Add a **Volume** mounted at `/data`; set `DATA_DIR=/data`.
3. Add `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
4. Railway auto-detects the `Dockerfile` and builds.

## Docker (any host / VPS)

```bash
docker build -t uthant .
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  -e ADMIN_PASSWORD='a-strong-password' \
  -e ADMIN_SESSION_SECRET='a-long-random-string' \
  -e DATA_DIR=/data \
  -v uthant-data:/data \
  uthant
```

The named volume `uthant-data` persists content + uploads across restarts/redeploys.

## Notes

- **Uploads** (admin images/brochure) are stored in `DATA_DIR/uploads` and served via
  `/api/uploads/<file>` — no reliance on the read-only app filesystem.
- **Contact form** (`/api/contact`) currently logs the enquiry — wire a transport
  (Resend/SendGrid/CRM/webhook) for real delivery.
- **Imagery** is Unsplash placeholder; swap for licensed photography. To load images
  from a new external host, add it to `images.remotePatterns` in `next.config.mjs`.
- Vercel/other serverless: the filesystem is read-only, so the admin won't persist —
  use a long-running host (above) or swap `lib/store.ts` for a DB/blob.
