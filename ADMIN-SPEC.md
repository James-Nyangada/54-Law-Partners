# 54 Law Partners — Admin Dashboard Specification

Version 1.0 · 16 November 2026 · Afringe Limited

This document defines what the publishing dashboard does, who uses it, and the exact
shape of every piece of content it manages. The backend models and the admin screens
are both generated from what is written here — if something changes, change it here
first.

---

## 1. Why this exists

The firm said on the onboarding call that it will publish **weekly**. That single fact
decides the whole design: if publishing an article is awkward, it will not happen
weekly, and the Insights section — which is what makes a new firm look established —
goes stale within a month.

So the dashboard is built around one test: **can a non-technical person at the firm
publish an article, in two languages, with a PDF brief attached, in under ten minutes,
without calling a developer?**

Everything else is secondary.

---

## 2. Who uses it

| Role | Who | Can do |
| --- | --- | --- |
| `admin` | Ian, and one other partner | Everything, including managing users, settings and legal pages |
| `editor` | Whoever publishes weekly | Create and publish articles, edit lawyers, practice areas and matters; read enquiries |

Two roles is deliberate. More roles mean more administration for a firm of two
lawyers, and the firm can add them later if it grows.

**Not a role:** the public website. The site reads published content through a
read-only API, and never authenticates as a user.

---

## 3. What the dashboard contains

### 3.1 Dashboard (home)

The landing screen after login. Not analytics — a work queue:

- New enquiries awaiting a response, with a count
- New career applications, with a count
- Articles in draft
- The last five published items, with who published them
- A single prominent **New article** button

### 3.2 Insights

The screen that gets used most. Two kinds of entry, chosen on creation:

**Firm article** — written by the firm, lives on the site at its own URL.
**External piece** — published somewhere else, links out, never gets its own page.

The list shows type, title, practice area, author, status and date, and filters by each.

The editor is a two-tab form, **English** and **French**, with everything else shared
between them. A firm article needs: title, slug, standfirst, body, hero image,
practice area, author, optional PDF brief, publish date and status. An external piece
needs far less: title, publication name, external URL, practice area and date.

**French is never blocking.** An article can be published in English with the French
tab empty; the site then shows the English version at the French URL with a short
notice. If French were required, weekly publishing would stop the first busy week.

### 3.3 Practice areas

Eight fixed areas, ordered by drag handle within three pillars. Each has an intro,
overview, "who we act for" list, "what we do" list, hero image, thumbnail, SEO fields,
and links to the lawyers who lead it. Areas are rarely added — but adding a ninth is
content work here, not a rebuild.

### 3.4 Our people

Lawyer profiles. Portrait, role, biography, admissions, forums, languages, contact
details, qualifications, publications, practice areas, and an optional CV PDF.
Ordered by drag handle.

### 3.5 Representative matters

The experience synopsis the firm asked for. Each matter is four short fields — sector,
jurisdiction or forum, the firm's role, and one sentence — plus the practice areas it
belongs to. Matters appear on the home page and on their practice area pages.

A standing note sits above this list in the dashboard: *matters are supplied and
approved by the firm; confirm what may be published before adding one.*

### 3.6 Enquiries

Contact form submissions, read-only, with a status (new, read, replied, archived).
**No replying from inside the dashboard** — replies go from the firm's own email, so
that correspondence with a prospective client lives where the firm's records live, not
in a website database.

This is the most sensitive collection on the system. See §7.

### 3.7 Careers

Job openings, with an apply form if the Premier package is taken. Applications arrive
with a CV attached and a status. Same rule as enquiries: read, download, respond by
email.

### 3.8 Pages

The editable static pages: About, Careers introduction, and the four legal notices
(privacy policy, disclaimer, terms of use, cookie notice). Same bilingual tabs. These
change rarely but the firm must be able to change them — a privacy policy that needs a
developer is a privacy policy that goes out of date.

### 3.9 Media

A browsable list of everything uploaded to Cloudinary, with alt text in both languages.
Alt text is required for images used on the public site.

### 3.10 Settings and users

Firm name, address, telephone, email, office hours, practising details, the footer
notice, and the enquiry-form notice. Users: invite, deactivate, reset password.

---

## 4. Content model

Shared conventions:

- Every translatable document has `en` and `fr` sub-documents with identical shape.
- `status` is `draft` or `published`; the public API only ever returns `published`.
- `slug` is generated from the English title, editable, unique, and never changes
  silently once published.
- Every document carries `createdBy`, `updatedBy` and timestamps.
- Images and files are stored as `{ publicId, url, width, height, format, bytes }`.

### users
`name`, `email` (unique), `passwordHash`, `role` (`admin` | `editor`),
`isActive`, `lastLoginAt`, `invitedBy`.

### practiceareas
`pillar` (`transactions` | `disputes` | `international`), `order`, `slug`, `status`,
`heroImage`, `thumbnail`, `lawyers[]` → lawyer,
`en` / `fr`: `{ title, intro, overview, whoWeActFor[], whatWeDo[], seoTitle, seoDescription }`.

### lawyers
`order`, `slug`, `status`, `portrait`, `cv`, `email`, `phone`,
`languages[]`, `admissions[]`, `forums[]`, `practiceAreas[]` → practice area,
`en` / `fr`: `{ name, role, bio, qualifications[{ year, detail }], publications[], seoTitle, seoDescription }`.

### articles
`type` (`firm` | `external`), `slug`, `status`, `featured`, `publishedAt`,
`practiceArea` → practice area, `author` → lawyer, `heroImage`, `pdfBrief`,
`externalSource`, `externalUrl` (external only),
`en` / `fr`: `{ title, standfirst, body, seoTitle, seoDescription }`.

### matters
`order`, `status`, `practiceAreas[]` → practice area,
`en` / `fr`: `{ sector, jurisdiction, role, description }`.

### enquiries
`name`, `organisation`, `email`, `phone`, `areaOfLaw`, `message`,
`status` (`new` | `read` | `replied` | `archived`), `locale`, `submittedAt`.
No IP address and no tracking identifiers — see §7.

### jobs
`slug`, `status`, `location`, `employmentType`, `closingDate`,
`en` / `fr`: `{ title, summary, description, requirements[] }`.

### applications
`job` → job, `name`, `email`, `phone`, `coverNote`, `cv`,
`status` (`new` | `shortlisted` | `rejected` | `archived`).

### subscribers
`email` (unique), `locale`, `confirmed`, `confirmToken`, `unsubscribeToken`.
Double opt-in. Nothing is sent to an unconfirmed address.

### pages
`key` (`about` | `careers` | `privacy` | `disclaimer` | `terms` | `cookies`),
`en` / `fr`: `{ title, body, seoTitle, seoDescription }`.

### settings
Singleton. `firmName`, `address`, `phone`, `email`, `officeHours`,
`practisingDetails`, `footerNotice`, `enquiryNotice`, `social[]`.

### media
`publicId`, `url`, `resourceType`, `format`, `width`, `height`, `bytes`,
`folder`, `altEn`, `altFr`, `uploadedBy`.

### auditlogs
`user`, `action` (`create` | `update` | `delete` | `publish` | `login`),
`collection`, `documentId`, `summary`, `at`.

Audit logging is not optional on a law firm's system. If a published article is later
disputed, the firm needs to show who changed what and when.

---

## 5. Cloudinary

One account, four folders, so assets never collide:

| Folder | Holds | Notes |
| --- | --- | --- |
| `54lp/articles` | Hero images, article body images | Auto format and quality |
| `54lp/people` | Portraits | Face-aware crop on delivery |
| `54lp/practice` | Area hero images and hover thumbnails | |
| `54lp/documents` | PDF briefs, CVs | `resource_type: raw`, **private delivery** |

**Uploads are signed and server-side.** The admin app never holds the Cloudinary API
secret — it sends the file to the backend, the backend uploads it and returns the
stored asset. An unsigned browser upload preset would let anyone who finds the preset
name upload into the firm's account.

**CVs are not public.** They are uploaded as `type: authenticated` and served through a
short-lived signed URL generated by the backend when an authenticated admin asks for
one. A CV sitting on a guessable public URL is a data protection problem.

---

## 6. API surface

Two groups, from the same Express app.

**Public, read-only, no auth** — `/api/public/*`
Published content only: practice areas, lawyers, articles, matters, pages, settings,
plus `POST /enquiries`, `POST /applications` and `POST /subscribers`, each rate
limited.

**Admin, authenticated** — `/api/admin/*`
Full CRUD on every collection, uploads, audit log, user management.

Auth is JWT: a short-lived access token held in memory by the admin app, and a
long-lived refresh token in an httpOnly, SameSite=strict cookie. The access token is
never written to `localStorage`, where any injected script could read it.

---

## 7. The two things that need legal sign-off

These are the firm's obligations, not the developer's, but the build has to accommodate
whatever they decide — so get the answers in writing before launch.

**Data protection registration.** The site collects enquiry data and CVs from
identifiable people. Under Kenya's Data Protection Act, 2019, someone has to be
registered with the ODPC as a data controller, and the privacy policy has to match what
the system actually does. The dashboard supports this with a configurable retention
period and a delete function on enquiries and applications; the firm decides the
period.

**Conflict checking and privilege.** An enquiry form invites a stranger to describe
their matter before anyone has run a conflict check. That is why the form carries a
notice that submitting it creates no lawyer–client relationship, why the message field
is clearly labelled, and why replies happen in the firm's own email rather than here.
Ask Ian to supply the wording.

---

## 8. What is deliberately not built

- **No rich media library management beyond alt text.** Cloudinary's own console does
  this better.
- **No in-dashboard email replies.** Explained in §3.6.
- **No page builder.** Layouts are designed and fixed; the firm edits content, not
  structure. A page builder is how a carefully designed site becomes an ugly one within
  six months.
- **No comments.** Nothing good happens in the comments section of a law firm website.
- **No analytics dashboard.** Google Analytics is linked from the sidebar instead of
  rebuilt badly.
