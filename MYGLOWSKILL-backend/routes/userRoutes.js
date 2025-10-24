const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminMiddleware");
const { body } = require("express-validator");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

// Routes utilisateur connecté
router.get("/me", auth, getProfile);

router.put(
  "/me",
  auth,
  [
    body("name").optional().trim().notEmpty().withMessage("Le nom ne peut pas être vide"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Email invalide"),
  ],
  validate,
  updateProfile
);

router.put(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Mot de passe actuel requis"),
    body("newPassword").isLength({ min: 6 }).withMessage("Nouveau mot de passe trop court"),
  ],
  validate,
  changePassword
);

router.delete("/me", auth, deleteAccount);

// Routes admin
router.get("/", auth, adminAuth, getAllUsers);
router.patch("/:id/toggle-status", auth, adminAuth, toggleUserStatus);

module.exports = router;
