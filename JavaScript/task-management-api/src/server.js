const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Swagger documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../swagger/swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger documentation loaded successfully');
} catch (error) {
  console.log('Swagger documentation not found at:', path.join(__dirname, '../swagger/swagger.yaml'));
  console.log('Error:', error.message);

  // Fallback to basic documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup({
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [{ url: 'http://localhost:3000' }]
  }));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Management API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Test endpoint to verify routes
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  console.log('API Documentation available at http://localhost:' + PORT + '/api-docs');
  console.log('Health check at http://localhost:' + PORT + '/health');
});