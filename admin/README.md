# 54 Law Partners — Admin Dashboard

The publishing dashboard the firm uses to run the website. Next.js (App Router)
and Tailwind CSS, talking to the Express + MongoDB API in `../server`.

Built by Afringe Limited.

---

## Getting it running

Start the server first (see `../server/README.md`), then:

```bash
cd admin
npm install
cp .env.example .env.local
npm run dev     # http://localhost:3001
```

The public site runs on 3000, so the dashboard uses 3001. The server's
`CORS_ORIGINS` must include whichever origin the dashboard is served from.

`.env.local` holds two values, neither of them secret:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=54 Law Partners
```

Anything prefixed `NEXT_PUBLIC_` is compiled into the JavaScript at build time
and visible to anyone who opens the page. **Never put a key here.** Change
them, then rebuild.

Sign in with the account created by `npm run seed` in the server, then change
its password under **Your account**.

---

## What it does

| Screen | Purpose |
| --- | --- |
| Dashboard | The work queue: new enquiries, new applications, drafts |
| Insights | Articles. Firm pieces and external links, in both languages |
| Practice areas | The eight areas, their copy and their lawyers |
| Our people | Lawyer profiles |
| Representative matters | The experience synopsis |
| Pages | About, Careers intro, and the four legal notices |
| Enquiries | Read and triage contact submissions |
| Careers / Applications | Open roles, and applications with CVs |
| Media | Everything uploaded, with alt text |
| Settings | Firm details and the standing notices (admin only) |
| Users | Accounts, roles, password resets (admin only) |
| Your account | Change your own password |

Two roles. `editor` publishes content and reads the inbox. `admin` does that
plus settings, users and deletions. The API enforces every permission; the
dashboard only hides what you cannot use.

---

## How it is put together

```
app/
  layout.jsx             fonts, metadata (noindex), providers
  globals.css            Tailwind, and the brand palette as theme tokens
  login/                 sign-in
  (dashboard)/           everything behind sign-in
    layout.jsx           the session check and the shell
    insights/ …          one thin route file per screen
lib/
  api.js                 fetch wrapper, in-memory token, silent refresh
  auth.jsx               AuthProvider, useAuth, RequireAdmin
  resources.jsx          where each content type is declared
  forms.js               payload and form-state helpers
  useQueryParams.js      filters and paging kept in the URL
components/
  ui.jsx                 Button, Card, Notice, Badge, input classes
  Shell.jsx              sidebar, topbar, inbox counts, mobile menu
  ResourceList.jsx       one list screen for every content type
  ResourceForm.jsx       one editor for every content type
  BilingualTabs.jsx      the EN / FR switch
  fields/                text, list, relation, asset, date fields
  screens/               the screens that are not generic CRUD
```

### Styling

Tailwind 4, configured in CSS. The palette is declared once in
`app/globals.css` under `@theme`, which turns each colour into a utility —
`bg-panel`, `text-mint`, `border-line-raised`. Repeated patterns (buttons,
cards, inputs) live in `components/ui.jsx` so they are written once.

### Authentication

Everything is rendered in the browser. The access token lives in memory only
— never `localStorage` — and the refresh token is an httpOnly cookie the
server sets. On load the dashboard trades the cookie for a token; until that
settles, nothing behind sign-in renders.

### The resource pattern

Articles, practice areas, lawyers, matters and jobs are each declared once in
`lib/resources.jsx` — endpoint, list columns, shared fields, translated
fields — and `ResourceList` plus `ResourceForm` do the rest. Adding a content
type is a config block plus two one-line route files.

---

## Two decisions worth knowing about

**French is never required.** The firm publishes weekly. If an article could not
go live until someone had translated it, the weekly cadence would die in its
third week. Leave the French tab empty and the site shows English at the French
address.

**Enquiries cannot be replied to from here.** Replies go from the firm's own
email so correspondence with a prospective client sits in the firm's records,
not in a website database. The dashboard reads and triages; that is all.

---

## Building for production

```bash
npm run build
npm start         # next start on port 3001
```

Deploy to Vercel or any Node host. Three things to get right:

1. `NEXT_PUBLIC_API_URL` must point at the production API **before** building.
2. The API's `CORS_ORIGINS` must include the dashboard's origin.
3. Both must be on HTTPS, and on the same site (e.g. `admin.54partners.org`
   and `api.54partners.org`), or the SameSite=strict refresh cookie will not
   be sent and nobody will stay signed in.

The dashboard sends `noindex, nofollow` and refuses to be framed. Keep it on a
subdomain that is not linked from the public site.
