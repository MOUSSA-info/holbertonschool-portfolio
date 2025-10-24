const logger = require("../utils/logger");

/**
 * Middleware global de gestion des erreurs
 * Centralise toutes les erreurs de l'application
 */
const errorMiddleware = (err, req, res, next) => {
  // Définir le status code
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erreur interne du serveur";

  // Log de l'erreur complète
  logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, {
    error: err.message,
    stack: err.stack,
    body: req.body,
    user: req.user?.email || "Non authentifié",
  });

  // Gestion des erreurs spécifiques MongoDB
  if (err.name === "CastError") {
    statusCode = 400;
    message = "ID invalide fourni";
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `Ce ${field} est déjà utilisé`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token JWT invalide";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token JWT expiré";
  }

  // Réponse JSON structurée
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
