import React from "react";
import FormItem from "../FormItem/FormItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewClient.css";
import Swal from "sweetalert2";

const NewClient = () => {
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const navigate = useNavigate();

  const showAlert = ({ title, text, icon, showCancelButton = false }) => {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText: "Aceptar",
      cancelButtonText: showCancelButton ? "Cancelar" : undefined, 
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
        cancelButton: "my-cancel-button-class", 
      },
    });
  };

  const resetForm = () => {
    setClientFirstName("");
    setClientLastName("");
    setClientEmail("");
    setClientDni("");
  };

  const handleExit = async (e) => {
    e.preventDefault();

    try {
      const result = await showAlert({
        text: "¿Estas seguro que deseas salir?",
        icon: "warning",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        navigate("/clientes");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      clientFirstName,
      clientLastName,
      clientEmail,
      clientDni,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(clientData),
      });

     
      const result = await response.json();

      switch (response.status) {
        case 201:
          showAlert({
            title: "Cliente registrado con exito",
            icon: "success",
          }).then(() => {
            resetForm();
          });
          break;

        case 400:
          const errorMessages =
            result.errorMessages && result.errorMessages.length > 0
              ? result.errorMessages[0] // Une los mensajes con saltos de línea
              : "Error desconocido";

          showAlert({
            title: "Error al crear producto",
            text: errorMessages,
            icon: "error",
          });
          break;
        case 409:
          const error = result.error;

          showAlert({
            text: `${error}`,
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
          break;

        default:
          showAlert({
            title: "Error inesperado",
            text: `Código de estado: ${response.status}`,
            icon: "error",
          });

          // Registro en la consola para depuración adicional
          console.error(`Estado inesperado: ${response.status}`, response);

          // Puedes agregar redireccionamiento o manejo adicional aquí si es necesario
          break;
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
    }
  };
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
              onChange={(e) => setClientFirstName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientLastName"
              typeInput="text"
              label="Apellido"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setClientLastName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientDni"
              label="Dni"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setClientDni(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientEmail"
              label="Email"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </form>
          <div className="form__containerbuttons">
            <button className="form__button" onClick={handleSubmit}>
              Guardar
            </button>
            <button className="form__button" onClick={handleExit}>
              Salir
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default NewClient;
