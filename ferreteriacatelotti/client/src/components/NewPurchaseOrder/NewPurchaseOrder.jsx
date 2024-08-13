import React, {useState} from "react";
import "./NewPurchaseOrder.css";
import FormItem from "../FormItem/FormItem";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/OrderContext";

const NewPurchaseOrder = () => {
  const option = ["mt", "litro"];
  const { addDetalleId,  clearDetalleIds } = useAppContext();
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [unidad, setUnidad] = useState(option[0]);

  const handleQuantity = (e)=>{
    setQuantity(e.target.value);
  }

  const handleUnitCost = e =>{
    setUnitCost(e.target.value);
  }

  const handleUnidad = e =>{
    setUnidad(e.target.value)
  }
  const handleGuardar = async () => {
    try {
      const response = await fetch('http://localhost:8080/detallepedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          item,
          quantity,
          unitCost,
         
        }),
      });
      console.log(item)
      console.log(response);
      if (!response.ok) {
        throw new Error('Error al enviar los datos al servidor');
      }

      // Puedes hacer algo con la respuesta si es necesario
      const responseData = await response.json();
      console.log("detalle", responseData.detail);
      console.log("Id del detalle", responseData.detail._id);
      // addDetalleId(responseData._id);

      // Limpia los datos del formulario o realiza otras acciones después de guardar
      setItem("");
      setQuantity("");
      setUnitCost("");
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
            Nuevo Linea
          </h2>
          <form action="" className="newPurchaseOrder__form">
            <div className="newPurchaseOrder__form__item">
              <label
                htmlFor="item"
                className="newPurchaseOrder__form__label"
              >
                Producto
              </label>
              <div className="newPurchaseOrder__form__item-product">
                <input
                  type="text"
                  className="newPurchaseOrder__form__input"
                  id="item"
                  onChange={(e) => setItem(e.target.value)}
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
              onChange={handleQuantity}
            />
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="precioUnitario"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Costo Unitario"
              labelClassname="newPurchaseOrder__form__label"
              onChange={handleUnitCost}
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
