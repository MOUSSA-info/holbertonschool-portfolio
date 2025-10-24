const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

/**
 * Middleware de validation des requêtes
 * Utilise express-validator pour valider les données
 */
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Log des erreurs de validation
    logger.warn(`Erreurs de validation: ${req.originalUrl}`, {
      errors: errors.array(),
      body: req.body,
    });

    return res.status(400).json({
      success: false,
      message: "Erreurs de validation",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

module.exports = validateMiddleware;
