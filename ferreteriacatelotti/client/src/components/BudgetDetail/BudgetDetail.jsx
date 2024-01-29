import React, { useState } from "react";
import "./BudgetDetail.css";
import TableCustom from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";

import MultiSelectOption from "../MultipleSelect/MultipleSelect";
const BudgetDetail = () => {
  const option = [
    { value: "Martinez", label: "Martinez" },
    { value: "Gonzalez", label: "Gonzalez" },
  ];
  const [selectedOption, setSelectedOption] = useState([]);
  const tableHeaders = ["Articulo", "Cantidad", "Precio Unitario", "Subtotal"];
  const data = [
    {
      Articulo: "Martillo",
      Cantidad: 3,
      "Precio Unitario": 1500,
      Subtotal: 4500,
    },
  ];

  const [tableData, setTableData] = useState(data);

  const handleEliminarFila = (indice) => {
    const nuevasFilas = [...tableData];
    nuevasFilas.splice(indice, 1);
    setTableData(nuevasFilas);
  };
  return (
    <>
      <div className="budgetdetail__container">
        <div className="budgetdetail__tablecontainer">
          <div className="budgetdetail__option">
            <div className="budgetdetail__option__item">
              <p className="budgetdetail__option__item__title">Fecha</p>
              <input
                type="date"
                className="budgetdetail__option__item__input"
              />
            </div>
            <div className="budgetdetail__option__item">
              <p className="budgetdetail__option__item__title">Cliente</p>
              <MultiSelectOption
                options={option}
                selectedProveedores={selectedOption}
                onChange={(selectedOptions) =>
                  setSelectedOption(selectedOptions)
                }
                placeholder="Cliente"
              />
              <button className="budgetdetail__option__item__button">
                Buscar
              </button>
            </div>
          </div>
          <TableCustom
            headers={tableHeaders}
            data={data}
            tableClassName="budgetdetail__table"
            theadClassName="custom-thead"
            tbodyClassName="custom-tbody"
            thClassName="budgetdetail__table__header"
            trClassName="budgetdetail__table__row"
            tdClassName="budgetdetail__table__cell"
            link="/nuevalinea"
            actionEditClassName="budgetdetail__table__action--edit"
            handleEliminarFila={handleEliminarFila}
            editIconClassName="budgetdetail__table__editIcon"
            DeleteIconClassName="budgetdetail__table_deleteIcon"
          />
          <div className="budgetdetail__containeramount">
            <p className="budgetdetail__amount">Total:</p>
          </div>

          <div className="budgetdetail__buttoncontainer">
            <Link to="/detallepresupuesto/nuevalinea">
              <button className="budgetdetail__button">Nueva linea</button>
            </Link>
            <button className="budgetdetail__button">Guardar</button>
            <Link to="/presupuesto">
              <button className="budgetdetail__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetail;
