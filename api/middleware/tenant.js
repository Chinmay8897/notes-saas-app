import { Tenant } from '../../lib/models/Tenant.js';
import { connectDB } from '../../lib/database.js';

export const validateTenant = async (req, res, next) => {
  try {
    await connectDB();

    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Tenant slug required' });
    }

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    req.requestedTenant = tenant;
    next();
  } catch (error) {
    console.error('Tenant validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const ensureTenantAccess = (req, res, next) => {
  if (!req.user || !req.tenant) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.requestedTenant && req.tenant._id.toString() !== req.requestedTenant._id.toString()) {
    return res.status(403).json({ error: 'Access denied to this tenant' });
  }

  next();
};
