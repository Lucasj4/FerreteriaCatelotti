// OrderContext.js
import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [fecha, setFecha] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [estado, setEstado] = useState("")
  const [detalleIds, setDetalleIds] = useState([]);

  const saveData = (nuevaFecha, nuevoProveedor, nuevoEstado) => {
    setFecha(nuevaFecha);
    setProveedor(nuevoProveedor);
    setEstado(nuevoEstado);
  };

  const addDetalleId = (detalleId) => {
    setDetalleIds((prevIds) => [...prevIds, detalleId]);
  };

  const clearDetalleIds = () => {
    setDetalleIds([]);
  };

  return (
    <OrderContext.Provider value={{ fecha, proveedor, estado, saveData, detalleIds, addDetalleId, clearDetalleIds }}>
      {children}
    </OrderContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(OrderContext);
};

export { OrderProvider, useAppContext };
