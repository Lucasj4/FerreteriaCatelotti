import React, { useState, useEffect } from "react";
import "../NewDetailOrder/NewDetailOrderLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/OrderContext";
import DropdownSelect from "../DropDownSelect/DropDownSelect";

const NewEditDetailOrderLine = () => {
  const option = ["mt", "litro"];
  const { addDetalleId, clearDetalleIds } = useAppContext();
  const [detailOrderProduct, setDetailOrderProduct] = useState({ id: "", name: "" });
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
    setDetailOrderUnitCost("")
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");

        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();

        const productOptions = data.products.map((product) => ({
          value: product._id, // Usamos el ID del producto como valor
          label: product.productName, // El nombre del producto como etiqueta visible
        }));
       
        
        setProductsOption(productOptions);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    };

    fetchProducts();
  }, []);
 
  const handleSubmit= async (e) => {
    e.preventDefault();

    const orderDetailOrderLine = {
      detailOrderProduct: detailOrderProduct.name,  // Nombre del producto
      detailOrderQuantity,
      detailOrderUnitCost,
      productID: detailOrderProduct.id,  // ID del producto
      purchaseOrderID: pid,
    };
    
    
    console.log("orderDetailOrderLine: ", orderDetailOrderLine);
    
    try {
      const response = await fetch("http://localhost:8080/api/detailsorder/editdetailorderline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetailOrderLine),
        
      });
         
      if (!response.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      // Puedes hacer algo con la respuesta si es necesario
      const responseData = await response.json();
      console.log("detalle", responseData.detail);
      console.log("Id del detalle", responseData.detail._id);
      console.log("ID del detalle a agregar: ", responseData.detail._id);
      

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
                value={detailOrderProduct.name}  // Muestra la etiqueta del producto seleccionado
                onChange={(option) => setDetailOrderProduct({ id: option.value, name: option.label })} 
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

export default NewEditDetailOrderLine;
