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

    async getPurchaseOrderById(id){
        try {
            const purchaseOrder = await PurchaseOrderModel.findById(id);
            return purchaseOrder
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

    async getPurchaseOrdersByFilters(supplier, startDate, endDate, estado) {
        const query = {};

        if (supplier) {
            query.supplierID = supplier; // Filtrar por proveedores
        }

        if (startDate && endDate) {
            const parsedStartDate = new Date(startDate);
            parsedStartDate.setUTCHours(0, 0, 0, 0); // Comienza el día en UTC 00:00:00
        
            const parsedEndDate = new Date(endDate);
            parsedEndDate.setUTCHours(23, 59, 59, 999); 
            
            query.purchaseOrderDate = {
                $gte: parsedStartDate,
                $lte: parsedEndDate,
            }; // Filtrar por rango de fechas
        }

        if (estado) {
            query.purchaseOrderStatus = estado; // Filtrar por estado
        }

        return await PurchaseOrderModel.find(query).exec(); // Obtener las órdenes de compra que cumplen los criterios
    }

    async updatePurchaseOrder(orderId, updateData) {
        try {
            const updatedOrder = await PurchaseOrderModel.findByIdAndUpdate(orderId, updateData, { new: true }); // new: true devuelve el documento actualizado
            return updatedOrder;
        } catch (error) {
            console.error(error);
            throw error; // Lanza el error para que lo maneje el controlador
        }
    }

    async deletePurchaseOrder(purchaseOrderId){
        try {
            const deletePurchaseOrder = await PurchaseOrderModel.findByIdAndDelete(purchaseOrderId);

            const deleteDetailsOrder = await DetailOrderModel.deleteMany({purchaseOrderID: purchaseOrderId});

            return {deletePurchaseOrder, deleteDetailsOrder}
        } catch (error) {
            console.error(error);
            throw error; // Lanza el error para que lo maneje el controlador
        }
    }
}