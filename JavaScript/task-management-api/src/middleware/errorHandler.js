const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Prisma error handling
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists'
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found'
    });
  }
  
  // Default error
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    error: message
  });
};

module.exports = errorHandler;