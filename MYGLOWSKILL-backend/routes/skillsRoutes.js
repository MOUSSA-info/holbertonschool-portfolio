const express = require('express');
const router = express.Router();

// Exemple de données statiques de compétences (mimique la base de données)
const skills = [
  {
    _id: '1',
    name: 'Deepfake detection',
    description: 'Détection avancée des deepfakes par IA',
    level: 'Expert',
  },
  {
    _id: '2',
    name: 'Cybersecurity',
    description: 'Solutions complètes de cybersécurité pour entreprises',
    level: 'Avancé',
  },
];

// GET /api/v1/skills - Liste des compétences
router.get('/', (req, res) => {
  res.json(skills);
});

module.exports = router;
