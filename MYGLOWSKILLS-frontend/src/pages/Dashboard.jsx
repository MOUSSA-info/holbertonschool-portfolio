import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getOverview } from '../services/api';
import './Dashboard.css';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const tools = [
  { icon: '📊', label: 'Vue d\'ensemble', desc: 'Résumé de ta sécurité', to: '/security/overview' },
  { icon: '🔍', label: 'Analyse', desc: 'Détecter les vulnérabilités', to: '/security/analyze' },
  { icon: '🔒', label: 'Chiffrer', desc: 'Protéger tes fichiers', to: '/security/encrypt' },
  { icon: '💾', label: 'Backup', desc: 'Sauvegarder tes données', to: '/security/backup' },
  { icon: '🔑', label: 'Générateur mdp', desc: 'Créer un mot de passe fort', to: '/security/password-generator' },
  { icon: '📁', label: 'Mes Fichiers', desc: 'Voir tes fichiers sauvegardés', to: '/security/backups' },
];

const quickLinks = [
  { icon: '⚙️', label: 'Paramètres', to: '/profile/settings' },
  { icon: '📩', label: 'Contact', to: '/support/contact' },
  { icon: '❓', label: 'FAQ', to: '/support/faq' },
  { icon: '📖', label: 'Guide', to: '/support/guide' },
  { icon: '📋', label: 'Légal', to: '/legal' },
];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getOverview()
      .then(res => setOverview(res.data.data))
      .catch(() => setOverview(null));

    const interval = setInterval(() => {
      getOverview()
        .then(res => setOverview(res.data.data))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: '💾', label: 'Données sauvegardées', value: overview ? formatBytes(overview.savedDataBytes) : '…', color: '#3b82f6' },
    { icon: '🔒', label: 'Fichiers chiffrés', value: overview ? overview.alertsCount : '…', color: '#ef4444' },
    { icon: '📁', label: 'Fichiers sauvegardés', value: overview ? overview.backupCount : '…', color: '#f0a500' },
    { icon: '✅', label: 'Dernière vérification', value: overview ? new Date(overview.lastCheck).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '…', color: '#22c55e' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue sur <span>MyGlowSkills</span> — gère ta sécurité en toute simplicité.</p>
          </div>
          <div className="dashboard-date">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Outils */}
        <div className="dashboard-section">
          <h2>🛠️ Outils de sécurité</h2>
          <div className="tools-grid">
            {tools.map((t, i) => (
              <Link key={i} to={t.to} className="tool-card">
                <div className="tool-icon">{t.icon}</div>
                <div className="tool-info">
                  <strong>{t.label}</strong>
                  <span>{t.desc}</span>
                </div>
                <div className="tool-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Accès rapide */}
        <div className="dashboard-section">
          <h2>⚡ Accès rapide</h2>
          <div className="quick-grid">
            {quickLinks.map((q, i) => (
              <Link key={i} to={q.to} className="quick-card">
                <span className="quick-icon">{q.icon}</span>
                <span>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
