const jwt = require("jsonwebtoken");
const config = require("../config");
const logger = require("../utils/logger");

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token
 */
const authMiddleware = (req, res, next) => {
  // Récupération du token depuis le header Authorization
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  if (!token) {
    logger.warn(`Accès refusé sans token: ${req.originalUrl}`);
    return res.status(401).json({
      success: false,
      message: "Accès refusé. Token d'authentification manquant.",
    });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Ajout des informations utilisateur dans req
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    logger.warn(`Token invalide: ${err.message}`);
    return res.status(403).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
};

module.exports = authMiddleware;
