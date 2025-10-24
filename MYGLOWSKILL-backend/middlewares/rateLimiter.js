const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

/**
 * Rate limiter global pour protéger l'API contre les abus
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true, // Retourne les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  handler: (req, res) => {
    logger.warn(`Rate limit atteint pour IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Trop de requêtes, veuillez réessayer dans 15 minutes.",
    });
  },
});

/**
 * Rate limiter strict pour les routes d'authentification
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 tentatives de connexion
  message: {
    success: false,
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
  skipSuccessfulRequests: true, // Ne compte que les échecs
  handler: (req, res) => {
    logger.warn(`Tentatives de connexion excessives pour IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
    });
  },
});

/**
 * Rate limiter pour les actions sensibles (changement mot de passe, suppression compte)
 */
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Max 3 actions sensibles par heure
  message: {
    success: false,
    message: "Trop d'actions sensibles. Réessayez dans 1 heure.",
  },
  handler: (req, res) => {
    logger.warn(`Actions sensibles excessives pour IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Trop d'actions sensibles. Réessayez dans 1 heure.",
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  sensitiveLimiter,
};
