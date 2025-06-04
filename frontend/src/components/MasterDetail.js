import React, { useEffect, useState } from "react";
import { getVentas } from "../services/api";

const MasterDetail = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    getVentas().then(setVentas).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Ventas Registradas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Producto</th><th>Cliente</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.producto}</td>
              <td>{v.cliente}</td>
              <td>{v.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MasterDetail;
