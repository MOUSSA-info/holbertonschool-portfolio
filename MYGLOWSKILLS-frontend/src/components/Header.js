import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>MyGlowSkills</h1>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/login">Connexion</Link>
        <Link to="/Register">Inscription</Link>
      </nav>
    </header>
  );
}

export default Header;
