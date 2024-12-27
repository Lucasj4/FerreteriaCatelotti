import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { sid } = useParams();

  const tableHeaders = [
    { value: "budgetDetailItem", label: "Producto" },
    { value: "budgetDetailQuantity", label: "Cantidad" },
    { value: "budgetDetailUnitCost", label: "Precio unitario" },
  ];

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const responseSale = await fetch(
          `http://localhost:8080/api/sales/${sid}`,
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
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
    };

    fetchSale();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/budgets/budgetwithdetails/${budgetId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();
        const budgetdetails = data.budgetDetailOrders;
        console.log("detalles: ", budgetdetails);

        setRows(budgetdetails);
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
    };

    fetchBudget();
  }, []);
  return (
    <>
      <div className="sale">
        <div className="sale__container">
          <div className="sale__info">
          <div className="saledetail__title">Detalle de venta</div>
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
            />
          </div>

          <div className="sale__actions">
            <button>Imprimir</button>
            <button>Salir</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSale;
