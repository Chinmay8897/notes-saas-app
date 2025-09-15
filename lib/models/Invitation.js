import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired'],
    default: 'pending'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteToken: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  acceptedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
invitationSchema.index({ email: 1, tenantId: 1 });
invitationSchema.index({ inviteToken: 1 });
invitationSchema.index({ expiresAt: 1 });
invitationSchema.index({ tenantId: 1, status: 1 });

// Pre-save middleware to update the updatedAt field
invitationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if invitation is expired
invitationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Check if invitation can be accepted
invitationSchema.methods.canBeAccepted = function() {
  return this.status === 'pending' && !this.isExpired();
};

export const Invitation = mongoose.models.Invitation || mongoose.model('Invitation', invitationSchema);