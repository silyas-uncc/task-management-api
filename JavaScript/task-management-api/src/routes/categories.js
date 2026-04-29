const express = require('express');
const router = express.Router();
const { authenticate, checkOwnership } = require('../middleware/auth');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

router.post('/', authenticate, createCategory);
router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, checkOwnership('category'), getCategoryById);
router.put('/:id', authenticate, checkOwnership('category'), updateCategory);
router.delete('/:id', authenticate, checkOwnership('category'), deleteCategory);

module.exports = router;