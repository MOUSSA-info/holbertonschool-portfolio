import React, { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/items') // adapte le endpoint selon ton backend
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Mes données :</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;

