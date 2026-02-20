import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const sections = [
  {
    title: '🛡️ Sécurité',
    links: [
      { to: '/security/overview', label: '📊 Vue d\'ensemble' },
      { to: '/security/analyze', label: '🔍 Analyse' },
      { to: '/security/encrypt', label: '🔒 Chiffrer fichier' },
      { to: '/security/backup', label: '💾 Backup' },
      { to: '/security/backups', label: '📁 Mes Fichiers' },
      { to: '/security/password-generator', label: '🔑 Générateur mdp' },
    ],
  },
  {
    title: '👤 Profil',
    links: [
      { to: '/profile/settings', label: '⚙️ Paramètres' },
    ],
  },
  {
    title: '🆘 Support',
    links: [
      { to: '/support/contact', label: '📩 Contact' },
      { to: '/support/faq', label: '❓ FAQ' },
      { to: '/support/guide', label: '📖 Guide' },
    ],
  },
  {
    title: '📜 Légal',
    links: [
      { to: '/legal', label: '📋 Mentions légales' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="sidebar-logo">
        🏠 Dashboard
      </Link>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <h3 className="sidebar-section-title">{section.title}</h3>
            {section.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
