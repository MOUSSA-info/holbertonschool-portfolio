const express = require("express");
const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { body } = require("express-validator");
const validate = require("../middlewares/validateMiddleware");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// Inscription
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Le nom est requis"),
    body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
    body("password").isLength({ min: 6 }).withMessage("Mot de passe trop court (min 6 caractères)"),
  ],
  validate,
  register
);

// Connexion
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
  ],
  validate,
  login
);

// Rafraîchir le token
router.post("/refresh-token", refreshToken);

// Mot de passe oublié
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail().withMessage("Email invalide")],
  validate,
  forgotPassword
);

// Réinitialiser le mot de passe
router.put(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Mot de passe trop court")],
  validate,
  resetPassword
);

// Déconnexion
router.post("/logout", auth, logout);

module.exports = router;
