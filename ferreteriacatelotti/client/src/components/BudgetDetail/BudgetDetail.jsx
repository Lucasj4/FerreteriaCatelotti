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

          const groupedDetails = budgetdetails.reduce((acc, order) => {
            const existing = acc.find(
              (item) => item.budgetDetailItem === order.budgetDetailItem
            );

            console.log("Existing: ", existing);

            if (existing) {
              // Sumar las cantidades
              existing.budgetDetailQuantity += order.budgetDetailQuantity;

              // Actualizar el costo total basado en la suma de cantidades y el costo unitario original
              existing.totalCost =
                existing.budgetDetailQuantity * order.budgetDetailUnitCost;
            } else {
              // Si es un nuevo producto, se inicializa el totalCost
              acc.push({
                ...order,
                totalCost:
                  order.budgetDetailQuantity * order.budgetDetailUnitCost,
              });
            }

            return acc;
          }, []);

          const total = groupedDetails.reduce((acc, order) => {
            return acc + order.totalCost;
          }, 0);

          setAmount(total);
          setRow(groupedDetails || []);
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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este detalle.",
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
      Swal.fire({
        title: "Debes seleccionar una fecha",
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

    if (!clientId) {
      Swal.fire({
        title: "Debes seleccionar un cliente",
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
    const updateBudget = {
      budgetAmount: amount,
      budgetDate: new Date(budgetDate),
      budgetStatus,
      clientId,
    };
    console.log("updateBudget: ", budgetStatus);

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
        Swal.fire({
          title: "Presupuesto guardado con exito",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }
    } catch (error) {
      console.error("Error en la petición", error);
    }
  };
  const handleExit = () => {
    Swal.fire({
      title: "¿Estás seguro de que quieres salir?",
      text: "Si no guardas los cambios, se perderán.",
      icon: "warning",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
      },
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/presupuesto");
      }
    });
  };

  const handleInvoice = async () => {
    try {
      // Verificar si el presupuesto ya está facturado
      const response = await fetch(`http://localhost:8080/api/budgets/${pid}`);
      const budgetData = await response.json();

      if (budgetData.budget.budgetStatus === "Facturado") {
        // Si el presupuesto ya está facturado, mostrar un mensaje de error
        Swal.fire({
          title: "Este presupuesto ya está facturado",
          text: "No se puede facturar nuevamente.",
          icon: "info",
          confirmButtonText: "Aceptar",
        });
        return; // Detener la ejecución si ya está facturado
      }

      // Si no está facturado, pedir confirmación para facturar
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez facturado, no podrás modificar el presupuesto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, facturar",
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
        // Paso 1: Descontar las cantidades seleccionadas del stock
        for (const item of row) {
          const productId = item.productID; // ID del producto
          const quantityToDecrease = item.budgetDetailQuantity; // Cantidad a descontar

          console.log("Product id: ", productId);

          const response = await fetch(
            `http://localhost:8080/api/products/${productId}`
          );

          const productData = await response.json();
          const currentStock = productData.product.productStock; // Stock actual del producto

          // Verificar si hay suficiente stock
          if (currentStock >= quantityToDecrease) {
            // Descontar el stock
            const updatedStock = currentStock - quantityToDecrease;

            // Actualizar el stock del producto
            const stockResponse = await fetch(
              `http://localhost:8080/api/products/updateproductstock/${productId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ quantityToDecrease: updatedStock }),
              }
            );

            if (stockResponse.status === 200) {
              // Paso 2: Actualizar el estado del presupuesto a "Facturado"
              const updateBudget = {
                budgetStatus: "Facturado", // Cambiar el estado
              };

              const updateBudgetResponse = await fetch(
                `http://localhost:8080/api/budgets/updatestatus/${pid}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },

                  credentials: "include",

                  body: JSON.stringify(updateBudget),
                }
              );

              if (updateBudgetResponse.status === 200) {
                Swal.fire({
                  title: "Presupuesto facturado con éxito",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                  customClass: {
                    title: "my-title-class",
                    popup: "my-popup-class",
                    confirmButton: "my-confirm-button-class",
                    overlay: "my-overlay-class",
                  },
                });

                // Redirigir a otra página si es necesario, por ejemplo:
                navigate(`/presupuesto/${pid}`);
              } else {
                Swal.fire({
                  title: "Error al facturar el presupuesto",
                  icon: "error",
                  confirmButtonText: "Aceptar",
                });
              }
            }
          } else {
            Swal.fire({
              title: "Error",
              text: `No hay suficiente stock para el producto ${item.budgetDetailItem}.`,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
            return; // Detener la facturación si no hay suficiente stock
          }
        }
      }
    } catch (error) {
      console.error("Error al facturar el presupuesto", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al intentar facturar el presupuesto.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <div className="budgetdetail__container">
        <div className="budgetdetail__tablecontainer">
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
          />
          <div className="budgetdetail__containeramount">
            <p className="budgetdetail__amount">Total: ${amount}</p>
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
