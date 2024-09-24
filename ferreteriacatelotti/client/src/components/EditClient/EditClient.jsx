import React, { useEffect } from "react";
import { useState } from "react";
import FormItem from "../FormItem/FormItem";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditClient = () => {
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const { cid } = useParams();

  useEffect(() => {
    console.log("Cliente id desde front: " + cid);

    const fetchClient = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/clients/${cid}`
        );
        console.log("Cliente desde edit: ", response);
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

  const handlesubmit = async (event) => {
    event.preventDefault();

    const clientData = {
      clientFirstName,
      clientLastName,
      clientEmail,
      clientDni,
    };
    console.log(clientData);
    try {
      const response = await fetch(`http://localhost:8080/api/clients/${cid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });
      const result = await response.json();

      switch (response.status) {
        case 200:
          Swal.fire({
            title: "Cliente modificado con exito",
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              overlay: "my-overlay-class",
            },
          });
          break;
        case 400:
          const errorMessages =
            result.errorMessages && result.errorMessages.length > 0
              ? result.errorMessages[0] 
              : "Error desconocido";

          Swal.fire({
            title: "Error al editar cliente",
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
            <button className="form__button">Salir</button>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default EditClient;
