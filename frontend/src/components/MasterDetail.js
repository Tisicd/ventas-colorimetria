import React, { useEffect, useState } from "react";
import { getVentas } from "../services/api";

const MasterDetail = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const data = await getVentas();
        
        // Verificar si la respuesta es válida
        if (data && data.sales && Array.isArray(data.sales)) {
          setVentas(data.sales);
        } else {
          setError("Formato de datos inválido");
          console.error("Respuesta inesperada:", data);
        }
      } catch (err) {
        setError("Error al cargar las ventas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  if (loading) {
    return <div>Cargando ventas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Ventas Registradas</h2>
      
      {ventas.length === 0 ? (
        <p>No hay ventas registradas</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{new Date(v.fecha).toLocaleDateString()}</td>
                <td>{v.cliente_nombre}</td>
                <td>{v.producto_nombre}</td>
                <td>${v.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MasterDetail;