import { SaleService } from "./sale-service.js";
import { generateInvoiceNumber } from "../utils/geneteinvoicenumber.js";
import PDFDocument from "pdfkit";
const saleService = new SaleService();
export class SaleController {

    async addSale(req, res) {

        const { saleDate, saleTotalAmount, invoiceType, clientId, budgetId } = req.body;
        const userId = req.user.user._id;

        const invoiceNumber = generateInvoiceNumber();

        try {
            const newSale = {
                invoiceNumber,
                saleDate,
                saleTotalAmount,
                invoiceType,
                clientId,
                userId,
                budgetId
            }

            const sale = await saleService.addSale(newSale);

            if (sale) {
                return res.status(201).json({ message: "Venta agregada", sale });
            }


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

    }

    async printInvoiceSale(req, res) {
        const { saleTotalAmount, saleDate, client, details, invoiceNumber } = req.body;


        req.logger.info('total: ' + saleTotalAmount);
        req.logger.info('fecha: ' + saleDate);
        req.logger.info('cliente: ' + client);
        req.logger.info('detalles: ', details);


        if (!client || !saleTotalAmount || !saleDate || !invoiceNumber) {
            return res.status(400).json({ error: "Faltan datos necesarios" });
        }

        try {
            const doc = new PDFDocument();

            // Establecer headers para la respuesta antes de enviar el contenido PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=factura_${invoiceNumber}.pdf`);
    
            // Transmitir el documento directamente a la respuesta HTTP
            doc.pipe(res);
    
            // Cabecera del PDF
            doc.fontSize(14).text(`Factura de venta No. ${invoiceNumber}`, { align: 'right' });
            doc.fontSize(14).text(`Fecha: ${saleDate}`, { align: 'left' }).moveDown(0.5);
            doc.text(`Cliente: ${client}`, { align: 'left' }).moveDown(0.5);
            doc.text(`Total: $${saleTotalAmount}`, { align: 'left' }).moveDown(1.5);
    
            // Configuración de la tabla
            const tableHeaders = ["Producto", "Cantidad", "Costo Unitario", "Subtotald"];
            const tableWidths = [150, 100, 120, 120];
            const tableHeight = 30;
            const pageWidth = 595;
            const tableWidth = tableWidths.reduce((a, b) => a + b, 0);
            const marginLeft = (pageWidth - tableWidth) / 2;
            let yPosition = doc.y + 10;
    
            // Dibujar encabezados de la tabla con bordes
            doc.font('Helvetica-Bold');
            tableHeaders.forEach((header, index) => {
                const xPosition = marginLeft + tableWidths.slice(0, index).reduce((a, b) => a + b, 0);
                doc.text(header, xPosition + 5, yPosition + 5, { width: tableWidths[index] - 10, align: 'center' });
                doc.rect(xPosition, yPosition, tableWidths[index], tableHeight).stroke();
            });
            yPosition += tableHeight;
    
            // Dibujar filas de la tabla con bordes
            doc.font('Helvetica');
            details.forEach(detalle => {
                const row = [
                    detalle.budgetDetailItem,
                    detalle.budgetDetailQuantity,
                    `$${detalle.budgetDetailUnitCost.toFixed(2)}`,
                    `$${(detalle.budgetDetailQuantity * detalle.budgetDetailUnitCost).toFixed(2)}`
                ];
    
                row.forEach((cell, index) => {
                    const xPosition = marginLeft + tableWidths.slice(0, index).reduce((a, b) => a + b, 0);
                    doc.text(cell, xPosition + 5, yPosition + 5, { width: tableWidths[index] - 10, align: 'center' });
                    doc.rect(xPosition, yPosition, tableWidths[index], tableHeight).stroke();
                });
    
                yPosition += tableHeight;
    
                // Mover a nueva página si se desborda
                if (yPosition > doc.page.height - 50) {
                    doc.addPage();
                    yPosition = 50; // Reset position en nueva página
                }
            });
    
            // Finalizar el documento
            doc.end();
        } catch (err) {
            req.logger.error("Error general:", err);
            res.status(500).json({ error: "Error al generar la factura." });
        }
    }

    async getSales(req, res) {
        try {
            const sales = await saleService.getSales();

            if (sales) {

                const formattedSales = sales.map(sale => {


                    const date = sale.saleDate
                        ? new Date(sale.saleDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                        : null;
                    return {
                        ...sale._doc,
                        saleDate: date,
                        clientId: sale.clientId ? sale.clientId.clientLastName : null,
                        userId: sale.userId ? sale.userId.userUsername : null
                    };
                });
                return res.status(200).json({ message: 'Ventas', sales: formattedSales })
            } else {
                return res.status(404).json({ message: 'Sales not found' })
            }
        } catch (error) {
            req.logger("Error general:", error);
            res.status(500).json({ error: "Error al generar la factura." });
        }

    }

    async getSalesByFilter(req, res) {
        const { userId, startDate, endDate, clientId } = req.query;

        req.logger.info("Fecha inicio desde controlador: " + startDate);
        req.logger.info("User: " + userId);
        req.logger.info("Fecha fin desde controlador: " + endDate);
        req.logger.info("clientId: " + clientId);

        try {
            // Llama al servicio con los parámetros disponibles.
            const sales = await saleService.getSalesByFilter(clientId, userId, startDate, endDate);

            console.log("Sales: ", sales);
            if (sales.length === 0) {
                return res.status(404).json({ message: "No se encuentran ventas con los datos establecidos" });
            }

            const formattedSales = sales.map(sale => {
                const date = sale.saleDate
                    ? new Date(sale.saleDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                    : null;

                return {
                    ...sale._doc,
                    saleDate: date,
                    clientId: sale.clientId ? sale.clientId.clientLastName : null,
                    userId: sale.userId ? sale.userId.userUsername : null,
                };
            });

            res.status(200).json({ sales: formattedSales });
        } catch (error) {
            console.error("Error al buscar venta", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    async getSalesById(req, res) {
        const { sid } = req.params

        try {
            const sale = await saleService.getSaleById(sid);

            const formattedSale = (() => {
                const date = sale.saleDate
                    ? new Date(sale.saleDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                    : null;

                return {
                    ...sale._doc,  // Asumimos que 'sale' es un documento de Mongoose y '_doc' es la forma de acceder a los datos.
                    saleDate: date,
                    clientId: sale.clientId ? sale.clientId.clientLastName : null,
                    userId: sale.userId ? sale.userId.userUsername : null
                };
            })();

            console.log("sale: ", formattedSale);

            if (!sale) {
                return res.status(404).json({ message: "Sale not found", sale })
            }

            return res.status(200).json({ message: "Sale", sale: formattedSale })
        } catch (error) {
            console.error("Error al buscar venta", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
}