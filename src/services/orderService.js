import axios from '../api/axios';

const orderService = {
  createOrder: async (orderData) => {
    const response = await axios.post('/api/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axios.get('/api/orders/myorders');
    return response.data;
  },

  getOrders: async () => {
    const response = await axios.get('/api/orders');
    return response.data;
  },

  updateOrderToDelivered: async (id) => {
    const response = await axios.put(`/api/orders/${id}/deliver`);
    return response.data;
  },
};

export default orderService;