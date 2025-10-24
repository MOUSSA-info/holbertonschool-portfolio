const express = require("express");
const {
  createAlert,
  getUserAlerts,
  markAsSeen,
  markAllAsSeen,
  deleteAlert,
  clearSeenAlerts,
} = require("../controllers/alertController");
const auth = require("../middlewares/authMiddleware");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Créer une alerte
router.post(
  "/",
  [
    body("message").trim().notEmpty().withMessage("Le message est requis"),
    body("type").optional().isIn(["info", "warning", "error"]).withMessage("Type d'alerte invalide"),
  ],
  validate,
  createAlert
);

// Récupérer toutes les alertes
router.get("/", getUserAlerts);

// Marquer une alerte comme vue
router.patch(
  "/:id/seen",
  [param("id").isMongoId().withMessage("ID invalide")],
  validate,
  markAsSeen
);

// Marquer toutes les alertes comme vues
router.patch("/mark-all-seen", markAllAsSeen);

// Supprimer une alerte
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("ID invalide")],
  validate,
  deleteAlert
);

// Supprimer toutes les alertes vues
router.delete("/clear-seen", clearSeenAlerts);

module.exports = router;
