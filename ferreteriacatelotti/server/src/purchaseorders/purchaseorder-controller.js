import { PurchaseOrderService } from "./purchaseorder-service.js";
import { ProductService } from "../products/product-service.js";
import {DetailOrderService} from "../detailorder/detailorder-service.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
const purchaseOrderService = new PurchaseOrderService();
const detailOrderService = new DetailOrderService();
const productService = new ProductService();
export class PurchaseOrderController {

    async createPurchaseOrder(req, res) {

        const { purchaseOrderDate, purchaseOrderAmount, purchaseOrderStatus, supplierID } = req.body;

        try {

            const newPurchaseOrder = {
                purchaseOrderDate,
                purchaseOrderStatus,
                supplierID,
            }

            const purchaseOrder = await purchaseOrderService.createPurchaseOrder(newPurchaseOrder);

            if (purchaseOrder) {
                res.status(201).json({
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
        const { purchaseOrderDate, purchaseOrderAmount, purchaseOrderStatus, supplierID, detalleIds} = req.body;

        try {

            console.log("Fecha: ", purchaseOrderDate);



            const updateData = {
                purchaseOrderDate,
                purchaseOrderAmount,
                purchaseOrderStatus,
                supplierID
            };

            

            console.log("updateData: ", updateData);
            console.log(" Detalle ids: ", detalleIds);
            

            const updatedOrder = await purchaseOrderService.updatePurchaseOrder(id, updateData);

            if (purchaseOrderStatus === "Recibido") {
                const detailOrders = detalleIds;

                // Iterar sobre cada detalle y actualizar el stock del producto
                for (const detail of detailOrders) {
                    console.log(detail);
                    
                    const detailOrder = await detailOrderService.getDetailOrderById(detail)

                    req.logger.info("detail order: " + detailOrder)
                    const product = await productService.getProductById(detailOrder.productID);

                    if (product && detailOrder) {
                        product.productStock += detailOrder.detailOrderQuantity; // Sumar la cantidad al stock
                        await productService.updateProductStock(product._id, product.productStock); // Guardar cambios
                        console.log(`Stock actualizado para el producto ${product.name}: Nuevo stock ${product.stock}`);
                    } else {
                        console.warn(`Producto con ID ${detail.productID} no encontrado`);
                    }
                }
            }

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
                res.status(200).json({ message: "Orden elimnada con exito", deletePurchaseOrder });
            } else {
                res.status(404).json({ message: "Pedido de compra no encontrado" });
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
}