import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo-mgs.svg';

export default function HomePage() {
  const navigate = useNavigate();

  return (
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
          <button
            className="hero-btn"
            onClick={() => navigate('/login')}
          >
            GET STARTED
          </button>
        </div>
      </section>
    </div>
  );
}

