import React from "react";
import FormItem from "../FormItem/FormItem";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import "./NewUser.css";
const NewUser = () => {
  const [userUsername, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("")
  const resetForm = () => {
    setUserName(""), setUserPassword(""), setUserEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      userUsername,
      userPassword,
      userEmail,
      userConfirmPassword,
      userRole: "Dueño",
    };
   
    console.log(" Contrasña confirmacion: ", userConfirmPassword);
    console.log('Password: ', userPassword);
    
    
    if (userPassword !== userConfirmPassword) {
      Swal.fire({
        title: "Las contraseñas no coinciden",
        icon: "warning",
        confirmButtonText: "Aceptar",
        customClass: {
          title: "my-title-class",
          popup: "my-popup-class",
          confirmButton: "my-confirm-button-class",
          overlay: "my-overlay-class",
        },
      })
      return;
  }
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const result = await response.json();

      console.log("result: " + result.isAuthenticated);

      switch (response.status) {
        case 201:
          Swal.fire({
            title: "User creado con exito",
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
              : "Las contraseñas no coinciden";

          Swal.fire({
            title: "Error al agregar usuario",
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
            title: `El email ${userEmail} ya esta registrado`,
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

        case 404:
          Swal.fire({
            title: `${result.message}`,
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
          <h2 className="client__title">Agregar usuario</h2>
          <form action="" className="client__form">
            <FormItem
              formItemClassName="form__item"
              id="userUsername"
              typeInput="text"
              label="Usuario"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setUserName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="userPassword"
              typeInput="password"
              label="Contraseña"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setUserPassword(e.target.value)}
            />

            <FormItem
              formItemClassName="form__item"
              id="userConfirmPassword"
              typeInput="password"
              label="Confirmar contraseña"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setUserConfirmPassword(e.target.value)}
            />

            <FormItem
              formItemClassName="form__item"
              id="userEmail"
              label="Email"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              onChange={(e) => setUserEmail(e.target.value)}
            />

            <div className="form__item">
              {/* <DropdownSelect
                options={options}
                value={userRole}
                onChange={setUserRole}
                placeholder="Selecciona un rol"
              /> */}
            </div>
          </form>
          <div className="form__containerbuttons">
            <button className="form__button" onClick={handleSubmit}>
              Guardar
            </button>
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
