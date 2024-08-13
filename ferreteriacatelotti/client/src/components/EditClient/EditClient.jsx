import React from 'react'
import { useState } from 'react';
import FormItem from '../FormItem/FormItem';
const EditClient = () => {
    const [clientName, setClientName] = useState("");
    const [clientLastName, setClientLastName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
  
    return (
      <>
        <div className="clientecontainer">
          <div className="cliente__form__container">
            <h2 className="client__title">Editar cliente</h2>
            <form action="" className="client__form">
              <FormItem
                formItemClassName="form__item"
                id="clientName"
                typeInput="text"
                label="Nombre"
                labelClassname="form__label"
                inputClassname="form__input"
                onChange={setClientName}
              />
              <FormItem
                formItemClassName="form__item"
                id="clientLastName"
                typeInput="text"
                label="Apellido"
                labelClassname="form__label"
                inputClassname="form__input"
                onChange={setClientLastName}
              />
              <FormItem
                formItemClassName="form__item"
                id="clientPhone"
                label="Telefono"
                typeInput="text"
                labelClassname="form__label"
                inputClassname="form__input"
                onChange={setClientPhone}
              />
              <FormItem
                formItemClassName="form__item"
                id="clientEmail"
                label="Email"
                typeInput="text"
                labelClassname="form__label"
                inputClassname="form__input"
                onChange={setClientEmail}
              />
            </form>
            <div className="form__containerbuttons">
              <button className="form__button">Editar</button>
              <button className="form__button">Salir</button>
            </div>
          </div>
          <div></div>
        </div>
      </>
    );
}

export default EditClient