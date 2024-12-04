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
import ExcelJS from 'exceljs';




const EditPurchaseOrder = () => {
  const [rows, setRows] = useState([]);
  const {
    fecha,
    proveedor,
    saveData,
    estado,
    detalleIds,
    clearDetalleIds,
    addDetalleId,
  } = useAppContext();
  const { pid } = useParams();
  const [purchaseOrderDate, setPurchaseOrderDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [localStatus, setLocalStatus] = useState("Pendiente");
  const [product, setProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productUnitCost, setProductUnitCost] = useState(0);
  const [productData, setProductData] = useState([]);
  const [proveedorValue, setProveedorValue] = useState('');

  const tableHeaders = [
    { value: "detailOrderProduct", label: "Producto" },
    { value: "detailOrderQuantity", label: "Cantidad" },
    { value: "detailOrderUnitCost", label: "Costo Unitario" },
  ];

  const datosTabla = [
    { producto: "Producto 1", cantidad: 2, precioUnitario: 50, total: 100 },
    { producto: "Producto 2", cantidad: 1, precioUnitario: 30, total: 30 },
  ];

  const navigate = useNavigate();

  const groupDetailsByProduct = (details) => {
    return details.reduce((acc, order) => {
      const existing = acc.find(
        (item) => item.detailOrderProduct === order.detailOrderProduct
      );
      if (existing) {
        existing.detailOrderQuantity += order.detailOrderQuantity;
        existing.totalCost =
          existing.detailOrderQuantity * order.detailOrderUnitCost;
      } else {
        acc.push({
          ...order,
          totalCost: order.detailOrderQuantity * order.detailOrderUnitCost,
        });
      }
      return acc;
    }, []);
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

        console.log(data);
        
        for (const detail of detailOrders) {
          addDetalleId(detail._id); // Los duplicados son manejados automáticamente por el Set
        }
        console.log("Detalle ids final: ", Array.from(detalleIds));

        const groupedDetails = groupDetailsByProduct(detailOrders);

        const total = groupedDetails.reduce((acc, order) => {
          return acc + order.totalCost;
        }, 0);

        setAmount(total);

        setRows(groupedDetails);

        const formattedDate = purchaseOrder.purchaseOrderDate
          ? purchaseOrder.purchaseOrderDate.split("/").reverse().join("-")
          : "";

        setPurchaseOrderDate(formattedDate); // Inicializa con la fecha del pedido
        setLocalStatus(purchaseOrder.purchaseOrderStatus || "Pendiente");

        // Seleccionar el proveedor como { label, value }
        const selectedSupplierOption = suppliers.find(
          (supplier) => supplier._id === purchaseOrder.supplierID
        );

        setSelectedSuppliers(
          selectedSupplierOption
            ? [
                {
                  label: selectedSupplierOption.lastName, // Campo que se mostrará en el MultiSelect
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
          `http://localhost:8080/api/purchaseorders/purchaseorderswithdetails/${pid}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener el pedido de compra");
        }

        const data = await response.json();
        const purchaseOrder = data.purchaseOrder;
        const detailOrders = data.detailOrders;

        // Datos de proveedor, estado y monto
        const proveedorValue = selectedSuppliers.length > 0 ? selectedSuppliers[0].label : "";
        setPurchaseOrderDate(purchaseOrder.purchaseOrderDate);
        setLocalStatus(purchaseOrder.status);
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
    const nuevoEstado = e.target.value;
    console.log("Nuevo estado seleccionado: ", nuevoEstado); // Verifica el valor del estado
    setLocalStatus(nuevoEstado); // Actualiza el estado
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    

    setPurchaseOrderDate(selectedDate);
  };

  const handleDeleteCell = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };

   const generateExcel = async () => {
    // Crear un nuevo libro de trabajo (workbook)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orden de Compra');

    // Añadir datos generales
    worksheet.addRow(['Fecha', purchaseOrderDate]);
    worksheet.addRow(['Estado', localStatus]);
    worksheet.addRow(['Proveedor', proveedorValue]);
    worksheet.addRow(['Importe', amount]);

    // Dejar una línea en blanco entre los datos generales y la tabla
    worksheet.addRow([]);

    // Añadir los encabezados de la tabla
    worksheet.addRow(['Producto', 'Cantidad', 'Precio Unitario']);

    // Definir los estilos para las celdas (bordes)
    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Añadir los productos y aplicar bordes
    productData.forEach(item => {
      const row = worksheet.addRow([item.product, item.quantity, item.unitCost]);

      // Aplicar bordes a todas las celdas de la fila
      row.eachCell((cell, colNumber) => {
        cell.border = borderStyle;
      });
    });

    // Aplicar bordes a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = borderStyle;
    });

    // Generar el archivo Excel y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'purchaseOrder.xlsx';
    link.click();
  };

  const handleDeleteBudgetDetail = async (budgetDetailId, index) => {
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
          `http://localhost:8080/api/budgetsdetails/${budgetDetailId}`,
          {
            method: "DELETE",
          }
        );

        if (response) {
          const nuevasFilas = [...row];
          nuevasFilas.splice(index, 1);
          setRows(nuevasFilas);
        } else {
          console.error("Error al eliminar el detalle en la base de datos");
        }
      } catch (error) {
        console.error("Error en la petición de eliminación", error);
      }
    }
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

  const validateForm = () => {
    console.log("Data: ", purchaseOrderDate);
    console.log("Data: ", localStatus);
    console.log("Data: ", selectedSuppliers.length);

    if (!purchaseOrderDate || !localStatus || !selectedSuppliers.length) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de actualizar el pedido de compra.",
        icon: "warning",
      });
      return false;
    }
    return true;
  };

  const handleUpdateOrder = async () => {
    const proveedorValue =
      selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";

    if (!validateForm()) return;

    const updatedPurchaseOrder = {
      purchaseOrderDate: new Date(purchaseOrderDate),
      purchaseOrderStatus: localStatus,
      supplierID: proveedorValue,
      purchaseOrderAmount: amount,
      detalleIds: Array.from(detalleIds),
    };

    console.log("Purchase order para actualizar: ", updatedPurchaseOrder);

    try {
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
              data={rows}
              handleDeleteCell={handleDeleteCell}
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
            
            <button onClick={generateExcel}>Generar PDF</button>
            <button onClick={handleExit}>Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseOrder;
