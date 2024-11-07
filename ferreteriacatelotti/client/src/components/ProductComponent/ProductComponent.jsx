import React from "react";
import { useState, useEffect } from "react";
import Table from "../TableCustom/TableCustom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./ProductComponent.css";

const ProductComponent = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [filas, setFilas] = useState([]);
  const tableHeaders = [
    { value: "productName", label: "Producto" },
    { value: "productStock", label: "Stock" },
    { value: "productPrice", label: "Precio venta" },
    { value: "categoryID", label: "Categoria" },
    { value: "unitID", label: "Unidad" },
  ];

  const getProductsWithLowStock = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/lowstock")
      if(response.status === 200){
        const products = await response.json();
        setFilas(products.products)
      }
    } catch (error) {
      throw error;
    }
  }
  const getProducts = async () => {
    try {
      const queryParam =
        searchCriteria === "name"
          ? `name=${productName}`
          : `category=${productCategory}`;
          
          const response = await fetch(
        `http://localhost:8080/api/products/search?${queryParam}`
      );

      if (response.status === 404 && searchCriteria === 'name') {
        Swal.fire({
          title: "Producto no encontrado",
          icon: "warning",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }else if(response.status === 404 && searchCriteria === 'category'){
        Swal.fire({
          title: "No hay productos con esa categoria",
          icon: "warning",
          confirmButtonText: "Aceptar",
          customClass: {
            title: "my-title-class",
            popup: "my-popup-class",
            confirmButton: "my-confirm-button-class",
            overlay: "my-overlay-class",
          },
        });
      }

      const data = await response.json(); // Convierte la respuesta a JSON

      // Asegúrate de que 'products' está disponible en la respuesta
      if (data.products) {
        setFilas(data.products); // Actualiza el estado con los productos encontrados
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        cancelButton: "my-cancel-button-class", // Agrega clase para el botón de cancelar
        overlay: "my-overlay-class",
      },
    });

    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        switch (response.status) {
          case 200:
            Swal.fire({
              title: "Producto eliminado con éxito",
              icon: "success",
              confirmButtonText: "Aceptar",
              customClass: {
                title: "my-title-class",
                popup: "my-popup-class",
                confirmButton: "my-confirm-button-class",
                overlay: "my-overlay-class",
              },
            });
            setFilas(filas.filter((product) => product._id !== productId));
            break;
          case 404:
            Swal.fire({
              title: "Producto no encontrado",
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
            console.error(`Estado inesperado: ${response.status}`, response);
            break;
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    } else {
      // Si el usuario cancela la acción
      Swal.fire({
        title: "Eliminación cancelada",
        icon: "info",
        confirmButtonText: "Aceptar",
        customClass: {
          title: "my-title-class",
          popup: "my-popup-class",
          confirmButton: "my-confirm-button-class",
          overlay: "my-overlay-class",
        },
      });
    }
  };

  const handleInputChange = (e) => {
    if (searchCriteria === "name") {
      setProductName(e.target.value);
    } else {
      setProductCategory(e.target.value);
    }
  };

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");

        if (response) {
          const products = await response.json();

          setFilas(products.products);
        } else {
          throw new Error("Error al obtener los productos");
        }
      } catch (error) {
        throw error;
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div className="component__container">
        <div className="component__table__container">
          <div className="component__search__container">
            <select
              className="component__search-select"
              value={searchCriteria}
              onChange={handleSearchCriteriaChange}
            >
              <option value="name">Nombre</option>
              <option value="category">Categoría</option>
            </select>
            <input
              type="text"
              className="component__search-input"
              placeholder={
                searchCriteria === "name" ? "Nombre del producto" : "Categoría"
              }
              value={searchCriteria === "name" ? productName : productCategory}
              onChange={handleInputChange}
            />
            <button className="component__search-button" onClick={getProducts}>
              Buscar
            </button>
          </div>
          <Table
            tableClassName="table"
            trClassName="table__row"
            thClassName="table__header"
            theadClassName="table__thead"
            tbodyClassName="table__body"
            tdClassName="table__cell"
            deleteIconClassName="table__deleteIcon"
            editIconClassName="table__editIcon"
            handleDeleteCell={handleDeleteProduct}
            headers={tableHeaders}
            data={filas}
            getEditPath={(id) =>`/productos/${id}`}
          />
          <div className="component__actions">
            <Link to={"/productos/agregarproducto"}>
              <button className="component__actions__button">Nuevo</button>
            </Link>
            <button className="component__actions__button" onClick={getProductsWithLowStock}>
              Quiebre Stock
            </button>
            <button className="component__actions__button">Guardar</button>
            <button className="component__actions__button">Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductComponent;
