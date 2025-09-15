import { connectDB } from '../../lib/database.js';
import { Invitation } from '../../lib/models/Invitation.js';
import { authenticate } from '../middleware/auth.js';
import { corsHandler } from '../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    await authenticate(req, res, async () => {
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      try {
        await connectDB();

        // Check if user is admin
        if (req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Only admins can view invitations' });
        }

        // Get query parameters for filtering
        const { status = 'all', page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter query
        const filter = { tenantId: req.user.tenantId };
        if (status !== 'all') {
          filter.status = status;
        }

        // Get invitations with pagination
        const invitations = await Invitation.find(filter)
          .populate('invitedBy', 'email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await Invitation.countDocuments(filter);

        // Format the response
        const formattedInvitations = invitations.map(invitation => ({
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          invitedBy: invitation.invitedBy.email,
          createdAt: invitation.createdAt,
          expiresAt: invitation.expiresAt,
          acceptedAt: invitation.acceptedAt,
          isExpired: invitation.isExpired(),
          canBeAccepted: invitation.canBeAccepted()
        }));

        res.status(200).json({
          invitations: formattedInvitations,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            totalCount,
            hasNext: skip + invitations.length < totalCount,
            hasPrev: parseInt(page) > 1
          }
        });

      } catch (error) {
        console.error('Get invitations error:', error);
        res.status(500).json({ error: 'Failed to get invitations' });
      }
    });
  });
}