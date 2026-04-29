const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      let resource;
      
      switch (resourceType) {
        case 'project':
          resource = await prisma.project.findUnique({
            where: { id }
          });
          break;
        case 'task':
          resource = await prisma.task.findUnique({
            where: { id }
          });
          break;
        case 'category':
          resource = await prisma.category.findUnique({
            where: { id }
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid resource type' });
      }
      
      if (!resource) {
        return res.status(404).json({ error: `${resourceType} not found` });
      }
      
      if (resource.ownerId !== userId) {
        return res.status(403).json({ error: 'You do not have permission to access this resource' });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ error: 'Authorization error' });
    }
  };
};

module.exports = { authenticate, checkOwnership };