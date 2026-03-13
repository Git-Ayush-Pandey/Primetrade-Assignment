import api from './axios';

export const notesAPI = {
  getAll: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  create: async (noteData: { title: string; content: string }) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  update: async (id: string, noteData: { title?: string; content?: string }) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};
