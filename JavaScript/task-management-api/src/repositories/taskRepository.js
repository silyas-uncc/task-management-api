const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TaskRepository {
  async create(taskData) {
    return await prisma.task.create({
      data: taskData,
      include: {
        project: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async findAllByUserId(userId, filters = {}) {
    const where = { ownerId: userId };
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.projectId) {
      where.projectId = filters.projectId;
    }
    
    return await prisma.task.findMany({
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
  }

  async findByIdAndUser(id, userId) {
    return await prisma.task.findFirst({
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
  }

  async findById(id) {
    return await prisma.task.findUnique({
      where: { id }
    });
  }

  async update(id, taskData) {
    return await prisma.task.update({
      where: { id },
      data: taskData,
      include: {
        project: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async delete(id) {
    return await prisma.task.delete({
      where: { id }
    });
  }

  async addCategory(taskId, categoryId) {
    return await prisma.taskCategory.upsert({
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
  }

  async removeCategory(taskId, categoryId) {
    return await prisma.taskCategory.delete({
      where: {
        taskId_categoryId: {
          taskId,
          categoryId
        }
      }
    });
  }
}

module.exports = new TaskRepository();