import { useEffect, useContext, useState } from "react";
import TableCustom from "../TableCustom/TableCustom";

const SupplierComponent = () => {
  const [rows, setRows] = useState([]);

  const tableHeaders = [
    { value: "supplierFirstname", label: "Nombre" },
    { value: "supplierLastName", label: "Apellido" },
    { value: "supplierEmail", label: "Email" },
    { value: "supplierDni", label: "Dni" },
  ];

  useEffect( () => {
    const fetchSupplier = async () => {
        const response = await fetch("http://localhost:8080/api/suppliers", {
          credentials: 'include',
        })

        
    }
  }, []);
  return (
    <>
      <div className="component__container">
        <div className="component__table__container ">
        <TableCustom
          tableClassName="table"
          trClassName="table__row"
          thClassName="table__header"
          theadClassName="table__thead"
          tbodyClassName="table__body"
          tdClassName="table__cell"
          deleteIconClassName="table__deleteIcon"
          editIconClassName="table__editIcon"
          getEditPath={(id) => `/proveedores/${id}`}
          headers={tableHeaders}
          data={rows}
        />
        </div>
      </div>
    </>
  );
};

export default SupplierComponent;
