import mongoose from 'mongoose';

/** Registry of everything uploaded to Cloudinary, so the admin can browse it. */
const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    resourceType: { type: String, default: 'image', index: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    folder: { type: String, index: true },
    access: { type: String, enum: ['public', 'authenticated'], default: 'public' },

    originalFilename: String,
    altEn: { type: String, trim: true },
    altFr: { type: String, trim: true },

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

mediaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Media = mongoose.model('Media', mediaSchema);
