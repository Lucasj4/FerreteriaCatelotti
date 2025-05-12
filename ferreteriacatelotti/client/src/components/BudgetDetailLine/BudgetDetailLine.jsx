import { useState, useEffect } from "react";
import "./BudgetDetailLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const BudgetDetailLine = ({ isNewBudget }) => {
  const [budgetDetail, setBudgetDetail] = useState({
    item: { id: "", name: "" },
    quantity: "",
    unitCost: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [productsOptions, setProductsOption] = useState([]);
  const { pid } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();
        const productOptions = data.products.map((product) => ({
          value: product._id, // Usamos el ID del producto como valor
          label: product.productName,
          salePrice: product.productPrice,
        }));
        setProductsOption(productOptions);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    };
    fetchProducts();
  }, []);

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
  const handleProductChange = (product) => {
    if (product) {
      setBudgetDetail((prev) => ({
        ...prev,
        item: { id: product.value, name: product.label },
        productPrice: product.salePrice || "",
      }));
    } else {
      setBudgetDetail((prev) => ({
        ...prev,
        item: { id: "", name: "" },
        productPrice: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const budgetDetailLine = {
      budgetDetailItem: budgetDetail.item.name,
      budgetDetailQuantity: budgetDetail.quantity,
      budgetDetailSalePrice: budgetDetail.productPrice,
      productID: budgetDetail.item.id,
      budgetID: pid,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/budgetsdetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(budgetDetailLine),
        }
      );

      const data = await response.json();
      switch (response.status) {
        case 201:
          showAlert({
            title: "Detalle de presupuesto agregado con éxito",
            icon: "success",
          });
          break;
        case 400:
          const errorMessages =
            data.errorMessages && data.errorMessages.length > 0
              ? data.errorMessages[0]
              : "Error desconocido";
          await showAlert({
            title: "Error al agregar línea de detalle",
            text: errorMessages,
            icon: "error",
          });
          break;
        case 409:
          await showAlert({
            title: "Conflicto al agregar línea de detalle",
            text: "Ya existe este detalle en el presupuesto o hay algún conflicto en los datos.",
            icon: "error",
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Imprimir detalles del error, si el backend proporciona un mensaje más claro.
      console.log(
        "Detalles del error:",
        error.response ? error.response.data : error
      );
    } finally {
      setIsLoading(false); // Desactivar el estado de carga al finalizar la solicitud
    }
  };

  return (
    <div className="budgetdetailline__container">
      <div className="budgetdetailline__formcontainer">
        <h2 className="budgetdetailline__form__title">Nueva línea</h2>
        <form className="budgetdetailline__form" onSubmit={handleSubmit}>
          <div className="product__item__select">
            <label htmlFor="productUnit">Productos</label>
            <DropdownSelect
              options={productsOptions}
              value={
                budgetDetail.item.id
                  ? {
                      value: budgetDetail.item.id,
                      label: budgetDetail.item.name,
                    }
                  : null
              }
              onChange={handleProductChange}
              placeholder="Selecciona un producto"
            />
          </div>

          <FormItem
            formItemClassName="form__item"
            id="cantidad"
            inputClassname="form__input"
            typeInput="text"
            label="Cantidad"
            labelClassname="form__label"
            value={budgetDetail.quantity}
            onChange={(e) =>
              setBudgetDetail((prev) => ({
                ...prev,
                quantity: e.target.value,
              }))
            }
          />

          <FormItem
            formItemClassName="form__item"
            id="precioVenta"
            inputClassname="form__input"
            typeInput="text"
            label="Precio de Venta"
            labelClassname="form__label"
            value={budgetDetail.productPrice}
            onChange={(e) =>
              setBudgetDetail((prev) => ({
                ...prev,
                productPrice: e.target.value,
              }))
            }
          />
          <div className="budgetdetailline__containerbutton">
            <button
              className="budgetdetailline__button"
              type="submit"
              disabled={isLoading} // Deshabilitar el botón cuando está cargando
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Muestra el spinner cuando está cargando
              ) : (
                "Guardar"
              )}
            </button>
            <Link to={`/presupuesto/${pid}`}>
              <button className="budgetdetailline__button">Salir</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetDetailLine;
