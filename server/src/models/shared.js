import mongoose from 'mongoose';

/**
 * Shared sub-schemas and helpers used across every model.
 */

/** A file stored in Cloudinary. */
export const assetSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    resourceType: { type: String, default: 'image' },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    access: { type: String, enum: ['public', 'authenticated'], default: 'public' },
    altEn: String,
    altFr: String,
  },
  { _id: false }
);

/** SEO fields, repeated inside every translated block. */
export const seoFields = {
  seoTitle: { type: String, trim: true, maxlength: 70 },
  seoDescription: { type: String, trim: true, maxlength: 180 },
};

export const STATUS = ['draft', 'published'];
export const LOCALES = ['en', 'fr'];

/**
 * Adds the fields every content document carries, plus a pair of indexes we
 * always want. Applied through schema.plugin().
 */
export function contentPlugin(schema, { withStatus = true } = {}) {
  schema.add({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });

  if (withStatus) {
    schema.add({
      status: { type: String, enum: STATUS, default: 'draft', index: true },
      publishedAt: { type: Date },
    });

    // Stamp publishedAt the first time something goes live, and never move it
    // afterwards — the publication date of a legal article is a fact, not a
    // side effect of the last edit.
    schema.pre('save', function stampPublishedAt(next) {
      if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
      }
      next();
    });
  }

  schema.set('timestamps', true);
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  });
}
