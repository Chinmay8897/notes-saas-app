import { api } from './api';

export const notesService = {
  getNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post('/notes/create', noteData);
    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
  },

  upgradeTenant: async (tenantSlug) => {
    const response = await api.post(`/tenants/${tenantSlug}/upgrade`);
    return response.data;
  }
};
