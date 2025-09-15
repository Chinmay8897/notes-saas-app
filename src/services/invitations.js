import { api } from './api';

export const invitationService = {
  // Send invitation (admin only)
  sendInvitation: async (email, role) => {
    const response = await api.post('/invitations', { email, role });
    return response.data;
  },

  // Get all invitations for the tenant (admin only)
  getInvitations: async (status = 'all', page = 1, limit = 10) => {
    const response = await api.get('/invitations', {
      params: { status, page, limit }
    });
    return response.data;
  },

  // Get invitation details by token (public)
  getInvitationDetails: async (token) => {
    const response = await api.get('/invitations/details', {
      params: { token }
    });
    return response.data;
  },

  // Accept invitation (public)
  acceptInvitation: async (token, password, confirmPassword) => {
    const response = await api.post('/invitations/accept', {
      token,
      password,
      confirmPassword
    });
    return response.data;
  }
};