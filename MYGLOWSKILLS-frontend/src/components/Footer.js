import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>MyGlowSkills</h3>
          <p>La cybersécurité accessible pour toutes les startups françaises.</p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <Link to="/">Accueil</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <Link to="/support/faq">FAQ</Link>
          <Link to="/support/guide">Guide</Link>
          <Link to="/support/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Légal</h4>
          <Link to="/legal">Mentions légales</Link>
          <a href="mailto:contact@myglowskills.com">contact@myglowskills.com</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MyGlowSkills. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
