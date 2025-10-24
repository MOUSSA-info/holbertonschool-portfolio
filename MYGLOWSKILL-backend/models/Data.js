const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est requis"],
      index: true, // Index pour performances
    },
    label: {
      type: String,
      required: [true, "Le label est requis"],
      trim: true,
      maxlength: [200, "Le label ne peut pas dépasser 200 caractères"],
    },
    content: {
      type: String,
      required: [true, "Le contenu est requis"],
      trim: true,
      maxlength: [5000, "Le contenu ne peut pas dépasser 5000 caractères"],
    },
    category: {
      type: String,
      enum: {
        values: ["personal", "work", "other"],
        message: "Catégorie invalide",
      },
      default: "other",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "archived"],
        message: "Statut invalide",
      },
      default: "active",
      index: true, // Index pour filtrage rapide
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Index composé pour requêtes fréquentes (user + status)
dataSchema.index({ user: 1, status: 1 });

// Index pour recherche texte (optionnel mais recommandé)
dataSchema.index({ label: "text", content: "text" });

// Méthode virtuelle pour obtenir un résumé du contenu
dataSchema.virtual("contentSummary").get(function () {
  return this.content.length > 100
    ? this.content.substring(0, 100) + "..."
    : this.content;
});

// Assurer que les virtuals sont inclus lors de la conversion en JSON
dataSchema.set("toJSON", { virtuals: true });
dataSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Data", dataSchema);
