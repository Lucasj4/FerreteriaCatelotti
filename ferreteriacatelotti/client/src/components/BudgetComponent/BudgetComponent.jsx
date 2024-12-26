import React, { useState, useEffect } from "react";
import "./BudgetComponent.css";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Checkbox from "@mui/material/Checkbox";
import { Link, useParams } from "react-router-dom";
import Table from "../TableCustom/TableCustom";
import Swal from "sweetalert2";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BudgetComponent = () => {
  const [filas, setFilas] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedProveedores, setSelectedProveedores] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showOnlyPendiente, setShowOnlyPendiente] = useState(false);

  const tableHeaders = [
    { value: "clientId", label: "Cliente" },
    { value: "budgetDate", label: "Fecha" },
    { value: "budgetStatus", label: "Estado" },
    { value: "budgetAmount", label: "Importe" },
  ];

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

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

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/budgets", {
          credentials: "include",
        });

        if (response) {
          const budgets = await response.json();

          setFilas(budgets.budgets);
        }
      } catch (error) {
        throw error;
      }
    };

    fetchBudgets();
  }, []);

  const getAll = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/budgets", {
        credentials: "include",
      });

      if (response) {
        const budgets = await response.json();

        setFilas(budgets.budgets);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients", {
          credentials: "include",
        });

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

    const startDate = dateRange[0]?.startDate;
    const endDate = dateRange[0]?.endDate;
    console.log("start date: ", startDate);
    console.log("end date: ", endDate);

    if (startDate > endDate) {
      showAlert({
        icon: "error",
        title: "Error de fechas",
        text: "La fecha de inicio no puede ser igual o mayor que la fecha de fin.",
      });
      return; // Terminar la ejecución si hay un error
    }

    const queryParams = new URLSearchParams();

    if (clientId) queryParams.append("clientId", clientId);
    if (startDate) queryParams.append("startDate", startDate.toISOString());
    if (endDate) queryParams.append("endDate", endDate.toISOString());
    if (budgetStatus) queryParams.append("budgetStatus", budgetStatus);

    try {
      const response = await fetch(
        `http://localhost:8080/api/budgets/search?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const result = await response.json();
        console.log("Resultado: ", result.budgets);
        
        setFilas(result.budgets); // Actualiza el estado de las filas con los presupuestos encontrados
      } else if (response.status === 404) {
        const result = await response.json();
        showAlert({
          title: result.message,
          icon: "warning",
        });
      } else {
        console.error("Error al obtener los presupuestos filtrados");
      }
    } catch (error) {
      console.error("Error en la búsqueda de presupuestos", error);
    }
  };
  const handleDeleteCell = async (idBudget, index) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este presupuesto.",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        // Elimina el presupuesto de la base de datos
        const response = await fetch(
          `http://localhost:8080/api/budgets/${idBudget}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.status === 200) {
          showAlert({
            title: "Presupuesto eliminado",
            icon: "success",
          });
          // Si la eliminación fue exitosa, eliminamos la fila visualmente
          const nuevasFilas = [...filas];
          nuevasFilas.splice(index, 1);
          setFilas(nuevasFilas);
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
          <div className="budget__option">
            <div className="budget__option__item">
              <p className="dateselector__title">Fecha</p>
              <div className="dateselector__container">
                <div className="dateselector__item">
                  <p>Desde</p>
                  <input
                    type="date"
                    id="startDate"
                    className="dateselector__date"
                    value={dateRange[0].startDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-");
                      const newStartDate = new Date(year, month - 1, day); // Año, Mes (0-11), Día sin ajuste horario
                      setDateRange([
                        {
                          startDate: newStartDate,
                          endDate: dateRange[0].endDate,
                          key: "selection",
                        },
                      ]);
                    }}
                  />
                </div>
                <div className="dateselector__item">
                  <p>Hasta</p>
                  <input
                    type="date"
                    id="endDate"
                    className="dateselector__date"
                    value={dateRange[0].endDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-");
                      const newEndDate = new Date(year, month - 1, day); // Año, Mes (0-11), Día sin ajuste horario
                      setDateRange([
                        {
                          startDate: dateRange[0].startDate,
                          endDate: newEndDate,
                          key: "selection",
                        },
                      ]);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="budget__option__item">
              <MultiSelectOption
                options={clients}
                selectedProveedores={selectedClients} // Este prop podría renombrarse a selectedClients para mayor claridad
                onChange={handleClientChange}
                placeholder="Clientes"
                labelKey="clientLastName"
              />
            </div>
          </div>

          <div className="budget__state">
            <div className="budget__state__item">
              <Checkbox
                checked={showOnlyPendiente}
                onChange={handleShowOnlyPendienteChange}
              />
              <p>Pendiente</p>
            </div>
            <div className="budget__state__item">
              <Checkbox
                checked={showOnlySelected}
                onChange={handleShowOnlySelectedChange}
              />
              <p>Facturado</p>
            </div>
          </div>
          <div className="budgettable__container">
          <Table
            headers={tableHeaders}
            data={filas}
            tableClassName="budget__table"
            trClassName="budget__table__row"
            thClassName="budget__table__header"
            theadClassName="budget__table__thead"
            tbodyClassName="budget__table__body"
            tdClassName="table__cell"
            actionEditClassName="budget__table__action--edit"
            handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
            deleteIconClassName="table__deleteIcon"
            editIconClassName="table__editIcon"
            getEditPath={(id) => `/presupuesto/${id}`}
            scrollable
          />
          </div>
          

          <div className="budget__actions">
            <Link to="/presupuesto/agregarpresupuesto">
              <button className="budget__actions__button">Nuevo</button>
            </Link>

            <button className="budget__actions__button" onClick={getAll}>
              Mostrar todos
            </button>
            <button className="budget__actions__button" onClick={handleSearch}>
              Buscar
            </button>
            <button className="budget__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetComponent;
