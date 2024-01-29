import React from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TableCustom = ({
  tableClassName,
  trClassName,
  thClassName,
  theadClassName,
  tbodyClassName,
  data,
  headers,
  tdClassName,
  handleEliminarFila,
  link,
  editIconClassName,
  DeleteIconClassName
}) => {
  return (
    <>
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr className={trClassName}>
            {headers.map((header, index) => (
              <th key={index} className={thClassName}>
                {header}
              </th>
            ))}
            <th className={thClassName}>Acciones</th>
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={trClassName}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className={tdClassName}>
                  {row[header]}
                </td>
              ))}
              <td className={tdClassName}>
                <button className={DeleteIconClassName}>
                  <DeleteIcon onClick={() => handleEliminarFila(rowIndex)} />
                </button>
                <Link to={link}>
                  <EditIcon className={editIconClassName} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableCustom;
