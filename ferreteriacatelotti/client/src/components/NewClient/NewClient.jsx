import React from "react";
import FormItem from "../FormItem/FormItem";
import { useState } from "react";
import "./NewClient.css";
import Swal from "sweetalert2"; 

const NewClient = () => {
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const resetForm = () => {
    setClientFirstName("");
    setClientLastName("");
    setClientEmail("");
    setClientDni("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      clientFirstName,
      clientLastName,
      clientEmail,
      clientDni
    }
    try {
      const response = await fetch( "http://localhost:8080/api/clients",  
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })
      
      console.log("clientData:", clientData);
      const result = await response.json();

      switch (response.status) {
        case 201:
          Swal.fire({
            title: "Cliente registrado con exito",
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              overlay: "my-overlay-class",
            },
          }).then(() => {
            resetForm();
          });
          break;

        case 400:
          const errorMessages =
            result.errorMessages && result.errorMessages.length > 0
              ? result.errorMessages[0] // Une los mensajes con saltos de línea
              : "Error desconocido";

          Swal.fire({
            title: "Error al crear producto",
            text: errorMessages,
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              overlay: "my-overlay-class",
            },
          });
          break;
        case 409:
          Swal.fire({
            title: `Error al agregar cliente: ${clientFirstName} ${clientLastName} ya se encuentra registrado como cliente`,
            icon: "warning",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              overlay: "my-overlay-class",
            },
          });
          break;

        default:
          Swal.fire({
            title: "Error inesperado",
            text: `Código de estado: ${response.status}`,
            icon: "error",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              overlay: "my-overlay-class",
            },
          });

          // Registro en la consola para depuración adicional
          console.error(`Estado inesperado: ${response.status}`, response);

          // Puedes agregar redireccionamiento o manejo adicional aquí si es necesario
          break;
      }
    
    } catch (error) {
      console.error("Error en la solicitud", error);
    }
  }
  return (
    <>
      <div className="clientcontainer">
        <div className="client__form__container">
          <h2 className="client__title">Agregar cliente</h2>
          <form action="" className="client__form">
            <FormItem
              formItemClassName="form__item"
              id="clientName"
              typeInput="text"
              label="Nombre"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e)=> setClientFirstName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientLastName"
              typeInput="text"
              label="Apellido"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e)=> setClientLastName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientDni"
              label="Dni"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e)=> setClientDni(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientEmail"
              label="Email"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e)=> setClientEmail(e.target.value)}
            />
          </form>
          <div className="form__containerbuttons">
            <button className="form__button" onClick={handleSubmit}>Guardar</button>
            <button className="form__button">Salir</button>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default NewClient;
