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
        const { purchaseOrderDate, purchaseOrderAmount, purchaseOrderStatus, supplierID } = req.body;
    
        try {

            console.log("Fecha: ", purchaseOrderDate);
            
           
    
            const updateData = {
                purchaseOrderDate,
                purchaseOrderAmount,
                purchaseOrderStatus,
                supplierID
            };
            
            console.log("updateData: ", updateData);
            
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
}