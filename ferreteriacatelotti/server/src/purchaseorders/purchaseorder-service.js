import PurchaseOrderModel from './purchaseorder-model.js'

export class PurchaseOrderService{
    
    async createPurchaseOrder(order){
        try {
            const newOrder = new PurchaseOrderModel(order);
            return await newOrder.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}