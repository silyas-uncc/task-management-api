const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const { 
  getAllUsers, 
  updateUserRole,
  getAllProjects,
  deleteAnyProject,
  getUserStats
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.get('/stats', getUserStats);

// Project management
router.get('/projects', getAllProjects);
router.delete('/projects/:projectId', deleteAnyProject);

module.exports = router;