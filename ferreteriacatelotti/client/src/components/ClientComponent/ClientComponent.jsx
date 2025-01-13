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
  const getAllClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clients", {
        credentials: "include",
      });

      if (response) {
        const clients = await response.json();
        setRows(clients.clients);
      }
    } catch (error) {
      throw error;
    }
  };
  const getClients = async () => {
    try {
      const queryParam =
        searchCriteria === "clientLastName"
          ? `clientLastName=${clientLastName}`
          : `clientEmail=${clientEmail}`;

      const response = await fetch(
        `http://localhost:8080/api/clients/search?${queryParam}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 404 && searchCriteria === "clientLastName") {
        showAlert({
          title: "Cliente no enconctrado con ese apellido",
          icon: "warning",
        });
      } else if (response.status === 404 && searchCriteria === "clientEmail") {
        showAlert({
          title: "Cliente no encontrado con ese email",
          icon: "warning",
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
        const response = await fetch("http://localhost:8080/api/clients", {
          credentials: "include",
        });

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
              onClick={getClients}
            >
              Buscar
            </button>
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
            handleDeleteCell={handleDeleteClient}
            headers={tableHeaders}
            data={rows}
            showActions={true}
          />
          <div className="component__actions">
            <Link to={"/clientes/agregarcliente"}>
              <button className="component__actions__button">Nuevo</button>
            </Link>

            <button className="component__actions__button">Guardar</button>
            <button className="component__actions__button" onClick={getAllClients}>Mostrar todos</button>
            <button className="component__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientComponent;
