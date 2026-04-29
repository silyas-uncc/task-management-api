const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        ownerId: userId
      }
    });
    
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Category with this name already exists' });
    }
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const categories = await prisma.category.findMany({
      where: { ownerId: userId },
      orderBy: { name: 'asc' }
    });
    
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const category = await prisma.category.findFirst({
      where: {
        id: id,
        ownerId: userId
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: id,
        ownerId: userId
      }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const category = await prisma.category.update({
      where: { id },
      data: { name }
    });
    
    res.status(200).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Category with this name already exists' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: id,
        ownerId: userId
      }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await prisma.category.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};