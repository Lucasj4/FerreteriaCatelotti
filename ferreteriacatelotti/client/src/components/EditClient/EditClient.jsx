import React, { useEffect } from "react";
import { useState } from "react";
import FormItem from "../FormItem/FormItem";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditClient = () => {
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const { cid } = useParams();
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

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/clients/${cid}`,
          {
            credentials: "include",
          }
        );
        if (response) {
          const data = await response.json();
          console.log("Cliente: ", data.client);

          setClientFirstName(data.client.clientFirstName);
          setClientLastName(data.client.clientLastName);
          setClientEmail(data.client.clientEmail);
          setClientDni(data.client.clientDni);
        } else {
          throw new Error("Error al obtener el producto");
        }
      } catch (error) {
        console.log("Error en la solicitud", error);
      }
    };
    fetchClient();
  }, [cid]);

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

  const handlesubmit = async (event) => {
    event.preventDefault();

    const result = await showAlert({
      text: "¿Estas seguro que modificar los datos del cliente?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const clientData = {
        clientFirstName,
        clientLastName,
        clientEmail,
        clientDni,
      };

      console.log("Cliente modificado", clientData);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/clients/${cid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify(clientData),
          }
        );
        const result = await response.json();

        switch (response.status) {
          case 200:
            showAlert({
              title: "Cliente modificado con exito",
              icon: "success",
            });
            break;
          case 400:
            const errorMessages =
              result.errorMessages && result.errorMessages.length > 0
                ? result.errorMessages[0] // Une los mensajes con saltos de línea
                : "Error desconocido";

            showAlert({
              title: "Error al editar cliente",
              text: errorMessages,
              icon: "error",
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
    }
  };
  return (
    <>
      <div className="component__container">
        <div className="component__form__container">
          <h2 className="client__title">Editar cliente</h2>
          <form action="" className="client__form">
            <FormItem
              formItemClassName="form__item"
              id="clientFirstName"
              typeInput="text"
              label="Nombre"
              labelClassname="form__label"
              inputClassname="form__input"
              value={clientFirstName}
              onChange={(e) => setClientFirstName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientLastName"
              typeInput="text"
              label="Apellido"
              labelClassname="form__label"
              inputClassname="form__input"
              value={clientLastName}
              onChange={(e) => setClientLastName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientPhone"
              label="Dni"
              typeInput="number"
              labelClassname="form__label"
              inputClassname="form__input"
              value={clientDni}
              onChange={(e) => setClientDni(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="clientEmail"
              label="Email"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </form>
          <div className="form__containerbuttons">
            <button className="form__button" onClick={handlesubmit}>
              Editar
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

export default EditClient;
