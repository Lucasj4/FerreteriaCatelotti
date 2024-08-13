// Table.js
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

}) => {
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
      <tbody className={tbodyClassName}>
        {data.map((row, index) => (
          <tr key={row._id} className={trClassName}>
            {headers.map((header, colIndex) => (
              <td key={colIndex} className={tdClassName}>
                {row[header.value]}
              </td>
            ))}
            <td className={tdClassName}>
              <button className={deleteIconClassName}>
                <DeleteIcon onClick={() => handleDeleteCell(row._id)} />
              </button>
              <Link to={`${row._id}`}>
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
