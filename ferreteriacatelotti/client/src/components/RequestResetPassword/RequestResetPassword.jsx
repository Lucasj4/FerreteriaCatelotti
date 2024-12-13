import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Login/Login.css";

const RequestResetPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userConfirmationEmail, setUserConfirmationEmail] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/requestresetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
          credentials: "include",
        }
      );

      console.log("Email: ", userEmail);
      console.log("Email confirmacion: ", userConfirmationEmail);

      if (userEmail != userConfirmationEmail) {
        return Swal.fire({
          title: "No coinciden los emails",
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

      if (response.status === 200) {
        Swal.fire({
          title: "Email enviado",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });

        navigate('/cambiarcontraseña');
      } else {
        Swal.fire({
          title: "Error al enviar el email",
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
              <EmailIcon />
              <input
                type="email"
                placeholder="Confirmar email"
                value={userConfirmationEmail}
                onChange={(e) => setUserConfirmationEmail(e.target.value)}
              />
            </div>
          </form>
          <button className="button__login" onClick={handleLoginSubmit}>
            Enviar email
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPassword;
