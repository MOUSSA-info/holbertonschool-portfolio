require("dotenv").config();
const path = require("path");

// Liste des variables d'environnement requises
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "MAIL_USER", "MAIL_PASS"];

// Vérification des variables manquantes
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`  Variable d'environnement ${key} manquante dans .env`);
  }
});

// Détermination de l'environnement
const environment = process.env.NODE_ENV || "development";
const isProduction = environment === "production";
const isDevelopment = environment === "development";

// Configuration complète exportée
module.exports = {
  // --- Environnement
  environment,
  isProduction,
  isDevelopment,

  // --- Serveur
  port: process.env.PORT || 5000,
  apiVersion: "v1",

  // --- Base de données
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/myglowskills",

  // --- JWT (authentification)
  jwtSecret: process.env.JWT_SECRET || "secret-temporaire-a-changer-urgence",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "2h",
  jwtRefreshExpire: "7d",
  jwtIssuer: "MyGlowSkillsAPI",
  jwtAlgorithm: "HS256",

  // --- CORS (Cross-Origin Resource Sharing)
  corsOptions: {
    origin: isProduction
      ? ["https://myglowskills.com", "https://www.myglowskills.com"]
      : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  // --- Mail (envoi notifications)
  mailConfig: {
    service: "gmail",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    sender: `"MyGlowSkills " <${process.env.MAIL_USER}>`,
  },

  // --- Frontend URL (pour reset password links)
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // --- Logs
  logPath: path.join(__dirname, "../logs"),
  logLevel: process.env.LOG_LEVEL || (isProduction ? "warn" : "info"),

  // --- Pagination par défaut
  defaultPageSize: 20,
  maxPageSize: 100,

  // --- Sécurité
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};
