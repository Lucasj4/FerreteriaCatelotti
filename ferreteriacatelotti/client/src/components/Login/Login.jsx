import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";

const Login = () => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userUsername: username,
          userPassword: password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      console.log("Response: ", data);

      switch (response.status) {
        case 200:
          navigate("/");
          break;

        case 404:
          showAlert({
            title: "Error",
            text: "Usuario no registrado",
            icon: "error",
          });
          break;

        case 401:
          showAlert({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
          break;
        default:
          break;
      }
    } catch (error) {
   
      console.error("Error al hacer la solicitud de login:", error);
    }
  };

 

  return (
    <div className="login__container">
      <div
        className="container__login"
        
      >
        <div className="login__information">
          <div className="login__texts">
            <h2>Bienvenido a Ferreteria Catelotti</h2>
          </div>
        </div>
        <div className="container__formlogin">
          <h2>Inicio Sesion</h2>
          <form action="">
            <div className="container__formlogin__item">
              <PersonIcon />
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="container__formlogin__item">
              <EnhancedEncryptionIcon />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <Link to="/restablecercontraseña">
            <p className="login__forgotpassword">¿Olvidaste tu contraseña?</p>
          </Link>
          <button className="button__login" onClick={handleLoginSubmit}>
            Iniciar Sesion
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default Login;
