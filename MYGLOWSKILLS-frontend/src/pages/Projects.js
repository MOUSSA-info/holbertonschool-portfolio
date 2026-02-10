import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => {
        setError('Impossible de charger les projets.');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="projects-grid">
      {projects.map(p => (
        <div key={p._id} className="project-card">
          <h3>{p.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default Projects;
