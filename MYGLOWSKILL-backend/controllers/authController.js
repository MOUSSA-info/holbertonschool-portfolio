const User = require("../models/User");
const tokenService = require("../services/tokenService");
const mailService = require("../services/mailService");
const logger = require("../utils/logger");
const crypto = require("crypto");

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.warn(`Tentative d'inscription avec email existant: ${email}`);
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    // Création de l'utilisateur
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    });

    // Génération du token JWT
    const token = tokenService.generateToken(user);

    // Génération du refresh token (optionnel mais recommandé)
    const refreshToken = tokenService.generateRefreshToken(user);

    // Envoi email de bienvenue (asynchrone, ne bloque pas la réponse)
    mailService.sendMail(
      user.email,
      "Bienvenue sur MyGlowSkills 🎉",
      `Bonjour ${user.name},\n\nVotre compte a été créé avec succès !\n\nÉquipe MyGlowSkills`
    ).catch((err) => logger.error(`Erreur envoi email: ${err.message}`));

    logger.info(`Nouvel utilisateur inscrit: ${user.email} (ID: ${user._id})`);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Erreur inscription: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // Recherche utilisateur avec le mot de passe (normalement exclu par select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      logger.warn(`Tentative de connexion avec email inexistant: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    // Vérification du mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn(`Tentative de connexion avec mot de passe invalide: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    // Vérification si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé. Contactez le support.",
      });
    }

    // Génération des tokens
    const token = tokenService.generateToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    logger.info(`Connexion réussie: ${user.email} (ID: ${user._id})`);

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Erreur connexion: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Rafraîchir le token JWT
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public (avec refresh token valide)
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token requis",
      });
    }

    // Vérification du refresh token
    const decoded = tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Refresh token invalide ou expiré",
      });
    }

    // Récupération de l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable ou désactivé",
      });
    }

    // Génération de nouveaux tokens
    const newToken = tokenService.generateToken(user);
    const newRefreshToken = tokenService.generateRefreshToken(user);

    logger.info(`Token rafraîchi pour: ${user.email}`);

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error(`Erreur refresh token: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Demande de réinitialisation de mot de passe
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Sécurité: ne pas révéler si l'email existe ou non
      return res.json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }

    // Génération d'un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Sauvegarde du token hashé dans la base (ajouter ces champs au modèle User)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Envoi de l'email avec le lien
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await mailService.sendMail(
      user.email,
      "Réinitialisation de votre mot de passe",
      `Bonjour ${user.name},\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur ce lien (valide 15 minutes) :\n${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nÉquipe MyGlowSkills`
    );

    logger.info(`Demande de réinitialisation mot de passe: ${user.email}`);

    res.json({
      success: true,
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error) {
    logger.error(`Erreur forgot password: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Réinitialisation du mot de passe
 * @route   PUT /api/v1/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash du token reçu pour comparaison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Recherche utilisateur avec token valide et non expiré
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    // Mise à jour du mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Mot de passe réinitialisé: ${user.email}`);

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    logger.error(`Erreur reset password: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Déconnexion (blacklist du token côté client ou serveur)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    // Option 1: Blacklist côté serveur (nécessite Redis ou stockage)
    // await tokenService.blacklistToken(req.headers.authorization);

    // Option 2: Côté client supprime le token (recommandé pour JWT)
    logger.info(`Déconnexion: ${req.user.email}`);

    res.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    logger.error(`Erreur logout: ${error.message}`);
    next(error);
  }
};
