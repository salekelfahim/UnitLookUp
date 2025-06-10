module.exports = {
  secret: process.env.JWT_SECRET || "unit-finder-secret-key-change-in-production",
  expiresIn: "24h",
  adminUser: {
    username: "admin",
    password: "$2a$10$LRevSGkJd2jbUQ9QJ9K3a.rQnB0AOCpEebhUq502cV.ECE.3yPCga",
  }
};