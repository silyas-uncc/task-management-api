const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryRepository {
  async create(categoryData) {
    return await prisma.category.create({
      data: categoryData
    });
  }

  async findAllByUserId(userId) {
    return await prisma.category.findMany({
      where: { ownerId: userId },
      orderBy: { name: 'asc' }
    });
  }

  async findByIdAndUser(id, userId) {
    return await prisma.category.findFirst({
      where: {
        id: id,
        ownerId: userId
      }
    });
  }

  async findById(id) {
    return await prisma.category.findUnique({
      where: { id }
    });
  }

  async findByNameAndUser(name, userId) {
    return await prisma.category.findFirst({
      where: {
        name: name,
        ownerId: userId
      }
    });
  }

  async update(id, categoryData) {
    return await prisma.category.update({
      where: { id },
      data: categoryData
    });
  }

  async delete(id) {
    return await prisma.category.delete({
      where: { id }
    });
  }
}

module.exports = new CategoryRepository();