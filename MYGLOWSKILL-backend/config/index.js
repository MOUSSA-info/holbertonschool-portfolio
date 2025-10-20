require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS
};
