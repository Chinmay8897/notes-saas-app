import { connectDB } from '../../lib/database.js';
import { User } from '../../lib/models/User.js';
import { Tenant } from '../../lib/models/Tenant.js';
import { generateToken } from '../../lib/utils/jwt.js';
import { corsHandler } from '../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      await connectDB();

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await User.findOne({ email }).populate('tenantId');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({
        userId: user._id,
        tenantId: user.tenantId._id,
        role: user.role
      });

      res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          tenant: {
            id: user.tenantId._id,
            name: user.tenantId.name,
            slug: user.tenantId.slug,
            plan: user.tenantId.plan,
            noteLimit: user.tenantId.noteLimit
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
