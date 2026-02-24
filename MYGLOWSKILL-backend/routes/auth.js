const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username: username.toLowerCase(), // stocke en minuscules
      password: hashed
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du compte', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() }); // recherche insensible à la casse
    if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Mettre à jour le profil (username / password)
const auth = require('../middlewares/authMiddleware');

router.put('/profile', auth, async (req, res) => {
  try {
    const { newUsername, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Changement de username
    if (newUsername && newUsername !== user.username) {
      const exists = await User.findOne({ username: newUsername.toLowerCase() });
      if (exists) return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
      user.username = newUsername.toLowerCase();
    }

    // Changement de mot de passe
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Mot de passe actuel requis' });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ success: true, message: 'Profil mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
});

module.exports = router;
