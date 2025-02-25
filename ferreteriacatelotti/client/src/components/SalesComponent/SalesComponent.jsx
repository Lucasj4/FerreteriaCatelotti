import { useEffect, useState } from "react";
import Table from "../TableCustom/TableCustom";
import "./SalesComponent.css";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Swal from "sweetalert2";
const SalesComponent = () => {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const tableHeaders = [
    { value: "clientId", label: "Cliente" },
    { value: "saleDate", label: "Fecha" },
    { value: "userId", label: "Usuario" },
    { value: "saleTotalAmount", label: "Importe" },
    { value: "invoiceNumber", label: "Numero de factura" },
  ];

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

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
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/sales", {
          credentials: "include",
        });

        if (response.status === 200) {
          const data = await response.json();

          setRows(data.sales);
        }
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients", {
          credentials: "include",
        });

        if (response) {
          const data = await response.json();

          setClients(data.clients);
        }
      } catch (error) {
        throw error;
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          credentials: "include",
        });

        if (response) {
          const data = await response.json();

          setUsers(data.users);
        }
      } catch (error) {
        throw error;
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    const clientId = selectedClients.value;
    // selectedClients.length > 0
    //   ? selectedClients.map((client) => client.value)
    //   : null; // Si no hay clientes seleccionados, se deja null

    const startDate = dateRange[0]?.startDate;
    const endDate = dateRange[0]?.endDate;

    const userId = selectedUsers.value;
    // selectedUsers.length > 0 ? selectedUsers.map((user) => user.value) : null;

    if (startDate > endDate) {
      showAlert({
        icon: "error",
        title: "Error de fechas",
        text: "La fecha de inicio no puede ser igual o mayor que la fecha de fin.",
      });
      return; // Terminar la ejecución si hay un error
    }

    const queryParams = new URLSearchParams();

    if (clientId) queryParams.append("clientId", clientId);
    if (startDate)
      queryParams.append("startDate", startDate.toISOString().split(".")[0]);
    if (endDate)
      queryParams.append("endDate", endDate.toISOString().split(".")[0]);
    if (userId) queryParams.append("userId", userId);

    console.log(clientId);
    console.log("estar date desde front: ", startDate);
    console.log("end date desde front: ", endDate);
    console.log(userId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/sales/search?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const result = await response.json();
        console.log("Resultado: ", result.sales);

        setRows(result.sales); // Actualiza el estado de las filas con los presupuestos encontrados
      } else if (response.status === 404) {
        const result = await response.json();
        showAlert({
          title: result.message,
          icon: "warning",
        });
      } else {
        console.error("Error al obtener los ventas filtrados");
      }
    } catch (error) {
      console.error("Error en la búsqueda de ventas", error);
    }
  };

  const handleClientChange = (selectedOptions) => {
    setSelectedClients(selectedOptions);
  };

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const getAll = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/sales", {
        credentials: "include",
      });

      const data = await response.json();

      setRows(data.sales);
    } catch (error) {
      console.error("Error en la búsqueda de ventas", error);
    }
  };

  return (
    <>
      <div className="component__container">
        <div className="component__table__container">
          <div className="sale__title">Ventas</div>
          <div className="sale__search">
            <div className="sale__search__item">
              <h4>Fecha</h4>
              <div className="dateselector__container">
                <div className="dateselector__item">
                  <p>Desde</p>
                  <input
                    type="date"
                    id="startDate"
                    className="dateselector__date"
                    value={dateRange[0].startDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-");
                      const newStartDate = new Date(year, month - 1, day); // Año, Mes (0-11), Día sin ajuste horario
                      setDateRange([
                        {
                          startDate: newStartDate,
                          endDate: dateRange[0].endDate,
                          key: "selection",
                        },
                      ]);
                    }}
                  />
                </div>
                <div className="dateselector__item">
                  <p>Hasta</p>
                  <input
                    type="date"
                    id="endDate"
                    className="dateselector__date"
                    value={dateRange[0].endDate.toISOString().split("T")[0]}
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-");
                      const newEndDate = new Date(year, month - 1, day); // Año, Mes (0-11), Día sin ajuste horario
                      setDateRange([
                        {
                          startDate: dateRange[0].startDate,
                          endDate: newEndDate,
                          key: "selection",
                        },
                      ]);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="sale__search__item">
              <h4>Usuario</h4>
              <MultiSelectOption
                options={users}
                selectedProveedores={selectedUsers} // Este prop podría renombrarse a selectedClients para mayor claridad
                onChange={handleUserChange}
                placeholder="Usuarios"
                labelKey="userUsername"
              />
            </div>

            <div className="sale__search__item">
              <h4>Cliente</h4>
              <MultiSelectOption
                options={clients}
                selectedProveedores={selectedClients} // Este prop podría renombrarse a selectedClients para mayor claridad
                onChange={handleClientChange}
                placeholder="Clientes"
                labelKey="clientLastName"
              />
            </div>
          </div>
          <div className="sale__table__container">
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
              // getEditPath={(id) => `/sales/${id}`}
              getViewPath={(id) => `/ventas/${id}`}
              // handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
              showActions={(row) => "view"}
              data={rows}
              viewIconClassName="view-button"
            />
          </div>

          <div className="sale__actions">
            <button onClick={getAll}>Mostrar todas</button>
            <button onClick={handleSearch}>Buscar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesComponent;
