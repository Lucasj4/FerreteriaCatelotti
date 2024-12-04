import { useState, useEffect } from "react";
import TableCustom from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";
import './UserComponent.css'
const UserComponent = () => {
  const [row, setRows] = useState([]);

  const tableHeaders = [
    { value: "userUsername", label: "Usuario" },
    { value: "userPassword", label: "Contraseña" },
    { value: "userEmail", label: "Email" },
  ];

  useEffect(()=> {

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users");
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
