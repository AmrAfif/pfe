const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  getSellerOrders,
  updateOrderToDelivered,
  cancelOrder,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/seller-orders').get(protect, getSellerOrders);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, admin, cancelOrder);
router.route('/admin/stats').get(protect, admin, getDashboardStats);

module.exports = router;