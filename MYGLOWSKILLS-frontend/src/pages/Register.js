import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../tailwind.css';
import '../App.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/Dashboard');
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const userData = { username: username.toLowerCase(), password };

      // Création de l'utilisateur
      await api.post('/auth/register', userData);

      // Login automatique
      const loginRes = await api.post('/auth/login', userData);

      // Affiche le token reçu pour debug
      console.log('Token reçu du backend :', loginRes.data.token);

      // Stockage du token
      localStorage.setItem('token', loginRes.data.token);

      // Redirection vers /projects
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="auth-form">
      <h2>Créer un compte</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input 
          type="text" placeholder="Nom d'utilisateur" 
          value={username} onChange={e => setUsername(e.target.value)} required />
        <input 
          type="password" placeholder="Mot de passe" 
          value={password} onChange={e => setPassword(e.target.value)} required />
        <input 
          type="password" placeholder="Confirmer le mot de passe" 
          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type="submit">S'inscrire</button>
      </form>
      <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </div>
  );
}

export default Register;
