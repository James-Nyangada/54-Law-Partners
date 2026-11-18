import { TitleCell } from '@/components/DataTable';
import { TypeBadge } from '@/components/Badges';
import { Badge } from '@/components/ui';
import {
  TextField,
  TextArea,
  SelectField,
  CheckboxField,
  DateField,
  ListField,
  PairListField,
  RelationField,
  AssetField,
} from '@/components/fields';

/**
 * Each resource declares its endpoint, its list columns and its two field
 * groups. ResourceList and ResourceForm do the rest. Adding a content type is
 * a config block here plus two one-line route files under app/(dashboard).
 */

const localeLabel = (item, locale = 'en') => item?.[locale]?.title || item?.[locale]?.name;

const asOptions = (items, label = (item) => localeLabel(item) || item.slug) =>
  (items ?? []).map((item) => ({ value: item.id, label: label(item) }));

const none = <span className="text-muted">—</span>;
const formatDate = (value) => new Date(value).toLocaleDateString('en-GB');

/* ------------------------------------------------------------------ */
/* Articles                                                            */
/* ------------------------------------------------------------------ */

export const articles = {
  key: 'articles',
  singular: 'Article',
  plural: 'Insights',
  path: '/insights',
  endpoint: '/admin/articles',
  lookups: { areas: '/admin/practice-areas?limit=50', lawyers: '/admin/lawyers?limit=50' },
  blank: () => ({ type: 'firm', status: 'draft', en: {}, fr: {} }),

  filterParam: 'type',
  filterLabel: 'All types',
  filterOptions: [
    { value: 'firm', label: 'Firm articles' },
    { value: 'external', label: 'External pieces' },
  ],

  columns: [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <TitleCell
          href={`/insights/${row.id}`}
          title={row.en?.title}
          status={row.status}
          subtitle={row.practiceArea ? localeLabel(row.practiceArea) : null}
        />
      ),
    },
    { key: 'type', header: 'Type', width: 110, render: (row) => <TypeBadge type={row.type} /> },
    { key: 'author', header: 'Author', width: 180, render: (row) => row.author?.en?.name || none },
    {
      key: 'fr',
      header: 'FR',
      width: 70,
      render: (row) => (row.fr?.title ? <Badge tone="published">Yes</Badge> : <Badge>No</Badge>),
    },
    {
      key: 'publishedAt',
      header: 'Date',
      width: 130,
      render: (row) => (row.publishedAt ? formatDate(row.publishedAt) : none),
    },
  ],

  translated: ({ form, set, errors }, locale) => (
    <>
      <TextField
        label="Title"
        value={form[locale]?.title}
        onChange={(value) => set(`${locale}.title`, value)}
        error={errors[`${locale}.title`]}
      />
      <TextArea
        label="Standfirst"
        value={form[locale]?.standfirst}
        onChange={(value) => set(`${locale}.standfirst`, value)}
        hint="One or two sentences, shown under the headline and on the cards."
      />
      {form.type !== 'external' && (
        <TextArea
          label="Body"
          tall
          value={form[locale]?.body}
          onChange={(value) => set(`${locale}.body`, value)}
          hint="HTML is accepted. Paste from a document and tidy the headings."
        />
      )}
      <TextField
        label="SEO title"
        value={form[locale]?.seoTitle}
        onChange={(value) => set(`${locale}.seoTitle`, value)}
        error={errors[`${locale}.seoTitle`]}
        hint="Up to 70 characters. Leave empty to use the title."
      />
      <TextArea
        label="SEO description"
        value={form[locale]?.seoDescription}
        onChange={(value) => set(`${locale}.seoDescription`, value)}
        error={errors[`${locale}.seoDescription`]}
        hint="Up to 180 characters. This is what shows in search results."
      />
    </>
  ),

  shared: ({ form, set, lookups, errors }) => (
    <>
      <SelectField
        label="Type"
        value={form.type}
        onChange={(value) => set('type', value || 'firm')}
        placeholder="Firm article"
        options={[
          { value: 'firm', label: 'Firm article — lives on the site' },
          { value: 'external', label: 'External — links out to a publisher' },
        ]}
      />

      {form.type === 'external' && (
        <>
          <TextField
            label="Publication"
            value={form.externalSource}
            onChange={(value) => set('externalSource', value)}
            hint="Shown on the card in place of the practice area tag."
          />
          <TextField
            label="Link"
            value={form.externalUrl}
            onChange={(value) => set('externalUrl', value)}
            error={errors.externalUrl}
            placeholder="https://"
          />
        </>
      )}

      <SelectField
        label="Practice area"
        value={form.practiceArea?.id ?? form.practiceArea}
        onChange={(value) => set('practiceArea', value)}
        options={asOptions(lookups.areas)}
      />

      <SelectField
        label="Author"
        value={form.author?.id ?? form.author}
        onChange={(value) => set('author', value)}
        options={asOptions(lookups.lawyers, (item) => item.en?.name || item.slug)}
      />

      <TextField
        label="Address (slug)"
        value={form.slug}
        onChange={(value) => set('slug', value)}
        hint="Generated from the English title. Changing it after publishing breaks existing links."
      />

      <AssetField label="Hero image" folder="articles" value={form.heroImage} onChange={(value) => set('heroImage', value)} />

      {form.type !== 'external' && (
        <AssetField
          label="PDF brief"
          kind="document"
          value={form.pdfBrief}
          onChange={(value) => set('pdfBrief', value)}
          hint="Optional. Shown as a download block inside the article."
        />
      )}

      <CheckboxField label="Feature on the Insights index" value={form.featured} onChange={(value) => set('featured', value)} />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Practice areas                                                      */
/* ------------------------------------------------------------------ */

export const practiceAreas = {
  key: 'practice-areas',
  singular: 'Practice area',
  plural: 'Practice areas',
  path: '/practice-areas',
  endpoint: '/admin/practice-areas',
  lookups: { lawyers: '/admin/lawyers?limit=50' },
  blank: () => ({ pillar: 'transactions', status: 'draft', order: 0, en: {}, fr: {} }),

  columns: [
    {
      key: 'title',
      header: 'Area',
      render: (row) => <TitleCell href={`/practice-areas/${row.id}`} title={row.en?.title} status={row.status} />,
    },
    { key: 'pillar', header: 'Pillar', width: 160, render: (row) => <Badge>{row.pillar}</Badge> },
    { key: 'order', header: 'Order', width: 80 },
    { key: 'lawyers', header: 'Lawyers', width: 110, render: (row) => row.lawyers?.length ?? 0 },
  ],

  translated: ({ form, set }, locale) => (
    <>
      <TextField label="Title" value={form[locale]?.title} onChange={(value) => set(`${locale}.title`, value)} />
      <TextArea
        label="Introduction"
        value={form[locale]?.intro}
        onChange={(value) => set(`${locale}.intro`, value)}
        hint="Two sentences under the heading."
      />
      <TextArea label="Overview" tall value={form[locale]?.overview} onChange={(value) => set(`${locale}.overview`, value)} />
      <ListField
        label="Who we act for"
        value={form[locale]?.whoWeActFor}
        onChange={(value) => set(`${locale}.whoWeActFor`, value)}
        placeholder="A kind of client"
      />
      <ListField
        label="What we do"
        value={form[locale]?.whatWeDo}
        onChange={(value) => set(`${locale}.whatWeDo`, value)}
        placeholder="A service or capability"
      />
      <TextField label="SEO title" value={form[locale]?.seoTitle} onChange={(value) => set(`${locale}.seoTitle`, value)} />
      <TextArea
        label="SEO description"
        value={form[locale]?.seoDescription}
        onChange={(value) => set(`${locale}.seoDescription`, value)}
      />
    </>
  ),

  shared: ({ form, set, lookups }) => (
    <>
      <SelectField
        label="Pillar"
        value={form.pillar}
        onChange={(value) => set('pillar', value || 'transactions')}
        placeholder="Transactions and advisory"
        options={[
          { value: 'transactions', label: 'I · Transactions and advisory' },
          { value: 'disputes', label: 'II · Disputes' },
          { value: 'international', label: 'III · International law' },
        ]}
      />
      <TextField
        label="Order"
        type="number"
        value={form.order ?? 0}
        onChange={(value) => set('order', Number(value))}
        hint="Lower numbers come first within the pillar."
      />
      <TextField label="Address (slug)" value={form.slug} onChange={(value) => set('slug', value)} />
      <AssetField label="Hero image" folder="practice" value={form.heroImage} onChange={(value) => set('heroImage', value)} />
      <AssetField
        label="Hover thumbnail"
        folder="practice"
        value={form.thumbnail}
        onChange={(value) => set('thumbnail', value)}
        hint="Shown beside the row on the home page."
      />
      <RelationField
        label="Lawyers in this area"
        value={form.lawyers}
        onChange={(value) => set('lawyers', value)}
        options={asOptions(lookups.lawyers, (item) => item.en?.name || item.slug)}
      />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Lawyers                                                             */
/* ------------------------------------------------------------------ */

export const lawyers = {
  key: 'lawyers',
  singular: 'Profile',
  plural: 'Our people',
  path: '/people',
  endpoint: '/admin/lawyers',
  lookups: { areas: '/admin/practice-areas?limit=50' },
  blank: () => ({ status: 'draft', order: 0, en: {}, fr: {} }),

  columns: [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <TitleCell href={`/people/${row.id}`} title={row.en?.name} status={row.status} subtitle={row.en?.role} />
      ),
    },
    { key: 'order', header: 'Order', width: 80 },
    {
      key: 'areas',
      header: 'Practice areas',
      render: (row) => row.practiceAreas?.map((area) => localeLabel(area)).join(', ') || none,
    },
  ],

  translated: ({ form, set }, locale) => (
    <>
      <TextField label="Name" value={form[locale]?.name} onChange={(value) => set(`${locale}.name`, value)} />
      <TextField label="Role" value={form[locale]?.role} onChange={(value) => set(`${locale}.role`, value)} />
      <TextArea label="Biography" tall value={form[locale]?.bio} onChange={(value) => set(`${locale}.bio`, value)} />
      <PairListField
        label="Education and qualifications"
        value={form[locale]?.qualifications}
        onChange={(value) => set(`${locale}.qualifications`, value)}
      />
      <ListField
        label="Publications and speaking"
        value={form[locale]?.publications}
        onChange={(value) => set(`${locale}.publications`, value)}
      />
      <TextField label="SEO title" value={form[locale]?.seoTitle} onChange={(value) => set(`${locale}.seoTitle`, value)} />
      <TextArea
        label="SEO description"
        value={form[locale]?.seoDescription}
        onChange={(value) => set(`${locale}.seoDescription`, value)}
      />
    </>
  ),

  shared: ({ form, set, lookups, errors }) => (
    <>
      <AssetField label="Portrait" folder="people" value={form.portrait} onChange={(value) => set('portrait', value)} />
      <TextField label="Order" type="number" value={form.order ?? 0} onChange={(value) => set('order', Number(value))} />
      <TextField label="Address (slug)" value={form.slug} onChange={(value) => set('slug', value)} />
      <TextField label="Email" type="email" value={form.email} onChange={(value) => set('email', value)} error={errors.email} />
      <TextField label="Telephone" value={form.phone} onChange={(value) => set('phone', value)} />
      <ListField label="Admitted in" value={form.admissions} onChange={(value) => set('admissions', value)} placeholder="A jurisdiction" />
      <ListField label="Appears before" value={form.forums} onChange={(value) => set('forums', value)} placeholder="A court or tribunal" />
      <ListField label="Languages" value={form.languages} onChange={(value) => set('languages', value)} placeholder="A language" />
      <RelationField
        label="Practice areas"
        value={form.practiceAreas}
        onChange={(value) => set('practiceAreas', value)}
        options={asOptions(lookups.areas)}
      />
      <AssetField
        label="CV"
        kind="document"
        value={form.cv}
        onChange={(value) => set('cv', value)}
        hint="Optional, offered as a download on the profile."
      />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Matters                                                             */
/* ------------------------------------------------------------------ */

export const matters = {
  key: 'matters',
  singular: 'Matter',
  plural: 'Representative matters',
  path: '/matters',
  endpoint: '/admin/matters',
  lookups: { areas: '/admin/practice-areas?limit=50' },
  blank: () => ({ status: 'draft', order: 0, en: {}, fr: {} }),
  notice:
    'Matters are supplied and approved by the firm. Confirm what may be published before adding one, and keep the disclaimer in Settings up to date.',

  columns: [
    {
      key: 'description',
      header: 'Matter',
      render: (row) => (
        <TitleCell
          href={`/matters/${row.id}`}
          title={row.en?.description}
          status={row.status}
          subtitle={[row.en?.sector, row.en?.jurisdiction].filter(Boolean).join(' · ')}
        />
      ),
    },
    { key: 'order', header: 'Order', width: 80 },
    {
      key: 'areas',
      header: 'Practice areas',
      render: (row) => row.practiceAreas?.map((area) => localeLabel(area)).join(', ') || none,
    },
  ],

  translated: ({ form, set }, locale) => (
    <>
      <TextField label="Sector" value={form[locale]?.sector} onChange={(value) => set(`${locale}.sector`, value)} />
      <TextField
        label="Jurisdiction or forum"
        value={form[locale]?.jurisdiction}
        onChange={(value) => set(`${locale}.jurisdiction`, value)}
      />
      <TextField label="Our role" value={form[locale]?.role} onChange={(value) => set(`${locale}.role`, value)} />
      <TextArea
        label="The matter, in one sentence"
        value={form[locale]?.description}
        onChange={(value) => set(`${locale}.description`, value)}
        hint="No client names, and no figures unless the firm has confirmed they may be published."
      />
    </>
  ),

  shared: ({ form, set, lookups }) => (
    <>
      <TextField label="Order" type="number" value={form.order ?? 0} onChange={(value) => set('order', Number(value))} />
      <RelationField
        label="Practice areas"
        value={form.practiceAreas}
        onChange={(value) => set('practiceAreas', value)}
        options={asOptions(lookups.areas)}
      />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Jobs                                                                */
/* ------------------------------------------------------------------ */

export const jobs = {
  key: 'jobs',
  singular: 'Role',
  plural: 'Careers',
  path: '/careers',
  endpoint: '/admin/jobs',
  blank: () => ({ status: 'draft', location: 'Nairobi', employmentType: 'Full time', en: {}, fr: {} }),

  columns: [
    {
      key: 'title',
      header: 'Role',
      render: (row) => <TitleCell href={`/careers/${row.id}`} title={row.en?.title} status={row.status} subtitle={row.location} />,
    },
    { key: 'employmentType', header: 'Type', width: 140 },
    {
      key: 'closingDate',
      header: 'Closes',
      width: 140,
      render: (row) => (row.closingDate ? formatDate(row.closingDate) : <span className="text-muted">Open</span>),
    },
  ],

  translated: ({ form, set }, locale) => (
    <>
      <TextField label="Title" value={form[locale]?.title} onChange={(value) => set(`${locale}.title`, value)} />
      <TextArea label="Summary" value={form[locale]?.summary} onChange={(value) => set(`${locale}.summary`, value)} />
      <TextArea label="Description" tall value={form[locale]?.description} onChange={(value) => set(`${locale}.description`, value)} />
      <ListField
        label="Requirements"
        value={form[locale]?.requirements}
        onChange={(value) => set(`${locale}.requirements`, value)}
        placeholder="A requirement"
      />
    </>
  ),

  shared: ({ form, set }) => (
    <>
      <TextField label="Location" value={form.location} onChange={(value) => set('location', value)} />
      <TextField label="Employment type" value={form.employmentType} onChange={(value) => set('employmentType', value)} />
      <DateField label="Closing date" value={form.closingDate} onChange={(value) => set('closingDate', value)} />
      <TextField label="Address (slug)" value={form.slug} onChange={(value) => set('slug', value)} />
    </>
  ),
};

export const RESOURCES = { articles, 'practice-areas': practiceAreas, lawyers, matters, jobs };
