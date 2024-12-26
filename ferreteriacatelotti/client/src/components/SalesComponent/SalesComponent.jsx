import { useEffect, useState } from "react";
import Table from "../TableCustom/TableCustom";
import "./SalesComponent.css";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
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

  const handleClientChange = (selectedOptions) => {
    setSelectedClients(selectedOptions);
  };

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  return (
    <>
      <div className="component__container">
        <div className="sale__search">
          <div className="sale__search__item">
            <p className="dateselector__title">Fecha</p>
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
            <MultiSelectOption
              options={users}
              selectedProveedores={selectedUsers} // Este prop podría renombrarse a selectedClients para mayor claridad
              onChange={handleUserChange}
              placeholder="Usuarios"
              labelKey="userUsername"
            />
          </div>

          <div className="sale__search__item">
            <MultiSelectOption
              options={clients}
              selectedProveedores={selectedClients} // Este prop podría renombrarse a selectedClients para mayor claridad
              onChange={handleClientChange}
              placeholder="Clientes"
              labelKey="clientLastName"
            />
          </div>
        </div>
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

          <div className="sale__actions">
                  <button>Mostrar todos</button>
                  <button>Buscar</button>
          </div>
        </div>


      </div>
    </>
  );
};

export default SalesComponent;
