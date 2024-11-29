import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [fecha, setFecha] = useState("");// Estado local para fecha
  const [proveedor, setProveedor] = useState("");
  const [estado, setEstado] = useState("Pendiente"); // Valor inicial para evitar que sea undefined
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [detalleIds, setDetalleIds] = useState(new Set());

  const saveData = (nuevaFecha, nuevoProveedor, nuevoEstado, nuevoPurchaseOrderId) => {
    setFecha(nuevaFecha);
    setProveedor(nuevoProveedor);
    setEstado(nuevoEstado);
    
    if (nuevoPurchaseOrderId) {
      setPurchaseOrderId(nuevoPurchaseOrderId);
    }
  };

  const addDetalleId = (id) => {
    setDetalleIds((prevSet) => new Set([...prevSet, id])); // Agrega sin duplicados
  };

  const clearDetalleIds = () => {
    setDetalleIds([]);
  };

  return (
    <OrderContext.Provider value={{ fecha, proveedor, estado, saveData, detalleIds, addDetalleId, clearDetalleIds, purchaseOrderId, setPurchaseOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(OrderContext);
};

export { OrderProvider, useAppContext };
