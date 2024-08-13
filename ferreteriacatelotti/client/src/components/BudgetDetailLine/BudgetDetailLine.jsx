import React from "react";
import "./BudgetDetailLine.css";
import FormItem from "../FormItem/FormItem";
import { Link } from "react-router-dom";

const BudgetDetailLine = () => {
  return (
    <>
      <div className="budgetdetailline__container">
        <div className="budgetdetailline__formcontainer">
          <h2 className="budgetdetailline__form__title"> Nueva linea </h2>
          <form action="" className="budgetdetailline__form">
            <div className="form__item">
              <label
                htmlFor="producto"
                className="form__label"
              >
                Producto
              </label>
              <div className="budgetdetailline__form__item-product">
                <input
                  type="text"
                  className="form__input"
                  id="producto"
                />
                <button className="budgetdetailline__form__item__button">
                  Producto
                </button>
              </div>
            </div>
            <FormItem
              formItemClassName="form__item"
              id="cantidad"
              inputClassname="form__input"
              typeInput="text"
              label="Cantidad"
              labelClassname="form__label"
            />
            <FormItem
              formItemClassName="form__item"
              id="precioUnitario"
              inputClassname="form__input"
              typeInput="text"
              label="Precio Unitario"
              labelClassname="form__label"
            />
            <div className="budgetdetailline__form__item-subtotal">
              <p>Subtotal:</p>
            </div>
          </form>
          <div className="budgetdetailline__containerbutton">
            <button className="budgetdetailline__button">Guardar</button>
            <Link to="/detallepresupuesto">
              <button className="budgetdetailline__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetailLine;
