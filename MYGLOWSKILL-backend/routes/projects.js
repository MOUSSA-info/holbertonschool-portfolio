const express = require('express');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const router = express.Router();

// Middleware JWT
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Accès refusé' });

  try {
    console.log("try connect", token)
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// GET /projects (protégé)
router.get('/', auth, async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;
