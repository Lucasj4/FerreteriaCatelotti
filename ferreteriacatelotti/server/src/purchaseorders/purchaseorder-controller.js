import { PurchaseOrderService } from "./purchaseorder-service.js";
import { ProductService } from "../products/product-service.js";
import { DetailOrderService } from "../detailorder/detailorder-service.js";
import { ProductController } from "../products/product-controller.js";
import {SupplierService} from "../suppliers/supplier-service.js"
import PDFDocument from "pdfkit";
import fs from "fs";

import path from "path";
const purchaseOrderService = new PurchaseOrderService();
const supplierService = new SupplierService();
const detailOrderService = new DetailOrderService();
const productService = new ProductService();
const productController = new ProductController();

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
        

        
        try {
            const result = await purchaseOrderService.getPurchaseOrderWithDetails(pid);

           
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

            const detailOrdersWithUnits = await Promise.all(
                result.detailOrders.map(async (detail) => {
                    const productUnit = await productController.getProductUnitByProductId(detail.productID);
                    return {
                        ...detail._doc, 
                        productUnit: productUnit || "Unidad no encontrada"
                    };
                })
            );
            

            req.logger.info("Details order: " + JSON.stringify(result.detailOrders, null, 2));


            // Responde con el pedido de compra formateado y sus detalles
            res.status(200).json({
                purchaseOrder: formattedPurchaseOrder,
                detailOrders: detailOrdersWithUnits // Incluye los detalles en la respuesta
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el pedido de compra con detalles" });
        }
    }


    async getPurchaseOrdersBySupplierAndDate(req, res) {
        try {
            const { supplier, startDate, endDate, estado } = req.query;


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

        req.logger.info(`supplier id: ${supplierID}`);
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
    
        const { supplierEmail, supplierLastName, supplierFirstName } = await supplierService.getById(supplier);
    
        if (!supplier || !amount || !date || !details) {
            return res.status(400).json({ error: "Faltan datos necesarios" });
        }
    
        try {
            const doc = new PDFDocument();
    
            // Formatear la fecha como DD/MM/YYYY
            const formattedDate = new Date(date).toLocaleDateString('es-ES');
    
            // Encabezado
            doc.fontSize(16).text('Pedido de Compra', { align: 'center' }).moveDown(1);
    
            // Configuración de márgenes y ancho de tabla
            const pageWidth = 595;
            const tableWidths = [100, 100, 100, 100];
            const tableWidth = tableWidths.reduce((a, b) => a + b, 0);
            const marginLeft = (pageWidth - tableWidth) / 2;
    
            // Datos del proveedor y fecha
            const startY = doc.y;
            doc.fontSize(12)
                .text(`Proveedor: ${supplierFirstName} ${supplierLastName}`, marginLeft, startY)
                .text(`Correo: ${supplierEmail}`, marginLeft, startY + 15);
            doc.text(`Fecha: ${formattedDate}`, marginLeft + tableWidth - 100, startY);
    
            // Espacio adicional antes de la tabla
            doc.moveDown(5);
    
            // Cabecera de la tabla
            const tableTop = doc.y;
            const rowHeight = 30;
            const marginExtra = 2;
    
            doc.font('Helvetica-Bold')
                .text('Producto', marginLeft, tableTop, { width: tableWidths[0], align: 'center' })
                .text('Cantidad', marginLeft + tableWidths[0], tableTop, { width: tableWidths[1], align: 'center' })
                .text('Costo Unitario', marginLeft + tableWidths[0] + tableWidths[1], tableTop, { width: tableWidths[2], align: 'center' })
                .text('Total', marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2], tableTop, { width: tableWidths[3], align: 'center' });
    
            doc.moveTo(marginLeft, tableTop + rowHeight)
                .lineTo(marginLeft + tableWidth, tableTop + rowHeight)
                .stroke();
    
            let yPosition = tableTop + rowHeight + 5;
    
            // Dibujar cada fila de la tabla
            details.forEach(detalle => {
                const productYPosition = yPosition + (rowHeight - 12) / 2;
    
                doc.font('Helvetica')
                    .text(detalle.producto, marginLeft, productYPosition, { width: tableWidths[0], align: 'center' })
                    .text(detalle.cantidad, marginLeft + tableWidths[0], productYPosition, { width: tableWidths[1], align: 'center' })
                    .text(`$${detalle.costoUnitario.toFixed(2)}`, marginLeft + tableWidths[0] + tableWidths[1], productYPosition, { width: tableWidths[2], align: 'right' })
                    .text(`$${detalle.total.toFixed(2)}`, marginLeft + tableWidths[0] + tableWidths[1] + tableWidths[2], productYPosition, { width: tableWidths[3], align: 'right' });
    
                yPosition += rowHeight + marginExtra;
    
                doc.moveTo(marginLeft, yPosition)
                    .lineTo(marginLeft + tableWidth, yPosition)
                    .stroke();
            });
    
            // Total final justo debajo de la tabla
            const finalYPosition = yPosition + 10;
            doc.font('Helvetica-Bold')
                .text(`Total: $${amount.toFixed(2)}`, marginLeft, finalYPosition, { align: 'right', width: tableWidth });
    
            // Configuración para descargar el PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=pedido_compra.pdf');
    
            doc.pipe(res);
            doc.end();
        } catch (err) {
            console.error("Error general:", err);
            res.status(500).json({ error: "Error al generar la factura." });
        }
    }
    
    
    
    
} 