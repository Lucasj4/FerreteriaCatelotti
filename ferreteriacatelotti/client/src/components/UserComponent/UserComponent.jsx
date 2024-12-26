import { useState, useEffect } from "react";
import TableCustom from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import './UserComponent.css'
const UserComponent = () => {
  const [row, setRows] = useState([]);

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

  useEffect(()=> {

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          credentials: 'include',
        });
        const data = await response.json();

        if(response.status === 200){
          setRows(data.users)
        }


      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    }

    fetchUsers();

  }, [])

  const handleDeleteCell = async (id, index) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este presupuesto.",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.status === 200) {
         showAlert({
            title: "Presupuesto eliminado",
            icon: "success",
            
          });
          // Si la eliminación fue exitosa, eliminamos la fila visualmente
          const newRows = [...row];
          newRows.splice(index, 1);
          setRows(newRows);
        } else {
          console.error("Error al eliminar el presupuesto en la base de datos");
        }
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    }
  }
  
  return (
    <>
        <div className="clientcomponent__container">
        <div className="clientcomponent__table__container">
          <div className="clientcomponent__search-container">
            <input
              type="text"
              className="clientecomponent__search-input"
              placeholder="Usuario"
            />
            <button className="clientecomponent__search-button">Buscar</button>
          </div>
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
            getEditPath={(id) =>`/users/${id}`}
            handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
            data={row}
          />
          <div className="clientecomponent__actions">
        
            <Link to={"/usuarios/agregarusuario"}>
              <button className="clientecomponent__actions__button">Nuevo</button>
            </Link>
            <button className="clientecomponent__actions__button">Guardar</button>
            <button className="clientecomponent__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserComponent;
