import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FormItem from "../FormItem/FormItem";
import Swal from "sweetalert2";
const EditUser = () => {
  const [userUsername, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const { id } = useParams();

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
    const fetchUser = async () => {
      console.log(id);

      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          credentials: "include",
        });

        const data = await response.json();

        const user = data.user;

        console.log(user);

        setUserName(user.userUsername);
        setUserEmail(user.userEmail);
        setUserRole(user.userRole);
      } catch (error) {
        console.error("Error en la solicitud", error);
      }
    };

    fetchUser();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();

    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "¿Confirmar modificacion de usuario?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const updateData = {
          userUsername,
          userEmail,
          userRole,
        };

        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(updateData),
        });

        if (response.status === 200) {
          showAlert({
            title: "Usuario modificado",
            icon: "success",
          });
        } else {
          const data = await response.json();
          const errorMessages =
            data.errorMessages && data.errorMessages.length > 0
              ? data.errorMessages[0] // Une los mensajes con saltos de línea
              : "Error desconocido";
          console.log(data.error);
          showAlert({
            title: errorMessages || data.message,
            icon: "warning",
          });
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
          <h2 className="client__title">Editar usuario</h2>
          <form action="" className="client__form">
            <FormItem
              formItemClassName="form__item"
              id="userUsername"
              typeInput="text"
              label="Usuario"
              labelClassname="form__label"
              inputClassname="form__input"
              value={userUsername}
              onChange={(e) => setUserName(e.target.value)}
            />

            <FormItem
              formItemClassName="form__item"
              id="userEmail"
              label="Email"
              typeInput="text"
              labelClassname="form__label"
              inputClassname="form__input"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />

            <div className="form__item">
              <label htmlFor="userRole" className="form__label">
                Rol de usuario
              </label>
              <select
                id="userRole"
                className="form__select"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="">Selecciona un rol</option>
                <option value="Admin">Admin</option>
                <option value="Empleado">Empleado</option>
                <option value="Dueño">Dueño</option>
              </select>
            </div>
          </form>
          <div className="form__containerbuttons">
            <button className="form__button" onClick={updateUser}>
              Guardar
            </button>
            <Link to={"/usuarios"}>
              <button className="form__button">Salir</button>
            </Link>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default EditUser;
