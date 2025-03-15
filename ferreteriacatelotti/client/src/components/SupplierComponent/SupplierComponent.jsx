import { useEffect, useContext, useState } from "react";
import TableCustom from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";
import "./SupplierComponent.css";
import Swal from "sweetalert2";

const SupplierComponent = () => {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const tableHeaders = [
    { value: "supplierFirstName", label: "Nombre" },
    { value: "supplierLastName", label: "Apellido" },
    { value: "supplierEmail", label: "Email" },
    { value: "supplierDni", label: "Dni" },
  ];

  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await fetch("http://localhost:8080/api/suppliers", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 200) {
        setRows(data.suppliers);
      }
    };

    fetchSupplier();
  }, []);

  const showAlert = ({ title, text, icon, showCancelButton = false }) => {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText: "Aceptar",
      cancelButtonText: showCancelButton ? "Cancelar" : undefined,
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
        cancelButton: "my-cancel-button-class",
      },
    });
  };

  const getSuppliers = async () => {
    try {
      const queryParam =
        filter === "name" ? `name=${firstName}` : `lastname=${lastName}`;

      const response = await fetch(
        `http://localhost:8080/api/suppliers/search?${queryParam}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("data: ", data);
      console.log("response status ", response.status);

      if (response.status === 404) {
        showAlert({
          title: "Error",
          text: data.message,
          icon: "error",
        });

        return;
      }

      setRows(data.suppliers);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteSupplier = async (supplierId) => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este proveedor.",
      icon: "warning",
      showCancelButton: true,
    });

    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/suppliers/${supplierId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        switch (response.status) {
          case 200:
            showAlert({
              title: "Proveedor eliminado con éxito",
              icon: "success",
            });
            setRows(rows.filter((supplier) => supplier._id !== supplierId));
            break;
          case 400:
              showAlert({
                title: "Error",
                text: data.message,
                icon: "error",
              });
              break;
          case 404:
            showAlert({
              title: "Proveedor no encontrado",
              icon: "warning",
            });
            break;
          default:
            showAlert({
              title: "Error inesperado",
              text: `Código de estado: ${response.status}`,
              icon: "error",
            });
            console.error(`Estado inesperado: ${response.status}`, response);
            break;
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    } else {
      // Si el usuario cancela la acción
      showAlert({
        title: "Eliminación cancelada",
        icon: "info",
      });
    }
  };

  const getAllSuppliers = async () => {
    const response = await fetch("http://localhost:8080/api/suppliers", {
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 200) {
      setRows(data.suppliers);
    }
  };

  const handleInputChange = (e) => {
    if (filter === "name") {
      setFirstName(e.target.value);
    } else {
      setLastName(e.target.value);
    }
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  return (
    <>
      <div className="component__container">
        <div className="component__table__container ">
          <div className="suppliers__title">
            <p>Proveedores</p>
          </div>
          <div className="suppliers__filter">
            <select
              value={filter}
              onChange={handleFilter}
              className="supplier__filter__select"
            >
              <option value="name">Nombre</option>
              <option value="lastname">Apellido</option>
            </select>
            <input
              type="text"
              placeholder={filter === "name" ? "Nombre" : "Apellido"}
              value={filter === "name" ? firstName : lastName}
              onChange={handleInputChange}
              className="component__search-input"
            />

            <button
              className="component__actions__button"
              onClick={getSuppliers}
            >
              Buscar
            </button>
          </div>
          <div className="supplier__table__container">
            <TableCustom
              tableClassName="table"
              trClassName="table__row"
              thClassName="table__header"
              theadClassName="table__thead"
              tbodyClassName="table__body"
              tdClassName="table__cell"
              deleteIconClassName="table__deleteIcon"
              editIconClassName="table__editIcon"
              handleDeleteCell={handleDeleteSupplier}
              getEditPath={(id) => `/proveedores/${id}`}
              headers={tableHeaders}
              data={rows}
              showActions={true}
              paginationandcontrols="paginations-and-controls"
            />
          </div>

          <div className="component__actions">
            <Link to={"/proveedores/agregarproveedor"}>
              <button className="component__actions__button">Nuevo</button>
            </Link>
            <button
              className="component__actions__button"
              onClick={getAllSuppliers}
            >
              Mostrar todos
            </button>
            <button className="component__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierComponent;
