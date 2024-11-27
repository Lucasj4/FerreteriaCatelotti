import React from "react";
import "./PurchaseOrder.css";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Table from "../TableCustom/TableCustom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAppContext } from "../context/OrderContext";
import Swal from "sweetalert2";

const PurchaseOrder = () => {
  const [filas, setFilas] = useState([]);
  const { fecha, proveedor, saveData, estado, detalleIds, clearDetalleIds } =
    useAppContext();
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showOnlyRecibidos, setShowOnlyRecibidos] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  const tableHeaders = [
    { value: "purchaseOrderDate", label: "Fecha" },
    { value: "purchaseOrderStatus", label: "Estado" },
    { value: "proveedor", label: "Proveedor" },
  ];
  const [selectedProveedores, setSelectedProveedores] = useState(null);

  const [selectedState, setSelectedState] = useState(null);

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
        const response = await fetch("http://localhost:8080/api/suppliers");
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
          "http://localhost:8080/api/purchaseorders"
        );
        const data = await response.json();
        const purchaseOrders = data.purchaseOrders;

        // Mapear cada orden y obtener detalles del proveedor por supplierID
        const ordersWithSuppliers = await Promise.all(
          purchaseOrders.map(async (order) => {
            try {
              // Hacer fetch de proveedor por supplierID
              const supplierResponse = await fetch(
                `http://localhost:8080/api/suppliers/${order.supplierID}`
              );
              const supplierData = await supplierResponse.json();

              // Formatear la orden con el apellido del proveedor
              return {
                ...order,
                proveedor: supplierData.supplier, // Obtener el lastName del proveedor
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
    const selectedSupplierIds = selectedSuppliers.map(
      (supplier) => supplier.id
    );
    console.log("Selected Supplier IDs:", selectedSupplierIds);
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    // Verificar si la fecha de inicio es mayor o igual que la fecha de fin
    if (startDate >= endDate) {
      Swal.fire({
        icon: "error",
        title: "Error de fechas",
        text: "La fecha de inicio no puede ser igual o mayor que la fecha de fin.",
        confirmButtonText: "Entendido",
      });
      return; // Terminar la ejecución si hay un error
    }

    // Crear el objeto de parámetros de búsqueda
    const searchParams = new URLSearchParams();

    if (selectedSupplierIds.length > 0) {
      searchParams.append("suppliers", selectedSupplierIds.join(","));
    }

    if (startDate && endDate) {
      searchParams.append("startDate", startDate.toISOString());
      searchParams.append("endDate", endDate.toISOString());
    }

    if (showOnlySelected) {
      searchParams.append("estado", "Pendiente");
    } else if (showOnlyRecibidos) {
      searchParams.append("estado", "Recibido");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/purchaseorders/search?${searchParams.toString()}`
      );
      const data = await response.json();
      const purchaseOrders = data.purchaseOrders;

      if (response.status === 404) {
        Swal.fire({
          icon: "info",
          text: "No se encontro ningun pedido de compra con los parametros establecidos",
          confirmButtonText: "Entendido",
        });
        return;
      }

      const ordersWithSuppliers = await Promise.all(
        purchaseOrders.map(async (order) => {
          try {
            // Hacer fetch de proveedor por supplierID
            const supplierResponse = await fetch(
              `http://localhost:8080/api/suppliers/${order.supplierID}`
            );
            const supplierData = await supplierResponse.json();
            console.log("Datos del Proveedor: ", supplierData);

            // Formatear la orden con el apellido del proveedor
            return {
              ...order,
              proveedor: supplierData.supplier, // Obtener el lastName del proveedor
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
    console.log("Id purhcase order");
    
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/purchaseorders/${purchaseOrderId}`,
          {
            method: "DELETE",
          }
        );

        
        if (response.status === 200) {
          const nuevasFilas = [...filas];
          nuevasFilas.splice(indice, 1);
          setFilas(nuevasFilas);
          Swal.fire({
            text: "Pedido de compra eliminado con exito",
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              cancelButton: "my-cancel-button-class", // Agrega clase para el botón de cancelar
              overlay: "my-overlay-class",
            },
          });
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const proveedorValue =
      selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";

    // Guarda los datos en el contexto
    saveData(fecha, proveedorValue, estado);

    let purchaseOrderIdToUse = purchaseOrderId;

    // Si no existe el purchaseOrderId, crear uno nuevo
    if (!purchaseOrderId) {
      const newPurchaseOrder = {
        purchaseOrderDate: fecha,
        purchaseOrderStatus: estado,
        supplierID: proveedorValue,
      };

      try {
        const response = await fetch(
          "http://localhost:8080/api/purchaseorders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPurchaseOrder),
          }
        );

        const data = await response.json();
        console.log("data: ", data);

        if (data.purchaseOrder && data.purchaseOrder._id) {
          // Guarda el nuevo purchaseOrderId
          purchaseOrderIdToUse = data.purchaseOrder._id;
          console.log("PurchaseOrder creado con ID: ", purchaseOrderIdToUse);
        } else {
          console.error(
            "Error: No se devolvió un purchaseOrderId del servidor"
          );
          return;
        }
      } catch (error) {
        console.error("Error:", error.message);
        return;
      }
    } else {
      console.log("Usando el existing purchaseOrderId: ", purchaseOrderId);
    }

    // Una vez que tenemos el purchaseOrderIdToUse, actualizamos los detailOrders
    try {
      const updateDetailOrdersResponse = await fetch(
        "http://localhost:8080/api/detailsorder/update-multiple",
        {
          method: "PUT", // Usamos PUT para actualizar registros
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            detalleIds, // Array de IDs de detalle
            purchaseOrderId: purchaseOrderIdToUse, // El ID del purchaseOrder (nuevo o existente)
          }),
        }
      );

      const updateResponseData = await updateDetailOrdersResponse.json();

      if (updateDetailOrdersResponse.ok) {
        console.log("DetailOrders actualizados con éxito");
      } else {
        console.error(
          "Error actualizando los DetailOrders",
          updateResponseData
        );
      }
    } catch (error) {
      console.error("Error al actualizar los DetailOrders:", error.message);
    }

    // Aquí puedes agregar la lógica para redirigir a otra página o hacer otra acción
  };
  return (
    <>
      <div className="purchaseOrder__container">
        <div className="purchaseOrder__filter">
          <div className="dateselector">
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
                    const newStartDate = new Date(e.target.value);
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
                    const newEndDate = new Date(e.target.value);
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
            <p>Proveedor</p>
            <MultiSelectOption
              options={suppliers}
              selectedProveedores={selectedSuppliers}
              onChange={handleSupplierChange}
              placeholder="Select suppliers"
              labelKey="lastName"
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
            thClassName="purchaseOrder__table__header"
            theadClassName="purchaseOrder__table__thead"
            tbodyClassName="purchaseOrder__table__body"
            tdClassName="purchaseOrder__table__cell"
            deleteIconClassName="purchaseOrder__table__deleteIcon"
            editIconClassName="purchaseOrder__table__editIcon"
            headers={tableHeaders}
            data={filas}
            handleDeleteCell={(id, index) => handleDeleteRow(id, index)}
            getEditPath={(id) => `/pedido/${id}`}
          />
        </div>

        <div className="actions">
          <button className="actions__button" onClick={handleSearch}>
            Buscar
          </button>
          <Link to={`/pedido/agregarpedido`}>
            <button className="actions__button">Nuevo</button>
          </Link>
          <button className="actions__button">Imprimir</button>
          <button className="actions__button">Salir</button>
          <button className="actions__button">Guardar</button>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrder;
