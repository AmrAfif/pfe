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
const { admin, seller } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, seller, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]), createProduct);

router.get('/myproducts', protect, seller, getMyProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, seller, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;