import axios from '../api/axios';

const productService = {
  getProducts: async () => {
    const response = await axios.get('/api/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post('/api/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axios.put(`/api/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`/api/products/${id}`);
    return response.data;
  },
};

export default productService;