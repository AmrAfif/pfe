import axios from '../api/axios';

const productService = {
  getProducts: async () => {
    const response = await axios.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axios.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;