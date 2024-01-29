// OrderContext.js
import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [fecha, setFecha] = useState("");
  const [proveedor, setProveedor] = useState("");

  const saveData = (nuevaFecha, nuevoProveedor) => {
    setFecha(nuevaFecha);
    setProveedor(nuevoProveedor);
  };

  return (
    <OrderContext.Provider value={{ fecha, proveedor, saveData }}>
      {children}
    </OrderContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(OrderContext);
};

export { OrderProvider, useAppContext };
