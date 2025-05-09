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

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/requestresetpassword`,
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
        return showAlert({
          title: "No coinciden los emails",
          icon: "warning",
         
        });
      }

      if (response.status === 200) {
        showAlert({
          title: "Email enviado",
          icon: "success",
          
        });

        navigate('/cambiarcontraseña');
      } else {
        showAlert({
          title: "Error al enviar el email",
          icon: "warning",
          
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
