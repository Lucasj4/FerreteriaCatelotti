import React, { useEffect, useState } from "react";
import "./EditPurchaseOrder.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/OrderContext";


const EditPurchaseOrder = () => {
  const option = ["mt", "litro"];
  const { id } = useParams();
  const { fecha, proveedor, saveData } = useAppContext();

  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [unidad, setUnidad] = useState(option[0]);

  const handleCantidad = (e) => {
    setCantidad(e.target.value);
  };

  const handlePrecioUnitario = (e) => {
    setPrecioUnitario(e.target.value);
  };

  const handleUnidad = (e) => {
    setUnidad(e.target.value);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/detallepedido/${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            console.log("Orden no encontrada");
          } else {
            throw new Error(
              `Error en la solicitud: ${response.status} - ${response.statusText}`
            );
          }
        }

        const orderData = await response.json();
        setProducto(orderData.articulo);
        setCantidad(orderData.cantidad);
        setPrecioUnitario(orderData.precioUnitario);
        setUnidad(orderData.unidad);
      } catch (error) {
        console.error("Error al obtener detalles:", error.message);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleLine = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/detallepedido/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articulo: producto,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            unidad: unidad,
            fecha: fecha,
            proveedor: proveedor
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} - ${response.statusText}`
        );
      }

      console.log("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al guardar los detalles:", error.message);
    }
  };

  return (
    <>
      <div className="editpurchaseorder__container">
        <div className="editpurchaseorder__formcontainer">
          <h2 className="editpurchaseorder__form__title">Editar linea</h2>
          <form action="" className="editpurchaseorder__form">
            <div className="newPurchaseOrder__form__item">
              <label
                htmlFor="producto"
                className="newPurchaseOrder__form__label"
              >
                Producto
              </label>
              <div className="newPurchaseOrder__form__item-product">
                <input
                  type="text"
                  className="newPurchaseOrder__form__input"
                  id="producto"
                  name="producto"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                />
                <button className="newPurchaseOrder__form__item__button">
                  Producto
                </button>
              </div>
            </div>

            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="cantidad"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Cantidad"
              labelClassname="newPurchaseOrder__form__label"
              value={cantidad}
              onChange={handleCantidad}
            />
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="precioUnitario"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Precio Unitario"
              labelClassname="newPurchaseOrder__form__label"
              value={precioUnitario}
              onChange={handlePrecioUnitario}
            />
            <div className="newPurchaseOrder__form__item">
              <label htmlFor="unidad" className="newPurchaseOrder__form__label">
                Unidad
              </label>
              <select
                className="newPurchaseOrder__form__input"
                id="unidad"
                name="unidad"
                value={unidad}
                onChange={handleUnidad}
              >
                {option.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="editpurchaseorder__form__containerbuttons">
            <Link to={"/detallepedido"}>
              <button className="editpurchaseorder__form__button">Salir</button>
            </Link>
            <Link to={"/detallepedido"}>
              <button
                className="editpurchaseorder__form__button"
                onClick={handleLine}
              >
                Guardar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseOrder;
