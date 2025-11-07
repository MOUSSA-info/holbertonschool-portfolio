const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API routes
app.use('/auth', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));

// Serve React build
app.use(express.static(path.join(__dirname, '../MYGLOWSKILLS-frontend/build')));

// Pour toutes les autres routes, renvoyer index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../MYGLOWSKILLS-frontend/build', 'index.html'));
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
