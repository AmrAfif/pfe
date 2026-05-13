import axios from '../api/axios';

const orderService = {
  createOrder: async (orderData) => {
    const response = await axios.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axios.get('/orders/myorders');
    return response.data;
  },

  getOrders: async () => {
    const response = await axios.get('/orders');
    return response.data;
  },

  updateOrderToDelivered: async (id) => {
    const response = await axios.put(`/orders/${id}/deliver`);
    return response.data;
  },
};

export default orderService;