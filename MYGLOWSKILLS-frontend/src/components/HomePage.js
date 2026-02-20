import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo-mgs.svg';

const features = [
  { icon: '🔍', title: 'Analyse de sécurité', desc: 'Détecte les vulnérabilités et menaces en temps réel sur tes systèmes.' },
  { icon: '🔒', title: 'Chiffrement de fichiers', desc: 'Protège tes fichiers sensibles avec un chiffrement de niveau professionnel.' },
  { icon: '💾', title: 'Sauvegarde sécurisée', desc: 'Sauvegarde et restaure tes données en toute sécurité à tout moment.' },
  { icon: '🔑', title: 'Générateur de mots de passe', desc: 'Crée des mots de passe forts et uniques pour chaque service.' },
  { icon: '📊', title: 'Tableau de bord', desc: 'Visualise toutes tes statistiques de sécurité en un seul endroit.' },
  { icon: '🛡️', title: 'Protection complète', desc: 'Une suite complète d\'outils pour sécuriser ton startup de A à Z.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-wrapper">
      {/* Hero */}
      <div className="homepage-bg">
        <section className="hero-section">
          <img src={logo} alt="MyGlowSkill Logo" className="hero-logo" />
          <div className="hero-content">
            <h1>
              MYGLOWSKILL<br />
              FRANCE<br />
              CYBER<br />
              SÉCURITÉ
            </h1>
            <p className="hero-slogan">
              GARDE LA SÉCURITÉ DE TON STARTUP À L'ŒIL,<br />
              C'EST ÊTRE SÛR DE SON APOGÉE.
            </p>
            <div className="hero-buttons">
              <button className="hero-btn" onClick={() => navigate('/login')}>
                GET STARTED
              </button>
              <button className="hero-btn-outline" onClick={() => navigate('/register')}>
                CRÉER UN COMPTE
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Features */}
      <section className="features-section">
        <div className="features-header">
          <h2>Tout ce dont tu as besoin</h2>
          <p>Une plateforme complète pour sécuriser ta startup et dormir tranquille.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Prêt à sécuriser ton startup ?</h2>
        <p>Rejoins MyGlowSkills et prends le contrôle de ta cybersécurité dès aujourd'hui.</p>
        <button className="hero-btn" onClick={() => navigate('/register')}>
          COMMENCER GRATUITEMENT
        </button>
      </section>
    </div>
  );
}
