import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <header>
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>MyGlowSkills</h1>
      <nav>
        {location.pathname !== '/' && location.pathname !== '/dashboard' && location.pathname !== '/login' && location.pathname !== '/register' && (
          <button className="btn-back" onClick={() => navigate(-1)}>← Retour</button>
        )}
        <Link to="/">Accueil</Link>
        {isLoggedIn ? (
          <button className="btn-back" onClick={handleLogout}>Déconnexion</button>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
