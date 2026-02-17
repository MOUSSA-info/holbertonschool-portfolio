const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/authMiddleware');
const securityCtrl = require('../controllers/securityController');

// 📁 Configuration du dossier d'upload temporaire
const upload = multer({ dest: 'uploads/' });

// ========================
// 🔐 Routes Sécurité
// ========================

// Vue d’ensemble de la sécurité (indicateurs, sauvegardes, etc.)
router.get('/overview', auth, securityCtrl.overview);

// Analyse de sécurité (vulnérabilités, incidents simulés, etc.)
router.post('/analyze', auth, securityCtrl.analyze);

// Chiffrement de fichier uploadé
router.post('/encrypt', auth, upload.single('file'), securityCtrl.encryptFile);


// Sauvegarde sécurisée du fichier
router.post('/backup', auth, upload.single('file'), securityCtrl.backupFile);

// Lister les backups de l'utilisateur
router.get('/backups', auth, securityCtrl.listBackups);

// Télécharger un backup
router.get('/backups/download/:filename', auth, securityCtrl.downloadBackup);

// Générateur de mot de passe fort
router.get('/password-generator', securityCtrl.passwordGenerator);

module.exports = router;
