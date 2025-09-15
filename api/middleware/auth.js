import { verifyToken } from '../../lib/utils/jwt.js';
import { User } from '../../lib/models/User.js';
import { connectDB } from '../../lib/database.js';

export const authenticate = async (req, res, next) => {
  try {
    await connectDB();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).populate('tenantId');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    req.tenantId = user.tenantId._id;
    req.tenant = user.tenantId;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
