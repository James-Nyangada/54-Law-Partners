import mongoose from 'mongoose';
import { assetSchema, seoFields, contentPlugin } from './shared.js';

export const ARTICLE_TYPES = ['firm', 'external'];

const translatedSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    standfirst: { type: String, trim: true },
    body: { type: String }, // HTML from the editor
    ...seoFields,
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema({
  type: { type: String, enum: ARTICLE_TYPES, default: 'firm', required: true, index: true },

  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  featured: { type: Boolean, default: false, index: true },

  practiceArea: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeArea', index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', index: true },

  heroImage: assetSchema,
  pdfBrief: assetSchema,

  // External pieces only. A piece published elsewhere never gets a page of its
  // own on the site — the card links straight out to the publisher.
  externalSource: { type: String, trim: true },
  externalUrl: { type: String, trim: true },

  en: { type: translatedSchema, default: () => ({}) },
  fr: { type: translatedSchema, default: () => ({}) },
});

articleSchema.plugin(contentPlugin);

// The Insights index is sorted newest first and filtered by area, so this is
// the one index that genuinely earns its place.
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ practiceArea: 1, status: 1, publishedAt: -1 });

articleSchema.pre('validate', function requireExternalUrl(next) {
  if (this.type === 'external' && !this.externalUrl) {
    return next(new Error('An external piece needs the URL it links out to.'));
  }
  next();
});

/** True when the French version has enough to publish on its own. */
articleSchema.virtual('hasFrench').get(function hasFrench() {
  return Boolean(this.fr?.title && (this.type === 'external' || this.fr?.body));
});

export const Article = mongoose.model('Article', articleSchema);
