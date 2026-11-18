import mongoose from 'mongoose';
import crypto from 'node:crypto';

/**
 * Newsletter subscribers, double opt-in.
 *
 * Nothing is ever sent to an address that has not confirmed. Sending legal
 * alerts to an unconfirmed address collected from a public form is how a firm
 * ends up explaining itself to a regulator.
 */
const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    locale: { type: String, enum: ['en', 'fr'], default: 'en' },

    confirmed: { type: Boolean, default: false, index: true },
    confirmedAt: Date,
    confirmToken: { type: String, index: true },
    unsubscribeToken: { type: String, index: true },

    unsubscribedAt: Date,
  },
  { timestamps: true }
);

subscriberSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.confirmToken;
    delete ret.unsubscribeToken;
    return ret;
  },
});

subscriberSchema.pre('validate', function issueTokens(next) {
  if (!this.confirmToken) this.confirmToken = crypto.randomBytes(24).toString('hex');
  if (!this.unsubscribeToken) this.unsubscribeToken = crypto.randomBytes(24).toString('hex');
  next();
});

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
