import { connectDB } from '../../lib/database.js';
import { Invitation } from '../../lib/models/Invitation.js';
import { User } from '../../lib/models/User.js';
import { Tenant } from '../../lib/models/Tenant.js';
import { generateToken } from '../../lib/utils/jwt.js';
import { corsHandler } from '../middleware/cors.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      await connectDB();

      const { token, password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Token, password, and confirm password are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Find the invitation by token
      const invitation = await Invitation.findOne({
        inviteToken: token
      }).populate('tenantId');

      if (!invitation) {
        return res.status(404).json({ error: 'Invalid invitation token' });
      }

      if (!invitation.canBeAccepted()) {
        return res.status(400).json({
          error: invitation.isExpired()
            ? 'Invitation has expired'
            : 'Invitation is no longer valid'
        });
      }

      // Check if user already exists in ANY tenant
      const existingUser = await User.findOne({ email: invitation.email });

      if (existingUser) {
        // If user exists in a different tenant, we could allow them to join multiple tenants
        // For now, let's check if they're already in this specific tenant
        if (existingUser.tenantId.toString() === invitation.tenantId._id.toString()) {
          return res.status(400).json({ error: 'User already exists in this tenant' });
        }
        // For simplicity, we'll restrict users to one tenant only
        return res.status(400).json({ error: 'User already exists. Please contact support.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create the new user
      const user = await User.create({
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
        tenantId: invitation.tenantId._id
      });

      // Update invitation status
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await invitation.save();

      // Generate JWT token for the new user
      const authToken = generateToken({
        userId: user._id,
        tenantId: user.tenantId,
        role: user.role
      });

      // Return the user data and token
      res.status(201).json({
        message: 'Invitation accepted successfully',
        token: authToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          tenant: {
            id: invitation.tenantId._id,
            name: invitation.tenantId.name,
            slug: invitation.tenantId.slug,
            plan: invitation.tenantId.plan,
            noteLimit: invitation.tenantId.noteLimit
          }
        }
      });

    } catch (error) {
      console.error('Accept invitation error:', error);
      res.status(500).json({ error: 'Failed to accept invitation' });
    }
  });
}