import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Additional auth utilities
export function useAuthGuard(requiredRole = null) {
  const { user, loading } = useAuth();

  const hasAccess = () => {
    if (!user) return false;
    if (!requiredRole) return true;

    const roleHierarchy = { member: 0, admin: 1 };
    const userLevel = roleHierarchy[user.role] || -1;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  return {
    user,
    loading,
    hasAccess: hasAccess(),
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
    tenantSlug: user?.tenant?.slug,
    tenantPlan: user?.tenant?.plan
  };
}
