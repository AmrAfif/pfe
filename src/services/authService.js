import axios from '../api/axios';

const authService = {
  login: async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password, role) => {
    const response = await axios.post('/api/auth/register', { name, email, password, role });
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get('/api/auth/profile');
    return response.data;
  },
};

export default authService;