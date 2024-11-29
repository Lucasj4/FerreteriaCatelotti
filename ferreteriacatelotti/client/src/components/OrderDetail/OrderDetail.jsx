import React, { useState, useEffect } from "react";
import "./OrderDetail.css";
import { Link, useNavigate } from "react-router-dom";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import { useAppContext } from "../context/OrderContext";
import Table from "../TableCustom/TableCustom";
import Swal from "sweetalert2";
import { amber } from "@mui/material/colors";

const OrderDetail = () => {
  const { purchaseOrderId, setPurchaseOrderId } = useAppContext();
  const [purchaseOrderDate, setPurchaseOrderDate] = useState("");
  const [purchaseOrderStatus, setPurchaseOrderStatus] = useState("Pendiente");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(" ");
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const navigate = useNavigate();

  const options2 = [
    { value: "pendiente", label: "Pendiente" },
    { value: "recibido", label: "Recibido" },
  ];

  const tableHeaders = [
    { value: "detailOrderProduct", label: "Producto" },
    { value: "detailOrderQuantity", label: "Cantidad" },
    { value: "detailOrderUnitCost", label: "Costo Unitario" },
  ];

  const [filas, setFilas] = useState([,]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/suppliers");
        const result = await response.json();
        setSuppliers(result.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers: ", error);
      }
    };

    fetchSuppliers();
  }, []);

  // useEffect(()=> {
  //   const fetchDetailsOrder = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8080/api/detailsorder");

  //       const data = await response.json();

  //       setFilas(data.data)
  //     } catch (error) {
  //       console.error("Error fetching suppliers: ", error);
  //     }
  //   }

  //   fetchDetailsOrder();
  // }, [])

  // useEffect(() => {
  //   console.log("Detalles IDs actualizados: ", detalleIds);
  //   // Aquí podrías actualizar la tabla o realizar otras acciones si es necesario
  // }, [detalleIds]);

  const handleSupplierChange = (selectedOptions) => {
    setSelectedSuppliers(selectedOptions);

    const selectedProveedorValue =
      selectedOptions.length > 0 ? selectedOptions[0].value : "";

    setSelectedSupplier(selectedProveedorValue);
    console.log("provedor: ", selectedProveedorValue);
  };

  const handleDeleteCell = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    console.log("Nuevo estado seleccionado: ", newStatus); // Verifica el valor del estado
    setPurchaseOrderStatus(newStatus); // Actualiza el estado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const proveedorValue =
      selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";
    console.log("Fecha", purchaseOrderDate);
    console.log("Estado: ", purchaseOrderStatus);
    console.log("Proveedor: ", proveedorValue);

    if (!purchaseOrderDate || !purchaseOrderStatus || !proveedorValue) {
      await Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa la fecha, selecciona un proveedor y el estado antes de agregar una línea de detalle al pedido de compra.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        customClass: {
          title: "my-title-class",
          popup: "my-popup-class",
          confirmButton: "my-confirm-button-class",
          overlay: "my-overlay-class",
        },
      });
      return;
    }
    const newPurchaseOrder = {
      purchaseOrderDate: new Date(purchaseOrderDate),
      purchaseOrderStatus,
      supplierID: proveedorValue,
    };

    try {
      const response = await fetch("http://localhost:8080/api/purchaseorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPurchaseOrder),
      });

      const result = await response.json();

      console.log("Id: ", result.purchaseOrder._id);
      
      if (response.status === 201) {
        setPurchaseOrderId(result.purchaseOrder._id);
        await Swal.fire({
          title: "Pedido de compra creado con éxito",
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
        navigate("/pedido/agregardetalle");
      } else if (response.status === 400) {
        const errorMessages =
          result.errorMessages && result.errorMessages.length > 0
            ? result.errorMessages[0]
            : "Error desconocido";

        await Swal.fire({
          title: "Error al crear presupuesto",
          text: errorMessages,
          icon: "error",
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
      console.error("Error en la solicitud", error);
      await Swal.fire({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          title: "my-title-class",
          popup: "my-popup-class",
          confirmButton: "my-confirm-button-class",
          overlay: "my-overlay-class",
        },
      });
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
                value={purchaseOrderDate}
                onChange={(e) => setPurchaseOrderDate(e.target.value)}
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
                value={purchaseOrderStatus || "Pendiente"} // Asegúrate de que nunca sea undefined
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
              getEditPath={(id) => `/pedido/${id}`}
            />
          </div>
          <div className="orderdetail__total">
            <p>Total: </p>
          </div>
          <div className="orderdetail__buttons">
            <button onClick={handleSubmit}>Nueva Linea</button>
            <Link to="/pedido">
              <button >Guardar</button>
            </Link>
            <Link to="/">
              <button>Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
