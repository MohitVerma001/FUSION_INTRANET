import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const spacesAPI = {
  getAll: () => api.get('/spaces'),
  getById: (id) => api.get(`/spaces/${id}`),
  getAllContent: (id) => api.get(`/spaces/${id}/content`)
};

export default api;
