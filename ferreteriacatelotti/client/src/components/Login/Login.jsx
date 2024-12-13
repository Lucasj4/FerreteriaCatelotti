import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";


const Login = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    
    console.log(username);
    console.log(password);
    
    
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
      
      console.log("Response: ", response);
      
     
      if (response.status === 200) {
        // Si la respuesta es exitosa, redirigir al usuario o manejar el login
        console.log(response);
        console.log("docuement cokkie: " ,document.cookie);
        console.log(data);
       
        
        navigate('/productos')
        
        // Por ejemplo, podrías redirigir al usuario o hacer otras acciones
        // window.location.href = "/dashboard"; // ejemplo de redirección
      } else {
        // Si la respuesta no es exitosa, mostrar el modal de error
        setErrorModalVisible(true);
      }
    } catch (error) {
      // Manejar errores de red
      console.error("Error al hacer la solicitud de login:", error);
      setErrorModalVisible(true);
    }
  };

  const handlelogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users/logout", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
        credentials: "include", 
      });

      if(response.status === 200){
        console.log("Logout exitoso");
        
      }
    } catch (error) {
      console.error("Error al hacer la solicitud de logout:", error);
    }

  }

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
          <button className="button__login" onClick={handlelogout}>Logout</button>
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
  );
};

export default Login;
