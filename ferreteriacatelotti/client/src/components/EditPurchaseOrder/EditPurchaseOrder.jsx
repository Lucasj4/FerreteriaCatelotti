import React from "react";
import "./EditPurchaseOrder.css";
import Checkbox from "@mui/material/Checkbox";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Table from "../TableCustom/TableCustom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAppContext } from "../context/OrderContext";
import Swal from "sweetalert2";

const EditPurchaseOrder = () => {
  const [filas, setFilas] = useState([]);
  const { fecha, proveedor, saveData, estado, detalleIds, clearDetalleIds } =
    useAppContext();
  const { pid } = useParams();
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [amount, setAmount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  const [localDate, setLocalDate] = useState("");
  const [localStatus, setLocalStatus] = useState("Pendiente");
  const tableHeaders = [
    { value: "detailOrderProduct", label: "Producto" },
    { value: "detailOrderQuantity", label: "Cantidad" },
    { value: "detailOrderUnitCost", label: "Costo Unitario" },
  ];

  const convertDateToISO = (dateString) => {
    const [day, month, year] = dateString.split('/'); // Divide la fecha
    return `${year}-${month}-${day}`; // Devuelve en formato YYYY-MM-DD
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/suppliers"); // Endpoint de proveedores
        const data = await response.json();
        setSuppliers(data.suppliers);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchPurchaseOrderWithDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/purchaseorders/purchaseorderswithdetails/${pid}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener el pedido de compra");
        }
        const data = await response.json();
        const purchaseOrder = data.purchaseOrder;
        const detailOrders = data.detailOrders;

        const total = detailOrders.reduce((acc, order) => {
          return acc + order.detailOrderQuantity * order.detailOrderUnitCost; // Asumiendo que estas propiedades existen
        }, 0);

        
        
        setAmount(total);

        // Aquí puedes hacer lo que necesites con los datos del pedido y sus detalles
        // Por ejemplo, podrías establecer filas con los detalles de la orden
        setFilas(detailOrders);
        // const formattedDate = formatLocalDate(purchaseOrder.purchaseOrderDate);
        // const localDate = new Date(purchaseOrder.purchaseOrderDate);
        // localDate.setMinutes(
        //   localDate.getMinutes() + localDate.getTimezoneOffset()
        // );
        console.log("PURCHASE ORDER DATE: ", purchaseOrder.purchaseOrderDate);
        
        const formattedDate = convertDateToISO(purchaseOrder.purchaseOrderDate);
        console.log("Purchase order formatted: ", formattedDate);
        
        setLocalDate(formattedDate); // Inicializa con la fecha del pedido
        setLocalStatus(purchaseOrder.purchaseOrderStatus || "Pendiente");

        // Seleccionar el proveedor como { label, value }
        const selectedSupplierOption = suppliers.find(
          (supplier) => supplier._id === purchaseOrder.supplierID
        );

        console.log("  selectedSupplierOption : ", selectedSupplierOption);

        if (selectedSupplierOption) {
          setSelectedSuppliers([
            {
              label: `${selectedSupplierOption.lastName}`,
              value: selectedSupplierOption._id,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching purchase order with details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    };

    fetchPurchaseOrderWithDetails();
  }, [pid, saveData, suppliers]);

  const handleSupplierChange = (selectedOptions) => {
    setSelectedSuppliers(selectedOptions); // Actualiza el estado con las opciones seleccionadas
  };

  const handleStatusChange = (e) => {
    const nuevoEstado = e.target.value;
    console.log("Nuevo estado seleccionado: ", nuevoEstado); // Verifica el valor del estado
    setLocalStatus(nuevoEstado); // Actualiza el estado
  };

  const handleDateChange = (e) => {
    setLocalDate(e.target.value); // Convierte el formato a YYYY-MM-DD
  };

  const handleDeleteCell = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };

  // const formatLocalDate = (date) => {
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, "0"); // Ajusta el mes a dos dígitos
  //   const day = String(d.getDate()).padStart(2, "0"); // Ajusta el día a dos dígitos
  //   return `${year}-${month}-${day}`;
  // };

  const handleSave = async (e) => {
    e.preventDefault();

    const proveedorValue =
      selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";

    // Guarda los datos en el contexto
    saveData(fecha, proveedorValue, estado);

    console.log("Fecha", localDate);
    console.log("Proveedor: ", proveedorValue);
    console.log("Estado: ", estado);
    console.log("PurchaseOrderId: ", pid);

    // Crear el objeto para la actualización
    const updatedPurchaseOrder = {
      purchaseOrderDate: localDate,
      purchaseOrderStatus: localStatus,
      purchaseOrderAmount: amount,
      supplierID: proveedorValue,
    };

    try {
      // Actualiza la orden de compra existente
      const response = await fetch(
        `http://localhost:8080/api/purchaseorders/${pid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPurchaseOrder),
        }
      );

      const data = await response.json();
      console.log("Data: ", data);

      if (response.status === 200) {
        Swal.fire({
          title: "Pedido de compra actualizado con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className="orderdetail__container">
        <div className="orderdetail__table-container">
          <div className="date-selector">
            <div className="date-selector__item">
              <p>Fecha</p>
              <input
                type="date"
                className="date-selector__item__date"
                value={localDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="date-selector__item">
              <p>Proveedor</p>
              <MultiSelectOption
                options={suppliers}
                selectedProveedores={selectedSuppliers}
                onChange={handleSupplierChange}
                placeholder="Seleccionar Proveedor"
              />
            </div>
            <div className="date-selector__item">
              <p>Estado</p>
              <select
                value={localStatus || "Pendiente"} // Asegúrate de que nunca sea undefined
                onChange={handleStatusChange}
                className="purchaseOrder__status"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Recibido">Recibido</option>
              </select>
            </div>
          </div>
          <div className="orderdetail__tablecontainer">
            <Table
              tableClassName="orderdetail__table"
              trClassName="orderdetail__table__row"
              thClassName="orderdetail__table__header"
              theadClassName="orderdetail__table__thead"
              tbodyClassName="orderdetail__table__body"
              tdClassName="orderdetail__table__cell"
              deleteIconClassName="orderdetail__table__deleteIcon"
              editIconClassName="orderdetail__table__editIcon"
              headers={tableHeaders}
              data={filas}
              handleDeleteCell={handleDeleteCell}
              linkPrefix="/detallepedido/editarpedido/"
            />
          </div>
          <div className="orderdetail__total">
            <p>Total: ${amount}</p>
          </div>
          <div className="orderdetail__buttons">
            <Link to={`/pedido/${pid}/detallepedido/nuevalinea`}>
              <button>Nueva Linea</button>
            </Link>
        
              <button onClick={handleSave}>Guardar</button>
           
            <Link to="/pedido">
              <button>Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseOrder;
