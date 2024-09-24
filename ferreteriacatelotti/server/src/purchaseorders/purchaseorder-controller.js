import { PurchaseOrderService } from "./purchaseorder-service.js";

const purchaseOrderService = new PurchaseOrderService();

export class PurchaseOrderController{
    
    async createPurchaseOrder(req, res){

        const {purchaseOrderDate, purchaseOrderAmount, purchaseOrderStatus,  supplierID} = req.body;

        try {
            
            const newPurchaseOrder = {
                purchaseOrderDate,
                purchaseOrderStatus,
                supplierID,
            }

            const purchaseOrder = await purchaseOrderService.createPurchaseOrder(newPurchaseOrder);

            if(purchaseOrder){
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
}