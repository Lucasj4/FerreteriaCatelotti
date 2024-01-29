import React, {useState, useEffect} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./OrderDetail.css";
import { Link } from "react-router-dom";
import MultipleSelect from "../MultipleSelect/MultipleSelect"; 
import { useAppContext } from "../context/OrderContext";

const OrderDetail = () => {
  const { fecha, proveedor, saveData } = useAppContext();
  const dataPrimeraFila = {
    articulo1: "Tornillo",
    cantidad: "45",
    costoUnitario: "100",
    subtotal: "2000",
  };
  const options = [
    { value: "Gonzalez", label: "Gonzalez" },
    { value: "Martinez", label: "Martinez" },
    { value: "Pedro", label: "Pedro" },
  ];
  const [filas, setFilas] = useState([
,])

    const getOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/detallepedido"); // Hacer la solicitud GET al endpoint
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }
  
        const orders = await response.json();
        console.log(orders);
        setFilas(orders);
      } catch (error) {
        console.error("Error al obtener datos:", error.message);
      }
    };

    useEffect(() => {
      getOrders(); // Llama a getOrders al cargar el componente
    }, []);

    const handleEliminarFila = (indice) => {
      const nuevasFilas = [...filas];
      nuevasFilas.splice(indice, 1);
      setFilas(nuevasFilas);
    };
    const handleGuardar = () => {
     
      const proveedorValue = proveedor.length > 0 ? proveedor[0].value : "";
      saveData(fecha, proveedorValue);
    };
  return (
    <>
      <div className="orderdetail__container">
        <div className="orderdetail__table-container">
          <div className="date-selector">
            <div className="date-selector__item">
              <p>Fecha</p>
              <input type="date" className="date-selector__item__date"   onChange={(e) => saveData(e.target.value, proveedor)}  />
            </div>
            <div className="date-selector__item">
              <p>Proveedor</p>
              <MultipleSelect options={options} onChange={(value) => saveData(fecha, value)} />
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th className="table__header">Articulo </th>
                <th className="table__header">Cantidad</th>
                <th className="table__header">Costo Unitario</th>
                <th className="table__header">Subtotal</th>
                <th className="table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table__row">
                <td className="table__cell">{dataPrimeraFila.articulo1}</td>
                <td className="table__cell">{dataPrimeraFila.cantidad}</td>
                <td className="table__cell">{dataPrimeraFila.costoUnitario}</td>
                <td className="table__cell">{dataPrimeraFila.subtotal}</td>
                <td className="table__cell">
                  <a href="#" className="table__action table__action--edit">
                    <DeleteIcon />
                  </a>
                  <Link
                    to={`/editarlinea/${dataPrimeraFila.articulo1}/${dataPrimeraFila.cantidad}/${dataPrimeraFila.costoUnitario}/${dataPrimeraFila.subtotal}`}
                  >
                   
                      <EditIcon className="table__action table__action--delete" />
                 
                  </Link>
                </td>
              </tr>
              {filas.map((fila, indice) => (
                <tr key={indice} className="table__row">
                  <td className="table__cell">{fila.articulo}</td>
                  <td className="table__cell">{fila.cantidad}</td>
                  <td className="table__cell">{fila.precioUnitario}</td>
                  <td className="table__cell">{fila.subtotal}</td>
                  <td className="table__cell">
                    <button
                      
                      className="table__action table__action--edit"
                     
                    >
                      <DeleteIcon onClick={() => handleEliminarFila(indice)} />
                    </button>
                    <button  className="table__action table__action--delete">
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="orderdetail__buttons">
            <Link to="/detallepedido/nuevalinea">
              <button onClick={handleGuardar}>Nueva Linea</button>
            </Link>
            <Link to="/">
              <button>Guardar</button>
            </Link>
            <Link to="/">
              <button>Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
