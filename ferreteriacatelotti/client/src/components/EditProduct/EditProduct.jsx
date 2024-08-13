import React, {useState, useEffect} from "react";
import FormItem from "../FormItem/FormItem";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
const EditProduct = () => {
    const [productName, setProductName] = useState("");
    const [productStock, setProductStock] = useState("");
    const [productUnit, setProductUnit] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productCategories, setProductCategories] = useState([]);
    const [productCost, setProductCost] = useState("");
    const { pid } = useParams()
  
    const resetForm = () => {
        setProductName("");
        setProductStock("");
        setProductUnit("");
        setProductPrice("");
        setProductCategory("");
        setProductCost("");
      };

      useEffect(() => {
        // Función asíncrona para obtener las categorías desde la API
        const fetchCategories = async () => {
          try {
           
            const response = await fetch("http://localhost:8080/api/categories");
            if (!response.ok) {
              throw new Error("Error al obtener las categorías");
            }
            const data = await response.json();
            
            setProductCategories(data.categories); // Actualiza el estado con las categorías recibidas
          } catch (error) {
            console.error("Error en la solicitud", error);
          }
        };
    
        fetchCategories(); // Llama a la función al montar el componente
      }, []);

      useEffect(() => {
        const fetchProduct = async () => {
          try {
            console.log("PID:", pid);
            const response = await fetch(`http://localhost:8080/api/products/${pid}`); // URL con el ID del producto
            if (response.ok) {
              const data = await response.json();
              setProductName(data.product.productName)
              setProductCost(data.product.productCost)
              setProductPrice(data.product.productPrice)
              setProductStock(data.product. productStock)
            } else {
              throw new Error("Error al obtener el producto");
            }
          } catch (error) {
            console.error("Error en la solicitud", error);
          }
        };
    
        fetchProduct();
      }, [pid]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const productData = {
          productName,
          productStock,
          productUnit,
          productPrice,
          productCategory,
          productCost,
        };
    
        try {
          const response = await fetch(
            `http://localhost:8080/api/products/${idProducto}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(productData),
            }
          );
    
          const result = await response.json();
    
          switch (response.status) {
            case 201:
              Swal.fire({
                title: "Producto creado con exito",
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                  title: "my-title-class",
                  popup: "my-popup-class",
                  confirmButton: "my-confirm-button-class",
                  overlay: "my-overlay-class",
                },
              }).then(() => {
                resetForm();
              });
              break;
    
            case 400:
              const errorMessages =
                result.errorMessages && result.errorMessages.length > 0
                  ? result.errorMessages[0] // Une los mensajes con saltos de línea
                  : "Error desconocido";
    
              Swal.fire({
                title: "Error al crear producto",
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
              break;
            case 409:
              Swal.fire({
                title: `Error al crear producto: ${productName} ya existe`,
                icon: "warning",
                confirmButtonText: "Aceptar",
                customClass: {
                  title: "my-title-class",
                  popup: "my-popup-class",
                  confirmButton: "my-confirm-button-class",
                  overlay: "my-overlay-class",
                },
              });
              break;
    
            default:
              Swal.fire({
                title: "Error inesperado",
                text: `Código de estado: ${response.status}`,
                icon: "error",
                confirmButtonText: "Aceptar",
                customClass: {
                  title: "my-title-class",
                  popup: "my-popup-class",
                  confirmButton: "my-confirm-button-class",
                  overlay: "my-overlay-class",
                },
              });
    
              // Registro en la consola para depuración adicional
              console.error(`Estado inesperado: ${response.status}`, response);
    
              // Puedes agregar redireccionamiento o manejo adicional aquí si es necesario
              break;
          }
          
        } catch (error) {
          console.error("Error en la solicitud", error);
        }
      };
      const options = ["Metros"];
  return (
    <>
      <div className="component__container">
        <div className="product__form__container">
          <h2 className="client__title">Editar Producto</h2>
          <form className="product__form" onSubmit={handleSubmit}>
            <div className="product__form__item">
              <FormItem
                formItemClassName="form__item"
                id="productName"
                typeInput="text"
                label="Nombre"
                labelClassname="form__label"
                inputClassname="form__input"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <FormItem
                formItemClassName="form__item"
                id="productCost"
                typeInput="text"
                label="Costo"
                labelClassname="form__label"
                inputClassname="form__input"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
              />
              <FormItem
                formItemClassName="form__item"
                id="productSalePrice"
                typeInput="text"
                label="Precio de venta"
                labelClassname="form__label"
                inputClassname="form__input"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>

            <div className="product__form__item">
              <FormItem
                formItemClassName="form__item"
                id="productStock"
                label="Stock"
                typeInput="text"
                labelClassname="form__label"
                inputClassname="form__input"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
              />

              <div className="product__item__select">
                <label htmlFor="productCategory">Categoría</label>
                <select
                  id="productCategory"
                  name="productCategory"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
                  {productCategories.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product__item__select">
                <label htmlFor="productUnit">Unidad</label>
                <DropdownSelect
                  options={options}
                  value={productUnit}
                  onChange={setProductUnit}
                  placeholder="Selecciona una unidad"
                />
              </div>
            </div>
          </form>
          <div className="form__containerbuttons">
            <button
              type="submit"
              className="form__button"
              onClick={handleSubmit}
            >
              Guardar
            </button>
            <Link to={"/productos"}>
              <button type="button" className="form__button">
                Salir
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
