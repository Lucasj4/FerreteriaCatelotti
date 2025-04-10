import { useState, useEffect } from "react";
import FormItem from "../FormItem/FormItem";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";


const EditSupplier  = () => {
  const [supplierName, setSupplierName] = useState("");
  const [supplierLastName, setSupplierLastName] = useState("");
  const [supplierDni, setSupplierDni] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const {id} = useParams();

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
    const fetchSupplier = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/suppliers/${id}`, {
            credentials: 'include'
        });
        console.log(id);
        
        const data = await response.json();

        const supplier = data.supplier;

        console.log(supplier);
        
        setSupplierDni(supplier.supplierDni);
        setSupplierEmail(supplier.supplierEmail);
        setSupplierName(supplier.supplierFirstName);
        setSupplierLastName(supplier.supplierLastName);


    };

    fetchSupplier();

  }, [id]);



  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await showAlert({
        title: "¿Estás seguro?",
        text: "¿Confirmar modificacion de proveedor?",
        icon: "warning",
        showCancelButton: true,
      });

    if(result.isConfirmed){
        const supplierUpdate = {
            supplierFirstName: supplierName,
            supplierLastName,
            supplierEmail,
            supplierDni,
          };
      
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/suppliers/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(supplierUpdate),
            });
      
            const data = await response.json();
      
           const updatedSupplier = data.updatedSupplier;
      
           console.log(updatedSupplier);
           
            
            switch (response.status) {
              case 200:
                showAlert({
                  text: "Proveedor editado con exito",
                  icon: "success",
                });
      
                break;
              case 400:
                const errorMessages =
                  data.errorMessages && data.errorMessages.length > 0
                    ? data.errorMessages[0] // Une los mensajes con saltos de línea
                    : "Error desconocido";
                showAlert({
                  title: "Error",
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
                showAlert({
                  title: "Error inesperado",
                  text: `Código de estado: ${response.status}`,
                  icon: "error",
                });
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
        <div className="supplier__form__container">
          <h2 className="supplier__title">Editar Proveedor</h2>
          <form action="">
            <FormItem
              formItemClassName="form__item"
              id="supplierName"
              typeInput="text"
              label="Nombre"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="supplierLastName"
              typeInput="text"
              label="Apellido"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierLastName}
              onChange={(e) => setSupplierLastName(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="supplierDni"
              typeInput="text"
              label="Dni"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierDni}
              onChange={(e) => setSupplierDni(e.target.value)}
            />
            <FormItem
              formItemClassName="form__item"
              id="supplierEmail"
              typeInput="text"
              label="Email"
              labelClassname="form__label"
              inputClassname="form__input"
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
            />
          </form>

          <div className="form__containerbuttons">
            <button type="button" className="form__button" onClick={handleSubmit}>
              Guardar
            </button>
            <Link to={"/proveedores"}>
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

export default EditSupplier;
