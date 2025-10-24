const logger = require("../utils/logger");

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    logger.warn(`Tentative d'accès admin refusée: ${req.user?.email || "Inconnu"}`);
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Droits administrateur requis.",
    });
  }
  next();
};

module.exports = adminMiddleware;
