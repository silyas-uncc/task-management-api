const categoryService = require('../services/categoryService');

const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const category = await categoryService.createCategory(userId, req.body);
    res.status(201).json(category);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = await categoryService.getUserCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const category = await categoryService.getCategoryById(userId, id);
    res.status(200).json(category);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const category = await categoryService.updateCategory(userId, id, req.body);
    res.status(200).json(category);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await categoryService.deleteCategory(userId, id);
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
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};