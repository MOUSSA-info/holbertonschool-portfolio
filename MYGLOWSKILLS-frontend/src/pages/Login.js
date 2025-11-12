import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../tailwind.css';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/projects');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const loginRes = await api.post('/auth/login', {
        username: username.toLowerCase(),
        password
      });

      console.log('Token reçu du backend :', loginRes.data.token);

      localStorage.setItem('token', loginRes.data.token);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="auth-form">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="text" placeholder="Nom d'utilisateur" 
          value={username} onChange={e => setUsername(e.target.value)} required />
        <input 
          type="password" placeholder="Mot de passe" 
          value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
      <p>Pas encore inscrit ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
}

export default Login;
