import { connectDB } from '../../lib/database.js';
import { Invitation } from '../../lib/models/Invitation.js';
import { corsHandler } from '../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      await connectDB();

      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      // Find the invitation by token
      const invitation = await Invitation.findOne({
        inviteToken: token
      }).populate([
        { path: 'tenantId', select: 'name slug' },
        { path: 'invitedBy', select: 'email' }
      ]);

      if (!invitation) {
        return res.status(404).json({ error: 'Invalid invitation token' });
      }

      // Return invitation details
      res.status(200).json({
        invitation: {
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          tenant: invitation.tenantId,
          invitedBy: invitation.invitedBy.email,
          createdAt: invitation.createdAt,
          expiresAt: invitation.expiresAt,
          isExpired: invitation.isExpired(),
          canBeAccepted: invitation.canBeAccepted()
        }
      });

    } catch (error) {
      console.error('Get invitation details error:', error);
      res.status(500).json({ error: 'Failed to get invitation details' });
    }
  });
}