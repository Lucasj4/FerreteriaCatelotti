import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./OrderDetail.css";
import { Link } from "react-router-dom";
import MultipleSelect from "../MultipleSelect/MultipleSelect";
import { useAppContext } from "../context/OrderContext";
import Table from "../TableCustom/TableCustom";
import axios from "axios";
const OrderDetail = () => {
  const { fecha, proveedor, saveData, estado } = useAppContext();

  const options = [
    { value: "Gonzalez", label: "Gonzalez" },
    { value: "Martinez", label: "Martinez" },
    { value: "Pedro", label: "Pedro" },
  ];

  const options2 = [
    { value: "pendiente", label: "Pendiente" },
    { value: "recibido", label: "Recibido" },
  ];

  const tableHeaders = [
    { value: "item", label: "Producto" },
    { value: "quantity", label: "Cantidad" },
    { value: "unitCost", label: "Costo Unitario" },
  ];

  const [filas, setFilas] = useState([,]);

  // const getDetailOrders = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8080/detallepedido"); // Hacer la solicitud GET al endpoint
  //     if (!response.ok) {
  //       throw new Error(
  //         `Error en la solicitud: ${response.status} - ${response.statusText}`
  //       );
  //     }

  //     const orders = await response.json();
  //     setFilas(orders);
  //   } catch (error) {
  //     console.error("Error al obtener datos:", error.message);
  //   }
  // };
  const getDetailOrders = async () => {
    try {
      const url = "http://localhost:8080/detallepedido";
      const response = await axios.get(url);
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }
      console.log("Hola desde getdetailorders");
      const orders = await response.json();
      setFilas(orders);
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    }
  };

  useEffect(() => {
    console.log("Ordenes desde useEffect", filas[0]);
    getDetailOrders();
  }, []);

  const handleDeleteCell = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };

  const handleSave = () => {
    const proveedorValue = proveedor.length > 0 ? proveedor[0].value : "";
    console.log(fecha, proveedorValue, estado[0].value);
    saveData(fecha, proveedorValue, estado);
  };

  return (
    <>
      <div className="orderdetail__container">
        <div className="orderdetail__table-container">
          <div className="date-selector">
            <div className="date-selector__item">
              <p>Fecha</p>
              <input
                type="date"
                className="date-selector__item__date"
                onChange={(e) => saveData(e.target.value, proveedor, estado)}
              />
            </div>
            <div className="date-selector__item">
              <p>Proveedor</p>
              <MultipleSelect
                options={options}
                onChange={(value) => saveData(fecha, value, estado)}
              />
            </div>
            <div className="date-selector__item">
              <p>Estado</p>
              <MultipleSelect
                options={options2}
                onChange={(value) => saveData(fecha, proveedor, value)}
              />
            </div>
          </div>
          <div className="orderdetail__tablecontainer">
            <Table
              tableClassName="orderdetail__table"
              trClassName="orderdetail__table__row"
              thClassName="orderdetail__table__header"
              theadClassName="orderdetail__table__thead"
              tbodyClassName="orderdetail__table__body"
              tdClassName="orderdetail__table__cell"
              deleteIconClassName="orderdetail__table__deleteIcon"
              editIconClassName="orderdetail__table__editIcon"
              headers={tableHeaders}
              data={filas}
              handleDeleteCell={handleDeleteCell}
              linkPrefix="/detallepedido/editarpedido/"
            />
          </div>
          <div className="orderdetail__total">
            <p>Total: 6000</p>
          </div>
          <div className="orderdetail__buttons">
            <Link to="/detallepedido/nuevalinea">
              <button onClick={handleSave}>Nueva Linea</button>
            </Link>
            <Link to="/pedido">
              <button>Guardar</button>
            </Link>
            <Link to="/">
              <button>Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
