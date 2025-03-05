import React from "react";
import { useState, useEffect } from "react";
import TableCustom from "../TableCustom/TableCustom";
import "./ClientComponent.css";
import { Link } from "react-router-dom";

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

  const showAlert = ({ title, text, icon, showCancelButton = false }) => {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText: "Aceptar",
      cancelButtonText: showCancelButton ? "Cancelar" : undefined,
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
        cancelButton: "my-cancel-button-class",
      },
    });
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

  const getFilteredClients = () => {
    const query =
      searchCriteria === "clientLastName"
        ? `clientLastName=${clientLastName}`
        : `clientEmail=${clientEmail}`;
    getClients(query);
  };

  const getClients = async (searchQuery = "") => {
    try {
      const url = searchQuery
        ? `http://localhost:8080/api/clients/search?${searchQuery}`
        : "http://localhost:8080/api/clients";

      const response = await fetch(url, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRows(data.clients);
      } else {
        console.error("Error fetching clients:", response.status);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    getClients(); // Llamado inicial
  }, []);

  const handleDeleteClient = async (clientId) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este proveedor.",
      icon: "warning",
      showCancelButton: true,
    });

    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/clients/${clientId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        switch (response.status) {
          case 200:
            showAlert({
              title: "Cliente eliminado con éxito",
              icon: "success",
            });
            setRows(rows.filter((client) => client._id !== clientId));
            break;
          case 404:
            showAlert({
              title: "Cliente no encontrado",
              icon: "warning",
            });
            break;
          default:
            showAlert({
              title: "Error inesperado",
              text: `Código de estado: ${response.status}`,
              icon: "error",
            });
            console.error(`Estado inesperado: ${response.status}`, response);
            break;
        }
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    } else {
      // Si el usuario cancela la acción
      showAlert({
        title: "Eliminación cancelada",
        icon: "info",
      });
    }
  };

  return (
    <>
      <div className="clientcomponent__container">
        <div className="clientcomponent__table__container">
          <div className="clientcomponent__title">
            <p>Clientes</p>
          </div>
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
              value={
                searchCriteria === "clientLastName"
                  ? clientLastName
                  : clientEmail
              }
              onChange={handleInputChange}
            />
            <button
              className="clientecomponent__search-button"
              onClick={getFilteredClients} // Aquí llamas a la función
            >
              Buscar
            </button>
          </div>
          <div className="client__tablecontainer">
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
              handleDeleteCell={handleDeleteClient}
              headers={tableHeaders}
              data={rows}
              showActions={true}
              paginationandcontrols="paginations-and-controls"
            />
          </div>

          <div className="component__actions">
            <Link to={"/clientes/agregarcliente"}>
              <button className="component__actions__button">Nuevo</button>
            </Link>

            <button className="component__actions__button">Guardar</button>
            <Link to={"/insideHome"}>
              <button className="component__actions__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientComponent;
