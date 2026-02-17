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

    const userId = req.user?.id || 'anon';
    const key = process.env.FILE_ENCRYPTION_KEY || 'changemechangemechangeme12';
    const outPath = path.join('uploads', `enc-${userId}-${Date.now()}-${file.originalname}.enc`);

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
// 📋 Lister les backups de l'utilisateur
// ==============================
exports.listBackups = async (req, res) => {
  try {
    const userId = req.user?.id || 'anon';
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const files = fs.readdirSync(uploadsDir);

    const backupPrefix = `backup-${userId}-`;
    const encPrefix = `enc-${userId}-`;

    const results = files
      .filter(f => f.startsWith(backupPrefix) || f.startsWith(encPrefix))
      .map(f => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        const isEncrypted = f.startsWith(encPrefix);
        const prefix = isEncrypted ? encPrefix : backupPrefix;
        const rest = f.replace(prefix, '');
        const dashIndex = rest.indexOf('-');
        const timestamp = parseInt(rest.substring(0, dashIndex), 10);
        let originalName = rest.substring(dashIndex + 1);
        if (isEncrypted) originalName = originalName.replace(/\.enc$/, '');

        return {
          filename: f,
          originalName,
          size: stat.size,
          type: isEncrypted ? 'encrypted' : 'backup',
          createdAt: new Date(timestamp).toISOString(),
          downloadUrl: `/api/security/backups/download/${encodeURIComponent(f)}`,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error('Erreur listBackups:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des backups' });
  }
};

// ==============================
// ⬇️ Télécharger un backup
// ==============================
exports.downloadBackup = async (req, res) => {
  try {
    const userId = req.user?.id || 'anon';
    const { filename } = req.params;

    const backupPrefix = `backup-${userId}-`;
    const encPrefix = `enc-${userId}-`;

    // Vérifier que le fichier appartient à l'utilisateur
    if (!filename.startsWith(backupPrefix) && !filename.startsWith(encPrefix)) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Fichier introuvable' });
    }

    // Extraire le nom original pour le téléchargement
    const isEncrypted = filename.startsWith(encPrefix);
    const prefix = isEncrypted ? encPrefix : backupPrefix;
    const rest = filename.replace(prefix, '');
    const dashIndex = rest.indexOf('-');
    const originalName = rest.substring(dashIndex + 1);

    res.download(filePath, originalName);
  } catch (err) {
    console.error('Erreur downloadBackup:', err);
    res.status(500).json({ success: false, message: 'Erreur lors du téléchargement du fichier' });
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
