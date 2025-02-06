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

    async getSalesCount(req, res) {
        try {
            const count = await saleService.getSalesCount();
            return res.status(200).json({ count });
        } catch (error) {
            console.error("Error al obtener la cantidad de ventas:", error);
            res.status(500).json({ error: "Error al obtener la cantidad de ventas" });
        }
    }
    

    async printInvoiceSale(req, res) {
        const { saleTotalAmount, saleDate, client, details, invoiceNumber} = req.body;
    
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
            const leftColumnX = 50; // Coordenada X para el lado izquierdo
            const rightColumnX = 400; // Coordenada X para el lado derecho
            let y = 50; // Coordenada Y inicial
    
            // Columna izquierda
            doc.fontSize(14).text(`Ferreteria Catelotti`, leftColumnX, y);
            y += 20; 
            doc.text(`Alvear 701, E3202 Concordia, Entre Ríos`, leftColumnX, y);
            y += 20; 
            doc.text(`0345 422-6439`, leftColumnX, y);
    
            // Columna derecha
            y = 50; 
            doc.fontSize(14).text(`Factura No. ${invoiceNumber}`, rightColumnX, y, { align: 'right' });
            y += 35; 
            doc.text(`Fecha: ${saleDate}`, rightColumnX, y, { align: 'right' });
    
            // Espacio entre las secciones
            y += 60;
    
            // Sección "Facturar a" y "Enviar a"
            const sectionSpacing = 100;
            doc.font('Helvetica-Bold');
            doc.text('Facturar a:', leftColumnX, y);
            doc.text('Enviar a:', rightColumnX, y, { align: 'right' });
    
            y += 20;
            doc.font('Helvetica');
            doc.text('Ferreteria Catelotti', leftColumnX, y); // Datos de "Facturar a"
            doc.text('Alvear 701, E3202 Concordia, Entre Ríos', leftColumnX, y + 15);
            doc.text('0345 422-6439', leftColumnX, y + 30);
    
            doc.text(`${client}`, rightColumnX, y, { align: 'right' }); // Datos de "Enviar a"
            // doc.text(shippingInfo.address, rightColumnX, y + 15, { align: 'right' });
            // doc.text(shippingInfo.city, rightColumnX, y + 30, { align: 'right' });
    
            // Espacio para la tabla
            y += sectionSpacing;
    
            // Configuración de la tabla (igual que antes)
            const tableHeaders = ["Producto", "Cantidad", "Costo Unitario", "Subtotal"];
            const tableWidths = [150, 100, 120, 120];
            const tableHeight = 30;
            const pageWidth = 595;
            const tableWidth = tableWidths.reduce((a, b) => a + b, 0);
            const marginLeft = (pageWidth - tableWidth) / 2;
            let yPosition = y;
    
            // Dibujar encabezados de la tabla con bordes
            doc.font('Helvetica-Bold');
            tableHeaders.forEach((header, index) => {
                const xPosition = marginLeft + tableWidths.slice(0, index).reduce((a, b) => a + b, 0);
                doc.text(header, xPosition + 5, yPosition + 5, { width: tableWidths[index] - 10, align: 'center' });
                doc.rect(xPosition, yPosition, tableWidths[index], tableHeight).stroke();
            });
            yPosition += tableHeight;
    
            const totalRows = 9;
            const emptyRows = Math.max(0, totalRows - details.length);
    
            // Detalles y filas vacías
            doc.font('Helvetica');
            [...details, ...Array(emptyRows).fill({ budgetDetailItem: "", budgetDetailQuantity: "", budgetDetailUnitCost: "", budgetDetailSubtotal: "" })]
                .slice(0, totalRows) // Asegurar máximo de filas
                .forEach(detalle => {
                    const row = [
                        detalle.budgetDetailItem || "", // Si no hay item, queda vacío
                        detalle.budgetDetailQuantity || "", // Si no hay cantidad, queda vacío
                        detalle.budgetDetailUnitCost !== '' 
                            ? `$${detalle.budgetDetailUnitCost}`
                            : "", // Si no hay costo unitario, queda vacío
                        detalle.budgetDetailQuantity && detalle.budgetDetailUnitCost
                            ? `$${(detalle.budgetDetailQuantity * detalle.budgetDetailUnitCost)}`
                            : "" // Si no hay cantidad o costo unitario, queda vacío
                    ];
    
                    row.forEach((cell, index) => {
                        const xPosition = marginLeft + tableWidths.slice(0, index).reduce((a, b) => a + b, 0);
                        doc.text(cell, xPosition + 5, yPosition + 5, { width: tableWidths[index] - 10, align: 'center' });
                        doc.rect(xPosition, yPosition, tableWidths[index], tableHeight).stroke();
                    });
    
                    yPosition += tableHeight;
                   
                    if (yPosition > doc.page.height - 100) { // Espacio adicional para el total
                        doc.addPage();
                        yPosition = 50; // Reiniciar posición en nueva página
                    }
                });
                
                yPosition += 20; // Cambia este valor para reducir o aumentar el espacio
                const totalTextX = 400; // Posición X del total
                doc.font('Helvetica-Bold').fontSize(12).text(`Total: $${saleTotalAmount.toFixed(2)}`, totalTextX, yPosition, { align: 'right' });
    
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