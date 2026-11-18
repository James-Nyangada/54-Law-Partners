import { z } from 'zod';
import { PILLARS } from '../models/PracticeArea.js';
import { ARTICLE_TYPES } from '../models/Article.js';
import { ENQUIRY_STATUS } from '../models/Enquiry.js';
import { APPLICATION_STATUS } from '../models/Application.js';
import { ROLES } from '../models/User.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'That reference is not valid');
const optionalId = objectId.optional().nullable();
const status = z.enum(['draft', 'published']);
const text = (max = 500) => z.string().trim().max(max);
const seo = {
  seoTitle: text(70).optional(),
  seoDescription: text(180).optional(),
};

const asset = z
  .object({
    publicId: z.string(),
    url: z.string().url(),
    resourceType: z.string().optional(),
    format: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    bytes: z.number().optional(),
    access: z.enum(['public', 'authenticated']).optional(),
    altEn: z.string().optional(),
    altFr: z.string().optional(),
  })
  .partial({ resourceType: true })
  .nullable()
  .optional();

/* --- auth ---------------------------------------------------------- */

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: z
    .string()
    .min(12, 'Use at least 12 characters')
    .max(200, 'That is too long'),
});

/* --- practice areas ------------------------------------------------ */

const practiceAreaTranslated = z.object({
  title: text(160).optional(),
  intro: text(600).optional(),
  overview: text(8000).optional(),
  whoWeActFor: z.array(text(200)).max(12).optional(),
  whatWeDo: z.array(text(300)).max(20).optional(),
  ...seo,
});

export const practiceAreaSchema = z.object({
  pillar: z.enum(PILLARS),
  order: z.number().int().optional(),
  slug: text(160).optional(),
  status: status.optional(),
  heroImage: asset,
  thumbnail: asset,
  lawyers: z.array(objectId).optional(),
  en: practiceAreaTranslated.optional(),
  fr: practiceAreaTranslated.optional(),
});

/* --- lawyers ------------------------------------------------------- */

const lawyerTranslated = z.object({
  name: text(160).optional(),
  role: text(160).optional(),
  bio: text(8000).optional(),
  qualifications: z
    .array(z.object({ year: text(20).optional(), detail: text(300).optional() }))
    .max(20)
    .optional(),
  publications: z.array(text(400)).max(30).optional(),
  ...seo,
});

export const lawyerSchema = z.object({
  order: z.number().int().optional(),
  slug: text(160).optional(),
  status: status.optional(),
  portrait: asset,
  cv: asset,
  email: z.string().trim().email().optional().or(z.literal('')),
  phone: text(60).optional(),
  languages: z.array(text(60)).max(12).optional(),
  admissions: z.array(text(160)).max(12).optional(),
  forums: z.array(text(200)).max(20).optional(),
  practiceAreas: z.array(objectId).optional(),
  en: lawyerTranslated.optional(),
  fr: lawyerTranslated.optional(),
});

/* --- articles ------------------------------------------------------ */

const articleTranslated = z.object({
  title: text(240).optional(),
  standfirst: text(600).optional(),
  body: z.string().max(200000).optional(),
  ...seo,
});

export const articleSchema = z
  .object({
    type: z.enum(ARTICLE_TYPES).optional(),
    slug: text(240).optional(),
    status: status.optional(),
    featured: z.boolean().optional(),
    publishedAt: z.coerce.date().optional().nullable(),
    practiceArea: optionalId,
    author: optionalId,
    heroImage: asset,
    pdfBrief: asset,
    externalSource: text(200).optional(),
    externalUrl: z.string().trim().url('Enter the full link').optional().or(z.literal('')),
    en: articleTranslated.optional(),
    fr: articleTranslated.optional(),
  })
  .refine(
    (value) => value.type !== 'external' || Boolean(value.externalUrl),
    { message: 'An external piece needs the link it points to', path: ['externalUrl'] }
  );

/* --- matters ------------------------------------------------------- */

const matterTranslated = z.object({
  sector: text(160).optional(),
  jurisdiction: text(200).optional(),
  role: text(200).optional(),
  description: text(600).optional(),
});

export const matterSchema = z.object({
  order: z.number().int().optional(),
  status: status.optional(),
  practiceAreas: z.array(objectId).optional(),
  en: matterTranslated.optional(),
  fr: matterTranslated.optional(),
});

/* --- jobs ---------------------------------------------------------- */

const jobTranslated = z.object({
  title: text(200).optional(),
  summary: text(600).optional(),
  description: z.string().max(40000).optional(),
  requirements: z.array(text(300)).max(30).optional(),
  ...seo,
});

export const jobSchema = z.object({
  slug: text(200).optional(),
  status: status.optional(),
  location: text(120).optional(),
  employmentType: text(60).optional(),
  closingDate: z.coerce.date().optional().nullable(),
  en: jobTranslated.optional(),
  fr: jobTranslated.optional(),
});

/* --- pages and settings -------------------------------------------- */

const pageTranslated = z.object({
  title: text(200).optional(),
  body: z.string().max(200000).optional(),
  ...seo,
});

export const pageSchema = z.object({
  status: status.optional(),
  en: pageTranslated.optional(),
  fr: pageTranslated.optional(),
});

const settingsTranslated = z.object({
  enquiryNotice: text(2000).optional(),
  practisingDetails: text(2000).optional(),
  officeHours: text(300).optional(),
});

export const settingsSchema = z.object({
  firmName: text(160).optional(),
  addressLines: z.array(text(200)).max(6).optional(),
  phone: text(60).optional(),
  email: z.string().trim().email().optional().or(z.literal('')),
  notifyEmail: z.string().trim().email().optional().or(z.literal('')),
  social: z.array(z.object({ label: text(60), url: z.string().url() })).max(8).optional(),
  en: settingsTranslated.optional(),
  fr: settingsTranslated.optional(),
});

/* --- triage -------------------------------------------------------- */

export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUS).optional(),
  internalNote: text(2000).optional(),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(APPLICATION_STATUS).optional(),
  internalNote: text(2000).optional(),
});

/* --- users --------------------------------------------------------- */

export const userCreateSchema = z.object({
  name: text(160).min(1, 'Enter a name'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(12, 'Use at least 12 characters'),
  role: z.enum(ROLES).default('editor'),
});

export const userUpdateSchema = z.object({
  name: text(160).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(12, 'Use at least 12 characters').optional(),
});

/* --- public submissions -------------------------------------------- */

export const publicEnquirySchema = z.object({
  name: text(160).min(1, 'Enter your name'),
  organisation: text(160).optional(),
  email: z.string().trim().email('Enter a valid email address'),
  phone: text(60).optional(),
  areaOfLaw: text(160).optional(),
  message: text(5000).min(10, 'Tell us a little about the matter'),
  locale: z.enum(['en', 'fr']).optional(),
});

export const publicSubscribeSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  locale: z.enum(['en', 'fr']).optional(),
});

export const reorderSchema = z.object({
  items: z.array(z.object({ id: objectId, order: z.number().int() })).min(1),
});
