import Table from "../TableCustom/TableCustom";
import { useState } from "react";
import { Link } from "react-router-dom";
const SupplierManagement = () => {
  const tableHeaders = [
    { value: "name", label: "Nombre" },
    { value: "lastname", label: "Apellido" },
    { value: "phone", label: "Telefono" },
    { value: "email", label: "Email" },
  ];
  const [filas, setFilas] = useState([]);
  return (
    <>
      <div className="component__container">
        <div className="component__table__container">
          <div className="component__search__container">
            <input
              type="text"
              className="component__search-input"
              placeholder="Proveedor"
            />
            <button className="component__search-button">Buscar</button>
          </div>
          <Table
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
        <div className="component__actions">
          <Link to={"/proveedores/agregarproveedor"}>
            <button className="component__actions__button">Nuevo</button>
          </Link>
          <button className="component__actions__button">Guardar</button>
          <button className="component__actions__button">Salir</button>
        </div>
        </div>
      </div>
    </>
  );
};

export default SupplierManagement;
