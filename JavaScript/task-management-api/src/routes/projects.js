const express = require('express');
const router = express.Router();
const { authenticate, checkOwnership } = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.post('/', authenticate, createProject);
router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, checkOwnership('project'), getProjectById);
router.put('/:id', authenticate, checkOwnership('project'), updateProject);
router.delete('/:id', authenticate, checkOwnership('project'), deleteProject);

module.exports = router;