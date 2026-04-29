const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId
      }
    });
    
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        ownerId: userId
      },
      include: {
        tasks: {
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    
    const existingProject = await prisma.project.findFirst({
      where: {
        id: id,
        ownerId: userId
      }
    });
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      }
    });
    
    res.status(200).json(project);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingProject = await prisma.project.findFirst({
      where: {
        id: id,
        ownerId: userId
      }
    });
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await prisma.project.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};