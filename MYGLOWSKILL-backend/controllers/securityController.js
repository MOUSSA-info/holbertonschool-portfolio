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
    const userId = req.user?.id || 'anon';
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    const backupPrefix = `backup-${userId}-`;
    const encPrefix = `enc-${userId}-`;

    let savedDataBytes = 0;
    let encryptedCount = 0;
    let backupCount = 0;

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(f => {
        if (f.startsWith(backupPrefix) || f.startsWith(encPrefix)) {
          const stat = fs.statSync(path.join(uploadsDir, f));
          savedDataBytes += stat.size;
          if (f.startsWith(encPrefix)) encryptedCount++;
          if (f.startsWith(backupPrefix)) backupCount++;
        }
      });
    }

    const overview = {
      savedDataBytes,
      alertsCount: encryptedCount,
      backupCount,
      lastCheck: new Date().toISOString(),
    };

    res.status(200).json({ success: true, data: overview });
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
    const userId = req.user?.id || 'anon';
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    const backupPrefix = `backup-${userId}-`;
    const encPrefix = `enc-${userId}-`;

    let backups = [];
    let encrypted = [];

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(f => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        if (f.startsWith(backupPrefix)) backups.push({ name: f, size: stat.size, mtime: stat.mtime });
        if (f.startsWith(encPrefix)) encrypted.push({ name: f, size: stat.size, mtime: stat.mtime });
      });
    }

    const issues = [];
    let score = 100;

    // Vérif 1 : aucun backup
    if (backups.length === 0) {
      issues.push({ id: 'no-backup', severity: 'critical', category: 'Sauvegarde', message: 'Aucune sauvegarde trouvée. Tes données ne sont pas protégées.' });
      score -= 30;
    } else {
      // Vérif 2 : dernier backup trop ancien (>7 jours)
      const lastBackup = backups.sort((a, b) => b.mtime - a.mtime)[0];
      const daysSinceBackup = Math.floor((Date.now() - new Date(lastBackup.mtime)) / (1000 * 60 * 60 * 24));
      if (daysSinceBackup > 7) {
        issues.push({ id: 'old-backup', severity: 'warning', category: 'Sauvegarde', message: `Dernière sauvegarde il y a ${daysSinceBackup} jours. Il est recommandé de sauvegarder toutes les semaines.` });
        score -= 15;
      }
    }

    // Vérif 3 : aucun fichier chiffré
    if (encrypted.length === 0) {
      issues.push({ id: 'no-encryption', severity: 'warning', category: 'Chiffrement', message: 'Aucun fichier chiffré. Protège tes fichiers sensibles avec le chiffrement.' });
      score -= 20;
    }

    // Vérif 4 : trop de fichiers non chiffrés vs chiffrés
    const totalFiles = backups.length + encrypted.length;
    if (totalFiles > 0 && encrypted.length === 0 && backups.length > 3) {
      issues.push({ id: 'low-encryption-ratio', severity: 'warning', category: 'Chiffrement', message: `Tu as ${backups.length} fichiers sauvegardés mais aucun n'est chiffré.` });
      score -= 10;
    }

    // Vérif 5 : stockage élevé (>50MB)
    const totalSize = [...backups, ...encrypted].reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      issues.push({ id: 'high-storage', severity: 'info', category: 'Stockage', message: `Utilisation élevée : ${(totalSize / (1024 * 1024)).toFixed(1)} MB. Pense à supprimer les anciens fichiers.` });
      score -= 5;
    }

    // Score plancher
    if (score < 0) score = 0;

    const status = score >= 80 ? 'good' : score >= 50 ? 'warning' : 'critical';

    const report = {
      score,
      status,
      issuesFound: issues.length,
      details: issues,
      stats: {
        backupCount: backups.length,
        encryptedCount: encrypted.length,
        totalSizeBytes: totalSize,
      },
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
