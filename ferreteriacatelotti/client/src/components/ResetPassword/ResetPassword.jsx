import React, { useState } from "react";

import EmailIcon from "@mui/icons-material/Email";
import PinIcon from '@mui/icons-material/Pin';
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Login/Login.css";

const ResetPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmationPassword, setUserConfirmationPassword] = useState("");
  const [userToken, setUserToken] = useState("");
  

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            userPassword,
            userToken

          }),
          credentials: "include",
        }
      );

      console.log("Email: ", userEmail);
   

      if (userPassword != userConfirmationPassword) {
        return Swal.fire({
          title: "No coinciden las contraseñas",
          icon: "warning",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }
      const data = await response.json();

      if (response.status === 200) {
        Swal.fire({
          title: "Contraseña reestablecida con exito",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });

        // navigate('/cambiocontraseña');
      } else {
        Swal.fire({
          title: `${data.message}`,
          icon: "warning",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }
    } catch (error) {
      // Manejar errores de red
      console.error("Error al hacer la solicitud de login:", error);
    }
  };

  return (
    <div className="login__container">
      <div className="container__login">
        <div className="login__information">
          <div className="login__texts">
            <h2>Ferreteria Catelotti</h2>
          </div>
        </div>
        <div className="container__formlogin">
          <h2>Restablecer Contraseña</h2>
          <form action="">
            <div className="container__formlogin__item">
              <EmailIcon />
              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="container__formlogin__item">
              <PinIcon />
              <input
                type="text"
                placeholder="Numero de confirmacion"
                value={userToken}
                onChange={(e) => setUserToken(e.target.value)}
              />
            </div>
            <div className="container__formlogin__item">
              <EnhancedEncryptionIcon />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div className="container__formlogin__item">
            <EnhancedEncryptionIcon />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={userConfirmationPassword}
                onChange={(e) => setUserConfirmationPassword(e.target.value)}
              />
            </div>
          </form>
          <button className="button__login" onClick={handleLoginSubmit}>
            Reestablecer contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;