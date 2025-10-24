const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Génère un token JWT d'accès
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpire,
      issuer: config.jwtIssuer,
    }
  );
};

/**
 * Génère un refresh token (durée plus longue)
 */
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    config.jwtRefreshSecret || config.jwtSecret,
    {
      expiresIn: "7d", // 7 jours
      issuer: config.jwtIssuer,
    }
  );
};

/**
 * Vérifie un refresh token
 */
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret || config.jwtSecret);
  } catch (err) {
    return null;
  }
};

/**
 * Vérifie un token JWT standard
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
};
