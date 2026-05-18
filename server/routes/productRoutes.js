const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOrSeller } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, adminOrSeller, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]), createProduct);

router.get('/myproducts', protect, adminOrSeller, getMyProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOrSeller, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]), updateProduct)
  .delete(protect, adminOrSeller, deleteProduct);

module.exports = router;