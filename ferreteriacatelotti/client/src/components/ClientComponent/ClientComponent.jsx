import React from "react";
import { useState, useEffect } from "react";
import TableCustom from "../TableCustom/TableCustom";
import "./ClientComponent.css";
import { Link } from "react-router-dom";

const ClientComponent = () => {
  const tableHeaders = [
    { value: "clientFirstName", label: "Nombre" },
    { value: "clientLastName", label: "Apellido" },
    { value: "clientDni", label: "Dni" },
    { value: "clientEmail", label: "Email" },
  ];


  useEffect( ()=> {
    
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients");
        console.log("Clientes: ", response);
        if(response){
          const clients = await response.json();
          console.log("Clientes: " , clients);
          
          setFilas(clients.clients)
        }
  
      } catch (error) {
        throw error;
      }
    }
    fetchClientes();
  }, [])
  const [filas, setFilas] = useState([]);
  return (
    <>
      <div className="clientcomponent__container">
        <div className="clientcomponent__table__container">
          <div className="clientcomponent__search-container">
            <input
              type="text"
              className="clientecomponent__search-input"
              placeholder="Cliente"
            />
            <button className="clientecomponent__search-button">Buscar</button>
          </div>
          <TableCustom
            tableClassName="table"
            trClassName="table__row"
            thClassName="table__header"
            theadClassName="table__thead"
            tbodyClassName="table__body"
            tdClassName="table__cell"
            deleteIconClassName="table__deleteIcon"
            editIconClassName="table__editIcon"
            headers={tableHeaders}
            data={filas}
          />
          <div className="component__actions">
            <Link to={"/clientes/agregarcliente"}>
              <button className="component__actions__button">
                Nuevo
              </button>
            </Link>
        
            <button className="component__actions__button">
              Guardar
            </button>
            <button className="component__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientComponent;
