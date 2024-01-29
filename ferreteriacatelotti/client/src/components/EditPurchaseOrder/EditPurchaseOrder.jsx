import React from "react";
import "./EditPurchaseOrder.css";
import FormItem from "../FormItem/FormItem";
import { Link } from "react-router-dom";

const EditPurchaseOrder = () => {
  const option = ["mt", "litro"];
  return (
    <>
      <div className="editpurchaseorder__container">
        <div className="editpurchaseorder__formcontainer">
          <h2 className="editpurchaseorder__form__title">
            Editar linea
          </h2>
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
                />
                <button className="newPurchaseOrder__form__item__button">
                  Producto
                </button>
              </div>
            </div>

            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="cantindad"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Cantindad"
              labelClassname="newPurchaseOrder__form__label"
            />
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="precioUnitario"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Precio Unitario"
              labelClassname="newPurchaseOrder__form__label"
            />
            <div className="newPurchaseOrder__form__item">
              <label htmlFor="unidad" className="newPurchaseOrder__form__label">
                Unidad
              </label>
              <select className="newPurchaseOrder__form__input" id="unidad">
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
              <button className="editpurchaseorder__form__button">
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
