import React, { useState, useEffect } from "react";
import "./BudgetComponent.css";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Checkbox from "@mui/material/Checkbox";
import { Link, useParams } from "react-router-dom";
import Table from "../TableCustom/TableCustom";
import Swal from "sweetalert2";
import { Logger } from "sass";

const BudgetComponent = () => {
  const [filas, setFilas] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedProveedores, setSelectedProveedores] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showOnlyPendiente, setShowOnlyPendiente] = useState(false);

  const tableHeaders = [
    { value: "clientId", label: "Cliente" },
    { value: "budgetDate", label: "Fecha" },
    { value: "budgetStatus", label: "Estado" },
    { value: "budgetAmount", label: "Importe" },
  ];

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/budgets");

        if (response) {
          const budgets = await response.json();

          console.log("Budgets: ", budgets);
          
          setFilas(budgets.budgets);
        }
      } catch (error) {
        throw error;
      }
    };

    fetchBudgets();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients");

        if (response) {
          const data = await response.json();

          setClients(data.clients);
        }
      } catch (error) {
        throw error;
      }
    };
    fetchClients();
  }, []);
  const handleShowOnlySelectedChange = () => {
    setShowOnlySelected(!showOnlySelected);
    setShowOnlyPendiente(false);
  };

  const handleShowOnlyPendienteChange = () => {
    setShowOnlyPendiente(!showOnlyPendiente);
    setShowOnlySelected(false);
  };

  const handleClientChange = (selectedOptions) => {
    setSelectedClients(selectedOptions);
  };

  const handleSearch = async () => {
    // Filtra los presupuestos según cliente y estado
    const clientId =
      selectedClients.length > 0
        ? selectedClients.map((client) => client.value)
        : null; // Si no hay clientes seleccionados, se deja null
    const budgetStatus = showOnlyPendiente
      ? "Pendiente"
      : showOnlySelected
      ? "Facturado"
      : null;

    const queryParams = new URLSearchParams();

    if (clientId) queryParams.append("clientId", clientId);
    if (budgetStatus) queryParams.append("budgetStatus", budgetStatus);

    try {
      const response = await fetch(
        `http://localhost:8080/api/budgets/search?${queryParams.toString()}`
      );

      if (response.status === 200) {
        const result = await response.json();

        console.log("resultado",  result);

        setFilas(result.budgets); // Actualiza el estado de las filas con los presupuestos encontrados
      } else {
        console.error("Error al obtener los presupuestos filtrados");
      }
    } catch (error) {
      console.error("Error en la búsqueda de presupuestos", error);
    }
  };
  const handleDeleteCell = async (idBudget, index) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este presupuesto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        cancelButton: "my-cancel-button-class", // Agrega clase para el botón de cancelar
        overlay: "my-overlay-class",
      },
    });

    if (result.isConfirmed) {
      try {
        // Elimina el presupuesto de la base de datos
        const response = await fetch(
          `http://localhost:8080/api/budgets/${idBudget}`,
          {
            method: "DELETE",
          }
        );

        if (response.status === 200) {
          // Si la eliminación fue exitosa, eliminamos la fila visualmente
          const nuevasFilas = [...filas];
          nuevasFilas.splice(index, 1);
          setFilas(nuevasFilas);
          console.log("Presupuesto eliminado correctamente");
        } else {
          console.error("Error al eliminar el presupuesto en la base de datos");
        }
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    }
  };

  const [selectedState, setSelectedState] = useState(null);

  return (
    <>
      <div className="budget__container">
        <div className="budget__tablecontainer">
          <div className="presupuesto__option">
            <div className="presupuesto__option__item">
              <MultiSelectOption
                options={clients}
                selectedProveedores={selectedClients} // Este prop podría renombrarse a selectedClients para mayor claridad
                onChange={handleClientChange}
                placeholder="Clientes"
                labelKey="clientLastName"
              />
            </div>
            <div className="pedido__option__item">
              <input type="text" className="presupuesto__input" />
              <button onClick={handleSearch}>Buscar</button>
            </div>
          </div>

          <div className="presupuesto__state">
            <div className="presupuesto__state__item">
              <Checkbox
                checked={showOnlyPendiente}
                onChange={handleShowOnlyPendienteChange}
              />
              <p>Pendiente</p>
            </div>
            <div className="presupuesto__state__item">
              <Checkbox
                checked={showOnlySelected}
                onChange={handleShowOnlySelectedChange}
              />
              <p>Facturado</p>
            </div>
          </div>
          <Table
            headers={tableHeaders}
            data={filas}
            tableClassName="budget__table"
            trClassName="table__row"
            thClassName="table__header"
            theadClassName="table__thead"
            tbodyClassName="table__body"
            tdClassName="table__cell"
            actionEditClassName="budget__table__action--edit"
            handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
            deleteIconClassName="table__deleteIcon"
            editIconClassName="table__editIcon"
            getEditPath={(id) => `/presupuesto/${id}`}
          />

          <div className="budget__actions">
            <Link to="/presupuesto/agregarpresupuesto">
              <button className="budget__actions__button">Nuevo</button>
            </Link>
            <button className="budget__actions__button">Facturar</button>
            <button className="budget__actions__button">Guardar</button>
            <button className="budget__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetComponent;
