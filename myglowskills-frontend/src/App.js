import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
// Remplace ceci par ton vrai composant Login
const Login = () => <div>Page de connexion à implémenter</div>;

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/items') // adapte le endpoint selon ton backend
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

