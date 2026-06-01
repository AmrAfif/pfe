const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .put(protect, admin, updateUserRole)
  .delete(protect, admin, deleteUser);

module.exports = router;