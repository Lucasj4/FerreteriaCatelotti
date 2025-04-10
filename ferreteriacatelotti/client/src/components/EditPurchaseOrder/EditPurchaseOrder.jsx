import React from "react";
import "./EditPurchaseOrder.css";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import Table from "../TableCustom/TableCustom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAppContext } from "../context/OrderContext";
import Swal from "sweetalert2";

const EditPurchaseOrder = () => {
  const [rows, setRows] = useState([,]);
  const { detalleIds, clearDetalleIds, addDetalleId } = useAppContext();
  const { pid } = useParams();
  const [orderDate, setOrderDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [purchaseOrderStatus, setPurchaseOrderStatus] = useState("Pendiente");
  const [productData, setProductData] = useState([]);
  const [proveedorValue, setProveedorValue] = useState("");

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

  const tableHeaders = [
    { value: "detailOrderProduct", label: "Producto" },
    { value: "detailOrderQuantity", label: "Cantidad" },
    { value: "detailOrderUnitCost", label: "Costo Unitario" },
    { value: "productUnit", label: "Unidad" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/suppliers`, {
          credentials: "include",
        });

        const data = await response.json();
        setSuppliers(data.suppliers);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    console.log("Id: ", pid);
    const fetchPurchaseOrderWithDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/purchaseorders/purchaseorderswithdetails/${pid}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el pedido de compra");
        }
        const data = await response.json();
        const purchaseOrder = data.purchaseOrder;
        const detailOrders = data.detailOrders;

        const total = detailOrders.reduce(
          (acc, detail) =>
            acc + detail.detailOrderQuantity * detail.detailOrderUnitCost,
          0
        );

        setAmount(total);

        console.log("Detalles: ", detailOrders);

        setRows(detailOrders);

        console.log(purchaseOrder.purchaseOrderDate);

        const formattedDate = purchaseOrder.purchaseOrderDate
          ? purchaseOrder.purchaseOrderDate
              .split("/")
              .reverse()
              .map((part) => part.padStart(2, "0")) // Formatea correctamente
              .join("-")
          : "";

        console.log("FORMATED FECHA: ", formattedDate);

        setOrderDate(formattedDate);

        setPurchaseOrderStatus(purchaseOrder.purchaseOrderStatus);

        // Seleccionar el proveedor como { label, value }
        const selectedSupplierOption = suppliers.find(
          (supplier) => supplier._id === purchaseOrder.supplierID
        );

        setSelectedSuppliers(
          selectedSupplierOption
            ? [
                {
                  label: selectedSupplierOption.supplierLastName, // Campo que se mostrará en el MultiSelect
                  value: selectedSupplierOption._id, // ID del cliente
                },
              ]
            : []
        );
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
  }, [pid, suppliers]);

  const handleSupplierChange = (selectedOptions) => {
    setSelectedSuppliers(selectedOptions); // Actualiza el estado con las opciones seleccionadas
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setPurchaseOrderStatus(newStatus); // Asegúrate de actualizar el estado aquí
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    console.log("fecha que cambia: ", selectedDate);

    setOrderDate(selectedDate);
  };

  const handleExit = async () => {
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "Si no guardaste los cambios, estos se perderán. ¿Deseas salir?",
      icon: "warning",
    });

    if (result.isConfirmed) {
      navigate("/pedido"); // Redirige a la página de pedidos
    }
    return;
  };

  const handleUpdateOrder = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/purchaseorders/${pid}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    const purchaseOrder = data.purchaseOrder;

    if (purchaseOrder.purchaseOrderStatus === "Recibido") {
      showAlert({
        title: "Error",
        text: "No se puede modificar un pedido que ya ha sido recibido",
        icon: "warning",
      });
      return;
    }

    const proveedorValue = selectedSuppliers.value;

    const formattedDate = purchaseOrder.purchaseOrderDate
      ? purchaseOrder.purchaseOrderDate
          .split("/")
          .reverse()
          .map((part) => part.padStart(2, "0")) // Formatea correctamente
          .join("-")
      : "";

    const date1 = new Date(orderDate);
    const date2 = new Date(formattedDate);

    console.log("Fecha 1 (Date):", date1);
    console.log("Fecha 2 (Date):", date2);

    if (date1 < date2) {
      showAlert({
        title: "Error",
        text: "La fecha no puede ser anterior a la establecida",
        icon: "error",
      });
      return;
    }

    if (purchaseOrderStatus === "Recibido") {
      try {
        const products = rows.map((product) => ({
          pid: product.productID,
          operationType: "increase",
          quantity: product.detailOrderQuantity,
        }));

        // Actualizar el stock del producto
        const stockResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/updateproductstock`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ products }),
          }
        );

        const stockData = await stockResponse.json();

        if (stockResponse.status === 400 || stockResponse.status === 404) {
          showAlert({
            title: "Error",
            text: stockData.message,
            icon: "warning",
          });
          return; // Detener la ejecución si stockResponse es 400 o 404
        }
      } catch (error) {
        console.log(`Error al actualizar el stock del producto`, error);
      }
    }

    const updatedPurchaseOrder = {
      purchaseOrderDate: new Date(orderDate),
      purchaseOrderStatus: purchaseOrderStatus || "Pendiente",
      supplierID: proveedorValue,
      purchaseOrderAmount: amount,
      detalleIds: Array.from(detalleIds),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchaseorders/${pid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(updatedPurchaseOrder),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        await Swal.fire({
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
        navigate("/pedido"); // O redirige a otra ruta si es necesario
      } else {
        throw new Error(
          result.message || "Error al actualizar el pedido de compra"
        );
      }
    } catch (error) {
      console.error("Error al actualizar el pedido de compra:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el pedido de compra. Inténtalo de nuevo.",
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

  const handleDeleteCell = async (id, index) => {
    if (purchaseOrderStatus === "Recibido") {
      showAlert({
        title: "Error",
        text: "No se puede modificar un pedido que ya ha sido recibido",
        icon: "warning",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este detalle.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        cancelButton: "my-cancel-button-class", // Agrega clase para el botón de cancelar
        overlay: "my-overlay-class",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/detailsorder/${id}`,
          {
            method: "DELETE",

            credentials: "include",
          }
        );

        if (response.status === 200) {
          const newRows = [...rows];
          newRows.splice(index, 1);
          setRows(newRows);
          const updatedDetails = rows.filter((order) => order._id !== id);

          const newTotal = updatedDetails.reduce((acc, order) => {
            return acc + order.detailOrderQuantity * order.detailOrderUnitCost;
          }, 0);

          setAmount(newTotal);
          Swal.fire({
            text: "Detalle eliminado",
            icon: "success",
            confirmButtonText: "Aceptar",
            customClass: {
              title: "my-title-class",
              popup: "my-popup-class",
              confirmButton: "my-confirm-button-class",
              cancelButton: "my-cancel-button-class", // Agrega clase para el botón de cancelar
              overlay: "my-overlay-class",
            },
          });
        } else {
          console.error("Error al eliminar el detalle en la base de datos");
        }
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    }
  };

  const printPurchaseOrder = async (e) => {
    e.preventDefault();

    const proveedorValue =
      selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";

    const purchaseOrder = {
      amount: amount,
      date: orderDate,
      supplier: proveedorValue,

      details: rows.map((row) => ({
        producto: row.detailOrderProduct,
        cantidad: row.detailOrderQuantity,
        costoUnitario: row.detailOrderUnitCost,
        total: row.detailOrderQuantity * row.detailOrderUnitCost,
      })),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchaseorders/factura`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseOrder),
        }
      );

      if (
        response.ok &&
        response.headers.get("Content-Type").includes("application/pdf")
      ) {
        const pdfBlob = await response.blob();

        // Crea una URL para el Blob del PDF
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Crear un enlace para descargar el PDF automáticamente o abrirlo
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `Pedidodecompra.pdf`; // Aquí puedes elegir el nombre del archivo
        document.body.appendChild(link);
        link.click();

        // También podrías abrirlo en una nueva ventana
        // window.open(pdfUrl);

        // Limpiar el objeto URL después de descargar o abrirlo
        URL.revokeObjectURL(pdfUrl);
      } else {
        throw new Error("Error al generar la factura.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      await Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <div className="component__container">
        <div className="orderdetail__table-container">
          <div className="orderdetail__title">
            <p>Detalle de pedido de compra</p>
          </div>
          <div className="date-selector">
            <div className="date-selector__item">
              <p>Fecha</p>
              <input
                type="date"
                className="date-selector__item__date"
                value={orderDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="date-selector__item">
              <p>Proveedor</p>
              <MultiSelectOption
                options={suppliers}
                selectedOptions={selectedSuppliers}
                onChange={handleSupplierChange}
                placeholder="Seleccionar Proveedor"
                labelKey="supplierLastName"
              />
            </div>
            <div className="date-selector__item">
              <p>Estado</p>
              <select
                value={purchaseOrderStatus} // Asegúrate de que nunca sea undefined
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
              data={rows}
              handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
              linkPrefix="/detallepedido/editarpedido/"
              getEditPath={(id) => `/pedido/${pid}/detalle/${id}`}
              showActions={true}
              paginationandcontrols="paginations-and-controls"
            />
          </div>
          <div className="orderdetail__total">
            <p>Total: ${amount}</p>
          </div>
          <div className="orderdetail__buttons">
            <Link to={`/pedido/${pid}/detallepedido/nuevalinea`}>
              <button>Nueva Linea</button>
            </Link>

            <button onClick={handleUpdateOrder}>Guardar</button>

            <button onClick={printPurchaseOrder}>Imprimir</button>
            <button onClick={handleExit}>Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseOrder;
