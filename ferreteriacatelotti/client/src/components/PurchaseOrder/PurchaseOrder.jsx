import React from "react";
import "./PurchaseOrder.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { useState } from "react";
import MultiSelectProveedores from "../MultipleSelect/MultipleSelect";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DateSelector from "../DateSelector/DateSelector";

const PurchaseOrder = () => {
  const [filas, setFilas] = useState([
    { fecha: "Fecha 1", proveedor: "Martinez", estado: "Estado 1" },
    { fecha: "Fecha 3", proveedor: "Gonzalez", estado: "Estado 2" },
    { fecha: "Fecha 2", proveedor: "Gonzalez", estado: "Estado 2" },
    { fecha: "Fecha 2", proveedor: "Gonzalez", estado: "Estado 2" },
   
    // Agrega más filas según tus datos
  ]);

  const [proveedores, setProveedores] = useState([
    { value: "gonzalez", label: "Gonzalez" },
    { value: "martinez", label: "Martinez" },
    { value: "pedro", label: "Pedro" },
  ]);

  const [selectedProveedores, setSelectedProveedores] = useState(null);

  const [selectedState, setSelectedState] = useState(null);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  


  const handleEliminarFila = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setErrorModalVisible(true);
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };
  return (
    <>
      <div className="purchaseOrder__container">
        <div className="table-container">
          <div className="purchaseOrder__filter">
            <DateSelector/>
            <div className="purchaseOrder__supplier">
              <p>Proveedor</p>
              <MultiSelectProveedores
                options={proveedores}
                selectedProveedores={selectedProveedores}
                onChange={(selectedOptions) =>
                  setSelectedProveedores(selectedOptions)
                }
              />
            </div>
          </div>

          <div className="order__state">
            <div className="order__state__item">
              <Checkbox
                checked={selectedState === "Pendiente"}
                onChange={() => setSelectedState("Pendiente")}
              />
              <p>Pendiente</p>
            </div>
            <div className="order__state__item">
              <Checkbox
                checked={selectedState === "Recibidos"}
                onChange={() => setSelectedState("Recibidos")}
              />
              <p>Recibidos</p>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="table__header">Fecha </th>
                <th className="table__header">Proveedor</th>
                <th className="table__header">Estado</th>
                <th className="table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, indice) => (
                <tr key={indice} className="table__row">
                  <td className="table__cell">{fila.fecha}</td>
                  <td className="table__cell">{fila.proveedor}</td>
                  <td className="table__cell">{fila.estado}</td>
                  <td className="table__cell">
                    <button
                     
                      className="table__action table__action--edit"
                  
                    >
                      <DeleteIcon onClick={handleEliminarFila} />
                    </button>
                    <Link to="/detallepedido">
                  
                        <EditIcon  className="table__action table__action--delete" />
                   
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="actions">
            <button className="actions__button">Buscar</button>
            <Link to="/detallepedido">
              <button className="actions__button">Nuevo</button>
            </Link>
            <button className="actions__button">Salir</button>
          </div>
        </div>
      </div>

      {errorModalVisible && (
        <div className="modal">
          <div className="modal__content">
            <p>Permiso Denegado</p>
            <div className="modal__content__buttons">
              <button onClick={handleErrorModalClose}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseOrder;
