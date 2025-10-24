const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est requis"],
      index: true, // Index pour performances
    },
    message: {
      type: String,
      required: [true, "Le message est requis"],
      trim: true,
      maxlength: [500, "Le message ne peut pas dépasser 500 caractères"],
    },
    type: {
      type: String,
      enum: {
        values: ["info", "warning", "error"],
        message: "Type d'alerte invalide",
      },
      default: "info",
    },
    seen: {
      type: Boolean,
      default: false,
      index: true, // Index pour filtrage rapide des alertes non vues
    },
    priority: {
      type: Number,
      enum: [1, 2, 3], // 1 = basse, 2 = normale, 3 = haute
      default: 2,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Pour stocker des données supplémentaires
      default: {},
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Index composé pour requêtes fréquentes (user + seen)
alertSchema.index({ user: 1, seen: 1 });

// Index pour trier par priorité et date
alertSchema.index({ user: 1, priority: -1, createdAt: -1 });

// Méthode virtuelle pour déterminer si l'alerte est récente (moins de 24h)
alertSchema.virtual("isRecent").get(function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Méthode statique pour compter les alertes non vues d'un utilisateur
alertSchema.statics.getUnreadCount = async function (userId) {
  return await this.countDocuments({ user: userId, seen: false });
};

// Méthode d'instance pour marquer comme vue
alertSchema.methods.markAsSeen = async function () {
  this.seen = true;
  return await this.save();
};

// Middleware pre-save pour validation supplémentaire
alertSchema.pre("save", function (next) {
  // Exemple: convertir le message en majuscules si priorité haute
  if (this.priority === 3 && !this.message.includes("URGENT")) {
    this.message = `URGENT: ${this.message}`;
  }
  next();
});

// Assurer que les virtuals sont inclus lors de la conversion en JSON
alertSchema.set("toJSON", { virtuals: true });
alertSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Alert", alertSchema);
