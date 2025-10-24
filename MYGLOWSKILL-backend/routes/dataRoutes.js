const express = require("express");
const {
  createData,
  getAllUserData,
  getDataById,
  updateData,
  deleteData,
  toggleArchive,
} = require("../controllers/dataController");
const auth = require("../middlewares/authMiddleware");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Créer une donnée
router.post(
  "/",
  [
    body("label").trim().notEmpty().withMessage("Le label est requis"),
    body("content").trim().notEmpty().withMessage("Le contenu est requis"),
    body("category").optional().isIn(["personal", "work", "other"]).withMessage("Catégorie invalide"),
  ],
  validate,
  createData
);

// Récupérer toutes les données de l'utilisateur
router.get("/", getAllUserData);

// Récupérer une donnée spécifique
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("ID invalide")],
  validate,
  getDataById
);

// Mettre à jour une donnée
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("ID invalide"),
    body("label").optional().trim().notEmpty().withMessage("Le label ne peut pas être vide"),
    body("content").optional().trim().notEmpty().withMessage("Le contenu ne peut pas être vide"),
    body("category").optional().isIn(["personal", "work", "other"]).withMessage("Catégorie invalide"),
    body("status").optional().isIn(["active", "archived"]).withMessage("Statut invalide"),
  ],
  validate,
  updateData
);

// Supprimer une donnée
router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("ID invalide")],
  validate,
  deleteData
);

// Archiver/Désarchiver une donnée
router.patch(
  "/:id/toggle-archive",
  [param("id").isMongoId().withMessage("ID invalide")],
  validate,
  toggleArchive
);

module.exports = router;
