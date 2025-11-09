import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';

// Security
import Dashboard from './pages/Dashboard';
import Overview from './pages/Security/Overview';
import Analyze from './pages/Security/Analyze';
import EncryptFile from './pages/Security/EncryptFile';
import Backup from './pages/Security/Backup';
import PasswordGenerator from './pages/Security/PasswordGenerator';

// Profile
import Settings from './pages/Profile/Settings';
import Roles from './pages/Profile/Roles';

// Support
import Contact from './pages/Support/Contact';
import FAQ from './pages/Support/FAQ';
import Guide from './pages/Support/Guide';

// Legal
import Legal from './pages/Legal/Legal';

import './tailwind.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />

        {/* Dashboard & Security */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/security/overview" element={<Overview />} />
        <Route path="/security/analyze" element={<Analyze />} />
        <Route path="/security/encrypt" element={<EncryptFile />} />
        <Route path="/security/backup" element={<Backup />} />
        <Route path="/security/password-generator" element={<PasswordGenerator />} />

        {/* Profile */}
        <Route path="/profile/settings" element={<Settings />} />
        <Route path="/profile/roles" element={<Roles />} />

        {/* Support */}
        <Route path="/support/contact" element={<Contact />} />
        <Route path="/support/faq" element={<FAQ />} />
        <Route path="/support/guide" element={<Guide />} />

        {/* Legal */}
        <Route path="/legal" element={<Legal />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
