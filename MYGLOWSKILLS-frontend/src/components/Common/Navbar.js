import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>MyGlowSkill</h2>
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/login">Connexion</Link></li>
        <li><Link to="/register">Inscription</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
