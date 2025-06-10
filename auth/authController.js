const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/authConfig');

const initializeAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ username: config.adminUser.username });
    
    if (!adminExists) {
      console.log("Creating admin user...");
      const newAdmin = new User({
        username: config.adminUser.username,
        password: config.adminUser.password
      });
      
      await newAdmin.save();
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid username or password"
      });
    }
    
    const passwordIsValid = user.comparePassword(password);
    
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid username or password"
      });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.secret,
      { expiresIn: config.expiresIn }
    );
    
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      token: token,
      expiresIn: config.expiresIn
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    });
  }
};

module.exports = {
  login,
  initializeAdminUser
};