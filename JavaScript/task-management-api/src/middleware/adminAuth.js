const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required. You do not have permission to access this resource.' });
  }
  next();
};

module.exports = { isAdmin };