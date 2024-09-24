import React, { useState, useEffect } from "react";
import "./OrderDetail.css";
import { Link, useNavigate } from "react-router-dom";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import { useAppContext } from "../context/OrderContext";
import Table from "../TableCustom/TableCustom";

const OrderDetail = () => {
  const { fecha, proveedor, saveData, estado, purchaseOrderId, detalleIds } =
    useAppContext();
  const [suppliers, setSuppliers] = useState([]);
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

  useEffect(()=> {
    const fetchDetailsOrder = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/detailsorder");
        
        const data = await response.json();
        console.log("Data: ", data.data);
        console.log("Detalles idS: ", detalleIds);
        
        setFilas(data.data)
      } catch (error) {
        console.error("Error fetching suppliers: ", error);
      }
    }

    fetchDetailsOrder();
  }, [])

  useEffect(() => {
    console.log("Detalles IDs actualizados: ", detalleIds);
    // Aquí podrías actualizar la tabla o realizar otras acciones si es necesario
  }, [detalleIds]);

  const handleSupplierChange = (selectedOptions) => {
    setSelectedSuppliers(selectedOptions);

    const selectedProveedorValue =
      selectedOptions.length > 0 ? selectedOptions[0].value : "";

    saveData(fecha, selectedProveedorValue, estado);
  };

  const handleDeleteCell = (indice) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(indice, 1);
    setFilas(nuevasFilas);
  };

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    console.log("Nuevo estado seleccionado: ", nuevoEstado); // Verifica el valor del estado
    saveData(fecha, proveedor, nuevoEstado); // Actualiza el estado
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const proveedorValue =
        selectedSuppliers.length > 0 ? selectedSuppliers[0].value : "";

    // Guarda los datos en el contexto
    saveData(fecha, proveedorValue, estado);

    console.log("Fecha", fecha);
    console.log("Proveedor: ", proveedorValue);
    console.log("Estado: ", estado);
    console.log("PurchaseOrderId: ", purchaseOrderId);

    // Si no existe el purchaseOrderId, crear uno nuevo
    if (!purchaseOrderId) {
        const newPurchaseOrder = {
            purchaseOrderDate: fecha,
            purchaseOrderStatus: estado,
            supplierID: proveedorValue,
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/purchaseorders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPurchaseOrder),
                }
            );

            const data = await response.json();
            console.log("data: ", data);

            if (data.purchaseOrder && data.purchaseOrder._id) {
                // Guarda los datos con el purchaseOrderId recién creado
                saveData(fecha, proveedorValue, estado, data.purchaseOrder._id);
                console.log("PurchaseOrder creado con ID: ", data.purchaseOrder._id);

                // Ahora actualiza todos los detailOrders con el nuevo purchaseOrderId
                const detailOrderUpdates = detalleIds.map((id) =>
                    fetch(`http://localhost:8080/api/detailsorder/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ purchaseOrderId: data.purchaseOrder._id }),
                    })
                );

                try {
                    await Promise.all(detailOrderUpdates);
                    console.log("Todos los detailOrders actualizados con el nuevo purchaseOrderId");
                } catch (error) {
                    console.error("Error actualizando detailOrders:", error.message);
                }
            } else {
                console.error(
                    "Error: No se devolvió un purchaseOrderId del servidor"
                );
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    } else {
        // Si ya existe el purchaseOrderId, solo actualiza los detailOrders
        const detailOrderUpdates = detalleIds.map((id) =>
            fetch(`http://localhost:8080/api/detailsorder/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ purchaseOrderId }),
            })
        );

        try {
            await Promise.all(detailOrderUpdates);
            console.log("Todos los detailOrders actualizados con el purchaseOrderId existente");
        } catch (error) {
            console.error("Error actualizando detailOrders:", error.message);
        }
    }

    // Aquí puedes agregar la lógica para redirigir a otra página o hacer otra acción
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
                value={fecha}
                onChange={(e) =>
                  saveData(
                    e.target.value,
                    proveedor,
                    estado,
                    purchaseOrderId || ""
                  )
                }
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
                value={estado || "Pendiente"} // Asegúrate de que nunca sea undefined
                onChange={handleEstadoChange}
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
            <p>Total: 6000</p>
          </div>
          <div className="orderdetail__buttons">
            <Link to="/detallepedido/nuevalinea">
              <button>Nueva Linea</button>
            </Link>
            <Link to="/pedido">
              <button onClick={handleSave}>Guardar</button>
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
