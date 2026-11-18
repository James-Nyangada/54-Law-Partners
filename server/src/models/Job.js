import mongoose from 'mongoose';
import { seoFields, contentPlugin } from './shared.js';

const translatedSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    summary: { type: String, trim: true },
    description: { type: String },
    requirements: [{ type: String, trim: true }],
    ...seoFields,
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  location: { type: String, trim: true, default: 'Nairobi' },
  employmentType: { type: String, trim: true, default: 'Full time' },
  closingDate: Date,

  en: { type: translatedSchema, default: () => ({}) },
  fr: { type: translatedSchema, default: () => ({}) },
});

jobSchema.plugin(contentPlugin);

/** Closed once the closing date has passed. The site hides these. */
jobSchema.virtual('isOpen').get(function isOpen() {
  if (this.status !== 'published') return false;
  if (!this.closingDate) return true;
  return this.closingDate.getTime() >= Date.now();
});

export const Job = mongoose.model('Job', jobSchema);
