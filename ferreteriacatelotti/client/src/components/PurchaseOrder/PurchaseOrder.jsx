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
        const response = await fetch("http://localhost:8080/api/purchaseorders");
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
              console.error("Error obteniendo detalles del proveedor:", supplierError);
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
    const selectedSupplierIds = selectedSuppliers.map((supplier) => supplier.id);
    console.log("Selected Supplier IDs:", selectedSupplierIds);
    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    // Verificar si la fecha de inicio es mayor o igual que la fecha de fin
    if (startDate >= endDate) {
        Swal.fire({
            icon: 'error',
            title: 'Error de fechas',
            text: 'La fecha de inicio no puede ser igual o mayor que la fecha de fin.',
            confirmButtonText: 'Entendido',
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
              console.error("Error obteniendo detalles del proveedor:", supplierError);
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

  const handleDeleteRow = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };
  const [errorModalVisible, setErrorModalVisible] = useState(false);



  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
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
            handleDeleteCell={handleDeleteRow}
            linkPrefix="/detallepedido/editarpedido/"
          />
        </div>

        <div className="actions">
          <button className="actions__button" onClick={handleSearch}>Buscar</button>
          <Link to={`/detallepedido/${purchaseOrderId}`}>
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
