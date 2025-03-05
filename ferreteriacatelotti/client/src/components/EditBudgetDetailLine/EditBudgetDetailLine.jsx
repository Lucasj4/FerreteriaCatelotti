import { useState, useEffect } from "react";
import "../BudgetDetailLine/BudgetDetailLine.css";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import DropdownSelect from "../DropDownSelect/DropDownSelect";
import Swal from "sweetalert2";

const BudgetDetailLine = () => {
  const [budgetDetailItem, setBudgetDetailItem] = useState({
    id: "",
    name: "",
  });
  const [budgetDetailQuantity, setBudgetDetailQuantity] = useState("");
  const [budgetDetailUnitCost, setBudgetDetailUnitCost] = useState("");
  const [productsOptions, setProductsOption] = useState([]);
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

  useEffect(() => {
    const fetchBudgetDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/budgetsdetails/${rowid}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        console.log("data: ", data.budgetDetail);

        const product = productsOptions.find(
          (product) => product.value === data.budgetDetail.productID
        );

        console.log(product);
        
        if (product) {
          setBudgetDetailItem({
            id: data.budgetDetail.productID,
            name: product.label,
          });
        }

        setBudgetDetailQuantity(data.budgetDetail.budgetDetailQuantity);
        setBudgetDetailUnitCost(data.budgetDetail.budgetDetailSalePrice);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    };

    // Llama a la función fetchBudgetDetail solo si `productsOptions` está disponible
    if (productsOptions.length > 0) {
      fetchBudgetDetail();
    }
  }, [rowid, productsOptions]); // Dependiendo de `productsOptions` también

  const handleProductChange = (product) => {
    if (product) {
      setBudgetDetailItem({ id: product.value, name: product.label });
      setBudgetDetailUnitCost(product.unitPrice || ""); // Actualiza el precio unitario
    } else {
      setBudgetDetailItem({ id: "", name: "" });
      setBudgetDetailUnitCost("");
    }
  };

  const resetForm = () => {
    setBudgetDetailItem("");
    setBudgetDetailUnitCost("");
    setBudgetDetailQuantity("");
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

  const hundleSubtmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8080/api/budgets/${pid}`, {
      credentials: "include",
    });

    
    const data = await response.json();

    const budget = data.budget;

    if (budget.budgetStatus === "Facturado") {
      showAlert({
        title: "Error",
        text: "No se puede modificar un presupuesto que ya ha sido facturado",
        icon: "warning",
      });
      return;
    }

    const result = await showAlert({
      title: "¿Estás seguro?",
      text: "¿Confirmar modificacion de detalle?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const updateBudget = {
        budgetDetailItem: budgetDetailItem.name,
        budgetDetailQuantity,
        budgetDetailUnitCost,
        productID: budgetDetailItem.id,
        budgetID: pid,
      };

      console.log("Budget detail: ", updateBudget);

      try {
        const response = await fetch(
          `http://localhost:8080/api/budgetsdetails/${rowid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updateBudget),
          }
        );

        const data = await response.json()
        console.log("Response: ", response);
        if (response.status === 200) {
          showAlert({
            title: "Linea de detalle modificada con exito",
            icon: "success",
          }).then(() => {
            resetForm();
          });
        } else if (response.status === 400) {

          const data = await response.json();
          const errorMessages =
            data.errorMessages && data.errorMessages.length > 0
              ? data.errorMessages[0] // Une los mensajes con saltos de línea
              : "Error desconocido";

          showAlert({
            title: "Error al agregar linea de detalle",
            text: errorMessages,
            icon: "error",
          });
        }else {
          showAlert({
            title: data.message ,
            icon: "error",
          })
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      <div className="budgetdetailline__container">
        <div className="budgetdetailline__formcontainer">
          <h2 className="budgetdetailline__form__title"> Editar Linea </h2>
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
                value={productsOptions.find(
                  (product) => product.value === budgetDetailItem.id
                )}
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
              label="Precio venta"
              labelClassname="form__label"
              value={budgetDetailUnitCost}
              // onChange={(e) => setBudgetDetailUnitCost(e.target.value)}
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
