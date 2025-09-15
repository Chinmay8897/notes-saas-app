import { connectDB } from '../../lib/database.js';
import { Invitation } from '../../lib/models/Invitation.js';
import { User } from '../../lib/models/User.js';
import { Tenant } from '../../lib/models/Tenant.js';
import { authenticate } from '../middleware/auth.js';
import { corsHandler } from '../middleware/cors.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    await authenticate(req, res, async () => {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      try {
        await connectDB();

        // Check if user is admin
        if (req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Only admins can send invitations' });
        }

        const { email, role } = req.body;

        if (!email || !role) {
          return res.status(400).json({ error: 'Email and role are required' });
        }

        if (!['admin', 'member'].includes(role)) {
          return res.status(400).json({ error: 'Role must be admin or member' });
        }

        // Check if user already exists in this tenant
        const existingUser = await User.findOne({
          email: email.toLowerCase(),
          tenantId: req.user.tenantId
        });

        if (existingUser) {
          return res.status(400).json({ error: 'User already exists in this tenant' });
        }

        // Check if there's already a pending invitation
        const existingInvitation = await Invitation.findOne({
          email: email.toLowerCase(),
          tenantId: req.user.tenantId,
          status: 'pending'
        });

        if (existingInvitation && !existingInvitation.isExpired()) {
          return res.status(400).json({ error: 'Invitation already sent to this email' });
        }

        // Generate unique invitation token
        const inviteToken = crypto.randomBytes(32).toString('hex');

        // Create new invitation
        const invitation = await Invitation.create({
          email: email.toLowerCase(),
          tenantId: req.user.tenantId,
          role,
          invitedBy: req.user.userId,
          inviteToken
        });

        // Populate the invitation with tenant and inviter details
        await invitation.populate([
          { path: 'tenantId', select: 'name slug' },
          { path: 'invitedBy', select: 'email' }
        ]);

        res.status(201).json({
          message: 'Invitation sent successfully',
          invitation: {
            id: invitation._id,
            email: invitation.email,
            role: invitation.role,
            status: invitation.status,
            tenant: invitation.tenantId,
            invitedBy: invitation.invitedBy,
            createdAt: invitation.createdAt,
            expiresAt: invitation.expiresAt,
            inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${inviteToken}`
          }
        });

      } catch (error) {
        console.error('Invitation creation error:', error);
        res.status(500).json({ error: 'Failed to send invitation' });
      }
    });
  });
}