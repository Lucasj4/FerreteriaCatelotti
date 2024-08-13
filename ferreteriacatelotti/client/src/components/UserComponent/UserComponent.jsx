import React from "react";
import { useState } from "react";
import TableCustom from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";
const UserComponent = () => {
  const tableHeaders = [
    { value: "name", label: "Nombre" },
    { value: "lastname", label: "Apellido" },
    { value: "phone", label: "Telefono" },
    { value: "email", label: "Email" },
  ];
  const [filas, setFilas] = useState([]);
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
            data={filas}
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
