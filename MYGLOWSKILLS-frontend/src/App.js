import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './components/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';

// Security
import Dashboard from './pages/Dashboard';
import Overview from './pages/Security/Overview';
import Analyze from './pages/Security/Analyze';
import EncryptFile from './pages/Security/EncryptFile';
import Backup from './pages/Security/Backup';
import BackupList from './pages/Security/BackupList';
import PasswordGenerator from './pages/Security/PasswordGenerator';

// Profile
import Settings from './pages/Profile/Settings';

// Support
import Contact from './pages/Support/Contact';
import FAQ from './pages/Support/FAQ';
import Guide from './pages/Support/Guide';

// Legal
import Legal from './pages/Legal/Legal';

// CSS
import './tailwind.css';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/legal" element={<Legal />} />

        {/* Pages protégées */}
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />

        {/* Dashboard & Security */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/security/overview" element={<PrivateRoute><Overview /></PrivateRoute>} />
        <Route path="/security/analyze" element={<PrivateRoute><Analyze /></PrivateRoute>} />
        <Route path="/security/encrypt" element={<PrivateRoute><EncryptFile /></PrivateRoute>} />
        <Route path="/security/backup" element={<PrivateRoute><Backup /></PrivateRoute>} />
        <Route path="/security/backups" element={<PrivateRoute><BackupList /></PrivateRoute>} />
        <Route path="/security/password-generator" element={<PrivateRoute><PasswordGenerator /></PrivateRoute>} />

        {/* Profile */}
        <Route path="/profile/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

        {/* Support */}
        <Route path="/support/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
        <Route path="/support/faq" element={<PrivateRoute><FAQ /></PrivateRoute>} />
        <Route path="/support/guide" element={<PrivateRoute><Guide /></PrivateRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
