import PurchaseOrderModel from './purchaseorder-model.js'
import DetailOrderModel from '../detailorder/detailorder-model.js'
export class PurchaseOrderService {

    async createPurchaseOrder(order) {
        try {
            const newOrder = new PurchaseOrderModel(order);
            return await newOrder.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getPurchaseOrders() {
        try {
            const purchaseOrders = await PurchaseOrderModel.find();
            return purchaseOrders;
        } catch (error) {
            throw error;
        }
    }

    async getPurchaseOrderWithDetails(purchaseOrderId) {
        try {
            // Primero, consulta el pedido de compra para verificar que existe
            const purchaseOrder = await PurchaseOrderModel.findById(purchaseOrderId).exec();

            if (!purchaseOrder) {
                return { error: "Pedido de compra no encontrado" };
            }

            // Luego, consulta todos los detalles asociados a este pedido de compra
            const detailOrders = await DetailOrderModel.find({ purchaseOrderID: purchaseOrderId }).exec();

            // Devuelve el pedido de compra y sus detalles
            return { purchaseOrder, detailOrders };
        } catch (error) {
            console.error(error);
            return { error: "Error al obtener el pedido de compra con detalles" };
        }
    }

    async getPurchaseOrdersByFilters(supplierIds, startDate, endDate, estado) {
        const query = {};

        if (supplierIds.length > 0) {
            query.supplierID = { $in: supplierIds }; // Filtrar por proveedores
        }

        if (startDate && endDate) {
            query.purchaseOrderDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }; // Filtrar por rango de fechas
        }

        if (estado) {
            query.purchaseOrderStatus = estado; // Filtrar por estado
        }

        return await PurchaseOrderModel.find(query).exec(); // Obtener las órdenes de compra que cumplen los criterios
    }
}