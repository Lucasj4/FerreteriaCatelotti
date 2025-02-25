import { useState, useEffect, useContext } from "react";
import "./BudgetDetailLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams, useNavigate } from "react-router-dom";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import BudgetContext from "../context/BudgetContext";
import Swal from "sweetalert2";

const BudgetDetailLine = ({ isNewBudget }) => {
  const [budgetDetail, setBudgetDetail] = useState({
    item: { id: "", name: "" },
    quantity: "",
    unitCost: "",
  });
  const [productsOptions, setProductsOption] = useState([]);
  const { pid } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    console.log(pid);

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
          salePrice: product.productPrice, // El nombre del producto como etiqueta visible
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
      setBudgetDetail((prev) => ({
        ...prev,
        item: { id: product.value, name: product.label },
        productPrice: product.salePrice || "", // Usar el precio de venta
      }));
    } else {
      setBudgetDetail((prev) => ({
        ...prev,
        item: { id: "", name: "" },
        productPrice: "",
      }));
    }
  };

  // const resetForm = () => {
  //   setBudgetDetailItem("");
  //   setBudgetDetailUnitCost("");
  //   setBudgetDetailQuantity("");
  // };

  const resetForm = () => {
    setBudgetDetail({
      item: { id: "", name: "" },
      quantity: "",
      unitCost: "",
    });
  };

  const hundleSubtmit = async (e) => {
    e.preventDefault();

    const budgetDetailLine = {
      budgetDetailItem: budgetDetail.item.name, // Ahora accede desde budgetDetail.item
      budgetDetailQuantity: budgetDetail.quantity,
      budgetDetailSalePrice: budgetDetail.productPrice,
      productID: budgetDetail.item.id, // Ahora accede desde budgetDetail.item
      budgetID: pid,
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
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handlePriceChange = (e) => {
    e.preventDefault();

    showAlert({
      title: "Error",
      text: "El precio de venta solo puede ser modificado desde los productos.",
      icon: "warning",
    }).then(() => {
      // Restablecer el precio unitario en el estado `budgetDetail`
      setBudgetDetail((prev) => ({ ...prev}));
    });
  };

  return (
    <>
      <div className="budgetdetailline__container">
        <div className="budgetdetailline__formcontainer">
          <h2 className="budgetdetailline__form__title"> Nueva linea </h2>
          <form action="" className="budgetdetailline__form">
            <div className="product__item__select">
              <label htmlFor="productUnit">Productos</label>
              <DropdownSelect
                options={productsOptions}
                value={budgetDetail.item} // Ahora accede directamente al item dentro de budgetDetail
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
              value={budgetDetail.quantity}
              onChange={(e) =>
                setBudgetDetail((prev) => ({
                  ...prev,
                  quantity: e.target.value,
                }))
              }
            />

            {/* <FormItem
              formItemClassName="form__item"
              id="precioUnitario"
              inputClassname="form__input"
              typeInput="text"
              label="Precio Unitario"
              labelClassname="form__label"
              value={budgetDetail.unitCost}
              onChange={handlePriceChange}
            /> */}

            <FormItem
              formItemClassName="form__item"
              id="precioVenta"
              inputClassname="form__input"
              typeInput="text"
              label="Precio de Venta"
              labelClassname="form__label"
              value={budgetDetail.productPrice}
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
            <Link to={`/presupuesto/${pid}`}>
              <button className="budgetdetailline__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetailLine;
