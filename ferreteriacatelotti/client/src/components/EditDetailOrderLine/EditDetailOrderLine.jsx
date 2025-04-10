import React, { useState, useEffect } from "react";
import "../NewDetailOrder/NewDetailOrderLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/OrderContext";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import Swal from "sweetalert2";
const EditDetailOrderLine = () => {
  const option = ["mt", "litro"];
  const { addDetalleId, clearDetalleIds } = useAppContext();
  const [detailOrderProduct, setDetailOrderProduct] = useState({
    id: "",
    name: "",
  });
  const [detailOrderQuantity, setDetailOrderQuantity] = useState("");
  const [detailOrderUnitCost, setDetailOrderUnitCost] = useState("");
  const [productsOptions, setProductsOption] = useState([]);
  const [unidad, setUnidad] = useState(option[0]);
  const { pid, rowid } = useParams();

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

  const handleQuantity = (e) => {
    setDetailOrderQuantity(e.target.value);
  };

  const handleUnitCost = (e) => {
    setDetailOrderUnitCost(e.target.value);
  };

  const handleUnidad = (e) => {
    setUnidad(e.target.value);
  };

  const resetForm = () => {
    setDetailOrderProduct(""),
      setDetailOrderQuantity(""),
      setDetailOrderUnitCost("");
  };
  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();

        const productOptions = data.products.map((product) => ({
          value: product._id, // Usamos el ID del producto como valor
          label: product.productName, // El nombre del producto como etiqueta visible
          unitPrice: product.productPrice,
        }));

        

        setProductsOption(productOptions);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchDetailOrder = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/detailsorder/${rowid}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        // Solo buscar el producto si las opciones están cargadas
        const product = productsOptions.find(
          (product) => product.value === data.detailOrder.productID
        );

        setDetailOrderProduct({
          id: data.detailOrder.productID, // Utilizar el ID del producto
          name: product ? product.label : "", // Obtener el nombre si está disponible
        });

        setDetailOrderQuantity(data.detailOrder.detailOrderQuantity);
        setDetailOrderUnitCost(data.detailOrder.detailOrderUnitCost);
      } catch (error) {
        console.error("Error fetching detail order:", error);
      }
    };

    if (productsOptions.length > 0) {
      fetchDetailOrder();
    }
  }, [rowid, productsOptions]); // Solo se ejecuta cuando las opciones están listas

  const handleProductChange = (product) => {
    if (product) {
      // setSelectedProduct(product.label);

      setDetailOrderUnitCost(product.unitPrice || ""); // Actualiza el precio unitario
      setDetailOrderProduct({ id: product.value, name: product.label });
    } else {
      // Si no hay producto seleccionado (borrado)
      // setSelectedProduct(null);
      setDetailOrderUnitCost("");
      setDetailOrderProduct({ id: "", name: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Primera llamada para verificar el estado del pedido
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchaseorders/${pid}`,
        { credentials: "include" }
      );
  
      if (!response.ok) {
        throw new Error("Error al obtener el pedido de compra");
      }
  
      const { purchaseOrder } = await response.json();
  
      if (purchaseOrder.purchaseOrderStatus === "Recibido") {
        showAlert({
          title: "Error",
          text: "No se puede modificar un pedido que ya ha sido recibido",
          icon: "warning",
        });
        return;
      }
  
      // Segunda llamada para obtener detalles del pedido
      const detailsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchaseorders/purchaseorderswithdetails/${pid}`,
        { credentials: "include" }
      );
  
      if (!detailsResponse.ok) {
        throw new Error("Error al obtener los detalles del pedido de compra");
      }
  
      const { detailOrders } = await detailsResponse.json();
  
      // Buscar el detalle original antes de la edición
      const originalDetail = detailOrders.find((detail) => detail._id === rowid);
  
      if (!originalDetail) {
        showAlert({
          title: "Error",
          text: "No se encontró el detalle del pedido.",
          icon: "error",
        });
        return;
      }
  
      // Verificar si el usuario intentó modificar el costo unitario
      if (originalDetail.detailOrderUnitCost !== detailOrderUnitCost) {
        showAlert({
          title: "Error",
          text: "No puedes modificar el costo unitario desde aquí. Debes hacerlo desde la edición de productos.",
          icon: "warning",
        });
        return;
      }
    } catch (error) {
      console.error("Error al obtener la orden de compra:", error.message);
      showAlert({
        title: "Error",
        text: "No se pudo cargar la orden de compra.",
        icon: "error",
      });
      return;
    }
  
    // Confirmación antes de proceder con la actualización
    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "¿Confirmar modificación de detalle?",
      icon: "warning",
      showCancelButton: true,
    });
  
    if (!result.isConfirmed) return;
  
    const orderDetailOrderLine = {
      detailOrderProduct: detailOrderProduct.name, // Nombre del producto
      detailOrderQuantity,
      detailOrderUnitCost,
      productID: detailOrderProduct.id, // ID del producto
      purchaseOrderID: pid,
    };
  
    console.log(":", orderDetailOrderLine);
  
    try {
      const updateResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/detailsorder/${rowid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(orderDetailOrderLine),
        }
      );
  
      const responseData = await updateResponse.json();
  
      if (updateResponse.status === 400) {
        const errorMessages = responseData.errorMessages?.[0] || "Error desconocido";
        showAlert({
          title: "Error",
          text: errorMessages,
          icon: "error",
        });
        return;
      }
  
      showAlert({
        title: "Detalle modificado",
        icon: "success",
      });
  
      resetForm();
    } catch (error) {
      console.error("Error al enviar los datos:", error.message);
      showAlert({
        title: "Error",
        text: "No se pudo actualizar el detalle del pedido.",
        icon: "error",
      });
    }
  };
  
  
  return (
    <>
      <div className="newPurchaseOrder__container">
        <div className="newPurchaseOrder__formcontainer">
          <h2 className="newPurchaseOrder__form__title">Editar Linea</h2>
          <form action="" className="newPurchaseOrder__form">
            {/* <div className="newPurchaseOrder__form__item">
              <label htmlFor="item" className="newPurchaseOrder__form__label">
                Producto
              </label>
              <div className="newPurchaseOrder__form__item-product">
                <input
                  type="text"
                  className="newPurchaseOrder__form__input"
                  id="detailOrderProduct"
                  value={detailOrderProduct}
                  onChange={(e) => setetailOrderProduct(e.target.value)}
                />
                <button className="newPurchaseOrder__form__item__button">
                  Producto
                </button>
              </div>
            </div> */}
            <div className="product__item__select">
              <label htmlFor="productUnit">Productos</label>
              <DropdownSelect
                options={productsOptions}
                value={productsOptions.find(
                  (product) => product.value === detailOrderProduct.id
                )} // Muestra la etiqueta del producto seleccionado
                onChange={handleProductChange}
                placeholder="Selecciona un producto"
              />
            </div>
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="detailOrderQuantity"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Cantindad"
              labelClassname="newPurchaseOrder__form__label"
              value={detailOrderQuantity}
              onChange={handleQuantity}
            />
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="detailOrderUnitCost"
              inputClassname="newPurchaseOrder__form__input"
              typeInput="text"
              label="Costo Unitario"
              labelClassname="newPurchaseOrder__form__label"
              value={detailOrderUnitCost}
              onChange={handleUnitCost}
            />
            {/* <div className="newPurchaseOrder__form__item">
              <label htmlFor="unidad" className="newPurchaseOrder__form__label">
                Unidad
              </label>
              <select
                className="newPurchaseOrder__form__input"
                id="unidad"
                onChange={handleUnidad}
                value={unidad}
                
              >
                {option.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div> */}
          </form>

          <div className="newPurchaseOrder__form__containerbuttons">
            <Link to={`/pedido/${pid}`}>
              <button className="newPurchaseOrder__form__button">Salir</button>
            </Link>
            <Link to={"/detallepedido"}>
              <button
                className="newPurchaseOrder__form__button"
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDetailOrderLine;
