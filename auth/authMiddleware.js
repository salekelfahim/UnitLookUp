const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: "No token provided" 
    });
  }
  
  const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
  
  jwt.verify(tokenString, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token"
      });
    }
    
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;