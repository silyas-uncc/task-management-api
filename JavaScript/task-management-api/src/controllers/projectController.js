const projectService = require('../services/projectService');

const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await projectService.createProject(userId, req.body);
    res.status(201).json(project);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projects = await projectService.getUserProjects(userId);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const project = await projectService.getProjectById(userId, id);
    res.status(200).json(project);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const updateProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const project = await projectService.updateProject(userId, id, req.body);
    res.status(200).json(project);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await projectService.deleteProject(userId, id);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};