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
    console.log("pid: ", pid);
    const fetchProducts = async () => {
      
      
      try {
        const response = await fetch(`http://localhost:8080/api/products`);

        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();

        const productOptions = data.products.map((product) => ({
          value: product._id, // Usamos el ID del producto como valor
          label: product.productName, // El nombre del producto como etiqueta visible
          unitPrice: product.productPrice,
        }));
        

        console.log("Product Options: ", productOptions);
        
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
          `http://localhost:8080/api/detailsorder/${rowid}`
        );
  
        const data = await response.json();
        console.log("Detail order:", data);
  
        // Solo buscar el producto si las opciones están cargadas
        const product = productsOptions.find(
          (product) => product.value === data.detailOrder.productID

        );
        
        console.log("Producto: ", product);
        
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

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Confirmar modificacion de detalle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, modificar",
      cancelButtonText: "No, cancelar",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        cancelButton: "my-cancel-button-class", // Agrega clase para el botón de cancelar
        overlay: "my-overlay-class",
      },
    });

    if(result.isConfirmed){
      const orderDetailOrderLine = {
        detailOrderProduct: detailOrderProduct.name, // Nombre del producto
        detailOrderQuantity,
        detailOrderUnitCost,
        productID: detailOrderProduct.id, // ID del producto
        purchaseOrderID: pid,
      };
  
      console.log("orderDetailOrderLine: ", orderDetailOrderLine);
      console.log("Row id: ", rowid);
      
      try {
        const response = await fetch(
          `http://localhost:8080/api/detailsorder/${rowid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderDetailOrderLine),
          }
        );
  
        if (!response.ok) {
          throw new Error("Error al enviar los datos al servidor");
        }
  
        // Puedes hacer algo con la respuesta si es necesario
        const responseData = await response.json();
        console.log("detalle", responseData);
       
    
        if (response.status === 200) {
          Swal.fire({
            title: "Detalle modificado",
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
        resetForm();
      } catch (error) {
        console.error("Error:", error.message);
      }
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
                value={productsOptions.find((product) => product.value === detailOrderProduct.id)} // Muestra la etiqueta del producto seleccionado
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
            <Link to={"/detallepedido"}>
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
