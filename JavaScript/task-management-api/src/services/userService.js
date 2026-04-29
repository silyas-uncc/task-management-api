const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class UserService {
  async signup(userData) {
    const { username, email, password } = userData;
    
    // Validation
    if (!username || !email || !password) {
      throw { status: 400, message: 'Username, email, and password are required' };
    }
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw { status: 400, message: 'Invalid email format' };
    }
    
    if (password.length < 8) {
      throw { status: 400, message: 'Password must be at least 8 characters' };
    }
    
    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 409, message: 'Email already exists' };
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await userRepository.create({
      username,
      email,
      passwordHash: hashedPassword,
      role: 'USER'  // Add default role for new signups
    });
    
    return user;
  }
  
  async login(credentials) {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw { status: 400, message: 'Email and password are required' };
    }
    
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      throw { status: 401, message: 'Invalid email or password' };
    }
    
  
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role 
      }
    };
  }
}

module.exports = new UserService();