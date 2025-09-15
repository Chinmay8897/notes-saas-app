import { useState, useCallback } from 'react';
import { notesService } from '../services/notes';
import { useAuth } from './useAuth';

export function useTenant() {
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState(null);

  const { user, updateTenant } = useAuth();

  const upgradeTenant = useCallback(async () => {
    if (!user?.tenant?.slug) {
      throw new Error('No tenant found');
    }

    try {
      setUpgrading(true);
      setUpgradeError(null);

      const response = await notesService.upgradeTenant(user.tenant.slug);

      // Update the auth context with new tenant data
      updateTenant(response.tenant);

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to upgrade tenant';
      setUpgradeError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpgrading(false);
    }
  }, [user, updateTenant]);

  const canUpgrade = useCallback(() => {
    return user?.role === 'admin' && user?.tenant?.plan === 'free';
  }, [user]);

  const isFreePlan = user?.tenant?.plan === 'free';
  const isProPlan = user?.tenant?.plan === 'pro';
  const noteLimit = user?.tenant?.noteLimit;

  const clearUpgradeError = useCallback(() => {
    setUpgradeError(null);
  }, []);

  return {
    tenant: user?.tenant,
    isFreePlan,
    isProPlan,
    noteLimit,
    canUpgrade: canUpgrade(),
    upgradeTenant,
    upgrading,
    upgradeError,
    clearUpgradeError
  };
}

// Hook for tenant statistics
export function useTenantStats() {
  const { user } = useAuth();

  const getUsageInfo = useCallback((currentNotesCount = 0) => {
    if (!user?.tenant) return null;

    const { plan, noteLimit } = user.tenant;

    if (plan === 'pro') {
      return {
        plan: 'pro',
        current: currentNotesCount,
        limit: null,
        percentage: 0,
        canCreate: true,
        unlimited: true
      };
    }

    const limit = noteLimit || 3;
    const percentage = (currentNotesCount / limit) * 100;
    const canCreate = currentNotesCount < limit;

    return {
      plan: 'free',
      current: currentNotesCount,
      limit,
      percentage: Math.min(percentage, 100),
      canCreate,
      unlimited: false
    };
  }, [user]);

  return { getUsageInfo };
}
