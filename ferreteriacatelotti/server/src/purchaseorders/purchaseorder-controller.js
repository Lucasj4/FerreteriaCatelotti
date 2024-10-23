import { PurchaseOrderService } from "./purchaseorder-service.js";

const purchaseOrderService = new PurchaseOrderService();

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
                const formattedPurchaseOrders = purchaseOrders.map(order => ({
                    ...order._doc, // mantener los demás campos
                    purchaseOrderDate: order.purchaseOrderDate 
                        ? new Date(order.purchaseOrderDate).toLocaleDateString('es-ES') 
                        : null // Formato español día/mes/año
                }));
    
                return res.status(200).json({ message: "Pedidos de compra", purchaseOrders: formattedPurchaseOrders });
            } else {
                return res.status(404).json({ message: "Pedidos de compra no encontrados" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async getPurchaseOrderWithDetails(req, res) {
        const { purchaseOrderId } = req.params; // Suponiendo que el ID se pasa como un parámetro de ruta

        try {
            const result = await purchaseOrderService.getPurchaseOrderWithDetails(purchaseOrderId);

            if (result.error) {
                return res.status(404).json({ message: result.error });
            }

            // Responde con el pedido de compra y sus detalles
            res.status(200).json({
                purchaseOrder: result.purchaseOrder,
                detailOrders: result.detailOrders // Incluye los detalles en la respuesta
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el pedido de compra con detalles" });
        }
    }

    async getPurchaseOrdersBySupplierAndDate(req, res) {
        try {
            const { suppliers, startDate, endDate, estado } = req.query;
            req.logger.info("StartData: " + startDate);
            req.logger.info("EndDate: " + endDate);
            req.logger.info("Suppliers: " + suppliers);
            req.logger.info("Estado: " + estado);

            const supplierIds = suppliers ? suppliers.split(",") : [];
            const purchaseOrders = await purchaseOrderService.getPurchaseOrdersByFilters(supplierIds, startDate, endDate, estado);

        
            if (purchaseOrders.length > 0) {
                const formattedPurchaseOrders = purchaseOrders.map(order => ({
                    ...order._doc, // mantener los demás campos
                    purchaseOrderDate: order.purchaseOrderDate 
                        ? new Date(order.purchaseOrderDate).toLocaleDateString('es-ES') 
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
}