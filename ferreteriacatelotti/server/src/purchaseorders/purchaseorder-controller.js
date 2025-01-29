import { PurchaseOrderService } from "./purchaseorder-service.js";
import { ProductService } from "../products/product-service.js";
import { DetailOrderService } from "../detailorder/detailorder-service.js";
import PDFDocument from "pdfkit";
import fs from "fs";

import path from "path";
const purchaseOrderService = new PurchaseOrderService();
const detailOrderService = new DetailOrderService();
const productService = new ProductService();


export class PurchaseOrderController {

    async createPurchaseOrder(req, res) {

        const { purchaseOrderDate, purchaseOrderAmount, purchaseOrderStatus, supplierID } = req.body;
        const userId = req.user.user._id



        try {
            
            const currentDate = new Date(); 
            const inputDate = new Date(purchaseOrderDate); 

           
            if (inputDate.setUTCHours(0, 0, 0, 0) < currentDate.setUTCHours(0, 0, 0, 0)) {
                return res.status(400).json({
                    error: "La fecha del pedido no puede ser anterior al día de hoy."
                });
            }

            const newPurchaseOrder = {
                purchaseOrderDate,
                purchaseOrderStatus,
                supplierID,
                userId
            }

            const purchaseOrder = await purchaseOrderService.createPurchaseOrder(newPurchaseOrder);

            if (purchaseOrder) {
                return res.status(201).json({
                    message: "Pedido de compra creado con exito",
                    purchaseOrder
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

    }

    async getPurchaseOrders(req, res) {
        try {
            req.logger.info("Desde controller de PurchaseOrders");
            const purchaseOrders = await purchaseOrderService.getPurchaseOrders();

            if (purchaseOrders) {
                // Formatear las fechas a día/mes/año
                const formattedPurchaseOrders = purchaseOrders.map(order => {
                    const date = order.purchaseOrderDate
                        ? new Date(order.purchaseOrderDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                        : null;

                    return {
                        ...order._doc,
                        purchaseOrderDate: date
                    };
                });

                return res.status(200).json({ message: "Pedidos de compra", purchaseOrders: formattedPurchaseOrders });
            } else {
                return res.status(404).json({ message: "Pedidos de compra no encontrados" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async getPurchaseOrderWithDetails(req, res) {
        const { pid } = req.params;  // Suponiendo que el ID se pasa como un parámetro de ruta
        console.log("PID: ", pid);

        req.logger.info("Desde controller getPurchaseOrderWithDetails");
        try {
            const result = await purchaseOrderService.getPurchaseOrderWithDetails(pid);

            req.logger.info("Resultado: " + result);
            if (result.error) {
                return res.status(404).json({ message: result.error });
            }

            // Formatear la fecha del pedido de compra a día/mes/año
            const formattedPurchaseOrder = {
                ...result.purchaseOrder._doc, // Mantener los demás campos
                purchaseOrderDate: result.purchaseOrder.purchaseOrderDate
                    ? new Date(result.purchaseOrder.purchaseOrderDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                    : null // Formato español día/mes/año
            };

            // Responde con el pedido de compra formateado y sus detalles
            res.status(200).json({
                purchaseOrder: formattedPurchaseOrder,
                detailOrders: result.detailOrders // Incluye los detalles en la respuesta
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el pedido de compra con detalles" });
        }
    }


    async getPurchaseOrdersBySupplierAndDate(req, res) {
        try {
            const { supplier, startDate, endDate, estado } = req.query;

            req.logger.info("Query Params: ", req.query);
            req.logger.info("StartData: " + startDate);
            req.logger.info("EndDate: " + endDate);
            req.logger.info("Proveedor: " + supplier);
            req.logger.info("Estado: " + estado);


            const purchaseOrders = await purchaseOrderService.getPurchaseOrdersByFilters(supplier, startDate, endDate, estado);

            console.log("Purchase orders: ", purchaseOrders);


            if (purchaseOrders.length > 0) {
                const formattedPurchaseOrders = purchaseOrders.map(order => ({
                    ...order._doc, // mantener los demás campos
                    purchaseOrderDate: order.purchaseOrderDate
                        ? new Date(order.purchaseOrderDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })
                        : null // Formato español día/mes/año
                }));

                return res.status(200).json({ message: "Pedidos de compra filtrados", purchaseOrders: formattedPurchaseOrders });
            } else {
                return res.status(404).json({ message: "No se encontraron pedidos de compra en el rango proporcionado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", error });
        }
    }

    async updatePurchaseOrder(req, res) {
        const { id } = req.params;
        const { purchaseOrderDate, purchaseOrderAmount, purchaseOrderStatus, supplierID, detalleIds } = req.body;

        try {

            const existingPurchaseOrder = await purchaseOrderService.getPurchaseOrderById(id);

            if (existingPurchaseOrder.purchaseOrderStatus === "Recibido") {
                return res.status(409).json({
                    message: "No se puede modificar el pedido de compra porque ya se encuentra en estado 'Recibido'.",
                });
            }

            const updateData = {
                purchaseOrderDate,
                purchaseOrderAmount,
                purchaseOrderStatus,
                supplierID
            };

            const updatedOrder = await purchaseOrderService.updatePurchaseOrder(id, updateData);

            if (updatedOrder) {

                res.status(200).json({
                    message: "Pedido de compra actualizado con éxito",
                    updatedOrder
                });
            } else {
                res.status(404).json({ message: "Pedido de compra no encontrado" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async deletePurchaseOrder(req, res) {
        const { id } = req.params;

        req.logger.info("Id de pedido de compra para eliminar: " + id)

        try {
            const deletePurchaseOrder = await purchaseOrderService.deletePurchaseOrder(id);


            if (deletePurchaseOrder) {
                return res.status(200).json({ message: "Orden elimnada con exito", deletePurchaseOrder });
            } else {
                return res.status(404).json({ message: "Pedido de compra no encontrado" });
            }
        } catch (error) {
            console.error("Error al eliminar el presupuesto:", error);
            res.status(500).json({ message: "Error en el servidor al eliminar el presupuesto" });
        }
    }
    async downloadPurchaseOrder(req, res) {
        const { pid } = req.params; // ID de la orden de compra
        try {
            // Obtén los datos del pedido y sus detalles
            const result = await purchaseOrderService.getPurchaseOrderWithDetails(pid);

            if (result.error) {
                return res.status(404).json({ message: result.error });
            }

            const { purchaseOrder, detailOrders } = result;

            // Crear un nuevo documento PDF
            const doc = new PDFDocument();
            const filePath = path.join(__dirname, `purchaseOrder_${pid}.pdf`);
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);

            // Información general del pedido de compra
            doc
                .fontSize(20)
                .text("Orden de Compra", { align: "center" })
                .moveDown(2)
                .fontSize(12)
                .text(`ID del Pedido: ${purchaseOrder._id}`)
                .text(`Fecha: ${new Date(purchaseOrder.purchaseOrderDate).toLocaleDateString("es-ES")}`)
                .text(`Estado: ${purchaseOrder.purchaseOrderStatus}`)
                .text(`Proveedor: ${purchaseOrder.supplierID}`)
                .moveDown();

            // Agregar tabla de detalles del pedido
            doc.fontSize(14).text("Detalles del Pedido").moveDown();
            detailOrders.forEach((detail, index) => {
                doc
                    .fontSize(12)
                    .text(`Producto: ${detail.detailOrderProduct}`)
                    .text(`Cantidad: ${detail.detailOrderQuantity}`)
                    .text(`Precio Unitario: ${detail.detailOrderUnitCost}`)
                    .moveDown();
            });

            doc.end();

            // Cuando se finaliza la creación del archivo
            writeStream.on("finish", () => {
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename=purchaseOrder_${pid}.pdf`
                );

                fs.createReadStream(filePath).pipe(res);
            });

            // Manejar errores
            writeStream.on("error", (error) => {
                console.error("Error al generar PDF:", error);
                res.status(500).json({ message: "Error al generar el archivo PDF" });
            });
        } catch (error) {
            console.error("Error al descargar el PDF:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getPurchaseOrderById(req, res) {
        const { id } = req.params;
        try {
            const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(id);

            if (!purchaseOrder) {
                return res.status(404).json({ message: "Pedido de compra no encontrado" });
            }

            return res.status(200).json({ purchaseOrder });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async printPurchaseOrder(req, res) {
        const { amount, date, supplier, details } = req.body;



        console.log('Datos recibidos:', req.body);

        if (!supplier || !amount || !date || !details) {
            return res.status(400).json({ error: "Faltan datos necesarios" });
        }



        try {



            const doc = new PDFDocument();

            // Separar un poco más la fecha y el cliente
            doc.fontSize(14).text(`Fecha: ${date}`, { align: 'left' }).moveDown(0.5);
            doc.text(`Proveedor: ${supplier}`, { align: 'left' }).moveDown(0.5);

            // Ajustar un poco más la separación entre "Total" y las demás líneas
            doc.text(`Total: $${amount}`, { align: 'left' }).moveDown(1.5);

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

            // Dibujar las cabeceras de la tablad 
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

        } catch (err) {
            console.error("Error general:", err);
            res.status(500).json({ error: "Error al generar la factura." });
        }
    }
}