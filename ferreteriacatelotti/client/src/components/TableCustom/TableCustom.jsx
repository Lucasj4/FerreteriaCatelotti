import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import './TableCustom.css'

const Table = ({
  tableClassName,
  trClassName,
  thClassName,
  theadClassName,
  tbodyClassName,
  tdClassName,
  deleteIconClassName,
  editIconClassName,
  headers,
  data,
  handleDeleteCell,
  getEditPath,
  scrollable
}) => {
  // Función para enmascarar la contraseña
  const maskPassword = (password) => '*'.repeat(password.length);

  return (
    <table className={tableClassName}>
      <thead className={theadClassName}>
        <tr className={trClassName}>
          {headers.map((header, index) => (
            <th key={index} className={thClassName}>
              {header.label}
            </th>
          ))}
          <th className={thClassName}>Acciones</th>
        </tr>
      </thead>
      <tbody  className={scrollable ? "budget__table__body scrollable" : "budget__table__body"}>
        {data.map((row, index) => (
          <tr key={row._id} className={trClassName}>
            {headers.map((header, colIndex) => (
              <td key={colIndex} className={tdClassName}>
                {header.value === "userPassword"
                  ? maskPassword(row[header.value]) // Enmascarar contraseña
                  : row[header.value]}
              </td>
            ))}
            <td className={tdClassName}>
              <button className={deleteIconClassName}>
                <DeleteIcon onClick={() => handleDeleteCell(row._id, index)} />
              </button>
              <Link to={getEditPath(row._id)}>
                <button className={editIconClassName}>
                  <EditIcon />
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
