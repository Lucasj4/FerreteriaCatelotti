import React from "react";
import "./PurchaseOrder.css";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MultiSelectProveedores from "../MultipleSelect/MultipleSelect";
import Table from "../TableCustom/TableCustom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAppContext } from "../context/OrderContext";

const PurchaseOrder = () => {
  const [filas, setFilas] = useState([]);
  const { fecha, proveedor, saveData, estado, detalleIds, clearDetalleIds } =
    useAppContext();
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [showOnlyRecibidos, setShowOnlyRecibidos] = useState(false);

  const [proveedores, setProveedores] = useState([
    { value: "gonzalez", label: "Gonzalez" },
    { value: "martinez", label: "Martinez" },
    { value: "pedro", label: "Pedro" },
  ]);

  const tableHeaders = [
    { value: "fecha", label: "Fecha" },
    { value: "estado", label: "Estado" },
    { value: "importe", label: "Importe" },
    {value: "proveedor", label: "Proveedor"}
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


  const handleSearchOrders = async () => {
    try {
      let estadoFilter = "";
      if (showOnlySelected) {
        estadoFilter = "Pendiente";
      } else if (showOnlyRecibidos) {
        estadoFilter = "Recibido";
      }
  
      const fromDate = dateRange[0].startDate.toISOString().split("T")[0];
      const toDate = dateRange[0].endDate.toISOString().split("T")[0];
  
      const response = await fetch(
        `http://localhost:8080/pedido?estado=${estadoFilter}&fromDate=${fromDate}&toDate=${toDate}`
      );
  
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }
  
      const orders = await response.json();
  
      const formattedOrders = orders.map((order) => {
        const fecha = new Date(order.fecha);
        const dia = fecha.getDate().toString().padStart(2, "0");
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${año}`;

        order.proveedor = "Gonzalez"
        return {
          ...order,
          fecha: fechaFormateada,
        };
      });
  
      setFilas(formattedOrders);
    } catch (error) {
      console.error("Error al buscar pedidos:", error.message);
    }
  };
  

  const getOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/pedido"); // Hacer la solicitud GET al endpoint
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }

      const orders = await response.json();
      console.log(orders)
    
      console.log(orders)
      
      const formattedOrders = orders.map(order => {

        const fecha = new Date(order.fecha);

        const dia = fecha.getDate().toString().padStart(2, "0");
        const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const año = fecha.getFullYear();

        const fechaFormateada = `${dia}/${mes}/${año}`;
        order.proveedor = "Gonzalez"
        return {
          ...order,
          fecha: fechaFormateada
        };
      });

      setPurchaseOrderId(purchaseOrderId);
      setFilas(formattedOrders);
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    }
  };



  useEffect(() => {
    getOrders();
  }, []);

  const saveDataOrder = async () => {
    try {
      // Asegúrate de que estado sea una cadena antes de la solicitud
      const estadoString = Array.isArray(estado) ? estado[0].value : estado;

      const response = await fetch("http://localhost:8080/pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha,
          proveedor,
          estado: estadoString,
          importe: 15000, // Aquí asegúrate de que estado sea una cadena
        }),
      });
     
      if (!response.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }
      const responseData = await response.json();
      const purchaseOrderId = responseData._id;

      const responseDetailOrder = await fetch(
        "http://localhost:8080/detallepedido",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purchaseOrderId,
            detalleIds,
          }),
        }
      );

      clearDetalleIds();

      if (!responseDetailOrder.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleDeleteRow = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setErrorModalVisible(true);
  };

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
            <MultiSelectProveedores
              options={proveedores}
              selectedProveedores={selectedProveedores}
              onChange={(selectedOptions) =>
                setSelectedProveedores(selectedOptions)
              }
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
          <button className="actions__button" onClick={handleSearchOrders}>
            Buscar
          </button>
          <Link to={`/detallepedido/${purchaseOrderId}`}>
            <button className="actions__button">Nuevo</button>
          </Link>
          <button className="actions__button">Imprimir</button>
          <button className="actions__button">Salir</button>
          <button className="actions__button" onClick={saveDataOrder}>
            Guardar
          </button>
        </div>
      </div>

      {errorModalVisible && (
        <div className="modal">
          <div className="modal__content">
            <p>Permiso Denegado</p>
            <div className="modal__content__buttons">
              <button onClick={handleErrorModalClose}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseOrder;
