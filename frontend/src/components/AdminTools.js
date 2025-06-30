import React, { useState } from 'react';
import { populateDatabase } from '../services/api';

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePopulate = async () => {
    if (window.confirm('¿Estás seguro de poblar la base de datos con datos de prueba? Esto borrará todos los datos existentes.')) {
      setLoading(true);
      setError(null);
      setResult(null);
      
      try {
        const response = await populateDatabase();
        setResult(response.data);
      } catch (err) {
        setError('Error al poblar la base de datos');
        console.error('Error populating database:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-tools">
      <h2>Herramientas de Administración</h2>
      <button onClick={handlePopulate} disabled={loading}>
        {loading ? 'Poblando base de datos...' : 'Poblar Base de Datos con Datos de Prueba'}
      </button>
      
      {error && <p className="error">{error}</p>}
      
      {result && (
        <div className="result">
          <h3>Resultado:</h3>
          <p>✅ {result.message}</p>
          <p>👤 Usuarios añadidos: {result.users_added}</p>
          <p>🛒 Productos añadidos: {result.products_added}</p>
          <p>👥 Clientes añadidos: {result.clients_added}</p>
        </div>
      )}
    </div>
  );
};

export default AdminTools;