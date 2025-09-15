import bcrypt from 'bcryptjs';
import { generateToken } from './jwt.js';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const createAuthResponse = (user, tenant) => {
  const token = generateToken({
    userId: user._id,
    tenantId: tenant._id,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        noteLimit: tenant.noteLimit
      }
    }
  };
};

export const validateAuthCredentials = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).populate('tenantId');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return { user, tenant: user.tenantId };
};

export const extractBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
