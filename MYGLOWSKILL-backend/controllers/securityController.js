// controllers/securityController.js
const fs = require('fs');
const path = require('path');
const { encryptFile } = require('../utils/cryptoFiles');
const  generatePassword  = require('../utils/passwordGen');

// ==============================
// 🔍 Vue d’ensemble de la sécurité
// ==============================
exports.overview = async (req, res) => {
  try {
    const overview = {
      savedDataBytes: 1024 * 1024 * 120, // 120 Mo exemple
      alertsCount: 3,
      lastCheck: new Date().toISOString(),
    };
    res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (err) {
    console.error('Erreur overview:', err);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération de l'overview" });
  }
};

// ==============================
// 🧠 Analyse de sécurité simulée
// ==============================
exports.analyze = async (req, res) => {
  try {
    const report = {
      status: 'ok',
      issuesFound: 1,
      details: [
        { id: 'weak-password', severity: 'medium', message: '1 mot de passe faible détecté.' }
      ],
      generatedAt: new Date().toISOString(),
    };
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error('Erreur analyze:', err);
    res.status(500).json({ success: false, message: "Erreur lors de l'analyse de sécurité" });
  }
};

// ==============================
// 🔐 Chiffrement de fichier
// ==============================
exports.encryptFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'Fichier manquant' });

    const key = process.env.FILE_ENCRYPTION_KEY || 'changemechangemechangeme12';
    const outPath = path.join('uploads', `${file.filename}.enc`);

    await encryptFile(file.path, outPath, key);

    fs.unlinkSync(file.path); // supprime le fichier original

    res.status(200).json({
      success: true,
      message: 'Fichier chiffré avec succès',
      downloadUrl: `/uploads/${path.basename(outPath)}`,
    });
  } catch (err) {
    console.error('Erreur encryptFile:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du chiffrement' });
  }
};


// ==============================
// 💾 Sauvegarde sécurisée
// ==============================
exports.backupFile = async (req, res) => {


  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'Fichier manquant' });

    console.log('📂 Fichier reçu :', file);
    console.log('📁 Chemin temporaire :', file.path);


    const dest = path.join('uploads', `backup-${req.user?.id || 'anon'}-${Date.now()}-${file.originalname}`);
    fs.renameSync(file.path, dest);

    res.status(200).json({
      success: true,
      message: 'Backup créé avec succès',
      path: `/uploads/${path.basename(dest)}`,
    });
  } catch (err) {
    console.error('Erreur backupFile:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
  }
};

// ==============================
// 🔑 Générateur de mot de passe
// ==============================
// controllers/securityController.js
// Endpoint pour générer le mot de passe

exports.passwordGenerator = (req, res) => {
  try {
    console.log('Génération mot de passe...');
    const pwd = generatePassword(16);
    console.log('Mot de passe généré:', pwd);
    res.status(200).json({ success: true, password: pwd });
  } catch (err) {
    console.error('Erreur passwordGenerator:', err);
    res.status(500).json({ success: false, message: 'Erreur génération mot de passe' });
  }
};
