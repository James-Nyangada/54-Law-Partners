import mongoose from 'mongoose';
import { assetSchema, seoFields, contentPlugin } from './shared.js';

const qualificationSchema = new mongoose.Schema(
  {
    year: { type: String, trim: true },
    detail: { type: String, trim: true },
  },
  { _id: false }
);

const translatedSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    bio: { type: String, trim: true },
    qualifications: [qualificationSchema],
    publications: [{ type: String, trim: true }],
    ...seoFields,
  },
  { _id: false }
);

const lawyerSchema = new mongoose.Schema({
  order: { type: Number, default: 0, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },

  portrait: assetSchema,

  // Stored as an authenticated asset and only ever served through a signed,
  // expiring URL. See config/cloudinary.js.
  cv: assetSchema,

  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },

  languages: [{ type: String, trim: true }],
  admissions: [{ type: String, trim: true }],
  forums: [{ type: String, trim: true }],

  practiceAreas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PracticeArea', index: true }],

  en: { type: translatedSchema, default: () => ({}) },
  fr: { type: translatedSchema, default: () => ({}) },
});

lawyerSchema.plugin(contentPlugin);

export const Lawyer = mongoose.model('Lawyer', lawyerSchema);
