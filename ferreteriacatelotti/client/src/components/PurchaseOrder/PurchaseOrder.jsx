import React from "react";
import "./PurchaseOrder.css";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Table from "../TableCustom/TableCustom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAppContext } from "../context/OrderContext";
import Swal from "sweetalert2";

const PurchaseOrder = () => {
  const [filas, setFilas] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showOnlyRecibidos, setShowOnlyRecibidos] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  const tableHeaders = [
    { value: "purchaseOrderDate", label: "Fecha" },
    { value: "purchaseOrderStatus", label: "Estado" },
    { value: "proveedor", label: "Proveedor" },
    { value: "purchaseOrderAmount", label: "Importe" },
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

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleShowOnlySelectedChange = () => {
    setShowOnlySelected(!showOnlySelected);
    setShowOnlyRecibidos(false);
  };

  const handleShowOnlyRecibidosChange = () => {
    setShowOnlyRecibidos(!showOnlyRecibidos);
    setShowOnlySelected(false);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/suppliers", {
          credentials: "include",
        });
        const result = await response.json();

        setSuppliers(result.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers: ", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/purchaseorders",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        const purchaseOrders = data.purchaseOrders;

        // Mapear cada orden y obtener detalles del proveedor por supplierID
        const ordersWithSuppliers = await Promise.all(
          purchaseOrders.map(async (order) => {
            try {
              // Hacer fetch de proveedor por supplierID
              const supplierResponse = await fetch(
                `http://localhost:8080/api/suppliers/${order.supplierID}`,
                {
                  credentials: "include",
                }
              );
              const supplierData = await supplierResponse.json();

              // Formatear la orden con el apellido del proveedor
              return {
                ...order,
                proveedor: supplierData.supplier.supplierLastName, // Obtener el lastName del proveedor
              };
            } catch (supplierError) {
              console.error(
                "Error obteniendo detalles del proveedor:",
                supplierError
              );
              return { ...order, proveedor: "Proveedor desconocido" }; // Fallback si la búsqueda falla
            }
          })
        );

        setFilas(ordersWithSuppliers); // Establecer las filas con los nombres de los proveedores
      } catch (error) {
        console.error("Error obteniendo pedidos de compra: ", error);
      }
    };

    fetchPurchaseOrders();
  }, []);

  const handleSearch = async () => {
    console.log("SelectedSuppliers: ", selectedSuppliers);

    const startDate = dateRange[0]?.startDate;
    const endDate = dateRange[0]?.endDate;

    const supplier = selectedSuppliers.value;
    console.log("Supplier: ", supplier);

    if (startDate > endDate) {
      showAlert({
        icon: "error",
        title: "Error de fechas",
        text: "La fecha de inicio no puede ser igual o mayor que la fecha de fin.",
      });
      return; // Terminar la ejecución si hay un error
    }

    // Crear el objeto de parámetros de búsqueda
    const searchParams = new URLSearchParams();

    if (supplier) searchParams.append("supplier", supplier);
    if (startDate) searchParams.append("startDate", startDate.toISOString());
    if (endDate) searchParams.append("endDate", endDate.toISOString());

    if (showOnlySelected) {
      searchParams.append("estado", "Pendiente");
    } else if (showOnlyRecibidos) {
      searchParams.append("estado", "Recibido");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/purchaseorders/search?${searchParams.toString()}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      const purchaseOrders = data.purchaseOrders;

      console.log("Respuesta: ", data);

      if (response.status === 404) {
        showAlert({
          icon: "warning",
          text: "No se encontro ningun pedido de compra con los parametros establecidos",
        });
        return;
      }
      console.log("Purchase orders: ", purchaseOrders);

      const ordersWithSuppliers = await Promise.all(
        purchaseOrders.map(async (order) => {
          try {
            // Hacer fetch de proveedor por supplierID
            const supplierResponse = await fetch(
              `http://localhost:8080/api/suppliers/${order.supplierID}`,
              {
                credentials: "include",
              }
            );
            const supplierData = await supplierResponse.json();

            // Formatear la orden con el apellido del proveedor
            return {
              ...order,
              proveedor: supplierData.supplier.supplierLastName, // Obtener el lastName del proveedor
            };
          } catch (supplierError) {
            console.error(
              "Error obteniendo detalles del proveedor:",
              supplierError
            );
            return { ...order, proveedor: "Proveedor desconocido" }; // Fallback si la búsqueda falla
          }
        })
      );

      setFilas(ordersWithSuppliers);
    } catch (error) {
      console.error("Error al buscar órdenes de compra:", error);
    }
  };

  const handleSupplierChange = (selectedOptions) => {
    setSelectedSuppliers(selectedOptions);
  };

  const handleDeleteRow = async (purchaseOrderId, indice) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este pedido de compra.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/purchaseorders/${purchaseOrderId}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Error al obtener el pedido");

      const { purchaseOrder } = await response.json();

      if (purchaseOrder.purchaseOrderStatus === "Recibido") {
        showAlert({
          title: "No se puede eliminar un pedido de compra ya recibido",
          icon: "error",
        });
        return;
      }

      const deleteResponse = await fetch(
        `http://localhost:8080/api/purchaseorders/${purchaseOrderId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (deleteResponse.status === 200) {
        const nuevasFilas = [...filas];
        nuevasFilas.splice(indice, 1);
        setFilas(nuevasFilas);

        showAlert({
          text: "Pedido de compra eliminado con éxito",
          icon: "success",
        });
      } else {
        throw new Error("Error al eliminar el pedido");
      }
    } catch (error) {
      console.error(error);
      showAlert({
        title: "Error",
        text: "Hubo un problema al eliminar el pedido",
        icon: "error",
      });
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/purchaseorders", {
        credentials: "include",
      });
      const data = await response.json();
      const purchaseOrders = data.purchaseOrders;

      console.log(purchaseOrders);

      // Mapear cada orden y obtener detalles del proveedor por supplierID
      const ordersWithSuppliers = await Promise.all(
        purchaseOrders.map(async (order) => {
          try {
            // Hacer fetch de proveedor por supplierID
            const supplierResponse = await fetch(
              `http://localhost:8080/api/suppliers/${order.supplierID}`,
              {
                credentials: "include",
              }
            );
            const supplierData = await supplierResponse.json();

            // Formatear la orden con el apellido del proveedor
            return {
              ...order,
              proveedor: supplierData.supplier.supplierLastName, // Obtener el lastName del proveedor
            };
          } catch (supplierError) {
            console.error(
              "Error obteniendo detalles del proveedor:",
              supplierError
            );
            return { ...order, proveedor: "Proveedor desconocido" }; // Fallback si la búsqueda falla
          }
        })
      );

      setFilas(ordersWithSuppliers);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="purchaseOrder__container">
        <div className="component__table__container">
          <div className="purchaseorder__title">Pedidos de compra</div>
          <div className="purchaseOrder__filter">
            <div className="dateselector">
              <h4>Fecha</h4>
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
            <div className="purchaseOrder__supplier">
              <h4>Proveedor</h4>
              <MultiSelectOption
                options={suppliers}
                selectedOptions={selectedSuppliers}
                onChange={handleSupplierChange}
                placeholder="Select suppliers"
                labelKey="supplierLastName"
              />
            </div>
          </div>

          <div className="order__state">
            <div className="order__state__item">
              <Checkbox
                checked={showOnlySelected}
                onChange={handleShowOnlySelectedChange}
              />
              <p>Pendiente</p>
            </div>
            <div className="order__state__item">
              <Checkbox
                checked={showOnlyRecibidos}
                onChange={handleShowOnlyRecibidosChange}
              />
              <p>Recibidos</p>
            </div>
          </div>

          <div className="purchaseOrder__tablecontainer">
            <Table
              tableClassName="purchaseOrder__table"
              trClassName="purchaseOrder__table__row"
              thClassName="table__header"
              theadClassName="table__thead"
              tbodyClassName="purchaseOrder__table__body"
              tdClassName="purchaseOrder__table__cell"
              deleteIconClassName="purchaseOrder__table__deleteIcon"
              editIconClassName="purchaseOrder__table__editIcon"
              headers={tableHeaders}
              data={filas}
              handleDeleteCell={(id, index) => handleDeleteRow(id, index)}
              getEditPath={(id) => `/pedido/${id}`}
              showActions={true}
            />
          </div>

          <div className="actions">
            <button className="actions__button" onClick={handleSearch}>
              Buscar
            </button>
            <Link to={`/pedido/agregarpedido`}>
              <button className="actions__button">Nuevo</button>
            </Link>
            <button className="actions__button" onClick={getAllProducts}>
              Mostrar todos
            </button>
            <Link to={"/insideHome"}>
              <button className="actions__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrder;
