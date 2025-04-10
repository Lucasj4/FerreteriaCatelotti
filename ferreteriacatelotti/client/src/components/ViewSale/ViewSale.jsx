import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Table from "../TableCustom/TableCustom";
import "./ViewSale.css";

const ViewSale = () => {
  const [saleDate, setDateSale] = useState(" ");
  const [rows, setRows] = useState([]);
  const [saleAmount, setSaleAmount] = useState(" ");
  const [saleInvoiceNumber, setSaleInvoiceNumber] = useState(" ");
  const [saleClient, setSaleClient] = useState(" ");
  const [budgetId, setBudgetId] = useState(" ");
  const [saleId, setSaleId] = useState(" ");
  const [saleDetails, setSaleDetails] = useState([]);
  const { sid } = useParams();

  const tableHeaders = [
    { value: "budgetDetailItem", label: "Producto" },
    { value: "budgetDetailQuantity", label: "Cantidad" },
    { value: "budgetDetailSalePrice", label: "Precio de venta" },
  ];

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const responseSale = await fetch(
          `${import.meta.env.VITE_API_URL}/api/sales/${sid}`,
          {
            credentials: "include",
          }
        );

        const data = await responseSale.json();

        console.log("Sale Data: ", data.sale);

        setDateSale(data.sale.saleDate);
        setSaleAmount(data.sale.saleTotalAmount);
        setSaleInvoiceNumber(data.sale.invoiceNumber);
        setSaleClient(data.sale.clientId);
        setBudgetId(data.sale.budgetId);
        setSaleId(data.sale._id);

        // Fetch presupuesto después de establecer budgetId
        if (data.sale.budgetId) {
          fetchBudget(data.sale.budgetId);
        }
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
    };

    const fetchBudget = async (budgetId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/budgets/budgetwithdetails/${budgetId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();
        const budgetdetails = data.budgetDetailOrders;
        console.log("Detalles: ", budgetdetails);
        setSaleDetails(budgetdetails)
        setRows(budgetdetails);
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
    };

    fetchSale();
  }, [sid]);

  const printInvoice = async () => {

    console.log("sale details: ", saleDetails);
    
    const sale = {
      saleTotalAmount: saleAmount,
      saleDate,
      client: saleClient,
      invoiceNumber: saleInvoiceNumber,
      details: saleDetails
    }

    console.log(sale);
    
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/sales/printinvoice`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
      }
    );

    if (response.ok) {
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
    
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "factura.pdf";
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
    
      // window.URL.revokeObjectURL(url);

      const pdfBlob = await response.blob();

      // Crea una URL para el Blob del PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Crear un enlace para descargar el PDF automáticamente o abrirlo
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `factura.pdf`; // Aquí puedes elegir el nombre del archivo
      document.body.appendChild(link);
      link.click();

      // También podrías abrirlo en una nueva ventana
      // window.open(pdfUrl);

      // Limpiar el objeto URL después de descargar o abrirlo
      URL.revokeObjectURL(pdfUrl);
    } else {
      console.error("Error al generar la factura:", response.statusText);
    }


  };
  return (
    <>
      <div className="sale">
        <div className="sale__container">
          <div className="saledetail__title">Detalle de venta</div>
          <div className="sale__info">
            <div className="sale__info__item">
              <p className="sale__info__item__label">
                <strong>Fecha:</strong> {saleDate}
              </p>
              <p className="sale__info__item__label">
                <strong>Importe:</strong> ${saleAmount}
              </p>
            </div>
            <div className="sale__info__item">
              <p className="sale__info__item__label">
                <strong>Numero de factura: </strong> {saleInvoiceNumber}
              </p>
              <p className="sale__info__item__label">
                {" "}
                <strong>Cliente:</strong> {saleClient}{" "}
              </p>
            </div>
          </div>

          <div className="sale__table">
            <Table
              tableClassName="table"
              trClassName="table__row"
              thClassName="table__header"
              theadClassName="table__thead"
              tbodyClassName="table__body"
              tdClassName="table__cell"
              deleteIconClassName="table__deleteIcon"
              editIconClassName="table__editIcon"
              headers={tableHeaders}
              getEditPath={(id) => `/users/${id}`}
              handleDeleteCell={(id, index) => handleDeleteCell(id, index)}
              data={rows}
              paginationandcontrols="paginations-and-controls"
            />
          </div>

          <div className="sale__actions">
            <button onClick={printInvoice}>Imprimir</button>
            <Link to={"/ventas"}>
              <button>Salir</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSale;
