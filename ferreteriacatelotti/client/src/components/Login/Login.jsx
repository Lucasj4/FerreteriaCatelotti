import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { useState, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setErrorModalVisible(true);
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };
  return (
    <div className="login__container">
    <div className={` ${errorModalVisible ? "container__login--modal" : "container__login"}`}>
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
            <input type="text" placeholder="Usuario" />
          </div>
          <div className="container__formlogin__item">
            <EnhancedEncryptionIcon />
            <input type="password" placeholder="Contraseña" />
          </div>
        </form>
        <Link to="/recuperarcontraseña"><p className="login__forgotpassword">¿Olvidaste tu contraseña?</p></Link>
        <button className="button__login" onClick={handleLoginSubmit} >Iniciar Sesion</button>
      </div>
    </div>
    
    {errorModalVisible && (
      <div className="modal">
        <div className="modal__content">
          <p>Usuario o contraseña incorrecto.</p>
          <button onClick={handleErrorModalClose}>Cerrar</button>
        </div>
      </div>
    )}
  </div>
  )
}

export default Login