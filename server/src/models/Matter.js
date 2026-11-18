import mongoose from 'mongoose';
import { contentPlugin } from './shared.js';

const translatedSchema = new mongoose.Schema(
  {
    sector: { type: String, trim: true },
    jurisdiction: { type: String, trim: true },
    role: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

/**
 * A representative matter — the experience synopsis the firm asked for.
 *
 * Content here is supplied and approved by the firm. Nothing in this system
 * should ever generate or suggest a matter: overstating experience on a law
 * firm's own website is the firm's professional exposure, not the developer's.
 */
const matterSchema = new mongoose.Schema({
  order: { type: Number, default: 0, index: true },
  practiceAreas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PracticeArea', index: true }],

  en: { type: translatedSchema, default: () => ({}) },
  fr: { type: translatedSchema, default: () => ({}) },
});

matterSchema.plugin(contentPlugin);

export const Matter = mongoose.model('Matter', matterSchema);
