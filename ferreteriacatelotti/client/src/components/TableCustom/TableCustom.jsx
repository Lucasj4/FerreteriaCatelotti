import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import "./TableCustom.css";

const Table = ({
  tableClassName,
  trClassName,
  thClassName,
  theadClassName,
  tbodyClassName,
  tdClassName,
  deleteIconClassName,
  editIconClassName,
  viewIconClassName,
  headers,
  data,
  handleDeleteCell,
  getEditPath,
  getViewPath,
  scrollable,
  showActions,
  paginationandcontrols,
  rowsPerPage = 5, // Puedes cambiar este valor o hacerlo configurable
}) => {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Function to calculate the current rows to display
  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentRows = data.slice(firstRowIndex, lastRowIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Functions to change pages
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para enmascarar la contraseña
  const maskPassword = (password) => "*".repeat(password.length);

  return (
    <>
      {/* <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr className={trClassName}>
            {headers.map((header, index) => (
              <th key={index} className={thClassName}>
                {header.label}
              </th>
            ))}
            {showActions && <th className={thClassName}>Acciones</th>}
          </tr>
        </thead>
        <tbody
          className={
            scrollable
              ? "budget__table__body scrollable"
              : "budget__table__body"
          }
        >
          {currentRows.map((row, index) => (
            <tr key={row._id} className={trClassName}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className={tdClassName}>
                  {header.value === "userPassword"
                    ? maskPassword(row[header.value])
                    : row[header.value]}
                </td>
              ))}
              {showActions && (
                <td className={tdClassName}>
                  {typeof showActions === "function" &&
                  showActions(row) === "view" ? (
                    <Link to={getViewPath(row._id)}>
                      <button className={viewIconClassName}>
                        <VisibilityIcon />
                      </button>
                    </Link>
                  ) : (
                    <>
                      <button className={deleteIconClassName}>
                        <DeleteIcon
                          onClick={() => handleDeleteCell(row._id, index)}
                        />
                      </button>
                      <Link to={getEditPath(row._id)}>
                        <button className={editIconClassName}>
                          <EditIcon />
                        </button>
                      </Link>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={paginationandcontrols}>
        <button onClick={previousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div> */}

      <table className="table border border-black rounded-lg">
        <thead className="table__header">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="table__cell border border-black">
                {header.label}
              </th>
            ))}
            {showActions && (
              <th className="table__cell border border-black">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-black bg-white text-black">
          {currentRows.map((row, index) => (
            <tr key={row._id} className="table__row border border-black">
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="table__cell border border-black">
                  {header.value === "userPassword"
                    ? maskPassword(row[header.value])
                    : row[header.value]}
                </td>
              ))}
              {showActions && (
                <td className="table__cell border border-black">
                  {typeof showActions === "function" &&
                  showActions(row) === "view" ? (
                    <Link to={getViewPath(row._id)}>
                      <button className="view-button">
                        <VisibilityIcon />
                      </button>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeleteCell(row._id, index)}
                        className="table__deleteIcon"
                      >
                        <DeleteIcon />
                      </button>
                      <Link to={getEditPath(row._id)}>
                        <button className="table__editIcon">
                          <EditIcon />
                        </button>
                      </Link>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginations-and-controls">
        <button onClick={previousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </>
  );
};

export default Table;
