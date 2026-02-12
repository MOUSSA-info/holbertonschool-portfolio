import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../tailwind.css';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginRes = await api.post('/auth/login', {
        username: username.toLowerCase(),
        password
      });

      localStorage.setItem('token', loginRes.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Erreur lors de la connexion. Vérifiez que le serveur est lancé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Connexion</h2>
      {error && <p className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text" placeholder="Nom d'utilisateur"
          value={username} onChange={e => setUsername(e.target.value)} required />
        <input
          type="password" placeholder="Mot de passe"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
      <p>Pas encore inscrit ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
}

export default Login;
