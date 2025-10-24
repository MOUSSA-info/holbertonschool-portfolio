const mongoose = require("mongoose");
const logger = require("../utils/logger");

/**
 * Connexion à MongoDB avec gestion d'erreurs avancée
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Taille du pool de connexions
      serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
      socketTimeoutMS: 45000, // Timeout des opérations
    });

    logger.info(` MongoDB connecté: ${conn.connection.host}`);

    // Gestion des événements de connexion
    mongoose.connection.on("error", (err) => {
      logger.error(` Erreur MongoDB: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("  MongoDB déconnecté");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info(" MongoDB reconnecté");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB déconnecté suite à l'arrêt de l'application");
      process.exit(0);
    });

  } catch (error) {
    logger.error(` Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
