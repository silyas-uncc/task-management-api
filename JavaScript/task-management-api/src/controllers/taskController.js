const taskService = require('../services/taskService');

const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const task = await taskService.createTask(userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, projectId } = req.query;
    const tasks = await taskService.getUserTasks(userId, { status, projectId });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.getTaskById(userId, id);
    res.status(200).json(task);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.updateTask(userId, id, req.body);
    res.status(200).json(task);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await taskService.deleteTask(userId, id);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const addCategoryToTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId, categoryId } = req.params;
    const result = await taskService.addCategoryToTask(userId, taskId, categoryId);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const removeCategoryFromTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId, categoryId } = req.params;
    const result = await taskService.removeCategoryFromTask(userId, taskId, categoryId);
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
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addCategoryToTask,
  removeCategoryFromTask
};