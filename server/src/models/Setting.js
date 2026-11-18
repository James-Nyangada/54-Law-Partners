import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema(
  { label: String, url: String },
  { _id: false }
);

const translatedSchema = new mongoose.Schema(
  {
    // Shown under the enquiry form. Supplied by the firm — it is the notice
    // that submitting the form creates no lawyer-client relationship.
    enquiryNotice: { type: String, trim: true },
    // Regulatory and practising information in the footer.
    practisingDetails: { type: String, trim: true },
    officeHours: { type: String, trim: true },
  },
  { _id: false }
);

/**
 * Singleton. Fetched with Setting.load(), which creates the document on first
 * use so the admin never opens an empty settings screen.
 */
const settingSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'settings', unique: true, immutable: true },

    firmName: { type: String, default: '54 Law Partners', trim: true },
    addressLines: [{ type: String, trim: true }],
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },

    // Where enquiry and application notifications are sent. Not stored on the
    // submissions themselves.
    notifyEmail: { type: String, trim: true, lowercase: true },

    social: [socialSchema],

    en: { type: translatedSchema, default: () => ({}) },
    fr: { type: translatedSchema, default: () => ({}) },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

settingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.singleton;
    return ret;
  },
});

settingSchema.statics.load = async function load() {
  const existing = await this.findOne({ singleton: 'settings' });
  if (existing) return existing;
  return this.create({ singleton: 'settings' });
};

export const Setting = mongoose.model('Setting', settingSchema);
