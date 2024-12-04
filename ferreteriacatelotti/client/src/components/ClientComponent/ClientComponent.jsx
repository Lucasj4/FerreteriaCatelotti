import React from "react";
import { useState, useEffect } from "react";
import TableCustom from "../TableCustom/TableCustom";
import "./ClientComponent.css";
import { Link } from "react-router-dom";
import ExportToExcel from "../ExportExcel/ExportExcel"
import Swal from "sweetalert2";

const ClientComponent = () => {
  const [rows, setRows] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("clientLastName");
  const [clientLastName, setClientLastName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const tableHeaders = [
    { value: "clientFirstName", label: "Nombre" },
    { value: "clientLastName", label: "Apellido" },
    { value: "clientDni", label: "Dni" },
    { value: "clientEmail", label: "Email" },
  ];

  const columnMap = {
    clientLastName: "Apellido",
    clientFirstName: "Nombre",
    clientEmail: "Correo Electrónico",
    clientDni: "Dni"
    // Agrega más campos si es necesario
  };

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const handleInputChange = (e) => {
    if (searchCriteria === "clientLastName") {
      setClientLastName(e.target.value);
    } else {
      setClientEmail(e.target.value);
    }
  };

  const getClients = async () => {
    try {
      const queryParam =
        searchCriteria === "clientLastName"
          ? `clientLastName=${clientLastName}`
          : `clientEmail=${clientEmail}`;
          
          const response = await fetch(
        `http://localhost:8080/api/clients/search?${queryParam}`
      );

      if (response.status === 404 && searchCriteria === 'clientLastName') {
        Swal.fire({
          title: "Cliente no enconctrado con ese apellido",
          icon: "warning",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }else if(response.status === 404 && searchCriteria === 'clientEmail'){
        Swal.fire({
          title: "Cliente no encontrado con ese email",
          icon: "warning",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }

      const data = await response.json(); // Convierte la respuesta a JSON

      console.log("data: ", data);
      
      // Asegúrate de que 'products' está disponible en la respuesta
      if (data.clients) {
        setRows(data.clients); // Actualiza el estado con los productos encontrados
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients");

        if (response) {
          const clients = await response.json();
          setRows(clients.clients);
        }
      } catch (error) {
        throw error;
      }
    };
    fetchClientes();
  }, []);

  return (
    <>
      <div className="clientcomponent__container">
        <div className="clientcomponent__table__container">
          <div className="clientcomponent__search-container">
            <select
              className="component__search-select"
              value={searchCriteria}
              onChange={handleSearchCriteriaChange}
            >
              <option value="clientLastName">Apellido</option>
              <option value="clientEmail">Email</option>
            </select>
            <input
              type="text"
              className="clientecomponent__search-input"
              placeholder={
                searchCriteria === "clientLastName" ? "Apellido" : "Email"
              }
              value={searchCriteria === 'clientLastName' ? clientLastName : clientEmail }
              onChange={handleInputChange}
            />
            <button className="clientecomponent__search-button" onClick={getClients}>Buscar</button>
            <ExportToExcel data={rows} fileName={"Clientes"} columnMap={columnMap} />
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
            getEditPath={(id) => `/clientes/${id}`}
            headers={tableHeaders}
            data={rows}
          />
          <div className="component__actions">
            <Link to={"/clientes/agregarcliente"}>
              <button className="component__actions__button">Nuevo</button>
            </Link>

            <button className="component__actions__button">Guardar</button>
            <button className="component__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientComponent;
