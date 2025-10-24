const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error(`Erreur récupération profil: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Mettre à jour le profil utilisateur
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Vérification si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre compte",
        });
      }
    }

    // Mise à jour des champs autorisés
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name.trim();
    if (email) fieldsToUpdate.email = email.toLowerCase();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    logger.info(`Profil mis à jour: ${user.email} (ID: ${user._id})`);

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user,
    });
  } catch (error) {
    logger.error(`Erreur mise à jour profil: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Changer le mot de passe
 * @route   PUT /api/v1/users/change-password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Ancien et nouveau mot de passe requis",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Récupération utilisateur avec mot de passe
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    // Vérification ancien mot de passe
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect",
      });
    }

    // Mise à jour du mot de passe
    user.password = newPassword;
    await user.save();

    logger.info(`Mot de passe changé: ${user.email} (ID: ${user._id})`);

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    logger.error(`Erreur changement mot de passe: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Supprimer le compte utilisateur
 * @route   DELETE /api/v1/users/me
 * @access  Private
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    logger.info(`Compte supprimé: ${user.email} (ID: ${user._id})`);

    res.json({
      success: true,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    logger.error(`Erreur suppression compte: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Récupérer tous les utilisateurs (Admin seulement)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    // Construction du filtre
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    // Pagination
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("-password")
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    logger.error(`Erreur récupération utilisateurs: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Activer/Désactiver un utilisateur (Admin)
 * @route   PATCH /api/v1/users/:id/toggle-status
 * @access  Private/Admin
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    logger.info(`Statut utilisateur modifié: ${user.email} (actif: ${user.isActive})`);

    res.json({
      success: true,
      message: `Utilisateur ${user.isActive ? "activé" : "désactivé"}`,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error(`Erreur toggle statut: ${error.message}`);
    next(error);
  }
};
