const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config");
const logger = require("./utils/logger");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { generalLimiter, authLimiter } = require("./middlewares/rateLimiter");

// Import des routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

// ═══════════════════════════════════════════════════════════
// MIDDLEWARES GLOBAUX
// ═══════════════════════════════════════════════════════════

// Sécurité HTTP avec Helmet
app.use(helmet());

// CORS (Cross-Origin Resource Sharing)
app.use(cors(config.corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logs HTTP avec Morgan + Winston
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// Rate limiting global
app.use(generalLimiter);

// ═══════════════════════════════════════════════════════════
// CONNEXION BASE DE DONNÉES
// ═══════════════════════════════════════════════════════════
connectDB();

// ═══════════════════════════════════════════════════════════
// ROUTES API
// ═══════════════════════════════════════════════════════════

// Route de santé (health check)
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.environment,
  });
});

// Route racine
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: " API MyGlowSkills",
    version: config.apiVersion,
    documentation: `${req.protocol}://${req.get("host")}/api/${config.apiVersion}/docs`,
  });
});

// Routes d'authentification (avec rate limiter strict)
app.use(`/api/${config.apiVersion}/auth`, authLimiter, authRoutes);

// Routes protégées
app.use(`/api/${config.apiVersion}/users`, userRoutes);
app.use(`/api/${config.apiVersion}/data`, dataRoutes);
app.use(`/api/${config.apiVersion}/alerts`, alertRoutes);

// ═══════════════════════════════════════════════════════════
// GESTION DES ERREURS 404
// ═══════════════════════════════════════════════════════════
app.use((req, res) => {
  logger.warn(`Route introuvable: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route introuvable",
    path: req.originalUrl,
  });
});

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE GLOBAL DE GESTION DES ERREURS
// ═══════════════════════════════════════════════════════════
app.use(errorMiddleware);

// ═══════════════════════════════════════════════════════════
// DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════════════
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║    Serveur MyGlowSkills démarré avec succès        ║
║                                                    ║
║    Port          : ${PORT}                         ║
║    Environnement : ${config.environment}           ║
║    Version API   : ${config.apiVersion}            ║
║    URL           : http://localhost:${PORT}        ║
║    Health       : http://localhost:${PORT}/health  ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// ═══════════════════════════════════════════════════════════
// GESTION DES ARRÊTS GRACIEUX (GRACEFUL SHUTDOWN)
// ═══════════════════════════════════════════════════════════

// Gestion des erreurs non capturées
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  server.close(() => process.exit(1));
});

// Arrêt propre sur SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  logger.info("  Signal SIGINT reçu, arrêt du serveur...");
  server.close(() => {
    logger.info(" Serveur arrêté proprement");
    process.exit(0);
  });
});

// Arrêt propre sur SIGTERM (Docker, Heroku, etc.)
process.on("SIGTERM", () => {
  logger.info("  Signal SIGTERM reçu, arrêt du serveur...");
  server.close(() => {
    logger.info(" Serveur arrêté proprement");
    process.exit(0);
  });
});

// ═══════════════════════════════════════════════════════════
// EXPORT POUR LES TESTS
// ═══════════════════════════════════════════════════════════
module.exports = app;
