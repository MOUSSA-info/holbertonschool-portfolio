/**
 * Formate une date en français
 */
exports.formatDate = (date = new Date()) => {
  return date.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
};

/**
 * Génère un ID unique avec préfixe
 */
exports.generateUniqueId = (prefix = "id") => {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
};

/**
 * Nettoie une chaîne pour éviter les injections XSS
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Valide un ID MongoDB
 */
exports.isValidMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Pagination helper
 */
exports.getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
