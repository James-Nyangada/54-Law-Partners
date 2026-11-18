import mongoose from 'mongoose';
import { env } from '../config/env.js';

export const ENQUIRY_STATUS = ['new', 'read', 'replied', 'archived'];

/**
 * A contact form submission.
 *
 * This is the most sensitive collection in the system. A stranger may describe
 * a legal problem here before anyone has run a conflict check, so:
 *
 *   - no IP address, user agent or tracking identifier is stored;
 *   - nothing is ever sent from this system to the person who submitted it;
 *   - replies happen from the firm's own email, where its records live;
 *   - a retention period can be set so submissions are flagged for deletion.
 *
 * The retention figure is the firm's decision and must match whatever the
 * published privacy policy says.
 */
const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    organisation: { type: String, trim: true, maxlength: 160 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 60 },
    areaOfLaw: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },

    locale: { type: String, enum: ['en', 'fr'], default: 'en' },
    status: { type: String, enum: ENQUIRY_STATUS, default: 'new', index: true },

    // Free-text note added by whoever handled it. Not correspondence.
    internalNote: { type: String, trim: true, maxlength: 2000 },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });

enquirySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

/** True once the configured retention period has elapsed. */
enquirySchema.virtual('dueForDeletion').get(function dueForDeletion() {
  const days = env.enquiryRetentionDays;
  if (!days) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return this.createdAt.getTime() < cutoff;
});

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
