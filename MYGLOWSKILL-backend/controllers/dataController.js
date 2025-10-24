const Data = require("../models/Data");
const logger = require("../utils/logger");

/**
 * @desc    Créer une nouvelle donnée
 * @route   POST /api/v1/data
 * @access  Private
 */
exports.createData = async (req, res, next) => {
  try {
    const { label, content, category } = req.body;

    const data = await Data.create({
      user: req.user.id,
      label: label.trim(),
      content,
      category,
    });

    logger.info(`Donnée créée: ${data._id} par utilisateur ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: "Donnée créée avec succès",
      data,
    });
  } catch (error) {
    logger.error(`Erreur création donnée: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Récupérer toutes les données de l'utilisateur
 * @route   GET /api/v1/data
 * @access  Private
 */
exports.getAllUserData = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20, search } = req.query;

    // Construction du filtre
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { label: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const data = await Data.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Data.countDocuments(filter);

    res.json({
      success: true,
      count: data.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    logger.error(`Erreur récupération données: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Récupérer une donnée par ID
 * @route   GET /api/v1/data/:id
 * @access  Private
 */
exports.getDataById = async (req, res, next) => {
  try {
    const data = await Data.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Donnée introuvable",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error(`Erreur récupération donnée: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Mettre à jour une donnée
 * @route   PUT /api/v1/data/:id
 * @access  Private
 */
exports.updateData = async (req, res, next) => {
  try {
    const { label, content, category, status } = req.body;

    const fieldsToUpdate = {};
    if (label) fieldsToUpdate.label = label.trim();
    if (content) fieldsToUpdate.content = content;
    if (category) fieldsToUpdate.category = category;
    if (status) fieldsToUpdate.status = status;

    const data = await Data.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Donnée introuvable",
      });
    }

    logger.info(`Donnée mise à jour: ${data._id}`);

    res.json({
      success: true,
      message: "Donnée mise à jour avec succès",
      data,
    });
  } catch (error) {
    logger.error(`Erreur mise à jour donnée: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Supprimer une donnée
 * @route   DELETE /api/v1/data/:id
 * @access  Private
 */
exports.deleteData = async (req, res, next) => {
  try {
    const data = await Data.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Donnée introuvable",
      });
    }

    logger.info(`Donnée supprimée: ${data._id}`);

    res.json({
      success: true,
      message: "Donnée supprimée avec succès",
    });
  } catch (error) {
    logger.error(`Erreur suppression donnée: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Archiver/Désarchiver une donnée
 * @route   PATCH /api/v1/data/:id/toggle-archive
 * @access  Private
 */
exports.toggleArchive = async (req, res, next) => {
  try {
    const data = await Data.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Donnée introuvable",
      });
    }

    data.status = data.status === "active" ? "archived" : "active";
    await data.save();

    logger.info(`Donnée ${data.status}: ${data._id}`);

    res.json({
      success: true,
      message: `Donnée ${data.status === "archived" ? "archivée" : "désarchivée"}`,
      data,
    });
  } catch (error) {
    logger.error(`Erreur toggle archive: ${error.message}`);
    next(error);
  }
};
