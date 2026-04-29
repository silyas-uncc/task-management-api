const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
  async createCategory(userId, categoryData) {
    const { name } = categoryData;
    
    if (!name) {
      throw { status: 400, message: 'Category name is required' };
    }
    
    // Check if category with same name exists for this user
    const existingCategory = await categoryRepository.findByNameAndUser(name, userId);
    
    if (existingCategory) {
      throw { status: 409, message: 'Category with this name already exists' };
    }
    
    return await categoryRepository.create({
      name,
      ownerId: userId
    });
  }
  
  async getUserCategories(userId) {
    return await categoryRepository.findAllByUserId(userId);
  }
  
  async getCategoryById(userId, categoryId) {
    const category = await categoryRepository.findByIdAndUser(categoryId, userId);
    
    if (!category) {
      throw { status: 404, message: 'Category not found' };
    }
    
    return category;
  }
  
  async updateCategory(userId, categoryId, updateData) {
    const { name } = updateData;
    
    if (!name) {
      throw { status: 400, message: 'Category name is required' };
    }
    
    // Check if category exists and belongs to user
    const existingCategory = await categoryRepository.findByIdAndUser(categoryId, userId);
    
    if (!existingCategory) {
      throw { status: 404, message: 'Category not found' };
    }
    
    // Check if new name conflicts with existing category
    const nameConflict = await categoryRepository.findByNameAndUser(name, userId);
    
    if (nameConflict && nameConflict.id !== categoryId) {
      throw { status: 409, message: 'Category with this name already exists' };
    }
    
    return await categoryRepository.update(categoryId, { name });
  }
  
  async deleteCategory(userId, categoryId) {
    const existingCategory = await categoryRepository.findByIdAndUser(categoryId, userId);
    
    if (!existingCategory) {
      throw { status: 404, message: 'Category not found' };
    }
    
    await categoryRepository.delete(categoryId);
    
    return { message: 'Category deleted successfully' };
  }
}

module.exports = new CategoryService();