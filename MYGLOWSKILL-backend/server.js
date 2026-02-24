// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const app = express();

// ====================
// 🔒 Middlewares globaux
// ====================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================
// 🗄️ Connexion MongoDB
// ====================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ====================
// 📡 Import des routes API
// ====================
//try {
  const authRoutes = require('./routes/auth');
  const projectRoutes = require('./routes/projects');
  const securityRoutes = require('./routes/security');
  const usersRoutes = require('./routes/users');
  const contactRoutes = require('./routes/contact');

  app.use('/auth', authRoutes);
  app.use('/projects', projectRoutes);
  app.use('/api/security', securityRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/support/contact', contactRoutes);
//} catch (err) {
  //console.error('Erreur chargement routes:', err.message);
//}

// ====================
// 🌐 Frontend React build
// ====================
const FRONT_BUILD_PATH = path.join(__dirname, '../MYGLOWSKILLS-frontend/build');
if (fs.existsSync(FRONT_BUILD_PATH)) {
  app.use(express.static(FRONT_BUILD_PATH));
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONT_BUILD_PATH, 'index.html'));
  });
} else {
  console.warn('⚠️ Le dossier React build est introuvable :', FRONT_BUILD_PATH);
}

// ====================
// 🚀 Lancement du serveur
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
