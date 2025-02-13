import { useState, useEffect, useContext } from "react";
import "./BudgetDetailLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams, useNavigate } from "react-router-dom";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import BudgetContext from "../context/BudgetContext";
import Swal from "sweetalert2";

const BudgetDetailLine = ({ isNewBudget }) => {
  const [budgetDetailItem, setBudgetDetailItem] = useState({
    id: "",
    name: "",
  });
  const [budgetDetailQuantity, setBudgetDetailQuantity] = useState("");
  const [budgetDetailUnitCost, setBudgetDetailUnitCost] = useState("");
  const [productsOptions, setProductsOption] = useState([]);
  const { pid } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  console.log("¿Es un presupuesto nuevo?", isNewBudget);
  const { addDetailId, budgetId } = useContext(BudgetContext);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();

        const productOptions = data.products.map((product) => ({
          value: product._id, // Usamos el ID del producto como valor
          label: product.productName,
          unitPrice: product.productPrice, // El nombre del producto como etiqueta visible
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
      setBudgetDetailUnitCost(product.unitPrice || ""); // Actualiza el precio unitario
      setBudgetDetailItem({ id: product.value, name: product.label });
    } else {
      // Si no hay producto seleccionado (borrado)
      // setSelectedProduct(null);
      setBudgetDetailUnitCost("");
      setBudgetDetailItem({ id: "", name: "" });
    }
  };

  const resetForm = () => {
    setBudgetDetailItem("");
    setBudgetDetailUnitCost("");
    setBudgetDetailQuantity("");
  };

  const hundleSubtmit = async (e) => {
    e.preventDefault();

    const budgetDetailLine = {
      budgetDetailItem: budgetDetailItem.name,
      budgetDetailQuantity,
      budgetDetailUnitCost,
      productID: budgetDetailItem.id,
      budgetID: isNewBudget ? budgetId : pid,
    };

    

    try {
      const response = await fetch("http://localhost:8080/api/budgetsdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(budgetDetailLine),
      });

      

      const data = await response.json();

      switch (response.status) {
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


      // if (response.status === 201 || response.status === 200 ) {
      //   showAlert({
      //     title: "Linea de detalle agregada con exito",
      //     icon: "success",
      //   }).then(() => {
      //     resetForm();
      //   });
        
      // } else if (response.status === 400) {
      //   const errorMessages =
      //     result.errorMessages && result.errorMessages.length > 0
      //       ? result.errorMessages[0] // Une los mensajes con saltos de línea
      //       : "Error desconocido";

      //   showAlert({
      //     title: "Error al agregar linea de detalle",
      //     text: errorMessages,
      //     icon: "error",
      //   });
      // }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handlePriceChange = (e) => {
    // Detectar si se intenta modificar el precio unitario
    e.preventDefault();
    
    showAlert({
      title: "Error",
      text: "El precio unitario solo puede ser modificado desde los productos.",
      icon: "warning",
    }).then(() => {
      // Restablecer el valor del campo a su valor original
      setBudgetDetailUnitCost(originalUnitCost); // Asumiendo que tienes un estado para el costo original
    });
  };

  return (
    <>
      <div className="budgetdetailline__container">
        <div className="budgetdetailline__formcontainer">
          <h2 className="budgetdetailline__form__title"> Nueva linea </h2>
          <form action="" className="budgetdetailline__form">
            {/* <div className="form__item">
              <label
                htmlFor="producto"
                className="form__label"
              >
                Producto
              </label>
              <div className="budgetdetailline__form__item-product">
                <input
                  type="text"
                  className="form__input"
                  id="producto"
                />
                <button className="budgetdetailline__form__item__button">
                  Producto
                </button>
              </div>
            </div> */}

            <div className="product__item__select">
              <label htmlFor="productUnit">Productos</label>
              <DropdownSelect
                options={productsOptions}
                value={budgetDetailItem}
                onChange={handleProductChange}
                placeholder="Selecciona un producto"
                isClearable // Permite borrar la selección
              />
            </div>
            <FormItem
              formItemClassName="form__item"
              id="cantidad"
              inputClassname="form__input"
              typeInput="text"
              label="Cantidad"
              labelClassname="form__label"
              value={budgetDetailQuantity}
              onChange={(e) => setBudgetDetailQuantity(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="precioUnitario"
              inputClassname="form__input"
              typeInput="text"
              label="Precio Unitario"
              labelClassname="form__label"
              value={budgetDetailUnitCost}
              onChange={handlePriceChange}
            />
          </form>
          <div className="budgetdetailline__containerbutton">
            <button
              className="budgetdetailline__button"
              onClick={hundleSubtmit}
            >
              Guardar
            </button>
            <Link
              to={
                isNewBudget ? `/presupuesto/${budgetId}` : `/presupuesto/${pid}`
              }
            >
              <button className="budgetdetailline__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetailLine;
