import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

noteSchema.index({ tenantId: 1 });
noteSchema.index({ userId: 1 });
noteSchema.index({ tenantId: 1, userId: 1 });

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
