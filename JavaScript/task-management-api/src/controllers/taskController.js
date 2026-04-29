const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate, projectId } = req.body;
    const userId = req.user.id;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        ownerId: userId
      },
      include: {
        project: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
    
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, projectId } = req.query;
    
    const where = { ownerId: userId };
    
    if (status) {
      where.status = status;
    }
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const task = await prisma.task.findFirst({
      where: {
        id: id,
        ownerId: userId
      },
      include: {
        project: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, projectId } = req.body;
    const userId = req.user.id;
    
    const existingTask = await prisma.task.findFirst({
      where: { id, ownerId: userId }
    });
    
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (projectId && projectId !== existingTask.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, ownerId: userId }
      });
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }
    }
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(projectId && { projectId })
      },
      include: {
        project: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
    
    res.status(200).json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const task = await prisma.task.findFirst({
      where: { id, ownerId: userId }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await prisma.task.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    next(error);
  }
};

const addCategoryToTask = async (req, res, next) => {
  try {
    const { taskId, categoryId } = req.params;
    const userId = req.user.id;
    
    const task = await prisma.task.findFirst({
      where: { id: taskId, ownerId: userId }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const category = await prisma.category.findFirst({
      where: { id: categoryId, ownerId: userId }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await prisma.taskCategory.upsert({
      where: {
        taskId_categoryId: {
          taskId,
          categoryId
        }
      },
      update: {},
      create: {
        taskId,
        categoryId
      }
    });
    
    res.status(200).json({ message: 'Category added to task successfully' });
  } catch (error) {
    next(error);
  }
};

const removeCategoryFromTask = async (req, res, next) => {
  try {
    const { taskId, categoryId } = req.params;
    const userId = req.user.id;
    
    const task = await prisma.task.findFirst({
      where: { id: taskId, ownerId: userId }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await prisma.taskCategory.delete({
      where: {
        taskId_categoryId: {
          taskId,
          categoryId
        }
      }
    });
    
    res.status(200).json({ message: 'Category removed from task successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Association not found' });
    }
    next(error);
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