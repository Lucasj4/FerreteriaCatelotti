import { useState, useEffect } from "react";
import "./OrderDetail.css";
import { Link, useNavigate } from "react-router-dom";
import MultiSelectOption from "../MultipleSelect/MultipleSelect";
import { useAppContext } from "../context/OrderContext";
import Table from "../TableCustom/TableCustom";
import Swal from "sweetalert2";


const OrderDetail = () => {
  const [purchaseOrderDate, setPurchaseOrderDate] = useState("");
  const [purchaseOrderStatus, setPurchaseOrderStatus] = useState("Pendiente");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const navigate = useNavigate();


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
  ];

  const [filas, setFilas] = useState([,]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/suppliers`, {
          credentials: "include",
        });
        const result = await response.json();
      
        
        setSuppliers(result.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers: ", error);
      }
    };

    fetchSuppliers();
  }, []);



  const handleSupplierChange = (selectedOptions) => {
    setSelectedSuppliers(selectedOptions);

    
    console.log("provedor: ", selectedOptions);
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

    const proveedorValue = selectedSuppliers.value;
    
    

    if(purchaseOrderStatus === "Recibido"){
      showAlert({
        title: "Error",
        text: "El estado Recibido no puede asignarse a un pedido de compra sin productos.",
        error: "error"
      })

      return;
    }

    if (!purchaseOrderDate || !purchaseOrderStatus || !proveedorValue) {
      await showAlert({
        title: "Campos incompletos",
        text: "Por favor, completa la fecha, selecciona un proveedor y el estado antes de agregar una línea de detalle al pedido de compra.",
        icon: "warning",
      });
      return;
    }
    const newPurchaseOrder = {
      purchaseOrderDate: new Date(purchaseOrderDate),
      purchaseOrderStatus,
      supplierID: proveedorValue,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/purchaseorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(newPurchaseOrder),
      });

      const result = await response.json();

      if (response.status === 201) {
        await showAlert({
          title: "Pedido de compra creado con éxito",
          icon: "success",
       
        });
        navigate(`/pedido/${result.purchaseOrder._id}/detallepedido/nuevalinea`);
      } else if (response.status === 400) {
        const errorMessages =
          result.errorMessages && result.errorMessages.length > 0
            ? result.errorMessages[0]
            : result.error;

        await showAlert({
          title: "Error al crear presupuesto",
          text: errorMessages,
          icon: "error",
          
        });
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
      await showAlert({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="orderdetail__container">
        <div className="orderdetail__table-container">
          <div className="orderdetail__title">
            <h2>Agregar pedido</h2>
          </div>
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
              data={filas}
              handleDeleteCell={handleDeleteCell}
              getEditPath={(id) => `/pedido/${id}`}
              paginationandcontrols="paginations-and-controls"
            />
          </div>
          <div className="orderdetail__total">
            <p>Total: </p>
          </div>
          <div className="orderdetail__buttons">
            <button onClick={handleSubmit}>Nueva Linea</button>
            <Link to="/pedido">
              <button>Guardar</button>
            </Link>

            <Link to="/pedido">
              <button>Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
