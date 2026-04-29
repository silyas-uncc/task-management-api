const projectRepository = require('../repositories/projectRepository');

class ProjectService {
  async createProject(userId, projectData) {
    const { name, description } = projectData;
    
    if (!name) {
      throw { status: 400, message: 'Project name is required' };
    }
    
    return await projectRepository.create({
      name,
      description,
      ownerId: userId
    });
  }
  
  async getUserProjects(userId) {
    return await projectRepository.findAllByUserId(userId);
  }
  
  async getProjectById(userId, projectId) {
    const project = await projectRepository.findByIdAndUser(projectId, userId);
    
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }
    
    return project;
  }
  
  async updateProject(userId, projectId, updateData) {
    // Check if project exists and belongs to user
    const existingProject = await projectRepository.findByIdAndUser(projectId, userId);
    
    if (!existingProject) {
      throw { status: 404, message: 'Project not found' };
    }
    
    return await projectRepository.update(projectId, updateData);
  }
  
  async deleteProject(userId, projectId) {
    const existingProject = await projectRepository.findByIdAndUser(projectId, userId);
    
    if (!existingProject) {
      throw { status: 404, message: 'Project not found' };
    }
    
    await projectRepository.delete(projectId);
    
    return { message: 'Project deleted successfully' };
  }
}

module.exports = new ProjectService();