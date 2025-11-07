const express = require('express');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const router = express.Router();

// Middleware JWT
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Accès refusé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// GET /projects (protégé)
router.get('/', auth, async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;
