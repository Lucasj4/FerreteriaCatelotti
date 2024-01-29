import React, {useState} from "react";
import "./NewPurchaseOrder.css";
import FormItem from "../FormItem/FormItem";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/OrderContext";

const NewPurchaseOrder = () => {
  const option = ["mt", "litro"];
  const { fecha, proveedor, saveData } = useAppContext();
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [unidad, setUnidad] = useState(option[0]);

  const handleCantidad = (e)=>{
    setCantidad(e.target.value);
  }

  const handlePrecioUnitario = e =>{
    setPrecioUnitario(e.target.value);
  }

  const handleUnidad = e =>{
    setUnidad(e.target.value)
  }
  const handleGuardar = async () => {
    try {
      const response = await fetch('http://localhost:8080/detallepedido/nuevalinea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha,
          proveedor,
          producto,
          cantidad,
          precioUnitario,
          unidad,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos al servidor');
      }

      // Puedes hacer algo con la respuesta si es necesario
      const responseData = await response.json();
      console.log(responseData);

      // Limpia los datos del formulario o realiza otras acciones después de guardar
      setProducto("");
      setCantidad("");
      setPrecioUnitario("");
      setUnidad(option[0]);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  return (
    <>
      <div className="newPurchaseOrder__container">
        <div className="newPurchaseOrder__formcontainer">
          <h2 className="newPurchaseOrder__form__title">
            Nuevo Pedido de Compra
          </h2>
          <form action="" className="newPurchaseOrder__form">
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
              label="Cantindad"
              labelClassname="newPurchaseOrder__form__label"
              onChange={handleCantidad}
            />
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="precioUnitario"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Precio Unitario"
              labelClassname="newPurchaseOrder__form__label"
              onChange={handlePrecioUnitario}
            />
            <div className="newPurchaseOrder__form__item">
              <label htmlFor="unidad" className="newPurchaseOrder__form__label">
                Unidad
              </label>
              <select
                className="newPurchaseOrder__form__input"
                id="unidad"
                onChange={handleUnidad}
                value={unidad}
                
              >
                {option.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="newPurchaseOrder__form__containerbuttons">
            <Link to={"/detallepedido"}>
              <button className="newPurchaseOrder__form__button">Salir</button>
            </Link>
            <Link to={"/detallepedido"}>
              <button className="newPurchaseOrder__form__button"  onClick={handleGuardar}>
                Guardar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPurchaseOrder;
