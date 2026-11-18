# 54 Law Partners — Backend

Express + MongoDB API serving both the public website and the admin dashboard.
Images and documents are stored in Cloudinary.

Built by Afringe Limited.

---

## Getting it running

**You need:** Node 20 or newer, a MongoDB database (Atlas free tier is fine),
and a Cloudinary account.

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in the values marked FILL IN. There are seven:

| Variable | Where it comes from |
| --- | --- |
| `MONGODB_URI` | Atlas → Database → Connect → Drivers |
| `JWT_ACCESS_SECRET` | Generate one, see below |
| `JWT_REFRESH_SECRET` | Generate a different one |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary console, dashboard |
| `CLOUDINARY_API_KEY` | Same page |
| `CLOUDINARY_API_SECRET` | Same page — this never leaves the server |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Your choice; used once |

Generate each secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then:

```bash
npm run seed    # creates your admin account, the 8 practice areas, page shells
npm run dev     # http://localhost:5000
```

Check it is alive: <http://localhost:5000/api/health>

Sign in at the dashboard, change the seeded password, then blank
`SEED_ADMIN_PASSWORD` out of `.env`.

---

## Layout

```
src/
  config/      env validation, database, Cloudinary
  models/      13 Mongoose models — the content model lives here
  middleware/  auth, validation, uploads, rate limits, error handling
  controllers/ auth, media, public API, admin API, and the CRUD factory
  routes/      public, auth, admin, content
  utils/       errors, slugs, pagination, tokens
  seed/        first run
```

### The CRUD factory

Five collections — practice areas, lawyers, articles, matters, jobs — behave
identically: list, search, filter, paginate, create, update, delete, reorder.
Rather than five near-identical controllers, `controllers/crudFactory.js`
builds them from a short config in `routes/content.routes.js`.

Anything with genuinely different behaviour has its own controller.

---

## API

Base path `/api`.

### Public — no authentication

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/public/practice-areas` | All published areas |
| GET | `/public/practice-areas/:slug` | One area, its matters and related articles |
| GET | `/public/lawyers` | All published profiles |
| GET | `/public/lawyers/:slug` | One profile and their articles |
| GET | `/public/articles` | Paginated; filter by `area`, `author`, `type` |
| GET | `/public/articles/:slug` | One article and three related |
| GET | `/public/matters` | Representative matters |
| GET | `/public/jobs` | Open roles |
| GET | `/public/pages/:key` | about, careers, privacy, disclaimer, terms, cookies |
| GET | `/public/settings` | Firm details and notices |
| POST | `/public/enquiries` | Contact form — rate limited |
| POST | `/public/applications` | Career application with CV — rate limited |
| POST | `/public/subscribers` | Newsletter sign-up — rate limited |

Every read is pinned to `status: 'published'`. Drafts cannot leak.

### Admin — authenticated

`/admin/auth/login`, `/refresh`, `/logout`, `/me`, `/password`, then full CRUD
on `/admin/articles`, `/practice-areas`, `/lawyers`, `/matters`, `/jobs`, plus
`/enquiries`, `/applications`, `/media`, `/pages`, `/settings`, `/subscribers`,
`/audit` and `/users`.

---

## How authentication works

A short-lived access token (15 minutes) goes in the `Authorization` header and
is held **in memory** by the admin app. A long-lived refresh token (7 days)
goes in an httpOnly, SameSite=strict cookie.

The access token is deliberately not in `localStorage`: anything stored there
can be read by any script that gets injected into the page. The refresh cookie
cannot be read by JavaScript at all.

Changing a password bumps `tokenVersion`, which retires every refresh token
issued before it — so changing a password after a suspected compromise actually
signs the intruder out.

---

## Cloudinary

Four folders under the root: `articles`, `people`, `practice`, `documents`.

Uploads are **signed and server-side**. The browser sends a file to the API;
the API uploads it. An unsigned browser preset would let anyone who found the
preset name upload into the firm's account.

CVs go up as `authenticated` assets and are served only through a signed URL
that expires in ten minutes. A CV on a guessable public URL is a data
protection problem.

---

## Two things the firm must decide

**Data protection registration.** The site collects enquiry data and CVs from
identifiable people. Under Kenya's Data Protection Act, 2019 someone has to be
registered with the ODPC as a data controller, and the privacy policy has to
describe what this system actually does. `ENQUIRY_RETENTION_DAYS` and
`APPLICATION_RETENTION_DAYS` exist so the firm can set a retention period that
matches the published policy — they default to 0, meaning no retention flag.

**The enquiry notice.** The form invites a stranger to describe a matter before
anyone has run a conflict check. The wording of the notice saying this creates
no lawyer–client relationship is the firm's to supply; it is stored in Settings.

---

## Deployment notes

- Set `NODE_ENV=production`. Secure cookies depend on it.
- Set `COOKIE_DOMAIN` to your domain, e.g. `.54partners.org`.
- Set `CORS_ORIGINS` to the real admin and site origins. Nothing else may call
  the API with credentials.
- Create indexes deliberately rather than letting Mongoose autoIndex in
  production — `config/db.js` already turns it off there.
- Put the API behind HTTPS. The refresh cookie will not be sent otherwise.
