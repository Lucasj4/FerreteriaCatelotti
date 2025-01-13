import React, { useState, useEffect, useContext } from "react";
import "./BudgetDetail.css";
import Table from "../TableCustom/TableCustom";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import BudgetContext from "../context/BudgetContext";
const BudgetDetail = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [row, setRow] = useState([]);
  const [clients, setClients] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState("Pendiente");
  const [amount, setAmount] = useState(0);
  const [budgetDate, setBudgetDate] = useState("");
  const { clearBudgetId, budgetId } = useContext(BudgetContext);
  const { pid } = useParams();
  const navigate = useNavigate();

  const showAlert = ({ title = "", text, icon, showCancelButton = false }) => {
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
    { value: "budgetDetailUnitCost", label: "Precio unitario" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      clearBudgetId();
      try {
        const response = await fetch(
          `http://localhost:8080/api/budgets/budgetwithdetails/${pid}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const budgetdetails = data.budgetDetailOrders;
          console.log(budgetdetails);

          const total = budgetdetails.reduce((acc, order) => {
            return (
              acc + order.budgetDetailQuantity * order.budgetDetailUnitCost
            );
          }, 0);

          setAmount(total);
          setRow(budgetdetails);
        } else if (response.status === 404) {
          console.error("Presupuesto no encontrado");
        } else {
          console.error("Error en la respuesta:", response.status);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    const fetchBudget = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/budgets/${pid}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const budget = data.budget;

          // Formatear la fecha de DD/MM/YYYY a YYYY-MM-DD
          const formattedDate = budget.budgetDate
            ? budget.budgetDate.split("/").reverse().join("-")
            : "";

          // Buscar cliente en la lista si ya está cargada
          const clientOption = clients.find(
            (client) => client.clientLastName === budget.clientId
          );

          // Actualizar estados
          setBudgetDate(formattedDate); // Asigna la fecha formateada
          setBudgetStatus(budget.budgetStatus);
          setSelectedOption(
            clientOption
              ? [
                  {
                    label: clientOption.clientLastName, // Campo que se mostrará en el MultiSelect
                    value: clientOption._id, // ID del cliente
                  },
                ]
              : []
          );
        } else {
          console.error("Error al obtener el presupuesto:", response.status);
        }
      } catch (error) {
        console.error("Error al obtener el presupuesto:", error);
      }
    };

    fetchData();
    fetchBudget();
  }, [pid, clients]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients", {
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
          `http://localhost:8080/api/budgetsdetails/${budgetDetailId}`,
          {
            method: "DELETE",

            credentials: "include",
          }
        );

        if (response) {
          const nuevasFilas = [...row];
          nuevasFilas.splice(index, 1);
          setRow(nuevasFilas);
          console.log("Eliminar row: ", row);
          const updatedDetails = row.filter(
            (order) => order._id !== budgetDetailId
          );

          const newTotal = updatedDetails.reduce((acc, order) => {
            return (
              acc + order.budgetDetailQuantity * order.budgetDetailUnitCost
            );
          }, 0);

          // Actualizar el monto con el nuevo total
          setAmount(newTotal);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientId = selectedOption[0]?.value || selectedOption[0]?._id;

    if (!budgetDate) {
      showAlert({
        title: "Debes seleccionar una fecha",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }

    if (!clientId) {
      showAlert({
        title: "Debes seleccionar un cliente",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
    const updateBudget = {
      budgetAmount: amount,
      budgetDate: new Date(budgetDate),
      budgetStatus,
      clientId,
    };

    const response = await fetch(`http://localhost:8080/api/budgets/${pid}`, {
      credentials: "include",
    });

    const data = await response.json();

    const budget = data.budget;

    console.log("dATA: ", data);

    if (budget.budgetStatus === "Facturado") {
      showAlert({
        title: "Error",
        text: "No se puede modificar un presupuesto que ya ha sido facturado",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/budgets/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateBudget),
      });

      if (response.status === 200) {
        showAlert({
          title: "Presupuesto guardado con exito",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error en la petición", error);
    }
  };
  const handleExit = () => {
    showAlert({
      title: "¿Estás seguro de que quieres salir?",
      text: "Si no guardas los cambios, se perderán.",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/presupuesto");
      }
    });
  };

  //Facturar, crear venta, imprimir factura

  const handleInvoice = async () => {
    try {
      // Verificar si el presupuesto ya está facturado
      const response = await fetch(`http://localhost:8080/api/budgets/${pid}`, {
        credentials: "include",
      });
      const budgetData = await response.json();

      if (budgetData.budget.budgetStatus === "Facturado") {
        // Si el presupuesto ya está facturado, mostrar un mensaje de error
        showAlert({
          title: "Este presupuesto ya está facturado",
          text: "No se puede facturar nuevamente.",
          icon: "warning",
        });
        return; // Detener la ejecución si ya está facturado
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
    }

    // Si no está facturado, pedir confirmación para facturar
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez facturado, no podrás modificar el presupuesto.",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        // Paso 2: Actualizar el estado del presupuesto a "Facturado" solo una vez

        const products = row.map((item) => ({
          pid: item.productID,
          quantity: item.budgetDetailQuantity,
          operationType: "decrease",
        }));

        const stockResponse = await fetch(
          `http://localhost:8080/api/products/updateproductstock`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ products }),
          }
        );

        const stockData = await stockResponse.json();

        console.log(stockData);

        if (stockResponse.status === 400 || stockResponse.status === 404) {
          showAlert({
            title: "Error",
            text: stockData.message,
            icon: "warning",
          });
          return; // Detener la ejecución si stockResponse es 400 o 404
        }

        const updateBudget = {
          budgetStatus: "Facturado",
          budgetAmount: amount,
        };

        const updateBudgetResponse = await fetch(
          `http://localhost:8080/api/budgets/updatestatusandamount/${pid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updateBudget),
          }
        );

        const data = await updateBudgetResponse.json();

        console.log("data presupuesto: ", data);

        const budget = data.budget;

        if (updateBudgetResponse.status === 200) {
          const sale = {
            saleDate: budget.budgetDate,
            saleTotalAmount: budget.budgetAmount,
            clientId: budget.clientId,
            userId: budget.userId,
            budgetId: budget._id,
          };
          try {
            const response = await fetch("http://localhost:8080/api/sales", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(sale),
            });

            if (response.status === 201) {
              showAlert({
                text: "Presupuesto facturado. Venta agregada",
                icon: "success",
              });
            }
          } catch (error) {
            console.error("Error en el proceso:", error);
          }

          // Redirigir a otra página si es necesario, por ejemplo:
          navigate(`/presupuesto/${pid}`);
        } else {
          console.log(" status response: ", updateBudgetResponse.status);

          throw new Error("Error al facturar el presupuesto: ");
        }
      } catch (error) {
        console.error("Error en el proceso:", error);
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
    }
  };
  return (
    <>
      <div className="budgetdetail__container">
        <div className="budgetdetail__tablecontainer">
          <div className="budgetdetail__title">Detalle presupuesto</div>
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
              getEditPath={(id) => `/presupuesto/${pid}/detalle/${id}`}
              showActions={true}
            />
            <div className="budgetdetail__containeramount">
              <p className="budgetdetail__amount">Total: ${amount}</p>
            </div>
          </div>

          <div className="budgetdetail__buttoncontainer">
            <Link to={`/presupuesto/${pid}/detalle/nuevalinea`}>
              <button className="budgetdetail__button">Nueva línea</button>
            </Link>
            <button className="budgetdetail__button" onClick={handleInvoice}>
              Facturar
            </button>
            <button className="budgetdetail__button" onClick={handleSubmit}>
              Guardar
            </button>

            <button className="budgetdetail__button" onClick={handleExit}>
              Salir
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetail;
