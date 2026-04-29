const express = require('express');
const router = express.Router();
const { authenticate, checkOwnership } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addCategoryToTask,
  removeCategoryFromTask
} = require('../controllers/taskController');

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, checkOwnership('task'), getTaskById);
router.put('/:id', authenticate, checkOwnership('task'), updateTask);
router.delete('/:id', authenticate, checkOwnership('task'), deleteTask);
router.post('/:taskId/categories/:categoryId', authenticate, addCategoryToTask);
router.delete('/:taskId/categories/:categoryId', authenticate, removeCategoryFromTask);

module.exports = router;