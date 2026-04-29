const taskRepository = require('../repositories/taskRepository');
const projectRepository = require('../repositories/projectRepository');
const categoryRepository = require('../repositories/categoryRepository');

class TaskService {
  async createTask(userId, taskData) {
    const { title, description, status, dueDate, projectId } = taskData;
    
    if (!title) {
      throw { status: 400, message: 'Task title is required' };
    }
    
    if (!projectId) {
      throw { status: 400, message: 'Project ID is required' };
    }
    
    // Verify project exists and belongs to user
    const project = await projectRepository.findByIdAndUser(projectId, userId);
    
    if (!project) {
      throw { status: 404, message: 'Project not found or access denied' };
    }
    
    return await taskRepository.create({
      title,
      description,
      status: status || 'PENDING',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      ownerId: userId
    });
  }
  
  async getUserTasks(userId, filters = {}) {
    return await taskRepository.findAllByUserId(userId, filters);
  }
  
  async getTaskById(userId, taskId) {
    const task = await taskRepository.findByIdAndUser(taskId, userId);
    
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }
    
    return task;
  }
  
  async updateTask(userId, taskId, updateData) {
    // Check if task exists and belongs to user
    const existingTask = await taskRepository.findByIdAndUser(taskId, userId);
    
    if (!existingTask) {
      throw { status: 404, message: 'Task not found' };
    }
    
    // If projectId is being updated, verify the new project belongs to user
    if (updateData.projectId && updateData.projectId !== existingTask.projectId) {
      const project = await projectRepository.findByIdAndUser(updateData.projectId, userId);
      
      if (!project) {
        throw { status: 404, message: 'Project not found or access denied' };
      }
    }
    
    // Format dueDate if provided
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }
    
    return await taskRepository.update(taskId, updateData);
  }
  
  async deleteTask(userId, taskId) {
    const existingTask = await taskRepository.findByIdAndUser(taskId, userId);
    
    if (!existingTask) {
      throw { status: 404, message: 'Task not found' };
    }
    
    await taskRepository.delete(taskId);
    
    return { message: 'Task deleted successfully' };
  }
  
  async addCategoryToTask(userId, taskId, categoryId) {
    // Verify task ownership
    const task = await taskRepository.findByIdAndUser(taskId, userId);
    
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }
    
    // Verify category ownership
    const category = await categoryRepository.findByIdAndUser(categoryId, userId);
    
    if (!category) {
      throw { status: 404, message: 'Category not found' };
    }
    
    await taskRepository.addCategory(taskId, categoryId);
    
    return { message: 'Category added to task successfully' };
  }
  
  async removeCategoryFromTask(userId, taskId, categoryId) {
    // Verify task ownership
    const task = await taskRepository.findByIdAndUser(taskId, userId);
    
    if (!task) {
      throw { status: 404, message: 'Task not found' };
    }
    
    await taskRepository.removeCategory(taskId, categoryId);
    
    return { message: 'Category removed from task successfully' };
  }
}

module.exports = new TaskService();