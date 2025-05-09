import React, { useState, useEffect } from "react";
import "./NewDetailOrderLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/OrderContext";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import Swal from "sweetalert2";

const NewDetailOrderLine = () => {
  const option = ["mt", "litro"];
  const { addDetalleId, clearDetalleIds, purchaseOrderId } = useAppContext();
  const [detailOrderProduct, setDetailOrderProduct] = useState({
    id: "",
    name: "",
  });
  const [detailOrderQuantity, setDetailOrderQuantity] = useState("");
  const [detailOrderUnitCost, setDetailOrderUnitCost] = useState("");
  const [productsOptions, setProductsOption] = useState([]);
  const [unidad, setUnidad] = useState(option[0]);
  const { pid } = useParams();

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
    console.log("Pid: ", purchaseOrderId);
    
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

  const handleDetailOrderUnitCost = async (e) => {
    e.preventDefault();
    
    showAlert({
      title: "Error",
      text: "El costo unitario solo puede ser modificado desde los productos.",
      icon: "warning",
    }).then(() => {
      // Restablecer el valor del campo a su valor original
      setDetailOrderUnitCost(detailOrderUnitCost); // Asumiendo que tienes un estado para el costo original
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderDetailOrderLine = {
      detailOrderProduct: detailOrderProduct.name, // Nombre del producto
      detailOrderQuantity,
      detailOrderUnitCost,
      productID: detailOrderProduct.id,
      purchaseOrderID: purchaseOrderId || pid,
    };

    console.log("orderDetailOrderLine: ", orderDetailOrderLine);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/detailsorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderDetailOrderLine),
      });

    
      const data = await response.json();
      console.log("Estatus: ", response.status);
      
      switch (response.status) {

        case 200:
          showAlert({
            title: "Detalle de presupuesto agregado con exito",
            icon: "success",
          });
          break;

        case 201:
          showAlert({
            title: "Detalle de presupuesto agregado con exito",
            icon: "success",
          });
          break;

        case 400:
          const errorMessages =
            data.errorMessages && data.errorMessages.length > 0
              ? data.errorMessages[0]
              : "Error desconocido";

          await showAlert({
            title: "Error al agregar linea de detalle del pedido de compra",
            text: errorMessages,
            icon: "error",
          });
          break;
        
        case 409: 
        showAlert({
          title: "Error",
          text: data.message,
          icon: "error",
        });

        break;

        default:
          break;
      }

      
      resetForm();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  return (
    <>
      <div className="newPurchaseOrder__container">
        <div className="newPurchaseOrder__formcontainer">
          <h2 className="newPurchaseOrder__form__title">Nuevo Linea</h2>
          <form action="" className="newPurchaseOrder__form">
            <div className="product__item__select">
              <label htmlFor="productUnit">Productos</label>
              <DropdownSelect
                options={productsOptions}
                value={detailOrderProduct.name} // Muestra la etiqueta del producto seleccionado
                onChange={handleProductChange}
                placeholder="Selecciona un producto"
              />
            </div>
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="detailOrderQuantity"
              inputClassname="form__input"
              typeInput="text"
              label="Cantindad"
              labelClassname="newPurchaseOrder__form__label"
              value={detailOrderQuantity}
              onChange={handleQuantity}
            />
            <FormItem
              formItemClassName="newPurchaseOrder__form__item"
              id="detailOrderUnitCost"
              inputClassname="form__input"
              typeInput="text"
              label="Costo Unitario"
              labelClassname="newPurchaseOrder__form__label"
              value={detailOrderUnitCost}
              onChange={handleDetailOrderUnitCost }
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
            <Link to={"/pedido/${purchaseOrderId}"}>
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

export default NewDetailOrderLine;
