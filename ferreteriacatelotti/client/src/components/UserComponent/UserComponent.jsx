import { useState, useEffect } from "react";
import TableCustom from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserComponent.css";
const UserComponent = () => {
  const [row, setRows] = useState([]);
  const [user, setUser] = useState("");
  const tableHeaders = [
    { value: "userUsername", label: "Usuario" },
    { value: "userRole", label: "Rol" },
    { value: "userEmail", label: "Email" },
  ];

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
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          credentials: "include",
        });
        const data = await response.json();

        if (response.status === 200) {
          setRows(data.users);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const getUser = async (e) => {
    e.preventDefault;

    console.log(user);

    try {
      const queryString = new URLSearchParams({
        userUsername: user,
      }).toString();

      console.log("queryString:", queryString); // Asegúrate de que la cadena se construya correctamente

      const response = await fetch(
        `http://localhost:8080/api/users/search?${queryString}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      console.log(response);
      console.log(data.users);
      if (response.status === 200) {
        setRows(data.users);
      } else {
        showAlert({
          title: data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.status === 200) {
        setRows(data.users);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleUser = (e) => {
    setUser(e.target.value);
  };

  const handleDeleteCell = async (id, index) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este presupuesto.",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 200) {
          showAlert({
            title: "Usuario eliminado",
            icon: "success",
          });
          // Si la eliminación fue exitosa, eliminamos la fila visualmente
          const newRows = [...row];
          newRows.splice(index, 1);
          setRows(newRows);
        } else {
          showAlert({
            title: data.message,
            icon: "warning",
          });
          console.error("Error al eliminar el presupuesto en la base de datos");
        }
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    }
  };

  return (
    <>
      <div className="clientcomponent__container">
        <div className="clientcomponent__table__container">
          <div className="user__title">
            <p>Usuarios</p>
          </div>
          <div className="clientcomponent__search-container">
            <input
              type="text"
              className="clientecomponent__search-input"
              placeholder="Usuario"
              onChange={handleUser}
              value={user}
            />
            <button
              className="clientecomponent__search-button"
              onClick={getUser}
            >
              Buscar
            </button>
          </div>
          <div className="client__tablecontainer">
            <TableCustom
              tableClassName="table"
              trClassName="table__row"
              thClassName="table__header"
              theadClassName="table__thead"
              tbodyClassName="table__body"
              tdClassName="table__cell"
              deleteIconClassName="table__deleteIcon"
              editIconClassName="table__editIcon"
              headers={tableHeaders}
              getEditPath={(id) => `/usuarios/${id}`}
              handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
              data={row}
              showActions={true}
              paginationandcontrols="paginations-and-controls"
            />
          </div>

          <div className="clientecomponent__actions">
            <Link to={"/usuarios/agregarusuario"}>
              <button className="clientecomponent__actions__button">
                Nuevo
              </button>
            </Link>
            <button
              className="clientecomponent__actions__button"
              onClick={getUsers}
            >
              Mostrar todos
            </button>
            <Link to={"/insideHome"}>
              <button className="clientecomponent__actions__button">
                Salir
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserComponent;
