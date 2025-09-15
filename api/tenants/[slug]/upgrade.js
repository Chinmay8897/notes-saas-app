import { connectDB } from '../../../lib/database.js';
import { Tenant } from '../../../lib/models/Tenant.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { corsHandler } from '../../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    await authenticate(req, res, async () => {
      await authorize(['admin'])(req, res, async () => {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
          await connectDB();

          const { slug } = req.query;

          if (req.tenant.slug !== slug) {
            return res.status(403).json({ error: 'Access denied' });
          }

          const tenant = await Tenant.findByIdAndUpdate(
            req.tenantId,
            {
              plan: 'pro',
              noteLimit: null,
              updatedAt: new Date()
            },
            { new: true }
          );

          res.status(200).json({
            message: 'Successfully upgraded to Pro plan',
            tenant: {
              id: tenant._id,
              name: tenant.name,
              slug: tenant.slug,
              plan: tenant.plan,
              noteLimit: tenant.noteLimit
            }
          });
        } catch (error) {
          console.error('Upgrade error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    });
  });
}
