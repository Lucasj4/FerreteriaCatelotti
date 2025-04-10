import React, { useState, useEffect, useContext } from "react";
import "../BudgetDetail/BudgetDetail.css";
import Table from "../TableCustom/TableCustom";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import BudgetContext from "../context/BudgetContext";
const NewBudget = () => {
  const [row, setRow] = useState([,]);
  const [clients, setClients] = useState([]);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const {
    budgetDate,
    setBudgetDate,
    budgetStatus,
    setBudgetStatus,
    selectedOption,
    setSelectedOption,
    detailIds,
    budgetId,
    setBudgetId,
    clearDetailIds,
  } = useContext(BudgetContext);

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

  const tableHeaders = [
    { value: "budgetDetailItem", label: "Producto" },
    { value: "budgetDetailQuantity", label: "Cantidad" },
    { value: "budgetDetailSalePrice", label: "Precio de venta" },
  ];


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, {
          credentials: "include",
        });

        const data = await response.json();

        setClients(data.clients);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      }
    };

    fetchClients();

  }, []);

  const handleOptions = (selectedOptions) => {
    setSelectedOption(selectedOptions);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setBudgetStatus(newStatus);
    console.log("estado: ", newStatus);
  };

  const handleDeleteBudgetDetail = async (budgetDetailId, index) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este detalle.",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/budgetsdetails/${budgetDetailId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response) {
          const nuevasFilas = [...tableData];
          nuevasFilas.splice(indice, 1);
          setRow(nuevasFilas);
        } else {
          console.error("Error al eliminar el detalle en la base de datos");
        }
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // Toma el valor directamente del input sin modificarlo
    setBudgetDate(selectedDate);
  };

  const showConfirmationAlert = async (title, text) => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "No, cancelar",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        cancelButton: "my-cancel-button-class",
        overlay: "my-overlay-class",
      },
    });
  };

  const postBudget = async (newBudget) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newBudget),
      });

      const result = await response.json();

      if (response.status === 201) {
        setBudgetId(result.budget._id);
        await showAlert({
          title: "Presupuesto creado con éxito",
          icon: "success",
        });
        navigate(`/presupuesto/${result.budget._id}/detalle/nuevalinea`);
      } else if (response.status === 400) {
        const errorMessages =
          result.errorMessages && result.errorMessages.length > 0
            ? result.errorMessages[0]
            : result.error;

        await showAlert({
          title: "Error al crear presupuesto",
          text: errorMessages,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
      await showAlert({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        icon: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientId = selectedOption.value;

    if(budgetStatus === "Facturado"){
      showAlert({
        title: "Error",
        text: "No se puede facturar un presupuesto vacio",
        icon: "error"
      })
      return;
    }

    if (!budgetDate || !clientId || !budgetStatus) {
      await showAlert({
        title: "Campos incompletos",
        text: "Por favor, completa la fecha, selecciona un cliente y el estado antes de agregar una línea de detalle.",
        icon: "warning",
      });
      return;
    }

    const newBudget = {
      budgetAmount: amount,
      budgetDate: new Date(budgetDate),
      budgetStatus,
      clientId,
      detailIds,
    };

    await postBudget(newBudget);
  };
  return (
    <>
      <div className="budgetdetail__container">
        <div className="budgetdetail__tablecontainer">
          <div className="budgetdetail__title">Agregar presupuesto</div>
          <div className="budgetdetail__option">
            <div className="budgetdetail__option__item">
              <p className="budgetdetail__option__item__title">Fecha</p>
              <input
                type="date"
                className="budgetdetail__option__item__input"
                value={budgetDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="budgetdetail__option__item">
              <p className="budgetdetail__option__item__title">Cliente</p>
              <MultiSelectOption
                options={clients}
                selectedOptions={selectedOption}
                onChange={handleOptions}
                placeholder="Cliente"
                labelKey="clientLastName"
              />
            </div>

            <div className="budgetdetail__option__item">
              <p className="budgetdetail__option__status">Estado</p>
              <select
                value={budgetStatus}
                onChange={handleStatusChange}
                className="budgetdetail__status"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Facturado">Facturado</option>
              </select>
            </div>
          </div>
          <div className="budgetdetail__table">
          <Table
            headers={tableHeaders}
            data={row}
            tableClassName="budget__table"
            trClassName="budget__table__row"
            thClassName="budget__table__header"
            theadClassName="budget__table__thead"
            tbodyClassName="budget__table__body"
            tdClassName="budget__table__cell"
            actionEditClassName="budget__table__action--edit"
            handleDeleteCell={(id, index) =>
              handleDeleteBudgetDetail(id, index)
            }
            deleteIconClassName="table__deleteIcon"
            editIconClassName="table__editIcon"
            getEditPath={(id) => `/presupuesto/detalle/${id}`}
            paginationandcontrols="paginations-and-controls"
          />
          <div className="budgetdetail__containeramount">
            <p className="budgetdetail__amount">Total: ${amount}</p>
          </div>
          </div>

          <div className="budgetdetail__buttoncontainer">
            <Link to={`/presupuesto/agregardetalle`}>
              <button className="budgetdetail__button" onClick={handleSubmit}>
                Nueva línea
              </button>
            </Link>
           
            <Link to="/presupuesto">
              <button className="budgetdetail__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBudget;
