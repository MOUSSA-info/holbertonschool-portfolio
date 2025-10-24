const Alert = require("../models/Alert");
const logger = require("../utils/logger");

/**
 * @desc    Créer une nouvelle alerte
 * @route   POST /api/v1/alerts
 * @access  Private
 */
exports.createAlert = async (req, res, next) => {
  try {
    const { message, type = "info" } = req.body;

    const alert = await Alert.create({
      user: req.user.id,
      message,
      type,
    });

    logger.info(`Alerte créée: ${alert._id} pour utilisateur ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: "Alerte créée avec succès",
      alert,
    });
  } catch (error) {
    logger.error(`Erreur création alerte: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Récupérer toutes les alertes de l'utilisateur
 * @route   GET /api/v1/alerts
 * @access  Private
 */
exports.getUserAlerts = async (req, res, next) => {
  try {
    const { seen, type, page = 1, limit = 50 } = req.query;

    // Construction du filtre
    const filter = { user: req.user.id };
    if (seen !== undefined) filter.seen = seen === "true";
    if (type) filter.type = type;

    // Pagination
    const skip = (page - 1) * limit;

    const alerts = await Alert.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Alert.countDocuments(filter);
    const unreadCount = await Alert.countDocuments({ user: req.user.id, seen: false });

    res.json({
      success: true,
      count: alerts.length,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      alerts,
    });
  } catch (error) {
    logger.error(`Erreur récupération alertes: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Marquer une alerte comme vue
 * @route   PATCH /api/v1/alerts/:id/seen
 * @access  Private
 */
exports.markAsSeen = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { seen: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alerte introuvable",
      });
    }

    logger.info(`Alerte marquée vue: ${alert._id}`);

    res.json({
      success: true,
      message: "Alerte marquée comme vue",
      alert,
    });
  } catch (error) {
    logger.error(`Erreur marquage alerte: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Marquer toutes les alertes comme vues
 * @route   PATCH /api/v1/alerts/mark-all-seen
 * @access  Private
 */
exports.markAllAsSeen = async (req, res, next) => {
  try {
    const result = await Alert.updateMany(
      { user: req.user.id, seen: false },
      { seen: true }
    );

    logger.info(`${result.modifiedCount} alertes marquées vues pour utilisateur ${req.user.id}`);

    res.json({
      success: true,
      message: `${result.modifiedCount} alertes marquées comme vues`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    logger.error(`Erreur marquage multiple alertes: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Supprimer une alerte
 * @route   DELETE /api/v1/alerts/:id
 * @access  Private
 */
exports.deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alerte introuvable",
      });
    }

    logger.info(`Alerte supprimée: ${alert._id}`);

    res.json({
      success: true,
      message: "Alerte supprimée avec succès",
    });
  } catch (error) {
    logger.error(`Erreur suppression alerte: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Supprimer toutes les alertes vues
 * @route   DELETE /api/v1/alerts/clear-seen
 * @access  Private
 */
exports.clearSeenAlerts = async (req, res, next) => {
  try {
    const result = await Alert.deleteMany({
      user: req.user.id,
      seen: true,
    });

    logger.info(`${result.deletedCount} alertes vues supprimées pour utilisateur ${req.user.id}`);

    res.json({
      success: true,
      message: `${result.deletedCount} alertes vues supprimées`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    logger.error(`Erreur suppression alertes vues: ${error.message}`);
    next(error);
  }
};
