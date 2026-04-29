const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProjectRepository {
  async create(projectData) {
    return await prisma.project.create({
      data: projectData
    });
  }

  async findAllByUserId(userId) {
    return await prisma.project.findMany({
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
  }

  async findByIdAndUser(id, userId) {
    return await prisma.project.findFirst({
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
  }

  async findById(id) {
    return await prisma.project.findUnique({
      where: { id }
    });
  }

  async update(id, projectData) {
    return await prisma.project.update({
      where: { id },
      data: projectData
    });
  }

  async delete(id) {
    return await prisma.project.delete({
      where: { id }
    });
  }
}

module.exports = new ProjectRepository();