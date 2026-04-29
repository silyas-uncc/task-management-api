const userService = require('../services/userService');

const signup = async (req, res, next) => {
  try {
    const user = await userService.signup(req.body);
    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

module.exports = { signup, login };