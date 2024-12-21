import { useEffect, useState } from "react";
import Table from "../TableCustom/TableCustom";

const SalesComponent = () => {
  const [rows, setRows] = useState([]);

  const tableHeaders = [
    { value: "clientId", label: "Cliente" },
    { value: "saleDate", label: "Fecha" },
    { value: "userId", label: "Usuario" },
    { value: "saleTotalAmount", label: "Importe" },
    { value: "invoiceNumber", label: "Numero de factura" },
  ];

  useEffect(()=> {
    const fetchSales = async ()=> {
      try {
        const response = await fetch('http://localhost:8080/api/sales', {
          credentials: 'include',
        });

        if(response.status === 200){
          const data = await response.json();
  
          setRows(data.sales);
        }
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
     
    } 

    fetchSales();
  }, [])

  return (
    <>
      <div className="component__container">
        <div className="component__table__container">
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
            getEditPath={(id) => `/sales/${id}`}
            // handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
            data={rows}
          />
        </div>
      </div>
    </>
  );
};

export default SalesComponent;
