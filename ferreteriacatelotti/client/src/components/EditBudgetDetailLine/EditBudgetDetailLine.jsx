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

  useEffect(() => {
    const fetchBudgetDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/budgetsdetails/${rowid}`);
        const data = await response.json();
  
        setBudgetDetailItem({
          id: data.budgetDetail.productID,
          name: data.budgetDetail.budgetDetailItem
        });
        setBudgetDetailQuantity(data.budgetDetail.budgetDetailQuantity);
        setBudgetDetailUnitCost(data.budgetDetail.budgetDetailUnitCost);
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    };
  
    // Llama a la función fetchBudgetDetail
    fetchBudgetDetail();
  }, [rowid]);
  

  const resetForm = () => {
    setBudgetDetailItem("");
    setBudgetDetailUnitCost("");
    setBudgetDetailQuantity("");
  };

  const hundleSubtmit = async (e) => {
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
        
      const updateBudget = {
          budgetDetailItem: budgetDetailItem.name,
          budgetDetailQuantity,
          budgetDetailUnitCost,
          productID: budgetDetailItem.id,
          budgetID: pid,
        };

        console.log("Budget detail: ", updateBudget);

        try {
          const response = await fetch(`http://localhost:8080/api/budgetsdetails/${rowid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateBudget),
          });
          
          console.log("Response: ", response);
          if (response.status === 200) {
            Swal.fire({
              title: "Linea de detalle modificada con exito",
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
          } else if (response.status === 400) {
            const errorMessages =
              result.errorMessages && result.errorMessages.length > 0
                ? result.errorMessages[0] // Une los mensajes con saltos de línea
                : "Error desconocido";
    
            Swal.fire({
              title: "Error al agregar linea de detalle",
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
          }
      }catch (error) {
        console.error("Error:", error.message);
      };

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
                value={budgetDetailItem.name} // Muestra la etiqueta del producto seleccionado
                onChange={(option) =>
                  setBudgetDetailItem({
                    id: option.value,
                    name: option.label,
                  })
                }
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
              onChange={(e) => setBudgetDetailUnitCost(e.target.value)}
            />
          </form>
          <div className="budgetdetailline__containerbutton">
            <button
              className="budgetdetailline__button"
              onClick={hundleSubtmit}
            >
              Guardar
            </button>
            <Link to="/detallepresupuesto">
              <button className="budgetdetailline__button">Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetDetailLine;
