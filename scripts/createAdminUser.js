const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../db');

const hashPassword = (plainPassword) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
};

const createAdminUser = async () => {
  try {
    await connectDB();
    
    const User = require('../models/User');
    
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit(0);
    }
    
    const hashedPassword = hashPassword('unitadmin');
    
    console.log('Creating admin user...');
    console.log(`Username: admin`);
    console.log(`Password: unitadmin (hashed in database)`);
    console.log(`Hashed password: ${hashedPassword}`);
    
    const newAdmin = new User({
      username: 'admin',
      password: hashedPassword
    });
    
    await newAdmin.save();
    console.log('Admin user created successfully!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();