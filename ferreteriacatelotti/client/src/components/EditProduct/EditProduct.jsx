import React, { useState, useEffect } from "react";
import FormItem from "../FormItem/FormItem";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
const EditProduct = () => {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productUnit, setProductUnit] = useState({
    value: "",
    label: "",
  });
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [productCost, setProductCost] = useState("");
  const [productsUnitsOptions, setProductsUnitsOptions] = useState([]);
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

  const resetForm = () => {
    setProductName("");
    setProductStock("");
    setProductUnit("");
    setProductPrice("");
    setProductCategory("");
    setProductCost("");
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/units`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        console.log("Data: ", data);

        const productsUnitsOptions = data.units.map((unit) => ({
          value: unit._id,
          label: unit.unitName,
        }));

        setProductsUnitsOptions(productsUnitsOptions);
      } catch (error) {
        console.error("Error en la solicitud", error);
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    // Función asíncrona para obtener las categorías desde la API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
          credentials: "include",
        });
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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${pid}`,
          {
            credentials: "include",
          }
        ); // URL con el ID del producto
        if (response.ok) {
          const data = await response.json();

          console.log(data.product);

          setProductName(data.product.productName);
          setProductCost(data.product.productCost);
          setProductPrice(data.product.productPrice);
          setProductStock(data.product.productStock);

          console.log("Categorias de productos: ", productCategories);
          console.log(
            "Categoria traida desde producto: ",
            data.product.categoryID
          );

          const category = productCategories.find(
            (category) => category._id === data.product.categoryID
          );

          console.log(category);

          // Si encontramos la categoría, actualizamos el estado con el categoryId
          if (category) {
            setProductCategory(category.categoryName);
          } else {
            console.error("Categoría no encontrada para el producto");
          }

          const unit = productsUnitsOptions.find((unit) => {
            return unit.value === data.product.unitID;
          });

          if (unit) {
            setProductUnit({
              value: unit.value,
              label: unit.label,
            });
          } else {
            console.error("Unidad no encontrada para el producto");
          }
        } else {
          throw new Error("Error al obtener la categoría");
        }
      } catch (error) {
        console.error("Error en la solicitud", error);
      }
    };

    fetchProduct();
  }, [pid, productsUnitsOptions]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      productName,
      productStock,
      productUnit: productUnit.label,
      productPrice,
      productCategory: productCategory,
      productCost,
    };

    console.log("Producto: ", productData);

    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "¿Confirmar modificacion de detalle?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${pid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(productData),
          }
        );

        const result = await response.json();

        switch (response.status) {
          case 200:
            showAlert({
              title: "Producto modificado con exito",
              icon: "success",
            }).then(() => {
              resetForm();
            });
            break;

          case 400:
            const errorMessages =
              result.errorMessages && result.errorMessages.length > 0
                ? result.errorMessages[0] // Une los mensajes con saltos de línea
                : "Error desconocido";

            showAlert({
              title: "Error al modificar producto",
              text: errorMessages,
              icon: "error",
             
            });
            break;
          case 409:
            showAlert({
              title: `Error al crear modificar: ${productName} ya existe`,
              icon: "warning",
              
            });
            break;

          default:
            showAlert({
              title: "Error inesperado",
              text: `Código de estado: ${response.status}`,
              icon: "error",
            });

            // Registro en la consola para depuración adicional
            console.error(`Estado inesperado: ${response.status}`, response);

            // Puedes agregar redireccionamiento o manejo adicional aquí si es necesario
            break;
        }
      } catch (error) {
        console.error("Error en la solicitud", error);
      }
    }
  };

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
                  options={productsUnitsOptions}
                  value={productUnit}
                  onChange={(option) => setProductUnit(option)}
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
