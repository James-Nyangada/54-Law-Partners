import mongoose from 'mongoose';

export const AUDIT_ACTIONS = ['create', 'update', 'delete', 'publish', 'unpublish', 'login', 'upload'];

/**
 * Who changed what, and when.
 *
 * Not optional on a law firm's system. If a published article is later
 * disputed, or a matter description is questioned, the firm needs to be able
 * to show the history. Entries are written by middleware and are never
 * editable through the API.
 */
const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    userEmail: String, // denormalised, so the record survives a deleted user
    action: { type: String, enum: AUDIT_ACTIONS, required: true, index: true },
    collectionName: { type: String, index: true },
    documentId: { type: mongoose.Schema.Types.ObjectId },
    summary: String,
  },
  { timestamps: { createdAt: 'at', updatedAt: false } }
);

auditLogSchema.index({ at: -1 });

auditLogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

/** Fire-and-forget. An audit write must never break the request it records. */
export function recordAudit({ req, action, collectionName, documentId, summary }) {
  const entry = {
    user: req?.user?.id,
    userEmail: req?.user?.email,
    action,
    collectionName,
    documentId,
    summary,
  };

  AuditLog.create(entry).catch((error) => {
    console.error('[audit] failed to record:', error.message, entry);
  });
}
