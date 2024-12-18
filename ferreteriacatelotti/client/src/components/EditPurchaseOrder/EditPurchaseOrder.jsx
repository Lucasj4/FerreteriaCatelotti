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
  const [rows, setRows] = useState([]);
  const { detalleIds, clearDetalleIds, addDetalleId } = useAppContext();
  const { pid } = useParams();
  const [orderDate, setOrderDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [purchaseOrderStatus, setPurchaseOrderStatus] = useState("Pendiente");
  const [productData, setProductData] = useState([]);
  const [proveedorValue, setProveedorValue] = useState("");

  const tableHeaders = [
    { value: "detailOrderProduct", label: "Producto" },
    { value: "detailOrderQuantity", label: "Cantidad" },
    { value: "detailOrderUnitCost", label: "Costo Unitario" },
  ];

  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/suppliers", {
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
    const fetchPurchaseOrderWithDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/purchaseorders/purchaseorderswithdetails/${pid}`,
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

        console.log(data);

        const total = detailOrders.reduce(
          (acc, detail) => acc + detail.detailOrderQuantity * detail.detailOrderUnitCost,
          0
        );

        
        setAmount(total);

        setRows(detailOrders);

        console.log("fecha del fetch: ", purchaseOrder.purchaseOrderDate);

        const formattedDate = purchaseOrder.purchaseOrderDate
          ? purchaseOrder.purchaseOrderDate
              .split("/")
              .reverse()
              .map((part) => part.padStart(2, "0")) // Formatea correctamente
              .join("-")
          : "";

        console.log("FECHA FORMATTEDDATE: ", formattedDate);

        setOrderDate(formattedDate);

        setPurchaseOrderStatus(
          purchaseOrder.purchaseOrderStatus || "Pendiente"
        );

      
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

  useEffect(() => {
    const handlePdf = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/purchaseorders/purchaseorderswithdetails/${pid}`,
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

        // Datos de proveedor, estado y monto
        const proveedorValue =
          selectedSuppliers.length > 0 ? selectedSuppliers[0].label : "";

        setPurchaseOrderStatus(purchaseOrder.status);
        setProveedorValue(proveedorValue);

        // Extraemos los productos
        const products = detailOrders.map((order) => ({
          product: order.detailOrderProduct,
          quantity: order.detailOrderQuantity,
          unitCost: order.detailOrderUnitCost,
        }));

        setProductData(products);
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    };

    handlePdf();
  }, [pid, selectedSuppliers]);

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
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Si no guardaste los cambios, estos se perderán. ¿Deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
        cancelButton: "my-confirm-button-class",
      },
    });

    if (result.isConfirmed) {
      navigate("/pedido"); // Redirige a la página de pedidos
    }
    return;
  };

  const handleUpdateOrder = async () => {
    const proveedorValue =
      selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";

    const updatedPurchaseOrder = {
      purchaseOrderDate: new Date(orderDate),
      purchaseOrderStatus: purchaseOrderStatus || "Pendiente",
      supplierID: proveedorValue,
      purchaseOrderAmount: amount,
      detalleIds: Array.from(detalleIds),
    };

    if(purchaseOrderStatus === "Recibido"){
      for(const item of rows){
        const productId = item.productID; // ID del producto
          const quantityToDecrease = item.budgetDetailQuantity; // Cantidad a descontar

          console.log("Cantidad producto vendido: ", quantityToDecrease);

          

         
          // Actualizar el stock del producto
          const stockResponse = await fetch(
            `http://localhost:8080/api/products/updateproductstock/${productId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ quantityToDecrease }),
            }
          );
      }
      
    }

    console.log("Purchase order para actualizar: ", updatedPurchaseOrder);

    try {
      const response = await fetch(
        `http://localhost:8080/api/purchaseorders/${pid}`,
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
    console.log("id del detalle: ", id);
    
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
          `http://localhost:8080/api/detailsorder/${id}`,
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
            return acc + order.budgetDetailQuantity * order.detailOrderUnitCost;
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
  }

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
              data={rows}
              handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
              linkPrefix="/detallepedido/editarpedido/"
              getEditPath={(id) => `/pedido/${pid}/detalle/${id}`}
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

            {/* <button onClick={generatePDF}>Generar PDF</button> */}
            <button onClick={handleExit}>Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseOrder;
