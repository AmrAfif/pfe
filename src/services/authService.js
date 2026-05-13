import axios from '../api/axios';

const authService = {
  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password, role) => {
    const response = await axios.post('/auth/register', { name, email, password, role });
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },
};

export default authService;