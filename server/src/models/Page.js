import mongoose from 'mongoose';
import { seoFields, contentPlugin } from './shared.js';

export const PAGE_KEYS = ['about', 'careers', 'privacy', 'disclaimer', 'terms', 'cookies'];

const translatedSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    body: { type: String },
    ...seoFields,
  },
  { _id: false }
);

/**
 * The editable standing pages: About, the Careers introduction, and the four
 * legal notices. The firm must be able to change a privacy policy without a
 * developer — a policy that needs a deployment is a policy that goes stale.
 */
const pageSchema = new mongoose.Schema({
  key: { type: String, enum: PAGE_KEYS, required: true, unique: true, index: true },

  en: { type: translatedSchema, default: () => ({}) },
  fr: { type: translatedSchema, default: () => ({}) },
});

pageSchema.plugin(contentPlugin);

export const Page = mongoose.model('Page', pageSchema);
