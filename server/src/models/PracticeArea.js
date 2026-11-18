import mongoose from 'mongoose';
import { assetSchema, seoFields, contentPlugin } from './shared.js';

export const PILLARS = ['transactions', 'disputes', 'international'];

const translatedSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    intro: { type: String, trim: true },
    overview: { type: String, trim: true },
    whoWeActFor: [{ type: String, trim: true }],
    whatWeDo: [{ type: String, trim: true }],
    ...seoFields,
  },
  { _id: false }
);

const practiceAreaSchema = new mongoose.Schema({
  pillar: { type: String, enum: PILLARS, required: true, index: true },
  order: { type: Number, default: 0, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },

  heroImage: assetSchema,
  thumbnail: assetSchema,

  lawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' }],

  en: { type: translatedSchema, default: () => ({}) },
  fr: { type: translatedSchema, default: () => ({}) },
});

practiceAreaSchema.plugin(contentPlugin);
practiceAreaSchema.index({ pillar: 1, order: 1 });

export const PracticeArea = mongoose.model('PracticeArea', practiceAreaSchema);
