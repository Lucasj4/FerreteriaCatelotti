import React, { useState } from "react";
import "./BudgetComponent.css";
import TableCustom from "../TableCustom/TableCustom";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Checkbox from "@mui/material/Checkbox";

const BudgetComponent = () => {
  const tableHeaders = ["Cliente", "Fecha", "Importe"];
  const data = [
    {
      Cliente: "Juan",
      Fecha: "22/10/2023",
      Importe: "1000",
    },
  ];
  const [proveedores, setProveedores] = useState([
    { value: "Clientes", label: "Clientes" },
  ]);
  const [selectedProveedores, setSelectedProveedores] = useState(null);

  const [tableData, setTableData] = useState(data);

  const handleEliminarFila = (indice) => {
    const nuevasFilas = [...tableData];
    nuevasFilas.splice(indice, 1);
    setTableData(nuevasFilas);
  };

  const [selectedState, setSelectedState] = useState(null);

  return (
    <>
      <div className="budget__container">
        <div className="budget__tablecontainer">
          <div className="presupuesto__option">
            <div className="presupuesto__option__item">
              <MultiSelectOption
                options={proveedores}
                selectedProveedores={selectedProveedores}
                onChange={(selectedOptions) =>
                  setSelectedProveedores(selectedOptions)
                }
                placeholder="Clientes"
              />
            </div>
            <div className="pedido__option__item">
              <input type="text" className="presupuesto__input" />
              <button>Buscar</button>
            </div>
          </div>

          <div className="presupuesto__state">
            <div className="presupuesto__state__item">
              <Checkbox
                checked={selectedState === "Pendiente"}
                onChange={() => setSelectedState("Pendiente")}
              />
              <p>Pendiente</p>
            </div>
            <div className="presupuesto__state__item">
              <Checkbox
                checked={selectedState === "Recibidos"}
                onChange={() => setSelectedState("Recibidos")}
              />
              <p>Finalizados</p>
            </div>
          </div>
          <TableCustom
            headers={tableHeaders}
            data={tableData}
            tableClassName="budget__table"
            theadClassName="custom-thead"
            tbodyClassName="custom-tbody"
            thClassName="budget__table__header"
            trClassName="budget__table__row"
            tdClassName="budget__table__cell"
            link="/nuevalinea"
            actionEditClassName="budget__table__action--edit"
            handleEliminarFila={handleEliminarFila}
            editIconClassName="budget__table__editIcon"
            DeleteIconClassName="budget__table_deleteIcon"
          />
        </div>
      </div>
    </>
  );
};

export default BudgetComponent;
