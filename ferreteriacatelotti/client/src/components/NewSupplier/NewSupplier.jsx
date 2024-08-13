import { useState } from "react";
import FormItem from "../FormItem/FormItem";
import { Link } from "react-router-dom";
import "./NewSupplier.css";

const NewSupplier = () => {
  const [supplierName, setSupplierName] = useState("");
  const [supplierLastName, setSupplierLastName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  return (
    <>
      <div className="component__container">
        <div className="supplier__form__container">
          <h2 className="supplier__title">Agregar Proveedor</h2>
          <form action="">
            <FormItem
              formItemClassName="form__item"
              id="supplierName"
              typeInput="text"
              label="Nombre"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="supplierLastName"
              typeInput="text"
              label="Apellido"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierLastName}
              onChange={(e) => setSupplierLastName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="supplierPhone"
              typeInput="text"
              label="Telefono"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierPhone}
              onChange={(e) => setSupplierPhone(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="supplierEmail"
              typeInput="text"
              label="Email"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
            />
          </form>

          <div className="form__containerbuttons">
            <button type="button" className="form__button">
              Guardar
            </button>
            <Link to={"/proveedores"}>
              <button type="button" className="form__button">
                Salir
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSupplier;
