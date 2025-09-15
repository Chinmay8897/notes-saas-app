import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  noteLimit: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// No need for explicit index since slug already has unique: true
// tenantSchema.index({ slug: 1 }); // Removed duplicate index

export const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);
