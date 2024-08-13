import React from "react";
import FormItem from "../FormItem/FormItem";
import { useState } from "react";
import { Link } from "react-router-dom";
const NewUser = () => {
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");

  return (
    <>
      <div className="component__container">
        <div className="component__form__container">
          <h2 className="client__title">Agregar usuario</h2>
          <form action="" className="client__form">
            <FormItem
              formItemClassName="form__item"
              id="userName"
              typeInput="text"
              label="Usuario"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={setUserName}
            />
            <FormItem
              formItemClassName="form__item"
              id="userLastName"
              typeInput="text"
              label="Contraseña"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={setUserLastName}
            />
            <FormItem
              formItemClassName="form__item"
              id="userPhone"
              label="Telefono"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={setUserPhone}
            />
            <FormItem
              formItemClassName="form__item"
              id="userEmail"
              label="Email"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={setUserEmail}
            />
          </form>
          <div className="form__containerbuttons">
            <button className="form__button">Guardar</button>
            <Link to={"/usuarios"}>
              <button className="form__button">Salir</button>
            </Link>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default NewUser;
