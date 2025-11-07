import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Bienvenue sur MyGlowSkills</h1>
      <p>Découvrez vos projets et gérez vos données en toute sécurité.</p>
      <Link to="/projects" className="btn">Voir les projets</Link>
    </div>
  );
}

export default Home;
