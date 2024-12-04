import React from 'react';
import './Invoice.css';  // Asegúrate de tener un archivo CSS para personalizar la factura

const Invoice = ({ client, date, amount }) => {
  return (
    <div className="invoice-container">
      <h1>Factura</h1>
      <div className="invoice-details">
        <div className="invoice-item">
          <strong>Fecha: </strong>
          <span>{date}</span>
        </div>
        <div className="invoice-item">
          <strong>Cliente: </strong>
          <span>{client}</span>
        </div>
        <div className="invoice-item">
          <strong>Importe: </strong>
          <span>${amount}</span>
        </div>
      </div>
      <div className="invoice-footer">
        <button onClick={() => window.print()} className="print-button">
          Imprimir Factura
        </button>
      </div>
    </div>
  );
};

export default Invoice;
