import { SaleService } from "./sale-service.js";
import { generateInvoiceNumber } from "../utils/geneteinvoicenumber.js";
const saleService = new SaleService();
export class SaleController {

    async addSale(req, res){

        const {saleDate, saleTotalAmount,  invoiceType, clientId } = req.body;
        const userId = req.user.user._id;

        const invoiceNumber = generateInvoiceNumber();

        try {
            const newSale = {
                invoiceNumber,
                saleDate,
                saleTotalAmount,
                invoiceType,
                clientId,
                userId
            }

            const sale = await saleService.addSale(newSale);

            if(sale){
                return res.status(201).json({message: "Venta agregada", sale});
            }


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

    }

    async printInvoice(req, res){
        const { saleTotalAmount, saleDate, client, details } = req.body;

        

        if (!client || !saleTotalAmount || !saleDate || !invoiceNumber) {
            return res.status(400).json({ error: "Faltan datos necesarios" });
        }

        try {
            const doc = new PDFDocument();

            // Cabecera del PDF
            doc.fontSize(14).text(`Factura de venta No. ${invoiceNumber}`, { align: 'right' });

            // Separar un poco más la fecha y el cliente
            doc.fontSize(14).text(`Fecha: ${saleDate}`, { align: 'left' }).moveDown(0.5);
            doc.text(`Cliente: ${client}`, { align: 'left' }).moveDown(0.5);

            // Ajustar un poco más la separación entre "Total" y las demás líneas
            doc.text(`Total: $${saleTotalAmount}`, { align: 'left' }).moveDown(1.5);

            // Espacio para separar de la cabecera
            doc.moveDown();

            // Definir columnas de la tabla
            const tableHeaders = ["Producto", "Cantidad", "Costo Unitario", "Total"];
            const tableWidths = [100, 100, 100, 100]; // Anchos de las columnas (asegurarse que esta variable existe)

            const pageWidth = 595;  // Ancho de la página en PDF (tamaño carta)
            const tableWidth = tableWidths.reduce((a, b) => a + b, 0);  // Ancho total de la tabla, sumando los anchos de las columnas
            const marginLeft = (pageWidth - tableWidth) / 2;  // Centrar la tabla horizontalmente

            const tableTop = doc.y;
            const rowHeight = 30; // Altura fija de cada fila
            const marginExtra = 2; // Margen extra entre filas para espacio adicional

            // Dibujar las cabeceras de la tabla
            doc.font('Helvetica-Bold')
                .text(tableHeaders[0], marginLeft, tableTop, { width: tableWidths[0], align: 'center' })
                .text(tableHeaders[1], marginLeft + tableWidths[0], tableTop, { width: tableWidths[1], align: 'center' })
                .text(tableHeaders[2], marginLeft + tableWidths[0] + tableWidths[1], tableTop, { width: tableWidths[2], align: 'center' })
                .text(tableHeaders[3], marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2], tableTop, { width: tableWidths[3], align: 'center' });

            // Dibujar la línea que separa las cabeceras del resto de la tabla
            doc.moveTo(marginLeft, tableTop + rowHeight)
                .lineTo(marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2] + tableWidths[3], tableTop + rowHeight)
                .stroke();

            // Ajustar la posición 'y' después de la cabecera
            let yPosition = tableTop + rowHeight + 5; // Fija la posición 'y' para la primera fila

            // Dibujar cada fila de la tabla
            details.forEach(detalle => {
                const productYPosition = yPosition + (rowHeight - 12) / 2; // Centro verticalmente (12 es el tamaño de fuente)

                // Dibujar los datos de la fila con centrado vertical y horizontal
                doc.font('Helvetica')
                    .text(detalle.producto, marginLeft, productYPosition, { width: tableWidths[0], align: 'center' })
                    .text(detalle.cantidad, marginLeft + tableWidths[0], productYPosition, { width: tableWidths[1], align: 'center' })
                    .text(`$${detalle.costoUnitario.toFixed(2)}`, marginLeft + tableWidths[0] + tableWidths[1], productYPosition, { width: tableWidths[2], align: 'right' })
                    .text(`$${detalle.total.toFixed(2)}`, marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2], productYPosition, { width: tableWidths[3], align: 'right' });

                // Mover la posición 'y' después de cada fila, considerando margen extra
                yPosition += rowHeight + marginExtra;

                // Dibujar una línea después de cada fila
                doc.moveTo(marginLeft, yPosition)
                    .lineTo(marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2] + tableWidths[3], yPosition)
                    .stroke();
            });

            // Finalizar el documento y enviarlo como respuesta
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');


            doc.pipe(res);
            doc.end();

            return res.status(200).json({
                Invoice:{
                    invoiceNumber,
                    saleDate
                }
            })

        } catch (err) {
            req.logger.error("Error general:", err);
            res.status(500).json({ error: "Error al generar la factura." });
        }
    }

    async getSales (req, res){
        try {
            const sales = await saleService.getSales();
            req.logger.info('sales: ' + sales);
            if(sales){

                const formattedSales = sales.map(sale => {


                    const date = sale.saleDate
                        ? new Date(sale.saleDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                        : null;
                    return {
                        ...sale._doc,
                        saleDate: date,
                        clientId: sale.clientId ? sale.clientId.clientLastName : null,
                        userId: sale.userId ? sale.userId.userUsername: null
                    };
                });
                return res.status(200).json({message: 'Ventas', sales: formattedSales})
            }else{
                return res.status(404).json({message: 'Sales not found'})
            }
        } catch (error) {
            req.logger("Error general:", error);
            res.status(500).json({ error: "Error al generar la factura." });
        }
       
    }
}