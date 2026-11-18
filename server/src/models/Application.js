import mongoose from 'mongoose';
import { assetSchema } from './shared.js';
import { env } from '../config/env.js';

export const APPLICATION_STATUS = ['new', 'shortlisted', 'rejected', 'archived'];

/**
 * A career application. Carries a CV, which is personal data: the file is
 * uploaded to Cloudinary as an authenticated asset and only ever served
 * through a short-lived signed URL requested by a signed-in admin.
 */
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', index: true },

    name: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 60 },
    coverNote: { type: String, trim: true, maxlength: 5000 },

    cv: assetSchema,

    status: { type: String, enum: APPLICATION_STATUS, default: 'new', index: true },
    internalNote: { type: String, trim: true, maxlength: 2000 },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

applicationSchema.index({ createdAt: -1 });

applicationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

applicationSchema.virtual('dueForDeletion').get(function dueForDeletion() {
  const days = env.applicationRetentionDays;
  if (!days) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return this.createdAt.getTime() < cutoff;
});

export const Application = mongoose.model('Application', applicationSchema);
