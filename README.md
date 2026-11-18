# 54 Law Partners — Backend and Admin Dashboard

Two applications plus the specification they were built from.

```
server/          Express + MongoDB API, Cloudinary storage       :5000
admin/           Next.js + Tailwind CSS publishing dashboard     :3001
Frontend/        The public website (Next.js)                    :3000
ADMIN-SPEC.md    The content model and what the dashboard does
```

---

## Start here

Read `ADMIN-SPEC.md` first. It defines every collection and field, and the
server models are generated from it — if something needs to change, change it
there first.

Then:

```bash
cd server
npm install
cp .env.example .env     # fill in the values marked FILL IN
npm run seed
npm run dev              # http://localhost:5000/api/health
```

In a second terminal:

```bash
cd admin
npm install
cp .env.example .env.local
npm run dev              # http://localhost:3001
```

Sign in with the account `npm run seed` created, change the password under
**Your account**, then blank `SEED_ADMIN_PASSWORD` out of `server/.env`.

---

## What you need to supply

Everything secret is in `server/.env`:

- `MONGODB_URI` — MongoDB Atlas or a local instance
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — two different random strings
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` — used once

`admin/.env.local` holds the API URL and the app name. Neither is secret, and
nothing secret may go there: Next.js compiles `NEXT_PUBLIC_` values into the
JavaScript the browser downloads.

`CORS_ORIGINS` in `server/.env` must list the dashboard's origin
(`http://localhost:3001` in development) and the public site's.

---

## Three things that need the firm's answer

These are in the spec in more detail, but they block launch, not development:

1. **Data protection registration.** The system stores enquiries and CVs from
   identifiable people. Kenya's Data Protection Act, 2019 requires a registered
   data controller, and the privacy policy has to match what the system does.
   Retention periods are configurable so they can match whatever the firm
   publishes.

2. **The enquiry-form notice.** The wording saying that submitting the form
   creates no lawyer–client relationship. Stored in Settings; the firm writes it.

3. **Representative matters.** The firm supplies and approves every one, and
   confirms how much detail may be published. Nothing in this system invents
   them.

---

The dashboard uses the same palette as the public site, so the firm never feels
it has left its own brand when it signs in.
